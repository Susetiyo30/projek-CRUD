import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { Heart, Eye, ShoppingCart, Star, Check } from "lucide-react";

export default function ProductCard({ product, viewMode = "grid" }) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
  } = useShop();

  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : "Default"
  );
  const [isAdding, setIsAdding] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1, selectedColor);
    setTimeout(() => {
      setIsAdding(false);
    }, 900);
  };

  return (
    <article
      className={`product-card ${viewMode === "list" ? "product-card-list" : ""} glass-panel`}
      id={`product-card-${product.id}`}
    >
      {/* Visual Image Container */}
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="product-badges-overlay">
          {product.tag && (
            <span
              className={`badge ${
                product.tag === "Best Seller"
                  ? "badge-hot"
                  : product.tag === "Flagship"
                  ? "badge-primary"
                  : "badge-success"
              }`}
            >
              {product.tag}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="badge badge-discount">-{product.discountPercent}%</span>
          )}
        </div>

        {/* Floating Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          className={`card-action-btn wishlist-card-btn ${isFavorited ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title={isFavorited ? "Hapus dari Wishlist" : "Simpan ke Wishlist"}
        >
          <Heart size={18} fill={isFavorited ? "#ef4444" : "none"} color={isFavorited ? "#ef4444" : "currentColor"} />
        </button>

        {/* Floating Quick View Overlay Button */}
        <button
          id={`quick-view-btn-${product.id}`}
          className="quick-view-overlay-btn"
          onClick={() => setQuickViewProduct(product)}
          title="Lihat Detail Produk"
        >
          <Eye size={16} />
          <span>Quick View</span>
        </button>
      </div>

      {/* Card Info Content */}
      <div className="product-info-content">
        <div className="product-cat-and-rating">
          <span className="product-category-text">{product.category}</span>
          <div className="product-rating-box">
            <Star size={14} className="star-filled" />
            <span className="rating-score">{product.rating}</span>
            <span className="review-count">({product.reviewCount})</span>
          </div>
        </div>

        <h3
          className="product-title"
          onClick={() => setQuickViewProduct(product)}
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="product-tagline">{product.tagline}</p>

        {/* Color Variants Dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="color-dots-wrapper">
            <span className="color-dot-label">Varian:</span>
            <div className="color-dots-list">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  className={`color-dot-btn ${selectedColor === c.name ? "active" : ""}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(c.name);
                  }}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
            </div>
            <span className="selected-color-name">{selectedColor}</span>
          </div>
        )}

        {/* Price & Cart Footer */}
        <div className="product-card-footer">
          <div className="price-stack">
            <span className="current-price">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">${product.originalPrice}</span>
            )}
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className={`btn ${isAdding ? "btn-success-active" : "btn-primary"} card-cart-btn`}
          >
            {isAdding ? (
              <>
                <Check size={17} />
                <span>Masuk!</span>
              </>
            ) : (
              <>
                <ShoppingCart size={17} />
                <span>Beli</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
