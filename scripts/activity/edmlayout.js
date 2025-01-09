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
        activityContent.innerHTML = html;

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
