import { useState } from "react";

export function PendingPaymentsButton() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const capturePayments = async () => {
    try {
      setLoading(true);
      setSuccess(false);
      setError(null);

      await delay(10000);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to capture payments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      <button
        onClick={capturePayments}
        disabled={loading}
        aria-busy={loading}
        className={`relative h-11 w-50 rounded-lg px-5 text-white font-medium
          transition-colors duration-300
          ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-green-600 active:bg-green-700"
          }
        `}
      >
        {/* Default text */}
        <span
          className={`absolute inset-0 flex items-center justify-center transition-opacity
            ${loading ? "opacity-0" : "opacity-100"}
          `}
        >
          Get Pending Payments
        </span>

        {/* Loading state */}
        <span
          className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity
            ${loading ? "opacity-100" : "opacity-0"}
          `}
        >
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Processing...
        </span>
      </button>

      {/* Success message */}
      {success && (
        <p className="mt-3 text-sm font-medium text-green-600">
          ✅ Pending payments captured successfully.
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-3 text-sm font-medium text-red-600">❌ {error}</p>
      )}
    </div>
  );
}
