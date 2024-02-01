
const setAPI = document.getElementById('setAPI')
const saveTips = document.getElementById('setAPIsaveTips')
const apiInput = document.getElementById('apiInput')
const modelInput = document.getElementById('modelInput')
const adressInput = document.getElementById('adressInput')
const applyStats = document.getElementById('setAPIstats')
FreeAPIapply = boolean[localStorage.getItem('freeAPI-apply')]
console.log(`自由接口状态：${FreeAPIapply}`) 
showLoadLabel('检测自由接口状态')
function toggleFreeAPIMenu() {
    if (setAPI.style.display == 'block') {
        setAPI.style.animation = 'closeFreeAPIMenu 0.1s ease-in-out'
        setTimeout(() => {
            setAPI.style.animation = ''
            setAPI.style.display = 'none'
        }, 100);
    } else {
        setAPI.style.display = 'block'
        apiInput.value = localStorage.getItem('freeAPI-api') || 'sk-'
        modelInput.value = localStorage.getItem('freeAPI-model') || ''
        adressInput.value = localStorage.getItem('freeAPI-adress') || 'https://api.openai.com/v1/chat/completions'
    setAPI.style.display = 'block'
    setAPI.style.animation = 'toggleFreeAPIMenu 0.1s ease-in-out'
    setTimeout(() => {
        setAPI.style.animation = ''
    }, 100);
    }
    saveTips.textContent = ''
}

function saveFreeAPIConfig() {
    const api = apiInput.value
    const model = modelInput.value
    const address = adressInput.value
    localStorage.setItem('freeAPI-api',api)
    localStorage.setItem('freeAPI-model',model)
    localStorage.setItem('freeAPI-adress',address)
    saveTips.textContent = '保存成功'
}

{
    if (boolean[localStorage.getItem('freeAPI-apply')]) {
        applyStats.textContent = '当前状态：开启'
        applyStats.style.backgroundColor = 'rgba(100,255,100,0.5)'
        FreeAPIapply = true

    } else {
        applyStats.textContent = '当前状态：关闭'
        applyStats.style.backgroundColor = 'rgba(255,100,100,0.5)'
        FreeAPIapply = false
    }
}

function applyToggleFreeAPI() {
    if (localStorage.getItem('freeAPI-apply') == 'true') {
        localStorage.setItem('freeAPI-apply','false')
        FreeAPIapply = false
        applyStats.textContent = '当前状态：关闭'
        applyStats.style.backgroundColor = 'rgba(255,100,100,0.5)'
    } else {
        localStorage.setItem('freeAPI-apply','true')
        FreeAPIapply = true
        applyStats.textContent = '当前状态：开启'
        applyStats.style.backgroundColor = 'rgba(100,255,100,0.5)'
    }
}



function freeAPISend() {
    return new Promise((resolve, reject) => {
    const ip = '0.0.0.0'

    let userSend = {
       "ip":ip,
       "time":getTime(),
       "content":chatLog,
       "user": "user"
     }
     console.log(userSend)
     var data = {
    "model": localStorage.getItem('freeAPI-model'),
    "messages": chatLog,
 
 };
 var config = {
    method: 'post',
    url: localStorage.getItem('freeAPI-adress') || 'https://api.openai.com/v1/chat/completions',
    headers: { 
       'Authorization': 'Bearer ' + localStorage.getItem('freeAPI-api'), 
       'User-Agent': 'Apifox/1.0.0 (https://apifox.com)', 
       'Content-Type': 'application/json'
    },
    data: data,
 };
 axios(config)
 .then(function (response) {
    console.log(JSON.stringify(response.data))
    if (response.data.choices[0].finish_reason == 'stop') {
    let AISend = {
       "ip":ip,
       "time":getTime(),
       "content": response.data.choices[0].message.content,
       "user":"assistant"
     }    
     console.log(AISend)
     const result = {
       userSend: userSend,
       AISend: AISend
     }
     resolve(result);
    }
    })
 .catch(function (error) {
    reject(error);
 });
 })};