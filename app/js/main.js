// 阅读ZERO AI源代码属于违反《用户使用声明》行为！
// 阅读ZERO AI源代码属于违反《用户使用声明》行为！
// 阅读ZERO AI源代码属于违反《用户使用声明》行为！
// 阅读ZERO AI源代码属于违反《用户使用声明》行为！
// 阅读ZERO AI源代码属于违反《用户使用声明》行为！
// 秋晚夕落 版权所有


// 秋晚夕落 版权所有

const input = document.getElementById('input')
const inputButton = document.getElementById('input-button')
let chatContainer = document.getElementById('chat')
const main = document.getElementById('main')
const tokens = document.getElementById('tokens')
const Logo = document.getElementById('actaLogo')
const HeaderTime = document.getElementById('HeaderTime')
const body = document.getElementById('body')
const netStauts = document.getElementById('netStauts')
let plusPermission = false
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
const socket = io(`https://chat.zero-ai.online/`,{
    query: {
        id: localStorage.getItem('id') || ''
    },
    autoConnect: false
});

axios.get(`https://zero-ai.online/api/onetext`, (req,res) => {
    input.setAttribute('placeholder',res.data)
})


function relinkIO() {
    console.log(`连接至 ZERO API`)
    if (socket.connected) {
        socket.disconnect();
    } 
    socket.connect()
    if (socket.connected) {
        netStauts.textContent = `链接正常`
        netStauts.style.color = `rgba(242,242,242,0.7)`
    }
}
relinkIO()

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
    if (!mobileCheck()) {
 input.onkeydown = function(e) {
    //判断如果用户按下了左Ctrl+回车键 
    if(e.ctrlKey && e.key == 'Enter') {  
        input.value += '\n'
    }
    if (e.key == 'Enter' && !e.ctrlKey) {
        e.preventDefault();// 禁止回车的默认换行
        onclickButton();  
    }
}} else {
    input.onkeydown=function(e) {
    if (e.key == 'Enter') {
        e.preventDefault();// 禁止回车的默认换行
        onclickButton();  
    }}
    }
}


let token = 0 
let tempBubble
/**
 * inputByUser 函数用于处理聊天界面中的用户输入，将其发送到服务器进行处理，并将临时响应显示在聊天界面中。
 * @param message - “message”参数是用户提供的输入消息。它是一个表示用户消息或查询的字符串。
 * @returns 该函数没有 return 语句，因此它不会显式返回任何内容。
 */
function inputByUser(message) {
    const mid = createCode()
    if (message) {
    chatLog.push({"role":"user","content":`${message}`})
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
    tempBubble = createChatBubble('Connecting','assistant',"<img src='./loading.gif' class='tempBubble'>",tag)
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
    let url = `https://chat.zero-ai.online/ai`
    if (plus) {
            url = `https://chat.zero-ai.online/ai/plus`
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
            mid: mid
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
            chatContainer.removeChild(tempBubble)
            input.setAttribute('placeholder','滴滴滴…连接丢失，请稍后重试……')
        }
        }).catch((err) => {
            console.log(err)
            createErrBubble(getTime(),'error',`链接出现错误，代码：${err.code}(${err.message}) <br>请联系开发者。`)     
            chatContainer.removeChild(tempBubble)
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
            chatContainer.removeChild(tempBubble)
            chatContainer.scrollTop = chatContainer.scrollHeight
            canSend = true
            input.classList.remove('cantSend');
            inputButton.classList.remove('cantSend');
            input.setAttribute('placeholder','滴滴滴，当前功能已被禁用。')

        }).catch ((err) => {
            console.log(err)
            createChatBubble(getTime(),'error','客户端系统出现错误，代码：' + err.code,tag)     
            chatContainer.removeChild(tempBubble)
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
   if (result.AISend.user == 'error') {
    createErrBubble(getTime(),'error',result.AISend.content,tag)     
    chatContainer.removeChild(tempBubble)
    input.setAttribute('placeholder','滴滴滴…连接丢失，请稍后重试……')
    return
    }
    if (result.err) {
        createErrBubble(getTime(),'error','系统出现错误，代码：' + result.err + '<br>请联系开发者。',tag)     
       chatContainer.removeChild(tempBubble)
       return
    }
    if (!result.ban) {
    console.log(result)
    let content = result.AISend.content
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
    chatContainer.removeChild(tempBubble)
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
 * `createChatBubble` 函数创建一个具有指定时间、发送者、内容、标签和元素 ID 的聊天气泡元素。
 * @param time - 创建聊天气泡的时间。
 * @param who - “who”参数代表聊天气泡的发送者。它可以是“用户”或“助理”。
 * @param content - `content` 参数代表聊天气泡的消息内容。它可以是包含气泡的文本消息或 HTML 内容的字符串。
 * @param tag - `tag` 参数用于指定聊天气泡的类型。它可以具有三个可能的值：“plus”、“custom”或“normal”。这些值确定聊天气泡的样式，并用于在助理消息旁边显示标签。
 * @param eid - `eid` 参数是一个可选参数，表示聊天气泡的 ID。它用于唯一标识每个聊天气泡元素。如果提供，聊天气泡元素将具有指定的 ID。
 * @returns 函数“createChatBubble”返回创建并附加到“chatContainer”的“chatBubble”元素。
 */
function createChatBubble(time,who,content,tag,eid,chatIndex) { 
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
    const chatBubbleMessage = document.createElement('p')
    chatBubble.setAttribute('chatIndex',chatIndex)
    if (eid) {
        chatBubble.id = eid
    }

    chatBubble.classList.add('chatBubble')
    chatBubble.classList.add(who)
    const markString = marked.parse(message);
    console.log(markString)
    let coded = markString
    let randomId = createCode()
    if (markString.includes('<pre>')) {
            coded = markString.replaceAll(`<pre>`,`<div class='codeRoot'><div class="preTitle"><p class="preLag preLeg${randomId}" id="preLeg${randomId}"></p>  <button class="copy-button" id="copy-button-${randomId}" title="点击复制"><span>复制</span></button></div><pre class="line-numbers">`).replaceAll(`</pre>`,'</pre></div>')
    }
    const inner = coded


    chatBubbleTime.textContent = time
    chatBubbleWho.innerHTML = `<b>${nameList[who]}</b>`
    chatBubbleTime.classList.add('chatBubbleTime')
    chatBubbleWho.classList.add('chatBubbleWho')
    chatBubbleMessage.classList.add('chatBubbleMessage')
    chatContainer.appendChild(chatBubble)
    chatBubble.appendChild(chatBubbleWho)
    chatBubble.appendChild(chatBubbleTime)
    if (who == 'assistant') {
        const chatBubbleTag = document.createElement('p')
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
        chatBubbleMessage.textContent = message
        const chatEditContainer = document.createElement('button')
        chatEditContainer.classList.add('chatEdit')
        chatEditContainer.title = `编辑`
        const chatEditBtn = document.createElement('span')
        chatEditBtn.classList.add('iconfont','icon-a-bianji-edit1')
        chatEditBtn.setAttribute('onclick',`editMessage("${eid}")`)
        chatEditBtn.style.fontSize = `1.1rem`
        chatBubble.appendChild(chatEditContainer)
        chatEditContainer.appendChild(chatEditBtn)
    } else {
        chatBubbleMessage.innerHTML = inner
    }
    if (message.includes('[control:weather]')) {
        createWeatherCube(chatBubble)
        chatBubbleMessage.textContent = ''
        chatBubbleMessage.innerHTML = ''
    }
    let height = Number(body.style.height.replaceAll('px','')) + chatBubble.clientHeight * 2
    console.log(height)
    body.style.height = `${height}px`
    Logo.style.display = 'none'
    const preLagElements = chatBubbleMessage.getElementsByClassName(`preLeg${randomId}`)
    if (preLagElements) {
        chatBubbleMessage.querySelectorAll('pre code').forEach(el => {
            const eid = 'C' + createCode()
            let innerEl = el.innerHTML
            el.innerHTML = innerEl.replaceAll('<br>','\n')
            el.parentElement.parentElement.firstElementChild.lastElementChild.setAttribute('data-clipboard-target',`#${eid}`)
            el.parentElement.parentElement.firstElementChild.lastElementChild.setAttribute('onclick',`document.getElementById('${eid}').parentElement.parentElement.parentElement.firstElementChild.lastElementChild.firstElementChild.textContent = '成功!'`)
            el.id = eid
            Prism.highlightElement(el);
        })
        const codeElements = chatBubbleMessage.getElementsByClassName('code-toolbar')
        for (i=0;i<codeElements.length;i++) {
            const language = codeElements[i].firstElementChild?.classList[1]?.replace('language-','').toUpperCase()
            preLagElements[i].textContent = language
        }
    };
        
    
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
    const tempTextInput = document.createElement('textarea')
    const oldMessage = oldElement.textContent
    console.log(oldMessage)
    oldMessageOfEdit = oldMessage
    tempTextInput.textContent = oldMessage
    tempTextInput.style.height = `${oldElement.clientHeight + 7}px`
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
    axios.get("https://chat.zero-ai.online/ai/weatherAPI/key")
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
   * 参数是一个布尔值，指示函数是否应该执行重新链接操作。如果“relink”为“true”，该函数将调用“relinkIO()”函数。如果“relink”为“false”或未提供，则不。
   */
  function refreshScreen(relink) {
    chatLog = []
    chatContainer.innerHTML = ''
    input.setAttribute('placeholder','滴滴滴…电波接收中——键入字符以唤起零…')
    Logo.style.display = 'block'
    canSend = true
    if (plus) {
        Logo.src = './AKETA SPACE GOLD.webp'
    } else {
        Logo.src = './AKETA SPACE-Fixed.webp'
    }
    tokens.textContent = `Tokens:0/${maxTokens}（来自OpenAI的限制）`  
    token = 0 
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    timeTitle = true
    body.style.height = window.screen.availHeight
    startTimeInterval()
    if (relink) {
    relinkIO()
    }
  }

socket.on(`messageUnfit`, (arg) => {
    console.log(arg)
    const html = `<p class="messageTip"><span class="iconfont icon-icon_line_close" style="margin-bottom: -35px;width: 20;height: 20;display: inline-block;margin-right: 10px;font-size:1rem;"></span>这条发言似乎有一些问题，监管AI认为此条言论不合适或违反了我们的使用声明（${arg.result.evaluation}），我们已推送该消息至后台管理人员处理。
    </p>`
    const message = document.getElementById(`prompt-${arg.mid}`)
    message.innerHTML += html
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
    createChatBubble(getTime(),`error`,`你的ID在${arg}个不同设备（或你的不同浏览器页面）上被登录，为双方安全与利益着想，现已掐停所有设备的链接，请刷新会话重试。`)
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
  });

  socket.on('disconnect', () => {
    netStauts.textContent = `链接终止`
    netStauts.style.color = `rgba(242,242,0,0.7)`
    console.log(`链接终止！`)
  });

  socket.on('error', () => {
    netStauts.textContent = `链接丢失`
    netStauts.style.color = `rgba(242,0,0,0.7)`
    console.log(`链接终止！`)
  });
showLoadLabel('通知预检测……')

function checkDoc() {
    const version = 1.5
    const docVersion = localStorage.getItem("docVersion")
    if (docVersion < version) {
        let id = `C${createCode()}`
        const chatBubble = createChatBubble(getTime(),'system',`Hello! 我们的使用声明进行了调整与升级，或者你这是第一次打开，请戳→<a style='text-decoration:underline;' href="./doc.html">显示使用声明</a><br>然后！继续使用 ZERO AI 服务将被视为同意使用声明。<br>悄咪咪告诉你！这条系统消息不会被 AI 视作会话记录的一部分，当然如果你看它不爽也可以直接点下方按钮删掉。`)
        chatBubble.id = id
        chatBubble.innerHTML += `<button class="btnInChat" style="margin-top:10px" id="" onclick="refreshScreen()">知道了呢！ <span class="iconfont icon-sure closeHideBtn"></span></button>`
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
}
checkACCESS()
async function checkACCESS() {
        if (!FreeAPIapply) {
            getACCESS('Login',true)
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
 * 值显示用户组信息。如果 UG 为 false，该函数将不会显示用户
 * @returns 一个 Promise 对象。
 */
async function getACCESS(message,UG) {
    return new Promise((resolve,rejects) => {
        let config = {
            method: 'post',
            url: 'https://chat.zero-ai.online/uuid/login',
            headers: { 
               'Content-Type': 'application/json'
            },
            data:{
                data:JSON.stringify(getClientInfo()),
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
                    showId.textContent = `ID:　#${localStorage.getItem('id')}`
                    sessionStorage.setItem('plusTime',plusTime)
                } else if (res.code == 202) {
                    localStorage.setItem('id',res.content)
                    showId.textContent += res.content
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
                }
                setPreload(false)
                console.log(res.plus)
                if (UG) {
                    showUG(res.plus || false ,localStorage.getItem('think') || false)
                }
                plusPermission = res.plus
                resolve(res.plus || false)
            }).catch((err) => {
                rejects()
                console.error(`upload info error:${err}`)
                createErrBubble(getTime(),'system',`获取访问许可时出现错误：${err}`,'','access')
            })
})}
/**
 * 函数“showUG”显示用户的会员资格状态和到期日期，并启用按钮以在用户具有 Plus 会员资格时显示警报消息。
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




    /**
     * 函数“getClientInfo()”收集各种设备和浏览器信息以进行验证。
     * @returns 函数“getClientInfo()”返回一个对象，其中包含有关客户端设备和环境的各种信息。返回的对象包含以下属性：
     */
    function getClientInfo() {
        showLoadLabel('收集用于验证的设备数据……')
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
          height:body.style.height
       }
    }
    const download = (filename, Url) => {
        let a = document.createElement('a'); 
        a.style = 'display: none'; // 创建一个隐藏的a标签
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
async function inputChat() {
    const fileInput = document.getElementById('chatInput');
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        refreshScreen()
        const jsonContent = JSON.parse(e.target.result);
        timeTitle = false
        HeaderTime.textContent = `会话存档于：${jsonContent.outputTime}`
        // 在这里可以处理解析后的JSON内容
        chatLog = jsonContent.data.chat
        createChatBubble(getTime(),'system',`以下内容为用户ID=${jsonContent.data.createBy}于${jsonContent.outputTime}导出的会话记录。<br>请不要点击任何会话中的超链接或任何可疑的可点击元素。我们不能保证该会话记录是否已被恶意窜改。<br>如有上述情况，请及时与我们反馈（report@thunder-drop.work）。`)
        chatContainer.innerHTML += jsonContent.data.element
        token = jsonContent.data.tokens
        body.style.height = jsonContent.data.height
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
     
function startLoad() {
    const one = document.getElementById('point1-load')
    const two = document.getElementById('point2-load')
    const three = document.getElementById('point3-load')

    setInterval(() => {
      one.style.opacity = '1'
      two.style.opacity = '0'
      three.style.opacity = '0'
      setTimeout(() => {
        one.style.opacity = '0'
        two.style.opacity = '1'
        three.style.opacity = '0'
        setTimeout(() => {
          one.style.opacity = '0'
          two.style.opacity = '0'
          three.style.opacity = '1'
          setTimeout(() => {
          one.style.opacity = '0'
          two.style.opacity = '0'
          three.style.opacity = '0'
            }, 325);
          }, 275);
      }, 275);
    }, 1425);
}
startLoad()


function consoleWarn() {
    createChatBubble(getTime(),'system','系统检测到你当前已打开浏览器控制台，根据<b>《用户使用声明》</b>相关规定，为保证用户与我们双方利益，已经对当前会话进行了紧急掐停。<br>请主动关闭浏览器控制台，我们有权封停您的账户。')
    chatLog = []
    sessionStorage.setItem('access','')
    let config = {
        method: 'post',
        url: `https://chat.zero-ai.online/ai/report`,
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

function createErrBubble(time,who,content,tag,type) {
    const randomId = 'E' + createCode();
    const button = `<br><button class="btnInChat" style="background-color:rgb(130,50,50);margin-top:20px;padding:10px" id="btnHide-${randomId}" onclick="reSend('${randomId}','${type || 'all'}')">重试 <span class="iconfont icon-ic_Refresh closeHideBtn"></span></button>`
    const errBubble = createChatBubble(time,who,content + button,tag)
    errBubble.id = randomId
    return randomId
}


/**
 * 函数“reSend”是 JavaScript 中的异步函数，它接受两个参数“errorBubbleId”和“type”，并根据“type”的值执行不同的操作。
 * @param errorBubbleId - `errorBubbleId` 参数是需要从聊天容器中删除的错误气泡的 ID。
 * @param type - “type”参数用于确定“reSend”函数中要采取的操作。它可以具有三个可能的值：“重新发送”、“访问”或“重新链接”。
 */
async function reSend(errorBubbleId,type) {
    if (type == 'resend') {
        inputByUser()
    } else if (type == 'access') {
        tempBubble = createChatBubble('Connecting','assistant',"<img src='./loading.gif' class='tempBubble'>")
        getACCESS(`重新申请`,false)
        .then(() => {
            chatContainer.removeChild(tempBubble)
        })
    } else if (type == 'relink') {
        relinkIO()
    } else {
        relinkIO()
        getACCESS(`重新申请`)
        .then((plus) => {
        inputByUser()
        })
    }
    if (errorBubbleId) {
    chatContainer.removeChild(document.getElementById(errorBubbleId))
    }
}




function relocatePromise() {
    let config = {
        method: 'post',
        url: `https://chat.zero-ai.online/uuid/relocate/promise`,
        headers: { 
           'Content-Type': 'application/json'
        },
        data:{
            id: localStorage.getItem('id'),
            cuid: localStorage.getItem('cuid'),
            docVer: localStorage.getItem('docVersion')
        },
        timeout: 36000000, 
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('access')}`
          }
        }
    axios(config).then((res) => {
        console.log(res.data)
        if (res.data) {
        console.log(`从服务端获取到迁移约定：${res.data}`)
        window.location.href = `https://chat.zero-ai.online/?promise=${res.data}`
        } else if (res.data.err){
            if (res.data.err = 1) {
                createChatBubble(getTime(),'error',`获取迁移约定时出现问题：传入的Cuid无效！`)
            } else {
                createChatBubble(getTime(),'error',`获取迁移约定时出现问题：传入的Id无效！`)
            }
        }
    })
}


function handleButtonClick(number) {
    window.api.menuClick(number)
}

