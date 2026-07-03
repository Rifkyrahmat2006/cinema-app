import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { BiSearch, BiLogIn, BiLogOut } from "react-icons/bi";

const pageTitles = {
  "/": "Daftar Film",
  "/history": "Riwayat Pemesanan",
  "/login": "Masuk",
  "/register": "Daftar",
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(urlSearch);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Sinkronisasi input dengan URL search param
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate("/");
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (!val.trim()) {
      navigate("/");
    }
  };

  const isDetailOrBooking =
    location.pathname.startsWith("/movie/") ||
    location.pathname.startsWith("/booking/");

  const title = isDetailOrBooking
    ? location.pathname.startsWith("/movie/")
      ? "Detail Film"
      : "Pesan Tiket"
    : pageTitles[location.pathname] || "Cinema App";

  return (
    <nav
      className="navbar navbar-expand shadow-sm"
      style={{
        height: 64,
        flexShrink: 0,
        background: "#fff",
      }}
    >
      <div className="container-fluid px-4">
        {/* Left: Page title */}
        <h6 className="fw-semibold mb-0 d-none d-md-block">{title}</h6>

        {/* Right: Search + User */}
        <div className="d-flex align-items-center gap-3 ms-auto">
          {/* Search */}
          <form onSubmit={handleSearch} className="d-none d-sm-block">
            <div
              className="input-group input-group-sm"
              style={{ maxWidth: 260 }}
            >
              <span className="input-group-text bg-white border-end-0">
                <BiSearch size={16} className="text-secondary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Cari film..."
                value={search}
                onChange={handleInputChange}
              />
            </div>
          </form>

          {/* Divider */}
          <div className="vr opacity-25" style={{ height: 28 }} />

          {/* User */}
          {token ? (
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle text-white fw-semibold"
                style={{
                  width: 34,
                  height: 34,
                  background: "linear-gradient(135deg, #0d6efd, #6610f2)",
                  fontSize: 14,
                }}
              >
                {(user.username || "U").charAt(0).toUpperCase()}
              </div>
              <span
                className="fw-medium d-none d-md-inline"
                style={{ fontSize: 14 }}
              >
                {user.username || "User"}
              </span>
              <button
                className="btn btn-sm btn-outline-danger ms-1 d-flex align-items-center gap-1"
                title="Logout"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
              >
                <BiLogOut size={16} />
                <span className="d-none d-md-inline">Keluar</span>
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-1 px-3"
              onClick={() => navigate("/login")}
            >
              <BiLogIn size={16} />
              Masuk
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
