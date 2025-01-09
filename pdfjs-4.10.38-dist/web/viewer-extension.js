console.log('Viewer extension script loaded');

// 添加一个全局的鼠标抬起事件监听器，用于检测用户选择的文本
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  
  if (selectedText) {
    console.log(`检测到用户划词: "${selectedText}"`);

    // 在页面上显示一个 "+" 图标
    showPlusIcon(selectedText);
  } else {
    // 如果未选中文本，则移除 "+" 图标
    const existingIcon = document.getElementById('word-saver-icon');
    if (existingIcon) existingIcon.remove();
  }
});

// 显示 "+" 图标的函数
function showPlusIcon(selectedText) {
  if (document.getElementById('word-saver-icon')) return;

  const icon = document.createElement('div');
  icon.id = 'word-saver-icon';
  icon.style.position = 'fixed';
  icon.style.top = `${event.clientY}px`;
  icon.style.left = `${event.clientX}px`;
  icon.style.cursor = 'pointer';
  icon.innerHTML = '+';
  icon.style.fontSize = '24px';
  icon.style.backgroundColor = 'green';
  icon.style.color = 'white';
  icon.style.padding = '5px';
  icon.style.borderRadius = '50%';
  icon.style.zIndex = '1000';
  icon.title = '保存此词汇';

  // 添加点击事件，发送选中文字到后台
  icon.addEventListener('click', () => {
    console.log(`点击了 "+" 图标，保存词汇: "${selectedText}"`);
    chrome.runtime.sendMessage({ action: 'saveWord', word: selectedText }, (response) => {
      console.log('收到背景脚本的响应:', response);
    });
    icon.remove();
  });
  // 添加键盘快捷键监听
document.addEventListener('keydown', (event) => {
    if (event.altKey && event.key === 'q') {
      console.log('检测到 Alt+Q 快捷键');
  
      const selectedText = window.getSelection().toString().trim();
      if (selectedText) {
        console.log(`Alt+Q 触发保存功能，保存词汇: "${selectedText}"`);
        chrome.runtime.sendMessage({ action: 'saveWord', word: selectedText }, (response) => {
          console.log('收到背景脚本的响应:', response);
        });
      } else if (isPDFPage()) {
        console.log('PDF 页面按下快捷键，尝试解析 PDF 内容');
        extractTextFromPDF().then((text) => {
          chrome.runtime.sendMessage({ action: 'saveWord', word: text }, (response) => {
            console.log('PDF 内容保存完成，收到背景脚本的响应:', response);
          });
        });
      } else {
        console.log('Alt+Q 按下，但没有选中的文本');
      }
      icon.remove();
    }
  });
  document.body.appendChild(icon);
}
