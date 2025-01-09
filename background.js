importScripts('xlsx.full.min.js');

// background.js
console.log('Background script loaded');

// 添加一个空的事件监听器来确保 Service Worker 持续运行
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

let words = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('收到消息:', message);
  if (message.action === 'saveWord') {
    const word = message.word;
    if (word && !words.includes(word)) {
      words.push(word);
      chrome.storage.local.set({ words: words }, () => {
        console.log(`词汇 "${word}" 已保存。`);
        sendResponse({ status: 'success', word: word });
      });
    } else {
      console.log('词汇为空或已存在。');
      sendResponse({ status: 'failure', message: '词汇为空或已存在。' });
    }
    // 为了让 sendResponse 能够异步调用，返回 true
    return true;
  } else if (message.action === 'downloadExcel') {
    downloadExcel();
    sendResponse({ status: 'download_started' });
  }
});

function downloadExcel() {
  if (words.length === 0) {
    console.log('没有可保存的词汇');
    return;
  }

  console.log('正在生成 Excel 文件...');

  // 创建 Excel 文件
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([['Words'], ...words.map(word => [word])]);
  XLSX.utils.book_append_sheet(wb, ws, 'Words');

  // 将 Excel 文件导出为 Blob
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // 将 Blob 转换为 Base64 URL
  const reader = new FileReader();
  reader.onload = function (e) {
    const base64Data = e.target.result; // 读取的 Base64 数据
    chrome.downloads.download({
      url: base64Data,
      filename: 'words.xlsx',
      saveAs: true
    }, () => {
      console.log('Excel 文件已下载');
    });
  };
  reader.readAsDataURL(blob); // 将 Blob 转换为 Data URL
}


