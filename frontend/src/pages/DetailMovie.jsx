import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMovies } from "../services/movieService";
import { BiStar, BiTime, BiDollar, BiArrowBack } from "react-icons/bi";
import Loading from "../components/Loading";

export default function DetailMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMovies();
        const found = res.data.data.find((m) => m.id === Number(id));
        if (!found) setError("Film tidak ditemukan.");
        else setMovie(found);
      } catch (_) {
        setError("Gagal memuat detail film.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!movie) return null;

  const placeholder = `https://placehold.co/400x600/1a1a2e/eeeeee?text=${encodeURIComponent(
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

      {/* Poster */}
      <div className="col-md-5 col-lg-4">
        <img
          src={movie.poster || placeholder}
          alt={movie.movie_name}
          className="img-fluid rounded shadow"
          style={{ width: "100%", maxHeight: 500, objectFit: "cover" }}
          onError={(e) => {
            e.target.src = placeholder;
          }}
        />
      </div>

      {/* Info */}
      <div className="col-md-7 col-lg-8">
        <h3 className="fw-bold">{movie.movie_name}</h3>
        <span className="badge bg-secondary fs-6 mb-3">{movie.genre}</span>

        <div className="d-flex flex-wrap gap-4 mb-3">
          {movie.rating && (
            <div className="d-flex align-items-center gap-2">
              <BiStar size={22} className="text-warning" />
              <div>
                <small className="text-muted d-block">Rating</small>
                <span className="fw-semibold">{movie.rating}/10</span>
              </div>
            </div>
          )}
          {movie.duration && (
            <div className="d-flex align-items-center gap-2">
              <BiTime size={22} className="text-primary" />
              <div>
                <small className="text-muted d-block">Durasi</small>
                <span className="fw-semibold">{movie.duration}</span>
              </div>
            </div>
          )}
          <div className="d-flex align-items-center gap-2">
            <BiDollar size={22} className="text-success" />
            <div>
              <small className="text-muted d-block">Harga Tiket</small>
              <span className="fw-semibold text-success">
                Rp {Number(movie.price || 38500).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Sinopsis */}
        {movie.sinopsis && (
          <div className="mb-4">
            <h6 className="fw-bold">Sinopsis</h6>
            <p className="text-muted" style={{ textAlign: "justify" }}>
              {movie.sinopsis}
            </p>
          </div>
        )}

        {/* Booking button */}
        <Link to={`/booking/${movie.id}`} className="btn btn-primary btn-lg">
          Pesan Tiket Sekarang
        </Link>
      </div>
    </div>
  );
}
