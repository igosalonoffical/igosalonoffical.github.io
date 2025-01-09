const app = document.getElementById('app');
const scriptsContainer = document.getElementById('scripts');

// 動態載入內容和腳本
const loadContent = async (view) => {
  try {
    // 修正路徑，避免多餘的 "/"
    const path = view.startsWith('/') ? view : `/${view}`;
    console.log('Loading path:', path);

    // 加載對應的 HTML
    const response = await fetch(`${path}/index.html`);
    if (!response.ok) throw new Error(`Failed to load: ${path}`);
    const html = await response.text();
    app.innerHTML = html;

    // 加載對應的 JS
    const scriptPath = `scripts${path}index.js`;
    const script = document.createElement('script');
    script.src = scriptPath;
    script.type = 'text/javascript';
    script.async = true;

    // 清空舊腳本並插入到 section 後
    scriptsContainer.innerHTML = ''; // 清空舊內容（如果需要）
    document.body.appendChild(script); // 插入腳本到 body 的最後
  } catch (error) {
    app.innerHTML = '<p>內容載入失敗，請稍後再試。</p>';
    console.error('Error:', error.message);
  }
};

// 根據網址參數判斷要加載的頁面
const getViewFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('view') || 'home'; // 預設為 'home'
};

// 初始化路由
const initRouter = () => {
  // 獲取當前視圖並加載內容
  const currentView = getViewFromUrl();
  loadContent(`/${currentView}/`);

  // 監聽導航連結點擊事件
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = e.target.dataset.view;

      // 更新網址參數
      const newUrl = `index.html?view=${view}`;
      history.pushState({ view }, '', newUrl);

      // 加載對應的內容
      loadContent(`/${view}/`);
    });
  });

  // 處理返回事件
  window.addEventListener('popstate', (e) => {
    const view = e.state ? e.state.view : 'home';
    loadContent(`/${view}/`);
  });
};

// 初始化
initRouter();
