import React, { createContext, useContext, useState, useEffect } from "react";
import { PRODUCTS, PROMO_CODES } from "../data/products";
import { INITIAL_USERS } from "../data/users";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  // Products state (CRUD enabled) persisted to localStorage
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("lumina_products");
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  useEffect(() => {
    localStorage.setItem("lumina_products", JSON.stringify(products));
  }, [products]);

  // Users state (CRUD enabled) persisted to localStorage
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("lumina_users");
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  useEffect(() => {
    localStorage.setItem("lumina_users", JSON.stringify(users));
  }, [users]);

  // Admin active tab
  const [adminActiveTab, setAdminActiveTab] = useState("overview"); // 'overview' | 'products' | 'users'

  // Theme state: default dark for rich luxury aesthetic
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("lumina_theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("lumina_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Cart state persisted to localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("lumina_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("lumina_cart", JSON.stringify(cart));
  }, [cart]);

  // Wishlist state persisted to localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("lumina_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("lumina_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState(1500);
  const [minRating, setMinRating] = useState(0);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");

  // UI Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderCompleteData, setOrderCompleteData] = useState(null);

  // Authentication State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("lumina_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register' | 'forgot'
  const [currentPage, setCurrentPage] = useState("shop"); // 'shop' | 'login'

  useEffect(() => {
    if (user) {
      localStorage.setItem("lumina_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("lumina_user");
    }
  }, [user]);

  // Promo coupon
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Actions
  const addToCart = (product, quantity = 1, color = null) => {
    const selectedColor = color || (product.colors && product.colors[0]?.name) || "Default";
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { product, quantity, selectedColor }];
      }
    });

    addToast(
      "Ditambahkan ke Keranjang",
      `${product.name} (${quantity}x) berhasil dimasukkan ke tas belanja.`,
      "success"
    );
  };

  const updateQuantity = (productId, selectedColor, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.selectedColor === selectedColor) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId, selectedColor) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedColor === selectedColor)
      )
    );
    addToast("Dihapus", "Item berhasil dihapus dari keranjang.", "info");
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Actions
  const toggleWishlist = (product) => {
    const exists = wishlist.some((id) => id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((id) => id !== product.id));
      addToast("Wishlist Diperbarui", `${product.name} dihapus dari favorit.`, "info");
    } else {
      setWishlist((prev) => [...prev, product.id]);
      addToast("Disimpan ke Favorit", `${product.name} ditambahkan ke wishlist!`, "success");
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  // Coupon Actions
  const applyCouponCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = PROMO_CODES[cleanCode];
    if (coupon) {
      setAppliedCoupon(coupon);
      addToast("Kupon Digunakan!", coupon.description, "success");
      return { success: true, coupon };
    } else {
      addToast("Kupon Tidak Valid", "Kode promo tidak ditemukan atau kedaluwarsa.", "error");
      return { success: false, message: "Kode promo tidak valid." };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast("Kupon Dibatalkan", "Kode promo telah dihapus.", "info");
  };

  // User Authentication Actions
  const login = (email, password, isDemo = false) => {
    const demoProfile = {
      id: "usr_9918",
      name: isDemo ? "Alex Kurniawan" : email.split("@")[0],
      email: email || "alex.kurniawan@lumina.id",
      role: "VIP Member",
      memberSince: "2025",
      rewardPoints: 1250,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    };

    setUser(demoProfile);
    setIsAuthModalOpen(false);
    if (currentPage === "login") {
      setCurrentPage("shop");
    }
    addToast("Berhasil Masuk!", `Selamat datang kembali, ${demoProfile.name}!`, "success");
    return { success: true };
  };

  const register = (fullName, email, password) => {
    const newProfile = {
      id: "usr_" + Math.floor(1000 + Math.random() * 9000),
      name: fullName,
      email: email,
      role: "Member Baru",
      memberSince: "2026",
      rewardPoints: 100, // Welcome bonus
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    };

    setUser(newProfile);
    setIsAuthModalOpen(false);
    if (currentPage === "login") {
      setCurrentPage("shop");
    }
    addToast(
      "Akun Berhasil Dibuat!",
      `Selamat bergabung di Lumina, ${fullName}! Bonus 100 poin telah aktif.`,
      "success"
    );
    return { success: true };
  };

  const logout = () => {
    const oldName = user ? user.name : "Pengguna";
    setUser(null);
    addToast("Sampai Jumpa!", `Akun ${oldName} telah berhasil keluar.`, "info");
  };

  const openAuth = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // -------------------------------------------------------------
  // Product CRUD Operations
  // -------------------------------------------------------------
  const addProduct = (newProduct) => {
    const p = {
      ...newProduct,
      id: newProduct.id || "prod_" + Date.now().toString(36),
      rating: Number(newProduct.rating) || 5.0,
      reviewCount: Number(newProduct.reviewCount) || 1,
      price: Number(newProduct.price) || 99,
      originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price) || 99,
      discountPercent: Number(newProduct.discountPercent) || 0,
      stockCount: Number(newProduct.stockCount) || 10,
      inStock: Number(newProduct.stockCount) > 0,
      image: newProduct.image || "/products/headphones.jpg",
      colors:
        newProduct.colors && newProduct.colors.length > 0
          ? newProduct.colors
          : [{ name: "Standard", hex: "#06b6d4" }],
      specs: newProduct.specs || [],
    };
    setProducts((prev) => {
      const updated = [p, ...prev];
      try {
        localStorage.setItem("lumina_products", JSON.stringify(updated));
      } catch (e) {
        console.error("Gagal menyimpan produk ke localStorage:", e);
      }
      return updated;
    });
    addToast("Produk Ditambahkan", `${p.name} berhasil masuk ke katalog toko.`, "success");
    return p;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) => {
      const updated = prev.map((item) => {
        if (String(item.id) === String(id)) {
          const next = { ...item, ...updatedFields };
          if (updatedFields.price !== undefined) next.price = Number(updatedFields.price);
          if (updatedFields.originalPrice !== undefined)
            next.originalPrice = Number(updatedFields.originalPrice);
          if (updatedFields.stockCount !== undefined) {
            next.stockCount = Number(updatedFields.stockCount);
            next.inStock = next.stockCount > 0;
          }
          return next;
        }
        return item;
      });
      try {
        localStorage.setItem("lumina_products", JSON.stringify(updated));
      } catch (e) {
        console.error("Gagal memperbarui produk di localStorage:", e);
      }
      return updated;
    });
    addToast("Produk Diperbarui", "Perubahan data produk berhasil disimpan.", "success");
  };

  const deleteProduct = (id) => {
    const targetProd = products.find((item) => String(item.id) === String(id));
    const prodName = targetProd ? targetProd.name : "Produk";

    setProducts((prev) => {
      const updated = prev.filter((item) => String(item.id) !== String(id));
      try {
        localStorage.setItem("lumina_products", JSON.stringify(updated));
      } catch (e) {
        console.error("Gagal menghapus produk dari localStorage:", e);
      }
      return updated;
    });

    setCart((prev) => {
      const updatedCart = prev.filter((item) => String(item.product.id) !== String(id));
      try {
        localStorage.setItem("lumina_cart", JSON.stringify(updatedCart));
      } catch (e) {}
      return updatedCart;
    });

    setWishlist((prev) => {
      const updatedWishlist = prev.filter((itemId) => String(itemId) !== String(id));
      try {
        localStorage.setItem("lumina_wishlist", JSON.stringify(updatedWishlist));
      } catch (e) {}
      return updatedWishlist;
    });

    if (quickViewProduct && String(quickViewProduct.id) === String(id)) {
      setQuickViewProduct(null);
    }

    addToast("Produk Dihapus", `"${prodName}" telah berhasil dihapus dari katalog toko.`, "info");
  };

  const resetProductsToDefault = () => {
    setProducts(PRODUCTS);
    try {
      localStorage.setItem("lumina_products", JSON.stringify(PRODUCTS));
    } catch (e) {}
    addToast("Katalog Direset", "Katalog produk dikembalikan ke pengaturan awal pabrik.", "info");
  };

  // -------------------------------------------------------------
  // User CRUD Operations
  // -------------------------------------------------------------
  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: "usr_" + Math.floor(1000 + Math.random() * 9000),
      rewardPoints: Number(userData.rewardPoints) || 0,
      totalSpent: Number(userData.totalSpent) || 0,
      joinDate: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      avatar:
        userData.avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      status: userData.status || "Aktif",
      role: userData.role || "Member",
    };
    setUsers((prev) => {
      const updated = [newUser, ...prev];
      try {
        localStorage.setItem("lumina_users", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    addToast("Pengguna Ditambahkan", `Akun ${newUser.name} berhasil didaftarkan.`, "success");
    return newUser;
  };

  const updateUser = (id, updatedFields) => {
    setUsers((prev) => {
      const updated = prev.map((u) => {
        if (String(u.id) === String(id)) {
          return { ...u, ...updatedFields };
        }
        return u;
      });
      try {
        localStorage.setItem("lumina_users", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (user && String(user.id) === String(id)) {
      setUser((prev) => ({ ...prev, ...updatedFields }));
    }
    addToast("Pengguna Diperbarui", "Data pengguna berhasil disimpan.", "success");
  };

  const deleteUser = (id) => {
    if (user && String(user.id) === String(id)) {
      addToast(
        "Tindakan Ditolak",
        "Anda tidak dapat menghapus akun admin yang sedang aktif digunakan.",
        "error"
      );
      return false;
    }
    const targetUser = users.find((u) => String(u.id) === String(id));
    const userName = targetUser ? targetUser.name : "Pengguna";

    setUsers((prev) => {
      const updated = prev.filter((u) => String(u.id) !== String(id));
      try {
        localStorage.setItem("lumina_users", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    addToast("Pengguna Dihapus", `Akun "${userName}" telah dihapus dari sistem.`, "info");
    return true;
  };

  const resetUsersToDefault = () => {
    setUsers(INITIAL_USERS);
    try {
      localStorage.setItem("lumina_users", JSON.stringify(INITIAL_USERS));
    } catch (e) {}
    addToast("Pengguna Direset", "Daftar pengguna dikembalikan ke data awal.", "info");
  };

  // Cart Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = (cartSubtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountAmount) {
      discountAmount = Math.min(cartSubtotal, appliedCoupon.discountAmount);
    }
  }

  const FREE_SHIPPING_THRESHOLD = 200;
  const isFreeShipping =
    cartSubtotal >= FREE_SHIPPING_THRESHOLD ||
    (appliedCoupon && appliedCoupon.freeShipping);
  const shippingCost = cart.length === 0 ? 0 : isFreeShipping ? 0 : 15;

  const taxAmount = (cartSubtotal - discountAmount) * 0.1; // 10% tax
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost + taxAmount);

  // Filter products computation using dynamic products state
  const filteredProducts = products.filter((item) => {
    // Category match
    if (selectedCategory !== "all" && item.categorySlug !== selectedCategory) {
      return false;
    }
    // Search query match
    if (
      searchQuery.trim() &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    // Price range match
    if (item.price > priceRange) {
      return false;
    }
    // Min rating match
    if (item.rating < minRating) {
      return false;
    }
    // Only in stock match
    if (onlyInStock && !item.inStock) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "discount") return b.discountPercent - a.discountPercent;
    // Default featured: featured first, then rating
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return b.rating - a.rating;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange(1500);
    setMinRating(0);
    setOnlyInStock(false);
    setSortBy("featured");
  };

  return (
    <ShopContext.Provider
      value={{
        theme,
        toggleTheme,
        products,
        filteredProducts,
        searchQuery,
        setSearchQuery,
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
        // Cart
        cart,
        cartCount,
        cartSubtotal,
        discountAmount,
        shippingCost,
        taxAmount,
        cartTotal,
        isFreeShipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        // Wishlist
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        // Modals
        quickViewProduct,
        setQuickViewProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orderCompleteData,
        setOrderCompleteData,
        // Promo
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        // Toasts
        toasts,
        addToast,
        removeToast,
        // Authentication & Routing
        user,
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        openAuth,
        currentPage,
        setCurrentPage,
        // Admin & CRUD Operations
        adminActiveTab,
        setAdminActiveTab,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        users,
        addUser,
        updateUser,
        deleteUser,
        resetUsersToDefault,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
