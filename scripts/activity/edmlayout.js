(async () => {
    const activityContent = document.getElementById('activityContent');
    const params = new URLSearchParams(window.location.search);
    const activityId = params.get('view'); // 獲取活動編號

    if (!activityId) {
        activityContent.innerHTML = '<p class="text-center text-red-500">未指定活動編號，無法顯示內容。</p>';
        return;
    }

    try {
        // 動態加載活動內容
        const response = await fetch(`/activity/${activityId}/edm/${activityId}`);
        if (!response.ok) throw new Error('活動內容加載失敗');
        const html = await response.text();
        
        // 先插入 HTML 內容
        activityContent.innerHTML = html;
        
        // 執行動態載入的 script 標籤
        const scripts = activityContent.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            // 複製所有屬性
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            // 複製腳本內容，並注入 URL 參數資訊
            let scriptContent = oldScript.textContent;
            // 在腳本開頭注入 URL 參數
            const urlSearchParams = window.location.search;
            const paramInjection = `
                // 注入的 URL 參數
                const __injectedParams = new URLSearchParams('${urlSearchParams}');
                console.log('注入的參數:', __injectedParams.toString());
                console.log('type 參數:', __injectedParams.get('type'));
            `;
            newScript.textContent = paramInjection + scriptContent;
            // 替換舊腳本
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        // 動態設置頁面標題
        document.title = `愛狗Salon 活動 - ${activityId}`;
    } catch (error) {
        console.error('活動內容加載錯誤:', error);
        activityContent.innerHTML = `
            <p class="text-center text-red-500">無法加載活動內容，請稍後再試。</p>
            <button class="retry-btn">重試</button>
            <a href="/index?view=activity" class="back-link">返回活動查詢</a>
        `;
        document.querySelector('.retry-btn').addEventListener('click', () => location.reload());

    }
})();