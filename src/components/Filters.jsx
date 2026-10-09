import React from "react";
import { useShop } from "../context/ShopContext";
import { CATEGORIES } from "../data/products";
import {
  LayoutGrid,
  Headphones,
  Watch,
  Smartphone,
  Laptop,
  Keyboard,
  SlidersHorizontal,
  RotateCcw,
  Grid3X3,
  List,
  Check,
} from "lucide-react";

// Map category icons
const ICON_MAP = {
  LayoutGrid: LayoutGrid,
  Headphones: Headphones,
  Watch: Watch,
  Smartphone: Smartphone,
  Laptop: Laptop,
  Keyboard: Keyboard,
};

export default function Filters() {
  const {
    products,
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    onlyInStock,
    setOnlyInStock,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    resetFilters,
    searchQuery,
  } = useShop();

  const isFiltered =
    selectedCategory !== "all" ||
    priceRange < 1500 ||
    minRating > 0 ||
    onlyInStock ||
    searchQuery.trim().length > 0 ||
    sortBy !== "featured";

  return (
    <section className="catalog-filters-section" id="catalog-section">
      <div className="container">
        {/* Section Header */}
        <div className="catalog-header-row">
          <div>
            <h2 className="section-title">Katalog Produk Pilihan</h2>
            <p className="section-subtitle">
              Peralatan audio fidelity, smartwatch, smartphone, dan perangkat komputasi modern.
            </p>
          </div>
          <div className="catalog-view-sort">
            {/* View Mode Switcher */}
            <div className="view-mode-buttons" role="group" aria-label="Tampilan Grid atau List">
              <button
                id="view-grid-btn"
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Tampilan Kotak (Grid)"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                id="view-list-btn"
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="Tampilan Daftar (List)"
              >
                <List size={18} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="sort-dropdown-wrapper">
              <label htmlFor="sort-select" className="sort-label">
                Urutkan:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Paling Populer &amp; Unggulan</option>
                <option value="price-asc">Harga: Terendah ke Tertinggi</option>
                <option value="price-desc">Harga: Tertinggi ke Terendah</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="discount">Diskon Terbesar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="category-pills-scroll">
          {CATEGORIES.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || LayoutGrid;
            const count =
              cat.slug === "all"
                ? products.length
                : products.filter((p) => p.categorySlug === cat.slug).length;

            return (
              <button
                key={cat.slug}
                id={`cat-filter-${cat.slug}`}
                className={`category-pill-btn ${
                  selectedCategory === cat.slug ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                <IconComponent size={18} className="cat-icon" />
                <span className="cat-name">{cat.name}</span>
                <span className="cat-count">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Advanced Filter Bar */}
        <div className="filter-controls-card glass-panel">
          <div className="filter-item-group">
            <span className="filter-control-label">
              Maks. Harga: <strong className="filter-val-highlight">${priceRange}</strong>
            </span>
            <input
              id="price-range-slider"
              type="range"
              min="80"
              max="1500"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="price-slider"
            />
          </div>

          <div className="filter-item-group">
            <span className="filter-control-label">Min. Rating</span>
            <div className="rating-filter-pills">
              {[0, 4.7, 4.9].map((rate) => (
                <button
                  key={rate}
                  id={`rating-filter-${rate}`}
                  className={`rating-pill ${minRating === rate ? "active" : ""}`}
                  onClick={() => setMinRating(rate)}
                >
                  {rate === 0 ? "Semua" : `★ ${rate}+`}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-item-group in-stock-group">
            <label className="checkbox-custom-label" htmlFor="in-stock-checkbox">
              <input
                id="in-stock-checkbox"
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <span className="checkbox-box">
                {onlyInStock && <Check size={14} />}
              </span>
              <span>Hanya Stok Tersedia</span>
            </label>
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              id="reset-filters-btn"
              onClick={resetFilters}
              className="btn btn-secondary reset-filter-btn"
              title="Kembalikan semua filter ke awal"
            >
              <RotateCcw size={15} />
              <span>Reset Filter</span>
            </button>
          )}

          <div className="filter-results-badge">
            Menampilkan <strong>{filteredProducts.length}</strong> produk
          </div>
        </div>
      </div>
    </section>
  );
}
