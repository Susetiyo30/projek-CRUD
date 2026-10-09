import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function HeroBanner() {
  const { setSelectedCategory } = useShop();

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-section" id="hero-banner">
      <div className="container hero-container">
        <div className="hero-grid">
          {/* Hero Content Left */}
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} className="sparkle-icon" />
              <span>KOLEKSI FLAGSHIP TERBARU 2026</span>
            </div>

            <h1 className="hero-title">
              Inovasi Teknologi <br />
              <span className="gradient-text">Tanpa Kompromi.</span>
            </h1>

            <p className="hero-description">
              Temukan pengalaman audio spatial studio, smartwatch berketahanan titanium militer,
              dan ekosistem gadget cerdas yang dirancang untuk performa puncak Anda.
            </p>

            <div className="hero-actions">
              <button
                id="hero-explore-btn"
                onClick={scrollToCatalog}
                className="btn btn-primary hero-cta-btn"
              >
                <span>Eksplorasi Katalog</span>
                <ArrowRight size={18} />
              </button>
              <button
                id="hero-deal-btn"
                onClick={() => {
                  setSelectedCategory("audio");
                  scrollToCatalog();
                }}
                className="btn btn-secondary hero-secondary-btn"
              >
                Koleksi Audio Flagship
              </button>
            </div>

            {/* Micro Stats */}
            <div className="hero-stats-row">
              <div className="hero-stat-card">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Pelanggan Puas</span>
              </div>
              <div className="stat-divider"></div>
              <div className="hero-stat-card">
                <span className="stat-number">4.9 ★</span>
                <span className="stat-label">Rating Rata-rata</span>
              </div>
              <div className="stat-divider"></div>
              <div className="hero-stat-card">
                <span className="stat-number">100%</span>
                <span className="stat-label">Original &amp; Garansi</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Right */}
          <div className="hero-visual-wrapper">
            <div className="hero-visual-glow"></div>
            <div className="hero-card-frame">
              <img
                src="/hero-banner.jpg"
                alt="Lumina Flagship Tech Showcase"
                className="hero-image"
                loading="eager"
              />
              <div className="hero-floating-card top-float">
                <div className="floating-dot"></div>
                <div>
                  <span className="floating-title">Aura Spatial Sound</span>
                  <span className="floating-sub">Hi-Res LDAC Audio</span>
                </div>
              </div>
              <div className="hero-floating-card bottom-float">
                <Award size={18} className="award-icon" />
                <div>
                  <span className="floating-title">Best Tech Award</span>
                  <span className="floating-sub">Pilihan Editor 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Strip */}
        <div className="hero-features-strip">
          <div className="feature-item">
            <div className="feature-icon-box">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="feature-title">Pengiriman Kilat Cepat</h4>
              <p className="feature-sub">Gratis ongkir untuk order &gt; $100</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-box">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="feature-title">Garansi Resmi 100%</h4>
              <p className="feature-sub">Klaim ganti baru dalam 14 hari</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-box">
              <RotateCcw size={20} />
            </div>
            <div>
              <h4 className="feature-title">Pengembalian Mudah</h4>
              <p className="feature-sub">Jaminan uang kembali tanpa repot</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
