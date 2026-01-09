import { Route, Routes } from "react-router-dom";
import { ProductCard } from "./components/ProductCard";

export default function App() {
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
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <h1>Welcome to the Stripe Plans</h1>
            <div></div>
            {plans.map((plan) => (
              <ProductCard
                key={plan.id}
                id={plan.id}
                name={plan.name}
                price={plan.price}
                unit={plan.unit ?? 1}
              ></ProductCard>
            ))}
          </div>
        }
      />
      <Route path="/success" element={<h1>Success✅</h1>}></Route>
      <Route path="/cancel" element={<h1>Cancel❌</h1>}></Route>
    </Routes>
  );
}
