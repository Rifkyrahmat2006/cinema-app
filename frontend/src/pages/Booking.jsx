import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getMovies, getShowtimes } from "../services/movieService";
import { createOrder, getOccupiedSeats } from "../services/orderService";
import { BiArrowBack } from "react-icons/bi";
import Loading from "../components/Loading";

const ROWS = ["A", "B", "C", "D", "E"];
const SEATS_PER_ROW = 8;

function generateSeats() {
  const seats = [];
  for (const row of ROWS) {
    for (let n = 1; n <= SEATS_PER_ROW; n++) {
      seats.push(`${row}${n}`);
    }
  }
  return seats;
}

const ALL_SEATS = generateSeats();

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    watch_date: today,
    watch_time: "",
    selectedSeats: [],
    payment_proof: null,
  });

  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loadingOccupied, setLoadingOccupied] = useState(false);

  // Filter showtimes: sembunyikan yg sudah lewat jika tanggal hari ini
  const now = new Date();
  const currentHHmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const availableShowtimes =
    form.watch_date === today
      ? showtimes.filter((st) => st.show_time.slice(0, 5) > currentHHmm)
      : showtimes;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const fetch = async () => {
      try {
        const [movieRes, showtimeRes] = await Promise.all([
          getMovies(),
          getShowtimes(id),
        ]);
        const found = movieRes.data.data.find((m) => m.id === Number(id));
        if (!found) setError("Film tidak ditemukan.");
        else setMovie(found);
        setShowtimes(showtimeRes.data.data || []);
      } catch (_) {
        setError("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, token, navigate]);

  // Fetch occupied seats when date or time changes
  useEffect(() => {
    if (!movie || !form.watch_date || !form.watch_time) {
      setOccupiedSeats([]);
      return;
    }
    const watchAt = `${form.watch_date} ${form.watch_time}:00`;
    const fetchOccupied = async () => {
      setLoadingOccupied(true);
      try {
        const res = await getOccupiedSeats(movie.movie_name, watchAt);
        setOccupiedSeats(res.data.data || []);
      } catch (_) {
        setOccupiedSeats([]);
      } finally {
        setLoadingOccupied(false);
      }
    };
    fetchOccupied();
  }, [movie, form.watch_date, form.watch_time]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "payment_proof") {
      setForm({ ...form, payment_proof: files[0] || null });
    } else {
      setForm({ ...form, [name]: value, selectedSeats: [] });
    }
  };

  const toggleSeat = (seat) => {
    setForm((prev) => {
      const already = prev.selectedSeats.includes(seat);
      const next = already
        ? prev.selectedSeats.filter((s) => s !== seat)
        : [...prev.selectedSeats, seat];
      return { ...prev, selectedSeats: next };
    });
  };

  const pricePerTicket = movie?.price || 38500;
  const ticketQty = form.selectedSeats.length;
  const totalPrice = ticketQty * pricePerTicket;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ticketQty < 1) {
      setError("Pilih minimal 1 kursi.");
      return;
    }
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("movie_name", movie.movie_name);
      fd.append("watch_at", `${form.watch_date} ${form.watch_time}:00`);
      fd.append("seat", form.selectedSeats.join(", "));
      fd.append("ticket", ticketQty);
      if (form.payment_proof) fd.append("payment_proof", form.payment_proof);

      const res = await createOrder(fd);
      setSuccess(
        `Pesanan berhasil! Total: Rp ${Number(
          res.data.data?.price || totalPrice,
        ).toLocaleString()}`,
      );
      setForm({
        watch_date: today,
        watch_time: "",
        selectedSeats: [],
        payment_proof: null,
      });
      setOccupiedSeats([]);
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal membuat pesanan.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (!movie)
    return (
      <div className="alert alert-danger">
        {error || "Film tidak ditemukan."}
      </div>
    );

  const placeholder = `https://placehold.co/200x300/1a1a2e/eeeeee?text=${encodeURIComponent(
    movie.movie_name,
  )}`;

  return (
    <div className="row g-4">
      {/* Back */}
      <div className="col-12">
        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <BiArrowBack /> Kembali
        </button>
      </div>

      <div className="col-md-5 col-lg-4">
        <img
          src={movie.poster || placeholder}
          alt={movie.movie_name}
          className="img-fluid rounded shadow"
          style={{
            width: "100%",
            maxHeight: 420,
            objectFit: "contain",
            background: "#111",
          }}
          onError={(e) => {
            e.target.src = placeholder;
          }}
        />
        <div className="mt-3">
          <h5 className="fw-bold">{movie.movie_name}</h5>
          <span className="badge bg-secondary">{movie.genre}</span>
          {movie.sinopsis && (
            <p
              className="mt-2 small text-muted"
              style={{ textAlign: "justify" }}
            >
              {movie.sinopsis}
            </p>
          )}
          <p className="mb-0">
            <strong>Harga:</strong> Rp {pricePerTicket.toLocaleString()} / tiket
          </p>
        </div>
      </div>

      <div className="col-md-7 col-lg-8">
        <h5 className="fw-bold mb-3">Form Pemesanan Tiket</h5>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && (
          <div className="alert alert-success py-2">
            {success}
            <div className="mt-2">
              <Link to="/history" className="btn btn-success btn-sm">
                Lihat Riwayat Pesanan
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nama Film</label>
            <input
              type="text"
              className="form-control"
              value={movie.movie_name}
              readOnly
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Tanggal</label>
              <input
                type="date"
                className="form-control"
                name="watch_date"
                value={form.watch_date}
                onChange={handleChange}
                min={today}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Jam Tayang</label>
              <select
                className="form-select"
                name="watch_time"
                value={form.watch_time}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Jam --</option>
                {availableShowtimes.length === 0 ? (
                  <option value="" disabled>
                    {form.watch_date === today
                      ? "Tidak ada jam tayang tersedia untuk hari ini"
                      : "Tidak ada jam tayang"}
                  </option>
                ) : (
                  availableShowtimes.map((st) => (
                    <option key={st.id} value={st.show_time.slice(0, 5)}>
                      {st.show_time.slice(0, 5)}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Seat Grid */}
          {form.watch_time && (
            <div className="mb-3">
              <label className="form-label d-block">
                Pilih Kursi
                {loadingOccupied && (
                  <small className="text-muted ms-2">Memuat...</small>
                )}
              </label>
              <div
                className="border rounded p-3 bg-white"
                style={{ maxWidth: 420 }}
              >
                {/* Layar */}
                <div className="text-center mb-3">
                  <div
                    className="mx-auto rounded"
                    style={{
                      width: "70%",
                      height: 8,
                      background: "linear-gradient(90deg, #aaa, #ddd, #aaa)",
                    }}
                  />
                  <small className="text-muted">LAYAR</small>
                </div>
                {/* Kursi */}
                <div className="d-flex flex-column gap-1">
                  {ROWS.map((row) => (
                    <div
                      key={row}
                      className="d-flex justify-content-center gap-1"
                    >
                      <span
                        className="text-muted d-flex align-items-center justify-content-center"
                        style={{ width: 20, fontSize: 12 }}
                      >
                        {row}
                      </span>
                      {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                        const seat = `${row}${i + 1}`;
                        const isOccupied = occupiedSeats.includes(seat);
                        const isSelected = form.selectedSeats.includes(seat);
                        let btnClass =
                          "btn btn-sm d-flex align-items-center justify-content-center p-0";
                        btnClass += isSelected
                          ? " btn-success text-white"
                          : isOccupied
                            ? " btn-secondary disabled text-muted"
                            : " btn-outline-primary";
                        return (
                          <button
                            key={seat}
                            type="button"
                            className={btnClass}
                            style={{ width: 34, height: 34, fontSize: 11 }}
                            disabled={isOccupied}
                            onClick={() => !isOccupied && toggleSeat(seat)}
                            title={seat}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
                {/* Legend */}
                <div className="d-flex justify-content-center gap-3 mt-2 small">
                  <span className="d-flex align-items-center gap-1">
                    <span
                      className="d-inline-block border border-primary rounded"
                      style={{ width: 14, height: 14 }}
                    />
                    Tersedia
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <span
                      className="d-inline-block bg-success rounded"
                      style={{ width: 14, height: 14 }}
                    />
                    Dipilih
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <span
                      className="d-inline-block bg-secondary rounded"
                      style={{ width: 14, height: 14 }}
                    />
                    Terisi
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="row mb-3 align-items-center">
            <div className="col-md-4">
              <small className="text-muted">Kursi dipilih</small>
              <p className="fw-bold mb-0">
                {form.selectedSeats.length > 0
                  ? form.selectedSeats.join(", ")
                  : "-"}
              </p>
            </div>
            <div className="col-md-4">
              <small className="text-muted">Jumlah Tiket</small>
              <p className="fw-bold mb-0">{ticketQty}</p>
            </div>
            <div className="col-md-4">
              <small className="text-muted">Total</small>
              <p className="fw-bold text-success fs-5 mb-0">
                Rp {totalPrice.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Bukti Pembayaran</label>
            <input
              type="file"
              className="form-control"
              name="payment_proof"
              onChange={handleChange}
              accept="image/*"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || ticketQty < 1}
          >
            {submitting
              ? "Memproses..."
              : `Pesan ${ticketQty > 0 ? `(${ticketQty} tiket)` : "Tiket"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
