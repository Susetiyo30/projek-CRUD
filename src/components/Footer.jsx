import React, { useState } from "react";
import { Sparkles, Send, ShieldCheck, Truck, Headphones, Check } from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function Footer() {
  const { addToast } = useShop();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      addToast("Email Tidak Valid", "Silakan masukkan alamat email yang benar.", "error");
      return;
    }
    setSubscribed(true);
    addToast(
      "Berhasil Berlangganan!",
      "Voucher diskon 10% telah dikirim ke email Anda.",
      "success"
    );
  };

  return (
    <footer className="main-footer" id="main-footer">
      {/* Newsletter Box */}
      <div className="container">
        <div className="newsletter-banner glass-panel">
          <div className="newsletter-content">
            <div className="newsletter-badge">
              <Sparkles size={16} />
              <span>DAPATKAN DISKON TAMBAHAN</span>
            </div>
            <h3 className="newsletter-title">
              Gabung dengan Lumina VIP Club
            </h3>
            <p className="newsletter-desc">
              Dapatkan update peluncuran produk flagship, diskon eksklusif member, dan penawaran kilat mingguan.
            </p>
          </div>

          <div className="newsletter-form-col">
            {subscribed ? (
              <div className="subscribed-success-pill">
                <Check size={18} />
                <span>Terima kasih! Anda telah terdaftar sebagai Lumina VIP Member.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  id="newsletter-email-input"
                  type="email"
                  placeholder="Masukkan email Anda..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  id="newsletter-submit-btn"
                  type="submit"
                  className="btn btn-primary newsletter-btn"
                >
                  <span>Daftar</span>
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="footer-columns-grid">
          <div className="footer-col brand-col">
            <div className="logo-group-footer">
              <div className="logo-icon-wrapper">
                <Sparkles size={20} className="logo-icon" />
              </div>
              <span className="logo-title">LUMINA</span>
            </div>
            <p className="footer-brand-desc">
              Pusat ekosistem perangkat teknologi kelas premium. Kami menghadirkan inovasi mutakhir dengan pengalaman belanja mulus dan garansi resmi tanpa kompromi.
            </p>
            <div className="footer-trust-chips">
              <span className="trust-chip"><ShieldCheck size={14} /> 100% Produk Original</span>
              <span className="trust-chip"><Truck size={14} /> Pengiriman Kilat</span>
              <span className="trust-chip"><Headphones size={14} /> Dukungan 24/7</span>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Kategori</h4>
            <ul className="footer-links-list">
              <li><a href="#catalog-section">Audio &amp; Musik Spasial</a></li>
              <li><a href="#catalog-section">Smartwatch &amp; Wearables</a></li>
              <li><a href="#catalog-section">Smartphone Flagship</a></li>
              <li><a href="#catalog-section">Laptop &amp; Workstation</a></li>
              <li><a href="#catalog-section">Aksesoris Mechanical</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Layanan Pelanggan</h4>
            <ul className="footer-links-list">
              <li><a href="#catalog-section">Status Pengiriman</a></li>
              <li><a href="#catalog-section">Kebijakan Pengembalian</a></li>
              <li><a href="#catalog-section">Pusat Bantuan &amp; FAQ</a></li>
              <li><a href="#catalog-section">Klaim Garansi Resmi</a></li>
              <li><a href="#catalog-section">Panduan Ukuran &amp; Spesifikasi</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Tentang Lumina</h4>
            <ul className="footer-links-list">
              <li><a href="#catalog-section">Cerita Brand Kami</a></li>
              <li><a href="#catalog-section">Keberlanjutan &amp; Eco-Tech</a></li>
              <li><a href="#catalog-section">Program Mitra &amp; Karir</a></li>
              <li><a href="#catalog-section">Syarat &amp; Ketentuan</a></li>
              <li><a href="#catalog-section">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {new Date().getFullYear()} Lumina Commerce Inc. Dibuat dengan React JS &amp; Vite. Hak cipta dilindungi undang-undang.
          </p>
          <div className="payment-badges-row">
            <span className="pay-badge">VISA</span>
            <span className="pay-badge">MASTERCARD</span>
            <span className="pay-badge">QRIS</span>
            <span className="pay-badge">BCA</span>
            <span className="pay-badge">MANDIRI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
