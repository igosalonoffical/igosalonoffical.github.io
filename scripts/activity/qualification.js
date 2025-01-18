  //=== 檢查活動日期 ===
  function checkActivityPeriod(statusElementId, startDate, endDate) {
    console.log(startDate);
    console.log(endDate);
    const now = new Date();
    const activityStatusEl = document.getElementById(statusElementId);

    if (now < startDate) {
      // 活動尚未開始
      activityStatusEl.textContent = "（活動尚未開始）";
      // 也可以選擇是否做不可編輯處理
      disablePage(true);
    }
    else if (now > endDate) {
      // 活動已經結束
      activityStatusEl.textContent = "（活動已結束）";
      // 設為唯讀/不可點擊
      disablePage(false);
    }
    else {
      // 活動進行中
      activityStatusEl.textContent = "（活動進行中）";
    }
  }

//=== 停用整頁 ===
// 若參數為 true，則只顯示活動尚未開始的狀態
// 若參數為 false，則顯示活動已結束的狀態
function disablePage(isNotStarted) {
// 使所有可互動的元素 (輸入框、按鈕等) 失效
document.querySelectorAll('input, button').forEach(el => {
    el.disabled = true;
});
// 加上灰階效果提示
document.body.classList.add('disabled-page');

// 顯示不同提示文字
if (isNotStarted) {
    document.getElementById('result').textContent = "活動尚未開始，暫時無法操作。";
} else {
    document.getElementById('result').textContent = "活動已結束，感謝您的參與。";
}
}
