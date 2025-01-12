document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // 防止表單刷新

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    // 假設使用 Base64 進行簡單加密
    const encryptedPassword = btoa(password);  // 使用 btoa() 將密碼加密為 Base64 字符串

    // 發送 GET 請求到 Google Apps Script
    const url = getGSUrl() + `?action=verifyAccount&username=${encodeURIComponent(username)}&password=${encodeURIComponent(encryptedPassword)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP 錯誤！狀態碼：${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    if (result.success) {
      sessionStorage.setItem('auth', 'true'); // 記錄驗證狀態
      alert('登入成功！');
      window.location.href = '/internal/activitycheck/activitylist'; // 跳轉到內部頁面
    } else {
      alert('帳號或密碼錯誤，請重新輸入！');
    }
  } catch (error) {
    console.error('登入錯誤：', error);
    alert('系統錯誤，請稍後再試。');
  }
});
