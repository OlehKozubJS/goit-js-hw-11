import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

let API_KEY = '37447910-ed3fb6b843fd00e4ff71a16f5';
let URL = "https://pixabay.com/api/?";

const searchForm = document.querySelector(".search-form");
const searchInput = document.getElementsByName("searchQuery")[0];
const galleryContainer = document.querySelector(".gallery-container");
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more");
const noMoreLoads = document.querySelector(".no-more-loads");

let perPageNum = 40;
let pageNum = 1;
let searchInputValue;
let searchData;
let hitsLeft;

searchForm.addEventListener("submit", searchFormFunc);
loadMore.addEventListener("click", loadMoreFunc);

let instance = new SimpleLightbox('.gallery a', 
  {
    captionsData: "data-imgInfo",
    captionDelay: 250,
    disableScroll: false,
  }
);

async function searchFormFunc(e) {
  try {
    e.preventDefault();

    gallery.innerHTML = "";
    perPageNum = 40;
    pageNum = 1;
    searchInputValue = searchInput.value;
    searchData = await fetchImagesLogic();
    hitsLeft = searchData.totalHits;

    if (hitsLeft < 40) {
      noMoreLoads.classList.replace("hidden", "visible");
      loadMore.classList.replace("visible", "hidden");
    }
    else {
      loadMore.classList.replace("hidden", "visible");
      noMoreLoads.classList.replace("visible", "hidden");
    }
  
    if (searchData.totalHits === 0) {
      galleryContainer.classList.add("hidden");
      noMoreLoads.classList.replace("visible", "hidden");
      loadMore.classList.replace("visible", "hidden");
      
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    else {
      galleryContainer.classList.remove("hidden");
    }

    searchForm.reset();
  }
  catch {
    console.log("Error!");
  }
}

async function loadMoreFunc() {
  try {
    pageNum += 1;
    hitsLeft -= 40;

    if (hitsLeft < 40) {
      noMoreLoads.classList.replace("hidden", "visible");
      loadMore.classList.replace("visible", "hidden");
      perPageNum = hitsLeft;
    }

    await fetchImagesLogic();
  }
  catch {
    console.log("Error!");
  }
}

async function fetchImagesLogic() {
  let data = await fetchImages(searchInputValue);

  let newHits = data.hits.map(hit => 
    `<a href="${hit.largeImageURL}">
      <div class="photo-card">
        <img src="${hit.previewURL}" alt="Image" loading="lazy" data-imgInfo="${hit.likes} Likes, ${hit.views} Views, ${hit.comments} Comments, ${hit.downloads} Downloads" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b><b>${hit.likes}</b>
          </p>
          <p class="info-item">
            <b>Views</b><b>${hit.views}</b>
          </p>
          <p class="info-item">
            <b>Comments</b><b>${hit.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads</b><b>${hit.downloads} </b>
          </p>
        </div>
      </div>
    </a>`
  );

  gallery.insertAdjacentHTML("beforeend", newHits.join(" "));
  
  instance.refresh();

  return await data;
}

async function fetchImages(searchResult) {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: searchResult,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    page: pageNum,
    per_page: perPageNum,
  });

  const response = await axios.get(URL + searchParams);

  return await response.data;
}

