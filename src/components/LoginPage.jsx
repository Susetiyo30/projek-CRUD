import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import {
  ArrowLeft,
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Gift,
  Truck,
  Award,
} from "lucide-react";

export default function LoginPage() {
  const { setCurrentPage, login, register, addToast } = useShop();

  const [mode, setMode] = useState("login"); // 'login' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: true,
    agreeTerms: true,
  });

  const handleQuickDemo = () => {
    setLoading(true);
    setTimeout(() => {
      login("alex.kurniawan@lumina.id", "password123", true);
      setLoading(false);
    }, 400);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      addToast("Harap Isi Semua Kolom", "Masukkan alamat email dan kata sandi.", "error");
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
      addToast("Harap Isi Semua Kolom", "Lengkapi seluruh informasi formulir.", "error");
      return;
    }
    if (formData.password.length < 6) {
      addToast("Password Terlalu Pendek", "Kata sandi minimal 6 karakter.", "error");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      addToast("Konfirmasi Sandi Gagal", "Kata sandi konfirmasi tidak cocok.", "error");
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
      addToast("Email Belum Diisi", "Masukkan alamat email akun Anda.", "error");
      return;
    }
    addToast(
      "Instruksi Terkirim",
      `Petunjuk pemulihan kata sandi telah dikirim ke ${formData.email}.`,
      "success"
    );
    setMode("login");
  };

  return (
    <div className="login-page-wrapper" id="login-page-screen">
      {/* Top Header Bar with Back Button */}
      <div className="login-top-bar">
        <div className="container login-top-container">
          <button
            id="back-to-shop-btn"
            className="btn btn-secondary back-to-shop-btn"
            onClick={() => setCurrentPage("shop")}
          >
            <ArrowLeft size={18} />
            <span>Kembali ke Beranda Belanja</span>
          </button>

          <div className="login-brand-minimal">
            <div className="logo-icon-wrapper" style={{ width: 34, height: 34 }}>
              <Sparkles size={18} />
            </div>
            <span className="logo-title" style={{ fontSize: "1.1rem" }}>
              LUMINA
            </span>
          </div>
        </div>
      </div>

      {/* Main Dual-Column Content */}
      <div className="container login-main-container">
        <div className="login-grid-split">
          {/* Left Column: Visual & Benefits */}
          <div className="login-showcase-col glass-panel">
            <div className="showcase-badge">
              <Sparkles size={16} />
              <span>LUMINA VIP MEMBERSHIP</span>
            </div>

            <h2 className="showcase-title">
              Satu Akun untuk Seluruh Ekosistem <br />
              <span className="gradient-text">Teknologi Modern.</span>
            </h2>

            <p className="showcase-desc">
              Nikmati kenyamanan bertransaksi dengan proteksi garansi premium, pelacakan pesanan
              real-time, serta akses perdana ke rilisan perangkat flagship terbatas.
            </p>

            <div className="vip-perks-list">
              <div className="vip-perk-item">
                <div className="perk-icon-wrap">
                  <Gift size={20} />
                </div>
                <div>
                  <h4 className="perk-heading">Diskon Sambutan 10% + 100 Poin</h4>
                  <p className="perk-text">Dapatkan potongan instan pada transaksi perdana Anda.</p>
                </div>
              </div>

              <div className="vip-perk-item">
                <div className="perk-icon-wrap">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="perk-heading">Prioritas Bebas Ongkir Kilat</h4>
                  <p className="perk-text">Pengiriman ekspres sampai lebih cepat ke seluruh kota.</p>
                </div>
              </div>

              <div className="vip-perk-item">
                <div className="perk-icon-wrap">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="perk-heading">Garansi Tukar Baru 14 Hari</h4>
                  <p className="perk-text">Layanan klaim prioritas tanpa proses verifikasi rumit.</p>
                </div>
              </div>
            </div>

            <div className="showcase-image-banner">
              <img
                src="/hero-banner.jpg"
                alt="Lumina Luxury Tech"
                className="showcase-banner-img"
              />
            </div>
          </div>

          {/* Right Column: Authentication Card Form */}
          <div className="login-form-col glass-panel">
            {/* Header */}
            <div className="form-header-center">
              <h2 className="form-title">
                {mode === "login" && "Masuk ke Akun Anda"}
                {mode === "register" && "Buat Akun Member Baru"}
                {mode === "forgot" && "Reset Kata Sandi"}
              </h2>
              <p className="form-subtitle">
                {mode === "login" && "Selamat datang kembali! Masukkan detail akun Anda."}
                {mode === "register" && "Isi form singkat untuk membuat akun Lumina VIP."}
                {mode === "forgot" && "Kami akan mengirim tautan pemulihan ke email Anda."}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            {mode !== "forgot" && (
              <div className="auth-tabs-row" role="tablist">
                <button
                  id="page-tab-login"
                  role="tab"
                  aria-selected={mode === "login"}
                  className={`auth-tab-btn ${mode === "login" ? "active" : ""}`}
                  onClick={() => setMode("login")}
                >
                  Masuk Akun
                </button>
                <button
                  id="page-tab-register"
                  role="tab"
                  aria-selected={mode === "register"}
                  className={`auth-tab-btn ${mode === "register" ? "active" : ""}`}
                  onClick={() => setMode("register")}
                >
                  Daftar Akun Baru
                </button>
              </div>
            )}

            {/* Quick Demo Login Button */}
            {mode === "login" && (
              <div className="demo-login-box">
                <button
                  id="page-quick-demo-btn"
                  type="button"
                  className="btn btn-secondary demo-quick-btn"
                  onClick={handleQuickDemo}
                  disabled={loading}
                >
                  <Zap size={16} className="zap-accent-icon" />
                  <span>Masuk Cepat Demo (Alex Kurniawan - VIP)</span>
                </button>
                <div className="auth-divider-line">
                  <span>atau gunakan akun email Anda</span>
                </div>
              </div>
            )}

            {/* Login Form */}
            {mode === "login" && (
              <form onSubmit={handleLoginSubmit} className="auth-form" id="page-login-form">
                <div className="input-group">
                  <label htmlFor="page-email">Email Terdaftar</label>
                  <div className="auth-input-wrapper">
                    <Mail size={18} className="auth-field-icon" />
                    <input
                      id="page-email"
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
                    <label htmlFor="page-password">Kata Sandi</label>
                    <button
                      id="page-forgot-link"
                      type="button"
                      className="auth-link-btn"
                      onClick={() => setMode("forgot")}
                    >
                      Lupa sandi?
                    </button>
                  </div>
                  <div className="auth-input-wrapper">
                    <Lock size={18} className="auth-field-icon" />
                    <input
                      id="page-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={() => setShowPassword(!showPassword)}
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
                      onChange={(e) =>
                        setFormData({ ...formData, rememberMe: e.target.checked })
                      }
                    />
                    <span className="checkbox-box">
                      {formData.rememberMe && <CheckCircle2 size={14} />}
                    </span>
                    <span>Ingat saya di perangkat ini</span>
                  </label>
                </div>

                <button
                  id="page-submit-login-btn"
                  type="submit"
                  className="btn btn-primary btn-block auth-submit-btn"
                  disabled={loading}
                >
                  <span>{loading ? "Memproses..." : "Masuk ke Akun Lumina"}</span>
                  <Zap size={18} />
                </button>
              </form>
            )}

            {/* Register Form */}
            {mode === "register" && (
              <form onSubmit={handleRegisterSubmit} className="auth-form" id="page-register-form">
                <div className="input-group">
                  <label htmlFor="page-reg-name">Nama Lengkap</label>
                  <div className="auth-input-wrapper">
                    <User size={18} className="auth-field-icon" />
                    <input
                      id="page-reg-name"
                      type="text"
                      placeholder="Nama Lengkap Anda"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="page-reg-email">Alamat Email</label>
                  <div className="auth-input-wrapper">
                    <Mail size={18} className="auth-field-icon" />
                    <input
                      id="page-reg-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="input-group">
                    <label htmlFor="page-reg-password">Kata Sandi</label>
                    <div className="auth-input-wrapper">
                      <Lock size={18} className="auth-field-icon" />
                      <input
                        id="page-reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 6 Karakter"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="page-reg-confirm">Konfirmasi Sandi</label>
                    <div className="auth-input-wrapper">
                      <Lock size={18} className="auth-field-icon" />
                      <input
                        id="page-reg-confirm"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ulangi Sandi"
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
                      onChange={(e) =>
                        setFormData({ ...formData, agreeTerms: e.target.checked })
                      }
                      required
                    />
                    <span className="checkbox-box">
                      {formData.agreeTerms && <CheckCircle2 size={14} />}
                    </span>
                    <span>Saya menyetujui Syarat Layanan &amp; Kebijakan Privasi</span>
                  </label>
                </div>

                <button
                  id="page-submit-reg-btn"
                  type="submit"
                  className="btn btn-primary btn-block auth-submit-btn"
                  disabled={loading}
                >
                  <span>{loading ? "Mendaftarkan..." : "Daftar & Klaim Voucher 10%"}</span>
                  <Sparkles size={18} />
                </button>
              </form>
            )}

            {/* Forgot Form */}
            {mode === "forgot" && (
              <form onSubmit={handleForgotSubmit} className="auth-form" id="page-forgot-form">
                <div className="input-group">
                  <label htmlFor="page-forgot-email">Email Terdaftar</label>
                  <div className="auth-input-wrapper">
                    <Mail size={18} className="auth-field-icon" />
                    <input
                      id="page-forgot-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <button
                  id="page-submit-forgot-btn"
                  type="submit"
                  className="btn btn-primary btn-block auth-submit-btn"
                >
                  Kirim Tautan Pemulihan Sandi
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-block auth-back-btn"
                  onClick={() => setMode("login")}
                >
                  Kembali ke Halaman Masuk
                </button>
              </form>
            )}

            {/* Social Logins */}
            {mode !== "forgot" && (
              <div className="social-auth-section">
                <div className="auth-divider-line">
                  <span>atau masuk instan dengan</span>
                </div>
                <div className="social-buttons-grid">
                  <button
                    type="button"
                    className="btn btn-secondary social-btn"
                    onClick={() => login("google.user@gmail.com", "pass", true)}
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
                    onClick={() => login("apple.user@icloud.com", "pass", true)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.56.64-1.06 1.7-0.93 2.73 1.01.08 2.04-.48 2.66-1.23z" />
                    </svg>
                    <span>Apple ID</span>
                  </button>
                </div>
              </div>
            )}

            <div className="auth-security-footer">
              <ShieldCheck size={15} />
              <span>Proteksi Enkripsi SSL 256-Bit Aman &amp; Terverifikasi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
