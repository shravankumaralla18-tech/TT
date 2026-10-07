import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DiseaseDetection from "./pages/disease/DiseaseDetection.jsx";
import DiseaseResult from "./pages/disease/DiseaseResult.jsx";
import DiseaseHistory from "./pages/disease/DiseaseHistory.jsx";
import MarketAdvisory from "./pages/market/MarketAdvisory.jsx";
import MarketPrices from "./pages/market/MarketPrices.jsx";
import MarketTrends from "./pages/market/MarketTrends.jsx";
import CropAdvisory from "./pages/advisory/CropAdvisory.jsx";
import Recommendations from "./pages/advisory/Recommendations.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";

function AppShell() {
  return (
    <div className="shell">
      <Navbar />
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/disease/result/:id" element={<DiseaseResult />} />
          <Route path="/disease/history" element={<DiseaseHistory />} />
          <Route path="/market" element={<MarketAdvisory />} />
          <Route path="/market/prices" element={<MarketPrices />} />
          <Route path="/market/trends" element={<MarketTrends />} />
          <Route path="/advisory" element={<CropAdvisory />} />
          <Route path="/advisory/recommendations" element={<Recommendations />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
