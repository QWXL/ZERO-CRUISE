/*
 * @Author: QWXL@zero-ai.online
 * @Date: 2024-01-31 23:36:03
 * @LastEditors: 秋晚夕落 qwxl@zero-ai.online
 * @LastEditTime: 2024-03-26 20:35:36
 * @FilePath: \cruise-client\main.js
 */
// 谁又还记得，我创立零号智能的初衷，是在我情绪崩溃时有一个我可以绝对相信的倾听者



const electron = require('electron');
const { app, BrowserWindow, globalShortcut, Tray, Menu, nativeImage, Notification, ipcMain, safeStorage, screen, shell, dialog, autoUpdater,powerMonitor   } = electron
const process = require('node:process');
const path = require('path');
const fs = require('fs/promises')
const prompt = require('electron-prompt');
const os = require('os');
const Store = require('electron-store');
const portscanner = require('portscanner');
const { spawn , exec, execFile} = require('child_process');
const savesPath = path.join(app.getPath('userData'),"saves");
const axios = require('axios');
const express = require('express');
const appserver = express();
const moment = require('moment');
let clientData = null
let win


/**
 * 函数 getTime 以“YYYY-MM-DD HH:MM:SS”格式返回当前日期和时间，或者作为具有年、月、日、小时、分钟和秒单独属性的对象。
 * @param object -
 * “object”参数是一个布尔值，它确定函数是否应该返回具有年、月、日、小时、分钟和秒的单独属性的对象，或者返回带有日期和时间的格式化字符串。如果“object”为“true”，该函数将返回一个对象。
 * @returns 函数“getTime”返回具有“year”、“month”、“day”、“hour”、“min”和“sec”属性的对象，或者返回格式为“YYYY-MM-DD
 * HH:MM:SS”的格式化字符串。具体返回值取决于`object`参数的值。
 */
function getTime(object) {
  var date = new Date();
  
  // 年月日
  var year = date.getFullYear().toString().padStart(2, '0');
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');
  
  // 时分秒
  var hour = date.getHours().toString().padStart(2, '0');
  var minute = date.getMinutes().toString().padStart(2, '0');
  var second = date.getSeconds().toString().padStart(2, '0');
  if (object) {  
  return {
      year:year,
      month:month,
      day:day,
      hour:hour,
      min:minute,
      sec:second
  }
  } else {
  return`${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
}

function getDays() {
  var date = new Date();
  
  // 年月日
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  
  
  return year + '-' + month + '-' + day;
}
let startCode = `${getDays()}-${createCode()}`

let logs = [ // Log 基础数组
  `[${getTime()} | INFO  | Preload] Starting up... [Preload]`,
  `[${getTime()} | INFO  | Preload] Cruise version: ${app.getVersion()}`,
  `[${getTime()} | INFO  | Preload] Loading Module: electron`,
  `[${getTime()} | INFO  | Preload] Loading Module: node:process`,
  `[${getTime()} | INFO  | Preload] Loading Module: path`,
  `[${getTime()} | INFO  | Preload] Loading Module: fs/promises`,
  `[${getTime()} | INFO  | Preload] Loading Module: electron-prompt`,
  `[${getTime()} | INFO  | Preload] Loading Module: os`,
  `[${getTime()} | INFO  | Preload] Loading Module: electron-store`,
  `[${getTime()} | INFO  | Preload] Loading Module: portscanner`,
  `[${getTime()} | INFO  | Preload] Loading Module: child_process`,
  `[${getTime()} | INFO  | Preload] Loading Module: axios`,
  `[${getTime()} | INFO  | Preload] Loading Module: express`,
  `[${getTime()} | INFO  | Preload] Loading Module: moment`,
]

let tickLogs = [ // tickLog
]


const store = new Store({
  name: app.isPackaged ? 'data' : 'devData' // 依据程序的状态（生产环境 / 开发环境），将配置文件分开储存。
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
const extraStore = new Store({
  name: 'extraConfig',
  fileExtension: 'json',
  schema:{
    data:{
    type:"object",
    default:{}
  }
}
});
let tray
const boolean = {
  "true":true,
  "false":false,
  null:false,
  undefined:false,
  true:true,
  false:false
}




function getCallerFunctionDetail(){
let stackInfo = new Error().stack.split("\n");

if(stackInfo.length > 3){
    let callerStackLine = stackInfo[3];
    let patternMatchResult = callerStackLine.match(/at (\S+)/);
    
    if(patternMatchResult && patternMatchResult[1]){
        return patternMatchResult[1];       // 返回caller function detail.
    }
}

return null;                                // 如果无法确定，则返回null。
}



/**
* “log”函数格式化消息并将其记录到控制台和 Web 终端，并具有可选的警告级别。
* @param {number|1} level - “level”参数用于指定日志消息的严重级别。它的值可以是 1 到 5.
* @param message - “message”参数是一个字符串，表示您要显示的日志消息。它可以包含您想要记录的任何信息或详细信息。
* @param from - `from` 参数表示日志消息的发起方。默认值为“/Anonymous/”。
* @param tick - `tick` 可选参数表示这个日志消息是否为processTick的日志消息，如果是，它将被储存在tickLogs中。
*/
function log(level,message,from,tick) {
let warnLevels = {
  1:'INFO ',
  2:'WARN ',
  3:'ERROR',
  4:'FATAL',
  5:'DEBUG'
 }
 const callerDetail = getCallerFunctionDetail();
 let attrText = `[${getTime()} | ${warnLevels[level] || 'INFO '} | ${from || callerDetail || "/Anonymous/"}]`
 const log = `${attrText} ${message}`
 if (tick) {
  tickLogs.push(log)
  saveTickLogs()
 }
 else {
  logs.push(log)
  console.log(log)
  saveLogs()
}

}

function saveLogs() {
try {
  checkDirectoryExists(path.join(app.getPath('userData'),'logs'))
  fs.writeFile(path.join(app.getPath('userData'),'logs',`functions-${startCode}.log`), logs.join('\n'))
} catch (error) {
  dialog.showErrorBox("ZERO ERROR",`记录日志文件时出现问题：${error}`)
  app.quit()
}
}

function saveTickLogs() {
  try {
    checkDirectoryExists(path.join(app.getPath('userData'),'logs'))
    fs.writeFile(path.join(app.getPath('userData'),'logs',`ticks-${startCode}.log`), tickLogs.join('\n'))
  } catch (error) {
    dialog.showErrorBox("ZERO ERROR",`记录日志文件时出现问题：${error}`)
    app.quit()
  }
  }

ipcMain.on('log',(event,level,message,from,tick)=>{
  log(level,message,from || 'renderer',tick)
})


if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('zero', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('zero')
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  log(4,'Repeat startup process! Closed!', 'gotTheLock')
  app.exit()
} else {
  app.on('second-instance', async (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      log(1,`Open process with commandLine: ${commandLine}`, 'second-instance')
      if (!win.isVisible()) win.show()
      win.webContents.send('windowShow',true)
      win.setProgressBar(-1)
      win.focus()
      console.log(`win is true`)
    } else {
      console.log(`win is false`)
    }
    const arg = commandLine.pop().slice(0, -1).replace('zero://','')
    if (arg.includes('[openHistroy]')) {
      const url = decodeURI(arg.replace('[openHistroy]',''))
    const data = await fs.readFile(`${url}`,'utf-8')
    win.webContents.send('openFile',data)
    console.log(data)
    const notification = new Notification({
      title: `读取存档成功！`,
      body: `导出时间：${JSON.parse(data).outputTime}，条数：${JSON.parse(data).data.chat.length}`,
    });
    notification.show();
    notification.on('click', () => {
      if (!win.isVisible()) {
        win.show()
      }
    })
    log(1,`Open histroy file: ${url}`, 'second-instance')
    } else if (arg.includes('[giftCode]')) {
    const data = decodeURI(arg.replace('[giftCode]',''))
    win.webContents.send('giftCode',data)
    console.log(data)
    const notification = new Notification({
      title: `兑换兑换码成功！`,
      body: `兑换码：${data}`,
    });
    notification.show();
    notification.on('click', () => {
      if (!win.isVisible()) {
        win.show()
      }
    })
    log(1,`Redeem a gift code: ${data}`, 'second-instance')
    }
  })
}
fs.cp(path.join(__dirname,'killSttProcess.cmd'), path.join(app.getPath('temp'),'cruise','killSttProcess.cmd'));

ipcMain.handle('showError',async (event,title,content,detail)=>{
  return new Promise(async (resolve, reject) => {  
  await dialog.showMessageBox(win,{
    message: content,
    detail: detail,
    title: title,
    type: "warning",
    buttons: ["我知道了"]
  })
  resolve()
  app.quit()
})
})

async function checkDirectoryExists(directoryPath) { // 检查存档目录是否存在
  try {
      await fs.access(directoryPath); // 如果存在，就什么也不做
  } catch (error) {
      if (error.code === 'ENOENT') {
          // 如果报这个错误就代表目录不存在，创建它
        await fs.mkdir(directoryPath)
        log(1,`Create saves directory: ${directoryPath}`)
      } else {
        log(3,`Could not access directory: ${directoryPath} (${error})`)
          // 其他错误处理逻辑
          dialog.showErrorBox(
          "ZERO ERROR",
          `系统出现问题：${error}`
          )
      }
  }
}
let window
checkDirectoryExists(savesPath);
if(require('electron-squirrel-startup')) return; // 创建快捷方式
app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden:false,
}) // 开机自启设置
const createMainWindow = () => {
  log(1,`Create main user window`,'createMainWindow')
  const mainLogo = nativeImage.createFromPath('./favicon.png')
  let { x, y } = store.get('windowPosition', { x: undefined, y: undefined });
    const window = new BrowserWindow({
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
      icon: mainLogo,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    });
    log(1,`Load index: ${path.join(__dirname, 'app', 'index.html')}`)
    window.loadFile(path.join(__dirname, 'app', 'index.html'))
    window.once('ready-to-show', () => {
      window.show()
      sortEveryTasks(window)
    })    
    global.win = window
    win = window
    window.setSkipTaskbar(true)
    return window
  }
  

  app.disableHardwareAcceleration() // 关闭硬件加速 避免在集显电脑上无法渲染界面
  app.commandLine.appendSwitch('lang', 'zh-CN')  
  app.whenReady().then(async () => {
    const data = store.get('data')
    log(1,`Load data.`,'main')
    if (data?.data) {
    clientData = JSON.parse(safeStorage.decryptString(Buffer.from(data?.data))) 
    } else {
      clientData = null
    }
    const extraConfig = extraStore.get('data')
    const rootUrl = extraConfig?.['root_url']
    if (clientData && extraConfig) {
      Object.assign(clientData,extraConfig)
    }
    if (clientData && rootUrl) {
      try {
        log(1,`Checking custom URL: ${rootUrl}`,'main')
        // 阻塞等待 get 请求完成
        await axios.get(`${rootUrl}/api/check`);
        // 如果请求成功，则自然会继续执行后面的代码
      } catch (error) {
        log(4,`Cannot connect to the custom URL: ${rootUrl}`,'main')
        // 如果请求失败，则捕获错误并显示错误提示框
        await dialog.showMessageBox(null,{
          message: `无法连接至设定的服务器地址：${rootUrl} \n程序将退出。`,
          title: "ZERO ERROR",
          type: "error",
          detail: `${error}`,
          buttons: ["我知道了","清除该配置"]
        }).then(({response}) => {
          console.log(response)
          if (response === 1) {
            extraStore.set('data.root_url','')
            log(2,`Clear custom URL.`,'main')
            app.relaunch()
          } 
          app.quit()
        })
      }
    } else if (clientData) {
      clientData['root_url'] = null
    }
    let win = createMainWindow()
    if (!app.isPackaged) {
      log(2,`Devlopment mode.`,'main')
    win.webContents.openDevTools()
    }
    win.on('blur', () => {
      win.hide();
    })
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) win = createMainWindow()
    })
    if (app.isPackaged) {
    win.removeMenu() // 这两行是阻止Ctrl+R刷新的
    Menu.setApplicationMenu(Menu.buildFromTemplate([]))
    }
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
        type:  'checkbox',
        label: '开机启动',
        checked:  app.getLoginItemSettings().openAtLogin,
        click:  function () {
            app.setLoginItemSettings({
              openAtLogin: !app.getLoginItemSettings().openAtLogin,
              path: app.getPath('exe')
            })
          
          console.log(app.getLoginItemSettings().openAtLogin)
          console.log(!app.isPackaged);
  
        }
      },
      { 
      label: '退出程序', 
      type: 'normal', 
      click: function () {
        app.quit()
      }
    },
    ])

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
      let altSpacePressTime = 0
      globalShortcut.register('Alt+Space', () => {
        if (altSpacePressTime > 1) {
          if (!win.isVisible()) {
            win.show();
            win.focus();
            win.webContents.send('windowShow',true)
          }
        } else {
          windowToggleVisible()
        }
        altSpacePressTime = 120
      });
      setInterval(() => {
        if (altSpacePressTime < 0) {
          altSpacePressTime = 0
        } else {
        altSpacePressTime -= 10
        }
      }, 10);


      ipcMain.on('setData', (event, data) => {
        data["root_url"] = null
        log(2,`Set new data from IPC.`,'main')
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
        log(1,`Open website: https://zero-ai.online`,'main')
      })

      ipcMain.on('openGithub', (event) => {
        shell.openExternal('https://github.com/QWXL/ZERO-CRUISE')
        log(1,`Open website: https://github.com/QWXL/ZERO-CRUISE`,'main')
      })

      ipcMain.on('openReleasePage', (event,version) => {
        shell.openExternal(`https://github.com/QWXL/ZERO-CRUISE/releases/tag/CruiseRelease${version}`)
        log(1,`Open website: https://github.com/QWXL/ZERO-CRUISE/releases/tag/CruiseRelease${version}`,'main')
        
      })

      ipcMain.on('closeProcess', () => {
        clearInterval(taskInterval)
        log(1,`Close process with IPC.`,'main')
        app.quit()
      }) 

      ipcMain.on('hideWindow', () => {
        win.hide()
      })
      ipcMain.on('saveFile', async (e,fileName,fileData,oldName,noDelOld) => {
        try {
          log(1,`Save file: ${fileName}`,'main')
          console.log(fileData)  
          console.log(`${oldName},${noDelOld}`)
        await fs.writeFile(path.join(savesPath,fileName),JSON.stringify(fileData,null,2))
        if (oldName && !noDelOld) {
          console.log(`del old file: ${oldName}`)
          await fs.unlink(path.join(savesPath,`${oldName}.zero`))
        }  
      } catch (error) {
        log(3,`Save file error: ${error}`,'main')
        await dialog.showMessageBox(win,{
          message: `系统出现问题：${error}`,
          title: "ZERO ERROR",
          type: "warning",
          buttons: ["我知道了"]
        })
        app.quit()
      }    
      })

      ipcMain.on('delSaveFile', async (e, fileName) => {
        try {
        log(1,`Delete file: ${fileName}`,'main')
        await fs.unlink(path.join(savesPath,`${fileName}.zero`))
        } catch (error) {
          log(3,`Delete file error: ${error}`,'main')
          await dialog.showMessageBox(win,{
            message: `系统出现问题：${error}`,
            title: "ZERO ERROR",
            type: "warning",
            buttons: ["我知道了"]
          })
          app.quit()
        }
      })

      ipcMain.on('editSaveTitle', async (e,opid,newTitle) => {
        try {
          log(1,`Edit file: ${fileName}`,'main')
          let filedata = JSON.parse(await fs.readFile(path.join(savesPath,`${opid}.zero`)))
          filedata.title = newTitle
          await fs.writeFile(path.join(savesPath,`${opid}.zero`),JSON.stringify(filedata,null,2))
          } catch (error) {
            log(3,`Edit file error: ${error}`,'main')
            await dialog.showMessageBox(win,{
              message: `系统出现问题：${error}`,
              title: "ZERO ERROR",
              type: "warning",
              buttons: ["我知道了"]
            })
            app.quit()
          }
      })

      ipcMain.on('ondragstart', (event,fileName) => {
        log(1,`Drag file: ${fileName}`,'main')
        const iconName = path.join(__dirname, 'drop.png')
        event.sender.startDrag({
          file: path.join(savesPath,fileName),
          icon: iconName
        })
      })

      ipcMain.on('window-prompt', async (event, title, content) => {
        log(1,`Show prompt window: ${title}(${content})`,'main')
        event.returnValue = await windowPrompt(event, title, content)
        win.show()
      });

      ipcMain.handle('getSavesData', async () => {
        return new Promise(async (resolve, reject) => {
          try {
          log(1,`Get saves data.`,'main')
          resolve(readAndSortTitlesByIds())
          } catch (error) {
            log(3,`Get saves data error: ${error}`,'main')
            await dialog.showMessageBox(win,{
              message: `系统出现问题：${error}`,
              title: "ZERO ERROR",
              type: "warning",
              buttons: ["我知道了"]
            })
            app.quit()
          }
        })
      })

      ipcMain.handle('systemInfo', async () => {
        log(1,`Information on the statistical system`, 'main')
        const appPath = app.getAppPath()
        const mainScreen = screen.getPrimaryDisplay().size;
        const clientKey = clientKeyStore.get('data')
        const platform = os.platform();
        const platformVersion = os.release();
        const cpuArch = os.arch();
        const gpuData = await app.getGPUInfo('complete')

        const result = {
          appPath:appPath,
          mainScreen:mainScreen,
          clientKey:clientKey,
          platform:platform,
          platformVersion:platformVersion,
          cpuArch:cpuArch,
          gpuData:gpuData
        }
        
        return result
      })


      let isFirst = false
      console.log(clientData)
      await createTasksFile()
      if (clientData) {
        log(1,`Set local data.`,'main')
        win.webContents.send('localData',clientData,app.isPackaged ? app.getVersion():  `[unPackaged] ${app.getVersion()}`)
      } else {
        log(1,`User is first time`,'main')
        win.webContents.send('localData',"{}",app.isPackaged ? app.getVersion():  `[unPackaged] ${app.getVersion()}`)
        isFirst = true
        fs.writeFile(path.join(app.getPath('userData'), 'tasks.json'),'{}')
        const shortcuts = require("windows-shortcuts"); 
        shortcuts.create(path.join(app.getPath('appData'),'Microsoft','Windows','Start Menu','Programs','ZERO CRUISE.lnk'),{
          target: app.getPath('exe')
        }, function(err) {
          if (err) {
            log(3,`Create shortcut error: ${err}`,'main')
              throw Error(err);
          }
          else
              console.log("Shortcut created!");
      }
        )
        console.log(path.join(app.getPath('appData'),'Microsoft','Windows','Start Menu','Programs','ZERO CRUISE.lnk'))
      }
      
      
      /**
      * 显示指定标题和内容的弹窗
      * @param {everything} event 仅做兼容性保留 `已弃用`
      * @param {string} title 标题
      * @param {string} content 默认填写的内容
      * @returns {Promise} 输入框输入的内容
      */
      function windowPrompt(event, title, content) {
        log(1,`Open prompt window.`)
       return new Promise((resolve, reject) => {
         prompt({
          title: '你最好是别输入个寂寞 (●\'◡\'●)ﾉ',
          label: title, // 标题
          value: content, // 内容
          buttonLabels: {
            ok: "<span id=\"ok\">确定</span>",
            cancel: "<span id=\"cancel\">取消</span>"
          },
          type: 'input',
          inputAttrs: {
          type: 'text',
          maxlength: 20,
          placeholder: "20个字符以内"
          },
          useHtmlLabel: true,
          icon: path.join(__dirname, 'whiteIcon.png'),  // 图标
          width: 500, // 宽度
          height: 180, //高度
          customStylesheet: path.join(__dirname, 'app', 'prompt.css'),
        }, win) //指定弹窗在那个窗体显示
        .then(res => {
          log(1,`Prompt window => User input: ${res}`)
          resolve(res)
        })
        .catch(error => {
          log(1,`Open prompt window error: ${error}`)
          resolve(null)
          console.error(error);
      });
  });
}


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
      log(1,'Quit Process!')
      console.log('bye!')
      const pid = sttProcess?.pid;
      if (pid) {
      process?.kill(pid);
      }
      sttProcess?.kill();
      log(5,`Kill stt process!`)
      exec(path.join(app.getPath('temp'),'cruise','killSttProcess.cmd'))
      log(1,`Bye!`)
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





async function readAndSortTitlesByIds() {
  log(1,`Sort every saves.`)
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


ipcMain.on('app-restart', function () {
  log(1,`Restart app with IPC.`)
      app.relaunch()
      clearInterval(taskInterval)
      app.quit()
})

console.log(process.env)
var iconv = require('iconv-lite');
var encoding = 'cp936';
let sttProcess
log(5,`Stt process:${boolean[clientData?.sttp ?? "true"]}(${clientData?.sttp} ${typeof clientData})`,'sttMain')
console.log(`sttp:${boolean[clientData?.sttp ?? "true"]}(${clientData?.sttp} ${typeof clientData})`)
exec(path.join(app.getPath('temp'),'cruise','killSttProcess.cmd'), async () => {
  
  if (boolean[clientData?.sttp ?? "true"]) {
    if (await checkPortAvailable(6301) ) {
      await fs.cp(path.join(__dirname,'sttProcess.exe'), path.join(app.getPath('temp'),'stt','sttProcess.exe'));
      log(5,`Start stt process.`,'sttMain')
      // 启动语音服务
      sttProcess = execFile(`${path.join(app.getPath('temp'),'stt','sttProcess.exe')}`, {
        shell: false, // 在Windows环境运行
        windowsHide: true,
        cwd: path.join(app.getPath('temp'),'stt'),
        stdio: 'pipe',
        encoding: 'buffer',
        env:process.env,
        detached: false
      });

      sttProcess.stdout.on('data', (data) => {
        const line = iconv.decode(data, encoding)
        if (line.includes('[device]')) {        
          const index = line.lastIndexOf("[device]")
          const device = line.substring(index, line.length).replace('[device]','')
          log(5,`Stt device: ${device}`,'sttProcess')
          win.webContents.send('sttProcess',{type:"device",content:device})
        }
        if (line.includes('[connectionDone]')) {
          win.webContents.send('sttProcess',{type:"connection",content:true})
          log(5,`Stt connection done.`,'sttProcess')
        }
        if (line.includes('[error]')) {
          win.webContents.send('sttProcess',{type:"error",content:`出现未知异常！`})
          log(3,`Stt process error.`,'sttProcess')
        }
        if (line.includes('[connectionError]')) {
          win.webContents.send('sttProcess',{type:"connection",content:false})
          log(2,`Stt connection error.`,'sttProcess')
        }
        console.log(line)
      });

    sttProcess.stderr.on('data', (data) => {
      const line = iconv.decode(data, encoding)
      console.log(line)
      log(5,`Stderr: ${line}`,'sttProcess')
    });

    sttProcess.on('close', (code,signal) => {
      console.log(`Child process exited with code ${code} (${signal})`);
      log(5,`Stt process exited with code ${code} (${signal})`,'sttMain')
      win.webContents.send('sttProcess',{type:"failed",content:code})
    });

  } else {
    log(4,`Port 6301 is occupied!`,'sttMain')
    await dialog.showMessageBox(win,{
      message: `端口6301被占用！请尝试关闭残留程序或重启电脑解决问题。`,
      title: "ZERO ERROR",
      type: "error",
      buttons: ["我知道了"]
    })
    app.quit()
  }
}
})

powerMonitor.on('suspend',() => {
  log(4,`System suspend!`,'main')
  app.relaunch()
})

powerMonitor.on('resume',() => {
  log(4,`System resume!`,'main')
  app.quit()
})

  ipcMain.on('taskPush', async (event,object) => {
    log(4,`Push new task by IPC.`,'main')
    let newObject = JSON.parse(object)
    log(4,`Task Object: \n${JSON.stringify(newObject,null,2)}`,'main')
    if (newObject.time) {
      console.log('absolute time')
      tasksArray.push(newObject)
    } else if (newObject.relative) {
      console.log('relative time')
      const timeCount = newObject.relative.timeCount;
      const timeUnit = newObject.relative.timeUnit || "day";
      const time = moment().add(timeCount,timeUnit).format('YYYY-MM-DD HH:mm:ss')
      newObject.time = time
      delete newObject.relative
      tasksArray.push(newObject)
    }
    await fs.writeFile(path.join(app.getPath('userData'), 'tasks.json'), JSON.stringify(tasksArray,null,2), 'utf8')
    console.log(newObject)
    sortEveryTasks(win)
    const notification = new Notification({
      title: `日程创建成功！`,
      body: `${newObject.title} (${newObject.time})`
    });
    notification.show();
  })

 
   ipcMain.on('startStt', async (e) => {
    try {
      log(1,`Start stt process.`,'main')
      var config = {
        method: 'post',
        url: 'http://127.0.0.1:6301/stt/',
        headers: { 
           'Content-Type': 'application/json'
        },
        data: {
           "type": "start",
        },
     };
     axios(config)
     .catch( async (err) => {
      log(4,`Start stt process error: ${err}`,'main')
        await dialog.showMessageBox(win,{
          message: `系统出现问题：${err}`,
          title: "ZERO ERROR",
          type: "warning",
          buttons: ["我知道了"]
        })
        app.quit()
     })
      } catch (error) {
        log(4,`Start stt process error: ${err}`,'main')
        await dialog.showMessageBox(win,{
          message: `系统出现问题：${error}`,
          title: "ZERO ERROR",
          type: "warning",
          buttons: ["我知道了"]
        })
        app.quit()
      }
  })

  ipcMain.on('stopStt', async (e) => {
    try {
      log(1,`Stop stt process.`,'main')
      var config = {
        method: 'post',
        url: 'http://127.0.0.1:6301/stt/',
        headers: { 
           'Content-Type': 'application/json'
        },
        data: {
           "type": "stop",
        },
     };
     axios(config)
        } catch (error) {
          log(4,`Stop stt process error: ${err}`,'main')
        await dialog.showMessageBox(win,{
          message: `系统出现问题：${error}`,
          title: "ZERO ERROR",
          type: "warning",
          buttons: ["我知道了"]
        })
        app.quit()
      }
  })

appserver.post('/stt/', async (req,res) => {
  log(1,`Stt process output: ${req.query.data}`,'sttProcess')
  console.log(req)
  const resultValue = SU.unicode2string(req.query.data);
  console.log(`Reuslt:${resultValue}`)
  win.webContents.send('sttProcess',{type:"result",content:resultValue})
  res.send(true)
})

  if (await checkPortAvailable(6302)) {
  appserver.listen('6302')
  } else {
    log(4,`Port 6302 is occupied!`,'sttMain')
    await dialog.showMessageBox(win,{
      message: `端口6302被占用！请尝试关闭残留程序或重启电脑解决问题。`,
      title: "ZERO ERROR",
      type: "error",
      buttons: ["我知道了"]
    })
    app.quit()
  }




  const SU = {
    string2unicode: (str) => {
      var ret ="";
      var ustr = "";
       
      for(var i=0; i<str.length; i++){
        
        var code = str.charCodeAt(i); 
        var code16 = code.toString(16);
       
        if(code < 0xf){
          ustr = "\\u"+"000"+code16;
        }else if(code < 0xff){
          ustr = "\\u"+"00"+code16;
        }else if(code < 0xfff){
          ustr = "\\u"+"0"+code16;
        }else{
          ustr = "\\u"+code16;
        }	
        ret +=ustr;
        //ret += "\\u" + str.charCodeAt(i).toString(16);	
      }
    },
    unicode2string: (unicode) => {
      return eval("'" + unicode + "'");
  }
  }
  


/**
 * 检查指定端口是否可用。
 *
 * @param {number} port 要检查的端口号。
 * @returns {boolean} 是否可用，如果发生错误则为null
 */
async function checkPortAvailable(port) {
  return new Promise((resolve, reject) => {
    // 默认地址设置为127.0.0.1。根据需要也可以更改或从外部传入。
    const host = '127.0.0.1';
    log(1,`Check port ${host}:${port} status.`, 'checkPortAvailable')
    // 使用portscanner检测指定端口状态。
    portscanner.checkPortStatus(port, host, async (error, status) => {
        if (error) {
          log(4,`Check port ${host}:${port} status error: ${error}`, 'checkPortAvailable')
          await dialog.showMessageBox(win,{
            message: `系统出现问题：${error}`,
            title: "ZERO ERROR",
            type: "warning",
            buttons: ["我知道了"]
          })
          reject(error);
        }

        // 如果状态为'closed'，则表示该端口未被使用且可用。
        if (status === "closed") {
            log(1,`Port ${port} is available.`, 'checkPortAvailable');
            resolve(true)
        } else {
            log(3,`Port ${port} is in use.`, 'checkPortAvailable');
            resolve(false)
        }
    });
  })
}


const taskInterval = setInterval(() => {
  try {
  win.webContents.send('getCruise')
  } catch (e) {
    console.log(e)
  }
}, 1500);

ipcMain.on('returnCruise',async (e,cruise) => {
  if (cruise) {
  const past = getMostRecentPastObject()
    if (past) { 
      log(1,`One past task found.`,main)
    win.webContents.send('pastTask', past);
    const notification = new Notification({
      title: `${past.title}`,
      body: `[日程提醒] ${past.content ?? '这个日程现在被触发！'}`,
      timeoutType: 'never',
      urgency: 'critical'
    });
    notification.show();
    notification.on('click', () => {
      if (!win.isVisible()) {
        win.show()
      }
    })

    tasksArray.splice(tasksArray.indexOf(past), 1);
    await fs.writeFile(path.join(app.getPath('userData'), 'tasks.json'),JSON.stringify(tasksArray,null,2), 'utf8')
 }}
})

ipcMain.on('removeTask', async (e,task) => {
  log(1,`Remove task.`,'main')
  console.log(task)
  tasksArray.splice(task, 1);
  await fs.writeFile(path.join(app.getPath('userData'), 'tasks.json'),JSON.stringify(tasksArray,null,2), 'utf8')
  sortEveryTasks(win)
  const notification = new Notification({
    title: `${past.title}`,
    body: `[删除日程] ${past.content ?? '已经删除成功！'}`,
    urgency: 'normal'
  });
  notification.show();
  notification.on('click', () => {
    if (!win.isVisible()) {
      win.show()
    }
  })
})

ipcMain.on('removeAllTasks', async (e) => {
  log(1,`Remove all tasks.`,'main')
  tasksArray = []
  await fs.writeFile(path.join(app.getPath('userData'), 'tasks.json'),JSON.stringify(tasksArray,null,2), 'utf8')
  const notification = new Notification({
    title: `全部的日程`,
    body: `[日程提醒] '全部日程均已删除成功！'}`,
    urgency: 'normal'
  });
  notification.show();
  notification.on('click', () => {
    if (!win.isVisible()) {
      win.show()
    }
  })
})



ipcMain.handle('getTimeDiff', () => {
  const targetTime = tasksArray[0].time
  return getTimeDiff(targetTime)
})


ipcMain.handle('createNotification', (event,title,content) => {
  log(1,`Create notification with IPC.`, 'main')
  const notification = new Notification({
    title: `${title}`,
    body: `${content}`,
  });
  notification.show();
  notification.on('click', () => {
    if (!win.isVisible()) {
      win.show()
    }
  })
  return notification
})



ipcMain.handle('allTask',() => {
  return tasksArray
})

ipcMain.on('allReady' , () => {
  // 在前端页面加载完毕后，检测一次更新
  {
    let updateTypes = {
      0: 'stable',
      1: 'emergency',
      2: 'special'
    }
  log(1,`Checking update.`,'main')
  axios.get(`${rootUrl || "https://chat.zero-ai.online"}/cruiseVersion`).then((response) => {
  const version = response.data.version
  const type = response.data.type
  console.log(version)
  if (version !== app.getVersion()) {
    log(1,`New version found: ${app.getVersion()} => ${version} (${updateTypes[type]})`,'main')
    win.webContents.send('updateVersion',{version:version,type:updateTypes[type]})
  }
}).catch((e) => {
  console.log(e)
  log(2,`Check update error: ${e}`,'main')
  const notification = new Notification({
    title: `ZERO WARNING`,
    body: `获取更新时出现意外错误。`,
  });
  notification.show();
  notification.on('click', () => {
    if (!win.isVisible()) {
      win.show()
    }
  })
})
  }
if (isFirst) {
  win.webContents.send('first',true)
}
})




})

let tasksArray = []

async function createTasksFile() {
  try {
    log(1,`Create Task File.`)
  tasksFile = await fs.readFile(path.join(app.getPath('userData'), 'tasks.json'),'utf-8')
  console.log(tasksFile)
  tasksArray = JSON.parse(tasksFile)
  console.log('Load Task File')
  if (tasksFile == '{}') {
    tasksArray = []
    await fs.writeFile(path.join(app.getPath('userData'), 'tasks.json'),'[]')
  }
  } catch {
    tasksArray = []
    console.log('Create Task File')
    await fs.writeFile(path.join(app.getPath('userData'), 'tasks.json'),'[]')
  }
}



function generateRandomString(length) {
  log(5,`Generate random string, length: ${length}`)
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}


async function sortEveryTasks(win) {
  try {
    log(1,`Sort every tasks.`)
    tasksArray = JSON.parse(await fs.readFile(path.join(app.getPath('userData'), 'tasks.json'), 'utf8'));
    if (tasksArray.length) {
    // 对象数组根据时间进行排序
    tasksArray.sort((a, b) => {
      // 使用 moment 解析时间字符串，并转换为 Unix 时间戳（毫秒）
      let timeA = moment(a.time, 'YYYY-MM-DD HH:mm:ss').valueOf();
      let timeB = moment(b.time, 'YYYY-MM-DD HH:mm:ss').valueOf();

      return timeA - timeB; // 如果希望最近的时间靠前，则b减a；如果希望最早的时间靠前，则a减b
    });
    console.log(tasksArray)
    win.webContents.send('getTask', tasksArray)
    await fs.writeFile(path.join(app.getPath('userData'), 'tasks.json'),JSON.stringify(tasksArray,null,2), 'utf8')
    return tasksArray
  }
  } catch (error) {
    console.log(error)
  }
}


/**
 * 
 * @returns 返回距最近4秒以内的最近的日程对象，亦或是略过的日程，无则返回null
 */
function getMostRecentPastObject() {

  try {
  let pastObjects = []

  for (i = 0; i < tasksArray.length; i++) {
    if (getTimeDiff(tasksArray[i]?.time) < 5) {
      pastObjects.push(tasksArray[i])
    }
  }
  // 返回最接近当前时刻（数组中第一个）或者null（如果没有任何对象满足要求）
  if (pastObjects.length > 0) {
    return pastObjects[0];
  } else {
    // 如果没有距离现在小于4秒完成的日程，就再检测一遍是否有遗漏略过的日程
    // 获取当前时间
    const now = moment();

    // 过滤出所有已经到点的对象，并按时间降序排序（即最接近当前时间的在前）
    pastObjects = tasksArray.filter(obj => {
      const objTime = moment(obj.time, 'YYYY-MM-DD HH:mm:ss');
      return now.isAfter(objTime); // 当前时间晚于obj中指定的时间
    }).sort((a, b) => {
      return moment(a.time, 'YYYY-MM-DD HH:mm:ss') - moment(b.time, 'YYYY-MM-DD HH:mm:ss');
    });

  // 返回最接近当前时刻（数组中第一个）或者null（如果没有任何对象满足要求）
  return pastObjects.length > 0 ? pastObjects[0]:  null;
  }
} catch (e) {
  console.log(e)
}
}



function getTimeDiff(time) {
// 使用moment创建两个时间对象
if (time) {
let moment1 = moment();
let moment2 = moment(time, "YYYY-MM-DD HH:mm:ss");

// 计算它们之间的差异（以秒为单位）
let diffInSeconds = moment2.diff(moment1, 'seconds');
return diffInSeconds
} else {
  return 0
}

}



async function tryToDownload() {
  try {
    log(1,`Try to download.`,'updater')
    win.webContents.send('downloadProgress', {type:"type",content:true})
    const urls = [
      "https://mirror.ghproxy.com/https://github.com/QWXL/ZERO-CRUISE/releases/latest/download/cruise-full-setup.exe",
      "https://kkgithub.com/QWXL/ZERO-CRUISE/releases/latest/download/cruise-full-setup.exe",
      "https://github.com/QWXL/ZERO-CRUISE/releases/latest/download/cruise-full-setup.exe"
      ]; // 几个下载源
    const url = await performLatencyTest(urls)
    log(1,`Get new version url: ${url}`,'updater')
    if (url) {
    fs.unlink(path.join(app.getPath('temp'),'cruiseInstaller','full-setup.exe')).then(() => {
      downloadFile(url,path.join(app.getPath('temp'),'cruiseInstaller','full-setup.exe'))
    }).catch(() => {
      downloadFile(url,path.join(app.getPath('temp'),'cruiseInstaller','full-setup.exe'))
    })
  } else {
    log(4,`Cannot conect to network.`,'updater')
    await dialog.showMessageBox(null,{
      message: `无法连接到网络，请检查网络连接！`,
      title: "ZERO ERROR",
      type: "error",
      buttons: ["我知道了"]
    })
    app.quit()
  }
} catch (e) {
  console.log(e)
  log(4,`Cannot update: ${e}`,'updater')
  await dialog.showMessageBox(null,{
    message: `尝试内置更新时出现问题：${e}。\n（如问题反复，请使用最新版本的巡航客户端安装器。）`,
    title: "ZERO ERROR",
    type: "error",
    buttons: ["我知道了"]
  })
  app.quit()
}
}

async function performLatencyTest(urls) {
  let urlResults = []
  return new Promise(async (resolve, reject) => {
    
  for (let url of urls) {
    let urlObject = new URL(url)
    let host = urlObject.host
    let result = null
    try {
    result = await measureLatency(host);
    result.original = url
    } catch (e) {
      log(3,`Test ${host} had an error.`,'performLatencyTest');
    }
    if(result){
        log(5,`Test url: ${host}, speed: 1MB/${result.speed}s `);
        urlResults.push(result)
   }
 }
 if (urlResults.length !== 0) {
 urlResults.sort((a, b) => a.speed - b.speed);
 log(1,`Best url: ${urlResults[0]?.url}, speed: 1MB/${urlResults[0]?.speed}s.`)
 resolve(urlResults[0].original)
 } else {
  console.log(`All urls had an error.`);
  reject()
 }
})
}


function measureLatency(url) {
  return new Promise(async (resolve, reject) => {
  try {
    let testUrl
    switch (url) {
      case 'mirror.ghproxy.com':
        testUrl = `https://mirror.ghproxy.com/https://raw.githubusercontent.com/QWXL/ZERO-CRUISE/global/Surveying`
        break;
      case 'kkgithub.com': 
        testUrl = `https://raw.kkgithub.com/QWXL/ZERO-CRUISE/global/Surveying`
        break;
      case 'github.com': 
        testUrl = `https://raw.githubusercontent.com/QWXL/ZERO-CRUISE/global/Surveying`
        break
      default:
        reject()
        log(3,`It appears to provide an invalid Host: ${url}`)
        break;
    }
    if (testUrl) {
      const startTime = Date.now();
      let config = {
        method: 'get',
        url: testUrl,
        headers: { 
           'Content-Type': 'application/json',
           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
        },
        timeout: 30000 // 30s
    }
      axios(config)
      .then((response) => {
        const endTime = Date.now();
        const formattedTimeDiff = ((endTime - startTime) / 1000).toFixed(2);
        resolve({
          url: url,
          speed: formattedTimeDiff,
          status: response.statusCode
        });
      })
      .catch((e) => {
        console.log(`Test ${url} had an error: ${e}`);
        reject()
      })
    }
  
  }catch (e){
    console.log(e)
    console.log(`Test ${url} had an error.`)
  }
  })
  }

  const electronDl = require('electron-dl');
  // 下载文件
  electronDl({
    onProgress: status => console.log(status.percent) // 这里将打印出百分比形式的下载进度
  });

  /** `downloadFile`函数用于发起一个可追踪的下载
   * @param {string} url 下载地址
   * @param {string?} downloadPath 保存路径，如果为空则显示一个界面由用户选择
   * @returns 这个函数不具有任何显式返回
  **/
async function downloadFile(url, downloadPath) {
    try {
    console.log(`Start download!`)
    log(1,`Start download.`)
    fs.cp(path.join(__dirname,'executeUpdate.cmd'), path.join(app.getPath('temp'),'cruiseInstaller','executeUpdate.cmd'))
    let options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
      }
    }
    log(5,`Download url: ${url}`)
    win.webContents.downloadURL(url,options);
    log(5,`Download headers: ${JSON.stringify(options.headers)}`)
    win.webContents.session.on('will-download', (event, item) => {
      const startTime = Date.now();
      let lastReceivedBytes = 0;
      if(downloadPath){
        item.setSavePath(downloadPath); // 如果指定了路径，则设置保存路径
        log(5,`Download path: ${downloadPath}`,'downloadFile')
      }

      const totalBytes = item.getTotalBytes() || 157286400; // 如果读取不到具体的文件大小，则使用一个估值（150Mb）
      log(5,`File size: ${totalBytes}Bytes.`,'downloadFile')
      item.on('updated', (event, state) => {
        if (state === 'progressing') {
          let progressPercent = ((item.getReceivedBytes() / totalBytes)*100).toFixed(2);
          win.setProgressBar((item.getReceivedBytes() / totalBytes))
          log(5,`Download progress: ${progressPercent}%.`,'downloadFile')
          win.webContents.send('downloadProgress', {type:"progress",content:progressPercent})
        }
        if (state === 'interrupted') {
          log(2,'Download interrupted.','downloadFile');
          win.webContents.send('downloadProgress', {type:"text",content:`Resume`})
          item.resume()
        }
        if (!item.isPaused()) {
          const receivedBytes = item.getReceivedBytes();
           const currentTime = Date.now();

           // 计算从上一次更新到现在所用的时间（秒）
           const timeDiffInSeconds = (currentTime - startTime) / 1000;

           // 如果有必要，也可以将此值累加以获得总平均速度

           // 计算当前瞬时下载速度（每秒字节）
           let speedBps;

            if(timeDiffInSeconds > 0){
                speedBps= (((receivedBytes-lastReceivedBytes)/timeDiffInSeconds)/1024).toFixed(2);
                log(5,`Current download speed: ${speedBps} KB/s`,'downloadFile')
                win.webContents.send('downloadProgress', {type:"speed",content:speedBps})
               lastReceivedBytes=receivedBytes;
            }
        } else {
          win.webContents.send('downloadProgress', {type:"text",content:`Hold`})
          log(2,`Download Paused!`,'downloadFile')
        }
      });

      item.once('done', async (event, state) => {
        if(state === 'completed'){
           win.webContents.send('downloadProgress', {type:"done",content:true})
          const notification = new Notification({
            title: `ZERO CRUISE`,
            body: `安装包已下载完毕。`
          })
          win.setProgressBar(1,{mode:'error'})
          notification.show()
          notification.on('click', () => {
            win.show()
            })
          ipcMain.on('closeAndUpdate', () => {
              closeAndUpdate();
          })
          log(1,`Download completed.`,'downloadFile')
         } else {
           log(4,`Download failed: ${state}.`,'downloadFile')
           win.webContents.send('downloadProgress', {type:"failed",content:state})
           win.setProgressBar(1,{mode:'error'})
           await dialog.showMessageBox(null,{
            message: `下载更新文件时出现问题：${state}`,
            title: "ZERO ERROR",
            type: "error",
            buttons: ["我知道了"]
          })
          app.quit()
         }
         const endTime = Date.now();
         const formattedTimeDiff = ((endTime - startTime) / 1000).toFixed(2);
         win.webContents.send('downloadProgress', {type:"useTime",content:formattedTimeDiff})
         log(1,`Download completed. (${formattedTimeDiff}s)`,'downloadFile')
       });
    });
  } catch (e) {
    log(4,`Download failed: ${e}.`,'downloadFile')
    win.setProgressBar(1,{mode:'error'})
    await dialog.showMessageBox(null,{
      message: `下载更新文件时出现问题：${e}`,
      title: "ZERO ERROR",
      type: "error",
      buttons: ["我知道了"]
    })
    app.quit()

  }
  }


  function closeAndUpdate() {
    log(1,`Close and update.`)
       spawn(`${path.join(app.getPath('temp'),'cruiseInstaller','executeUpdate.cmd')}`, {
        shell: true, // 在Windows环境运行
        windowsHide: true,
        cwd: path.join(app.getPath('temp'),'cruiseInstaller'),
        encoding: 'buffer',
        env:process.env,
        detached: true, // 使安装脚本在安装程序关闭后仍能保持运行
        stdio: 'ignore'
       });
       app.quit()
    
  }



  ipcMain.on('tryToUpdate', () => {
    log(1,`Try to update by IPC.`,'updater')
    tryToDownload()
  }) 


  function createCode() {
    return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r:  (r&0x3|0x8);
        return v.toString(16);
    });
 }
 

process.on('uncaughtException',async (err,origin) => {
  const randomId = `process-crash-report-${createCode()}`
  log(4,`————————————————————————————————————`,'uncaughtException');
  log(4,`uncaughtException: ${err}`,'uncaughtException');
  log(4,`at: [${getCallerFunctionDetail()}]`,'uncaughtException');
  log(4,`do: ${err.stack}`,'uncaughtException')
  log(4,`on: ${origin}`,'uncaughtException');
  log(4,`at: ${getTime()}`,'uncaughtException');
  log(4,`version: ${app.getVersion()}`,'uncaughtException');
  log(4,`————————————————————————————————————`,'uncaughtException');
  log(4,`Crash report saved at: ${path.join(app.getPath('userData'),`${randomId}.txt`)}`,'uncaughtException');
  createCrashReport(err,origin,getCallerFunctionDetail(),randomId).then(async () => {
  log(4,`Stop process with code 1.`,'uncaughtException')
  await dialog.showMessageBox(null,{
    message: `出现致命错误：${err}\n错误报告已保存至：${path.join(app.getPath('userData'),`${randomId}.txt`)}\n请联系开发者！`,
    title: "ZERO ERROR",
    type: "error",
    buttons: ["我知道了","定位至错误报告"]
  }).then(({response}) => {
    if (response) {
      shell.showItemInFolder(path.join(app.getPath('userData'),`${randomId}.txt`))
    }
    app.quit()
  })
  })
/**
* 函数“createCrashReport”是一个异步函数，用于创建包含各种详细信息（例如错误消息、来源、调用者、日志和版本）的崩溃报告。
* @param err - 发生的错误。
* @param origin - origin 参数表示崩溃的位置或来源。它可能是发生崩溃的特定功能、模块或组件。
* @param caller - “caller”参数是遇到错误的函数或方法的名称或标识符。
* @param rid - `rid` 参数代表“报告 ID”。它是崩溃报告的唯一标识符。
* @returns 一个最终变为 true 的 Promise。
*/
  async function createCrashReport(err,origin,caller,rid) {
     return new Promise(async (res) => {
     let string = `
     Powered By QWXL
     ____________ _____   ____             _____ 
    |___  /  ____|  __ \\ / __ \\      /\\   |_   _|
       / /| |__  | |__) | |  | |    /  \\    | |  
      / / |  __| |  _  /| |  | |   / /\\ \\   | |  
     / /__| |____| | \\ \\| |__| |  / ____ \\ _| |_ 
    /_____|______|_|  \\_\\\\____/  /_/    \\_\\_____|
    
     Cruise CRASH! VERSION:${app.getVersion()}
  // Don't be sad! Is not some big problem!
     
  All Process Runtime:
    - StartCode: ${startCode};
    - RunTicks: ${tickLogs.length} (${tickLogs.length / 4}s);
    - UserId: ${clientData?.id || '/First Start/'}

  ERR:${err}:
    - at:${caller};
    - do:${err.stack};
    - on:${origin};
    - at:${getTime()};
    - by:${getCallerFunctionDetail()};
   Cruise Version: ${app.getVersion()};
     `
     await fs.writeFile(path.join(app.getPath('userData'),`${randomId}.txt`),string)
        res(true)
  })}
});


/* 这段上面的代码为 Node.js 应用程序中未处理的 Promise 拒绝设置一个事件侦听器。当 Promise 被拒绝并且没有相应的 catch
块来处理拒绝时，将触发此事件侦听器。它记录被拒绝的承诺的详细信息以及拒绝的原因。它还提供了针对拒绝采取任何必要行动的机会。 */
process.on('unhandledRejection', (reason, promise) => {
  log(3,`[${getCallerFunctionDetail()}]Promise Rejected: ${promise} Reason: ${reason}`,'unhandledRejection');
  log(3,`${JSON.stringify(promise)}`,'unhandledRejection')
  // 在这里执行相应操作。
});




app.on('quit', (event, code) => {
  log(1,`Quit with code: ${code}`,'main')
  log(1,`Exit at ${getTime()}`,'main')
})