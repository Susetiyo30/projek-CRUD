import React from "react";
import { useShop } from "../../context/ShopContext";
import AdminOverview from "./AdminOverview";
import AdminProducts from "./AdminProducts";
import AdminUsers from "./AdminUsers";
import {
  LayoutDashboard,
  Package,
  Users,
  Store,
  Sparkles,
} from "lucide-react";

export default function AdminDashboard() {
  const {
    adminActiveTab,
    setAdminActiveTab,
    setCurrentPage,
    user,
    products,
    users,
  } = useShop();

  return (
    <div className="admin-dashboard-layout" id="admin-dashboard-root">
      {/* Admin Top Header Navigation */}
      <header className="admin-top-nav">
        <div className="container admin-top-container">
          <div className="admin-top-left">
            <button
              id="admin-back-to-store-btn"
              className="btn btn-secondary btn-sm-action back-store-btn"
              onClick={() => setCurrentPage("shop")}
              title="Kembali ke tampilan toko e-commerce"
            >
              <Store size={16} />
              <span>Kembali ke Toko Lumina</span>
            </button>

            <div className="admin-brand-badge">
              <div className="logo-icon-wrapper" style={{ width: 32, height: 32 }}>
                <Sparkles size={16} />
              </div>
              <div className="admin-title-wrap">
                <span className="admin-brand-name">Lumina Console</span>
                <span className="admin-version-tag">Admin v2.6 Enterprise</span>
              </div>
            </div>
          </div>

          <div className="admin-top-right">
            <div className="admin-user-pill">
              <img
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
                }
                alt="Admin"
                className="admin-avatar"
              />
              <div className="admin-user-details">
                <span className="admin-name">{user ? user.name : "Admin System"}</span>
                <span className="admin-role-label">Super Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Subheader Tabs Bar */}
      <div className="admin-subnav-bar">
        <div className="container admin-tabs-container">
          <nav className="admin-tabs-list" role="tablist">
            <button
              id="admin-tab-overview"
              role="tab"
              aria-selected={adminActiveTab === "overview"}
              className={`admin-tab-nav-btn ${
                adminActiveTab === "overview" ? "active" : ""
              }`}
              onClick={() => setAdminActiveTab("overview")}
            >
              <LayoutDashboard size={18} />
              <span>Ringkasan Eksekutif</span>
            </button>

            <button
              id="admin-tab-products"
              role="tab"
              aria-selected={adminActiveTab === "products"}
              className={`admin-tab-nav-btn ${
                adminActiveTab === "products" ? "active" : ""
              }`}
              onClick={() => setAdminActiveTab("products")}
            >
              <Package size={18} />
              <span>Manajemen Produk ({products.length})</span>
            </button>

            <button
              id="admin-tab-users"
              role="tab"
              aria-selected={adminActiveTab === "users"}
              className={`admin-tab-nav-btn ${
                adminActiveTab === "users" ? "active" : ""
              }`}
              onClick={() => setAdminActiveTab("users")}
            >
              <Users size={18} />
              <span>Manajemen Pengguna ({users.length})</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Tab Content View */}
      <main className="container admin-main-content">
        {adminActiveTab === "overview" && (
          <AdminOverview onNavigateTab={(tab) => setAdminActiveTab(tab)} />
        )}
        {adminActiveTab === "products" && <AdminProducts />}
        {adminActiveTab === "users" && <AdminUsers />}
      </main>
    </div>
  );
}
