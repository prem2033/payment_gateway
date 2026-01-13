import express, { json } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import cors from 'cors'
import { v4 as uuidv4 } from "uuid";

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


const delay = ms => new Promise(res => setTimeout(res, ms));
/* Checkout Session : it will used to poupulate the checkout session for payment*/
app.post('/checkout-session2', async (req, res) => {
  console.log('checkout-session2 has started', req.body)
  const { name, email, unit, amount } = req.body;
  // await delay(10000);
  const session = await stripe.checkout.sessions.create({
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
    const { customerId, amount } = req.body;
    console.log('/pre-auth-amount', req.body)
    const paymentIntent = await stripe.paymentIntents.create({
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


/**
 * CAPTURE (full or partial)
 * Path: /payment-pre-auth
 */
app.post("/payment-pre-auth", async (req, res) => {
  try {
    const { paymentIntentId, amountToCapture } = req.body;

    const paymentIntent = await stripe.paymentIntents.capture(
      paymentIntentId,
      { amountToCapture }
    );

    res.json(paymentIntent);
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

/** CREATE CUSTOMER */
app.post("/create-customer", async (req, res) => {
  console.log('Creating customer...', req.body)
  try {
    const { email, name, metadata } = req.body;

    const customer = await stripe.customers.create({
      email,
      name,
    });

    console.log('Returing Response', {
      customerId: customer.id
    })
    res.json({
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});