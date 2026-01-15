import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

export default function Pricing() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");
  const choosePlan = (plan) => {
    // use useLocation hook to retrive these informations
    navigate("/pre-auth", {
      state: {
        amount: plan.price,
        customerId: user.customerId,
        name: plan.name,
      },
    });
  };
  const plans = [
    {
      name: "Basic",
      price: billing === "monthly" ? "1" : "1",
      features: ["Basic access", "Community support"],
    },
    {
      name: "Plus",
      price: billing === "monthly" ? "20" : "16", // example savings
      features: ["Everything in Free", "Priority support", "Usage analytics"],
      popular: true,
    },
    {
      name: "Pro",
      price: billing === "monthly" ? "50" : "40",
      features: ["All Plus features", "Dedicated support", "Enterprise SLA"],
    },
  ];

  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Subscribe</h2>
        <p className="text-lg text-gray-600 mb-8">
          Choose the plan that fits your needs.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-2 mb-8">
          <span
            className={billing === "monthly" ? "font-bold" : "text-gray-600"}
          >
            Monthly
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={billing === "yearly"}
              onChange={() =>
                setBilling(billing === "monthly" ? "yearly" : "monthly")
              }
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 transition"></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-full transition"></div>
          </label>
          <span
            className={billing === "yearly" ? "font-bold" : "text-gray-600"}
          >
            Yearly
          </span>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-lg p-8 text-left shadow-sm ${
                plan.popular ? "border-indigo-600 bg-white" : "bg-white"
              }`}
            >
              {plan.popular && (
                <div className="text-indigo-600 font-semibold uppercase text-sm mb-2">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-5xl font-extrabold mt-4">
                ${plan.price}
                <span className="text-lg font-medium text-gray-500">/mo</span>
              </p>
              <ul className="mt-6 space-y-2 text-gray-700">
                {plan.features.map((feat) => (
                  <li key={feat}>● {feat}</li>
                ))}
              </ul>
              <button
                onClick={() => choosePlan(plan)}
                className="mt-8 w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800"
              >
                {plan.name === "Free" ? "Get Started" : "Choose Plan"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
