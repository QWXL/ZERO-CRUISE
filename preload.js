/*
 * @Author: BuildTools unconfigured@null.spigotmc.org
 * @Date: 2024-01-31 23:44:44
 * @LastEditors: 秋晚夕落 qwxl@zero-ai.online
 * @LastEditTime: 2024-03-15 21:50:05
 * @FilePath: \cruise-client\preload.js
 */

const { contextBridge, ipcRenderer } = require('electron/renderer')
let isFirst = false

contextBridge.exposeInMainWorld('api', {
  newMessage: (messageObject) => ipcRenderer.send('newMessage', messageObject),
  onWindowShow: (callback) => ipcRenderer.on('windowShow', (_event, value) => callback(value)),
  beforeQuit: (callback) => ipcRenderer.on('before-quit', (_event, value) => callback(value)), 
  sttProcess: (callback) => ipcRenderer.on('sttProcess', (_event, object) => callback(object)), 
  setData: (dataJson) => ipcRenderer.send('setData', dataJson),
  openWebsite: () => ipcRenderer.send('openWebsite'),
  closeProcess: () => ipcRenderer.send('closeProcess'),
  openGithub: () => ipcRenderer.send('openGithub'),
  clientKey: () => ipcRenderer.invoke('systemInfo'),
  getSavesData: () => ipcRenderer.invoke('getSavesData'),
  startDrag: (fileName) => ipcRenderer.send('ondragstart', fileName),
  saveFile: (fileName,fileData,oldName,noDelOld) => ipcRenderer.send('saveFile', fileName,fileData,oldName,noDelOld),
  delSaveFile: (fileName) => ipcRenderer.send('delSaveFile', fileName),
  editSaveTitle: (opid,newTitle) => ipcRenderer.send('editSaveTitle',opid,newTitle),
  prompt: (title, content) => {return ipcRenderer.sendSync('window-prompt', title, content)},
  startStt: () => ipcRenderer.send('startStt'),
  stopStt: () => ipcRenderer.send('stopStt'),
  restart: () => ipcRenderer.send('app-restart'),
  updateListener: () => ipcRenderer.on('update', (object) => callback(object)),
  isFirst: isFirst,
  quitAndInstall: () => ipcRenderer.send('quitAndInstall'),
  hideWindow: () => ipcRenderer.send('hideWindow'),
  taskPush: (object) => ipcRenderer.send('taskPush', object),
  getTask: (callback) => ipcRenderer.on('getTask', (_event, array) => callback(array)), 
  pastTask: (callback) => ipcRenderer.on('pastTask', (_event, object) => callback(object)),
  returnCruise: (boolean) => ipcRenderer.send('returnCruise', boolean),
  getCruise: (callback) => ipcRenderer.on('getCruise', (_event) => callback()),
  removeTask: (index) => ipcRenderer.send('removeTask', index),
  removeAllTasks: () => ipcRenderer.send('removeAllTasks'),
  allTask: () => ipcRenderer.invoke('allTask'),
  getTimeDiff: () => ipcRenderer.invoke('getTimeDiff'),
  createNotification: (title,content) => ipcRenderer.invoke('createNotification', (title,content)),
  openFile: (callback) => ipcRenderer.on('openFile', (_event,fileData) => callback(fileData)),
  giftCode: (callback) => ipcRenderer.on('giftCode', (_event, code) => callback(code)),
})
ipcRenderer.on('localData', (_event, localData, version) => {
  console.log(localData)
  console.log(version)
  sessionStorage.setItem('version',version)
  if (localData?.id) {
  console.log(JSON.stringify(localData,null,2))
  window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('versionSpan').textContent = version
  })
  const dataKeys = Object.keys(localData)
  for (i=0;i<dataKeys.length;i++) {
    console.log(dataKeys[i])
    console.log(localData[dataKeys[i]])
    if (localData[dataKeys[i]]) {
      console.log('√')
    localStorage.setItem(dataKeys[i],localData[dataKeys[i]])
    } else {
      console.log('×')
      localStorage.removeItem(dataKeys[i])
    }
  }
  console.log(JSON.stringify(localStorage,null,2))
  }
})

ipcRenderer.on('first',() => {
  window.addEventListener('DOMContentLoaded', () => {
  appendChatBubble(getTime(),'letter',`欢迎使用 ZERO AI CRUISE 客户端！<br>在这里，你可以体验到与网站中截然不同的使用体验，比如：<br><br>1. 全新的语音输入系统；<br>2. [Alt]+[Space]随时唤出；<br>3. 存档自动备份，自动罗列；<br><br>and more ...<br><button class="btnInChat" style="margin-top:20px;padding:10px" id="refreshScreen(false,false)" onclick="">好耶！<span class="iconfont icon-icon_line_thumb-up closeHideBtn"></span></button>`)
  isFirst = true
  console.log(isFirst)
  })
})

