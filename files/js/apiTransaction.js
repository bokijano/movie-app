//const playingMovies = document.querySelector//("#playing-movies");
//const popularMovies = document.querySelector//("#popular-movies");
//const ratedMovies = document.querySelector("rated-movies");
//const upcomingMovies = document.querySelector//("#upcoming-movies");

// API values
const API_KEY = "5f1515407b5d31af2563839415a04874";
const url =
  "https://api.themoviedb.org/3/search/movie?api_key=5f1515407b5d31af2563839415a04874";
const imgURL = "https://image.tmdb.org/t/p/w500";

// generate url
function generateUrl(path) {
  const url = `https://api.themoviedb.org/3${path}?api_key=5f1515407b5d31af2563839415a04874`;
  return url;
}

// function to send request for movies
function requestMovie(url, onComplete, onError) {
  fetch(url)
    .then(res => res.json())
    .then(onComplete)
    .catch(onError);
}

// function for handling error
function handleError(error) {
  console.log("Error: ", error);
}

// create function for searching movies
function searchedMovie(value) {
  const path = "/search/movie";
  const url = generateUrl(path) + "&query=" + value;

  requestMovie(url, renderSearchMovies, handleError);
}

// function for displaying and rendering latest movies
function nowPlayingMovies() {
  const path = "/movie/now_playing";
  const url = generateUrl(path);

  const render = renderMovies.bind({ title: "Now Playing Movies" });
  requestMovie(url, render, handleError);
}

// function for displaying popular movies
function popularMovies() {
  const path = "/movie/popular";
  const url = generateUrl(path);

  const render = renderMovies.bind({ title: "Popular Movies" });
  requestMovie(url, render, handleError);
}

// function for displaying top rated movies
function topRatedMovies() {
  const path = "/movie/top_rated";
  const url = generateUrl(path);

  const render = renderMovies.bind({ title: "Top Rated Movies" });
  requestMovie(url, render, handleError);
}

// function for displaying upcoming movies
function upcomingMovies() {
  const path = "/movie/upcoming";
  const url = generateUrl(path);

  const render = renderMovies.bind({ title: "Upcoming Movies" });
  requestMovie(url, render, handleError);
}
