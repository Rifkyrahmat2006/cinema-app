import { Link } from "react-router-dom";
import { BiStar, BiTime } from "react-icons/bi";

export default function MovieCard({ movie }) {
  const placeholder = `https://placehold.co/350x500/1a1a2e/eeeeee?text=${encodeURIComponent(
    movie.movie_name,
  )}`;

  return (
    <div className="card h-100 shadow-sm border-0">
      {/* Poster */}
      <div
        style={{
          height: 350,
          overflow: "hidden",
          background: "#1a1a2e",
        }}
      >
        <img
          src={movie.poster || placeholder}
          alt={movie.movie_name}
          className="card-img-top"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.src = placeholder;
          }}
        />
      </div>

      {/* Body */}
      <div className="card-body d-flex flex-column">
        <h6 className="card-title fw-bold mb-1">{movie.movie_name}</h6>
        <span className="badge bg-secondary align-self-start mb-2">
          {movie.genre}
        </span>

        <div className="d-flex flex-wrap gap-3 small text-muted mb-2">
          {movie.rating && (
            <span className="d-flex align-items-center gap-1">
              <BiStar className="text-warning" /> {movie.rating}
            </span>
          )}
          {movie.duration && (
            <span className="d-flex align-items-center gap-1">
              <BiTime /> {movie.duration}
            </span>
          )}
          <span className="d-flex align-items-center gap-1 fw-semibold text-success">
            Rp {Number(movie.price || 38500).toLocaleString()}
          </span>
        </div>

        {movie.sinopsis && (
          <p className="small text-muted mb-3" style={{ textAlign: "justify" }}>
            {movie.sinopsis.length > 100
              ? movie.sinopsis.slice(0, 100) + "..."
              : movie.sinopsis}
          </p>
        )}

        {/* Buttons */}
        <div className="mt-auto d-flex gap-2">
          <Link
            to={`/movie/${movie.id}`}
            className="btn btn-outline-primary btn-sm flex-grow-1"
          >
            Detail
          </Link>
          <Link
            to={`/booking/${movie.id}`}
            className="btn btn-primary btn-sm flex-grow-1"
          >
            Booking
          </Link>
        </div>
      </div>
    </div>
  );
}
