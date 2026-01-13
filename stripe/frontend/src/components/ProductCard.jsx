import axios from "axios";

export function ProductCard({ id, name, price, unit }) {
  const handlePayment = async () => {
    console.log("Initiating payment for:", { id, name, price, unit });
    const response = await axios.post(
      "http://localhost:3000/checkout-session2",
      {
        name: name,
        email: "user@example.com",
        unit: unit,
        amount: price,
      }
    );
    console.log("Payment response:", response.data);
    window.location.href = response.data.url;

  };
  return (
    <div>
      <div className="w-80 rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
        <h2 className="text-lg font-semibold text-gray-800">{id}</h2>
        <h3 className="mt-1 text-xl font-bold text-gray-900">{name}</h3>

        <p className="mt-3 text-gray-600">
          Price: <span className="font-semibold">${price}</span>
        </p>

        <button
          onClick={handlePayment}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
        >
          Purchase(1Months)
        </button>
      </div>
    </div>

  );
}