import React from "react";
import "./App.css";
import { ShopProvider, useShop } from "./context/ShopContext";
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import Filters from "./components/Filters";
import ProductGrid from "./components/ProductGrid";
import QuickViewModal from "./components/QuickViewModal";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import CheckoutModal from "./components/CheckoutModal";
import AuthModal from "./components/AuthModal";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import ToastContainer from "./components/ToastContainer";
import Footer from "./components/Footer";

function AppContent() {
  const { currentPage } = useShop();

  if (currentPage === "admin") {
    return (
      <div className="admin-app-shell">
        <AdminDashboard />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main id="main-content">
        {currentPage === "login" ? (
          <LoginPage />
        ) : (
          <>
            <HeroBanner />
            <Filters />
            <ProductGrid />
          </>
        )}
      </main>

      <Footer />

      {/* Global Drawers & Modals */}
      <AuthModal />
      <QuickViewModal />
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
