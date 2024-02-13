/*
 * @Author: BuildTools unconfigured@null.spigotmc.org
 * @Date: 2024-01-31 23:44:44
 * @LastEditors: 秋晚夕落 qwxl@zero-ai.online
 * @LastEditTime: 2024-02-12 21:21:58
 * @FilePath: \cruise-client\preload.js
 */

const { contextBridge, ipcRenderer } = require('electron/renderer')

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
  stopStt: () => ipcRenderer.send('stopStt')
})
ipcRenderer.on('localData', (_event, localData) => {
  console.log(localData)
  if (localData?.id) {
  console.log(JSON.stringify(localData,null,2))
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
