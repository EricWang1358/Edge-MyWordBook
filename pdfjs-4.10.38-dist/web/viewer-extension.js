console.log('Viewer extension script loaded');

// 初始化全局变量
let wordSaverIcon; // 用于显示选中的文本
let selectedText = ""; // 用于保存当前选中的文本

// 鼠标移动时动态获取选中的文本，并在鼠标旁边显示
document.addEventListener('mousemove', (event) => {
  // 获取当前选中的文本
  const currentSelectedText = window.getSelection().toString().trim();

  if (currentSelectedText && currentSelectedText !== selectedText) {
    // 更新全局变量
    selectedText = currentSelectedText;

    // 如果图标不存在，则创建
    if (!wordSaverIcon) {
      wordSaverIcon = document.createElement('div');
      wordSaverIcon.id = 'word-saver-icon';
      wordSaverIcon.style.position = 'fixed';
      wordSaverIcon.style.cursor = 'default'; // 鼠标样式为默认
      wordSaverIcon.style.fontSize = '12px'; // 字体大小
      wordSaverIcon.style.maxWidth = '200px'; // 最大宽度
      wordSaverIcon.style.backgroundColor = 'rgba(0, 128, 0, 0.8)'; // 半透明绿色背景
      wordSaverIcon.style.color = 'white';
      wordSaverIcon.style.padding = '5px 10px';
      wordSaverIcon.style.borderRadius = '8px'; // 圆角
      wordSaverIcon.style.zIndex = '1000';
      wordSaverIcon.style.overflow = 'hidden'; // 隐藏超出内容
      wordSaverIcon.style.whiteSpace = 'nowrap'; // 禁止换行
      wordSaverIcon.style.textOverflow = 'ellipsis'; // 超出显示省略号
      wordSaverIcon.style.pointerEvents = 'none'; // 防止鼠标事件触发
      document.body.appendChild(wordSaverIcon);
    }

    // 实时更新图标的文本内容和位置
    wordSaverIcon.innerHTML = selectedText;
    wordSaverIcon.style.top = `${event.clientY + 10}px`; // 鼠标下方偏移 10px
    wordSaverIcon.style.left = `${event.clientX + 10}px`; // 鼠标右侧偏移 10px
  } else if (!currentSelectedText) {
    // 如果没有选中文本，移除图标并清空变量
    if (wordSaverIcon) {
      wordSaverIcon.remove();
      wordSaverIcon = null;
    }
    selectedText = "";
  }
});

// 监听键盘快捷键 Alt+Q
document.addEventListener('keydown', (event) => {
  if (event.altKey && event.key === 'q') {
    console.log('检测到 Alt+Q 快捷键');

    // 检查是否有选中的文本
    if (selectedText) {
      console.log(`Alt+Q 触发保存功能，保存词汇: "${selectedText}"`);

      // 发送选中的文本到后台脚本
      chrome.runtime.sendMessage({ action: 'saveWord', word: selectedText }, (response) => {
        console.log('收到背景脚本的响应:', response);
      });

      // 可选：保存成功后显示提示
      const toast = document.createElement('div');
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.right = '20px';
      toast.style.padding = '10px 20px';
      toast.style.backgroundColor = 'green';
      toast.style.color = 'white';
      toast.style.borderRadius = '5px';
      toast.style.zIndex = '10000';
      toast.innerText = `保存成功: "${selectedText}"`;
      document.body.appendChild(toast);

      // 3 秒后移除提示
      setTimeout(() => {
        toast.remove();
      }, 3000);
    } else {
      console.log('Alt+Q 按下，但没有选中的文本');
    }
  }
});
