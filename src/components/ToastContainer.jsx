import React from "react";
import { useShop } from "../context/ShopContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toast-notifications-area">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconClass = "toast-icon-success";
        if (toast.type === "error") {
          Icon = AlertCircle;
          iconClass = "toast-icon-error";
        } else if (toast.type === "info") {
          Icon = Info;
          iconClass = "toast-icon-info";
        }

        return (
          <div
            key={toast.id}
            className={`toast-item toast-${toast.type} glass-panel`}
            role="status"
          >
            <div className={`toast-icon-wrap ${iconClass}`}>
              <Icon size={20} />
            </div>
            <div className="toast-body">
              <span className="toast-title">{toast.title}</span>
              <p className="toast-message">{toast.message}</p>
            </div>
            <button
              className="toast-close-btn"
              onClick={() => removeToast(toast.id)}
              title="Tutup Notifikasi"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
