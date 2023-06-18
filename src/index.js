import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

var API_KEY = '37447910-ed3fb6b843fd00e4ff71a16f5';
var URL = "https://pixabay.com/api/?key="+API_KEY+"&q=searchResult&image_type=photo&orientation=horizontal&safesearch=true&page=pageNum&per_page=perPage";

const searchForm = document.querySelector(".search-form");
const searchInput = document.getElementsByName("searchQuery")[0];
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more");
const noMoreLoads = document.querySelector(".no-more-loads");

let pageNum = 1;
let searchInputValue;
let perPageVar = 40;
let totalHitsVar;
let hitsLeft;

searchForm.addEventListener("submit", searchFormFunc);
loadMore.addEventListener("click", loadMoreFunc);

async function searchFormFunc(e) {
  try {
    e.preventDefault();

    loadMore.classList.replace("hidden", "visible");
    noMoreLoads.classList.replace("visible", "hidden");
    perPageVar = 40;
    pageNum = 1;

    searchInputValue = searchInput.value;
 
    totalHitsVar = Number(await fetchImagesLogic());
    hitsLeft = totalHitsVar;
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
      perPageVar = hitsLeft;
    }

    await fetchImagesLogic();
  }
  catch {
    console.log("Error!");
  }
}

async function fetchImagesLogic() {
  gallery.innerHTML = "";

  let data = await fetchImages(searchInputValue);
  console.log(data);

  data.hits.forEach (hit => {
    const newPhotoCard = `<a href="${hit.largeImageURL}">
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
    gallery.insertAdjacentHTML("beforeend", newPhotoCard);
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
  searchData = URL.replace("searchResult", encodeURIComponent(searchResult));
  searchData = searchData.replace("pageNum", pageNum + "");
  searchData = searchData.replace("perPage", perPageVar);

  const response = await fetch(searchData);
  return await response.json();
}
/*
const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
*/

