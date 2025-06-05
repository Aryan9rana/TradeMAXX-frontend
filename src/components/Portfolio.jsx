import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, RefreshCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedInsights, setExpandedInsights] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch("http://0.0.0.0:8000/api/portfolio")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setPortfolioData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching portfolio:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 100000);
    return () => clearInterval(interval);
  }, []);

  if (!portfolioData) {
    return <p className="text-center mt-6 text-lg animate-pulse">📦 Loading portfolio...</p>;
  }

  const {
    portfolio = [],
    total_investment,
    total_current_value,
    total_unrealized_pl,
    overall_change,
    cash_balance,
    analysis,
    gemini_insights,
  } = portfolioData;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">📈 Current Portfolio</h2>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {portfolio.length > 0 ? (
        <>
          {/* Portfolio Table */}
          <div className="overflow-x-auto shadow-xl rounded-lg border border-gray-200">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-blue-100 text-blue-800 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3 border-b border-r border-blue-200 text-left rounded-tl-lg">Symbol</th>
                  <th className="p-3 border-b border-r border-blue-200">Qty</th>
                  <th className="p-3 border-b border-r border-blue-200">Buy Price</th>
                  <th className="p-3 border-b border-r border-blue-200">Current Price</th>
                  <th className="p-3 border-b border-r border-blue-200">Invested</th>
                  <th className="p-3 border-b border-r border-blue-200">Current Value</th>
                  <th className="p-3 border-b border-r border-blue-200">P/L</th>
                  <th className="p-3 border-b border-blue-200 rounded-tr-lg">% Change</th>
                </tr>
              </thead>
              <tbody className="text-center divide-y divide-gray-100">
                {portfolio.map((item, index) => (
                  <tr key={item.symbol || index} className="hover:bg-blue-50 transition duration-150 ease-in-out">
                    <td className="p-3 border-r border-gray-200 text-left font-medium text-gray-800">{item.symbol}</td>
                    <td className="p-3 border-r border-gray-200">{item.qty}</td>
                    <td className="p-3 border-r border-gray-200">₹{item.buy_price}</td>
                    <td className="p-3 border-r border-gray-200">
                      {item.current_price !== null ? `₹${item.current_price}` : "N/A"}
                    </td>
                    <td className="p-3 border-r border-gray-200">₹{item.invested_value}</td>
                    <td className="p-3 border-r border-gray-200">
                      {item.current_value !== null ? `₹${item.current_value}` : "N/A"}
                    </td>
                    <td
                      className={`p-3 border-r border-gray-200 font-semibold ${
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
                      className={`p-3 font-semibold ${
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

          {/* Summary Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-8 text-center text-sm sm:text-base">
            <div className="p-5 bg-blue-100 rounded-xl shadow-md border border-blue-200">
              <p className="font-semibold text-gray-700 mb-1">Total Investment</p>
              <p className="text-blue-800 font-extrabold text-2xl">₹{total_investment}</p>
            </div>
            <div className="p-5 bg-blue-100 rounded-xl shadow-md border border-blue-200">
              <p className="font-semibold text-gray-700 mb-1">Current Value</p>
              <p className="text-blue-800 font-extrabold text-2xl">₹{total_current_value}</p>
            </div>
            <div className="p-5 bg-blue-100 rounded-xl shadow-md border border-blue-200">
              <p className="font-semibold text-gray-700 mb-1">Unrealized P/L</p>
              <p
                className={`font-extrabold text-2xl ${
                  total_unrealized_pl > 0
                    ? "text-green-700"
                    : total_unrealized_pl < 0
                    ? "text-red-700"
                    : "text-gray-700"
                }`}
              >
                ₹{total_unrealized_pl}
              </p>
            </div>
            <div className="p-5 bg-blue-100 rounded-xl shadow-md border border-blue-200">
              <p className="font-semibold text-gray-700 mb-1">Overall Change</p>
              <p
                className={`font-extrabold text-2xl ${
                  overall_change > 0
                    ? "text-green-700"
                    : overall_change < 0
                    ? "text-red-700"
                    : "text-gray-700"
                }`}
              >
                {overall_change}%
              </p>
            </div>
            <div className="p-5 bg-blue-100 rounded-xl shadow-md border border-blue-200 col-span-full sm:col-span-1">
              <p className="font-semibold text-gray-700 mb-1">Cash Balance</p>
              <p className="text-blue-800 font-extrabold text-2xl">₹{cash_balance}</p>
            </div>
          </div>

          {/* Insights Section */}
          {analysis && (
            <div className="mt-10 space-y-4">
              <h3 className="text-2xl font-bold text-blue-700 text-center mb-6">🧠 Portfolio Insights</h3>
              <div className="grid md:grid-cols-2 gap-6 text-base">
                {analysis.top_gainer && (
                  <div className="p-5 bg-green-100 border border-green-200 rounded-xl shadow-md">
                    <p className="font-semibold text-green-800 mb-1 flex items-center gap-2">
                      <span className="text-2xl">📈</span> Top Gainer
                    </p>
                    <p className="text-gray-800">
                      <span className="font-bold text-green-700">{analysis.top_gainer.symbol}</span> gained ₹
                      {analysis.top_gainer.gain} (
                      <span className="font-bold">{analysis.top_gainer.percentage_change}%</span>)
                    </p>
                  </div>
                )}

                {analysis.top_loser && (
                  <div className="p-5 bg-red-100 border border-red-200 rounded-xl shadow-md">
                    <p className="font-semibold text-red-800 mb-1 flex items-center gap-2">
                      <span className="text-2xl">📉</span> Top Loser
                    </p>
                    <p className="text-gray-800">
                      <span className="font-bold text-red-700">{analysis.top_loser.symbol}</span> lost ₹
                      {analysis.top_loser.loss} (
                      <span className="font-bold">{analysis.top_loser.percentage_change}%</span>)
                    </p>
                  </div>
                )}
              </div>

              {analysis.underperformers?.length > 0 && (
                <div className="p-5 bg-yellow-100 border border-yellow-200 rounded-xl shadow-md">
                  <p className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span> Underperformers (Loss {">"} 5%)
                  </p>
                  <ul className="list-disc list-inside text-base text-gray-800 space-y-2">
                    {analysis.underperformers.map((u, i) => (
                      <li key={u.symbol || i}>
                        <span className="font-semibold">{u.symbol}</span>: ₹{u.loss} (
                        <span className="font-bold">{u.percentage_change}%</span>)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Gemini AI Insights Section */}
          {gemini_insights && (
            <div className="mt-10 p-6 bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-xl shadow-2xl">
              <div
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => setExpandedInsights(!expandedInsights)}
              >
                <h3 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                  <span className="text-3xl">💡</span> AI Insights
                </h3>
                {expandedInsights ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
              {expandedInsights && (
                <div className="text-gray-800 leading-relaxed text-base mt-4 prose prose-blue max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{gemini_insights}</ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 mt-6 text-lg">No portfolio data available. Please add some holdings!</p>
      )}
    </div>
  );
}
