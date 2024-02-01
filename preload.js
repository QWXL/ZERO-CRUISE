/*
 * @Author: BuildTools unconfigured@null.spigotmc.org
 * @Date: 2024-01-31 23:44:44
 * @LastEditors: BuildTools unconfigured@null.spigotmc.org
 * @LastEditTime: 2024-01-31 23:45:08
 * @FilePath: \cruise-client\preload.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  })