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

app.post('/checkout-session', async (req, res) => {
  console.log('checkout-session has started')
  const { amountId, quantity, currency, card, email } = req.body;

    const idempotencyKey = `${uuidv4()}`;

  const session = await stripe.checkout.sessions.create({

    line_items: [
      {
        price: 'price_1SnaEaDioPWQA6Dk7XpA1zhH',
        quantity: 2,
      },
    ],
    mode: 'payment',
     success_url: `${process.env.HOST}:${process.env.UI_PORT}/success`,
    cancel_url: `${process.env.HOST}:${process.env.UI_PORT}/cancel`,
    idempotencyKey,
  });

  console.log('SESSION', session)
  res.redirect(303, session.url);
});

const delay = ms => new Promise(res => setTimeout(res, ms));
app.post('/checkout-session2', async (req, res) => {
  console.log('checkout-session2 has started', req.body)
  const { name, email, unit, amount } = req.body;
  await delay(10000); 
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', "amazon_pay", 'paypal'],
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
        metadata: {
          email: email || 'test@gmail.com',
          currency: "GBR"
        }
      }
    ],
    mode: 'payment',
    success_url: `${process.env.HOST}:${process.env.UI_PORT}/success`,
    cancel_url: `${process.env.HOST}:${process.env.UI_PORT}/cancel`,
  });

  console.log('SESSION',  session.url)
  // res.redirect(303, session.url);
  res.send({url: session.url});
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
