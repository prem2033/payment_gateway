import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../App";

export function PreAuthCard() {
  const { user, setUser } = useContext(UserContext);
  console.log("Current User in PreAuthCard:", user);
  const { state } = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = {
    style: {
      base: {
        fontSize: "16px",
        color: "#111827",
        "::placeholder": { color: "#9CA3AF" },
      },
      invalid: { color: "#DC2626" },
    },
  };

  // Defensive guard
  if (!state?.amount) {
    navigate("/");
    return null;
  }

  const handlePreAuth = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const customerId = user.customerId;

      // 2. Create pre-auth PaymentIntent
      const paymentRes = await axios.post(
        "http://localhost:3000/pre-auth-amount",
        {
          customerId,
          amount: state.amount * 100,
        }
      );

      const { clientSecret } = paymentRes.data;

      // 3. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // ✅ Success
      // alert("Pre-auth successful and card saved");
      console.log("PaymentIntent:", result.paymentIntent.id);

      // Optional redirect
      navigate("/success");
    } catch (err) {
      console.error(err);
      navigate("/cancel", { state: { message: err.message } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            Add Payment Method
          </h2>
          <p className="text-sm text-gray-500">
            Your card will be securely saved for future payments of{" "}
            {state.amount}
          </p>
        </div>

        {/* Card Form */}
        <div className="space-y-4">
          <div className="border rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-black">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Card Number
            </label>
            <CardNumberElement options={options} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-black">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Expiry Date
              </label>
              <CardExpiryElement />
            </div>

            <div className="border rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-black">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                CVC
              </label>
              <CardCvcElement />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        {/* Action Button */}
        <button
          onClick={handlePreAuth}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium tracking-wide transition-all
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900 active:scale-[0.98]"
            }`}
        >
          {loading && (
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Processing..." : "Add Card & Pre-Authorize"}
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400">
          Secured by Stripe • PCI-DSS compliant
        </p>
      </div>
    </div>
  );
}
