import React from "react";
import { useShop } from "../context/ShopContext";
import ProductCard from "./ProductCard";
import { PackageX, RotateCcw } from "lucide-react";

export default function ProductGrid() {
  const { filteredProducts, viewMode, resetFilters, searchQuery } = useShop();

  if (filteredProducts.length === 0) {
    return (
      <div className="container">
        <div className="empty-catalog-box glass-panel">
          <div className="empty-icon-circle">
            <PackageX size={48} className="empty-icon" />
          </div>
          <h3 className="empty-title">Tidak Ada Produk Yang Sesuai</h3>
          <p className="empty-desc">
            {searchQuery
              ? `Tidak ditemukan produk dengan kata kunci "${searchQuery}". Coba kata kunci lain atau ubah filter harga.`
              : "Kombinasi filter yang Anda pilih saat ini tidak menghasilkan produk apapun."}
          </p>
          <button
            id="empty-reset-filters-btn"
            onClick={resetFilters}
            className="btn btn-primary"
          >
            <RotateCcw size={16} />
            <span>Reset Semua Filter</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        className={`products-container ${
          viewMode === "list" ? "products-list-layout" : "products-grid-layout"
        }`}
        id="products-display-area"
      >
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}
