import { Route, Routes } from "react-router-dom";
import { ProductCard } from "./components/ProductCard";
import { useState } from "react";
import { PaymentSuccess } from "./components/PaymentSuccess";
import { PaymentCancel } from "./components/PaymentCancel"
import Pricing from "./components/Pricing";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from './components/stripe'
import { PreAuthCard } from './components/PreAuthCard'

export default function App() {
    const navigate = useNavigate();

  const [gateway, setGateway] = useState(null);
  const subscribe = () => {
    navigate("/pricing");
  }
  const plans = [
    {
      id: "basic",
      name: "Basic Outlook",
      price: 499,
      unit: 1,
      description: "Email + calendar essentials",
    },
    {
      id: "standard",
      name: "Standard Outlook",
      price: 999,
      unit: 1,
      description: "Advanced productivity tools",
    },
    {
      id: "pro",
      name: "Pro Outlook",
      price: 1999,
      unit: 1,
      description: "Enterprise-grade collaboration",
    },
  ];

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <h2 className="flex justify-center text-blue-600/100">Welcome to the Stripe Plans</h2>
            <div className="gap-6 flex items-center justify-center">
              {plans.map((plan) => (
                <ProductCard
                  key={plan.id}
                  id={plan.id}
                  name={plan.name}
                  price={plan.price}
                  unit={plan.unit ?? 1}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={()=> subscribe()}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
              >
                Subscribe
              </button>
            </div>


          </div>
        }
      />
      <Route path="/success" element={<PaymentSuccess />}></Route>
      <Route path="/cancel" element={<PaymentCancel />}></Route>
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/pre-auth" element={<Elements stripe={stripePromise}>
        <PreAuthCard />
      </Elements>}></Route>
    </Routes>
  );
}
