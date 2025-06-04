import { useEffect, useState, useRef } from "react";

export default function DeployLive() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [logs, setLogs] = useState({});
  const [visibleLogs, setVisibleLogs] = useState({});
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchDeployedStrategies();
    return () => clearInterval(intervalRef.current); // cleanup on unmount
  }, []);

  useEffect(() => {
    // Polling every 10 seconds for visible logs
    intervalRef.current = setInterval(() => {
      Object.keys(visibleLogs).forEach((key) => {
        if (visibleLogs[key]) {
          const [symbol, strategy] = key.split("_");
          fetchLogs(symbol, strategy);
        }
      });
    }, 10000); // 10 seconds

    return () => clearInterval(intervalRef.current);
  }, [visibleLogs]);

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

  const fetchLogs = async (symbol, strategy) => {
    const key = `${symbol}_${strategy}`;
    try {
      const response = await fetch(
        `http://0.0.0.0:8000/api/strategy-logs?symbol=${symbol}&strategy=${strategy}`
      );
      const data = await response.json();
      setLogs((prev) => ({ ...prev, [key]: data.logs || [] }));
    } catch (error) {
      setStatusMessage("❌ Failed to fetch logs.");
      setTimeout(() => setStatusMessage(""), 4000);
    }
  };

  const handleCancel = async (symbol, strategy) => {
    const key = `${symbol}_${strategy}`;
  
    try {
      const response = await fetch("http://0.0.0.0:8000/api/cancel-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, strategy }),
      });
  
      const data = await response.json();
      if (data.success) {
        setStatusMessage("✅ Strategy cancelled successfully!");
  
        // Remove from logs and visibility state
        setVisibleLogs((prev) => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });
  
        setLogs((prev) => {
          const newLogs = { ...prev };
          delete newLogs[key];
          return newLogs;
        });
  
        // Refresh active deployments
        fetchDeployedStrategies();
      } else {
        setStatusMessage(`❌ Cancel failed: ${data.error}`);
      }
    } catch (error) {
      setStatusMessage("❌ Network error while canceling strategy.");
    }
  
    setTimeout(() => setStatusMessage(""), 4000);
  };
  

  const toggleLogs = async (symbol, strategy) => {
    const key = `${symbol}_${strategy}`;
    const isVisible = visibleLogs[key];

    if (isVisible) {
      setVisibleLogs((prev) => ({ ...prev, [key]: false }));
    } else {
      await fetchLogs(symbol, strategy);
      setVisibleLogs((prev) => ({ ...prev, [key]: true }));
    }
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
          {deployments.map(({ symbol, strategy }, index) => {
            const key = `${symbol}_${strategy}`;
            return (
              <div
                key={`${symbol}-${strategy}-${index}`}
                className="border rounded-lg shadow-sm bg-white p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-gray-800">{strategy}</p>
                    <p className="text-sm text-gray-500">Stock: {symbol}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => toggleLogs(symbol, strategy)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      📜 {visibleLogs[key] ? "Hide Logs" : "View Logs"}
                    </button>
                    <button
                      onClick={() => handleCancel(symbol, strategy)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>

                {visibleLogs[key] && (
                  <div className="bg-gray-50 border mt-2 max-h-64 overflow-y-auto p-2 rounded text-sm font-mono">
                    {logs[key]?.length ? (
                      logs[key].map((log, i) => (
                        <p key={i} className="text-gray-700 whitespace-pre-wrap">
                          {log}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-500">No logs yet.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
