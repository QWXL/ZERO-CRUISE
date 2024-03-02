module.exports = {
  packagerConfig: {
    asar: true,
    name: "ZERO Cruise Installer and Updater",
    icon: './favicon.png', // no file extension required
    win32metadata: {
      ProductName: "ZERO Cruise Installer and Updater",
      CompanyName: "zero-ai.online",
      FileDescription: "ZERO AI 巡航客户端 安装&更新器"
    },
    ignore:[
      "full-setup.exe"
    ]
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        setupExe: "cruise-installer.exe",
        setupIcon: './favicon.ico',
        iconUrl: 'https://chat.zero-ai.online/src/favicon.ico'
      }
    },
    {
      name: "@electron-forge/maker-zip"
    }
  ],
  electronPackagerConfig: {
    packageManager: "npm",
    icon: './favicon.png',
    asar: true,
    win32metadata: {
      ProductName: "ZERO Cruise Installer and Updater",
      CompanyName: "zero-ai.online",
      FileDescription: "ZERO AI 巡航客户端 安装&更新器"
    },
    ignore:[
      "full-setup.exe"
    ]
  },
  electronWinstallerConfig: {
    name: "ZERO-Cruise-Installer-and-Updater",
    icon: './favicon.png',
    win32metadata: {
      ProductName: "ZERO Cruise Installer and Updater",
      CompanyName: "zero-ai.online",
      FileDescription: "ZERO AI 巡航客户端 安装&更新器"
    },
    ignore:[
      "full-setup.exe"
    ]
  }
};
