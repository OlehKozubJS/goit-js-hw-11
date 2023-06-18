import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let API_KEY = '37447910-ed3fb6b843fd00e4ff71a16f5';
let URL = "https://pixabay.com/api/?";

const searchForm = document.querySelector(".search-form");
const searchInput = document.getElementsByName("searchQuery")[0];
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more");
const noMoreLoads = document.querySelector(".no-more-loads");

let pageNum = 1;
let searchInputValue;
let perPageNum = 40;
let totalHitsNum;
let hitsLeft;

searchForm.addEventListener("submit", searchFormFunc);
loadMore.addEventListener("click", loadMoreFunc);

async function searchFormFunc(e) {
  try {
    e.preventDefault();

    loadMore.classList.replace("hidden", "visible");
    noMoreLoads.classList.replace("visible", "hidden");
    perPageNum = 40;
    pageNum = 1;

    searchInputValue = searchInput.value;
 
    totalHitsNum = Number(await fetchImagesLogic());
    hitsLeft = totalHitsNum;
    if (hitsLeft < 40) {
      noMoreLoads.classList.replace("hidden", "visible");
      loadMore.classList.replace("visible", "hidden");
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

  let photoCards = "";

  if (data.hits.length === 0) {
    /*
    "Sorry, there are no images matching your search query. Please try again."
    */
  }

  data.hits.forEach (hit => {
    photoCards += `<a href="${hit.largeImageURL}">
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
        </div></a>`;
    gallery.innerHTML = photoCards;
  });
    
  let instance = new SimpleLightbox('.gallery a', 
    {
        captionsData: "data-imgInfo",
        captionDelay: 250,
        disableScroll: false,
    }
  );

  instance.refresh();

  return await data.totalHits;
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

  const response = await fetch(URL + searchParams);
  return await response.json();
}

