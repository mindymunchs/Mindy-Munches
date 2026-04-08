import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { getDashboardStats } from "../utils/adminApi";
import useAuthStore from "../store/authStore";

import AdminOverview from "../components/admin/AdminOverview";
import ProductManagement from "../components/admin/ProductManagement";
import StockManagement from "../components/admin/StockManagement";
import AdminManagement from "../components/admin/AdminManagement";
import OrderManagement from "../components/admin/OrderManagement";
import Analytics from "../components/admin/Analytics";
import TestimonialManagement from "../components/admin/TestimonialManagement";
import PromoCodeManagement from "../components/admin/PromoCodeManagement";
import FeedbackManagement from "../components/admin/FeedbackManagement";
import FeedbackFormManagement from "../components/admin/FeedbackFormManagement";

const IconWrapper = ({ children }) => (
  <span className="inline-flex items-center justify-center w-5 h-5 text-current">{children}</span>
);

const icons = {
  overview: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M3 13h8V3H3v10zM13 21h8v-6h-8v6zM13 11h8V3h-8v8zM3 21h8v-6H3v6z" />
      </svg>
    </IconWrapper>
  ),
  products: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.3 7l8.7 5 8.7-5M12 22V12" />
      </svg>
    </IconWrapper>
  ),
  stock: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    </IconWrapper>
  ),
  orders: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <circle cx="9" cy="20" r="1" />
        <circle cx="20" cy="20" r="1" />
        <path d="M1 1h4l2.6 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.5L23 6H6" />
      </svg>
    </IconWrapper>
  ),
  testimonials: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </IconWrapper>
  ),
  feedback: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16l4-3h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
    </IconWrapper>
  ),
  feedbackForm: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    </IconWrapper>
  ),
  promoCodes: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M20.59 13.41 11 3H4v7l9.59 9.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82Z" />
        <circle cx="7.5" cy="7.5" r="1.5" />
      </svg>
    </IconWrapper>
  ),
  analytics: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    </IconWrapper>
  ),
  admins: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <path d="M20 8v6" />
        <path d="M23 11h-6" />
      </svg>
    </IconWrapper>
  ),
  profile: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20a8 8 0 0 1 16 0" />
      </svg>
    </IconWrapper>
  ),
  crown: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8z" />
      </svg>
    </IconWrapper>
  ),
  logout: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
    </IconWrapper>
  ),
};

const AdminDashboard = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const path = location.pathname.split("/admin/")[1] || "overview";
    setActiveTab(path);
  }, [location]);

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

    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      fetchStats();
    }
  }, [location.pathname]);

  const menuItems = [
    { id: "overview", label: "Overview", icon: icons.overview, path: "/admin" },
    { id: "products", label: "Products", icon: icons.products, path: "/admin/products" },
    { id: "stock", label: "Stock", icon: icons.stock, path: "/admin/stock" },
    { id: "orders", label: "Orders", icon: icons.orders, path: "/admin/orders" },
    { id: "testimonials", label: "Testimonials", icon: icons.testimonials, path: "/admin/testimonials" },
    { id: "feedback", label: "Feedback Entries", icon: icons.feedback, path: "/admin/feedback" },
    { id: "feedback-form", label: "Feedback Form", icon: icons.feedbackForm, path: "/admin/feedback-form" },
    { id: "promo-codes", label: "Promo Codes", icon: icons.promoCodes, path: "/admin/promo-codes" },
    { id: "analytics", label: "Analytics", icon: icons.analytics, path: "/admin/analytics" },
    { id: "admins", label: "Admins", icon: icons.admins, path: "/admin/admins" },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700">
                {icons.profile}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-800">{user?.name}</h3>
                <p className="text-xs text-neutral-500">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                  {icons.crown} Administrator
                </span>
              </div>
            </div>
          </div>

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
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-neutral-200">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              {icons.logout}
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="lg:hidden bg-white border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-neutral-800">Admin Panel</h1>
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <Routes>
            <Route path="/" element={<AdminOverview stats={stats} loading={loadingStats} error={statsError} />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/stock" element={<StockManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/testimonials" element={<TestimonialManagement />} />
            <Route path="/feedback" element={<FeedbackManagement />} />
            <Route path="/feedback-form" element={<FeedbackFormManagement />} />
            <Route path="/promo-codes" element={<PromoCodeManagement />} />
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
