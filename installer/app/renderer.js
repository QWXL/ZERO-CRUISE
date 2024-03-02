/*
 * @Author: 秋晚夕落 qwxl@zero-ai.online
 * @Date: 2024-02-21 21:15:11
 * @LastEditors: 秋晚夕落 qwxl@zero-ai.online
 * @LastEditTime: 2024-02-27 19:52:03
 * @FilePath: \cruise-client\installer\app\renderer.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const fileProgress = document.getElementById('fileProgress')
const spanProgress = document.getElementById('progress')

window.api.downloadProgress((data) => {
    console.log(data)
switch (data.type) {
    case 'progress': {
        fileProgress.value = data.content
        spanProgress.textContent = `${data.content}%`
        break;
    }
    case 'failed': {
        spanProgress.textContent = `下载失败：${data.content}`
    }
    
    case 'done': {
        document.getElementById('downloaded').style.display = 'block'
    }

    default:
        break;
}
})