# Edge-MyWordBook


## **Word Saver Extension**

### Save selected text or PDF content with ease.

### **Features**

* Automatically detects if the current page is a **PDF**.
* Supports extracting and saving text from **PDF files**.
* Allows users to save selected text on any webpage using the `Alt+Q` shortcut.
* Logs selected text or extracted PDF content in the console for debugging.
* Lightweight and efficient, without unnecessary UI clutter.

---

## **Installation & Usage (English)**

### **1. Installation**

1. Clone or download this repository.
2. Go to  `edge://extensions/`.
3. Enable **Developer mode** (toggle switch in the top-right corner).
4. Click **Load unpacked** and select the extension folder.

---

### **2. How to Use**

#### **For Normal Web Pages**

1. Select some text on any webpage.
2. Press `Alt+Q` to save the selected text.
3. The saved text will be logged in the browser console and sent to the background script for further handling.

#### **For PDF Files**

1. Open a PDF file in your browser.
2. The extension automatically redirects to a custom **PDF Viewer**.
3. Press `Alt+Q` to extract the entire text content of the PDF and save it.
4. The extracted text will be logged in the browser console and sent to the background script.

---

### **3. Debugging**

* Open the browser **Developer Tools** (F12).
* Check the **Console** tab for logs:
  * Selected text or extracted PDF content will be displayed.
  * Background script responses will also be logged here.

---

## **安装与使用说明 (中文)**

### **1. 安装步骤**

1. 克隆或下载本仓库。
2. 打开浏览器的扩展程序页面：`edge://extensions/`。
3. 启用 **开发者模式**（页面右上角的开关）。
4. 点击 **加载已解压的扩展程序**，选择扩展程序所在的文件夹。

---

### **2. 使用方法**

#### **对于普通网页**

1. 在任意网页上选中一段文字。
2. 按下快捷键 `Alt+Q` 即可保存选中的文本。
3. 保存的文本会显示在浏览器的控制台，并发送到后台脚本进行进一步处理。
4. 点击插件图标，点击下载文件，即可下载 浏览器打开后 你所选中 并 alt+Q 的 excel文件（为啥是excel? 方便背单词）。

#### **对于 PDF 文件**

1. 在浏览器中打开 PDF 文件。
2. 扩展程序会自动重定向到自定义的 **PDF 查看器**。
3. 按下快捷键 `Alt+Q`，提取 PDF 的全部文本内容并保存。
4. 提取的文本内容会显示在浏览器的控制台，并发送到后台脚本。
5. 点击插件图标，点击下载文件，即可下载 浏览器打开后 你所选中 并 alt+Q 的 excel文件。

---

### **3. 调试**

* 打开浏览器的 **开发者工具**（快捷键 F12）。
* 在 **控制台（Console）** 标签中可以查看以下内容：
  * 选中的文本或提取的 PDF 内容。
  * 后台脚本的响应信息。

---

## **Current Features (当前功能)**

* **Text Selection:**
  * Detects selected text on normal web pages.
  * Allows saving selected text using the `Alt+Q` shortcut.
* **PDF Detection:**
  * Automatically detects if the current page is a PDF.
  * Redirects to a custom **PDF Viewer** for enhanced handling.
* **PDF Extraction:**
  * Extracts the entire text content of a PDF file.
  * Logs extracted text in the console and sends it to the background script.
* **Keyboard Shortcuts:**
  * `Alt+Q` is the universal shortcut for saving selected text or PDF content.
* **Lightweight & Clean UI:**
  * No additional clutter or UI components; operates in the background.

---

## **Limitations (当前限制)**


1. **Cross-Origin Restrictions:**
   * For security reasons, some PDFs hosted on third-party websites might not be accessible due to CORS issues.
2. **UI Notifications:**
   * No visual notifications for save actions on some websites; relies on console logging.

### **Contact**

For any issues or feature requests, feel free to open an issue in this repository.
