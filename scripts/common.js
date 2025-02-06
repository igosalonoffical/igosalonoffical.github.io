function getGSUrl() {
  return 'https://script.google.com/macros/s/AKfycbwM_-jODKqveT2jiu1Uk2LTPjxmazoOIFnn3viFcHG8wQscRZ01rGQyVkhbxXP0Vdii/exec';
}

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle) {
  // 菜單按鈕點擊事件
  menuToggle.addEventListener('click', (event) => {
    // 防止點擊菜單按鈕時，事件繼續傳遞到 document
    event.stopPropagation(); 

    // 切換菜單顯示與隱藏
    mobileMenu.classList.toggle('hidden');

    // 切換三條線變成 X
    menuToggle.classList.toggle('open');
  });
}

if (mobileMenu) {
  // 點擊菜單外部區域時隱藏菜單
  document.body.addEventListener('click', (event) => {
    if (!mobileMenu.classList.contains('hidden') && event.target !== menuToggle && !mobileMenu.contains(event.target)) {
      mobileMenu.classList.add('hidden'); // 隱藏菜單
      menuToggle.classList.remove('open'); // 還原三條線
    }
  });

  // 點擊菜單中的超連結時隱藏菜單
  mobileMenu.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      mobileMenu.classList.add('hidden'); // 隱藏菜單
      menuToggle.classList.remove('open'); // 還原三條線
    }
  });
}