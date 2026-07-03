import { useState, useEffect } from "react";
import {
  getAdminShowtimes,
  createAdminShowtime,
  updateAdminShowtime,
  deleteAdminShowtime,
  getAdminMovies,
} from "../../services/adminService";
import { BiEdit, BiTrash, BiPlus } from "react-icons/bi";

export default function AdminShowtimes() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ movie_id: "", show_time: "" });

  const fetchData = async () => {
    try {
      const [stRes, mvRes] = await Promise.all([
        getAdminShowtimes(),
        getAdminMovies(),
      ]);
      setShowtimes(stRes.data.data);
      setMovies(mvRes.data.data);
    } catch (_) {
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ movie_id: movies[0]?.id?.toString() || "", show_time: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (st) => {
    setEditing(st);
    setForm({
      movie_id: st.movie_id.toString(),
      show_time: st.show_time.slice(0, 5),
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
    if (!form.movie_id || !form.show_time) {
      setError("Semua field wajib diisi.");
      return;
    }
    const showTimeValue = form.show_time.includes(":")
      ? form.show_time + ":00"
      : form.show_time;
    try {
      const payload = { movie_id: form.movie_id, show_time: showTimeValue };
      if (editing) {
        await updateAdminShowtime(editing.id, payload);
      } else {
        await createAdminShowtime(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus jadwal ini?")) return;
    try {
      await deleteAdminShowtime(id);
      fetchData();
    } catch (_) {
      setError("Gagal menghapus.");
    }
  };

  if (loading)
    return <div className="text-center py-5 text-muted">Memuat...</div>;

  // Group showtimes by movie
  const grouped = showtimes.reduce((acc, st) => {
    const key = st.movie_id;
    if (!acc[key])
      acc[key] = { movie_id: key, movie_name: st.movie_name, items: [] };
    acc[key].items.push(st);
    return acc;
  }, {});
  const groupedList = Object.values(grouped);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Manage Showtimes</h4>
        <button
          className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          onClick={openCreate}
        >
          <BiPlus size={18} /> Tambah Jadwal
        </button>
      </div>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Movie</th>
              <th>Jam Tayang</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {groupedList.map((group, i) => (
              <tr key={group.movie_id}>
                <td>{i + 1}</td>
                <td className="fw-medium">{group.movie_name}</td>
                <td>
                  <div className="d-flex flex-wrap gap-1">
                    {group.items.map((st) => (
                      <div
                        key={st.id}
                        className="d-inline-flex align-items-center gap-1 border rounded px-2 py-1"
                      >
                        <span
                          className="fw-medium"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {st.show_time?.slice(0, 5)}
                        </span>
                        <button
                          className="btn btn-link btn-sm p-0 text-primary"
                          onClick={() => openEdit(st)}
                          title="Edit"
                        >
                          <BiEdit size={14} />
                        </button>
                        <button
                          className="btn btn-link btn-sm p-0 text-danger"
                          onClick={() => handleDelete(st.id)}
                          title="Hapus"
                        >
                          <BiTrash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <span className="text-muted small">
                    {group.items.length} jadwal
                  </span>
                </td>
              </tr>
            ))}
            {groupedList.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">
                  Belum ada jadwal.
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
                <h5 className="modal-title">
                  {editing ? "Edit Jadwal" : "Tambah Jadwal"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Film</label>
                    <select
                      className="form-select form-select-sm"
                      name="movie_id"
                      value={form.movie_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Pilih Film --</option>
                      {movies.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.movie_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Jam Tayang</label>
                    <input
                      className="form-control form-control-sm"
                      type="time"
                      name="show_time"
                      value={form.show_time}
                      onChange={handleChange}
                      required
                    />
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
                    {editing ? "Simpan" : "Tambah"}
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
