/*
 * @Author: 秋晚夕落 qwxl@zero-ai.online
 * @Date: 2024-02-20 19:51:45
 * @LastEditors: 秋晚夕落 qwxl@zero-ai.online
 * @LastEditTime: 2024-02-25 00:33:48
 * @FilePath: \installer\preload.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { contextBridge, ipcRenderer } = require('electron/renderer')


contextBridge.exposeInMainWorld('api', {
    minisize: () => ipcRenderer.send('minisize'),
    downloadProgress: (callback) => ipcRenderer.on('downloadProgress',(_event,data) => callback(data)),
    startFullexe: () => ipcRenderer.send('startFullexe'),
    startDownload: () => ipcRenderer.send('startDownload'),
  })