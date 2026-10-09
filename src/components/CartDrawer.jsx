import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  CheckCircle2,
} from "lucide-react";

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotal,
    discountAmount,
    shippingCost,
    taxAmount,
    cartTotal,
    isFreeShipping,
    freeShippingThreshold,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    setIsCheckoutOpen,
  } = useShop();

  const [couponInput, setCouponInput] = useState("");

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput);
    if (res.success) {
      setCouponInput("");
    }
  };

  const handleApplyQuickCoupon = (code) => {
    applyCouponCode(code);
  };

  const progressPercent = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <aside
        className="drawer-panel"
        id="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={22} className="drawer-header-icon" />
            <h3 className="drawer-title">Keranjang Belanja</h3>
            <span className="cart-badge-count">{cartCount} Item</span>
          </div>
          <button
            id="close-cart-btn"
            className="drawer-close-btn"
            onClick={() => setIsCartOpen(false)}
            title="Tutup Keranjang"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="shipping-progress-banner">
          <div className="shipping-text-row">
            <Truck size={16} className="shipping-icon" />
            {isFreeShipping ? (
              <span className="shipping-congrats">
                🎉 <strong>Gratis Ongkir Aktif!</strong> Belanjaan Anda bebas biaya kirim.
              </span>
            ) : (
              <span>
                Tambah <strong>${remainingForFreeShip}</strong> lagi untuk <strong>Bebas Ongkir</strong>
              </span>
            )}
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Drawer Body: Item List */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart-view">
              <div className="empty-cart-icon-circle">
                <ShoppingBag size={46} />
              </div>
              <h4 className="empty-cart-title">Keranjang Anda Masih Kosong</h4>
              <p className="empty-cart-text">
                Belum ada produk teknologi impian yang Anda tambahkan ke keranjang.
              </p>
              <button
                id="cart-start-shopping-btn"
                className="btn btn-primary"
                onClick={() => setIsCartOpen(false)}
              >
                Mulai Belanja Sekarang
              </button>
            </div>
          ) : (
            <div className="cart-items-list" id="cart-items-container">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}`}
                  className="cart-item-row"
                  id={`cart-item-${item.product.id}`}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-meta">
                    <h4 className="cart-item-title">{item.product.name}</h4>
                    <div className="cart-item-variant">
                      <span>Varian: {item.selectedColor}</span>
                    </div>
                    <div className="cart-item-price-row">
                      <span className="cart-item-unit-price">${item.product.price}</span>
                      <span className="cart-item-subtotal">
                        Total: ${item.product.price * item.quantity}
                      </span>
                    </div>

                    <div className="cart-item-actions">
                      <div className="cart-item-stepper">
                        <button
                          className="stepper-btn"
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedColor, -1)
                          }
                          title="Kurangi kuantitas"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="stepper-value">{item.quantity}</span>
                        <button
                          className="stepper-btn"
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedColor, 1)
                          }
                          title="Tambah kuantitas"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        className="cart-item-delete-btn"
                        onClick={() =>
                          removeFromCart(item.product.id, item.selectedColor)
                        }
                        title="Hapus produk"
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

        {/* Drawer Footer: Coupons & Summary */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            {/* Promo Code Input */}
            <div className="coupon-section">
              {appliedCoupon ? (
                <div className="applied-coupon-pill">
                  <div className="coupon-pill-info">
                    <Tag size={16} className="coupon-icon" />
                    <span>
                      Kupon: <strong>{appliedCoupon.code}</strong> (
                      {appliedCoupon.description})
                    </span>
                  </div>
                  <button
                    id="remove-coupon-btn"
                    className="remove-coupon-btn"
                    onClick={removeCoupon}
                    title="Hapus Kupon"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-input-form">
                  <div className="coupon-field-wrap">
                    <Tag size={16} className="coupon-input-icon" />
                    <input
                      id="cart-coupon-input"
                      type="text"
                      placeholder="Masukkan kode promo (cth: LUMINA20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                  </div>
                  <button
                    id="apply-coupon-btn"
                    type="submit"
                    className="btn btn-secondary coupon-apply-btn"
                  >
                    Gunakan
                  </button>
                </form>
              )}

              {/* Quick voucher suggestion buttons */}
              {!appliedCoupon && (
                <div className="quick-coupons-suggestions">
                  <span className="suggestion-label">Saran Kupon:</span>
                  <button
                    type="button"
                    className="suggestion-tag"
                    onClick={() => handleApplyQuickCoupon("LUMINA20")}
                  >
                    LUMINA20 (-20%)
                  </button>
                  <button
                    type="button"
                    className="suggestion-tag"
                    onClick={() => handleApplyQuickCoupon("HEMAT50")}
                  >
                    HEMAT50 (-$50)
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="order-price-breakdown">
              <div className="breakdown-row">
                <span className="breakdown-label">Subtotal Produk</span>
                <span className="breakdown-val">${cartSubtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="breakdown-row discount-row">
                  <span className="breakdown-label">Potongan Kupon Promo</span>
                  <span className="breakdown-val">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="breakdown-row">
                <span className="breakdown-label">Ongkos Pengiriman</span>
                <span className="breakdown-val">
                  {shippingCost === 0 ? (
                    <span className="free-tag">GRATIS</span>
                  ) : (
                    `$${shippingCost}`
                  )}
                </span>
              </div>
              <div className="breakdown-row">
                <span className="breakdown-label">Pajak PPN (10%)</span>
                <span className="breakdown-val">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="breakdown-row total-row">
                <span className="breakdown-label">Total Pembayaran</span>
                <span className="breakdown-val total-val" id="cart-total-amount">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="proceed-checkout-btn"
              className="btn btn-primary btn-block checkout-submit-btn"
              onClick={handleProceedToCheckout}
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight size={18} />
            </button>

            <button
              id="clear-cart-btn"
              className="clear-cart-link"
              onClick={clearCart}
            >
              Kosongkan Keranjang
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
