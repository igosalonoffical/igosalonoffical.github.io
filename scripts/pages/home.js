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
  
  // 顯示完整公告詳情的函數
  const showAnnouncementDetails = () => {
    console.log("顯示公告詳情");
    const existingModal = document.getElementById("announcementModal");
    if (existingModal) {
      existingModal.remove();
    }
    
    const modalHtml = `
      <div id="announcementModal">
        <div class="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <div class="text-right mb-2">
            <button id="closeModal" class="text-gray-500 hover:text-gray-800">✕</button>
          </div>
          <div class="announcement-content">
            <h2>📢 即日起取消包月方案，全新「金愛GO美容優惠」專案登場！</h2>
            
            <p class="mb-4">親愛的毛孩家長您好：<br>
            為了讓您消費更便利，本店即日起正式支援 <strong>LINE Pay</strong> 付款，<br>
            不必攜帶現金，輕鬆用手機即可完成結帳！</p>
            
            <h3>❌ 包月方案取消</h3>
            <ul class="list-disc pl-6 mb-4">
              <li>即日起停止提供包月及續約服務</li>
              <li>原有包月次數仍可照常使用至使用完畢或期滿</li>
            </ul>
            
            <h3>✨ 金愛GO美容優惠內容</h3>
            <p>只要在上次美容後 10 天內回來，就能享有「金愛GO美容」的專屬折扣，折數和以前包月一樣划算！</p>
            <p class="mt-2">
              小美容：基本項目＋洗澡（含身體按摩）<br>
              大美容：基本項目＋洗澡（含身體按摩）＋剪毛
            </p>
            
            <div class="bg-amber-50 p-2 rounded border-l-4 border-amber-500 mb-4">
              <p class="font-bold">10 天內回訪優惠：</p>
              <ul class="list-disc pl-6">
                <li class="highlight">小美容享 91 折</li>
                <li class="highlight">大美容享 93 折</li>
              </ul>
              <p class="text-sm mt-2">※ 舉例說明：小美容原價 500 元，回訪優惠價為 455 元；大美容原價 1000 元，回訪優惠價為 930 元。</p>
            </div>
            
            <div class="bg-amber-50 p-2 rounded border-l-4 border-amber-500 mb-4">
              <p><strong>※ 舊包月客戶可享回訪期限延長至 14 天，仍享有專屬優惠及免費接送，不受 10 天回訪限制影響。</strong></p>
            </div>
            
            <h3 class="text-lg font-bold text-amber-600 mb-2 border-l-4 border-amber-500 pl-2 bg-amber-50 py-1">🎁 新客專屬</h3>
            <p class="mb-4"><strong>即日起，新朋友也有福了！首次消費就能直接享有「金愛GO美容優惠」專屬折扣，不用等第二次唷！</strong></p>
            
            <h3 class="text-lg font-bold text-amber-600 mb-2 border-l-4 border-amber-500 pl-2 bg-amber-50 py-1">🚗 接送服務（限 10 天內回訪）</h3>
            <ul class="list-disc pl-6 mb-4">
              <li><strong>舊包月客戶：</strong>維持原有免費接送安排</li>
              <li><strong>金愛GO美容優惠客戶：</strong>
                <ul class="list-circle pl-6 mt-1">
                  <li>平日：2 公里內免費接送，<strong>起跳費 0 元</strong></li>
                  <li>假日：2 公里內加收 <strong>10 元起</strong></li>
                  <li>超過 2 公里：<strong>每 300 公尺加收 10 元</strong></li>
                  <li><em>（距離以 Google Maps 導航為準）</em></li>
                </ul>
              </li>
            </ul>
            
            <h3 class="text-lg font-bold text-amber-600 mb-2 border-l-4 border-amber-500 pl-2 bg-amber-50 py-1">💳 現有付款方式</h3>
            <div class="flex justify-around mb-4">
              <div class="text-center p-2 bg-amber-50 rounded w-1/4">現金</div>
              <div class="text-center p-2 bg-amber-50 rounded w-1/4">LINE Pay<br>(僅提供現場付款)</div>
              <div class="text-center p-2 bg-amber-50 rounded w-1/4">銀行轉帳</div>
            </div>
            
            <div class="text-center text-gray-600 border-t border-amber-200 pt-3 mt-4">
              <p>若有任何疑問，歡迎私訊預約或洽詢，感謝您的支持與信任🐾</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // 將模態框添加到頁面
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    // 確保模態框在頁面上時禁止背景滾動
    document.body.style.overflow = 'hidden';
    
    // 添加關閉模態框的事件
    document.getElementById("closeModal").addEventListener("click", () => {
      const modal = document.getElementById("announcementModal");
      if (modal) {
        modal.remove();
        // 恢復背景滾動
        document.body.style.overflow = '';
      }
    });
    
    // 點擊模態框背景時也關閉
    document.getElementById("announcementModal").addEventListener("click", (e) => {
      if (e.target.id === "announcementModal") {
        document.getElementById("announcementModal").remove();
        document.body.style.overflow = '';
      }
    });
  };

  await loadSlides();
})();