import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./stripe";
import { SaveCard } from "./SaveCard";
import { UserContext } from "../App";

export function SaveCardWrapper({ customerId }) {
  const [clientSecret, setClientSecret] = useState(null);
  const { user, setUser } = useContext(UserContext);


  useEffect(() => {
    async function createSetupIntent() {
      const res = await axios.post(
        "http://localhost:3000/stripe/save-card",
        { customerId : user.customerId }
      );
      console.log('Secret', res.data.clientSecret)
      setClientSecret(res.data.clientSecret);
    }
      
    createSetupIntent();
  }, [customerId]);

  if (!clientSecret) return <p>Loading Stripe...</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret,   appearance: { theme: "stripe" } } }>
      <SaveCard />
    </Elements>
  );
}
