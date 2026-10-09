import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    register,
    addToast,
  } = useShop();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: true,
    agreeTerms: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAuthModalOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsAuthModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleQuickDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login("alex.kurniawan@lumina.id", "password123", true);
      setLoading(false);
    }, 400);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      addToast("Data Belum Lengkap", "Silakan isi email dan kata sandi Anda.", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(formData.email, formData.password, false);
      setLoading(false);
    }, 500);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      addToast("Data Belum Lengkap", "Silakan isi semua kolom yang diperlukan.", "error");
      return;
    }
    if (formData.password.length < 6) {
      addToast("Password Terlalu Pendek", "Kata sandi minimal harus 6 karakter.", "error");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      addToast("Konfirmasi Tidak Sesuai", "Kata sandi konfirmasi tidak cocok.", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      register(formData.fullName, formData.email, formData.password);
      setLoading(false);
    }, 600);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) {
      addToast("Email Diperlukan", "Masukkan alamat email Anda.", "error");
      return;
    }
    addToast(
      "Instruksi Terkirim!",
      `Tautan pemulihan kata sandi telah dikirimkan ke ${formData.email}.`,
      "success"
    );
    setAuthMode("login");
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div
        className="auth-modal-card glass-panel"
        id="auth-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-auth-modal-btn"
          className="modal-close-btn"
          onClick={() => setIsAuthModalOpen(false)}
          title="Tutup Autentikasi"
        >
          <X size={20} />
        </button>

        {/* Modal Brand Header */}
        <div className="auth-header-center">
          <div className="logo-icon-wrapper auth-logo-icon">
            <Sparkles size={22} className="logo-icon" />
          </div>
          <h2 className="auth-modal-title">
            {authMode === "login" && "Selamat Datang di Lumina"}
            {authMode === "register" && "Buat Akun Lumina Baru"}
            {authMode === "forgot" && "Atur Ulang Kata Sandi"}
          </h2>
          <p className="auth-modal-subtitle">
            {authMode === "login" &&
              "Akses keranjang tersimpan, promo VIP, dan pantau pengiriman pesanan Anda."}
            {authMode === "register" &&
              "Bergabung sekarang dan dapatkan voucher selamat datang 10% + 100 reward points."}
            {authMode === "forgot" &&
              "Masukkan email akun Anda untuk menerima tautan pemulihan sandi."}
          </p>
        </div>

        {/* Auth Mode Tabs (Login / Register) */}
        {authMode !== "forgot" && (
          <div className="auth-tabs-row" role="tablist">
            <button
              id="tab-auth-login"
              role="tab"
              aria-selected={authMode === "login"}
              className={`auth-tab-btn ${authMode === "login" ? "active" : ""}`}
              onClick={() => setAuthMode("login")}
            >
              Masuk Akun
            </button>
            <button
              id="tab-auth-register"
              role="tab"
              aria-selected={authMode === "register"}
              className={`auth-tab-btn ${authMode === "register" ? "active" : ""}`}
              onClick={() => setAuthMode("register")}
            >
              Daftar Member
            </button>
          </div>
        )}

        {/* Quick Demo Login One-Click Bar */}
        {authMode === "login" && (
          <div className="demo-login-box">
            <button
              id="quick-demo-login-btn"
              type="button"
              className="btn btn-secondary demo-quick-btn"
              onClick={handleQuickDemoLogin}
              disabled={loading}
            >
              <Zap size={16} className="zap-accent-icon" />
              <span>Masuk Cepat Demo (Alex Kurniawan - VIP)</span>
            </button>
            <div className="auth-divider-line">
              <span>atau gunakan email</span>
            </div>
          </div>
        )}

        {/* Form Body */}
        {authMode === "login" && (
          <form onSubmit={handleLoginSubmit} className="auth-form" id="login-form">
            <div className="input-group">
              <label htmlFor="login-email">Email Terdaftar</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-field-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="label-with-link">
                <label htmlFor="login-password">Kata Sandi</label>
                <button
                  id="forgot-password-link"
                  type="button"
                  className="auth-link-btn"
                  onClick={() => setAuthMode("forgot")}
                >
                  Lupa sandi?
                </button>
              </div>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-field-icon" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-remember-row">
              <label className="checkbox-custom-label">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <span className="checkbox-box">
                  {formData.rememberMe && <CheckCircle2 size={14} />}
                </span>
                <span>Ingat saya di perangkat ini</span>
              </label>
            </div>

            <button
              id="submit-login-btn"
              type="submit"
              className="btn btn-primary btn-block auth-submit-btn"
              disabled={loading}
            >
              <span>{loading ? "Memproses..." : "Masuk ke Akun Lumina"}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* Register Form */}
        {authMode === "register" && (
          <form onSubmit={handleRegisterSubmit} className="auth-form" id="register-form">
            <div className="input-group">
              <label htmlFor="register-name">Nama Lengkap</label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-field-icon" />
                <input
                  id="register-name"
                  type="text"
                  placeholder="Contoh: Rian Pratama"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="register-email">Alamat Email</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-field-icon" />
                <input
                  id="register-email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="input-group">
                <label htmlFor="register-password">Kata Sandi</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-field-icon" />
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 Karakter"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="register-confirm">Konfirmasi Sandi</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-field-icon" />
                  <input
                    id="register-confirm"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ketik Ulang Sandi"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className="auth-remember-row">
              <label className="checkbox-custom-label">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  required
                />
                <span className="checkbox-box">
                  {formData.agreeTerms && <CheckCircle2 size={14} />}
                </span>
                <span>Saya menyetujui Syarat &amp; Kebijakan Privasi Lumina</span>
              </label>
            </div>

            <button
              id="submit-register-btn"
              type="submit"
              className="btn btn-primary btn-block auth-submit-btn"
              disabled={loading}
            >
              <span>{loading ? "Mendaftarkan..." : "Daftar & Klaim Voucher 10%"}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* Forgot Password Form */}
        {authMode === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="auth-form" id="forgot-form">
            <div className="input-group">
              <label htmlFor="forgot-email">Alamat Email Terdaftar</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-field-icon" />
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              id="submit-forgot-btn"
              type="submit"
              className="btn btn-primary btn-block auth-submit-btn"
            >
              Kirim Tautan Pemulihan
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-block auth-back-btn"
              onClick={() => setAuthMode("login")}
            >
              Kembali ke Halaman Masuk
            </button>
          </form>
        )}

        {/* Social Authentication */}
        {authMode !== "forgot" && (
          <div className="social-auth-section">
            <div className="auth-divider-line">
              <span>atau masuk dengan</span>
            </div>
            <div className="social-buttons-grid">
              <button
                type="button"
                className="btn btn-secondary social-btn"
                onClick={() => {
                  login("google.user@gmail.com", "pass", true);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17c1.8 3.7 5.6 6.5 10.1 6.5z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary social-btn"
                onClick={() => {
                  login("apple.user@icloud.com", "pass", true);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.56.64-1.06 1.7-0.93 2.73 1.01.08 2.04-.48 2.66-1.23z" />
                </svg>
                <span>Apple ID</span>
              </button>
            </div>
          </div>
        )}

        {/* Security Trust Note */}
        <div className="auth-security-footer">
          <ShieldCheck size={15} />
          <span>Dilindungi dengan enkripsi 256-bit SSL &amp; otentikasi aman</span>
        </div>
      </div>
    </div>
  );
}
