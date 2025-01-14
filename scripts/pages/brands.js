document.title = `愛狗Salon蘆荻店-合作品牌`;

(async () => {
  const brandGrid = document.getElementById("brandGrid");

  try {
    const response = await fetch("/data/brands/brands_partners.json");
    if (!response.ok) throw new Error("Failed to fetch brand data.");
    const brands = await response.json();

    brands.forEach((brand) => {
      const card = document.createElement("div");
      card.className = "bg-white rounded-lg shadow-md p-6 text-center";

      if (brand.images.length === 1) {
        const img = document.createElement("img");
        img.src = brand.images[0];
        img.alt = brand.name;
        img.className = "h-32 mx-auto mb-4 object-cover rounded";
        card.appendChild(img);
      } else if (brand.images.length > 1) {
        const carousel = document.createElement("div");
        carousel.className = "carousel relative overflow-hidden h-32 mx-auto mb-4";

        brand.images.forEach((image, index) => {
          const img = document.createElement("img");
          img.src = image;
          img.alt = brand.name;
          img.className = `absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${index === 0 ? "opacity-100 z-10" : "opacity-0 z-0"}`;
          carousel.appendChild(img);
        });

        const prevButton = document.createElement("button");
        const nextButton = document.createElement("button");
        prevButton.innerHTML = "&#10094;";
        nextButton.innerHTML = "&#10095;";
        prevButton.className = "absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 z-20";
        nextButton.className = "absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 z-20";
        carousel.appendChild(prevButton);
        carousel.appendChild(nextButton);

        let currentIndex = 0;
        const images = carousel.querySelectorAll("img");

        const updateCarousel = (direction) => {
          images[currentIndex].classList.remove("opacity-100", "z-10");
          images[currentIndex].classList.add("opacity-0", "z-0");

          currentIndex = (currentIndex + direction + images.length) % images.length;

          images[currentIndex].classList.remove("opacity-0", "z-0");
          images[currentIndex].classList.add("opacity-100", "z-10");
        };

        prevButton.addEventListener("click", () => {
          stopAutoCarousel();
          updateCarousel(-1);
        });
        nextButton.addEventListener("click", () => {
          stopAutoCarousel();
          updateCarousel(1);
        });

        let autoCarouselInterval;
        const startAutoCarousel = () => {
          autoCarouselInterval = setInterval(() => {
            updateCarousel(1);
          }, 5000);
        };

        const stopAutoCarousel = () => {
          clearInterval(autoCarouselInterval);
        };

        startAutoCarousel();

        card.appendChild(carousel);
      }

      card.innerHTML += `
        <h3 class="text-lg font-semibold text-gray-800">${brand.name}</h3>
        <p class="text-gray-600">${brand.description}</p>
      `;

      brandGrid.appendChild(card);
    });
  } catch (error) {
    console.error("品牌資料載入失敗:", error);
    brandGrid.innerHTML =
      "<p class='text-center text-red-600'>無法載入品牌資料，請稍後再試。</p>";
  }
})();
