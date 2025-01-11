if (!sessionStorage.getItem('auth')) {
  alert('請先登入！');
  window.location.href = '/internal/login'; // 跳轉回登入頁
}