/*
 * @Author: 秋晚夕落 qwxl@zero-ai.online
 * @Date: 2024-01-28 17:52:48
 * @LastEditors: 秋晚夕落 qwxl@zero-ai.online
 * @LastEditTime: 2024-02-01 17:10:42
 * @FilePath: \server-side\public\js\mobileApk.js
 */
const download = document.getElementById('download-apk')
let mobile = true
let app = true
const urlString = window.location.href;
const urlObj = new URL(urlString);

const feedback = document.getElementById('feedback');
const backToIndex = document.getElementById('backToIndex');
const inOuts = document.getElementsByClassName('output-inputChat');
if (app && download && mobile) {
    console.log(inOuts)
    download.remove()
    feedback.remove()
    backToIndex.remove()
    inOuts[2].remove()
    inOuts[1].remove()
    inOuts[0].remove()
} else {
    document.getElementById('named-name').textContent = `Powered By QWXL |`
    download.innerHTML = ` | ${download.innerHTML}`
}
console.log(app)
console.log(download)
