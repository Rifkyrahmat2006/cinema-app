import { useState, useEffect } from "react";
import { getAdminOrders } from "../../services/adminService";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminOrders()
      .then((res) => setOrders(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="text-center py-5 text-muted">Memuat...</div>;

  return (
    <div>
      <h4 className="fw-bold mb-3">All Orders</h4>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Film</th>
              <th>Kursi</th>
              <th>Tiket</th>
              <th>Tgl Pesan</th>
              <th>Waktu</th>
              <th>Harga</th>
              <th>Bukti</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={o.id}>
                <td>{i + 1}</td>
                <td>{o.username || `User #${o.user_id}`}</td>
                <td className="fw-medium">{o.movie_name}</td>
                <td>{o.seat}</td>
                <td>{o.ticket}</td>
                <td>{new Date(o.created_at).toLocaleDateString("id-ID")}</td>
                <td>{new Date(o.watch_at).toLocaleString("id-ID")}</td>
                <td>Rp {Number(o.price).toLocaleString()}</td>
                <td>
                  {o.payment_proof_url ? (
                    <a
                      href={o.payment_proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      Lihat
                    </a>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-muted py-4">
                  Belum ada pesanan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
