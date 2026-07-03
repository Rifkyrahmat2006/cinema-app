import { NavLink, useNavigate } from "react-router-dom";
import {
  BiFilm,
  BiHome,
  BiHistory,
  BiLogIn,
  BiUserPlus,
  BiLogOut,
  BiShield,
} from "react-icons/bi";

const menu = [
  { label: "Home", path: "/", icon: BiHome },
  { label: "History", path: "/history", icon: BiHistory },
];

const guestMenu = [
  { label: "Login", path: "/login", icon: BiLogIn },
  { label: "Register", path: "/register", icon: BiUserPlus },
];

export default function Sidebar() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
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
      {/* Header */}
      <div
        className="d-flex align-items-center justify-content-center py-3"
        style={{ background: "rgba(0,0,0,0.15)" }}
      >
        <BiFilm size={28} className="me-2" />
        <span className="fw-bold fs-5">Cinema App</span>
      </div>

      {/* Menu */}
      <nav className="flex-grow-1 px-2 pt-3">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
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

        {/* Admin panel link (hanya untuk admin) */}
        {user.role === "admin" && (
          <>
            <NavLink
              to="/admin"
              end
              className="d-flex align-items-center gap-2 px-3 py-2 rounded text-white text-decoration-none mb-1"
              style={({ isActive }) => ({
                background: isActive ? "rgba(255,255,255,0.2)" : "transparent",
              })}
            >
              <BiShield size={20} />
              Admin Panel
            </NavLink>
            <hr className="my-2 opacity-25" />
          </>
        )}

        {!token
          ? guestMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="d-flex align-items-center gap-2 px-3 py-2 rounded text-white text-decoration-none mb-1"
                style={({ isActive }) => ({
                  background: isActive
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
                })}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))
          : null}
      </nav>

      {/* Logout */}
      {token && (
        <div className="px-2 pb-3">
          <button
            className="btn btn-outline-light w-100 d-flex align-items-center gap-2"
            onClick={handleLogout}
          >
            <BiLogOut size={20} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
