/*
 * @Author: BuildTools unconfigured@null.spigotmc.org
 * @Date: 2024-01-31 23:44:44
 * @LastEditors: 秋晚夕落 qwxl@zero-ai.online
 * @LastEditTime: 2024-03-25 17:21:15
 * @FilePath: \cruise-client\preload.js
 */

const { contextBridge, ipcRenderer } = require('electron/renderer')
let isFirst = false

contextBridge.exposeInMainWorld('api', { 
  allReady: () => ipcRenderer.send('allReady'), // 渲染完毕
  newMessage: (messageObject) => ipcRenderer.send('newMessage', messageObject),
  onWindowShow: (callback) => ipcRenderer.on('windowShow', (_event, value) => callback(value)),
  beforeQuit: (callback) => ipcRenderer.on('before-quit', (_event, value) => callback(value)), 
  sttProcess: (callback) => ipcRenderer.on('sttProcess', (_event, object) => callback(object)), 
  setData: (dataJson) => ipcRenderer.send('setData', dataJson),
  openWebsite: () => ipcRenderer.send('openWebsite'),
  openGithub: () => ipcRenderer.send('openGithub'),
  openReleasePage: (version) => ipcRenderer.send('openReleasePage', version),
  closeProcess: () => ipcRenderer.send('closeProcess'),
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
  first: (callback) => ipcRenderer.on('first', () => callback()),
  closeAndUpdate: () => ipcRenderer.send('closeAndUpdate'),
  tryToUpdate: () => ipcRenderer.send('tryToUpdate'),
  updateVersion: (callback) => ipcRenderer.on('updateVersion', (_event,version) => callback(version)),
  downloadProgress: (callback) => ipcRenderer.on('downloadProgress',(_event,data) => callback(data)),
  log: (level,message,from,tick) => ipcRenderer.send('log', level,message,from,tick),
  showError: (title,content,detail) => ipcRenderer.invoke('showError', title,content,detail),
  isFirst: isFirst
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

ipcRenderer.on('first', () => {
  isFirst = true
})