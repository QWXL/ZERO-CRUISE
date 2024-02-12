/*
 * @Author: QWXL@zero-ai.online
 * @Date: 2024-01-31 23:36:03
 * @LastEditors: 秋晚夕落 qwxl@zero-ai.online
 * @LastEditTime: 2024-02-12 19:30:08
 * @FilePath: \cruise-client\main.js
 */
const electron = require('electron');
const { app, BrowserWindow, globalShortcut, Tray, Menu, nativeImage, Notification, ipcMain, safeStorage, process, screen, shell, dialog  } = electron
const path = require('path');
const fs = require('fs/promises')
const prompt = require('electron-prompt');
const os = require('os');
const Store = require('electron-store');
const savesPath = path.join(app.getPath('userData'),"saves")
const store = new Store({
  name: 'data' // 更改存储文件名，默认是'config'
});
const clientKeyStore = new Store({
  name: 'clientKey',
  fileExtension: 'zero',
  encryptionKey: `I love you, please remember me ......`,// 致那些想要解密clientKey.zero文件的人：解密这个文件不会给你带来任何帮助，这个文件只是用于存储你的本地验证数据，这只是其中之一
  schema:{
    data:{
    type:"string",
    default:generateRandomString(2023)
  }
}
});
let tray
async function checkDirectoryExists(directoryPath) { // 检查存档目录是否存在
  try {
      await fs.access(directoryPath); // 如果存在，就什么也不做
  } catch (error) {
      if (error.code === 'ENOENT') {
          // 如果报这个错误就代表目录不存在，创建它
        await fs.mkdir(directoryPath)
      } else {
          // 其他错误处理逻辑
          dialog.showMessageBox(null,{
            message: `系统出现问题：${error}`,
            title: "ZERO ERROR",
            type: "error",
            buttons: ["我知道了"]
          })
          app.quit()
      }
  }
}

checkDirectoryExists(savesPath);
if(require('electron-squirrel-startup')) return; // 创建快捷方式
app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden:false,
}) // 开机自启设置
const createMainWindow = () => {
  let { x, y } = store.get('windowPosition', { x: undefined, y: undefined });
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      show: false,
      x,
      y,
      backgroundColor: "rgb(27,27,29)",
      resizable: false,
      alwaysOnTop: true,
      fullscreen: false,
      fullscreenable: false,
      maximizable: false,
      minimizable: false,
      frame: false,
      darkTheme: true,
      title: "ZERO CRUISE",
      icon: path.join(__dirname, ),
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    });
  
    win.loadFile(path.join(__dirname, 'app', 'index.html'))
    win.once('ready-to-show', () => {
      win.show()
    })    
    global.win = win
    win.setSkipTaskbar(true)
    return win
  }
  

  app.disableHardwareAcceleration() // 关闭硬件加速 避免在集显电脑上无法渲染界面


  app.whenReady().then(async () => {
    let win = createMainWindow()

    win.on('blur', () => {
      win.hide();
    })
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) win = createMainWindow()
    })
    const electronLocalshortcut = require('electron-localshortcut')

    win.on('focus', (event) => {
        electronLocalshortcut.register(win, ['CommandOrControl+R','CommandOrControl+Shift+R', 'F5'], () => {})
    })
    
    win.on('blur', (event) => {
        electronLocalshortcut.unregisterAll(win)
    })

    win.webContents.session.webRequest.onHeadersReceived((details, callback) => { // 处理跨域问题
      callback({
        responseHeaders: {
          'Access-Control-Allow-Origin': '*',
          ...details.responseHeaders,
        },
      });
    });
    const icon = nativeImage.createFromPath(path.join(__dirname, 'whiteIcon.png'))
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
      { label: '显示/隐藏主菜单', type: 'normal', click:(() => windowToggleVisible()),accelerator:"Alt+Space" },
      {
        type : 'checkbox',
        label: '开机启动',
        checked : app.getLoginItemSettings().openAtLogin,
        click : function () {
          if(!app.isPackaged){
            app.setLoginItemSettings({
              openAtLogin: !app.getLoginItemSettings().openAtLogin,
              path: process.execPath
            })
          }else{
            app.setLoginItemSettings({
              openAtLogin: !app.getLoginItemSettings().openAtLogin
            })
          }
          console.log(app.getLoginItemSettings().openAtLogin)
          console.log(!app.isPackaged);
  
        }
      },
      { label: '退出程序', type: 'normal', role: "quit"     },
    ])
    console.log(contextMenu.items[0].click)

    tray.setContextMenu(contextMenu)
    tray.setToolTip('ZERO AI Cruise Client')
    tray.setTitle('ZERO AI')
    tray.on('click',() => {
      if (!win.isVisible()) {
        win.show();
        win.focus();
        win.webContents.send('windowShow',true)
      }
      })
      globalShortcut.register('Alt+Space', () => {
          // 双击 Tab 动作
          windowToggleVisible()
      });



      ipcMain.on('setData', (event, data) => {
        store.set('data',safeStorage.encryptString(JSON.stringify(data,null,2)))
      })
      ipcMain.on('newMessage', (event, messageObject) => {
        const content = messageObject.content;
        const NOTIFICATION_TITLE = 'Assistant';
        const NOTIFICATION_BODY = content;
        const notification = new Notification({
          title: NOTIFICATION_TITLE,
          body: NOTIFICATION_BODY
        });
        if (!win.isVisible()) {
        notification.show()
        win.setProgressBar(1.1)
        }
        notification.on('click', () => {
          if (!win.isVisible()) {
            win.show()
            win.setProgressBar(-1)
          }
        })
      })
      
      ipcMain.on('openWebsite', (event) => {
        shell.openExternal('https://zero-ai.online')
      })

      ipcMain.on('openGithub', (event) => {
        shell.openExternal('https://github.com/QWXL/ZERO-CRUISE')
      })

      ipcMain.on('closeProcess', () => {
        app.quit()
      })

      ipcMain.on('saveFile', async (e,fileName,fileData,oldName,noDelOld) => {
        try {
          console.log(fileData)  
        await fs.writeFile(path.join(savesPath,fileName),JSON.stringify(fileData,null,2))
        if (oldName && noDelOld) {
          await fs.unlink(path.join(savesPath,`${oldName}.zero`))
        }  
      } catch (error) {
        dialog.showMessageBox(win,{
          message: `系统出现问题：${error}`,
          title: "ZERO ERROR",
          type: "warning",
          buttons: ["我知道了"]
        })
      }    
      })

      ipcMain.on('delSaveFile', async (e, fileName) => {
        try {
        await fs.unlink(path.join(savesPath,`${fileName}.zero`))
        } catch (error) {
          dialog.showMessageBox(win,{
            message: `系统出现问题：${error}`,
            title: "ZERO ERROR",
            type: "warning",
            buttons: ["我知道了"]
          })
        }
      })

      ipcMain.on('editSaveTitle', async (e,opid,newTitle) => {
        try {
          let filedata = JSON.parse(await fs.readFile(path.join(savesPath,`${opid}.zero`)))
          filedata.title = newTitle
          await fs.writeFile(path.join(savesPath,`${opid}.zero`),JSON.stringify(filedata,null,2))
          } catch (error) {
            dialog.showMessageBox(win,{
              message: `系统出现问题：${error}`,
              title: "ZERO ERROR",
              type: "warning",
              buttons: ["我知道了"]
            })
          }
      })

      ipcMain.on('ondragstart', (event,fileName) => {
        const iconName = path.join(__dirname, 'drop.png')
        event.sender.startDrag({
          file: path.join(savesPath,fileName),
          icon: iconName
        })
      })

      ipcMain.on('window-prompt', async (event, title, content) => {
        event.returnValue = await windowPrompt(event, title, content)
        win.show()
      });

      ipcMain.handle('getSavesData', async () => {
        return new Promise(async (resolve, reject) => {
          try {
          resolve(readAndSortTitlesByIds())
          } catch {
            dialog.showMessageBox(win,{
              message: `系统出现问题：${error}`,
              title: "ZERO ERROR",
              type: "warning",
              buttons: ["我知道了"]
            })
          }
        })
      })

      ipcMain.handle('systemInfo', () => {
        const appPath = app.getAppPath()
        const mainScreen = screen.getPrimaryDisplay().size;
        const clientKey = clientKeyStore.get('data')
        const platform = os.platform();
        const platformVersion = os.release();
        const cpuArch = os.arch();

        const result = {
          appPath:appPath,
          mainScreen:mainScreen,
          clientKey:clientKey,
          platform:platform,
          platformVersion:platformVersion,
          cpuArch:cpuArch
        }
        return result
      })


      const data = store.get('data')
      console.log(safeStorage.decryptString(Buffer.from(data.data)))
        win.webContents.send('localData',safeStorage.decryptString(Buffer.from(data.data)))
      
      /**
      * 显示指定标题和内容的弹窗
      * @param {string}title 标题
      * @param {string} content 默认填写的内容
      * @returns {Promise} 输入框输入的内容
      */
      function windowPrompt(event, title, content) {
       return new Promise((resolve, reject) => {
         prompt({
          title: '你最好是别输入个寂寞（',
          label: title, // 标题
          value: content, // 内容
          buttonLabels: {
            ok: "<span id=\"ok\">确定</span>",
            cancel: "<span id=\"cancel\">取消</span>"
          },
          type: 'input',
          inputAttrs: {
          type: 'text',
          maxlength: 10,
          placeholder: "10个字符以内"
          },
          useHtmlLabel: true,
          icon: path.join(__dirname, 'whiteIcon.png'),  // 图标
          width: 500, // 宽度
          height: 180, //高度
          customStylesheet: path.join(__dirname, 'app', 'prompt.css'),
        }, win) //指定弹窗在那个窗体显示
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          resolve(null)
          console.error(error);
      });
  });
}
  })


  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('before-quit', () => {
    globalShortcut.unregisterAll();    // 注销所有快捷键
    win.webContents.send('before-quit',true)
      // 获取当前window的位置
      let [ x, y ] = win.getPosition();
      // 将这些值存储到store中
      store.set('windowPosition', { x, y });
      console.log('bye!')
  })


  function windowToggleVisible() {
    if (win.isVisible()) {
      win.hide();
      win.webContents.send('windowShow',false)
    } else {
      win.show();
      win.focus();
      win.webContents.send('windowShow',true)
      win.setProgressBar(-1)
    }
  }


  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}




async function readAndSortTitlesByIds() {
  try {
    // 读取savesPath目录下所有文件和目录
    const files = await fs.readdir(savesPath, { withFileTypes: true });

    // 过滤出.zero结尾的文件，并生成包含完整路径信息的数组
    const zeroFilesPaths = files.filter(file => file.isFile() && file.name.endsWith('.zero'))
                                .map(file => path.join(savesPath, file.name));

    let titlesWithTimesAndIds = [];

    for (let filePath of zeroFilesPaths) {
      // 异步读取每个.zero 文件内容
      const contentStr = await fs.readFile(filePath, 'utf8');

      try{
        const contentObj = JSON.parse(contentStr);

        if (contentObj.title && contentObj.outputTime && contentObj.outputID) {
          titlesWithTimesAndIds.push({
            title: contentObj.title,
            outputTime: new Date(contentObj.outputTime),
            outputID: contentObj.outputID
          });
        }
      } catch(err){
         console.error(`Error parsing JSON from ${filePath}:`, err);
      }

    }

   // 根据outputTime递增排序titlesWithTimes数组
   titlesWithTimesAndIds.sort((a,b)=> a.outputTime - b.outputTime);

   return titlesWithTimesAndIds.map(item=> ({title:item.title,outputID:item.outputID,outputTime:item.outputTime}));

  } catch (err) {
     console.error("Failed to read and sort .zero files:", err);
     throw err;
  }
}





 
