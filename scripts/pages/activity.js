document.title = `愛狗Salon蘆荻店-活動查詢`;
(async () => {
  console.log('活動查詢頁面已載入');

  const loadingMessage = document.getElementById('loadingMessage');
  const activityTableContainer = document.getElementById('activityTableContainer');
  const activityTable = document.getElementById('activityTable');
  const today = new Date();

  // 從 Google Apps Script 獲取數據

  const fetchActivityData = async () => {
    const response = await fetch(getGSUrl() + '?action=getActivities');
    if (!response.ok) {
      throw new Error('無法獲取活動數據');
    }
    return await response.json();
  };

  // 判斷活動狀態
  const getStatus = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) {
      return '<span class="status not-started">尚未開始</span>';
    } else if (today >= start && today <= end) {
      return '<span class="status in-progress">進行中</span>';
    } else {
      return '<span class="status ended">結束</span>';
    }
  };

  try {
    const activityData = await fetchActivityData();

    // 動態生成表格內容
    activityData.forEach((activity) => {
      const id = activity['活動編號'];
      const name = activity['活動名稱'];
      const startDate = activity['起日'];
      const endDate = activity['迄日'];
      const link = today >= new Date(startDate) && today <= new Date(endDate)
        ? activity['詳細連結']
          ? activity['詳細連結']
          : `/activity/edmlayout?view=${id.toLowerCase()}`
        : null;

      const row = document.createElement('tr');
      row.innerHTML = `
          <td class="border border-gray-300 px-4 py-2">
               <a href="${link}" class="text-blue-500 hover:underline">${link ? '詳細' : ''}</a>
          </td>
          <td class="border border-gray-300 px-4 py-2">${id}</td>
          <td class="border border-gray-300 px-4 py-2">${name}</td>
          <td class="border border-gray-300 px-4 py-2">${startDate}</td>
          <td class="border border-gray-300 px-4 py-2">${endDate}</td>
          <td class="border border-gray-300 px-4 py-2">${getStatus(startDate, endDate)}</td>
      `;
      activityTable.appendChild(row);
    });

    // 隱藏 "查詢中" 並顯示表格
    loadingMessage.classList.add('hidden');
    activityTableContainer.classList.remove('hidden');
  } catch (error) {
    console.error('活動數據獲取失敗:', error);
    loadingMessage.textContent = '無法載入活動數據，請稍後再試。';
  }
})();