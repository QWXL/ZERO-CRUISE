/*
 * @Author: QWXL@zero-ai.online
 * @Date: 2024-01-31 23:36:03
 * @LastEditors: 秋晚夕落 qwxl@zero-ai.online
 * @LastEditTime: 2024-03-08 18:34:08
 * @FilePath: \cruise-client\main.js
 */
const electron = require('electron');
const { app, BrowserWindow, globalShortcut, Tray, Menu, nativeImage, Notification, ipcMain, safeStorage, process, screen, shell, dialog, autoUpdater   } = electron
const processNode = require('node:process');
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
const rootUrlStore = new Store({
  name: 'rootUrl',
  fileExtension: 'zero',
  schema:{
    data:{
    type:"string",
    default:''
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

fs.cp(path.join(__dirname,'killSttProcess.cmd'), path.join(app.getPath('temp'),'cruise','killSttProcess.cmd'));
exec(path.join(app.getPath('temp'),'cruise','killSttProcess.cmd'))

async function checkDirectoryExists(directoryPath) { // 检查存档目录是否存在
  try {
      await fs.access(directoryPath); // 如果存在，就什么也不做
  } catch (error) {
      if (error.code === 'ENOENT') {
          // 如果报这个错误就代表目录不存在，创建它
        await fs.mkdir(directoryPath)
      } else {
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
  const mainLogo = nativeImage.createFromPath('./favicon.png')
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
      icon: mainLogo,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    });
  
    win.loadFile(path.join(__dirname, 'app', 'index.html'))
    win.once('ready-to-show', () => {
      win.show()
      sortEveryTasks(win)
    })    
    global.win = win
    window = win
    win.setSkipTaskbar(true)
    return win
  }
  

  app.disableHardwareAcceleration() // 关闭硬件加速 避免在集显电脑上无法渲染界面
  app.commandLine.appendSwitch('lang', 'zh-CN')
  app.whenReady().then(async () => {
    let win = createMainWindow()
    if (!app.isPackaged) {
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
        type : 'checkbox',
        label: '开机启动',
        checked : app.getLoginItemSettings().openAtLogin,
        click : function () {
            app.setLoginItemSettings({
              openAtLogin: !app.getLoginItemSettings().openAtLogin,
              path: app.getPath('exe')
            })
          
          console.log(app.getLoginItemSettings().openAtLogin)
          console.log(!app.isPackaged);
  
        }
      },
      { label: '退出程序', type: 'normal', role: "quit"     },
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
        clearInterval(taskInterval)
        app.quit()
      }) 

      ipcMain.on('hideWindow', () => {
        win.hide()
      })
      ipcMain.on('saveFile', async (e,fileName,fileData,oldName,noDelOld) => {
        try {
          console.log(fileData)  
          console.log(`${oldName},${noDelOld}`)
        await fs.writeFile(path.join(savesPath,fileName),JSON.stringify(fileData,null,2))
        if (oldName && !noDelOld) {
          console.log(`del old file: ${oldName}`)
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

      ipcMain.handle('systemInfo', async () => {
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

      const data = store.get('data')
      if (data?.data) {
      clientData = JSON.parse(safeStorage.decryptString(Buffer.from(data?.data))) 
      } else {
        clientData = null
      }
      const rootUrl = rootUrlStore.get('data')
      if (rootUrl) {
        clientData[`root_url`] = rootUrl
      }
      console.log(clientData)
      if (clientData) {
        win.webContents.send('localData',clientData,app.isPackaged ? app.getVersion() : `[unPackaged] ${app.getVersion()}`)
      } else {
        win.webContents.send('localData',"{}",app.isPackaged ? app.getVersion() : `[unPackaged] ${app.getVersion()}`)
        win.webContents.send('first',true)
        const shortcuts = require("windows-shortcuts"); 
        shortcuts.create(path.join(app.getPath('appData'),'Microsoft','Windows','Start Menu','Programs','ZERO CRUISE.lnk'),{
          target: app.getPath('exe')
        }, function(err) {
          if (err)
              throw Error(err);
          else
              console.log("Shortcut created!");
      }
        )
        console.log(path.join(app.getPath('appData'),'Microsoft','Windows','Start Menu','Programs','ZERO CRUISE.lnk'))
      }
      
      ipcMain.on('quitAndInstall', () => {
        autoUpdater.quitAndInstall()
        
      })
      
      /**
      * 显示指定标题和内容的弹窗
      * @param {everything} event 仅做兼容性保留 `已弃用`
      * @param {string} title 标题
      * @param {string} content 默认填写的内容
      * @returns {Promise} 输入框输入的内容
      */
      function windowPrompt(event, title, content) {
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
          resolve(res)
        })
        .catch(error => {
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
      console.log('bye!')
      const pid = sttProcess?.pid;
      if (pid) {
      processNode?.kill(pid);
      }
      sttProcess?.kill();
      exec(path.join(app.getPath('temp'),'cruise','killSttProcess.cmd'))
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
      app.relaunch()
      clearInterval(taskInterval)
      app.quit()
})

console.log(processNode.env)
var iconv = require('iconv-lite');
var encoding = 'cp936';
let sttProcess
console.log(`sttp:${boolean[clientData?.sttp ?? "true"]}(${clientData?.sttp} ${typeof clientData})`)
if (boolean[clientData?.sttp ?? "true"]) {
  if (await checkPortAvailable(6301) ) {
    await fs.cp(path.join(__dirname,'stt_process.exe'), path.join(app.getPath('temp'),'stt','stt_process.exe'));
    // 启动语音服务
    sttProcess = execFile(`${path.join(app.getPath('temp'),'stt','stt_process.exe')}`, {
      shell: true, // 在Windows环境运行
      windowsHide: true,
      cwd: path.join(app.getPath('temp'),'stt'),
      stdio: 'pipe',
      encoding: 'buffer',
      env:processNode.env,
      detached: false
      });

    sttProcess.stdout.on('data', (data) => {
      const line = iconv.decode(data, encoding)
      if (line.includes('[device]')) {        
        const index = line.lastIndexOf("[device]")
        const device = line.substring(index, line.length).replace('[device]','')
        win.webContents.send('sttProcess',{type:"device",content:device})
      }
      if (line.includes('[connectionDone]')) {
        win.webContents.send('sttProcess',{type:"connection",content:true})
      }
      if (line.includes('[error]')) {
        win.webContents.send('sttProcess',{type:"error",content:`出现未知异常！`})
      }
      if (line.includes('[connectionError]')) {
        win.webContents.send('sttProcess',{type:"connection",content:false})
      }
      console.log(line)
    });

   sttProcess.stderr.on('data', (data) => {
    const line = iconv.decode(data, encoding)
    console.log(line)
  });

   sttProcess.on('close', (code,signal) => {
     console.log(`Child process exited with code ${code} (${signal})`);
     win.webContents.send('sttProcess',{type:"failed",content:code})
   });

  } else {
    dialog.showMessageBox(win,{
      message: `端口6301被占用！请尝试关闭残留程序或重启电脑解决问题。`,
      title: "ZERO ERROR",
      type: "error",
      buttons: ["我知道了"]
    })
  }
  
}

  ipcMain.on('taskPush', async (event,object) => {
    let newObject = JSON.parse(object)
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
    sortEveryTasks()
    const notification = new Notification({
      title: `日程创建成功！`,
      body: `${newObject.title} (${newObject.time})`
    });
    notification.show();
  })

 
   ipcMain.on('startStt', async (e) => {
    try {
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
     .catch((err) => {
        dialog.showMessageBox(win,{
          message: `系统出现问题：${err}`,
          title: "ZERO ERROR",
          type: "warning",
          buttons: ["我知道了"]
        })
     })
      } catch (error) {
        dialog.showMessageBox(win,{
          message: `系统出现问题：${error}`,
          title: "ZERO ERROR",
          type: "warning",
          buttons: ["我知道了"]
        })
      }
  })

  ipcMain.on('stopStt', async (e) => {
    try {
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
        dialog.showMessageBox(win,{
          message: `系统出现问题：${error}`,
          title: "ZERO ERROR",
          type: "warning",
          buttons: ["我知道了"]
        })
      }
  })

appserver.post('/stt/', async (req,res) => {
  console.log(req)
  const resultValue = unicode2string(req.query.data);
  console.log(`Reuslt:${resultValue}`)
  win.webContents.send('sttProcess',{type:"result",content:resultValue})
  res.send(true)
})

  if (await checkPortAvailable(6302)) {
  appserver.listen('6302')
  } else {
    dialog.showMessageBox(win,{
      message: `端口6302被占用！请尝试关闭残留程序或重启电脑解决问题。`,
      title: "ZERO ERROR",
      type: "error",
      buttons: ["我知道了"]
    })
  }


  
function string2unicode(str){
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
} 
function unicode2string(unicode){
    return eval("'" + unicode + "'");
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

    // 使用portscanner检测指定端口状态。
    portscanner.checkPortStatus(port, host, (error, status) => {
        if (error) {
          dialog.showMessageBox(win,{
            message: `系统出现问题：${error}`,
            title: "ZERO ERROR",
            type: "warning",
            buttons: ["我知道了"]
          })
            reject(error);
        }

        // 如果状态为'closed'，则表示该端口未被使用且可用。
        if (status === "closed") {
            console.log(`Port ${port} is available.`);
            resolve(true)
        } else {
            console.log(`Port ${port} is in use.`);
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

ipcMain.handle('allTask',() => {
  return tasksArray
})

ipcMain.handle('getTimeDiff', () => {
  const targetTime = tasksArray[0].time
  return getTimeDiff(targetTime)
})

})



function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}

let tasksArray = []

async function sortEveryTasks(win) {
  try {
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
    window.webContents.send('getTask', tasksArray)
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
  // 获取当前时间

  let pastObjects = []

  for (i = 0; i < tasksArray.length; i++) {
    if (getTimeDiff(tasksArray[i].time) < 5) {
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
  return pastObjects.length > 0 ? pastObjects[0] : null;
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

