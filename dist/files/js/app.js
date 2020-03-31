// select elements from DOM
const searchButton = document.querySelector("#search-btn");
const inputValue = document.querySelector("#input-value");
const searchMovie = document.querySelector("#search-movie");
const containerMovies = document.querySelector("#container-movies");

const moviesBtns = document.querySelector(".movies-list");
const backButton = document.querySelector("#back-btn");

const nowPlayingButton = document.querySelector(".now-playing");
const popularButton = document.querySelector(".popular");
const topRatedButton = document.querySelector(".topRated");
const upcomingButton = document.querySelector(".upcoming");

// display and close modal with details
const modalDisplay = document.querySelector(".modal");

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
function createMovieDatabase(movies, title = "") {
  const movieElement = document.createElement("div");
  movieElement.setAttribute("class", "movie");

  const titleMovies = document.createElement("h2");
  titleMovies.innerHTML = title;

  const section = movieSection(movies);

  movieElement.appendChild(titleMovies);
  movieElement.appendChild(section);

  return movieElement;
}

// create render function for resolve promise
function renderSearchMovies(data) {
  if (data.total_results != 0) {
    const movies = data.results;
    const movieBlock = createMovieDatabase(movies);
    searchMovie.appendChild(movieBlock);
  } else {
    const msg = document.createElement("h2");
    msg.innerHTML = "no movies match your search";

    searchMovie.appendChild(msg);
  }
}

// render container for now playing, popular, top rated and upcoming movies
function renderMovies(data) {
  const movies = data.results;
  const movieBlock = createMovieDatabase(movies, this.title);

  containerMovies.appendChild(movieBlock);
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

  if (movie.profile_path) {
    mainActor.appendChild(img);
  }
  mainActor.appendChild(actorDetails);

  return mainActor;
}

// create details for modal
function createDetails(movie) {
  const detailsDisplay = document.createElement("div");
  detailsDisplay.setAttribute("class", "details");
  //display title
  const titleDisp = document.createElement("h1");
  titleDisp.classList = "title";
  titleDisp.innerHTML =
    movie.title + " (" + movie.release_date.substring(0, 4) + ")";
  //display genre
  const genreDisplay = document.createElement("h3");
  for (let i = 0; i < movie.genres.length; i++) {
    genreDisplay.innerHTML += movie.genres[i].name + " ";
  }
  // display tagline
  const tagline = document.createElement("h4");
  tagline.innerHTML = `"${movie.tagline}"`;

  // display overview
  const overviewDisp = document.createElement("p");
  overviewDisp.classList = "title";
  overviewDisp.innerHTML = movie.overview;

  detailsDisplay.appendChild(titleDisp);
  if (movie.tagline) {
    detailsDisplay.appendChild(tagline);
  }
  detailsDisplay.appendChild(genreDisplay);
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
  // fetch searched movie
  const value = inputValue.value;
  searchedMovie(value);

  inputValue.value = "";
  searchMovie.innerHTML = "";
  moviesBtns.style.display = "none";
  backButton.style.visibility = "visible";
  backButton.style.marginTop = "120px";
  document.querySelector(".form-group").style.marginTop = "10px";
  containerMovies.style.display = "none";
  document.querySelector("#first-msg").style.display = "none";
  document.querySelector("#second-msg").style.display = "block";
  document.querySelector(".top-five").style.display = " none";
  event.preventDefault();
};

// image onclick event
document.onclick = event => {
  const target = event.target;

  if (target.tagName.toLowerCase() === "img") {
    modalDisplay.style.display = "block";
    const movieID = target.dataset.movieId;

    // fetch movie details
    const path1 = `/movie/${movieID}`;
    const url1 = generateUrl(path1);
    fetch(url1)
      .then(res => res.json())
      .then(data => {
        const movieDetails = createSpecificData(data);

        // fetch movie main actor
        const crew = `/movie/${movieID}/credits`;
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

        // fetch movie videos
        const path2 = `/movie/${movieID}/videos`;
        const url2 = generateUrl(path2);
        fetch(url2)
          .then(res => res.json())
          .then(data => {
            const movieTrailer = data.results[0].key;
            const videoDisplay = createTrailer(movieTrailer);

            movieDetails.appendChild(videoDisplay);
          })
          .catch(error => {
            console.log("Error: ", error);
          });
        modalDisplay.appendChild(movieDetails);
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }
};

// onclick event to back on home page
backButton.onclick = function() {
  searchMovie.innerHTML = "";
  moviesBtns.style.display = "block";
  containerMovies.style.display = "block";
  document.querySelector("#first-msg").style.display = "block";
  document.querySelector("#second-msg").style.display = "none";
  containerMovies.innerHTML = "";
  document.querySelector(".top-five").style.display = " flex";
  document.querySelector(".movies-list").style.marginTop = "100px";
  document.querySelector(".movies-list").style.display = "flex";
  document.querySelector(".form-group").style.display = " flex";
  document.querySelector(".form-group").style.marginTop = "130px";
  containerMovies.style.marginTop = "20px";
  backButton.style.marginTop = "80px";
  backButton.style.visibility = "hidden";
};

// change style properties when open certain content
function changeDisplayStyle() {
  containerMovies.innerHTML = "";
  document.querySelector(".top-five").style.display = " none";
  document.querySelector(".movies-list").style.marginTop = "50px";
  document.querySelector(".form-group").style.display = " none";
  containerMovies.style.marginTop = "120px";
  backButton.style.visibility = "visible";
  backButton.style.marginTop = "120px";
}

nowPlayingButton.onclick = function() {
  changeDisplayStyle();
  nowPlayingMovies();
};
popularButton.onclick = function() {
  changeDisplayStyle();
  popularMovies();
};
topRatedButton.onclick = function() {
  changeDisplayStyle();
  topRatedMovies();
};
upcomingButton.onclick = function() {
  changeDisplayStyle();
  upcomingMovies();
};

popularFiveMovies();
topRatedFiveMovies();
