const app = document.getElementById('app');
const scriptsContainer = document.getElementById('scripts');
const head = document.head; // 用於插入 CSS 樣式表

// 有效的頁面清單
const validViews = ['home', 'petservices', 'activity', 'about', 'contact', 'portfolio', 'posts', 'brands'];

// 動態載入內容和腳本
const loadContent = async (view) => {
  try {
    // 修正路徑，避免多餘的 "/"
    const path = view.startsWith('/') ? view : `/${view}`;
    console.log('Loading path:', path);

    // 加載對應的 HTML
    const response = await fetch(`${path}/index`);
    if (!response.ok) throw new Error(`Failed to load: ${path}`);
    const html = await response.text();
    app.innerHTML = html; // 將 HTML 內容插入 app 容器

    // 加載對應的 JS（如果存在）
    // const scriptPath = `scripts/pages${path}/index.js`;
    const scriptPath = `scripts/pages${path.replace(/\/$/, '')}.js`;
    const script = document.createElement('script');
    script.src = scriptPath;
    script.type = 'text/javascript';
    script.async = true;

    // 清空舊腳本並插入新腳本
    scriptsContainer.innerHTML = ''; // 確保容器為空
    scriptsContainer.appendChild(script); // 動態加載頁面腳本

    // 加載對應的 CSS（如果存在）
    const cssPath = `css/pages${path.replace(/\/$/, '')}.css`;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;

    // 檢查是否已經存在同名樣式表，避免重複插入
    const existingLink = document.querySelector(`link[href="${cssPath}"]`);
    if (!existingLink) {
      head.appendChild(link);
    }

  } catch (error) {
    app.innerHTML = '<p>內容載入失敗，請稍後再試。</p>';
    console.error('Error:', error.message);
  }
};

// 檢查當前網址，是否需要重定向到 index?view=<頁面名稱>
(function redirectToView() {
  const currentPath = window.location.pathname; // 取得當前路徑
  const basePath = '/index?view=';
  const validViews = ['home', 'petservices', 'activity', 'about', 'contact', 'portfolio', 'posts', 'brands'];

  // 判斷當前路徑是否需要重定向
  validViews.forEach(view => {
    const viewPath = `/${view}/`;
    const viewPathWithIndex = `${viewPath}index`;

    if (currentPath === viewPath || currentPath === viewPathWithIndex) {
      console.log(`Redirecting to: ${basePath}${view}`);
      window.location.replace(`${basePath}${view}`);
    }
  });
})();

// 載入 404 頁面
const load404 = () => {
  app.innerHTML = `
        <div class="text-center mt-20">
            <h1 class="text-6xl font-bold text-red-600 mb-4">404</h1>
            <p class="text-xl text-gray-600">找不到您請求的頁面，3 秒後將返回首頁。</p>
        </div>
    `;

  // 自動導回首頁
  setTimeout(() => {
    window.location.replace('/index?view=home');
  }, 3000); // 3 秒後跳轉
};

// 根據網址參數判斷要加載的頁面
const getViewFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('view') || 'home'; // 預設為 'home'
};

// 初始化路由
const initRouter = () => {
  const currentView = getViewFromUrl(); // 取得當前頁面名稱

  // 如果頁面名稱無效，載入 404
  console.log(validViews);
  console.log(currentView);
  if (!validViews.includes(currentView)) {
    load404();
    return;
  }

  loadContent(`/${currentView}/`); // 動態載入對應的內容

  // 監聽導航連結點擊事件
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = e.target.dataset.view;

      // 更新網址參數
      const newUrl = `index?view=${view}`;
      history.pushState({ view }, '', newUrl);

      // 加載對應的內容
      loadContent(`/${view}/`);
    });
  });

  // 處理瀏覽器返回事件
  window.addEventListener('popstate', (e) => {
    const view = e.state ? e.state.view : 'home';
    console.log(validViews);
    if (!validViews.includes(view)) {
      load404();
    } else {
      loadContent(`/${view}/`);
    }
  });
};

// 初始化
initRouter();
