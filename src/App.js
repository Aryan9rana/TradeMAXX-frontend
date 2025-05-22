import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import { BarChart2, Briefcase, ShoppingCart, Rocket} from "lucide-react"; // Icons
import Backtest from "./components/Backtest";
import Portfolio from "./components/Portfolio";
import BuySell from "./components/BuySell";
import DeployLive from "./components/DeployLive";

function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: "Backtest", path: "/", icon: <BarChart2 size={18} /> },
    { label: "Portfolio", path: "/portfolio", icon: <Briefcase size={18} /> },
    { label: "Trade", path: "/trade", icon: <ShoppingCart size={18} /> },
    { label: "Deploy", path: "/deploy", icon: <Rocket size={18} /> }, // ← Add this
  ];

  return (
    <nav className="flex w-full bg-white/60 backdrop-blur-sm shadow-md rounded-t-lg">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex-1 text-center py-4 transition-all duration-300 border-b-2 flex flex-col items-center gap-1 ${
            location.pathname === item.path
              ? "border-blue-600 text-blue-600 font-semibold bg-blue-50"
              : "border-transparent text-gray-500 hover:text-blue-500 hover:bg-gray-100"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default function TradingStrategyApp() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex flex-col items-center justify-start py-10 px-4">
        <div className="w-full max-w-4xl bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.01]">
          <Navbar />
          <div className="p-6 animate-fade-in">
            <Routes>
              <Route path="/" element={<Backtest />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/trade" element={<BuySell />} />
              <Route path="/deploy" element={<DeployLive />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
