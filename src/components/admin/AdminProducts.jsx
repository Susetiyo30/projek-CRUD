import React, { useState, useEffect } from "react";
import { useShop } from "../../context/ShopContext";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Package,
  Check,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { CATEGORIES } from "../../data/products";

const PRESET_IMAGES = [
  { label: "Headphones Pro", path: "/products/headphones.jpg" },
  { label: "Smartwatch Titanium", path: "/products/smartwatch.jpg" },
  { label: "Smartphone Flagship", path: "/products/smartphone.jpg" },
  { label: "Mechanical Keyboard", path: "/products/keyboard.jpg" },
  { label: "Gaming Mouse", path: "/products/mouse.jpg" },
  { label: "ANC Earbuds", path: "/products/earbuds.jpg" },
  { label: "OLED Laptop", path: "/products/laptop.jpg" },
  { label: "Smart Speaker", path: "/products/speaker.jpg" },
];

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, resetProductsToDefault } = useShop();

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = add, object = edit
  const [deletingProduct, setDeletingProduct] = useState(null); // confirmation

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (isModalOpen || deletingProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, deletingProduct]);

  // Handle ESC key to dismiss modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (deletingProduct) {
          setDeletingProduct(null);
        } else if (isModalOpen) {
          setIsModalOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deletingProduct, isModalOpen]);

  // Form State
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    category: "Audio & Musik",
    categorySlug: "audio",
    price: "",
    originalPrice: "",
    stockCount: 15,
    tag: "New Arrival",
    image: "/products/headphones.jpg",
    description: "",
    rating: 4.9,
    reviewCount: 42,
  });

  // Filter products for admin table
  const filtered = products.filter((p) => {
    if (selectedCat !== "all" && p.categorySlug !== selectedCat) return false;
    if (
      search.trim() &&
      !p.name.toLowerCase().includes(search.toLowerCase()) &&
      !p.category.toLowerCase().includes(search.toLowerCase()) &&
      !p.id.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      tagline: "",
      category: "Audio & Musik",
      categorySlug: "audio",
      price: 199,
      originalPrice: 249,
      stockCount: 20,
      tag: "New Arrival",
      image: "/products/headphones.jpg",
      description: "Perangkat elektronik premium generasi terbaru dengan kualitas audio dan material tingkat tinggi.",
      rating: 4.9,
      reviewCount: 15,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      tagline: p.tagline || "",
      category: p.category,
      categorySlug: p.categorySlug || "audio",
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      stockCount: p.stockCount !== undefined ? p.stockCount : 10,
      tag: p.tag || "Popular",
      image: p.image || "/products/headphones.jpg",
      description: p.description || "",
      rating: p.rating || 5.0,
      reviewCount: p.reviewCount || 1,
    });
    setIsModalOpen(true);
  };

  const handleCategoryChange = (e) => {
    const slug = e.target.value;
    const catObj = CATEGORIES.find((c) => c.slug === slug);
    setForm({
      ...form,
      categorySlug: slug,
      category: catObj ? catObj.name : "Audio & Musik",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;

    const discount =
      form.originalPrice > form.price
        ? Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100)
        : 0;

    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice || form.price),
      discountPercent: discount,
      stockCount: Number(form.stockCount),
      inStock: Number(form.stockCount) > 0,
      rating: Number(form.rating) || 5.0,
      reviewCount: Number(form.reviewCount) || 1,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  return (
    <div className="admin-crud-container">
      {/* Header bar */}
      <div className="admin-section-header">
        <div>
          <h2 className="admin-page-title">Manajemen Katalog Produk</h2>
          <p className="admin-page-desc">
            Tambah, sunting harga, atur persediaan stok, dan kelola seluruh inventaris toko.
          </p>
        </div>
        <div className="admin-header-actions">
          <button
            id="admin-add-product-btn"
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <Plus size={18} />
            <span>Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-table-filters glass-panel">
        <div className="admin-search-wrapper">
          <Search size={18} className="admin-search-icon" />
          <input
            id="admin-product-search"
            type="text"
            placeholder="Cari berdasarkan nama produk, SKU, atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="admin-clear-search" onClick={() => setSearch("")}>
              <X size={15} />
            </button>
          )}
        </div>

        <div className="admin-filter-selectors">
          <select
            id="admin-cat-filter-select"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="admin-select"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-table-card glass-panel">
        <div className="table-responsive">
          <table className="admin-data-table" id="admin-products-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga Satuan</th>
                <th>Status Stok</th>
                <th>Rating</th>
                <th>Label / Tag</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="admin-empty-table-cell">
                    <Package size={36} className="empty-table-icon" />
                    <p>Tidak ditemukan produk yang sesuai dengan kriteria filter.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id} id={`admin-prod-row-${prod.id}`}>
                    <td>
                      <div className="table-product-cell">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="table-product-thumb"
                        />
                        <div>
                          <strong className="table-product-name">{prod.name}</strong>
                          <span className="table-product-sku">ID: {prod.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="table-cat-badge">{prod.category}</span>
                    </td>
                    <td>
                      <div className="table-price-cell">
                        <strong className="current-price-table">${prod.price}</strong>
                        {prod.originalPrice > prod.price && (
                          <span className="slash-price-table">${prod.originalPrice}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {prod.inStock ? (
                        <span className="stock-badge in-stock">
                          Tersedia ({prod.stockCount} unit)
                        </span>
                      ) : (
                        <span className="stock-badge out-stock">Stok Habis</span>
                      )}
                    </td>
                    <td>
                      <span className="table-rating">
                        ★ {prod.rating} <small>({prod.reviewCount})</small>
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-primary">{prod.tag || "Standar"}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="table-actions-cell">
                        <button
                          id={`admin-edit-prod-${prod.id}`}
                          type="button"
                          className="btn-icon table-action-btn edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(prod);
                          }}
                          title={`Sunting ${prod.name}`}
                          aria-label={`Sunting ${prod.name}`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          id={`admin-delete-prod-${prod.id}`}
                          type="button"
                          className="btn-icon table-action-btn delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingProduct(prod);
                          }}
                          title={`Hapus ${prod.name}`}
                          aria-label={`Hapus ${prod.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="admin-table-footer">
          <span>
            Menampilkan <strong>{filtered.length}</strong> dari <strong>{products.length}</strong> total produk katalog
          </span>
          <button
            id="admin-reset-default-catalog-btn"
            className="btn btn-secondary btn-sm-action"
            onClick={resetProductsToDefault}
          >
            <RotateCcw size={14} />
            <span>Pulihkan Katalog Bawaan</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="admin-form-modal glass-panel"
            id="product-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-row">
              <h3 className="modal-box-title">
                {editingProduct ? `Sunting Produk: ${editingProduct.name}` : "Tambah Produk Baru"}
              </h3>
              <button
                id="close-prod-form-modal"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form-content">
              <div className="form-grid-2">
                <div className="input-group">
                  <label htmlFor="form-prod-name">Nama Produk *</label>
                  <input
                    id="form-prod-name"
                    type="text"
                    required
                    placeholder="Contoh: Lumina ANC Apex 2"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="form-prod-category">Kategori Produk</label>
                  <select
                    id="form-prod-category"
                    value={form.categorySlug}
                    onChange={handleCategoryChange}
                    className="admin-select"
                  >
                    {CATEGORIES.filter((c) => c.slug !== "all").map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="form-prod-tagline">Tagline Ringkas</label>
                <input
                  id="form-prod-tagline"
                  type="text"
                  placeholder="Contoh: Spatial Audio Studio Headphone"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                />
              </div>

              <div className="form-grid-3">
                <div className="input-group">
                  <label htmlFor="form-prod-price">Harga Jual ($) *</label>
                  <input
                    id="form-prod-price"
                    type="number"
                    min="1"
                    required
                    placeholder="Contoh: 299"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="form-prod-original">Harga Asli / Coret ($)</label>
                  <input
                    id="form-prod-original"
                    type="number"
                    min="1"
                    placeholder="Contoh: 349"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="form-prod-stock">Stok Unit Tersedia</label>
                  <input
                    id="form-prod-stock"
                    type="number"
                    min="0"
                    placeholder="Contoh: 20"
                    value={form.stockCount}
                    onChange={(e) => setForm({ ...form, stockCount: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="input-group">
                  <label htmlFor="form-prod-tag">Label Badge</label>
                  <select
                    id="form-prod-tag"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    className="admin-select"
                  >
                    <option value="Best Seller">Best Seller</option>
                    <option value="Flagship">Flagship</option>
                    <option value="Trending">Trending</option>
                    <option value="Hot Deal">Hot Deal</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Editor's Choice">Editor's Choice</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="form-prod-rating">Rating Bintang (1.0 - 5.0)</label>
                  <input
                    id="form-prod-rating"
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  />
                </div>
              </div>

              {/* Preset Image Selector */}
              <div className="input-group">
                <label>Pilih Gambar Produk dari Koleksi Studio Preset:</label>
                <div className="preset-images-scroll">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.path}
                      type="button"
                      className={`preset-img-btn ${form.image === img.path ? "active" : ""}`}
                      onClick={() => setForm({ ...form, image: img.path })}
                      title={img.label}
                    >
                      <img src={img.path} alt={img.label} className="preset-thumb" />
                      <span className="preset-img-label">{img.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="form-prod-desc">Deskripsi Produk</label>
                <textarea
                  id="form-prod-desc"
                  rows="3"
                  placeholder="Tuliskan spesifikasi dan fitur unggulan produk..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  id="submit-product-form-btn"
                  type="submit"
                  className="btn btn-primary"
                >
                  <Check size={18} />
                  <span>{editingProduct ? "Simpan Perubahan" : "Tambahkan ke Toko"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="modal-overlay" onClick={() => setDeletingProduct(null)}>
          <div
            className="admin-delete-modal glass-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="close-delete-product-modal-btn"
              type="button"
              className="modal-close-btn"
              onClick={() => setDeletingProduct(null)}
              title="Tutup dialog konfirmasi"
              aria-label="Tutup dialog"
            >
              <X size={18} />
            </button>
            <div className="delete-icon-wrap">
              <AlertTriangle size={36} className="alert-delete-icon" />
            </div>
            <h3 className="delete-title">Hapus Produk Ini?</h3>
            <p className="delete-desc">
              Apakah Anda yakin ingin menghapus <strong>"{deletingProduct.name}"</strong> (ID: {deletingProduct.id})? Produk
              akan segera dihilangkan dari katalog toko publik, keranjang belanja, dan wishlist pelanggan.
            </p>
            <div className="modal-actions-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeletingProduct(null)}
              >
                Batal
              </button>
              <button
                id="confirm-delete-product-btn"
                type="button"
                className="btn btn-danger-action"
                onClick={handleConfirmDelete}
              >
                <Trash2 size={16} />
                <span>Ya, Hapus Permanen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
