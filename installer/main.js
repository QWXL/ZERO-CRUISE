/*
 * @Author: 秋晚夕落 qwxl@zero-ai.online
 * @Date: 2024-02-20 19:46:14
 * @LastEditors: 秋晚夕落 qwxl@zero-ai.online
 * @LastEditTime: 2024-03-23 21:53:55
 * @FilePath: \installer\main.js
 */
const { app, BrowserWindow, ipcMain, dialog, Notification, shell } = require('electron')
const path = require('path')
const electronDl = require('electron-dl');
const { spawn,exec } = require('child_process')
const processNode = require('node:process');
const fs = require('fs/promises');
const axios = require('axios');
let downloaded = false;
app.setPath('sessionData',path.join(app.getPath('temp'),'cruiseInstaller'))  
fs.cp(path.join(__dirname,'autoUninstall.cmd'), path.join(app.getPath('temp'),'cruiseInstaller','autoUninstall.cmd'));
if (require('electron-squirrel-startup')) app.quit();
let logs = [
    `[${getTime()} | INFO | Preload | Preload] Starting up... [Preload]`,
    `[${getTime()} | INFO | Preload | Preload] Installer version: ${app.getVersion()}`,
    `[${getTime()} | INFO | Preload | Preload] Loading Module: electron`,
    `[${getTime()} | INFO | Preload | Preload] Loading Module: path`,
    `[${getTime()} | INFO | Preload | Preload] Loading Module: electron-dl`,
    `[${getTime()} | INFO | Preload | Preload] Loading Module: node:process`,
    `[${getTime()} | INFO | Preload | Preload] Loading Module: fs/promises`,
    `[${getTime()} | INFO | Preload | Preload] Loading Module: axios`,
]

// 检查目录是否存在的函数
function checkDirectoryExists(directoryPath) {
  return new Promise(async (resolve, reject) => {
    
  // 尝试访问目录路径
  await fs.access(directoryPath, fs.constants.F_OK, (error) => {
    if (error) {
      resolve(false);
    } else {
      resolve(true);
    }
  });
})
}


function killProcess(executableName) {
 return new Promise((resolve, reject) => {
    
// Windows: 使用taskkill根据映像(即可执行程序)名称结束任务。
exec(`taskkill /im "${executableName}" /f`, (error, stdout, stderr) => {
  if(error){
     log(2,`Kill ${executableName} was failded.`)
     resolve(false);
     return
   }

   if(stderr){
     log(2,`Kill ${executableName} was failed.`)
     resolve(false);
     return
   }

   console.log(stdout);
   log(1,`Kill ${executableName} was done.`)
   resolve(true);
});
})

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
 */
function log(level,message,from) {
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
   console.log(log)
   logs.push(log)
   saveLogs()

}

function saveLogs() {
  try {
    fs.writeFile(path.join(app.getPath('home'),'cruise-installer-newest.log'), logs.join('\n'))
  } catch (error) {
    dialog.showMessageBox(null,{
      message: `记录日志文件时出现问题：${error}\n这个问题看起来并不致命，安装程序将继续运行。`,
      title: "ZERO INSTALL ERROR",
      type: "warning",
      buttons: ["我知道了"]
    })
  }
}
async function checkOtherVersion() {
let otherVersionFile = await checkDirectoryExists(path.join(app.getPath('home'),'AppData','Local','cruise_client'))
log(1,`Check Other version of ZERO Cruise... (${path.join(app.getPath('home'),'AppData','Local','cruise_client')})`)
if (otherVersionFile) {
  log(1,`Other version of ZERO Cruise was found.`,'Check')
  await killProcess('sttProcess.exe')
  await killProcess('stt_process.exe')
  await killProcess('ZERO Cruise.exe')
  await fs.rm(path.join(app.getPath('home'),'AppData','Local','cruise_client'), { recursive: true, force: true }, async (error) => {
    log(3,`Try to delete Other version app, but error: ${error}.`,'Check')
  })
  log(1,`Other version of ZERO Cruise (${path.join(app.getPath('home'),'AppData','Local','cruise_client')}) was deleted.`,'Check')
}
}

checkOtherVersion()


const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        backgroundColor: "rgb(27,27,29)",
        resizable: false,
        fullscreen: false,
        alwaysOnTop: true,
        fullscreenable: false,
        maximizable: false,
        frame: false,
        darkTheme: true,
        title: "ZERO CRUISE INSTALLER",
        icon: path.join(__dirname, 'app', 'favicon.ico'),
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        }
    })
  
    win.loadFile(path.join(__dirname,'installerApp','index.html'))
    log(1,`Create user window: ready.`,'createWindow')
    win.once('ready-to-show', () => {
        win.show()
        log(1,`Create user window: show it.`,'createWindow')
        
      })    
    return win
  }

  app.whenReady().then(() => {
    log(1,`App ready.`,'main')
    const win = createWindow()
    if (!app.isPackaged) {
        win.webContents.openDevTools()
    }
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })


  ipcMain.on('minisize', () => {
    win.minimize()
  })


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
    log(1,`Start download!`,'Download')
    let options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
      }
    }
    log(1,`Download url: ${url}`,'Download')
    win.webContents.downloadURL(url,options);
    log(1,`Download headers: ${options.headers}`,'Download')
    win.webContents.session.on('will-download', (event, item) => {
      const startTime = Date.now();
      let lastReceivedBytes = 0;
      if(downloadPath){
        item.setSavePath(downloadPath); // 如果指定了路径，则设置保存路径
        log(1,`Download path: ${downloadPath}`,'Download')
      }

      const totalBytes = item.getTotalBytes() || 157286400; // 如果读取不到具体的文件大小，则使用一个估值（150Mb）
      log(1,`File size: ${totalBytes}Bytes.`,'Download')
      item.on('updated', (event, state) => {
        if (state === 'progressing') {
          let progressPercent = ((item.getReceivedBytes() / totalBytes)*100).toFixed(2);
          win.setProgressBar((item.getReceivedBytes() / totalBytes))
          log(1,`Download progress: ${progressPercent}%.`,'Download')
          win.webContents.send('downloadProgress', {type:"progress",content:progressPercent})
        }
        if (state === 'interrupted') {
          console.log('Download interrupted');
          log(2,`Resumes the download that has been paused.`,'Download')
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
                log(1,`Current download speed: ${speedBps} KB/s`,'Download')
                win.webContents.send('downloadProgress', {type:"speed",content:speedBps})
               lastReceivedBytes=receivedBytes;
            }
        } else {
          win.webContents.send('downloadProgress', {type:"text",content:`Hold`})
          log(2,`Download Paused!`,'Download')
        }
      });

      item.once('done', async (event, state) => {
        if(state === 'completed'){
           win.webContents.send('downloadProgress', {type:"done",content:true})
          downloaded = true;
          console.log(downloaded)
          const notification = new Notification({
            title: `ZERO CRUISE INSTALLER`,
            body: `全部准备操作均已完成！`
          })
          win.setProgressBar(1,{mode:'error'})
          notification.show()
          notification.on('click', () => {
            win.restore()
            })
         } else {
           console.error(`Download failed: ${state}`)
           log(4,`Download failed: ${state}.`,'Download')
           win.webContents.send('downloadProgress', {type:"failed",content:state})
           win.setProgressBar(1,{mode:'error'})
           await dialog.showMessageBox(null,{
            message: `下载文件时出现问题：${state}`,
            title: "ZERO ERROR",
            type: "error",
            buttons: ["我知道了"]
          })
          app.quit()
         }
         const endTime = Date.now();
         const formattedTimeDiff = ((endTime - startTime) / 1000).toFixed(2);
         win.webContents.send('downloadProgress', {type:"useTime",content:formattedTimeDiff})
         log(1,`Download completed. (${formattedTimeDiff}s)`,'Download')
       });
    });
  } catch (e) {
    log(4,`Download failed: ${e}.`,'Download')
    win.setProgressBar(1,{mode:'error'})
    await dialog.showMessageBox(null,{
      message: `下载文件时出现问题：${e}`,
      title: "ZERO ERROR",
      type: "error",
      buttons: ["我知道了"]
    })
    app.quit()

  }
  }

  win.on('restore',() => {
    win.setProgressBar(-1,{mode:'none'})
  })

  win.on('focus',() => {
    win.setProgressBar(-1,{mode:'none'})
  })
  ipcMain.on('startDownload', async () => {
    log(1,`Download signal received.`,'Download')
    win.webContents.send('downloadProgress', {type:"text",content:`Starting...`})
    const urls = ['https://mirror.ghproxy.com/https://github.com/QWXL/ZERO-CRUISE/releases/latest/download/cruise-full-setup.exe', 'https://kkgithub.com/QWXL/ZERO-CRUISE/releases/latest/download/cruise-full-setup.exe', 'https://github.com/QWXL/ZERO-CRUISE/releases/latest/download/cruise-full-setup.exe']; // 几个下载源
    log(1,`Test download source.`,'Download')
    const url = await performLatencyTest(urls)
    if (url) {
    fs.unlink(path.join(app.getPath('temp'),'cruiseInstaller','full-setup.exe')).then(() => {
      downloadFile(url,path.join(app.getPath('temp'),'cruiseInstaller','full-setup.exe'))
    }).catch(() => {
      downloadFile(url,path.join(app.getPath('temp'),'cruiseInstaller','full-setup.exe'))
    })
  } else {
    log(4,`Cannot link to website.`)
    await dialog.showMessageBox(null,{
      message: `无法连接到网络，请检查网络连接！`,
      title: "ZERO ERROR",
      type: "error",
      buttons: ["我知道了"]
    })
    app.quit()
  }
  })


  ipcMain.on('startFullexe', () => {
    if (downloaded) startFullexe();
  })

})





async function startFullexe() {
  log(1,`Starting full-setup.exe.`,'main')
  spawn(`${path.join(app.getPath('temp'),'cruiseInstaller','full-setup.exe')}`, {
    shell: true, // 在Windows环境运行
    windowsHide: true,
    cwd: path.join(app.getPath('temp'),'cruiseInstaller'),
    encoding: 'buffer',
    env:processNode.env,
    detached: true, // 使完整程序在安装程序关闭后仍能保持运行
    stdio: 'ignore'
   });
   log(1,`Uninstal oneself.`,'main')
   spawn(`${path.join(app.getPath('temp'),'cruiseInstaller','autoUninstall.cmd')}`, {
    shell: true, // 在Windows环境运行
    windowsHide: true,
    cwd: path.join(app.getPath('temp'),'cruiseInstaller'),
    encoding: 'buffer',
    env:processNode.env,
    detached: true, // 使清理脚本在安装程序关闭后仍能保持运行
    stdio: 'ignore'
   });
   app.quit()
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
      log(3,`It appears to provide an invalid Host: ${url}`,'measureLatency')
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
      log(3,`Test ${url} had an error: ${e}`,'measureLatency');
      reject()
    })
  }

}catch (e){
  console.log(e)
  log(3,`Test ${url} had an error.`,'measureLatency')
}
})
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
        log(5,`Test url: ${host}, speed: 1MB/${result.speed}s `,'performLatencyTest');
        urlResults.push(result)
   }
 }
 if (urlResults.length !== 0) {
 urlResults.sort((a, b) => a.speed - b.speed);
 log(1,`Best url: ${urlResults[0]?.url}, speed: 1MB/${urlResults[0]?.speed}s.`,'performLatencyTest')
 resolve(urlResults[0].original)
 } else {
  log(3,`All urls had an error.`,'performLatencyTest');
  reject()
 }
})
}


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



process.on('uncaughtException',async (err,origin) => {
  const randomId = `installer-crash-report-${createCode()}`
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
  log(4,`Stop process.`,'uncaughtException')
  await dialog.showMessageBox(null,{
    message: `出现致命错误：${err}\n错误报告已保存至：${path.join(app.getPath('userData'),`${randomId}.txt`)}\n请联系开发者！`,
    title: "ZERO INSTALL ERROR",
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
    
     Installer CRASH! VERSION:${app.getVersion()}
  // Don't be sad! Is not some big problem!
     
  ERR:${err}:
   - at:${caller};
   - do:${err.stack};
   - on:${origin};
   - at:${getTime()};
   - by:${getCallerFunctionDetail()}
   Installer Version: ${app.getVersion()};
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




function createCode() {
  return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}


app.on('quit', (event, code) => {
  log(1,`Quit with code: ${code}`,'main')
  log(1,`Exit at ${getTime()}`,'main')
})