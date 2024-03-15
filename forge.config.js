module.exports = {
  packagerConfig: {
    asar: true,
    name: "ZERO Cruise",
    icon: './favicon.png', // no file extension required
    win32metadata: {
      ProductName: "ZERO Cruise",
      CompanyName: "zero-ai.online",
      FileDescription: "ZERO AI 巡航客户端"
    },
    ignore:[
      "/stt/",
      "/out/",
      "/installer/"
    ],
    "protocols": [
      {
        "name": "ZERO CRUISE",
        "schemes": ["zero"]
      }
    ]
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        setupExe: "cruise-full-setup.exe",
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
      ProductName: "ZERO Cruise",
      CompanyName: "zero-ai.online",
      FileDescription: "ZERO AI 巡航客户端"
    },
    ignore:[
      "/stt/",
      "/out/",
      "/installer/"
    ]
  },
  electronWinstallerConfig: {
    name: "ZERO-Cruise",
    icon: './favicon.png',
    win32metadata: {
      ProductName: "ZERO Cruise",
      CompanyName: "zero-ai.online",
      FileDescription: "ZERO AI 巡航客户端"
    },
    ignore:[
      "/stt/",
      "/out/",
      "/installer/"
    ]
  }
};
