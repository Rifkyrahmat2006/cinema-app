import { useState, useEffect } from "react";
import { getDashboardStats } from "../../services/adminService";
import { BiFilm, BiTime, BiReceipt, BiUser, BiDollar } from "react-icons/bi";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="text-center py-5 text-muted">Memuat...</div>;

  const cards = [
    {
      label: "Movies",
      value: stats?.movies || 0,
      icon: BiFilm,
      color: "#0d6efd",
    },
    {
      label: "Showtimes",
      value: stats?.showtimes || 0,
      icon: BiTime,
      color: "#6610f2",
    },
    {
      label: "Orders",
      value: stats?.orders || 0,
      icon: BiReceipt,
      color: "#198754",
    },
    {
      label: "Users",
      value: stats?.users || 0,
      icon: BiUser,
      color: "#fd7e14",
    },
    {
      label: "Revenue",
      value: `Rp ${(stats?.revenue || 0).toLocaleString()}`,
      icon: BiDollar,
      color: "#dc3545",
    },
  ];

  return (
    <div>
      <h4 className="fw-bold mb-4">Dashboard</h4>
      <div className="row g-3">
        {cards.map((card) => (
          <div key={card.label} className="col-md-6 col-xl-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle text-white"
                  style={{
                    width: 52,
                    height: 52,
                    background: card.color,
                    flexShrink: 0,
                  }}
                >
                  <card.icon size={24} />
                </div>
                <div>
                  <div className="text-muted small">{card.label}</div>
                  <div className="fw-bold fs-4">{card.value}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
