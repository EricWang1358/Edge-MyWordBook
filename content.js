console.log('Content script loaded');

// 判断是否为 PDF 页面
function isPDFPage() {
  const url = window.location.href;
  return url.endsWith('.pdf') || document.contentType === 'application/pdf';
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
      // 普通页面选中文字的保存功能
      console.log(`Alt+Q 触发保存功能，保存词汇: "${selectedText}"`);
      chrome.runtime.sendMessage({ action: 'saveWord', word: selectedText }, (response) => {
        console.log('收到背景脚本的响应:', response);
      });
    } else if (isPDFPage()) {
      // PDF 页面解析并保存所有内容
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

// 文本选择检测 (普通页面)
document.addEventListener('mouseup', () => {
  if (!isPDFPage()) {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      console.log(`检测到用户划词: "${selectedText}"`);
    }
  }
});

// PDF 页面初始化
if (isPDFPage()) {
  console.log('当前是 PDF 页面');
  // 自动解析 PDF 内容（可选）
  extractTextFromPDF().then((text) => {
    console.log('解析后的 PDF 文本:', text);
  });
} else {
  console.log('当前是普通页面');
}
