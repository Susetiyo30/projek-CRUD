import React, { useState, useEffect, useRef } from "react";
import { useShop } from "../context/ShopContext";
import {
  Search,
  ShoppingCart,
  Heart,
  Sun,
  Moon,
  Sparkles,
  X,
  Menu,
  ShieldCheck,
  Zap,
  User,
  LogOut,
  ChevronDown,
  LogIn,
} from "lucide-react";
import { CATEGORIES } from "../data/products";

export default function Navbar() {
  const {
    theme,
    toggleTheme,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    user,
    openAuth,
    logout,
    currentPage,
    setCurrentPage,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div id="top-announcement-bar" className="top-ticker-bar">
        <div className="container ticker-container">
          <div className="ticker-item">
            <Zap size={14} className="ticker-icon" />
            <span>
              <strong>KILAT FLASH SALE:</strong> Gunakan kode kupon{" "}
              <span className="code-badge">LUMINA20</span> untuk Diskon 20% + Gratis Ongkir!
            </span>
          </div>
          <div className="ticker-right">
            <button
              id="top-admin-nav-btn"
              className="top-ticker-link admin-highlight-link"
              onClick={() => setCurrentPage("admin")}
              title="Akses Konsol Admin untuk CRUD Produk & Pengguna"
            >
              👑 Panel Admin (CRUD)
            </button>
            <span className="ticker-sep">|</span>
            <button
              id="top-login-switch-btn"
              className="top-ticker-link"
              onClick={() => {
                if (user) {
                  openAuth("login");
                } else {
                  setCurrentPage("login");
                }
              }}
            >
              {user ? `Akun: ${user.name} (${user.role})` : "Masuk / Halaman Login"}
            </button>
            <span className="ticker-guarantee">
              <ShieldCheck size={14} /> Garansi Resmi 1 Tahun
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className={`navbar-header ${isScrolled ? "navbar-scrolled" : ""}`}>
        <div className="container navbar-inner">
          {/* Brand Logo */}
          <a
            href="#"
            className="brand-logo"
            id="brand-logo-link"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage("shop");
            }}
          >
            <div className="logo-icon-wrapper">
              <Sparkles size={22} className="logo-icon" />
            </div>
            <div className="logo-text-group">
              <span className="logo-title">LUMINA</span>
              <span className="logo-subtitle">COMMERCE</span>
            </div>
          </a>

          {/* Search Box */}
          <div className="search-bar-wrapper">
            <Search size={18} className="search-icon-inside" />
            <input
              ref={searchInputRef}
              id="global-search-input"
              type="text"
              placeholder="Cari headphone, smartwatch, smartphone... (tekan '/')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery ? (
              <button
                id="clear-search-btn"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
                title="Hapus pencarian"
              >
                <X size={15} />
              </button>
            ) : (
              <span className="search-shortcut-badge">/</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="navbar-actions">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="action-btn"
              title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Wishlist Button */}
            <button
              id="open-wishlist-btn"
              onClick={() => setIsWishlistOpen(true)}
              className="action-btn"
              title="Daftar Keinginan (Wishlist)"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="action-badge pulse-badge" id="wishlist-badge">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="open-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="action-btn cart-btn-action"
              title="Buka Keranjang Belanja"
            >
              <ShoppingCart size={20} />
              <span className="cart-btn-label">Keranjang</span>
              {cartCount > 0 && (
                <span className="action-badge" id="cart-badge">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Auth Profile / Login Button */}
            <div className="user-nav-wrapper" ref={userDropdownRef}>
              {user ? (
                <div className="user-profile-button-container">
                  <button
                    id="user-profile-menu-btn"
                    className="action-btn user-logged-btn"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    title="Menu Akun Saya"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="user-nav-avatar"
                    />
                    <span className="user-nav-name">{user.name.split(" ")[0]}</span>
                    <ChevronDown size={14} className="user-chevron-icon" />
                  </button>

                  {userDropdownOpen && (
                    <div className="user-dropdown-panel glass-panel">
                      <div className="user-dropdown-header">
                        <span className="user-dropdown-name">{user.name}</span>
                        <span className="user-dropdown-email">{user.email}</span>
                        <div className="user-role-badge">
                          <Sparkles size={12} />
                          <span>{user.role} • {user.rewardPoints} Poin</span>
                        </div>
                      </div>
                      <div className="user-dropdown-menu">
                        <button
                          className="dropdown-menu-item"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setCurrentPage("shop");
                          }}
                        >
                          Beranda Belanja
                        </button>
                        <button
                          className="dropdown-menu-item"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setIsWishlistOpen(true);
                          }}
                        >
                          Wishlist Saya ({wishlist.length})
                        </button>
                        <button
                          className="dropdown-menu-item"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setIsCartOpen(true);
                          }}
                        >
                          Tas Belanja ({cartCount})
                        </button>
                        <div className="dropdown-divider"></div>
                        <button
                          id="dropdown-admin-btn"
                          className="dropdown-menu-item admin-menu-item"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setCurrentPage("admin");
                          }}
                        >
                          <ShieldCheck size={16} />
                          <span>Panel Admin (CRUD)</span>
                        </button>
                        <div className="dropdown-divider"></div>
                        <button
                          id="nav-logout-btn"
                          className="dropdown-menu-item logout-item"
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                        >
                          <LogOut size={16} />
                          <span>Keluar Akun</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-btn-options">
                  <button
                    id="nav-login-btn"
                    className="action-btn auth-login-btn"
                    onClick={() => openAuth("login")}
                    title="Buka Popup Masuk"
                  >
                    <LogIn size={18} />
                    <span>Masuk</span>
                  </button>
                  <button
                    id="nav-page-login-btn"
                    className="btn btn-secondary page-login-shortcut-btn"
                    onClick={() => setCurrentPage("login")}
                    title="Buka Halaman Login Lengkap"
                  >
                    Halaman Login
                  </button>
                </div>
              )}
            </div>

            {/* Direct Admin Console Access Button */}
            <button
              id="nav-admin-direct-btn"
              className="btn btn-secondary admin-shortcut-btn"
              onClick={() => setCurrentPage("admin")}
              title="Akses Konsol Admin (CRUD Produk & Pengguna)"
            >
              <ShieldCheck size={16} className="admin-icon-glow" />
              <span className="admin-btn-label">Admin CRUD</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              className="action-btn mobile-only-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Menu Kategori"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Navigation Panel */}
        {mobileMenuOpen && (
          <div className="mobile-nav-panel">
            <div className="container mobile-nav-content">
              {/* Mobile Auth Button */}
              <div className="mobile-auth-bar">
                {user ? (
                  <div className="mobile-user-info">
                    <img src={user.avatar} alt={user.name} className="user-nav-avatar" />
                    <div>
                      <strong>{user.name}</strong>
                      <span className="mobile-user-role">{user.role}</span>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm-action"
                      onClick={() => logout()}
                    >
                      Keluar
                    </button>
                  </div>
                ) : (
                  <div className="mobile-auth-actions">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => {
                        openAuth("login");
                        setMobileMenuOpen(false);
                      }}
                    >
                      Masuk / Daftar Akun
                    </button>
                    <button
                      className="btn btn-secondary btn-block"
                      onClick={() => {
                        setCurrentPage("login");
                        setMobileMenuOpen(false);
                      }}
                    >
                      Buka Tampilan Halaman Login
                    </button>
                  </div>
                )}
                <div style={{ marginTop: 8 }}>
                  <button
                    id="mobile-admin-btn"
                    className="btn btn-primary btn-block"
                    onClick={() => {
                      setCurrentPage("admin");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>Buka Panel Admin CRUD</span>
                  </button>
                </div>
              </div>

              <div className="mobile-search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Cari produk gadget..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="mobile-categories-list">
                <span className="mobile-cat-title">Pilih Kategori:</span>
                <div className="mobile-cat-grid">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      className={`mobile-cat-pill ${
                        selectedCategory === cat.slug ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setCurrentPage("shop");
                        setMobileMenuOpen(false);
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
