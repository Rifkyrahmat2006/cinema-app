import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DetailMovie from "../pages/DetailMovie";
import Booking from "../pages/Booking";
import History from "../pages/History";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminMovies from "../pages/admin/Movies";
import AdminShowtimes from "../pages/admin/Showtimes";
import AdminOrders from "../pages/admin/Orders";
import AdminUsers from "../pages/admin/Users";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth pages — tanpa layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Pages dengan sidebar + navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<DetailMovie />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/history" element={<History />} />
      </Route>

      {/* Admin pages — layout sendiri */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="movies" element={<AdminMovies />} />
        <Route path="showtimes" element={<AdminShowtimes />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}
