import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOrders, cancelOrder } from "../services/orderService";
import { BiDetail, BiX, BiFilm } from "react-icons/bi";
import Loading from "../components/Loading";

export default function History() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data.data);
    } catch (_) {
      setError("Gagal memuat riwayat pesanan.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Yakin ingin membatalkan pesanan ini?")) return;
    setCancelling(id);
    try {
      await cancelOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (_) {
      alert("Gagal membatalkan pesanan.");
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (dt) => {
    const d = new Date(dt);
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dt) => {
    const d = new Date(dt);
    return d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h4 className="fw-bold mb-4">Riwayat Pemesanan</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      {orders.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <BiFilm size={60} className="mb-3 opacity-50" />
          <p className="fs-5 mb-0">Belum ada pemesanan.</p>
          <Link to="/" className="btn btn-primary mt-3">
            Pesan Tiket Sekarang
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Film</th>
                  <th>Kursi</th>
                  <th>Tgl Pemesanan</th>
                  <th>Waktu Menonton</th>
                  <th>Harga</th>
                  <th>Bukti</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order.id}>
                    <td>{idx + 1}</td>
                    <td className="fw-medium">{order.movie_name}</td>
                    <td>{order.seat}</td>
                    <td>{formatDate(order.created_at || order.watch_at)}</td>
                    <td>
                      {formatDate(order.watch_at)} {formatTime(order.watch_at)}
                    </td>
                    <td className="fw-semibold text-success">
                      Rp {Number(order.price).toLocaleString()}
                    </td>
                    <td>
                      {order.payment_proof_url ? (
                        <a
                          href={order.payment_proof_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-info"
                        >
                          Lihat
                        </a>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          title="Detail"
                          onClick={() => {
                            alert(
                              `Film: ${order.movie_name}\nKursi: ${order.seat}\nTgl Pesan: ${formatDate(order.created_at || order.watch_at)}\nMenonton: ${formatDate(order.watch_at)} ${formatTime(order.watch_at)}\nTiket: ${order.ticket}\nTotal: Rp ${Number(order.price).toLocaleString()}`,
                            );
                          }}
                        >
                          <BiDetail />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Batalkan"
                          onClick={() => handleCancel(order.id)}
                          disabled={cancelling === order.id}
                        >
                          {cancelling === order.id ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                            />
                          ) : (
                            <BiX />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
