import React from "react";
import { useShop } from "../../context/ShopContext";
import {
  DollarSign,
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Plus,
  RefreshCw,
} from "lucide-react";

export default function AdminOverview({ onNavigateTab }) {
  const { products, users, resetProductsToDefault, resetUsersToDefault } = useShop();

  // Metrics computation
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Aktif").length;
  const totalStockInventory = products.reduce((sum, p) => sum + (p.stockCount || 0), 0);
  const totalUserSpending = users.reduce((sum, u) => sum + (u.totalSpent || 0), 0);

  return (
    <div className="admin-overview-container">
      {/* Top Welcome & Actions Row */}
      <div className="admin-section-header">
        <div>
          <h2 className="admin-page-title">Executive Dashboard</h2>
          <p className="admin-page-desc">
            Pantau performa penjualan, kelola katalog produk, dan kontrol hak akses pengguna secara real-time.
          </p>
        </div>
        <div className="admin-header-actions">
          <button
            id="admin-quick-add-prod-btn"
            className="btn btn-primary btn-sm-action"
            onClick={() => onNavigateTab("products")}
          >
            <Plus size={16} />
            <span>Kelola Produk</span>
          </button>
          <button
            id="admin-quick-add-user-btn"
            className="btn btn-secondary btn-sm-action"
            onClick={() => onNavigateTab("users")}
          >
            <Users size={16} />
            <span>Kelola Pengguna</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card glass-panel">
          <div className="kpi-icon-box kpi-icon-green">
            <DollarSign size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Total Omset Penjualan</span>
            <div className="kpi-value-row">
              <span className="kpi-value">${totalUserSpending.toLocaleString()}</span>
              <span className="kpi-trend positive">
                <TrendingUp size={14} /> +24.8%
              </span>
            </div>
            <span className="kpi-subtext">Dari 6 akun member aktif</span>
          </div>
        </div>

        <div className="admin-kpi-card glass-panel">
          <div className="kpi-icon-box kpi-icon-indigo">
            <Package size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Total Item Katalog</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{totalProducts} SKU</span>
              <span className="kpi-badge-info">{inStockProducts} Tersedia</span>
            </div>
            <span className="kpi-subtext">Total stok fisik: {totalStockInventory} unit</span>
          </div>
        </div>

        <div className="admin-kpi-card glass-panel">
          <div className="kpi-icon-box kpi-icon-cyan">
            <Users size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Pengguna Terdaftar</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{totalUsers} User</span>
              <span className="kpi-trend positive">
                <ArrowUpRight size={14} /> {activeUsers} Aktif
              </span>
            </div>
            <span className="kpi-subtext">2 Admin, 4 Member &amp; VIP</span>
          </div>
        </div>

        <div className="admin-kpi-card glass-panel">
          <div className="kpi-icon-box kpi-icon-pink">
            <ShoppingBag size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Transaksi Selesai</span>
            <div className="kpi-value-row">
              <span className="kpi-value">148 Order</span>
              <span className="kpi-trend positive">
                <Sparkles size={14} /> 99.4% Sukses
              </span>
            </div>
            <span className="kpi-subtext">Waktu kirim rata-rata: 1.2 hari</span>
          </div>
        </div>
      </div>

      {/* Sales Analytics Chart & Recent Activity */}
      <div className="admin-analytics-grid">
        {/* Left: Performance Visual Bar Representation */}
        <div className="admin-panel-card glass-panel">
          <div className="card-header-flex">
            <div>
              <h3 className="card-box-title">Tren Penjualan Mingguan</h3>
              <p className="card-box-subtitle">Grafik transaksi 7 hari terakhir (dalam ribuan USD)</p>
            </div>
            <span className="badge badge-primary">Q4 2026</span>
          </div>

          <div className="sales-bars-chart">
            {[
              { day: "Sen", val: 42, amount: "$4,200" },
              { day: "Sel", val: 68, amount: "$6,800" },
              { day: "Rab", val: 55, amount: "$5,500" },
              { day: "Kam", val: 89, amount: "$8,900" },
              { day: "Jum", val: 95, amount: "$9,500" },
              { day: "Sab", val: 120, amount: "$12,000" },
              { day: "Min", val: 110, amount: "$11,000" },
            ].map((bar, i) => (
              <div key={i} className="chart-bar-col">
                <div className="bar-tooltip">{bar.amount}</div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ height: `${(bar.val / 120) * 100}%` }}
                  ></div>
                </div>
                <span className="bar-day-label">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Recent Orders & Health */}
        <div className="admin-panel-card glass-panel">
          <div className="card-header-flex">
            <h3 className="card-box-title">Status Sistem &amp; Log Cepat</h3>
            <span className="badge badge-success">Sistem Normal</span>
          </div>

          <div className="admin-status-list">
            <div className="status-item-row">
              <div className="status-dot green-dot"></div>
              <div className="status-item-info">
                <strong>Penyimpanan Database Lokal (LocalStorage)</strong>
                <p>Aktif &amp; tersinkronisasi otomatis (Produk, Pengguna, Keranjang)</p>
              </div>
            </div>

            <div className="status-item-row">
              <div className="status-dot green-dot"></div>
              <div className="status-item-info">
                <strong>Enkripsi Sesi Pengguna &amp; Token</strong>
                <p>Otentikasi aman berbasis peran (Role-Based Access Control)</p>
              </div>
            </div>

            <div className="status-item-row">
              <div className="status-dot green-dot"></div>
              <div className="status-item-info">
                <strong>Inventaris Stok Real-time</strong>
                <p>{products.filter((p) => p.stockCount <= 5).length} produk mendekati batas stok minimum</p>
              </div>
            </div>
          </div>

          <div className="admin-system-actions">
            <button
              id="admin-reset-products-btn"
              className="btn btn-secondary btn-sm-action"
              onClick={resetProductsToDefault}
              title="Kembalikan katalog ke 8 produk bawaan"
            >
              <RefreshCw size={14} />
              <span>Reset Katalog Produk</span>
            </button>
            <button
              id="admin-reset-users-btn"
              className="btn btn-secondary btn-sm-action"
              onClick={resetUsersToDefault}
              title="Kembalikan pengguna ke 6 user bawaan"
            >
              <RefreshCw size={14} />
              <span>Reset Data Pengguna</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
