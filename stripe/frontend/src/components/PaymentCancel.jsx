export function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-lg shadow text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-black text-white rounded"
        >
          Back to DashBoard
        </a>
      </div>
    </div>
  );
}