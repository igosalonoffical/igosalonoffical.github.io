document.title = `愛狗Salon蘆荻店-首頁`;

// 確保 DOM 已加載後執行
(async () => {

  const carouselInner = document.getElementById('carouselInner');
  if (!carouselInner) {
    console.error('carouselInner 不存在，無法初始化輪播');
    return;
  }

  let currentIndex = 0;

  // 獲取圖片清單
  const loadSlides = async () => {
    try {
      const response = await fetch('/data/home/images_banner.json');
      if (!response.ok) throw new Error('Failed to fetch image list.');
      const slides = await response.json();

      // 動態生成輪播項目
      slides.forEach((file, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `carousel-item ${index === 0 ? 'active' : 'hidden'}`;
        slideDiv.innerHTML = `<img src="images/home/${file}" class="block w-full" alt="Slide ${index + 1}">`;
        carouselInner.appendChild(slideDiv);
      });

      // 初始化輪播
      initCarousel();
    } catch (error) {
      console.error('載入圖片清單失敗:', error);
    }
  };

  const initCarousel = () => {
    const slideElements = document.querySelectorAll('.carousel-item');
    if (!slideElements.length) {
      console.error('沒有找到輪播項目，無法初始化');
      return;
    }

    const showSlide = (index) => {
      slideElements.forEach((slide, i) => {
        slide.classList.toggle('hidden', i !== index);
        slide.classList.toggle('active', i === index);
      });
    };

    document.getElementById('prevSlide').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slideElements.length) % slideElements.length;
      showSlide(currentIndex);
    });

    document.getElementById('nextSlide').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slideElements.length;
      showSlide(currentIndex);
    });

    setInterval(() => {
      currentIndex = (currentIndex + 1) % slideElements.length;
      showSlide(currentIndex);
    }, 5000); // 每 5 秒切換
  };

  await loadSlides();
})();
