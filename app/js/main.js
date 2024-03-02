// 阅读ZERO AI源代码属于违反《用户使用声明》行为！
// 阅读ZERO AI源代码属于违反《用户使用声明》行为！
// 阅读ZERO AI源代码属于违反《用户使用声明》行为！
// 阅读ZERO AI源代码属于违反《用户使用声明》行为！
// 阅读ZERO AI源代码属于违反《用户使用声明》行为！
// 秋晚夕落 版权所有



// 秋晚夕落 版权所有

const root_url = localStorage.getItem('root_url') || "https://chat.zero-ai.online"


window.api.beforeQuit((value) => {
    if (value) {
        window.api.setData(localStorage)
    }
})
const inputContainer = document.getElementById('input-container')
const inputDiv = document.getElementsByClassName('input-div')[0]
const input = document.getElementById('input')
const named = document.getElementById('named')
const inputButton = document.getElementById('input-button')
let chatContainer = document.getElementById('chat')
const main = document.getElementById('main')
const tokens = document.getElementById('tokens')
const Logo = document.getElementById('actaLogo')
const HeaderTime = document.getElementById('HeaderTime')
const body = document.getElementById('body')
const netStauts = document.getElementById('netStauts')
const plusModeSwitch = document.getElementById('plusModeSwitch');
const thinkModeSwitch = document.getElementById('thinkModeSwitch');
const cruiseModeSwitch = document.getElementById('cruiseModeSwitch'); 
const cruiseModeSwitchLabel = document.getElementById('cruiseModeSwitchLabel'); 
const leftSaveModeSwitch = document.getElementById('leftSaveModeSwitch'); 
const sttModeSwitch = document.getElementById('sttModeSwitch'); 
const PromptMenu = document.getElementById('customPrompt');
const PromptInput = document.getElementById('prompt-input');
const logo = document.getElementById('actaLogo')
const savesContainer = document.getElementById('saves-container')
document.getElementById("versionSpan").textContent = sessionStorage.getItem('version');
let plusPermission = false
body.style.minHeight = '100vh'
function showLoadLabel(text) {
    const loadLabel = document.getElementById('loadLabel') || {textContent:""}
    loadLabel.textContent = text
}
let customPrompt = false 
let maxTokens = 16385
const readyOnLoad = document.getElementById('readyOnLoad')
showLoadLabel('初始化……')
let chatLog = []
if (localStorage.getItem('customPrompt')) {
    chatLog = [{'role':'system','content':localStorage.getItem('customPrompt')}]
    customPrompt = true
}
const nameList = {
    "user":"你",
    "assistant":"ZERO AI",
    "system":"ZERO 管理员",
    "error":"<s>ZERO AI</s>",
    "letter":"属于你的信"
}

const boolean = {
    "true":true,
    "false":false,
    null:false,
    undefined:false,
    true:true,
    false:false
}
let chatCount = 0
let canSend = true
let FreeAPIapply = false

String.prototype.trim = function (char, type) {
    if (char) {
    if (type == 'left') {
    return this.replace(new RegExp('^\\'+char+'+', 'g'), '');
    } else if (type == 'right') {
    return this.replace(new RegExp('\\'+char+'+$', 'g'), '');
    }
    return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
    };
    
    

axios.get(`https://zero-ai.online/api/onetext?count=2`)
.then ((res) => {
    const string = res.data.split('\n')
    input.setAttribute('placeholder',string[0].trim('n', 'right'))
    document.getElementById('oneText').textContent = string[1].trim('n', 'right')
})


let socket = linkIO()

 function linkIO() {
    try {
    const Osocket = io(`${root_url}/`,{
        query: {
            id: localStorage.getItem('id') ?? '',
            cruise: true,
            app: true,
            cruiseMode: boolean[localStorage.getItem('cruiseMode') ?? "false"]
        },
        autoConnect: false
    });
    console.log(`连接至 ZERO API`)
    netStauts.textContent = `正在链接`
    if (window.socket?.connected || false) {
        window.socket?.disconnect();
        netStauts.textContent = `正在重连`
    } 
    if (Osocket?.connected || false) {
        Osocket?.disconnect();
        netStauts.textContent = `正在重连`
    }  
    Osocket.connect()
    if (Osocket.connected) {
        netStauts.textContent = `链接正常`
        netStauts.style.color = `rgba(242,242,242,0.7)`
    }
    console.log('Done')
    window.socket = Osocket
    try {
    socket = Osocket
    } catch {}
    sockets(Osocket)
    return Osocket
} catch (e) {
    console.error(e)
    createErrBubble(getTime(),'error',`在尝试链接至服务端时出现问题：${e}，请重试或联系开发者。`,null,'relink')
}
}

let timeTitle = true
const customRenderer = new marked.Renderer();
let preload = true
new ClipboardJS('.copy-button');

setInterval(() => {
    if (socket.connected) {
        netStauts.textContent = `链接正常`
        netStauts.style.color = `rgba(242,242,242,0.7)`
    } else {
        netStauts.textContent = `链接丢失`
        netStauts.style.color = `rgba(242,0,0,0.7)`
    }
}, 10000);


const markedOptions = {
    async: false,
    breaks: false,
    gfm:true,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    renderer: customRenderer
};

  marked.use(markedOptions)


axios.get('https://ipapi.co/json/').then((response) => {
    const ip = response.data.ip
    sessionStorage.setItem('ip',ip)
    showLoadLabel('连接至服务器……')
})




// -------
function getDays() {
    var date = new Date();
    
    // 年月日
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    
    
    return year + '-' + month + '-' + day;
  }
function onclickButton() {
    if (canSend) {
    const message = input.value
    if (message) {
    input.setAttribute('placeholder','滴滴滴…链接成功！继续输入以和零对话！')
    inputByUser(message) 
    input.value = ''
    Logo.style.display = 'none'
    } else {
        input.setAttribute('placeholder','你最好是别发个寂寞。')
    }
    }
}

if (input) {
    input.onkeydown = function(e) {
        if (input.value.length == 0) {
            inputDiv.style.height = ''
            named.style.marginTop = ''
        }

        // 判断如果用户按下了左Ctrl+回车键
        if (e.ctrlKey && e.key == 'Enter') {
            var cursorPos = input.selectionStart; // 获取当前光标位置
            var textBefore = input.value.substring(0, cursorPos); // 光标之前的文本
            var textAfter  = input.value.substring(cursorPos, input.value.length); // 光标之后的文本

            // 在光标处添加换行符并更新输入框值，同时保持光标在正确位置
            input.value = textBefore + '\n' + textAfter;
            inputDiv.style.height = '5rem'
            named.style.marginTop = '95px'
            e.preventDefault();  // 防止默认事件发生

            // 将光标定位到新插入内容之后
             setTimeout(function() {
                input.selectionStart = cursorPos + 1;
                input.selectionEnd   = cursorPos + 1;
             }, 1);
        }

        if (e.key == 'Enter' && !e.ctrlKey) {
           e.preventDefault();// 禁止回车默认操作以避开默认换行功能。
           onclickButton();
       }
   };
}


let token = 0 
let tempBubble
/**
 * inputByUser 函数用于处理聊天界面中的用户输入，将其发送到服务器进行处理，并将临时响应显示在聊天界面中。
 * @param {string} message - “message”参数是用户提供的输入消息。它是一个表示用户消息或查询的字符串。
 * @param {boolean} audio - “audio”参数指示这条消息是否由 Sound 2 Text 程序填充
 * @returns 该函数没有 return 语句，因此它不会显式返回任何内容。
 */
function inputByUser(message,audio) {
    const mid = createCode()
    if (message) {
    chatLog.push({"role":"user","content":`${message}`})
    if (document.getElementById('saveNow').getAttribute('readSaves')) {
    document.getElementById('saveNow').removeAttribute('readSaves')
    document.getElementById('nowTitle').textContent = document.getElementById('nowTitle').textContent.replace('[存档] ','')
    }
    }
    let tag = 'normal'
    if (plus) {
        tag = 'plus'
    }
    if (FreeAPIapply) {
        tag = 'custom'
    }
    if (token >= maxTokens) {
        createChatBubble(getTime(),'error',`你的当前使用Token(${token})已超出当前用户组可使用Token(${maxTokens})，请刷新后重试。`,tag)
        return
    }
    if (message) {
    createChatBubble(getTime(),'user',message,tag,`prompt-${mid}`,(chatLog.length - 1))
    }
    tempBubble = createChatBubble('Connecting','assistant',"<div class=\"chatLoader\"></div>",tag)
    window.scrollTo({
        top: window.scrollY + tempBubble.clientHeight,
        behavior: "smooth"
    });
    canSend = false
    input.classList.add('cantSend');
    inputButton.classList.add('cantSend');
    input.setAttribute('placeholder','滴滴滴…请等待响应……')
    if (timeTitle == true) {
        timeTitle = false
        setTimeout(() => {
            HeaderTime.textContent = `会话开始于：${getTime()}`
        }, 1000);
        }
    if (!FreeAPIapply) {
    // 如果启用自由接口功能，那么就不向服务器发送请求，转而本地使用用户提供的API处理
    let url = `${root_url}/ai`
    if (plus) {
            url = `${root_url}/ai/plus`
    } 
    let config = {
        method: 'post',
        url: url,
        headers: { 
           'Content-Type': 'application/json'
        },
        data:{
            message: JSON.stringify(chatLog),
            ip: sessionStorage.getItem('ip'),
            access: sessionStorage.getItem('access'),
            id: localStorage.getItem('id'),
            think: localStorage.getItem('think') || false,
            memory: localStorage.getItem('memory') || '无',
            customPrompt: customPrompt,
            app: app,
            mid: mid,
            cruise:true,
            audio: audio
        },
        timeout: 36000000, 
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('access')}`
          }
        }
    axios(config)
    .then((response) => {
        if (response.data == 'Ticking') {
            return
        } else if (response.data !== "Forbidden") {
            createErrBubble(getTime(),'error',`链接出现错误，来自服务端的回复：${JSON.stringify(response.data?.AISend?.content || response)} <br>请联系开发者或重试。`)     
            try {
    chatContainer.removeChild(tempBubble)
     } catch {}
            input.setAttribute('placeholder','滴滴滴…连接丢失，请稍后重试……')
        }
        }).catch((err) => {
            console.log(err)
            createErrBubble(getTime(),'error',`链接出现错误，代码：${err.code}(${err.message}) <br>请联系开发者。`)     
            try {
    chatContainer.removeChild(tempBubble)
     } catch {}
            input.setAttribute('placeholder','滴滴滴…连接丢失，请稍后重试……')
        })
    } else {
        freeAPISend()
        .then((data) => {
            const result = data
             /* {
                "userSend": {
                    "time": getTime(),
                    "content": userInput,
                    "user": "user"
                },
                "AISend": {
                    "time": getTime(),
                    "content": content,
                    "user": "assistant"
                }
            }*/
            console.log(data)
            createChatBubble(result.AISend.time,result.AISend.user,result.AISend.content,tag)
            try {
    chatContainer.removeChild(tempBubble)
     } catch {}
            chatContainer.scrollTop = chatContainer.scrollHeight
            canSend = true
            input.classList.remove('cantSend');
            inputButton.classList.remove('cantSend');
            input.setAttribute('placeholder','滴滴滴，当前功能已被禁用。')

        }).catch ((err) => {
            console.log(err)
            createChatBubble(getTime(),'error','客户端系统出现错误，代码：' + err.code,tag)     
            try {
    chatContainer.removeChild(tempBubble)
     } catch {}
            input.setAttribute('placeholder','滴滴滴…连接丢失，请稍后重试……')
        })
    }
}

/**
 * 函数“parseResult”用于处理从人工智能聊天机器人接收到的结果并将其显示在聊天界面中。
 * @param result - “result”参数是一个对象，其中包含函数或 API 调用的响应。
 * @returns 函数“parseResult”不返回任何内容（未定义）。
 */
function parseResult(result) {
    const chatIndex = addContentToChatLog({"role":"assistant","content":result.AISend.content}) 
    let tag = 'normal'
    if (plus) {
        tag = 'plus'
    }    /* {
       "userSend": {
           "time": getTime(),
           "content": userInput,
           "user": "user"
       },
       "AISend": {
           "time": getTime(),
           "content": content,
           "user": "assistant"
       }
   }*/

   document.getElementById('saveBtn').disabled = false
   document.getElementById('createBtn').disabled = false
   if (result.AISend.user == 'error') { 
    createErrBubble(getTime(),'error',result.AISend.content,tag)     
    try {
    chatContainer.removeChild(tempBubble)
     } catch {}
    input.setAttribute('placeholder','滴滴滴…连接丢失，请稍后重试……')
    return
    }
    if (result.err) {
        createErrBubble(getTime(),'error','系统出现错误，代码：' + result.err + '<br>请联系开发者。',tag)     
       try {
    chatContainer.removeChild(tempBubble)
     } catch {}
       return
    }
    if (!result.ban) {
    console.log(result)
    let content = result.AISend.content
    window.api.newMessage({content:content})
    if (result.AISend.content.includes('<hide>')) {
        const regex = /<hide>(.*)<\/hide>/gs;
        const match = result.AISend.content.match(regex);
        console.log(match)
        const hidesContent = match[0].replace('<hide>',`<br><button class="btnInChat" id="btnHide-${getTime()}" onclick="toggleHide('${getTime()}')">显示思考过程 <span class="iconfont icon-chevron_right closeHideBtn"></button><hide id="hide-${getTime()}">`).replace('</hide>','<br></hide><br><br>');
       const chatBubble = createChatBubble(result.AISend.time,result.AISend.user,result.AISend.content.replaceAll(`${match[0]}`,''),tag ,result.mid)
       chatBubble.lastElementChild.innerHTML = hidesContent + chatBubble.lastElementChild.innerHTML
    } else {
    createChatBubble(result.AISend.time,result.AISend.user,content,tag,result.mid,chatIndex)
    }
    try {
    chatContainer.removeChild(tempBubble)
     } catch {}
    if (!result.AISend.content.includes('[control:weather]')) {
        if (result.memory) {
            let newMemory
            let memory = localStorage.getItem('memory')
            if (memory) {
               newMemory = JSON.parse(localStorage.getItem('memory'))
            } else {
               newMemory = []
            }
           newMemory.push(result.memory)
           localStorage.setItem('memory',JSON.stringify(newMemory))
        }
    } else {
        chatLog.push({"role":"assistant","content":`[为用户显示了天气预报界面]`})
    }
    tokens.textContent = `Tokens:${result.usages.total}/${maxTokens}`
    token = result.usages.total
    canSend = true

    input.classList.remove('cantSend');
    inputButton.classList.remove('cantSend');
    input.setAttribute('placeholder','滴滴滴…链接成功！继续输入以和零对话！')
        input.style.boxShadow = '0px 0px 10px 7px rgba(200, 200, 200, 0.5)'
        inputButton.style.boxShadow = '0px 0px 10px 7px rgba(200, 200, 200, 0.5)'
    setTimeout(() => {
        input.style.boxShadow = ''
        inputButton.style.boxShadow = ''
    }, 300);


   return
   }
}

function startTimeInterval() {
let timeInterval = setInterval(() => {
    let times = getTime(true)
    let string = ''
    if (!app || false) {
        string = '　'
    if (times.hour >= 4 && times.hour < 9) {
        string += '早上好！'
    } else if (times.hour >= 9 && times.hour < 11){
        string += '上午好！'
    } else if (times.hour >= 11 && times.hour < 13) {
        string += '中午好！'
    } else if (times.hour >= 13 && times.hour < 17) {
        string += '下午好！'
    } else if (times.hour >= 17 && times.hour < 20) {
        string += '傍晚好！'
    } else if (times.hour >= 20) {
        string += '晚上好！'
    } else if (times.hour < 4) {
        string += '凌晨好！'
    }
} else {
    string = ''
}
        HeaderTime.textContent = getTime() + string
    if (timeTitle == false) {
        clearInterval(timeInterval)
    }
}, 1000);
}

startTimeInterval()


/**
 * 函数“addContentToChatLog”将一个对象添加到“chatLog”数组中，并返回所添加对象的索引。
 * @param object - “object”参数是代表聊天消息的对象。
 * @returns `chatLog` 数组的最新位置索引。
 */
function addContentToChatLog(object) {
    let content = object.content
    console.log(content)
    if (think) {
        if (content.includes('<hide>')) {
        const regex = /<hide>(.*)<\/hide>/gs;
        const match = content.match(regex);
        console.log(`match:${match}`)
        if (match) {;
          const newObject = {
            role: object.role,
            content: object.content.replaceAll(`${match}`,'')
          }
          console.log(newObject)
          chatLog.push(newObject)
        } else {
            chatLog.push(object)
        }
    } else {
        chatLog.push(object)
    }
} else {
    chatLog.push(object)
}
return chatLog.length - 1
}

function toggleHide(time) {
    const hide = document.getElementById(`hide-${time}`)
    const btn = document.getElementById(`btnHide-${time}`)
    hide.classList.toggle('display')
    if (hide.classList.contains('display')) {
    btn.innerHTML = '隐藏思考过程 <span class="iconfont icon-chevron_down">'
    hide.style.height = 'auto'
    hide.style.fontSize = '16'
    hide.style.display = 'block'
    hide.style.opacity = '1'
    hide.style.width = '100%'
    } else {
        btn.innerHTML = '显示思考过程 <span class="iconfont icon-chevron_right">'
        hide.style.height = '0'
        hide.style.fontSize = '0'
        hide.style.opacity = '0'
        hide.style.width = '0'
        setTimeout(() => {
            hide.style.display = 'none'
        }, 200);
    }
}


/**
 * `createChatBubble` 函数创建一个具有指定时间、发送者、内容、标签和元素 ID 的聊天气泡元素，并将其自动附加至`chatContainer`容器中。
 * @param {string} time - 创建聊天气泡的时间，应遵循`YYYY-MM-DD HH:mm:ss`的格式，如果不规定它，则默认采用调用时间。
 * @param {string} who - `who`参数代表聊天气泡的发送者，规定该气泡的样式。它可以是以下多个值的任意一个：`user`,`assistant`,`system`,`error`,`letter`。
 * @param {HTMLString | string} content - `content` 参数代表聊天气泡的消息内容。它可以是一个`String`或`HTMLString`（只有当`who !== "user" || security == true`时，才会解析HTMLString）。
 * @param {string?} tag - `tag` 参数用于指定聊天气泡的标签。它可以具有三个可能的值：`plus`、`custom`或`normal`。这些值用于在助理消息旁边显示标签。
 * @param {string?} eid - `eid` 参数是一个可选参数，表示聊天气泡的 ID。它用于唯一地标识每个聊天气泡元素。如果提供，聊天气泡元素将具有指定的 ID。
 * 注：通常，当`who == "user"`时，eid应有前缀`prompt-`；当`who == "assistant"`时，eid应有前缀`ai-`；但这并不绝对。
 * @param {number?} chatIndex - `chatIndex`参数是一个可选参数，表示聊天气泡对应的聊天记录（chatLog `Array`）索引位置，主要用于`who == "user"`时的编辑功能。
 * @param {boolean | true} security - `security`参数是一个可选参数，如果显式的规定它，则可以设置是否使用激进或安全的创建策略，如果不规定它，则默认使用更安全的策略（`true`）。
 * @param {boolean?} array - `array`参数是一个可选参数，当它为`true`时，将返回一个HTMLElementsArray，否则，返回chatBubble元素本身。
 * @returns {HTMLElement | HTMLElementsArray} 返回创建并附加到`chatContainer`的`chatBubble`元素集合，如果`array === true`，它包括：`[
        chatBubble,
        chatBubbleMessage,
        chatBubbleTime,
        chatBubbleWho,
        chatBubbleTag
    ]`，否则，包括chatBubble元素本身。
 */
function createChatBubble(time,who,content,tag,eid,chatIndex,security,array) { 
    let chatBubbleTag = null;
    if (!time || typeof time !== 'string') {
        time = getTime()
    }
    console.log(who)
    chatCount += 1
    console.log(content)
    let message = content
    if (who == 'error') {
        message = `<span class="iconfont icon-icon_line_close" style="margin-bottom: -35px;width: 20;height: 20;display: inline-block;margin-right: 10px;"></span>${content}`
    }
    const chatBubble = document.createElement('div')
    const chatBubbleWho = document.createElement('p')
    const chatBubbleTime = document.createElement('p')
    const chatBubbleMessage = document.createElement('div')
    chatBubble.setAttribute('chatIndex',chatIndex)


    chatBubble.classList.add('chatBubble')
    chatBubble.classList.add(who)
    const markString = marked.parse(message);
    console.log(markString)
    let coded = markString
    let randomId = createCode()
    if (markString.includes('<pre>')) {
            coded = markString.replaceAll(`<pre>`,`<div class='codeRoot'><div class="preTitle"><p class="preLag preLeg${randomId}" id="preLeg${randomId}"></p>  <button class="copy-button" id="copy-button-${randomId}" title="点击复制"><span id="copy-span-${randomId}">复制</span></button></div><pre class="line-numbers">`).replaceAll(`</pre>`,'</pre></div>')
    }
    const inner = coded


    chatBubbleTime.textContent = time
    chatBubbleWho.innerHTML = `<b>${nameList[who]}</b>`
    chatBubbleTime.classList.add('chatBubbleTime')
    chatBubbleWho.classList.add('chatBubbleWho')
    chatBubbleMessage.classList.add('chatBubbleMessage')
    if (eid) {
        chatBubble.id = eid
    }
    chatContainer.appendChild(chatBubble)
    chatBubble.appendChild(chatBubbleWho)
    chatBubble.appendChild(chatBubbleTime)
    if (who == 'assistant') {
        chatBubbleTag = document.createElement('p')
        chatBubbleTag.classList.add('chatTag')
        if (tag == 'plus') {
            chatBubbleTag.classList.add('TagPlus')
            chatBubbleTag.textContent = 'PLUS'
        } else if (tag == 'custom') {
            chatBubbleTag.classList.add('TagCustom')
            chatBubbleTag.textContent = 'CUSTOM'
        } else if (tag == 'normal') {
            chatBubbleTag.classList.add('TagNormal')
            chatBubbleTag.textContent = 'STANDARD'
        }
        chatBubble.appendChild(chatBubbleTag)
    }
    chatBubble.appendChild(chatBubbleMessage)
    if (who == 'user') {
        if (security ?? true) {
            chatBubbleMessage.textContent = message
        }
        else {
            chatBubbleMessage.innerHTML = message
        }
        const chatEditContainer = document.createElement('button')
        chatEditContainer.classList.add('chatEdit')
        chatEditContainer.title = `编辑`
        const chatEditBtn = document.createElement('span')
        chatEditBtn.id = `editBtn-${eid}`
        chatEditBtn.classList.add('iconfont','icon-a-bianji-edit1')
        chatEditBtn.setAttribute('onclick',`editMessage("${eid}")`)
        chatEditBtn.style.fontSize = `1.1rem`
        chatBubble.appendChild(chatEditContainer)
        chatEditContainer.appendChild(chatEditBtn)
    } else {
        chatBubbleMessage.innerHTML = inner
    }
    if (message.includes('[control:weather]' && (who !== `user` || security == false))) {
        createWeatherCube(chatBubble)
        chatBubbleMessage.textContent = ''
        chatBubbleMessage.innerHTML = ''
    }
    let height = Number(chatContainer.style.height.replaceAll('px','') || window.screen.availHeight) + chatBubble.scrollHeight * 2
    console.log(height)
    chatContainer.style.height = `${height}px`
    Logo.style.display = 'none'
    const preLagElements = chatBubbleMessage.getElementsByClassName(`preLeg${randomId}`)
    if (preLagElements) {
        chatBubbleMessage.querySelectorAll('pre code').forEach(el => {
            const codeid = 'C' + createCode()
            let innerEl = el.innerHTML
            el.innerHTML = innerEl.replaceAll('<br>','\n')
            const elabel = el.parentElement.parentElement.firstElementChild.lastElementChild
            elabel.setAttribute('data-clipboard-target',`#${codeid}`)
            elabel.setAttribute('onclick',`document.getElementById('label-${codeid}').textContent = '成功!'`)
            elabel.id = `label-${codeid}`
            el.id = codeid
            Prism.highlightElement(el);
        })
        const codeElements = chatBubbleMessage.getElementsByClassName('code-toolbar')
        for (i=0;i<codeElements.length;i++) {
            const language = codeElements[i].firstElementChild?.classList[1]?.replace('language-','').toUpperCase()
            preLagElements[i].textContent = language
        }
    };
        
    if (array) 
    return [
        chatBubble,
        chatBubbleMessage,
        chatBubbleTime,
        chatBubbleWho,
        chatBubbleTag ?? null
    ];
    else 
    return chatBubble
}
let oldMessageOfEdit = ``

/**
 * “editMessage”函数允许用户通过将消息替换为文本区域元素来编辑消息，并提供取消或应用编辑的选项。
 * @param pmid - 参数`pmid`是需要编辑的目标元素的ID。
 * @returns `pmid` 参数的值。
 */

function editMessage(pmid) {
    const targetElement = document.getElementById(pmid);
    const oldElement = targetElement.getElementsByClassName('chatBubbleMessage')[0]
    const editBtn = document.getElementById(`editBtn-${pmid}`)
    editBtn.style.display = 'none'
    const tempTextInput = document.createElement('textarea')
    const oldMessage = oldElement.textContent
    console.log(oldMessage)
    oldMessageOfEdit = oldMessage
    tempTextInput.textContent = oldMessage
    tempTextInput.style.height = `${oldElement.clientHeight + 16}px`
    tempTextInput.classList.add('editing')
    tempTextInput.placeholder = `在此键入新的内容。`
    oldElement.innerHTML = ``
    oldElement.appendChild(tempTextInput);
    oldElement.innerHTML += `<div style="margin: 0 auto;"><button class="btnInChat" style="margin-top:20px;padding:10px;"  onclick="cancelEdit('${pmid}')">取消<span class="iconfont icon-icon_line_close closeHideBtn"></span></button><span style="height:50px;border-right: white solid 2px;display:inline-block;margin-bottom:-18px;width:10;margin-right:0"></span><button class="btnInChat" style="margin-top:20px;padding:10px;display:inline-block;margin-left:10" onclick="applyEdit('${pmid}')">确定<span class="iconfont icon-gou closeHideBtn"></span></button></div>`

    return pmid
}

/**
 * “cancelEdit”函数将聊天气泡的消息内容恢复为其原始值。
 * @param pmid - `pmid` 参数是需要编辑或取消的元素的 ID。
 * @returns `pmid` 参数的值。
 */
function cancelEdit(pmid) {
    const editBtn = document.getElementById(`editBtn-${pmid}`)
    editBtn.style.display = 'block'
    const targetElement = document.getElementById(pmid);
    const messageElement = targetElement.getElementsByClassName('chatBubbleMessage')[0]
    messageElement.innerHTML = ``
    messageElement.textContent = oldMessageOfEdit
    oldMessageOfEdit = ``
    return pmid
}

/**
 * 函数“applyEdit”使用输入字段中输入的文本更新聊天消息，并删除所有后续聊天消息。
 * @param pmid - `pmid` 参数是需要编辑的聊天气泡的 ID。
 * @returns 变量“pmid”的值。
 */
function applyEdit(pmid) {
    const editBtn = document.getElementById(`editBtn-${pmid}`)
    editBtn.style.display = 'block'
    const targetElement = document.getElementById(pmid);
    const targetIndex = targetElement.getAttribute('chatIndex')
    const messageElement = targetElement.getElementsByClassName('chatBubbleMessage')[0]
    const tempTextInput = targetElement.getElementsByClassName('editing')[0]
    messageElement.textContent = tempTextInput.value
    chatContainer.querySelectorAll('.chatBubble').forEach(el => {
        const index = el.getAttribute('chatIndex') || 0
        if (index > Number(targetIndex)) {
            el.remove()
        }
    })
    chatLog.splice(Number(targetIndex) + 1)
    chatLog[Number(targetIndex)] = {role:"user", content:tempTextInput.value}
    inputByUser()
    return pmid
}

function mobileCheck() {
    showLoadLabel('设备模式检测……')
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };



function createWeatherCube(parentElement) {
    if (document.getElementById('he-plugin-standard')) {
        document.getElementById('he-plugin-standard').innerHTML = '当前预报展示页已过期。'
        document.getElementById('he-plugin-standard').id = ''
    }

    let widget
    axios.get(`${root_url}/ai/weatherAPI/key`)
    .then((res) => {
    if (mobileCheck()) {
        widget =
         `WIDGET = \{
            "CONFIG": {
              "layout": "2",
              "width": "237",
              "height": "270",
              "background": "3",
              "dataColor": "FFFFFF",
              "backgroundColor": "787878",
              "borderRadius": "5",
              "key": \`${res.data}\`
            }}`
    } else {
        widget =
         `WIDGET = \{
            "CONFIG": {
              "layout": "1",
              "width": "450",
              "height": "150",
              "background": "3",
              "dataColor": "FFFFFF",
              "backgroundColor": "787878",
              "borderRadius": "5",
              "key": \`${res.data}\`
            }}`
    }
    const weatherCubeScriptFirst = document.createElement('script')
    weatherCubeScriptFirst.text = widget
    const weatherCubeScriptSec = document.createElement('script')
    weatherCubeScriptSec.src = "https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0"
    const weatherDiv = document.createElement('div')
    weatherDiv.id = 'he-plugin-standard'
    parentElement.appendChild(weatherDiv)
    parentElement.appendChild(weatherCubeScriptFirst)
    parentElement.appendChild(weatherCubeScriptSec)
}
)}





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


  

  /**
   * 函数“refreshScreen”重置聊天屏幕，清除聊天日志，设置输入占位符文本，显示徽标，启用发送消息，更新令牌计数，滚动到页面顶部，启动时间间隔，并可选择重新链接IO。
   * @param relink - `relink`
   * 参数是一个布尔值，指示函数是否应该执行重新链接操作。如果“relink”为“true”，该函数将调用“linkIO()”函数。如果“relink”为“false”或未提供，则不。
   * @param delFile - `delFile`参数是一个布尔值，指示函数是否要删除现在的会话存档，如果true则删除，false则不删除
   */
  function refreshScreen(relink,delFile) {
    chatLog = []
    chatContainer.innerHTML = ''
    Logo.style.display = 'block'
    canSend = true
    if (plus) {
        Logo.src = './AKETA SPACE GOLD.webp'
    } else {
        Logo.src = './AKETA SPACE-Fixed.webp'
    }
    tokens.textContent = `Tokens:0/${maxTokens}`  
    token = 0 
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    timeTitle = true
    chatContainer.style.height = '300px'
    startTimeInterval()
    if (relink) {
    linkIO()
    }
    document.getElementById('nowTitle').textContent = `新会话`
    const nowOpid = document.getElementById('saveNow').getAttribute('outputId')
    document.getElementById('saveNow').removeAttribute('readsaves')
    document.getElementById('saveNow').setAttribute('draggable','false')
    if (nowOpid && delFile) {
        window.api.delSaveFile(nowOpid)
    }
    document.getElementById('saveNow').setAttribute('outputId','')
    document.getElementById('saveBtn').disabled = true
    document.getElementById('createBtn').disabled = true
    document.getElementById('refreshIcon').classList.add('icon-ic_Refresh') 
    document.getElementById('refreshIcon').classList.remove('icon-shanchu-delete') 

  }

  function sockets(socket) {

 /**
   * 函数“createNotifactionInMessage”用于创建提示性气泡内嵌套框，并可以往内填充文字与可选择的图标。
   * @param content - 这个参数是嵌套框内的文字
   * @param {Number} style - 这个参数用于选择要使用的图标与颜色，null/0为错误样式，1为提醒样式，2为确定样式。
   * @returns - 将返回创建后的element，随后可以插入进要插入的地方。
   */
 function createNotifactionInMessage(content,style) {
    let iconClass = ''
    let pColor = ''
    switch (style) {
        case 0:
            iconClass = 'iconfont icon-icon_line_close' // 错误icon
            break;
        case 1:
            iconClass = 'iconfont icon-tishi-xian' // 提醒icon 
            pColor = 'rgba(255,255,0,0.5)'
            break;
        case 2:
            iconClass = 'iconfont icon-sure' // 确定icon
            pColor = 'rgba(0,50,0,0.5)'
            break;
        default:
            iconClass = 'iconfont icon-icon_line_close' // 错误icon
            break;
    }
    // 创建一个新的段落元素
    const messageTip = document.createElement('p');
    messageTip.className = 'messageTip';
  
    // 创建一个图标元素
    const iconElement = document.createElement('span');
    iconElement.className = iconClass;
    iconElement.style.marginBottom = '-35px';
    iconElement.style.width = '20px';
    iconElement.style.height = '20px';
    iconElement.style.display = 'inline-block';
    iconElement.style.marginRight= '10px';
    iconElement.style.fontSize= '1rem';
    pColor ? setColor() : null;

    function setColor() {
        messageTip.style.backgroundColor = pColor
        messageTip.style.border = `${pColor} 2px solid`
    }
      // 将图标元素添加到段落中
      messageTip.appendChild(iconElement);
  
      // 添加文本节点到段落中。content 是传入的参数，代表需要显示的消息内容。
      const textNodeContent = content;
      const textNode=document.createTextNode(textNodeContent);
  
      messageTip.appendChild(textNode);
  
      return messageTip
  }
  


socket.on(`messageUnfit`, (arg) => {
    console.log(arg)
    const message = document.getElementById(`prompt-${arg.mid}`)
    message.appendChild(createNotifactionInMessage(`这条发言似乎有一些问题，监管AI认为此条言论不合适或违反了我们的使用声明（${arg.result.evaluation}），我们已推送该消息至后台管理人员处理。（注：该功能仍在测试）`,1))
});

socket.on(`message-${localStorage.getItem('id')}`, (arg) => {
    const result = arg
    console.log(result)
        if (result.type == 'api') {
            parseResult(result.content)
        }
        else if (result.type == 'ban') {
            createChatBubble(getTime(),'error','你已被后台管理员封禁！请前往官方群（572900734）申诉后解封。')     
            return
        } else if (result.type == 'err') {
            parseResult(result)
        } else {
        createChatBubble(result.time,result.role,result.content)
        }
});

socket.on(`clearTempAccess`, (arg) => {
    const result = arg
        if (result == sessionStorage.getItem('access')) {
            console.log(`收到了服务器发来的许可重置信息`)
            getACCESS()
        }
});

socket.on(`PlayersWarning`, (arg) => {
    showLoadLabel(`重复登录，已终止链接！`)
    createErrBubble(getTime(),`error`,`你的ID在${arg}个不同设备（或你的不同浏览器页面）上被登录，为双方安全与利益着想，现已掐停所有设备的链接，请刷新会话重试。`,null,'relink')
    canSend = false
});
    
socket.on("error", (error) => {
createErrBubble(getTime(),'error', error)
});

socket.on("connect", () => {
    if (socket.recovered) {
        console.log(`刚刚恢复了一次链接！`)
        getACCESS('重连')
    }
    netStauts.textContent = `链接正常`
    netStauts.style.color = `rgba(242,242,242,0.7)`
    console.log(`链接成功！`)
    try {
        releasingOptions()        
    } catch {}
  });

  socket.on('disconnect', () => {
    netStauts.textContent = `链接终止`
    netStauts.style.color = `rgba(242,242,0,0.7)`
    console.log(`链接终止！`)
    try {
        lockOptions()
    } catch {}
  });

  socket.on('error', () => {
    netStauts.textContent = `链接丢失`
    netStauts.style.color = `rgba(242,0,0,0.7)`
    console.log(`链接丢失！`)
    try {
        lockOptions()
    } catch {}
  });

  window.addEventListener('beforeunload', function (event) {
    socket.disconnect();
    if (boolean[localStorage.getItem('saveWhenLeft') || 'false'] && !document.getElementById('saveNow').getAttribute('readSaves')) {
        saveFile(false,`[自动保存] `)
    }
})

  }

showLoadLabel('通知预检测……')

function checkDoc() {
    const version = 1.5
    const docVersion = localStorage.getItem("docVersion")
    if (docVersion < version) {
        let id = `C${createCode()}`
        const chatBubble = createChatBubble(getTime(),'system',`Hello! 我们的使用声明进行了调整与升级，或者你这是第一次打开，请戳→<a style='text-decoration:underline;' href="./doc.html">显示使用声明</a><br>然后！继续使用 ZERO AI 服务将被视为同意使用声明。<br>悄咪咪告诉你！这条系统消息不会被 AI 视作会话记录的一部分，当然如果你看它不爽也可以直接点下方按钮删掉。`,null,null,null,false,true)
        chatBubble[0].id = id
        chatBubble[1].appendChild(createFunctionButton(null,'',`refreshScreen()`,`知道了呢！ <span class="iconfont icon-sure closeHideBtn"></span>`))
        localStorage.setItem("docVersion",version)
    }
}

checkDoc()




// uuid鉴权系统 ↓

// 将在第一次启动时为这个客户端随机生成一个cuid，仅储存在本地作为次级辅助鉴权的凭证
{
    if (!localStorage.getItem('cuid')) {
        showLoadLabel('CUID……')
        localStorage.setItem('cuid',JSON.stringify([createCuid(),createCuid(),createCuid(),createCuid(),createCuid()]))
    }
    setInterval(() => {
        getACCESS('Access保活')
    }, 3600000);
    checkACCESS()
}
async function checkACCESS() {
        if (!FreeAPIapply) {
            getACCESS('Login',true,true)
            .then (() => {
                testPlusMode()
            })
        }  

}
function createCuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

/**
 * 函数“getACCESS”是一个异步函数，它将 POST 请求发送到服务器端点以检索访问令牌和其他信息，然后根据响应执行各种操作。
 * @param message - “message”参数是一个可选参数，表示要随请求一起发送的消息。如果没有提供消息，它将被设置为“null”。
 * @param UG - 参数UG是一个布尔值，决定是否显示用户组(UG)信息。如果 UG 为 true，该函数将根据 localStorage 中存储的 plusPermission 和 think
 * 值显示用户组信息。如果 UG 为 false，该函数将不会将用户信息显示至菜单中。
 * @param releasingOption - 这一个布尔值，决定是否将选项释放，一般来说，在整个程序生命周期中只调用一次。
 * @returns 一个 Promise 对象。
 */
async function getACCESS(message,UG,releasingOption) {
    return new Promise(async (resolve,rejects) => {
        let config = {
            method: 'post',
            url: `${root_url}/uuid/login`,
            headers: { 
               'Content-Type': 'application/json'
            },
            data:{
                data:JSON.stringify(await getClientInfo()),
                ip:sessionStorage.getItem('ip'),
                id:localStorage.getItem('id'),
                message:message || null
            },
            timeout: 36000000,
        }
            axios(config)
            .then((resp) => {
                showLoadLabel('获取访问许可……')
                const showId = document.getElementById('showId')
                const res = resp.data
                const plusTime = res.plusTime || ''
                console.log('尝试从服务端获取访问许可：' + res)
                if (res.code == 200) {
                    sessionStorage.setItem('access',res.access)
                    showId.textContent = `ID:　#${localStorage.getItem('id')}`
                    setPlusModeSwitch(res.plus)
                    sessionStorage.setItem('plusTime',plusTime)
                } else if (res.code == 201) {
                    localStorage.setItem('id',res.content)
                    sessionStorage.setItem('access',res.access)
                    showId.textContent += res.content
                    sessionStorage.setItem('plusTime',plusTime)
                    setPlusModeSwitch(res.plus)
                } else if (res.code == 500) {
                    createErrBubble(getTime(),'error',res.content,'','access')
                    showId.innerHTML = `<s>ID:　#${localStorage.getItem('id')}</s>`
                    showId.opacity = `0.7`
                    sessionStorage.setItem('plusTime',plusTime)
                    socket.disconnect()
                } else if (res.code == 202) {
                    localStorage.setItem('id',res.content)
                    showId.textContent = `ID:　#${res.content}`
                    sessionStorage.setItem('access',res.access)
                    setPlusModeSwitch(res.plus)
                    createChatBubble(getTime(),'system',res.text)
                    sessionStorage.setItem('plusTime',plusTime)
                } else if (res.code == 400) {
                    sessionStorage.setItem('access',res.access)
                    createChatBubble(getTime(),'system',res.content)
                    showId.textContent = `ID:　#${localStorage.getItem('id')}`
                    setPlusModeSwitch(res.plus)
                    sessionStorage.setItem('plusTime',plusTime)
                } else if (res.code == 403) {
                    createChatBubble(getTime(),'system',`你已被服务端标记为违规封禁，请加官方群（572900734）申诉解决。`)
                    setPlusModeSwitch(false)
                    showId.innerHTML = `<s>ID:　#${localStorage.getItem('id')}</s>`
                    socket.disconnect()
                }
                setPreload(false)
                console.log(res.plus)
                if (UG) {
                    showUG(res.plus || false ,localStorage.getItem('think') || false)
                }
                plusPermission = res.plus
                resolve(res.plus || false)
                if (releasingOption) {
                    releasingOptions()
                }
                plusModeSwitch.disabled = !res.plus;
                cruiseModeSwitch.disabled = !res.plus;
                thinkModeSwitch.disabled = !res.plus;
            }).catch((err) => {
                rejects()
                console.error(`upload info error:${err}`)
                createErrBubble(getTime(),'system',`获取访问许可时出现错误：${err}`,'','access')
            })
})}
/**
 * 函数“showUG”显示用户的会员资格状态和到期日期，并启用按钮以在用户具有 Plus 会员资格时显示剩余时间。
 * @param plus - 一个布尔值，指示用户是否具有“plus”会员资格。
 */
function showUG(plus) {
    console.log(`${plus}`)
    const showUG = document.getElementById('showUG')
    const showUGBtn = document.getElementById('showUGBtn')
    const prompt = document.getElementById('promptButton')
    if (plus) {
        showUG.textContent = `权益：Plus ZERO`
        showUG.title = `到期时间：${sessionStorage.getItem('plusTime')}`
        showUGBtn.style.display = 'block'
        showUGBtn.setAttribute('onclick',`showUGAlert('${sessionStorage.getItem('plusTime')}到期')`) 
    } else {
        showUG.textContent = `权益：Standard`
    }
    prompt.disabled = !plus
}

function showUGAlert(message) {
    const showUG = document.getElementById('showUG')
    const showUGBtn = document.getElementById('showUGBtn') 
    const showUGth = document.getElementById('showUG-th')
    showUGth.setAttribute("colspan","2")
    showUGBtn.style.display = 'none'
    const freeze = showUG.textContent
    showUG.textContent = message
    setTimeout(() => {
        showUGth.setAttribute("colspan","1")
        showUGBtn.style.display = 'block'
        showUG.textContent = freeze
    }, 10000);
}

const options = document.getElementById('select-container').getElementsByClassName('option')
const selectOptions = Array.from(options)
function releasingOptions() {

    selectOptions.forEach(option => {
        option.classList.remove('option')
    })
    document.getElementById('lockOptions').classList.add('notEnabled')
}

function lockOptions () {
    selectOptions.forEach(option => {
        option.classList.add('option')
    })
document.getElementById('lockOptions').classList.remove('notEnabled')
}
    /**
     * 函数“getClientInfo()”收集各种设备和浏览器信息以进行验证。
     * @returns 函数“getClientInfo()”返回一个对象，其中包含有关客户端设备和环境的各种信息。
     */
    async function getClientInfo() {
        showLoadLabel('收集用于验证的设备数据……')
        const mainData = await window.api.clientKey()
        const userAgent = navigator.userAgent;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const browserLanguage = navigator.language;
        const browserLanguages = navigator.languages;
        const appName = navigator.appName;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const availScreenWidth = window.screen.availWidth;
        const availScreenHeight = window.screen.availHeight;
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const canvasFingerprint = context ? context.canvas.toDataURL().replace('data:image/png;base64, ','') : null;
            const gl = document.createElement('canvas').getContext('webgl');
            const renderer = gl ? gl.getParameter(gl.RENDERER) : null;
            const vendor = gl ? gl.getParameter(gl.VENDOR) : null;
            const debugInfo = gl ? gl.getExtension('WEBGL_debug_renderer_info') : null;
        const hardwareInfo = {
            deviceModel: navigator.deviceMemory,
            hardwareConcurrency: navigator.hardwareConcurrency,
          };
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const system = navigator.oscpu
        const cuid = JSON.parse(localStorage.getItem('cuid')) // 由于该项数据储存于客户端且可以轻易修改，通常情况下是不可信的，在此仅作为次级鉴权凭证
        showLoadLabel('收集数据完成……')
        return {
          mainData:mainData, // 主程序提供的数据以及clientKey
          cruise: true, // 标记为cruise客户端
          canvas:canvasFingerprint, // canva指纹
          userAgent:userAgent, // ua
          WebGL: { // webGL信息
            renderer:renderer,
            vendor:vendor,
            debug:debugInfo
          },
          system:system, // 系统环境
          appName:appName, // 浏览器名
          screenResolution: { // 屏幕宽高
            width: screenWidth,
            height: screenHeight
          },
          timeZone:userTimeZone, // 时区
          languages:{
            Now:browserLanguage, // 现在使用的语言
            All:browserLanguages // 所有的备选语言
          },
          hardwareInfo:hardwareInfo, // 硬件信息
          windowSize: { // 视口宽高
            width: windowWidth, 
            height: windowHeight
          },
          availScreenSize: { // 可用宽高
            width: availScreenWidth,
            height: availScreenHeight
          },
          cuid:cuid // Client User ID
        };
      }


      // 加载动画


      let windowLoaded = false; // 跟踪窗口装载状态

      // 页面加载完成后执行得操作
      function onPageLoad() {
          console.log("页面加载完成！");
          windowLoaded = true; // 标记窗口已经装载完毕
          
          // 如果此时preload已经是false，则运行相关逻辑
          if (!preload) {
              runOnPreloadComplete();
          }
      }
      
      // 当预载和页面装载都准备好之后要执行的操作放在这里面。
      function runOnPreloadComplete() {
        showLoadLabel('完成！');
        const animation = document.getElementById('readyOnLoadAnimation')
        animation.style.animationPlayState = 'paused';
        if (readyOnLoad) {
            readyOnLoad.style.animation = 'loadReady 1s ease-in-out';
            setTimeout(() => {
                readyOnLoad.style.display = 'none';
            }, 1000);
        }
      }
      
      // 监听window.onload事件以判断页面是否加载完毕。
      if (document.readyState === "complete") { 
          onPageLoad(); 
      } else { 
          window.addEventListener('load', onPageLoad); 
      }
      
      function setPreload(newValue) {
         if (preload !== newValue) { // 检查新值与旧值是否不同（可选）
             preload = newValue;
             
             if (!newValue && windowLoaded) { // 如果新值为false且窗口已装载
                 runOnPreloadComplete();
             }
         }
      }


/**
 * `outputChat` 函数生成唯一的输出 ID，从各种来源收集数据，将其转换为 JSON 格式，创建 Blob 对象，并将其下载为 .zero 文件。
 */
async function outputChat() {
    const outputID = `${createCode()}${createCode()}`
    let data = {
       outputTime:getTime(),
       outputID:outputID,
       data:{
          element:chatContainer.innerHTML,
          chat:chatLog,
          createBy:localStorage.getItem('id'),
          tokens:token,
          height:chatContainer.style.height
       }
    }
    const download = (filename, Url) => {
        let a = document.createElement('a'); 
        a.style.display = 'none'; // 创建一个隐藏的a标签
        a.download = filename;
        a.href = Url;
        document.body.appendChild(a);
        a.click(); // 触发a标签的click事件
        document.body.removeChild(a);
}
    // 将 JSON 转换为字符串
    var jsonString = JSON.stringify(data, null, 2);
    // 创建一个 Blob 对象
    var blob = new Blob([jsonString], { type: 'application/json' });
    // 创建一个 Blob 对象的 URL
    var Url = URL.createObjectURL(blob);
    download(`${outputID}.zero`,Url)

}

/**
 * “inputChat”函数是一个异步函数，用于读取和处理包含聊天数据的 JSON 文件。
 */
async function inputChat(fileData) {
    let file = fileData
    if (!file) {
    const fileInput = document.getElementById('chatInput');
    file = fileInput.files[0];
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        refreshScreen()
        document.getElementById('refreshIcon').classList.remove('icon-ic_Refresh') 
        document.getElementById('refreshIcon').classList.add('icon-shanchu-delete') 
        const jsonContent = JSON.parse(e.target.result);
        timeTitle = false   
        chatContainer.innerHTML = ''
        HeaderTime.textContent = `会话存档于：${jsonContent.outputTime}`
        // 在这里可以处理解析后的JSON内容
        chatLog = jsonContent.data.chat
        if (!jsonContent.data.cruise) {
        createChatBubble(getTime(),'system',`以下内容为用户 I#${jsonContent.data.createBy} 于 ${jsonContent.outputTime} 保存的会话记录。<br>请不要点击任何会话中的超链接或任何可疑的可点击元素。我们不能保证该会话记录是否已被恶意窜改。<br>如有上述情况，请及时与我们反馈（qwxl@zero-ai.online）。`)
        document.getElementById('nowTitle').textContent = `[存档] *来自网页端*`    
        } else {
            createChatBubble(getTime(),'system',`存档备注：${jsonContent.title}<br>存档日期：${jsonContent.outputTime}<br>存档ID：${jsonContent.outputID}<br>对话条数：${jsonContent.data.chat.length}`)
            document.getElementById('nowTitle').textContent = `[存档] ${jsonContent.title}`
        }
        chatContainer.innerHTML += jsonContent.data.element
        token = jsonContent.data.tokens
        chatContainer.style.height = jsonContent.data.height
        document.getElementById('saveNow').setAttribute('readSaves','true')
    } catch (error) {
        createChatBubble(getTime(),'error',`你提交的会话记录读取失败！错误：${error}`)
    }
    };
  
    reader.readAsText(file);
}

      function createCode() {
        return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
     }
     


function consoleWarn() {
    createChatBubble(getTime(),'system','系统检测到你当前已打开浏览器控制台，根据<b>《用户使用声明》</b>相关规定，为保证用户与我们双方利益，已经对当前会话进行了紧急掐停。<br>请主动关闭浏览器控制台，我们有权封停您的账户。')
    chatLog = []
    sessionStorage.setItem('access','')
    let config = {
        method: 'post',
        url: `${root_url}/ai/report`,
        headers: { 
           'Content-Type': 'application/json'
        },
        data:{
            id:localStorage.getItem('id'),
            message:'console'
        },
        timeout: 3600000
    }
    axios(config)
    let temp1 = createChatBubble(getTime(),'system','3秒后强制刷新页面。<br>请主动关闭浏览器控制台。')
    setTimeout(() => {
        chatContainer.removeChild(temp1)
        let temp2 = createChatBubble(getTime(),'system','2秒后强制刷新页面。<br>请主动关闭浏览器控制台。')
        setTimeout(() => {
            chatContainer.removeChild(temp2)
            let temp3 = createChatBubble(getTime(),'system','1秒后强制刷新页面。<br>请主动关闭浏览器控制台。')
            setTimeout(() => {
                chatContainer.removeChild(temp3)
                window.location.reload()
            }, 1000);
        }, 1000);
    }, 1000);
}


/**
 * 函数`createErrBubble`将提供的参数添加功能性按钮后转发至`createChatBubble`函数。
 * @param {string?} time - `time` 参数是创建的时间，这与`createChatBubble`的同名参数相同。
 * @param {string} who - `who` 参数是创建的身份，这与`createChatBubble`的同名参数相同。
 * @param {string} content - `content` 参数是创建的内容，这与`createChatBubble`的同名参数相同。
 * @param {string?} tag - `tag` 参数是创建的标签，这与`createChatBubble`的同名参数相同。
 * @param {string} type - `type`参数用于确定当点击气泡内按钮时要采取的操作。它可以具有三个可能的值：`resend`、`access`、`relink`或`restart`。
 * 
 * 注：单次会话中只能存在一个`type == 'restart'`的功能气泡，新添加的`restart`功能气泡将替换旧的并处在最新位置。
 * @returns 返回创建并附加到`chatContainer`的`chatBubble`元素。
 */
function createErrBubble(time,who,content,tag,type) {
    const randomId = 'E' + createCode();
    let bubble
    if (type !== 'restart') {
        const button = createFunctionButton('err',randomId,`reSend('${randomId}','${type || 'all'}')`,`重试 <span class="iconfont icon-ic_Refresh closeHideBtn"></span>`)
        const errBubble = createChatBubble(time,who,content,tag,null,null,false,true)
        errBubble.id = randomId
        errBubble[1].appendChild(button)
        bubble = errBubble
    } else {
        const button = createFunctionButton('err',randomId,`restart()`,`重启 <span class="iconfont icon-ic_Refresh closeHideBtn"></span>`)
        if (document.getElementById('restartWarning')) {
            chatContainer.removeChild(document.getElementById('restartWarning'))
        }
        bubble = createChatBubble(time,who,content,tag,`restartWarning`,null,false,true)
        bubble[1].appendChild(button)
        }
    return bubble
}



/**
 * 函数“reSend”是 JavaScript 中的异步函数，它接受两个参数“errorBubbleId”和“type”，并根据“type”的值执行不同的操作。
 * @param errorBubbleId - `errorBubbleId` 参数是需要从聊天容器中删除的错误气泡的 ID。
 * @param type - “type”参数用于确定“reSend”函数中要采取的操作。它可以具有三个可能的值：`resend`、`access`或`relink`。
 */
async function reSend(errorBubbleId,type) {
    if (type == 'resend') {
        inputByUser()
    } else if (type == 'access') {
        tempBubble = createChatBubble('Connecting','assistant',"<div class=\"chatLoader\"></div>")
        getACCESS(`重新申请`,false)
        .then(() => {
            try {
    chatContainer.removeChild(tempBubble)
     } catch {}
        })
    } else if (type == 'relink') {
        linkIO()
    } else {
        linkIO()
        getACCESS(`重新申请`)
        .then((plus) => {
        inputByUser()
        })
    }
    if (errorBubbleId) {
    chatContainer.removeChild(document.getElementById(errorBubbleId))
    }
    if (chatContainer.childNodes.length == 0) {
        refreshScreen(false,false)
    }
}





window.api.onWindowShow((value) => {
    if (value) {
        input.focus();
        closeWhenClickOther()
    }
  })

const dropLabel = document.getElementById('dropLabel')
const dropScreen = document.getElementById('dropScreen')


// 当有文件被拖动到区域上方时阻止默认行为
body.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    dropScreen.style.display = 'block'
});

// 当文件离开该区域时恢复原状，并再次防止默认行为。
body.addEventListener('dragleave', function(e) {
    e.stopPropagation();
    e.preventDefault();
    dropScreen.style.display = 'none'
    });


    // 当有文件被放下时执行相关操作
    body.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    dropScreen.style.display = 'none'
    var files = e.dataTransfer.files; // 获取文件对象
    console.log(files)
    var fileName = files?.[0]?.name;
    var regexExtension = /(?:\.([^.]+))?$/.exec(fileName)[1];
    if (regexExtension == 'zero') {
        inputChat(files[0])
    }
    });




    function saveFile(noDelOld,prefix = '') {
        const ele = document.getElementById('saveNow')
        if (chatLog.length !== 0 && !ele.getAttribute('readSaves')) { 
        const outputID = `${createCode()}${createCode()}`
        const nowTitle = document.getElementById('nowTitle')
        if (nowTitle.textContent == '新会话') {
        nowTitle.textContent = chatLog[0].content
        }
        let data = {
            title: prefix + ele.querySelector('p')?.textContent || "无名称会话",
            outputTime: getTime(),
            outputID: outputID,
            data: {
                cruise:true,
                element:chatContainer.innerHTML,
                chat:chatLog,
                createBy:localStorage.getItem('id'),
                tokens:token,
                height:chatContainer.style.height
           }
        }
        console.log(ele.getAttribute("outputId"))
        if (ele.getAttribute("outputId") && !noDelOld) {
            console.log('try to delete old file')
            window.api.saveFile(`${outputID}.zero`,data,ele.getAttribute("outputId"))
            ele.setAttribute("outputId",outputID)
        } else {
            console.log('not delete old file')
            window.api.saveFile(`${outputID}.zero`,data,null,true)
            ele.setAttribute("outputId",outputID)
        }
        return [outputID,ele.querySelector('p')?.textContent]
    }
    return null
    }



function addSaveToList(title,opid,time) {
    // 创建一个表格行（tr）元素
        var tr = document.createElement('tr');

    // 创建一个表头（th）元素，并设置其类名和样式属性
        var th = document.createElement('th');
        th.className = 'bubble save';
        th.style.marginTop = '0';
        th.style.display = 'grid';
        th.style.gridTemplateColumns = '7fr 3fr';
        th.setAttribute('draggable', true);
        th.setAttribute('outputId', opid);
        th.id = `output-${opid}`;

    // 创建一个段落（p）元素并添加文本内容“会话”
        var p = document.createElement('p');
        p.textContent = title;
        p.classList.add('savesContent')

    // 创建一个按钮（button）元素，并设置其类名、id、onclick事件和标题属性。同时隐藏该按钮。
        var buttonDiv = document.createElement('div')

        var button = document.createElement('button');
        button.className='clear-button';
        button.id='showUGBtn';
        button.setAttribute("onclick",`delSaveFile('${opid}')`); // 这里应填写具体的点击事件处理函数
        button.title='删除这个会话存档';
        button.style.display='none';

        var button2 = document.createElement('button');
        button2.className='clear-button';
        button2.id='showUGBtn';
        button2.setAttribute("onclick",`editSaveTitle('${opid}')`); // 这里应填写具体的点击事件处理函数
        button2.title='修改标题';
        button2.style.display='none';

    // 创建span用于在按钮内显示图标，设置其类名以引用特定的图标字体
        var spanIcon=document.createElement("span");
        spanIcon.className="iconfont icon-shanchu-delete btn-icon";
        var spanIcon2=document.createElement("span");
        spanIcon2.className="iconfont icon-a-bianji-edit1 btn-icon";
    // 将span添加到按钮中，再将段落和按钮加入到表头单元格中，最后把该单元格加入到行中。
        button.appendChild(spanIcon);
        button2.appendChild(spanIcon2);
        th.appendChild(p);
        buttonDiv.appendChild(button2);
        buttonDiv.appendChild(button);
        th.appendChild(buttonDiv)
        th.setAttribute('title',time)
        tr.appendChild(th);

        const histroyLine = document.getElementById('histroyLine')
        histroyLine.insertAdjacentElement('afterend',tr)
        return th
}


async function getSavesData() {
const data = await window.api.getSavesData()
for (i=0;i<data.length;i++) {
    console.log(data[i])
    addSaveToList(data[i].title,data[i].outputID,data[i].outputTime)
  }
document.getElementById('histroyCount').textContent = data.length
const saves = document.querySelectorAll('.save')
saves.forEach((save) => {
    save.ondragstart = (event) => {
        dragFile(event,save)
      }
})

}
getSavesData()

function dragFile(event,save) {
    event.preventDefault()
        const opid = save.getAttribute('outputId')
        if (opid) {
        window.api.startDrag(`${opid}.zero`)
        } else {}
}


function addSaveFile() {
    document.getElementById('saveNow').setAttribute('outputId','')
    const info = saveFile(true)
    if (info) {
    document.getElementById('saveNow').setAttribute('outputId','')
    const th = addSaveToList(info[1],info[0],getTime())
    document.getElementById('histroyCount').textContent = Number(document.getElementById('histroyCount').textContent) + 1
    th.ondragstart = (event) => {
        dragFile(event,th)
      }
      refreshScreen(false,false)
    }

}



function delSaveFile(opid) {
    const ele = document.getElementById(`output-${opid}`).parentElement
    ele.remove()
    document.getElementById('histroyCount').textContent = Number(document.getElementById('histroyCount').textContent) - 1
    window.api.delSaveFile(opid)
}

function editSaveTitle(opid) {
    if (opid !== 'saveNow') {
    const ele = document.getElementById(`output-${opid}`).firstElementChild
    const newTitle = window.api.prompt(`在此输入这个存档的备注（≤20字）`,ele.textContent)
    if (newTitle) {
        ele.textContent = newTitle
        window.api.editSaveTitle(opid,newTitle)
    }
} else {
    const pele = document.getElementById('saveNow')
    const ele = document.getElementById('nowTitle')
    const newTitle = window.api.prompt(`在此输入这个存档的备注`,ele.textContent)
    if (newTitle) {
        ele.textContent = newTitle
        if (pele.getAttribute('outputId')) {
            window.api.editSaveTitle(pele.getAttribute('outputId'),newTitle)
    }
}

}
}


const sttDevice = document.getElementById('sttDevice') // left
const sttType = document.getElementById('sttType') // center
const sttInfo = document.getElementById('sttInfo') // right
const sttProcessInfo = document.getElementById('sttProcessInfo') // all
let sttStat = false // 一个简单的全局变量，用于指示stt是否可用
let useStt = false // 同上，用于指示stt是否在工作状态（包括聆听时）
if (boolean[localStorage.sttp ?? "true"]) {
window.api.sttProcess((object) => {
  console.log(object)
    switch (object.type) {
        case "device":
            sttDevice.textContent = object.content
            break;
        case "connection":
            if (object.content) {
            sttInfo.textContent = `链接正常`
            sttType.textContent = `闲置中...按住Tab键发起语音输入`
            sttInfo.style.color = ``
            sttStat = true
            } else {
                sttInfo.textContent = `链接丢失`
                sttInfo.style.color = `red`
                sttStat = false
            }
            break;
        case "error":
            createChatBubble(getTime(),'error',`来自语音输入模块的报错：${object.content}`)
            break;
        case "failed":
            createChatBubble(getTime(),'error',`语音输入模块已崩溃：code ${object.content}`)
            sttInfo.textContent = `模块崩溃`
            sttInfo.style.color = `red`
            sttStat = false
            useStt = false
            break;
        case "result":
            inputByUser(object.content,true)
            canSend = true
            input.classList.remove('cantSend');
            inputButton.classList.remove('cantSend');
            tempSttBubble?.remove()
            sttType.textContent = `闲置中...按住Tab发起语音输入`
            sttProcessInfo.style.color = ``
            useStt = false
            break
        default:
            break;
    }
})

let tempSttBubble
function startSound2Text() {
    if (sttStat && canSend && !useStt) {
    canSend = false
    input.classList.add('cantSend');
    inputButton.classList.add('cantSend');
    input.blur()
    window.api.startStt()
    useStt = true
    sttProcessInfo.style.color = `rgb(255,255,255)`
    sttType.textContent = `聆听中...释放开始处理`
    tempSttBubble = createChatBubble('正在聆听...','user',"<div class=\"chatLoader\"></div>",null,null,null,false)
}
}

function stopSound2Text() {
    if (sttStat && !canSend && useStt) {
        input.blur()
        window.api.stopStt()
    
        sttType.textContent = `处理中...请稍后`
        sttProcessInfo.style.color = `rgba(255,255,255,0.2)`
    }
}
let tabPressTimer;


// 监听 Tab 键的按下
document.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      // 防止默认行为，比如移动到下一个元素
      closeWhenClickOther() // 如果有菜单，收起
      tabPressTimer = setTimeout(function() {
        console.log('触发聆听');
        startSound2Text()
    
      }, 300); // 300毫秒判定为长按
    }
  });
  
  // 监听 Tab 键的释放
document.addEventListener('keyup', function(event) {
    if (event.key === 'Tab') {
      closeWhenClickOther() // 如果有菜单，收起
      stopSound2Text()
      clearTimeout(tabPressTimer);
    }
  });

} else {
    sttProcessInfo.textContent = `|　语音输入模块已关闭　|`
}

document.addEventListener('keyup', function(event) {
    if (event.key === 'Escape') {
        window.api.hideWindow()
    }
  });

document.addEventListener('keypress', function(event) {
    const focusedElement = document.activeElement;
    const inputfocused = focusedElement.id == `input`
    if (event.code === 'Space' && !useStt && !inputfocused) {
        event.preventDefault()
        input.focus()
        closeWhenClickOther()
    }
})

function restart() {
    window.api.restart()
}



window.api.updateListener((object) => {
    switch (object.type) {
        case 'available': {
        const fakeContent = {
            "time": getTime(),
            "content": `已有新的版本更新可用，自动下载。`,
            "user": "letter"
        }
        parseResult({AISend:fakeContent})
            break;
        }
        case 'downloaded': {
        const fakeContent = {
                "time": getTime(),
                "content": `版本「${object.content}」现已可用 <br><button class="btnInChat" style="margin-top:20px;padding:10px" id="" onclick="window.api.quitAndInstall()">重启以应用<span class="iconfont icon-ic_Refresh closeHideBtn"></span></button>`,
                "user": "letter" 
        }
        parseResult({AISend:fakeContent}) 
            break;
        }
        default:
            break;
    }
})







function createFunctionButton(type,randomId,onclick,content) {
    // 创建button元素
    var button = document.createElement('button');

    // 设置button样式和属性
    button.className = 'btnInChat';
    switch (type) {
        case `err`:
            button.style.backgroundColor = 'rgb(130,50,50)';
            button.style.marginTop = '20px';
            button.style.padding = '10px';
            break;
    
        default:
            button.style.marginTop = '20px';
            button.style.padding = '10px';
            break;
    }

      // 设置onclick事件处理器。注意：这里简化了原始字符串中`${randomId}`和`${type || 'all'}`部分。
      button.setAttribute('onclick', onclick);

      // 设置按钮内部文本及图标（这里使用textContent简化了原始html结构）
      button.innerHTML = content;

    return button
}