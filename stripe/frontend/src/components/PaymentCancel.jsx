import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export function PaymentCancel() {
  const { state } = useLocation();
  const message = state?.message || "Your payment was cancelled. No charges were made to your card.";
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <section
        role="alert"
        className="bg-white p-10 rounded-lg shadow text-center max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Back to Dashboard
          </Link>

          <Link
            to="/pricing"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            View Plans
          </Link>
        </div>
      </section>
    </main>
  );
}
