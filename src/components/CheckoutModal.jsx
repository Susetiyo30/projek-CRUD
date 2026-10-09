import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import confetti from "canvas-confetti";
import {
  X,
  CreditCard,
  Wallet,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    cartSubtotal,
    discountAmount,
    shippingCost,
    taxAmount,
    appliedCoupon,
    clearCart,
    addToast,
  } = useShop();

  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
  const [formData, setFormData] = useState({
    fullName: "Alex Kurniawan",
    email: "alex.k@lumina.id",
    phone: "081234567890",
    address: "Jl. Sudirman Grand Tower No. 42",
    city: "Jakarta Selatan",
    postalCode: "12190",
    paymentMethod: "card", // card, qris, va
    cardNumber: "4532 •••• •••• 8892",
    cardExp: "12/28",
    cardCvc: "892",
  });

  const [orderSummary, setOrderSummary] = useState(null);

  useEffect(() => {
    if (isCheckoutOpen) {
      setStep(1);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    } catch {
      // Confetti fallback safe
    }
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    const orderId = "LUM-" + Math.floor(100000 + Math.random() * 900000);
    const summary = {
      orderId,
      items: [...cart],
      total: cartTotal,
      subtotal: cartSubtotal,
      shipping: shippingCost,
      discount: discountAmount,
      tax: taxAmount,
      customer: formData,
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    setOrderSummary(summary);
    setStep(3);
    triggerConfetti();
    clearCart();
    addToast("Pesanan Berhasil!", `Order #${orderId} telah berhasil dibuat.`, "success");
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
      <div
        className="checkout-modal-card glass-panel"
        id="checkout-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-checkout-btn"
          className="modal-close-btn"
          onClick={() => setIsCheckoutOpen(false)}
          title="Tutup Checkout"
        >
          <X size={20} />
        </button>

        {/* Success Screen Step 3 */}
        {step === 3 && orderSummary ? (
          <div className="checkout-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={54} className="success-check-icon" />
            </div>
            <h2 className="success-title">Pembayaran Berhasil!</h2>
            <p className="success-subtitle">
              Terima kasih atas pesanan Anda. Kami sedang menyiapkan perangkat teknologi terbaik Anda.
            </p>

            <div className="order-receipt-card">
              <div className="receipt-row">
                <span className="receipt-label">ID Pesanan</span>
                <span className="receipt-val order-code">#{orderSummary.orderId}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Penerima</span>
                <span className="receipt-val">{orderSummary.customer.fullName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Alamat Pengiriman</span>
                <span className="receipt-val">
                  {orderSummary.customer.address}, {orderSummary.customer.city}
                </span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Total Dibayar</span>
                <span className="receipt-val total-amount">
                  ${orderSummary.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="success-actions">
              <button
                id="finish-shopping-btn"
                className="btn btn-primary btn-block"
                onClick={() => setIsCheckoutOpen(false)}
              >
                Kembali ke Beranda Belanja
              </button>
            </div>
          </div>
        ) : (
          /* Multi-step Checkout View */
          <div className="checkout-content-layout">
            {/* Step Indicators */}
            <div className="checkout-steps-nav">
              <div className={`step-badge-item ${step === 1 ? "active" : "done"}`}>
                <span className="step-num">1</span>
                <span className="step-label">Alamat &amp; Kontak</span>
              </div>
              <div className="step-divider-line"></div>
              <div className={`step-badge-item ${step === 2 ? "active" : ""}`}>
                <span className="step-num">2</span>
                <span className="step-label">Metode Pembayaran</span>
              </div>
            </div>

            <div className="checkout-main-grid">
              {/* Form Column */}
              <div className="checkout-form-col">
                {step === 1 && (
                  <div className="checkout-step-form">
                    <h3 className="form-section-title">Informasi Pengiriman</h3>
                    <div className="form-grid-2">
                      <div className="input-group">
                        <label htmlFor="checkout-name">Nama Lengkap</label>
                        <input
                          id="checkout-name"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="checkout-phone">Nomor Telepon / WA</label>
                        <input
                          id="checkout-phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label htmlFor="checkout-email">Alamat Email Konfirmasi</label>
                      <input
                        id="checkout-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label htmlFor="checkout-address">Alamat Pengiriman Lengkap</label>
                      <input
                        id="checkout-address"
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="input-group">
                        <label htmlFor="checkout-city">Kota / Wilayah</label>
                        <input
                          id="checkout-city"
                          type="text"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="checkout-postal">Kode Pos</label>
                        <input
                          id="checkout-postal"
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) =>
                            setFormData({ ...formData, postalCode: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <button
                      id="next-step-btn"
                      className="btn btn-primary btn-block checkout-next-btn"
                      onClick={() => setStep(2)}
                    >
                      <span>Lanjut ke Metode Pembayaran</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <form onSubmit={handleCompleteOrder} className="checkout-step-form">
                    <h3 className="form-section-title">Pilih Metode Pembayaran</h3>

                    <div className="payment-options-grid">
                      <label
                        className={`payment-option-card ${
                          formData.paymentMethod === "card" ? "active" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={formData.paymentMethod === "card"}
                          onChange={() =>
                            setFormData({ ...formData, paymentMethod: "card" })
                          }
                        />
                        <CreditCard size={22} className="payment-opt-icon" />
                        <div>
                          <strong>Kartu Kredit / Debit</strong>
                          <p>Visa, MasterCard, JCB</p>
                        </div>
                      </label>

                      <label
                        className={`payment-option-card ${
                          formData.paymentMethod === "qris" ? "active" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={formData.paymentMethod === "qris"}
                          onChange={() =>
                            setFormData({ ...formData, paymentMethod: "qris" })
                          }
                        />
                        <Wallet size={22} className="payment-opt-icon" />
                        <div>
                          <strong>QRIS &amp; E-Wallet</strong>
                          <p>GoPay, OVO, Dana, ShopeePay</p>
                        </div>
                      </label>

                      <label
                        className={`payment-option-card ${
                          formData.paymentMethod === "va" ? "active" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={formData.paymentMethod === "va"}
                          onChange={() =>
                            setFormData({ ...formData, paymentMethod: "va" })
                          }
                        />
                        <Building2 size={22} className="payment-opt-icon" />
                        <div>
                          <strong>Virtual Account Bank</strong>
                          <p>BCA, Mandiri, BNI, BRI</p>
                        </div>
                      </label>
                    </div>

                    {formData.paymentMethod === "card" && (
                      <div className="card-fields-box">
                        <div className="input-group">
                          <label>Nomor Kartu</label>
                          <input
                            type="text"
                            value={formData.cardNumber}
                            onChange={(e) =>
                              setFormData({ ...formData, cardNumber: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="form-grid-2">
                          <div className="input-group">
                            <label>Masa Berlaku (MM/YY)</label>
                            <input
                              type="text"
                              value={formData.cardExp}
                              onChange={(e) =>
                                setFormData({ ...formData, cardExp: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="input-group">
                            <label>Kode CVC</label>
                            <input
                              type="text"
                              value={formData.cardCvc}
                              onChange={(e) =>
                                setFormData({ ...formData, cardCvc: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="checkout-step2-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setStep(1)}
                      >
                        Kembali
                      </button>
                      <button
                        id="submit-order-btn"
                        type="submit"
                        className="btn btn-primary submit-final-btn"
                      >
                        <ShieldCheck size={18} />
                        <span>Bayar Sekarang (${cartTotal.toFixed(2)})</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Order Summary Column */}
              <div className="checkout-summary-col">
                <div className="summary-inner-card glass-panel">
                  <h4 className="summary-title">Ringkasan Pesanan ({cart.length})</h4>
                  <div className="summary-mini-list">
                    {cart.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedColor}`}
                        className="summary-mini-item"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="summary-mini-thumb"
                        />
                        <div className="summary-mini-meta">
                          <span className="summary-mini-name">{item.product.name}</span>
                          <span className="summary-mini-qty">
                            {item.quantity}x • ${item.product.price}
                          </span>
                        </div>
                        <span className="summary-mini-sub">
                          ${item.product.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="summary-total-stack">
                    <div className="sum-row">
                      <span>Subtotal</span>
                      <span>${cartSubtotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="sum-row discount">
                        <span>Diskon Kupon</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="sum-row">
                      <span>Biaya Kirim</span>
                      <span>{shippingCost === 0 ? "GRATIS" : `$${shippingCost}`}</span>
                    </div>
                    <div className="sum-row">
                      <span>PPN (10%)</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="sum-row grand-total">
                      <span>Total Akhir</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="security-guarantee-note">
                    <ShieldCheck size={16} />
                    <span>Enkripsi SSL 256-Bit Aman &amp; Terlindungi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
