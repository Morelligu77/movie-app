import { useState, useEffect } from "react";
import "./App.css";

const API = "http://127.0.0.1:5000";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

function App() {
  const [movies, setMovies] = useState([]);
  const [myList, setMyList] = useState([]);
  const [error, setError] = useState("");

  // READ: popular movies from TMDB (through Python)
  useEffect(() => {
    fetch(`${API}/api/movies/popular`)
      .then((res) => res.json())
      .then((data) => setMovies(data.results))
      .catch(() => setError("Could not load movies. Is Flask running?"));
    loadList();
  }, []);

  // READ: My List from the database
  function loadList() {
    fetch(`${API}/api/list`)
      .then((res) => res.json())
      .then((data) => setMyList(data))
      .catch(() => setError("Could not load My List. Is Flask running?"));
  }

  // CREATE
  function addMovie(movie) {
    fetch(`${API}/api/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
      }),
    }).then(loadList);
  }

  // UPDATE
  function toggleWatched(movie) {
    fetch(`${API}/api/list/${movie.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watched: !movie.watched }),
    }).then(loadList);
  }

  // DELETE
  function removeMovie(id) {
    fetch(`${API}/api/list/${id}`, { method: "DELETE" }).then(loadList);
  }

  const savedIds = myList.map((m) => m.id);

  return (
    <div className="app">
      <h1>My Movie App</h1>
      {error && <p className="error">{error}</p>}

      <h2>My List ({myList.length})</h2>
      {myList.length === 0 && (
        <p className="empty">Your list is empty. Add a movie below.</p>
      )}
      <div className="grid">
        {myList.map((movie) => (
          <div className={`card ${movie.watched ? "watched" : ""}`} key={movie.id}>
            <img src={IMG_URL + movie.poster_path} alt={movie.title} />
            <h3>{movie.title}</h3>
            <p>⭐ {movie.vote_average.toFixed(1)}</p>
            <div className="buttons">
              <button onClick={() => toggleWatched(movie)}>
                {movie.watched ? "Watched ✓" : "Mark watched"}
              </button>
              <button className="danger" onClick={() => removeMovie(movie.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2>Popular movies</h2>
      <div className="grid">
        {movies.map((movie) => (
          <div className="card" key={movie.id}>
            <img src={IMG_URL + movie.poster_path} alt={movie.title} />
            <h3>{movie.title}</h3>
            <p>⭐ {movie.vote_average.toFixed(1)}</p>
            <div className="buttons">
              <button
                onClick={() => addMovie(movie)}
                disabled={savedIds.includes(movie.id)}
              >
                {savedIds.includes(movie.id) ? "In My List" : "+ Add to My List"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;