import os
import sqlite3
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()
TMDB_KEY = os.getenv("TMDB_API_KEY")

app = Flask(__name__)
CORS(app)

DB_FILE = "movies.db"


def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute(
        """CREATE TABLE IF NOT EXISTS my_list (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            poster_path TEXT,
            vote_average REAL,
            watched INTEGER DEFAULT 0
        )"""
    )
    conn.commit()
    conn.close()


@app.route("/api/hello")
def hello():
    return jsonify({"message": "Hello from Python!"})


@app.route("/api/movies/popular")
def popular_movies():
    url = "https://api.themoviedb.org/3/movie/popular"
    response = requests.get(url, params={"api_key": TMDB_KEY, "language": "en-US"})
    return jsonify(response.json())


# READ: get every movie in My List
@app.route("/api/list", methods=["GET"])
def get_list():
    conn = get_db()
    rows = conn.execute("SELECT * FROM my_list").fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


# CREATE: add a movie
@app.route("/api/list", methods=["POST"])
def add_to_list():
    data = request.get_json()
    conn = get_db()
    conn.execute(
        "INSERT OR IGNORE INTO my_list (id, title, poster_path, vote_average) VALUES (?, ?, ?, ?)",
        (data["id"], data["title"], data.get("poster_path"), data.get("vote_average")),
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Added"}), 201


# UPDATE: mark watched / not watched
@app.route("/api/list/<int:movie_id>", methods=["PATCH"])
def update_movie(movie_id):
    data = request.get_json()
    conn = get_db()
    conn.execute(
        "UPDATE my_list SET watched = ? WHERE id = ?",
        (1 if data.get("watched") else 0, movie_id),
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Updated"})


# DELETE: remove a movie
@app.route("/api/list/<int:movie_id>", methods=["DELETE"])
def delete_movie(movie_id):
    conn = get_db()
    conn.execute("DELETE FROM my_list WHERE id = ?", (movie_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Deleted"})


init_db()

if __name__ == "__main__":
    app.run(debug=True, port=5000)