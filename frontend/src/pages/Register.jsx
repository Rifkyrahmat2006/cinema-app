import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { BiFilm } from "react-icons/bi";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak sesuai.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      const res = await register(form.username, form.email, form.password);
      const { token, id, username, email } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ id, username, email }));
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Registrasi gagal. Silakan coba lagi.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card shadow" style={{ width: 420, maxWidth: "90%" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <BiFilm size={40} className="text-primary" />
            <h5 className="fw-bold mt-2">Cinema App</h5>
            <p className="text-muted small">Buat akun baru</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Konfirmasi Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="text-center mt-3 small mb-0">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-decoration-none">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
