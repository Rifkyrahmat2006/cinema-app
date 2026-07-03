import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar />
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: 240 }}
      >
        <Navbar />
        <main className="p-4 flex-grow-1" style={{ overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
