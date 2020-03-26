// values
const API_KEY = "5f1515407b5d31af2563839415a04874";
const url =
  "https://api.themoviedb.org/3/search/movie?api_key=5f1515407b5d31af2563839415a04874";
const imgURL = "https://image.tmdb.org/t/p/w500";

// select elements from DOM
const searchButton = document.querySelector("#search-btn");
const inputValue = document.querySelector("#input-value");
const searchMovie = document.querySelector("#search-movie");
const modalDisplay = document.querySelector(".modal");
const closeModal = document.querySelector(".close");

// generate url
function generateUrl(path) {
  const url = `https://api.themoviedb.org/3/${path}?api_key=5f1515407b5d31af2563839415a04874`;
  return url;
}

// create movie section
function movieSection(movies) {
  const section = document.createElement("section");
  section.classList = "section";
  movies.map(movie => {
    if (movie.poster_path) {
      const img = document.createElement("img");
      img.src = imgURL + movie.poster_path;
      img.setAttribute("data-movie-id", movie.id);

      section.appendChild(img);
    }
  });
  return section;
}

// function for creating movie database
function createMovieDatabase(movies) {
  const movieElement = document.createElement("div");
  movieElement.setAttribute("class", "movie");

  const section = movieSection(movies);

  movieElement.appendChild(section);
  return movieElement;
}

// search button onclick event
searchButton.onclick = function(event) {
  event.preventDefault();
  const value = inputValue.value;

  const newURL = url + "&query=" + value;

  fetch(newURL)
    .then(res => res.json())
    .then(data => {
      const movies = data.results;
      const movieBlock = createMovieDatabase(movies);
      searchMovie.appendChild(movieBlock);
      console.log("Data: ", data);
    })
    .catch(error => {
      console.log("Error: ", error);
    });
  inputValue.value = "";
};

// image onclick event
document.onclick = event => {
  const target = event.target;

  if (target.tagName.toLowerCase() === "img") {
    modalDisplay.style.display = "block";
    const movieID = target.dataset.movieId;
    console.log(movieID);

    // fetch movie details
    const path1 = `movie/${movieID}`;
    const url1 = generateUrl(path1);
    console.log(url1);
    fetch(url1)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log("Error: ", error);
      });

    // fetch movie videos
    const path2 = `movie/${movieID}/videos`;
    const url2 = generateUrl(path2);
    console.log(url2);
    fetch(url2)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }
};

// close modal onclick event
closeModal.onclick = function() {
  modalDisplay.style.display = "none";
};
