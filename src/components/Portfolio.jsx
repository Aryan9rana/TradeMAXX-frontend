import { useState, useEffect } from "react";

export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://0.0.0.0:8000/api/portfolio")
        .then((res) => res.json())
        .then((data) => setPortfolioData(data))
        .catch((error) => console.error("Error fetching portfolio:", error));
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!portfolioData) {
    return <p className="text-center mt-6 text-lg animate-pulse">📦 Loading portfolio...</p>;
  }

  const {
    portfolio,
    total_investment,
    total_current_value,
    total_unrealized_pl,
    overall_change,
    cash_balance,
  } = portfolioData;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">📈 Current Portfolio</h2>

      {portfolio.length > 0 ? (
        <>
          {/* Table */}
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3 border">Symbol</th>
                  <th className="p-3 border">Qty</th>
                  <th className="p-3 border">Buy Price</th>
                  <th className="p-3 border">Current Price</th>
                  <th className="p-3 border">Invested</th>
                  <th className="p-3 border">Current Value</th>
                  <th className="p-3 border">P/L</th>
                  <th className="p-3 border">% Change</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {portfolio.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="p-3 border">{item.symbol}</td>
                    <td className="p-3 border">{item.qty}</td>
                    <td className="p-3 border">₹{item.buy_price}</td>
                    <td className="p-3 border">{item.current_price ? `₹${item.current_price}` : "N/A"}</td>
                    <td className="p-3 border">₹{item.invested_value}</td>
                    <td className="p-3 border">{item.current_value ? `₹${item.current_value}` : "N/A"}</td>
                    <td
                      className={`p-3 border font-medium ${
                        item.unrealized_pl > 0
                          ? "text-green-600"
                          : item.unrealized_pl < 0
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {item.unrealized_pl !== null ? `₹${item.unrealized_pl}` : "N/A"}
                    </td>
                    <td
                      className={`p-3 border font-medium ${
                        item.percentage_change > 0
                          ? "text-green-600"
                          : item.percentage_change < 0
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {item.percentage_change !== null ? `${item.percentage_change}%` : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="grid md:grid-cols-3 gap-4 mt-8 text-center text-sm sm:text-base">
            <div className="p-4 bg-blue-50 rounded-xl border">
              <p className="font-semibold text-gray-600">Total Investment</p>
              <p className="text-blue-700 font-bold text-lg">₹{total_investment}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border">
              <p className="font-semibold text-gray-600">Current Value</p>
              <p className="text-blue-700 font-bold text-lg">₹{total_current_value}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border">
              <p className="font-semibold text-gray-600">Unrealized P/L</p>
              <p
                className={`font-bold text-lg ${
                  total_unrealized_pl > 0
                    ? "text-green-600"
                    : total_unrealized_pl < 0
                    ? "text-red-600"
                    : "text-gray-700"
                }`}
              >
                ₹{total_unrealized_pl}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border">
              <p className="font-semibold text-gray-600">Overall Change</p>
              <p
                className={`font-bold text-lg ${
                  overall_change > 0
                    ? "text-green-600"
                    : overall_change < 0
                    ? "text-red-600"
                    : "text-gray-700"
                }`}
              >
                {overall_change}%
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border col-span-full sm:col-span-1">
              <p className="font-semibold text-gray-600">Cash Balance</p>
              <p className="text-blue-700 font-bold text-lg">₹{cash_balance}</p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-6">No portfolio data available.</p>
      )}
    </div>
  );
}
