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
    <>
      <div>
        <h2>{id}</h2>
        <h3>{name}</h3>
        <p>Price: ${price}</p>
        <button onClick={handlePayment}>Subscribe</button>
      </div>
    </>
  );
}
