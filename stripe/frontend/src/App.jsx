import { Route, Routes } from "react-router-dom";
import { ProductCard } from "./components/ProductCard";
import { useState, createContext, useEffect } from "react";
import { PaymentSuccess } from "./components/PaymentSuccess";
import { PaymentCancel } from "./components/PaymentCancel";
import Pricing from "./components/Pricing";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./components/stripe";
import { PreAuthCard } from "./components/PreAuthCard";
import { getUser } from "./data/User";
import axios from "axios";
import { SaveCardWrapper } from './components/SaveCardWrapper'
import { SavedCardsModal } from './components/displayCard/SavedCardsModal'
export const UserContext = createContext(null);

export default function App() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  /* Initialize user ONCE */
  useEffect(() => {
    console.log('useEffect App')
    // this is just a mock function to get login user details
    const currentUser = getUser();
    // this is to validate if customer already exists or not
    async function fetchUser() {
      const customerRes = await axios.post(
        "http://localhost:3000/get-customer",
        {
          email: currentUser.email,
          name: currentUser.name,
        }
      );

      setUser({
        ...currentUser,
        customerId: customerRes.data.customerId,
      });
    }

    fetchUser();
  }, []);


  const subscribe = () => {
    navigate("/pricing");
  };
  const capturPayments = async () => {
    console.log("Capturing pending payments for user:", user);
    const customerRes = await axios.post(
      "http://localhost:3000/capture-pre-auth",
      {
        customerId: user.customerId,
        name: user.name,
      }
    );
    console.log("Pending Payments Captured:", customerRes.data);
  };
  const saveCard = async () => {
    navigate("/save-card");
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
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2 className="text-center text-2xl font-medium text-gray-900">
                Welcome to the Stripe Plans
              </h2>
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
                  onClick={() => subscribe()}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition"
                >
                  Subscribe
                </button>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => capturPayments()}
                  className="rounded-lg bg-indigo-900 px-4 py-2 text-white font-medium hover:bg-green-700 transition"
                >
                  Get Pending Payments
                </button>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => saveCard()}
                  className="rounded-lg bg-indigo-900 px-4 py-2 text-white font-medium hover:bg-green-700 transition"
                >
                  Save Card
                </button>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => navigate("/list-card")}
                  className="rounded-lg bg-indigo-900 px-4 py-2 text-white font-medium hover:bg-green-700 transition"
                >
                  List Card
                </button>
              </div>
            </div>
          }
        />
        <Route path="/success" element={<PaymentSuccess />}></Route>
        <Route path="/cancel" element={<PaymentCancel />}></Route>
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/pre-auth"
          element={
            <Elements stripe={stripePromise}>
              <PreAuthCard />
            </Elements>
          }
        ></Route>
        <Route
          path="/save-card"
          element={
            <SaveCardWrapper />
          }
        />
        <Route
          path="/list-card"
          element={<SavedCardsModal />}
        />
      </Routes>
    </UserContext.Provider>
  );
}
