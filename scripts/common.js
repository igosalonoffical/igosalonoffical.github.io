const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

// 菜單按鈕點擊事件
menuToggle.addEventListener('click', function (event) {
  // 切換顯示/隱藏
  if (mobileMenu.style.display === 'none' || mobileMenu.style.display === '') {
    mobileMenu.style.display = 'block';
  } else {
    mobileMenu.style.display = 'none';
  }
  event.stopPropagation(); // 阻止事件冒泡，避免觸發背景點擊事件
});

// 點擊背景關閉菜單
document.addEventListener('click', function () {
  if (mobileMenu.style.display === 'block') {
    mobileMenu.style.display = 'none'; // 隱藏菜單
  }
});

// 點擊菜單項目自動關閉菜單
document.querySelectorAll('#mobileMenu a').forEach((item) => {
  item.addEventListener('click', function (event) {
    mobileMenu.style.display = 'none'; // 隱藏菜單
    event.stopPropagation(); // 阻止事件冒泡，避免觸發背景點擊事件
  });
});
