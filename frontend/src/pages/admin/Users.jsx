import { useState, useEffect } from "react";
import {
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
} from "../../services/adminService";
import { BiEdit, BiTrash, BiShield } from "react-icons/bi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const fetchUsers = async () => {
    try {
      const res = await getAdminUsers();
      setUsers(res.data.data);
    } catch (_) {
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setError("");
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        username: form.username,
        email: form.email,
        role: form.role,
      };
      if (form.password) payload.password = form.password;
      await updateAdminUser(editing.id, payload);
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus user ini?")) return;
    try {
      await deleteAdminUser(id);
      fetchUsers();
    } catch (_) {
      setError("Gagal menghapus.");
    }
  };

  const handleRoleToggle = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (
      !window.confirm(
        `Ubah role ${user.username} dari ${user.role} menjadi ${newRole}?`,
      )
    )
      return;
    try {
      await updateAdminUser(user.id, { role: newRole });
      fetchUsers();
    } catch (_) {
      setError("Gagal mengubah role.");
    }
  };

  if (loading)
    return <div className="text-center py-5 text-muted">Memuat...</div>;

  return (
    <div>
      <h4 className="fw-bold mb-3">Manage Users</h4>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Bergabung</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td className="fw-medium">{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <span
                    className={`badge ${u.role === "admin" ? "bg-danger" : "bg-secondary"}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td>
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString("id-ID")
                    : "-"}
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => openEdit(u)}
                      title="Edit"
                    >
                      <BiEdit size={16} />
                    </button>
                    <button
                      className={`btn btn-outline-${u.role === "admin" ? "warning" : "info"} btn-sm`}
                      onClick={() => handleRoleToggle(u)}
                      title="Toggle Role"
                    >
                      <BiShield size={16} />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(u.id)}
                      title="Hapus"
                    >
                      <BiTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
                  Belum ada user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Username</label>
                    <input
                      className="form-control form-control-sm"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control form-control-sm"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">
                      Password{" "}
                      <small className="text-muted">
                        (kosongkan jika tidak diubah)
                      </small>
                    </label>
                    <input
                      className="form-control form-control-sm"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select form-select-sm"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {error && (
                    <div className="alert alert-danger py-1 small">{error}</div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
