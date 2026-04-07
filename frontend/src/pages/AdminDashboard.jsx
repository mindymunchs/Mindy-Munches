import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
//eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { getDashboardStats } from "../utils/adminApi";
import useAuthStore from "../store/authStore";

// Admin Dashboard Components
import AdminOverview from "../components/admin/AdminOverview";
import ProductManagement from "../components/admin/ProductManagement";
import StockManagement from "../components/admin/StockManagement";
import AdminManagement from "../components/admin/AdminManagement";
import OrderManagement from "../components/admin/OrderManagement";
import Analytics from "../components/admin/Analytics";
import TestimonialManagement from "../components/admin/TestimonialManagement";
import PromoCodeManagement from "../components/admin/PromoCodeManagement"; // ✅ NEW
import FeedbackManagement from "../components/admin/FeedbackManagement";

const AdminDashboard = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname.split("/admin/")[1] || "overview";
    setActiveTab(path);
  }, [location]);

  // Fetch admin dashboard stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setStatsError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");
        const data = await getDashboardStats(token);
        setStats(data);
      } catch (error) {
        setStatsError(error.message || "Failed to load stats");
      } finally {
        setLoadingStats(false);
      }
    };

    // Only fetch stats if we are on the overview page
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      fetchStats();
    }
  }, [location.pathname]);

  // ✅ UPDATED: Added Promo Codes menu item
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊", path: "/admin" },
    { id: "products", label: "Products", icon: "📦", path: "/admin/products" },
    { id: "stock", label: "Stock", icon: "📋", path: "/admin/stock" },
    { id: "orders", label: "Orders", icon: "🛒", path: "/admin/orders" },
    { id: "testimonials", label: "Testimonials", icon: "💬", path: "/admin/testimonials" },
    { id: "feedback", label: "Feedback", icon: "🧾", path: "/admin/feedback" },
    { id: "promo-codes", label: "Promo Codes", icon: "🎟️", path: "/admin/promo-codes" }, // ✅ NEW
    { id: "analytics", label: "Analytics", icon: "📈", path: "/admin/analytics" },
    { id: "admins", label: "Admins", icon: "👥", path: "/admin/admins" },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Admin Profile */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-800">{user?.name}</h3>
                <p className="text-xs text-neutral-500">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                  👑 Administrator
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-neutral-200">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-neutral-800">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Routes */}
        <div className="p-6">
          <Routes>
            <Route 
              path="/" 
              element={
                <AdminOverview 
                  stats={stats} 
                  loading={loadingStats} 
                  error={statsError} 
                />
              } 
            />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/stock" element={<StockManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/testimonials" element={<TestimonialManagement />} />
            <Route path="/feedback" element={<FeedbackManagement />} />
            <Route path="/promo-codes" element={<PromoCodeManagement />} /> {/* ✅ NEW */}
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/admins" element={<AdminManagement />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
