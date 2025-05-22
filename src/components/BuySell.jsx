import { useState } from "react";

export default function BuySell() {
  const [symbol, setSymbol] = useState("");
  const [qty, setQty] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [isBuying, setIsBuying] = useState(true);
  const [message, setMessage] = useState("");

  const handleTrade = async () => {
    if (!symbol || !qty) {
      setMessage("❗ Symbol and Quantity are required.");
      return;
    }

    const url = isBuying ? "buy" : "sell";
    const body = { symbol, qty: Number(qty) };

    if (isBuying) {
      if (stopLoss) body.stop_loss = Number(stopLoss);
      if (limitPrice) body.limit_price = Number(limitPrice);
    }

    try {
      const res = await fetch(`http://0.0.0.0:8000/api/${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`✅ ${isBuying ? "Buy" : "Sell"} order placed successfully.`);
      } else {
        setMessage(`❌ Error: ${data.error || "Trade failed."}`);
      }
    } catch (err) {
      setMessage("❌ API call failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 mt-10 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
        {isBuying ? "🟢 Buy" : "🔴 Sell"} Stock
      </h2>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setIsBuying(true)}
          className={`px-4 py-2 font-semibold rounded-full transition ${
            isBuying
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setIsBuying(false)}
          className={`px-4 py-2 font-semibold rounded-full transition ${
            !isBuying
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Sell
        </button>
      </div>

      {/* Input Fields */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Symbol</label>
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. TCS"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Number of shares"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
        </div>

        {isBuying && (
          <>
            <div>
              <label className="text-sm font-medium text-gray-700">Stop Loss (optional)</label>
              <input
                type="number"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Stop loss price"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Limit Price (optional)</label>
              <input
                type="number"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Limit price"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleTrade}
        className="mt-5 w-full py-2 rounded font-bold text-white bg-green-600 hover:bg-green-700 transition"
      >
        {isBuying ? "Buy Now" : "Sell Now"}
      </button>

      {/* Message */}
      {message && (
        <p className="mt-4 text-center text-sm text-gray-800 font-medium">{message}</p>
      )}
    </div>
  );
}
