document.title = `愛狗Salon蘆荻店-首頁`;

(async () => {
  const carouselInner = document.getElementById("carouselInner");
  if (!carouselInner) {
    console.error("carouselInner 不存在，無法初始化輪播");
    return;
  }

  let currentIndex = 0;

  // 獲取圖片和 DIV 的清單
  const loadSlides = async () => {
    try {
      const response = await fetch("/data/home/images_banner.json");
      if (!response.ok) throw new Error("Failed to fetch content list.");
      const slides = await response.json();

      // 動態生成輪播項目
      slides.forEach((item, index) => {
        const slideDiv = document.createElement("div");
        slideDiv.className = `carousel-item ${index === 0 ? "active" : "hidden"}`;

        if (item.type === "image") {
          slideDiv.innerHTML = `<img src="${item.src}" alt="${item.alt}" class="block w-full">`;
        } else if (item.type === "div") {
          slideDiv.innerHTML = item.content;
        }

        carouselInner.appendChild(slideDiv);
      });

      // 初始化輪播
      initCarousel();
    } catch (error) {
      console.error("載入內容清單失敗:", error);
    }
  };

  const initCarousel = () => {
    const slideElements = document.querySelectorAll(".carousel-item");
    if (!slideElements.length) {
      console.error("沒有找到輪播項目，無法初始化");
      return;
    }

    const showSlide = (index) => {
      slideElements.forEach((slide, i) => {
        slide.classList.toggle("hidden", i !== index);
        slide.classList.toggle("active", i === index);
      });
    };

    document.getElementById("prevSlide").addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slideElements.length) % slideElements.length;
      showSlide(currentIndex);
    });

    document.getElementById("nextSlide").addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slideElements.length;
      showSlide(currentIndex);
    });

    const reserveChineseYear2025Button = document.getElementById("reserveChineseYear2025Button");
    if (reserveChineseYear2025Button) {
      reserveChineseYear2025Button.addEventListener("click", () => {
        window.open("https://line.me/R/ti/p/@898ssiqu", "_blank");
      });
    }

    setInterval(() => {
      currentIndex = (currentIndex + 1) % slideElements.length;
      showSlide(currentIndex);
    }, 5000); // 每 5 秒切換
  };

  await loadSlides();
})();
