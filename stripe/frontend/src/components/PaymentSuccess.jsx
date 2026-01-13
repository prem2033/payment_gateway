import { Link, useSearchParams } from "react-router-dom";

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id"); // from Stripe Checkout

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Message */}
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Payment Successful
        </h1>

        <p className="mt-2 text-gray-600">
          Thank you for your purchase. Your payment has been processed
          successfully.
        </p>

        {/* CTA */}
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Optional: Stripe Reference */}
        {sessionId && (
          <p className="mt-4 text-xs text-gray-400">
            Reference: {sessionId}
          </p>
        )}
      </section>
    </main>
  );
}
