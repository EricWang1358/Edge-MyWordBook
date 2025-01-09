// popup.js
console.log('Popup script loaded');

// 添加一个空的事件监听器来确保 Service Worker 持续运行
chrome.runtime.onInstalled.addListener(() => {
  console.log('Popup Listener installed');
});

document.getElementById('download-btn').addEventListener('click', () => {
  console.log('Sending message to background.js'); // 添加调试日志
  chrome.runtime.sendMessage({ action: 'downloadExcel' }, (response) => {
    console.log('Response from background:', response); // 确认是否收到背景脚本的响应
  });
});

  