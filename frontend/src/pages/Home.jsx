import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getMovies } from "../services/movieService";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMovies();
        setMovies(res.data.data);
      } catch (err) {
        setError("Gagal memuat daftar film.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = searchQuery
    ? movies.filter((m) =>
        m.movie_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : movies;

  if (loading) return <Loading />;
  if (error)
    return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Daftar Film</h4>
          {searchQuery && (
            <small className="text-muted">
              Hasil pencarian: "{searchQuery}"
            </small>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p className="fs-5 mb-0">Film tidak ditemukan.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((movie) => (
            <div key={movie.id} className="col-lg-3 col-md-4 col-sm-6">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
