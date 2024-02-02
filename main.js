/*
 * @Author: QWXL@zero-ai.online
 * @Date: 2024-01-31 23:36:03
 * @LastEditors: 秋晚夕落 qwxl@zero-ai.online
 * @LastEditTime: 2024-02-02 13:49:13
 * @FilePath: \cruise-client\main.js
 */
const electron = require('electron');
const path = require('path');
const { app, BrowserWindow, globalShortcut, Tray, Menu, nativeImage, ipcMain, shell } = electron
let tabPressedTime = 0;
let tray



const createMainWindow = () => {
    const win = new BrowserWindow({
      width: 500,
      height: 800,
      show: false,
      backgroundColor: "rgb(27,27,29)",
      resizable: false,
      alwaysOnTop: true,
      fullscreen: false,
      fullscreenable: false,
      frame: false,
      darkTheme: true,
      title: "ZERO CRUISE",
      icon: path.join(__dirname, 'AKETA AI.png'),
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    win.loadFile(path.join(__dirname, 'app', 'index.html'))
    win.once('ready-to-show', () => {
      win.show()
    })    
    global.win = win
    return win
  }



  

  app.whenReady().then(() => {
    let win = createMainWindow()
    win.webContents.openDevTools()
    win.on('blur', () => {
      win.hide();
    })
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) win = createMainWindow()
    })
    const icon = nativeImage.createFromPath(path.join(__dirname, 'whiteIcon.png'))
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
      { label: '显示/隐藏主菜单', type: 'normal', click:(() => windowToggleVisible()),accelerator:"TabandTab" },
      { label: '退出程序', type: 'normal', role: "quit" },
    ])
    console.log(contextMenu.items[0].click)

    tray.setContextMenu(contextMenu)
    tray.setToolTip('ZERO AI Cruise Client')
    tray.setTitle('ZERO AI')
      globalShortcut.register('Alt+Space', () => {
          // 双击 Tab 动作
          windowToggleVisible()
      });
  })


  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();    // 注销所有快捷键
  })


  function windowToggleVisible() {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
      win.focus()
    }
  }