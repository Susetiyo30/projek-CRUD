import React, { useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";

export default function WishlistDrawer() {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    setIsCartOpen,
  } = useShop();

  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isWishlistOpen]);

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    toggleWishlist(product);
  };

  return (
    <div className="drawer-overlay" onClick={() => setIsWishlistOpen(false)}>
      <aside
        className="drawer-panel wishlist-drawer-panel"
        id="wishlist-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <Heart size={22} className="drawer-header-icon fav-icon-accent" />
            <h3 className="drawer-title">Favorit &amp; Wishlist</h3>
            <span className="cart-badge-count">{wishlistProducts.length} Item</span>
          </div>
          <button
            id="close-wishlist-btn"
            className="drawer-close-btn"
            onClick={() => setIsWishlistOpen(false)}
            title="Tutup Wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="drawer-body">
          {wishlistProducts.length === 0 ? (
            <div className="empty-cart-view">
              <div className="empty-cart-icon-circle">
                <Heart size={44} className="empty-fav-icon" />
              </div>
              <h4 className="empty-cart-title">Belum Ada Produk Favorit</h4>
              <p className="empty-cart-text">
                Klik ikon hati pada produk yang Anda minati untuk menyimpannya di sini.
              </p>
              <button
                id="wishlist-explore-btn"
                className="btn btn-primary"
                onClick={() => setIsWishlistOpen(false)}
              >
                Jelajahi Produk
              </button>
            </div>
          ) : (
            <div className="cart-items-list" id="wishlist-items-container">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="cart-item-row"
                  id={`wishlist-item-${product.id}`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-meta">
                    <h4 className="cart-item-title">{product.name}</h4>
                    <span className="cart-item-variant">{product.category}</span>
                    <div className="cart-item-price-row">
                      <span className="cart-item-unit-price">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="original-price">${product.originalPrice}</span>
                      )}
                    </div>

                    <div className="cart-item-actions">
                      <button
                        id={`wishlist-move-to-cart-${product.id}`}
                        className="btn btn-primary btn-sm-action"
                        onClick={() => handleMoveToCart(product)}
                      >
                        <ShoppingCart size={15} />
                        <span>Pindah ke Keranjang</span>
                      </button>

                      <button
                        id={`wishlist-remove-${product.id}`}
                        className="cart-item-delete-btn"
                        onClick={() => toggleWishlist(product)}
                        title="Hapus dari Wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="drawer-footer">
            <button
              id="wishlist-move-all-btn"
              className="btn btn-secondary btn-block"
              onClick={() => {
                wishlistProducts.forEach((p) => addToCart(p, 1));
                wishlistProducts.forEach((p) => toggleWishlist(p));
                setIsWishlistOpen(false);
                setIsCartOpen(true);
              }}
            >
              <span>Pindahkan Semua ke Keranjang</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
