import { useState } from "react";

export default function Backtest() {
  const [symbol, setSymbol] = useState("");
  const [strategy, setStrategy] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [result, setResult] = useState(null);
  const [deployStatus, setDeployStatus] = useState("");

  const strategies = [
    "EMA Crossover",
    "XGBoost",
    "Hybrid (LSTM + XGBoost)",
    "Random Forest",
    "Hybrid(EMA + XGBoost)",
  ];

  const handleRunBacktest = async () => {
    if (!symbol || !strategy || !fromDate || !toDate) {
      alert("Please fill all fields");
      return;
    }

    const response = await fetch("http://0.0.0.0:8000/api/run-backtest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, strategy, from_date: fromDate, to_date: toDate }),
    });

    const data = await response.json();
    setResult(data);
    setDeployStatus("");
  };

  const handleDeployLive = async () => {
    try {
      const response = await fetch("http://0.0.0.0:8000/api/deploy-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, strategy }),
      });
  
      const data = await response.json();
      if (data.success) {
        setDeployStatus("✅ Strategy deployed successfully!");
      } else {
        setDeployStatus(`❌ Deployment failed: ${data.error}`);
      }
    } catch (error) {
      setDeployStatus("❌ Network error while deploying strategy.");
    }
  
    // Optional: Clear the message after 5 seconds
    setTimeout(() => {
      setDeployStatus("");
    }, 5000);
  };
  

  return (
    <div className="max-w-xl w-full mx-auto space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-blue-700">📊 Trading Strategy Backtester</h2>

      {/* Symbol input */}
      <input
        type="text"
        placeholder="Enter Stock Symbol (e.g., RELIANCE)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition animate-slide-up"
      />

      {/* Strategy buttons */}
      <div className="space-y-2 animate-slide-up">
        <label className="block font-medium text-gray-700">🎯 Select Strategy:</label>
        <div className="grid grid-cols-2 gap-3">
          {strategies.map((strat) => (
            <button
              key={strat}
              onClick={() => setStrategy(strat)}
              className={`p-2 rounded-lg text-sm font-semibold border transition-all duration-200
                ${strategy === strat
                  ? "bg-blue-600 text-white border-blue-700 shadow"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50"}
              `}
            >
              {strat}
            </button>
          ))}
        </div>
      </div>

      {/* Dates */}
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition animate-slide-up"
      />
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition animate-slide-up"
      />

      {/* Run backtest button */}
      <button
        onClick={handleRunBacktest}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition animate-slide-up"
      >
        🚀 Run Backtest
      </button>

      {/* Result panel */}
      {result && (
        <div className={`p-4 rounded-lg shadow-md transition animate-fade-in ${result.success ? "bg-green-50 border border-green-400" : "bg-red-100 border border-red-400"}`}>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {result.success ? "📈 Performance Metrics:" : "❌ Error:"}
          </h3>
          {result.success ? (
            <ul className="text-sm space-y-1">
              {Object.entries(result.performance).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-red-700">{result.error}</p>
          )}

          {/* Deploy button */}
          {result.success && (
            <button
              onClick={handleDeployLive}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
            >
              ⚙️ Deploy Strategy Live
            </button>
          )}
        </div>
      )}

      {/* Deploy status message */}
      {deployStatus && (
        <div className="text-center mt-2 text-sm font-medium text-blue-600 animate-fade-in">
          {deployStatus}
        </div>
      )}
    </div>
  );
}
