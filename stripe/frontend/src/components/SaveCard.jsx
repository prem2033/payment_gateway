import { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { UserContext } from "../App";


export function SaveCard({ clientSecret }) {
    console.log('SaveCard', clientSecret)
    const stripe = useStripe();
    const elements = useElements();
    console.log("stripe:", stripe);
    console.log("elements:", elements);
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSaveCard = async () => {
        if (!stripe || !elements) return;

        setLoading(true);
        setMessage("");

        // REQUIRED before confirmSetup
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setMessage(submitError.message);
            setLoading(false);
            return;
        }

        const { error, setupIntent } = await stripe.confirmSetup({
            elements,
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Card saved successfully");
            console.log("Saved PaymentMethod:", setupIntent.payment_method);
        }

        setLoading(false);
    };

    // if (!clientSecret) return <p>Loading...</p>;

    return (
        <div style={{ maxWidth: 420, margin: "50px auto" }}>
            <h2>Save Card</h2>

            <PaymentElement />

            <button
                onClick={handleSaveCard}
                disabled={loading}
                style={{
                    marginTop: 20,
                    width: "100%",
                    padding: 12,
                    background: "#4f46e5",
                    color: "#fff",
                    borderRadius: 6,
                    border: "none",
                }}
            >
                {loading ? "Saving..." : "Save Card"}
            </button>

            {message && <p style={{ marginTop: 10 }}>{message}</p>}
        </div>
    );
}
