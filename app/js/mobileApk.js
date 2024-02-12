/*
 * @Author: 秋晚夕落 qwxl@zero-ai.online
 * @Date: 2024-01-28 17:52:48
 * @LastEditors: 秋晚夕落 qwxl@zero-ai.online
 * @LastEditTime: 2024-02-06 00:49:41
 * @FilePath: \server-side\public\js\mobileApk.js
 */
const download = document.getElementById('download-apk')
let mobile = true
let app = true
const urlString = window.location.href;
const urlObj = new URL(urlString);

const feedback = document.getElementById('feedback');
if (app && download && mobile) {
    download.remove()
    feedback.remove()
} else {
    document.getElementById('named-name').textContent = `Powered By QWXL |`
    download.innerHTML = ` | ${download.innerHTML}`
}
console.log(app)
console.log(download)
