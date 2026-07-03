import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  BiGridAlt,
  BiFilm,
  BiTime,
  BiReceipt,
  BiUser,
  BiLogOut,
  BiArrowBack,
} from "react-icons/bi";

const adminMenu = [
  { label: "Dashboard", path: "/admin", icon: BiGridAlt, end: true },
  { label: "Movies", path: "/admin/movies", icon: BiFilm },
  { label: "Showtimes", path: "/admin/showtimes", icon: BiTime },
  { label: "Orders", path: "/admin/orders", icon: BiReceipt },
  { label: "Users", path: "/admin/users", icon: BiUser },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <div
        className="d-flex flex-column text-white sidebar-bg"
        style={{
          width: 240,
          minHeight: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center py-3"
          style={{ background: "rgba(0,0,0,0.15)" }}
        >
          <BiFilm size={28} className="me-2" />
          <span className="fw-bold fs-5">Admin Panel</span>
        </div>

        <div className="px-3 py-2 small opacity-75">Menu</div>
        <nav className="flex-grow-1 px-2">
          {adminMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className="d-flex align-items-center gap-2 px-3 py-2 rounded text-white text-decoration-none mb-1"
              style={({ isActive }) => ({
                background: isActive ? "rgba(255,255,255,0.2)" : "transparent",
              })}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}

          <hr className="my-2 opacity-25" />

          <NavLink
            to="/"
            className="d-flex align-items-center gap-2 px-3 py-2 rounded text-white text-decoration-none mb-1"
          >
            <BiArrowBack size={20} />
            Back to App
          </NavLink>
        </nav>

        <div className="px-2 pb-3">
          <div className="d-flex align-items-center gap-2 px-3 py-2 mb-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle text-white fw-semibold"
              style={{
                width: 32,
                height: 32,
                background: "rgba(255,255,255,0.3)",
                fontSize: 13,
              }}
            >
              {(user.username || "A").charAt(0).toUpperCase()}
            </div>
            <div className="small">
              <div className="fw-medium">{user.username || "Admin"}</div>
              <div className="opacity-75" style={{ fontSize: 11 }}>
                admin
              </div>
            </div>
          </div>
          <button
            className="btn btn-outline-light btn-sm w-100 d-flex align-items-center gap-2"
            onClick={handleLogout}
          >
            <BiLogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: 240 }}
      >
        <main className="p-4 flex-grow-1" style={{ overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
