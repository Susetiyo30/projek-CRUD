import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { X, Star, ShoppingCart, Heart, Check, ShieldCheck, Truck, Zap } from "lucide-react";

export default function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setQuantity(1);
      setSelectedColor(
        quickViewProduct.colors && quickViewProduct.colors.length > 0
          ? quickViewProduct.colors[0].name
          : "Default"
      );
      setIsAdded(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [quickViewProduct]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const isFavorited = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedColor);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, quantity, selectedColor);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
      <div
        className="quick-view-card glass-panel"
        id="quick-view-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-quick-view-btn"
          className="modal-close-btn"
          onClick={() => setQuickViewProduct(null)}
          title="Tutup Modal"
        >
          <X size={20} />
        </button>

        <div className="quick-view-grid">
          {/* Left Column: Image */}
          <div className="modal-image-col">
            <div className="modal-image-frame">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="modal-product-img"
              />
              {quickViewProduct.discountPercent > 0 && (
                <span className="badge badge-discount modal-discount-badge">
                  Hemat {quickViewProduct.discountPercent}%
                </span>
              )}
            </div>
            <div className="modal-trust-pills">
              <span className="trust-pill">
                <Truck size={14} /> Pengiriman Kilat
              </span>
              <span className="trust-pill">
                <ShieldCheck size={14} /> 100% Ori Bergaransi
              </span>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="modal-details-col">
            <div className="modal-header-meta">
              <span className="modal-cat-tag">{quickViewProduct.category}</span>
              <div className="product-rating-box">
                <Star size={14} className="star-filled" />
                <span className="rating-score">{quickViewProduct.rating}</span>
                <span className="review-count">({quickViewProduct.reviewCount} ulasan)</span>
              </div>
            </div>

            <h2 className="modal-title">{quickViewProduct.name}</h2>
            <p className="modal-tagline">{quickViewProduct.tagline}</p>

            {/* Price Box */}
            <div className="modal-price-box">
              <span className="modal-current-price">${quickViewProduct.price}</span>
              {quickViewProduct.originalPrice > quickViewProduct.price && (
                <span className="modal-slashed-price">${quickViewProduct.originalPrice}</span>
              )}
              <span className="stock-status-pill in-stock">
                <Zap size={13} /> Stok Tersedia ({quickViewProduct.stockCount} unit)
              </span>
            </div>

            <p className="modal-description">{quickViewProduct.description}</p>

            {/* Color Selection */}
            {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
              <div className="modal-option-row">
                <span className="option-label">
                  Warna: <strong>{selectedColor}</strong>
                </span>
                <div className="color-dots-list">
                  {quickViewProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      className={`color-dot-btn large-dot ${
                        selectedColor === c.name ? "active" : ""
                      }`}
                      style={{ backgroundColor: c.hex }}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="modal-option-row">
              <span className="option-label">Jumlah Unit:</span>
              <div className="qty-stepper-box">
                <button
                  id="modal-qty-minus-btn"
                  className="qty-step-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="qty-step-value" id="modal-qty-display">
                  {quantity}
                </span>
                <button
                  id="modal-qty-plus-btn"
                  className="qty-step-btn"
                  onClick={() => setQuantity((q) => Math.min(quickViewProduct.stockCount, q + 1))}
                  disabled={quantity >= quickViewProduct.stockCount}
                >
                  +
                </button>
              </div>
            </div>

            {/* Specs Table */}
            {quickViewProduct.specs && quickViewProduct.specs.length > 0 && (
              <div className="modal-specs-box">
                <h4 className="specs-title">Spesifikasi Kunci:</h4>
                <div className="specs-grid">
                  {quickViewProduct.specs.map((s, idx) => (
                    <div key={idx} className="spec-row">
                      <span className="spec-key">{s.label}:</span>
                      <span className="spec-val">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons Action Group */}
            <div className="modal-actions-group">
              <button
                id="modal-add-to-cart-btn"
                className={`btn ${isAdded ? "btn-success-active" : "btn-primary"} modal-cart-action`}
                onClick={handleAddToCart}
                disabled={isAdded}
              >
                {isAdded ? (
                  <>
                    <Check size={18} />
                    <span>Tersimpan di Keranjang!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>Tambah ke Keranjang</span>
                  </>
                )}
              </button>

              <button
                id="modal-buy-now-btn"
                className="btn btn-secondary modal-buy-now-action"
                onClick={handleBuyNow}
              >
                Beli Sekarang
              </button>

              <button
                id="modal-wishlist-toggle-btn"
                className={`btn-icon modal-fav-btn ${isFavorited ? "active" : ""}`}
                onClick={() => toggleWishlist(quickViewProduct)}
                title={isFavorited ? "Hapus dari Wishlist" : "Simpan ke Wishlist"}
              >
                <Heart
                  size={20}
                  fill={isFavorited ? "#ef4444" : "none"}
                  color={isFavorited ? "#ef4444" : "currentColor"}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
