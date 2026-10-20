# Movie App

A full-stack movie app built as a learning project. It shows popular movies from TMDB and lets you save them to a personal list.

## What it does

- Shows popular movies with posters and ratings (data from the TMDB API)
- **My List** with full CRUD:
  - **Create:** add a movie to your list
  - **Read:** see your saved movies
  - **Update:** mark a movie as watched
  - **Delete:** remove a movie
- Your list is saved in a database, so it stays after you close the app

## Tech stack

- **Frontend:** React (Vite), JavaScript, CSS
- **Backend:** Python, Flask
- **Database:** SQLite
- **External API:** The Movie Database (TMDB)

## How to run it

You need Python, Node.js and a free TMDB API key.

### 1. Backend

    cd backend
    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements.txt

Create a file named `.env` inside `backend` with your key:

    TMDB_API_KEY=your_key_here

Start the server:

    python app.py

### 2. Frontend

In a second terminal:

    cd frontend
    npm install
    npm run dev

Open http://localhost:5173

## What I learned

- Connecting a React frontend to a Flask backend
- Calling an external API from the server to keep the key private
- Building CRUD routes with SQLite