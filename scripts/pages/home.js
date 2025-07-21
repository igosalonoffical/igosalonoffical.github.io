document.title = `愛狗Salon蘆荻店 專業寵物美容`;

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
      initCarousel(slides);

      // 額外確保公告詳情按鈕可以點擊
      setupAnnouncementButton();
    } catch (error) {
      console.error("載入內容清單失敗:", error);
    }
  };

  // 確保公告詳情按鈕能夠正確點擊
  const setupAnnouncementButton = () => {
    const announcementBtn = document.getElementById("announcementDetailsBtn");
    if (announcementBtn) {
      // 清除舊的事件監聽器
      const newBtn = announcementBtn.cloneNode(true);
      announcementBtn.parentNode.replaceChild(newBtn, announcementBtn);

      // 添加新的事件監聽器
      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showAnnouncementDetails();
      });

      // 確保按鈕可見
      newBtn.style.display = "inline-block";
      newBtn.style.cursor = "pointer";
    }
  };

  const initCarousel = (slides) => {
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

    // 修正輪播計時器
    let autoSlideTimer;

    const startAutoSlide = () => {
      clearTimeout(autoSlideTimer); // 先清除舊的計時器

      const currentSlide = slides[currentIndex];
      // 如果是公告，停留時間更長 (15秒)，其他為7秒
      const slideTime = currentSlide && currentSlide.isAnnouncement ? 15000 : 7000;

      autoSlideTimer = setTimeout(() => {
        currentIndex = (currentIndex + 1) % slideElements.length;
        showSlide(currentIndex);
        // 每次輪播切換後都重新設定按鈕
        setupAnnouncementButton();
        startAutoSlide(); // 繼續下一次輪播
      }, slideTime);
    };

    // 開始自動輪播
    startAutoSlide();

    // 點擊箭頭時重置計時器
    document.getElementById("prevSlide").addEventListener("click", () => {
      clearTimeout(autoSlideTimer);
      currentIndex = (currentIndex - 1 + slideElements.length) % slideElements.length;
      showSlide(currentIndex);
      startAutoSlide();
    });

    document.getElementById("nextSlide").addEventListener("click", () => {
      clearTimeout(autoSlideTimer);
      currentIndex = (currentIndex + 1) % slideElements.length;
      showSlide(currentIndex);
      startAutoSlide();
    });

    const reserveButton = document.getElementById("reserveButton");
    if (reserveButton) {
      reserveButton.addEventListener("click", () => {
        window.open("https://line.me/R/ti/p/@898ssiqu", "_blank");
      });
    }

    // 初始化公告詳情按鈕
    const announcementDetailsBtn = document.getElementById("announcementDetailsBtn");
    if (announcementDetailsBtn) {
      announcementDetailsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showAnnouncementDetails();
      });
    }
  };


  await loadSlides();
})();