import { useState, useEffect } from "react";
import {
  getAdminMovies,
  createAdminMovie,
  updateAdminMovie,
  deleteAdminMovie,
} from "../../services/adminService";
import { BiEdit, BiTrash, BiPlus } from "react-icons/bi";

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    movie_name: "",
    genre: "Action",
    poster: "",
    rating: "",
    duration: "",
    sinopsis: "",
    price: 38500,
  });
  const [posterFile, setPosterFile] = useState(null);

  const fetchMovies = async () => {
    try {
      const res = await getAdminMovies();
      setMovies(res.data.data);
    } catch (_) {
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      movie_name: "",
      genre: "Action",
      poster: "",
      rating: "",
      duration: "",
      sinopsis: "",
      price: 38500,
    });
    setPosterFile(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (movie) => {
    setEditing(movie);
    setForm({
      movie_name: movie.movie_name,
      genre: movie.genre,
      poster: movie.poster || "",
      rating: movie.rating?.toString() || "",
      duration: movie.duration || "",
      sinopsis: movie.sinopsis || "",
      price: movie.price,
    });
    setPosterFile(null);
    setError("");
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "poster_file") {
      setPosterFile(files[0] || null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.movie_name.trim()) {
      setError("Nama film wajib diisi.");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("movie_name", form.movie_name);
      fd.append("genre", form.genre);
      fd.append("rating", form.rating || 0);
      fd.append("duration", form.duration || "");
      fd.append("sinopsis", form.sinopsis || "");
      fd.append("price", form.price || 38500);
      if (posterFile) fd.append("poster", posterFile);
      else fd.append("poster", form.poster);

      if (editing) {
        await updateAdminMovie(editing.id, fd);
      } else {
        await createAdminMovie(fd);
      }
      setShowModal(false);
      fetchMovies();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus film ini?")) return;
    try {
      await deleteAdminMovie(id);
      fetchMovies();
    } catch (_) {
      setError("Gagal menghapus.");
    }
  };

  if (loading)
    return <div className="text-center py-5 text-muted">Memuat...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Manage Movies</h4>
        <button
          className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          onClick={openCreate}
        >
          <BiPlus size={18} /> Tambah Film
        </button>
      </div>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Poster</th>
              <th>Name</th>
              <th>Genre</th>
              <th>Rating</th>
              <th>Duration</th>
              <th>Sinopsis</th>
              <th>Price</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m, i) => (
              <tr key={m.id}>
                <td>{i + 1}</td>
                <td>
                  {m.poster && (
                    <img
                      src={
                        m.poster.startsWith("http")
                          ? m.poster
                          : `http://localhost:3000${m.poster}`
                      }
                      alt={m.movie_name}
                      style={{ width: 48, height: 64, objectFit: "cover" }}
                      className="rounded"
                    />
                  )}
                </td>
                <td className="fw-medium">{m.movie_name}</td>
                <td>{m.genre}</td>
                <td>{m.rating}</td>
                <td>{m.duration}</td>
                <td className="text-muted small" style={{ maxWidth: 200 }}>
                  {m.sinopsis
                    ? m.sinopsis.length > 80
                      ? m.sinopsis.slice(0, 80) + "..."
                      : m.sinopsis
                    : "-"}
                </td>
                <td>Rp {Number(m.price).toLocaleString()}</td>
                <td>
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => openEdit(m)}
                      title="Edit"
                    >
                      <BiEdit size={16} />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(m.id)}
                      title="Hapus"
                    >
                      <BiTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {movies.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-muted py-4">
                  Belum ada film.
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
                  {editing ? "Edit Film" : "Tambah Film"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Nama Film</label>
                    <input
                      className="form-control form-control-sm"
                      name="movie_name"
                      value={form.movie_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="row mb-2">
                    <div className="col-6">
                      <label className="form-label">Genre</label>
                      <input
                        className="form-control form-control-sm"
                        name="genre"
                        value={form.genre}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label">Rating</label>
                      <input
                        className="form-control form-control-sm"
                        name="rating"
                        type="number"
                        step="0.1"
                        max="10"
                        value={form.rating}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6">
                      <label className="form-label">Duration</label>
                      <input
                        className="form-control form-control-sm"
                        name="duration"
                        placeholder="2h 30m"
                        value={form.duration}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label">Price (Rp)</label>
                      <input
                        className="form-control form-control-sm"
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Poster URL / Upload</label>
                    <input
                      className="form-control form-control-sm mb-1"
                      name="poster"
                      placeholder="URL poster (opsional)"
                      value={form.poster}
                      onChange={handleChange}
                    />
                    <input
                      className="form-control form-control-sm"
                      name="poster_file"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Sinopsis</label>
                    <textarea
                      className="form-control form-control-sm"
                      name="sinopsis"
                      rows={3}
                      value={form.sinopsis}
                      onChange={handleChange}
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
