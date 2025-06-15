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

    const cardWidth = scrollContainer.querySelector('.flex-none').offsetWidth + 16; // 卡片寬度（含間距）
    const visibleCards = 2; // 每次顯示的卡片數
    const totalCards = scrollContainer.children.length;
    const maxIndex = Math.max(0, totalCards - visibleCards);
    let currentIndex = 0;

    const updateScrollPosition = () => {
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex)); // 限制索引範圍
        scrollContainer.scrollTo({
            left: currentIndex * cardWidth,
            behavior: 'smooth',
        });
    };

    prevSlide.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex -= visibleCards;
            updateScrollPosition();
            resetAutoScroll();
        }
    });

    nextSlide.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex += visibleCards;
            updateScrollPosition();
            resetAutoScroll();
        }
    });

    // 自動滾動（5 秒）
    let autoScroll;

    const startAutoScroll = () => {
        clearInterval(autoScroll); // 先清除舊的計時器
        autoScroll = setInterval(() => {
            if (currentIndex < maxIndex) {
                currentIndex += visibleCards;
            } else {
                currentIndex = 0;
            }
            updateScrollPosition();
        }, 5000); // 設定 5 秒的間隔
    };

    // 重置自動滾動計時器
    const resetAutoScroll = () => {
        clearInterval(autoScroll);
        startAutoScroll();
    };

    // 啟動自動滾動
    startAutoScroll();

    // 觸控滑動支持（手機和平板）
    let startX = 0;
    let scrollLeft = 0;

    scrollContainer.addEventListener('touchstart', (e) => {
        clearInterval(autoScroll); // 觸摸時暫停自動滾動
        startX = e.touches[0].pageX;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX;
        const walk = (startX - x) * 0.7; // 摩擦係數 0.7
        scrollContainer.scrollLeft = scrollLeft + walk;
    });

    scrollContainer.addEventListener('touchend', () => {
        resetAutoScroll(); // 觸摸結束後重新啟動自動滾動
    });
})();

(function () {
    let modal = document.getElementById('modal');
    let modalContent = document.getElementById('modalContent');
    let openModal = document.getElementById('openModal');
    let closeModal = document.getElementById('closeModal');

    openModal.addEventListener('click', () => {
        modal.classList.add('show');
        modalContent.classList.add('show');
        document.body.classList.add('modal-open'); // 禁止滾動
    });

    closeModal.addEventListener('click', () => {
        modalContent.classList.remove('show');
        setTimeout(() => {
            modal.classList.remove('show');
            document.body.classList.remove('modal-open'); // 恢復滾動
        }, 300);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal.click();
        }
    });
})();
