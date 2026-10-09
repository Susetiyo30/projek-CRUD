import React, { useState, useEffect } from "react";
import { useShop } from "../../context/ShopContext";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Users,
  Shield,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
} from "lucide-react";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
];

export default function AdminUsers() {
  const { users, user: currentUser, addUser, updateUser, deleteUser, resetUsersToDefault } = useShop();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = add, object = edit
  const [deletingUser, setDeletingUser] = useState(null);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isModalOpen || deletingUser) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, deletingUser]);

  // Handle ESC key to dismiss modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (deletingUser) {
          setDeletingUser(null);
        } else if (isModalOpen) {
          setIsModalOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deletingUser, isModalOpen]);

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Member",
    status: "Aktif",
    rewardPoints: 100,
    totalSpent: 0,
    avatar: AVATAR_PRESETS[0],
  });

  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    if (
      search.trim() &&
      !u.name.toLowerCase().includes(search.toLowerCase()) &&
      !u.email.toLowerCase().includes(search.toLowerCase()) &&
      !u.id.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const openAddModal = () => {
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      phone: "0812-0000-1111",
      role: "Member",
      status: "Aktif",
      rewardPoints: 100,
      totalSpent: 0,
      avatar: AVATAR_PRESETS[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (u) => {
    setEditingUser(u);
    setForm({
      name: u.name,
      email: u.email,
      phone: u.phone || "0812-0000-1111",
      role: u.role,
      status: u.status,
      rewardPoints: u.rewardPoints || 0,
      totalSpent: u.totalSpent || 0,
      avatar: u.avatar || AVATAR_PRESETS[0],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    const payload = {
      ...form,
      rewardPoints: Number(form.rewardPoints) || 0,
      totalSpent: Number(form.totalSpent) || 0,
    };

    if (editingUser) {
      updateUser(editingUser.id, payload);
    } else {
      addUser(payload);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      deleteUser(deletingUser.id);
      setDeletingUser(null);
    }
  };

  return (
    <div className="admin-crud-container">
      {/* Header bar */}
      <div className="admin-section-header">
        <div>
          <h2 className="admin-page-title">Manajemen Akun Pengguna</h2>
          <p className="admin-page-desc">
            Kontrol otorisasi admin, status keanggotaan VIP, dan kelola database pelanggan.
          </p>
        </div>
        <div className="admin-header-actions">
          <button
            id="admin-add-user-btn"
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <Plus size={18} />
            <span>Tambah Pengguna Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-table-filters glass-panel">
        <div className="admin-search-wrapper">
          <Search size={18} className="admin-search-icon" />
          <input
            id="admin-user-search"
            type="text"
            placeholder="Cari berdasarkan nama pengguna, email, atau ID..."
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
            id="admin-user-role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">Semua Peran (Role)</option>
            <option value="Admin">Admin</option>
            <option value="VIP Member">VIP Member</option>
            <option value="Member">Member Biasa</option>
          </select>

          <select
            id="admin-user-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-card glass-panel">
        <div className="table-responsive">
          <table className="admin-data-table" id="admin-users-table">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Kontak &amp; Email</th>
                <th>Peran (Role)</th>
                <th>Status Akun</th>
                <th>Poin Reward</th>
                <th>Total Belanja</th>
                <th>Terdaftar Sejak</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="admin-empty-table-cell">
                    <Users size={36} className="empty-table-icon" />
                    <p>Tidak ada data pengguna yang sesuai dengan pencarian Anda.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const isCurrent = currentUser && currentUser.id === u.id;
                  return (
                    <tr key={u.id} id={`admin-user-row-${u.id}`}>
                      <td>
                        <div className="table-user-cell">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="table-user-avatar"
                          />
                          <div>
                            <strong className="table-user-name">
                              {u.name} {isCurrent && <span className="you-pill">(Anda)</span>}
                            </strong>
                            <span className="table-user-id">ID: {u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="table-contact-cell">
                          <span className="contact-line">
                            <Mail size={13} /> {u.email}
                          </span>
                          <span className="contact-line-sub">
                            <Phone size={12} /> {u.phone || "-"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`role-pill ${
                            u.role === "Admin"
                              ? "role-admin"
                              : u.role === "VIP Member"
                              ? "role-vip"
                              : "role-member"
                          }`}
                        >
                          <Shield size={12} />
                          <span>{u.role}</span>
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-pill ${
                            u.status === "Aktif" ? "status-active" : "status-inactive"
                          }`}
                        >
                          <span className="status-dot-circle"></span>
                          <span>{u.status}</span>
                        </span>
                      </td>
                      <td>
                        <span className="points-badge">
                          <Sparkles size={12} />
                          <span>{u.rewardPoints} Poin</span>
                        </span>
                      </td>
                      <td>
                        <strong className="spent-val">${u.totalSpent.toLocaleString()}</strong>
                      </td>
                      <td>
                        <span className="table-date">{u.joinDate}</span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="table-actions-cell">
                          <button
                            id={`admin-edit-user-${u.id}`}
                            className="btn-icon table-action-btn edit-btn"
                            onClick={() => openEditModal(u)}
                            title="Sunting Pengguna"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            id={`admin-delete-user-${u.id}`}
                            className="btn-icon table-action-btn delete-btn"
                            onClick={() => setDeletingUser(u)}
                            disabled={isCurrent}
                            title={
                              isCurrent
                                ? "Tidak dapat menghapus akun Anda sendiri"
                                : "Hapus Pengguna"
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="admin-table-footer">
          <span>
            Menampilkan <strong>{filtered.length}</strong> dari <strong>{users.length}</strong> total pengguna terdaftar
          </span>
          <button
            id="admin-reset-default-users-btn"
            className="btn btn-secondary btn-sm-action"
            onClick={resetUsersToDefault}
          >
            <RotateCcw size={14} />
            <span>Pulihkan Pengguna Bawaan</span>
          </button>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="admin-form-modal glass-panel"
            id="user-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-row">
              <h3 className="modal-box-title">
                {editingUser ? `Sunting Pengguna: ${editingUser.name}` : "Tambah Pengguna Baru"}
              </h3>
              <button
                id="close-user-form-modal"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form-content">
              <div className="form-grid-2">
                <div className="input-group">
                  <label htmlFor="form-user-name">Nama Lengkap *</label>
                  <input
                    id="form-user-name"
                    type="text"
                    required
                    placeholder="Contoh: Raymond Wijaya"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="form-user-email">Alamat Email *</label>
                  <input
                    id="form-user-email"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="input-group">
                  <label htmlFor="form-user-phone">Nomor Telepon / WhatsApp</label>
                  <input
                    id="form-user-phone"
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="form-user-points">Poin Reward</label>
                  <input
                    id="form-user-points"
                    type="number"
                    min="0"
                    placeholder="100"
                    value={form.rewardPoints}
                    onChange={(e) => setForm({ ...form, rewardPoints: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="input-group">
                  <label htmlFor="form-user-role">Peran Akses (Role)</label>
                  <select
                    id="form-user-role"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="admin-select"
                  >
                    <option value="Admin">Admin (Hak Akses Penuh)</option>
                    <option value="VIP Member">VIP Member (Pelanggan Utama)</option>
                    <option value="Member">Member (Pelanggan Reguler)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="form-user-status">Status Akun</label>
                  <select
                    id="form-user-status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="admin-select"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              {/* Avatar Presets Selection */}
              <div className="input-group">
                <label>Pilih Foto Profil Avatar:</label>
                <div className="avatar-presets-row">
                  {AVATAR_PRESETS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`avatar-preset-btn ${form.avatar === av ? "active" : ""}`}
                      onClick={() => setForm({ ...form, avatar: av })}
                    >
                      <img src={av} alt={`Avatar ${idx}`} className="avatar-preset-img" />
                    </button>
                  ))}
                </div>
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
                  id="submit-user-form-btn"
                  type="submit"
                  className="btn btn-primary"
                >
                  <Check size={18} />
                  <span>{editingUser ? "Simpan Perubahan" : "Daftarkan Pengguna"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="modal-overlay" onClick={() => setDeletingUser(null)}>
          <div
            className="admin-delete-modal glass-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="close-delete-user-modal-btn"
              type="button"
              className="modal-close-btn"
              onClick={() => setDeletingUser(null)}
              title="Tutup dialog konfirmasi"
              aria-label="Tutup dialog"
            >
              <X size={18} />
            </button>
            <div className="delete-icon-wrap">
              <AlertTriangle size={36} className="alert-delete-icon" />
            </div>
            <h3 className="delete-title">Hapus Pengguna Ini?</h3>
            <p className="delete-desc">
              Apakah Anda yakin ingin menghapus akun <strong>"{deletingUser.name}"</strong> (
              {deletingUser.email})? Tindakan ini akan menghapus data keanggotaan pengguna dari
              sistem.
            </p>
            <div className="modal-actions-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeletingUser(null)}
              >
                Batal
              </button>
              <button
                id="confirm-delete-user-btn"
                type="button"
                className="btn btn-danger-action"
                onClick={handleConfirmDelete}
              >
                <Trash2 size={16} />
                <span>Ya, Hapus Pengguna</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
