const filterBtns = document.querySelectorAll(".filter-btn");
const galleryContainer = document.querySelector(".gallery-container");
const imageUpload = document.getElementById("image-upload");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close-btn");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

let visibleImages = [];
let currentIndex = 0;

function updateVisibleImages() {
  const allItems = document.querySelectorAll(".gallery-item");
  visibleImages = Array.from(allItems)
    .filter((item) => item.style.display !== "none")
    .map((item) => item.querySelector("img").src);
}

// Category Filter
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;
    const allItems = document.querySelectorAll(".gallery-item");

    allItems.forEach((item) => {
      if (category === "all" || item.dataset.category === category) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
    updateVisibleImages();
  });
});

// Image Upload Handling
imageUpload.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  const activeBtn = document.querySelector(".filter-btn.active");
  const activeCategory = activeBtn ? activeBtn.dataset.category : "all";

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) return;

    const imageUrl = URL.createObjectURL(file);
    const newItem = document.createElement("div");
    newItem.classList.add("gallery-item");

    // Assign active category or fallback to 'nature'
    newItem.dataset.category =
      activeCategory === "all" ? "nature" : activeCategory;
    newItem.innerHTML = `<img src="${imageUrl}" alt="${file.name}">`;

    galleryContainer.prepend(newItem);
  });

  updateVisibleImages();
  imageUpload.value = ""; // Reset input
});

// Event Delegation for Lightbox Trigger
galleryContainer.addEventListener("click", (e) => {
  const item = e.target.closest(".gallery-item");
  if (!item) return;

  updateVisibleImages();
  const imgSrc = item.querySelector("img").src;
  currentIndex = visibleImages.indexOf(imgSrc);
  showImage(currentIndex);
  lightbox.classList.add("active");
});

function showImage(index) {
  if (visibleImages.length === 0) return;
  lightboxImg.src = visibleImages[index];
}

// Lightbox Controls
prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  currentIndex =
    (currentIndex - 1 + visibleImages.length) % visibleImages.length;
  showImage(currentIndex);
});

nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % visibleImages.length;
  showImage(currentIndex);
});

closeBtn.addEventListener("click", () => lightbox.classList.remove("active"));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.classList.remove("active");
});

updateVisibleImages();
