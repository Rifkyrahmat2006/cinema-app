import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, getProfile } from "../services/authService";
import { BiFilm } from "react-icons/bi";

export default function Login() {
  const [form, setForm] = useState({ credential: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loginRes = await login(form.credential, form.password);
      const { token, id, username, email, role } = loginRes.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ id, username, email, role }),
      );

      // Ambil profile untuk update user data
      try {
        const profileRes = await getProfile();
        const u = profileRes.data.data;
        localStorage.setItem("user", JSON.stringify(u));
      } catch (_) {}

      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login gagal. Periksa kembali data Anda.";
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
            <p className="text-muted small">Masuk ke akun Anda</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email atau Username</label>
              <input
                type="text"
                className="form-control"
                name="credential"
                value={form.credential}
                onChange={handleChange}
                placeholder="Masukkan email atau username"
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
                placeholder="Masukkan password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-center mt-3 small mb-0">
            Belum punya akun?{" "}
            <Link to="/register" className="text-decoration-none">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
