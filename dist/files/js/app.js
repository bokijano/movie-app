// values
const API_KEY = "5f1515407b5d31af2563839415a04874";
const url =
  "https://api.themoviedb.org/3/search/movie?api_key=5f1515407b5d31af2563839415a04874";

// select elements from DOM
const searchButton = document.querySelector("#search-btn");
const inputValue = document.querySelector("#input-value");

searchButton.onclick = function(event) {
  event.preventDefault();
  const value = inputValue.value;

  console.log(value);
};
