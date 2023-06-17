// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

var API_KEY = '37447910-ed3fb6b843fd00e4ff71a16f5';
var URL = "https://pixabay.com/api/?key="+API_KEY+"&q=searchResult&image_type=photo&orientation=horizontal&safesearch=true";

const searchForm = document.querySelector(".search-form");
const searchInput = document.getElementsByName("searchQuery")[0];
const gallery = document.querySelector(".gallery");
const photoCard = document.querySelector(".photo-card").outerHTML;

searchForm.addEventListener("submit", fetchImagesLogic);

async function fetchImagesLogic(e) {
  e.preventDefault();

  try {
    gallery.innerHTML = "";

    const data = await fetchImages(searchInput.value);
    console.log(data);
    data.hits.forEach (hit => {
      gallery.insertAdjacentHTML("beforeend", photoCard.replace("img alt", `img src="${hit.previewURL}" alt`));
    });
  }
  catch {
    console.log("Error!");
  }
    
  searchForm.reset();
}

async function fetchImages(searchResult) {
  const response = await fetch(URL.replace("searchResult", encodeURIComponent(searchResult)));
  return await response.json();
}
