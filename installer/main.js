/*
 * @Author: 秋晚夕落 qwxl@zero-ai.online
 * @Date: 2024-02-20 19:46:14
 * @LastEditors: 秋晚夕落 qwxl@zero-ai.online
 * @LastEditTime: 2024-03-02 21:05:55
 * @FilePath: \installer\main.js
 */
const { app, BrowserWindow, ipcMain, dialog, Notification  } = require('electron')
const path = require('path')
const electronDl = require('electron-dl');
const { spawn } = require('child_process')
const processNode = require('node:process');
const fs = require('fs/promises');
let downloaded = false;
app.setPath('appData',path.join(app.getPath('temp'),'cruiseInstaller'))  
app.setPath('sessionData',path.join(app.getPath('temp'),'cruiseInstaller'))  
fs.cp(path.join(__dirname,'autoUninstall.cmd'), path.join(app.getPath('temp'),'cruiseInstaller','autoUninstall.cmd'));
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
  
    win.loadFile(path.join(__dirname,'app','index.html'))
    win.once('ready-to-show', () => {
        win.show()
      })    
    return win
  }

  app.whenReady().then(() => {
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
  function downloadFile(url, downloadPath) {
    let options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
      }
    }
    win.webContents.downloadURL(url,options);
    win.webContents.session.on('will-download', (event, item) => {
      const startTime = Date.now();
      let lastReceivedBytes = 0;
      if(downloadPath){
        item.setSavePath(downloadPath); // 如果指定了路径，则设置保存路径
      }

      const totalBytes = item.getTotalBytes() || 157286400; // 如果读取不到具体的文件大小，则使用一个估值（150Mb）

      item.on('updated', (event, state) => {
        if (state === 'progressing') {
          let progressPercent = ((item.getReceivedBytes() / totalBytes)*100).toFixed(2);
          win.setProgressBar((item.getReceivedBytes() / totalBytes))
          console.log(`Download Progress: ${progressPercent}%`);
          win.webContents.send('downloadProgress', {type:"progress",content:progressPercent})
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
                console.log(`Current Download Speed: ${speedBps} KB/s`);
                win.webContents.send('downloadProgress', {type:"speed",content:speedBps})
               lastReceivedBytes=receivedBytes;
            }
        }
      });

      item.once('done', async (event, state) => {
        if(state === 'completed'){
           console.log("Download Completed");
           win.webContents.send('downloadProgress', {type:"done",content:true})
          downloaded = true;
          console.log("Download Completed")
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
         }else{
           console.error(`Download failed: ${state}`)
           win.webContents.send('downloadProgress', {type:"failed",content:state})
           win.setProgressBar(1,{mode:'error'})
           await dialog.showMessageBox(null,{
            message: `下载文件时出现问题：${error}`,
            title: "ZERO ERROR",
            type: "error",
            buttons: ["我知道了"]
          })
          app.exit()
         }
         const endTime = Date.now();
         const formattedTimeDiff = ((endTime - startTime) / 1000).toFixed(2);
         win.webContents.send('downloadProgress', {type:"useTime",content:formattedTimeDiff})
       });
    });
  }

  win.on('restore',() => {
    win.setProgressBar(-1,{mode:'none'})
  })

  win.on('focus',() => {
    win.setProgressBar(-1,{mode:'none'})
  })
  ipcMain.on('startDownload', () => {
    fs.unlink(path.join(app.getPath('temp'),'cruiseInstaller','full-setup.exe')).then(() => {
      downloadFile('https://mirror.ghproxy.com/https://github.com/QWXL/ZERO-CRUISE/releases/latest/download/cruise-full-setup.exe',path.join(app.getPath('temp'),'cruiseInstaller','full-setup.exe'))
    }).catch(() => {
      downloadFile('https://mirror.ghproxy.com/https://github.com/QWXL/ZERO-CRUISE/releases/latest/download/cruise-full-setup.exe',path.join(app.getPath('temp'),'cruiseInstaller','full-setup.exe'))
    })
  })


  ipcMain.on('startFullexe', () => {
    if (downloaded) startFullexe();
  })

})





async function startFullexe() {
  // 启动语音服务
  spawn(`${path.join(app.getPath('temp'),'cruiseInstaller','full-setup.exe')}`, {
    shell: true, // 在Windows环境运行
    windowsHide: true,
    cwd: path.join(app.getPath('temp'),'cruiseInstaller'),
    encoding: 'buffer',
    env:processNode.env,
    detached: true, // 使完整程序在安装程序关闭后仍能保持运行
    stdio: 'ignore'
   });
   spawn(`${path.join(app.getPath('temp'),'cruiseInstaller','autoUninstall.cmd')}`, {
    shell: true, // 在Windows环境运行
    windowsHide: true,
    cwd: path.join(app.getPath('temp'),'cruiseInstaller'),
    encoding: 'buffer',
    env:processNode.env,
    detached: true, // 使完整程序在安装程序关闭后仍能保持运行
    stdio: 'ignore'
   });
   app.exit()
}


