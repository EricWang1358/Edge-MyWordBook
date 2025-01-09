console.log('Content script loaded');

// 判断当前页面是否为 PDF 文件
// 判断是否为 PDF 页面
function isPDFPage() {
  const url = window.location.href;
  return url.endsWith('.pdf') || document.contentType === 'application/pdf';
}

if (isPDFPage()) {
  console.log('检测到 PDF 页面');

  // 获取当前页面的 PDF URL
  const pdfUrl = encodeURIComponent(window.location.href);

  // 构建重定向到 Viewer 的 URL
  const viewerUrl = chrome.runtime.getURL(`pdfjs-4.10.38-dist/web/viewer.html?file=${pdfUrl}`);
  console.log('重定向到 PDF Viewer:', viewerUrl);

  // 重定向到 Viewer 页面
  window.location.href = viewerUrl;
}

// 部署 "+" 图标
function showPlusIcon(selectedText) {
  console.log(`尝试部署 "+" 图标"`);
  if (document.getElementById('word-saver-icon')) {
    console.log(`已存在 "+" 图标，跳过部署`);
    return;
  }

  const icon = document.createElement('div');
  icon.id = 'word-saver-icon';
  icon.style.position = 'absolute';
  icon.style.top = '10px';
  icon.style.right = '10px';
  icon.style.cursor = 'pointer';
  icon.innerHTML = '+';
  icon.style.fontSize = '24px';
  icon.style.backgroundColor = 'green';
  icon.style.color = 'white';
  icon.style.padding = '5px';
  icon.style.borderRadius = '50%';
  icon.style.zIndex = '1000';
  icon.title = '保存此词汇';
  console.log(`"+" 图标已部署`);

  icon.addEventListener('click', () => {
    console.log(`点击了 "+" 图标，保存词汇: "${selectedText}"`);
    chrome.runtime.sendMessage({ action: 'saveWord', word: selectedText }, (response) => {
      console.log('收到背景脚本的响应:', response);
    });
    console.log(`已保存词汇: "${selectedText}"`);
    icon.remove();
  });

  document.body.appendChild(icon);
}

// PDF 文本解析
async function extractTextFromPDF() {
  console.log('尝试解析 PDF 文本');
  const pdfjsLib = await import(chrome.runtime.getURL('pdfjs-4.10.38-dist/build/pdf.mjs'));
  pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdfjs-4.10.38-dist/build/pdf.worker.mjs');

  const pdfUrl = window.location.href;
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

  console.log(`PDF 加载成功，总页数: ${pdf.numPages}`);
  let extractedText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    textContent.items.forEach((item) => {
      extractedText += item.str + ' ';
    });
  }

  console.log('PDF 文本解析完成:', extractedText);
  return extractedText;
}

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
  }
});

// 普通页面文本选择逻辑
document.addEventListener('mouseup', () => {
  if (!isPDFPage()) {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      showPlusIcon(selectedText);
    } else {
      const existingIcon = document.getElementById('word-saver-icon');
      if (existingIcon) existingIcon.remove();
    }
  }
});

// PDF 页面初始化
if (isPDFPage()) {
  console.log('当前是 PDF 页面');
  // 自动解析 PDF（可选）
  extractTextFromPDF().then((text) => {
    console.log('解析后的 PDF 文本:', text);
  });
} else {
  console.log('当前是普通页面');
}
