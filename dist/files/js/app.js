// values
const API_KEY = "5f1515407b5d31af2563839415a04874";
const url =
  "https://api.themoviedb.org/3/search/movie?api_key=5f1515407b5d31af2563839415a04874";
const imgURL = "https://image.tmdb.org/t/p/w500";

// select elements from DOM
const searchButton = document.querySelector("#search-btn");
const inputValue = document.querySelector("#input-value");
const searchMovie = document.querySelector("#search-movie");

// display and close modal with details
const modalDisplay = document.querySelector(".modal");

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

// create video trailer from youtube
function createTrailer(movie) {
  const videoElement = document.createElement("iframe");
  videoElement.setAttribute("class", "video-style");
  videoElement.src = `https://www.youtube.com/embed/${movie}`;
  //videoElement.allowFullscreen = true;
  if (movie) {
    return videoElement;
  }
}

// create details for modal
function createDetails(movie) {
  const detailsDisplay = document.createElement("div");
  detailsDisplay.setAttribute("class", "details");

  const titleDisp = document.createElement("h1");
  titleDisp.classList = "title";
  titleDisp.innerHTML = movie.title;

  const overviewDisp = document.createElement("p");
  overviewDisp.classList = "title";
  overviewDisp.innerHTML = movie.overview;

  detailsDisplay.appendChild(titleDisp);
  detailsDisplay.appendChild(overviewDisp);

  return detailsDisplay;
}

// create content section(modal) for scecific movie
function createSpecificData(movie) {
  const contentDisplay = document.createElement("div");
  contentDisplay.setAttribute("class", "content");

  const img = document.createElement("img");
  img.src = imgURL + movie.poster_path;
  img.setAttribute("data-movie-id", movie.id);

  const displayMovie = createDetails(movie);

  const closeModal = document.createElement("span");
  closeModal.classList = "close";
  closeModal.innerHTML = "&times";

  closeModal.onclick = function() {
    modalDisplay.style.display = "none";
    modalDisplay.innerHTML = "";
  };

  contentDisplay.appendChild(closeModal);
  contentDisplay.appendChild(img);
  contentDisplay.appendChild(displayMovie);

  return contentDisplay;
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

    // fetch movie details
    const path1 = `movie/${movieID}`;
    const url1 = generateUrl(path1);
    fetch(url1)
      .then(res => res.json())
      .then(data => {
        const movieDetails = createSpecificData(data);
        modalDisplay.appendChild(movieDetails);
      })
      .catch(error => {
        console.log("Error: ", error);
      });

    // fetch movie videos
    const path3 = `movie/${movieID}/videos`;
    const url3 = generateUrl(path3);
    setTimeout(
      fetch(url3)
        .then(res => res.json())
        .then(data => {
          const movieTrailer = data.results[0].key;
          const videoDisplay = createTrailer(movieTrailer);

          modalDisplay.appendChild(videoDisplay);
        })
        .catch(error => {
          console.log("Error: ", error);
        }),
      1000
    );
  }
};
