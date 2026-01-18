import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";

export function SavedCardsModal() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function fetchCards() {
      const res = await axios.get(
        `http://localhost:3000/stripe/cards/${user.customerId}`
      );
      setCards(res.data);
      setLoading(false);
    }

    fetchCards();
  }, [user.customerId]);

  const deleteCard = async (paymentMethodId) => {
    if (!window.confirm("Remove this card?")) return;

    setDeletingId(paymentMethodId);

    try {
      await axios.delete(
        `http://localhost:3000/stripe/cards/${paymentMethodId}`
      );

      // Remove card from UI immediately
      setCards((prev) =>
        prev.filter((c) => c.paymentMethodId !== paymentMethodId)
      );
    } catch (err) {
      alert("Failed to delete card");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[420px] rounded-lg shadow-lg p-5">
        <h2 className="text-xl font-semibold mb-4">Saved Cards</h2>

        {loading && <p>Loading cards...</p>}

        {!loading && cards.length === 0 && (
          <p className="text-gray-500">No saved cards found.</p>
        )}

        <div className="space-y-3">
          {cards.map((card) => (
            <div
              key={card.paymentMethodId}
              className="border rounded-md p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-medium capitalize">
                  {card.brand} •••• {card.last4}
                </p>
                <p className="text-sm text-gray-600">
                  Expires {card.expMonth}/{card.expYear} •{" "}
                  {card.funding}
                </p>
              </div>

              <button
                onClick={() =>
                  deleteCard(card.paymentMethodId)
                }
                disabled={deletingId === card.paymentMethodId}
                className="text-sm text-red-600 hover:underline disabled:opacity-50"
              >
                {deletingId === card.paymentMethodId
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-5 w-full rounded bg-gray-900 text-white py-2"
        >
          Close
        </button>
      </div>
    </div>
  );
}
