document.title = `愛狗Salon蘆荻店-服務內容`;
console.log('服務');
(async () => {
    const scrollContainer = document.getElementById('scrollContainer');
    const prevSlide = document.getElementById('prevSlide');
    const nextSlide = document.getElementById('nextSlide');

    if (!scrollContainer || !prevSlide || !nextSlide) {
        console.error('必要的 DOM 元素未找到');
        return;
    }

    const cardWidth = scrollContainer.querySelector('.flex-none').offsetWidth + 16; // 單張卡片寬度（含間距）
    const visibleCards = 2; // 每次顯示的卡片數
    const totalCards = scrollContainer.children.length; // 卡片總數
    const maxIndex = Math.max(0, totalCards - visibleCards); // 最大索引值
    let currentIndex = 0; // 當前卡片索引

    // 更新滾動位置的函數
    const updateScrollPosition = () => {
        // 獲取當前每張卡片的寬度（包含間距）
        const cardWidth = scrollContainer.querySelector('.flex-none').offsetWidth;
        scrollContainer.scrollTo({
            left: currentIndex * cardWidth, // 設定 scrollLeft
            behavior: 'smooth', // 平滑滾動效果
        });
    };

    // 左按鈕點擊事件
    prevSlide.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex -= visibleCards; // 每次移動顯示兩張卡片
            updateScrollPosition();
        }
    });

    // 右按鈕點擊事件
    nextSlide.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex += visibleCards; // 每次移動顯示兩張卡片
            updateScrollPosition();
        }
    });

    // 監聽視窗調整大小事件，重新計算卡片寬度
    window.addEventListener('resize', () => {
        updateScrollPosition(); // 視窗大小改變時重新定位
    });

    // 自動滾動
    setInterval(() => {
        if (currentIndex < maxIndex) {
            currentIndex += visibleCards; // 自動移動到下一組
        } else {
            currentIndex = 0; // 回到第一組
        }
        updateScrollPosition();
    }, 5000); // 每 5 秒切換一次

    // 觸控滑動支持（手機和平板）
    let startX = 0;
    let scrollLeft = 0;

    scrollContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX;
        const walk = startX - x; // 滑動距離
        scrollContainer.scrollLeft = scrollLeft + walk;
    });
})();

(function () {
    // 這裡的變數只在函式內有效
    let modal = document.getElementById('modal');
    let modalContent = document.getElementById('modalContent');
    let openModal = document.getElementById('openModal');
    let closeModal = document.getElementById('closeModal');

    // 開啟 Modal
    openModal.addEventListener('click', () => {
        modal.classList.add('show');
        modalContent.classList.add('show');
    });

    // 關閉 Modal
    closeModal.addEventListener('click', () => {
        modalContent.classList.remove('show');
        setTimeout(() => {
            modal.classList.remove('show');
        }, 300); // 配合動畫淡出
    });

    // 點擊背景關閉 Modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal.click();
        }
    });
})();
