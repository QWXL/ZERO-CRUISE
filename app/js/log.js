
const data = localStorage.getItem('logKey')

let config = {
    method: 'post',
    url: '/log/login',
    headers: { 
       'Content-Type': 'application/json'
    },
    data:{
        key:data
    },
    timeout: 36000000, 
}

const socket = io('',{
    query: {
        key: data
    },
    autoConnect: false
});

axios(config)
.then((res) => {
    console.log(res.data)
    if (res.data.ok == true) {
        if (res.data.permission < 1) {
            commandInput?.remove()

        }
        socket.connect()
        document.getElementById('version').textContent = `Version: ${res.data.version}`
    document.getElementById('log').innerHTML = `\n${res.data.logs}`
    socket.on('log', (arg) => {
        console.log(arg)
    document.getElementById('log').innerHTML += `\n${arg.content}`
    document.getElementById('logStats').innerHTML = `INFO :<span style="color:#a5d6ff">${arg.stats[`INFO `]}</span><br>
    WARN :<span style="color:yellow">${arg.stats[`WARN `]}</span><br>
    ERROR:<span style="color:red">${arg.stats[`ERROR`]}</span><br>
    FATAL:<span style="color:darkred">${arg.stats[`FATAL`]}</span><br>
    DEBUG:<span style="color:#8b949e">${arg.stats[`DEBUG`]}</span>`
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
    });

    socket.on('usage', (arg) => {
        praseUsages(arg)
    });

    socket.on('backup', (arg) => {
        console.log(arg)
        document.getElementById('backup-log').textContent += `\n${arg}`
        document.getElementById('backup-log').scrollTo({
            top: document.getElementById('backup-log').scrollHeight,
            behavior: "instant"
        });
    
        });
    socket.on('backupStats', (arg) => {
        console.log(arg)
        const backupStats = document.getElementById('backupStats')
        if (arg.size > 1024) {
        backupStats.innerHTML = `已备份数量：${arg.length}<br>最新备份：${arg.newest}<br><span style="color:'yellow'">已用空间：${arg.size}Mb [!]</span>`
        } else {
            backupStats.innerHTML = `已备份数量：${arg.length}<br>最新备份：${arg.newest}<br>已用空间：${arg.size}Mb`
        }
    });
    socket.on("connect", () => {
        if (socket.recovered) {
            document.getElementById('log').innerHTML += `\n<span style="color:red">[ClientErr]链接重置，请点击→<a onclick="window.location.reload()">刷新客户端页面</a>。</span>`
            socket.disconnect();
        }
      });

      commandInput.onkeydown = function(e) {
        //判断如果用户按下了左Ctrl+回车键 
        if(e.ctrlKey && e.key == 'Enter') {  
            commandInput.value += '\n'
        }
        if (e.key == 'Enter' && !e.ctrlKey) {
            e.preventDefault();// 禁止回车的默认换行
            sendCommand();  
        }
    }
        

    function sendCommand() {

        if (commandInput.value.includes('sendTo')) {
            const emit = eval(commandInput.value)
        socket.emit('commandByAdmin',emit)
        console.log(emit)
        } else {
            document.getElementById('log').innerHTML += `\n当前权限仅能使用"sendTo([args])"！`
        }
        console.log(commandInput.value)
        commandInput.value = ''
    }

    function banUser(i) {
        unfitList.innerHTML = `- <span id="speechDetection" onclick="toggleUnfitListShow(false)">监管消息列表 (?)<br><b>Loading</b></span>`
        socket.emit('BanByAdminUnfit',{i:i})
    }
    
    function neglect(i) {
        unfitList.innerHTML = `- <span id="speechDetection" onclick="toggleUnfitListShow(false)">监管消息列表 (?)<br><b>Loading</b></span>`
        socket.emit('neglectUnfit',{i:i})
    }


    window.banUser = banUser
    window.neglect = neglect
} else {
    document.getElementById('log').innerHTML = `权限验证未通过！`
    commandInput?.remove()
}
})



function sendTo(id,message,role) {
    const result = {origin:commandInput.value,id:id,message:message,role:role}
    console.log(result)
    return result
}

function getTime() {
    var date = new Date();
    
    // 年月日
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    
    // 时分秒
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  }

  

setInterval(() => {
    document.getElementById('time').textContent = `NowTime: ${getTime()}`
}, 1000);


function setCode() {
    const code = prompt('在此键入你的权限代码',localStorage.getItem('data'))
    if (code) {
    localStorage.setItem('logKey',code)
    window.location.reload()
    }
}

let showNormal = false
let showPlus = false
const accessNormal = document.getElementById('accessNormal');
const accessPlus = document.getElementById('accessPlus');
const unfitList = document.getElementById('speechDetection')
function praseUsages(usages) {
const cpuRange = document.getElementById('cpu');
const memRange = document.getElementById('mem');
const cpuCount = document.getElementById('cpuCount');
const memCount = document.getElementById('memCount');
const accessDay = document.getElementById('accessDay');
const accessList = document.getElementById('accessList');
const links = document.getElementById('links')
    console.debug(usages)
    // 展示系统数据
    cpuRange.setAttribute('value',usages.content.cpuUsage.toFixed(4) * 100)
    cpuCount.textContent = (usages.content.cpuUsage * 100).toFixed(2) + '%'
    memRange.setAttribute('value',((usages.content.totalMem - usages.content.freeMem) / usages.content.totalMem) * 100);
    memCount.textContent = `${(usages.content.totalMem - usages.content.freeMem).toFixed(2)}MB / ${usages.content.totalMem.toFixed(2)}MB`
    links.textContent = `> ${usages.links} Device(s)`
    // 展示访问许可
    const times = Object.keys(usages.access)
    const timeKey = times[times.length - 1] || 'None'
    accessDay.innerHTML = `<b>${timeKey}</b>`;
    if (showPlus) {
    accessPlus.innerHTML = `> <span id="accessPlus" onclick="toggleAccessShow('plus',false)">Plus (${usages.access?.[timeKey]?.plus?.length || 0})<br>${usages.access?.[timeKey]?.plus.join(';<br>')}</span>`
    } else {
        accessPlus.innerHTML = `- <span id="accessPlus" onclick="toggleAccessShow('plus',true)">Plus</span>`
    }
    if (showNormal) {
        accessNormal.innerHTML = `<br>> <span id="accessNormal" onclick="toggleAccessShow('normal',false)">Normal (${usages.access?.[timeKey]?.normal?.length || 0})<br>${usages.access?.[timeKey]?.normal.join(';<br>')}</span>`
    } else {
        accessNormal.innerHTML = `<br>- <span id="accessNormal" onclick="toggleAccessShow('normal',true)">Normal</span>`
    }

    if (unfitListShow) {
        if (Array.isArray(usages.unfitList)) {
        let unfitListHTML = ''
        for (i=0;i<usages.unfitList.length;i++) {
            const unfitInfo = usages.unfitList[i]
            unfitListHTML += `<span><hr>${i}.[#${unfitInfo.id}] | MID:${unfitInfo.mid} | ${unfitInfo.time}<br>用户提交：${unfitInfo.content}<br><b>监管AI：${unfitInfo.result.evaluation}</b><br><a onclick="banUser(${i})" style="cursor: pointer;">[封禁]</a> | <a style="cursor: pointer;" onclick="neglect(${i})">[忽略]</a></span>`
        }
        setTimeout(() => {
            unfitList.innerHTML = `> <span id="speechDetection"><span onclick="toggleUnfitListShow(false)">监管消息列表</span> (${usages.unfitList.length || 0})<br>${unfitListHTML}</span>`
        }, 1000);
    } else {
        unfitList.innerHTML = `- <span id="speechDetection" onclick="toggleUnfitListShow(false)">监管消息列表 (0)<br><b>无</b></span>`
    }
    } else {
        unfitList.innerHTML = `- <span id="speechDetection" onclick="toggleUnfitListShow(true)">监管消息列表</span>`
    }
    document.getElementById('uptime').textContent = formatSeconds(usages.uptime)
}

function toggleAccessShow(type,oc) {
    switch (type) {
        case 'normal':
            showNormal = oc
            accessNormal.innerHTML = `<br>● Please Wait`
            break;
    
        case 'plus':
            showPlus = oc
            accessPlus.innerHTML = `● Please Wait`
            break;
    }
}

let unfitListShow

function toggleUnfitListShow(oc) {
    unfitListShow = oc
    unfitList.innerHTML = `● Please Wait`
}



function toggleBackup() {
    const blog = document.getElementById('backup-log')
    const blogicon = document.getElementById('backupIcon')
    if (blog.style.display == 'block') {
        blog.style.display = 'none'
        blogicon.textContent = '>'
    } else {
        blog.style.display = 'block'
        blogicon.textContent = 'V'
    }
}


function formatSeconds(seconds) {
    var days = Math.floor(seconds / (24 * 60 * 60));
    var hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    var minutes = Math.floor((seconds % (60 * 60)) / 60);
     var remainingSeconds = seconds % 60;
  
     return days + "d " + hours + "h " + minutes + "m " + remainingSeconds.toFixed(1) + "s";
  }


  const commandInput = document.getElementById('commandInput')


