import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import cors from 'cors'
import { getUser } from "./data/user.js";
dotenv.config();

//create strip object
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

app.use(express.json()); //middleware to read body
app.use(cors()) // enable CORS for all routes

// Health check
app.get("/", (req, res) => {
  console.log("Health check endpoint hit");
  res.send("Stripe Express API is running 🚀");
});

app.get("/healthcheck", (req, res) => {
  console.log("Health check endpoint hit");
  res.status(200).send({ status: "OK", timestamp: new Date() });
});

const delay = ms => new Promise(res => setTimeout(res, ms));
/* Checkout Session : it will used to poupulate the checkout session for payment*/
app.post('/checkout-session', async (req, res) => {
  console.log('checkout-session has started', req.body)
  const { name, email, unit, amount, customerId } = req.body;
  if (!customerId) {
    return res.status(400).json({ error: "customerId is required" });
  }
  if (!amount || !unit) {
    return res.status(400).json({ error: "amount and unit are required" });
  }
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }
  console.log('Creating checkout session for:', { name, email, unit, amount, customerId });
  // await delay(10000);
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: "GBP",
          unit_amount: unit * amount,
          product_data: {
            name: name || 'name of product',
            description: `test data ${new Date()}`
          },
        },
        quantity: 1,
      }
    ],
    metadata: {
      email: email || 'test@gmail.com',
      currency: "GBR"
    },
    mode: 'payment',
    success_url: `${process.env.HOST}:${process.env.UI_PORT}/success`,
    cancel_url: `${process.env.HOST}:${process.env.UI_PORT}/cancel`,
  });

  console.log('SESSION', session.url)
  res.send({ url: session.url });
});

/** REFUND PAYMENT */
app.post("/refund-payment", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    res.json({ status: "refunded", refund });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PRE-AUTH when card is added
 * Path: /pre-auth-amount
 */
app.post("/pre-auth-amount", async (req, res) => {
  try {
    const { customerId, amount, description } = req.body;
    if (!customerId || !amount || !description) {
      return res.status(400).json({ error: "customerId, amount and description are required" });
    }
    console.log('/pre-auth-amount', req.body)
    const paymentIntent = await stripe.paymentIntents.create({
      description: description,
      amount, // pre-auth amount
      currency: "GBP",
      customer: customerId,
      capture_method: "manual", // PRE-AUTH
      setup_future_usage: "off_session", // SAVE CARD
      payment_method_types: ["card"],
    });

    // stripe.confirmCardPayment(clientSecret, {
    //   payment_method: { card }
    // });
    console.log('Create PaymmetIntent', paymentIntent);
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/** it will capture the payment for the pre-auth */
/**
 * CAPTURE (full or partial)
 * Path: /capture-pre-auth
 */
app.post("/capture-pre-auth", async (req, res) => {
  try {
    const { customerId } = req.body;
    if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }
    // get payment intent to find customer
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 100,
    });
    //get only requires_capture payment intents
    const getCaptureIntent = paymentIntents?.data
      ?.filter(pi => pi.status === 'requires_capture')
      ?.map(pi => ({
        id: pi.id,
        client_secret: pi.client_secret,
        paymentId: pi.latest_charge, // mapped paymentId
        status: pi.status,
      })) || [];
    console.log(`Found ${getCaptureIntent.length} PaymentIntents requiring capture amoung ${paymentIntents.data.length} total for customer:`, customerId);

    for (const pi of getCaptureIntent) {
      const paymentIntent = await stripe.paymentIntents.capture(
        pi.id,
        // { amountToCapture }
      );
      console.log('Captured PaymentIntent', paymentIntent);
    }
    console.log('All pending payments captured for customer:', customerId);
    res.status(200).json({ status: "success", capturedPayments: getCaptureIntent.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * RELEASE unused amount
 * Path: /release-pre-auth
 */
app.post("/release-pre-auth", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);

    res.json(paymentIntent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*--------------------------CREATE CUSTOMER-----------------------------------*/
/** CREATE/Get Customer CUSTOMER */
app.post("/get-customer", async (req, res) => {
  console.log('Vaidating customer...', req.body.email)
  try {
    const { email, name } = req.body;
    console.log('Checking existing customer for email:', email)
    const user = getUser(email);
    if (user) {
      console.log('Customer already exists', {
        customerId: user.customerId
      })
      return res.json({
        customerId: user.customerId
      });
    }

    console.log('Creating new customer for email:', email)
    const customer = await stripe.customers.create({
      email,
      name,
    });

    console.log('Returing Response', {
      customerId: customer.id
    })
    return res.json({
      customerId: customer.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/** save card */
app.post("/create-setup-intent", async (req, res) => {
  const { customerId } = req.body;

  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ["card"],
  });

  res.json({ clientSecret: setupIntent.client_secret });
});

/** A Customer Session authorizes client-side Stripe SDKs to read and 
 * act on a customer’s saved payment methods and related data. 
*/
app.post("/customer-session", async (req, res) => {
  console.log('customer-session has started', req.body)
  const { customerId } = req.body;
  if (!customerId) {
    return res.status(400).json({ error: "customerId is required" });
  }
  const customerSession = await stripe.customerSessions.create({
    customer: customerId,
    components: {
      pricing_table: {
        enabled: true,
      },
    },
  });
  console.log('Customer Session', customerSession)
  res.json({
    customerSessionId: customerSession.id,
    clientSecret: customerSession.client_secret
  });
});

app.post("/create-subscription", async (req, res) => {
  const { customerId, priceId } = req.body;

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],

    payment_behavior: "default_incomplete",
    payment_settings: {
      save_default_payment_method: "on_subscription",
    },

    expand: ["latest_invoice.payment_intent"],
  });

  res.json({
    subscriptionId: subscription.id,
    clientSecret:
      subscription.latest_invoice.payment_intent.client_secret,
  });
});


app.post("/stripe/save-card", async (req, res) => {
  try {
    console.log('creating intent to save card')
    const { customerId } = req.body;
    if (!customerId) {
      res.status(400).json({ "missing": "customerId can't be null or undefined" });
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
      usage: "off_session",
    });

    res.json({
      clientSecret: setupIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**Reterive saved card for any specific customer */
app.get("/stripe/cards/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      res.status(400).json({ "missing": "customerId can't be null or undefind" });
    }
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    const cards = paymentMethods.data.map(pm => ({
      paymentMethodId: pm.id,
      brand: pm.card.brand,
      last4: pm.card.last4,
      expMonth: pm.card.exp_month,
      expYear: pm.card.exp_year,
      funding: pm.card.funding,
    }));

    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/stripe/cards/:paymentMethodId", async (req, res) => {
  try {
    const { paymentMethodId } = req.params;

    if (!paymentMethodId) {
      res.status(400).json({ "missing": "paymentMethodId can't be null or undefind" });
    }

    await stripe.paymentMethods.detach(paymentMethodId);

    res.json({
      status: "card_removed",
      paymentMethodId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------ GLOBAL ERROR HANDLER ------------------ */
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});