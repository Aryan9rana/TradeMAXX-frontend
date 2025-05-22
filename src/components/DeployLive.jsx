import { useEffect, useState } from "react";

export default function DeployLive() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetchDeployedStrategies();
  }, []);

  const fetchDeployedStrategies = async () => {
    try {
      const response = await fetch("http://0.0.0.0:8000/api/deployed-strategies");
      const data = await response.json();
      setDeployments(data.deployments || []);
    } catch (error) {
      setStatusMessage("❌ Failed to load deployed strategies.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (symbol, strategy) => {
    try {
      const response = await fetch("http://0.0.0.0:8000/api/cancel-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, strategy }),
      });

      const data = await response.json();
      if (data.success) {
        setStatusMessage("✅ Strategy cancelled successfully!");
        fetchDeployedStrategies(); // Refresh list
      } else {
        setStatusMessage(`❌ Cancel failed: ${data.error}`);
      }
    } catch (error) {
      setStatusMessage("❌ Network error while canceling strategy.");
    }

    setTimeout(() => setStatusMessage(""), 4000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-700 text-center">⚙️ Live Deployments</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : deployments.length === 0 ? (
        <p className="text-center text-gray-500">No strategies currently deployed.</p>
      ) : (
        <div className="space-y-4">
          {deployments.map(({ symbol, strategy }, index) => (
            <div
              key={`${symbol}-${strategy}-${index}`}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
            >
              <div>
                <p className="text-lg font-medium text-gray-800">{strategy}</p>
                <p className="text-sm text-gray-500">Stock: {symbol}</p>
              </div>
              <button
                onClick={() => handleCancel(symbol, strategy)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                ❌ Cancel
              </button>
            </div>
          ))}
        </div>
      )}

      {statusMessage && (
        <p className="text-center font-medium text-blue-600 animate-fade-in">
          {statusMessage}
        </p>
      )}
    </div>
  );
}
