document.title = `內部活動查詢系統`;

(async () => {
  console.log('內部活動查詢頁面已載入');

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
    let end = endDate ? new Date(endDate) : new Date(today); // 如果沒有迄日，預設為今天
    end.setDate(end.getDate() + 1); // 如果迄日為空，將其設置為今天 + 1天

    if (today < start) {
      return 'not-started'; // 尚未開始
    } else if (today >= start && today <= end) {
      return 'in-progress'; // 進行中
    } else {
      return 'ended'; // 結束
    }
  };

  try {
    const activityData = await fetchActivityData();

    // 排序邏輯
    const sortedActivities = activityData.sort((a, b) => {
      const startDateA = new Date(a['起日']);
      const startDateB = new Date(b['起日']);

      // 如果迄日為空，預設為今天 + 1天
      const endDateA = a['迄日'] ? new Date(a['迄日']) : new Date(today);
      const endDateB = b['迄日'] ? new Date(b['迄日']) : new Date(today);
      endDateA.setDate(endDateA.getDate() + 1); // 將迄日設為今天 + 1天
      endDateB.setDate(endDateB.getDate() + 1); // 將迄日設為今天 + 1天

      const statusA = getStatus(a['起日'], a['迄日']);
      const statusB = getStatus(b['起日'], b['迄日']);

      // 進行中的活動排序
      if (statusA === 'in-progress' && statusB === 'in-progress') {
        if (!a['迄日'] && !b['迄日']) {
          return startDateA - startDateB;
        }
        if (!a['迄日']) return -1;
        if (!b['迄日']) return 1;
        return endDateA - endDateB || startDateA - startDateB;
      }

      // 尚未開始的活動排序
      if (statusA === 'not-started' && statusB === 'not-started') {
        return startDateA - startDateB || (endDateA - endDateB);
      }

      // 結束的活動排序
      if (statusA === 'ended' && statusB === 'ended') {
        return endDateB - endDateA || startDateA - startDateB;
      }

      // 如果一個是進行中，另一個是尚未開始或者結束，進行中排在前面
      if (statusA === 'in-progress') return -1;
      if (statusB === 'in-progress') return 1;

      // 如果一個是尚未開始，另一個是結束，尚未開始排在前面
      if (statusA === 'not-started') return -1;
      if (statusB === 'not-started') return 1;

      return 0; // 如果狀態相同，保持原來的順序
    });

    // 動態生成表格內容
    sortedActivities.forEach((activity) => {
      const id = activity['活動編號'];
      const name = activity['活動名稱'];
      const startDate = activity['起日'];
      const endDate = activity['迄日'];
      const detailLink = activity['詳細連結']
        ? activity['詳細連結']
        : `/activity/edmlayout?view=${id.toLowerCase()}`; // 如果有詳細連結，則使用該連結，否則使用動態生成的連結
      const verifyLink =
        activity['資格驗證'] && activity['資格驗證'] === true
          ? `/activity/${id.toLowerCase()}/qualification/${id.toLowerCase()}_qualification`
          : null;

      const statusClass = getStatus(startDate, endDate); // 獲取狀態的 class

      const row = document.createElement('tr');
      row.innerHTML = `
          <td class="border border-gray-300 px-4 py-2">
              <a href="${detailLink}" class="text-blue-500 hover:underline">${detailLink ? '詳細' : ''}</a>
          </td>
          <td class="border border-gray-300 px-4 py-2">
              <a href="${verifyLink}" class="text-green-500 hover:underline">${verifyLink ? '資格驗證' : ''}</a>
          </td>
          <td class="border border-gray-300 px-4 py-2">${id}</td>
          <td class="border border-gray-300 px-4 py-2">${name}</td>
          <td class="border border-gray-300 px-4 py-2">${startDate.replace(/-/g, "/")}</td>
          <td class="border border-gray-300 px-4 py-2">${endDate.replace(/-/g, "/") || ''}</td>
          <td class="border border-gray-300 px-4 py-2">
              <span class="status ${statusClass}">${statusClass === 'not-started' ? '尚未開始' : statusClass === 'in-progress' ? '進行中' : '結束'}</span>
          </td>
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
