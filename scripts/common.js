function getGSUrl() {
  return 'https://script.google.com/macros/s/AKfycbwM_-jODKqveT2jiu1Uk2LTPjxmazoOIFnn3viFcHG8wQscRZ01rGQyVkhbxXP0Vdii/exec';
}

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle) {
  // 菜單按鈕點擊事件
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

if (mobileMenu) {
  // 點擊背景遮罩時關閉菜單
  mobileMenu.addEventListener('click', (event) => {
    if (event.target === mobileMenu) {
      mobileMenu.classList.add('hidden'); // 隱藏菜單
    } else if (event.target.tagName == 'A') {
      mobileMenu.classList.add('hidden');
    }
  });

  document.body.addEventListener('click', (event) => {
    if (mobileMenu.classList.contains('hidden') == false) {
      if (event.target !== menuToggle && event.target !== mobileMenu) {
        mobileMenu.classList.add('hidden'); // 隱藏菜單
      }
    }
  });
}