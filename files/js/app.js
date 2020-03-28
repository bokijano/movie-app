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
  videoElement.allowFullscreen = true;
  if (movie) {
    return videoElement;
  }
}

// create movie main actor
function mainActor(movie) {
  const mainActor = document.createElement("div");
  mainActor.setAttribute("class", "actor-style");

  const img = document.createElement("img");
  img.src = imgURL + movie.profile_path;
  img.setAttribute("data-movie-id", movie.id);

  const actorDetails = document.createElement("h2");
  actorDetails.setAttribute("class", "actor-details");
  actorDetails.innerHTML = `${movie.name} as ${movie.character}`;

  mainActor.appendChild(img);
  mainActor.appendChild(actorDetails);

  return mainActor;
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
  const value = inputValue.value;

  const newURL = url + "&query=" + value;

  fetch(newURL)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.results == []) {
        const movies = data.results;
        const movieBlock = createMovieDatabase(movies);
        searchMovie.appendChild(movieBlock);
      } else {
        const msg = document.createElement("h2");
        msg.innerHTML = "no movies match your search";

        searchMovie.appendChild(msg);
      }
    })
    .catch(error => {
      console.log("Error: ", error);
    });
  inputValue.value = "";
  searchMovie.innerHTML = "";
  event.preventDefault();
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

        // fetch movie main actor
        const crew = `movie/${movieID}/credits`;
        const crewUrl = generateUrl(crew);
        fetch(crewUrl)
          .then(res => res.json())
          .then(data => {
            const actorOne = mainActor(data.cast[0]);
            const actorTwo = mainActor(data.cast[1]);
            const actorThree = mainActor(data.cast[2]);
            movieDetails.appendChild(actorOne);
            movieDetails.appendChild(actorTwo);
            movieDetails.appendChild(actorThree);
          })
          .catch(error => {
            console.log("Error: ", error);
          });
        modalDisplay.appendChild(movieDetails);
      })
      .catch(error => {
        console.log("Error: ", error);
      });

    // fetch movie videos
    const path2 = `movie/${movieID}/videos`;
    const url2 = generateUrl(path2);
    setTimeout(
      fetch(url2)
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
