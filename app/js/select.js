
let cruiseMode = boolean[localStorage.getItem('cruiseMode') || 'false']
let plus = boolean[localStorage.getItem('plus') || 'false']
let think = boolean[localStorage.getItem('think') || 'false']
let saveWhenLeft = boolean[localStorage.getItem('saveWhenLeft') || 'false']
thinkModeSwitch.checked = boolean[localStorage.getItem('think') || 'false']
cruiseModeSwitch.checked = boolean[localStorage.getItem('cruiseMode') || 'false']
leftSaveModeSwitch.checked = boolean[localStorage.getItem('saveWhenLeft') || 'false']
sttModeSwitch.checked = boolean[localStorage.getItem('sttp') || 'true']
log(5,`Set cruiseMode mode: ${cruiseMode}`)
log(5,`Set plus mode: ${plus}`)
log(5,`Set think mode: ${think}`)
log(5,`Set saveWhenLeft mode: ${saveWhenLeft}`)
log(5,`Set stt mode: ${sttModeSwitch.checked}`)

  // 设置 Plus 模式开关状态的函数
/**
 * 函数“setPlusModeSwitch”根据“isEnabled”的值启用或禁用开关，并相应地更新徽标和令牌计数。
 * @param isEnabled - `isEnabled` 参数是一个布尔值，用于确定是否应启用或禁用 plus
 * 模式开关。如果“isEnabled”为“true”，则加号模式开关将启用，用户可以选择它。如果 isEnabled 为 false，则 plus 模式开关将被禁用，并且
 */
  function setPlusModeSwitch(isEnabled) {
    log(5,`Set plus mode: ${isEnabled}`)
    // 如果 isEnabled 为 true，则设置为可选择
    plusModeSwitch.disabled = !isEnabled;
    cruiseModeSwitch.disabled = !isEnabled;
    
    if (isEnabled && plus) {
    plusModeSwitch.checked = true;
    } else {
      plusModeSwitch.checked = false
    }

    if (isEnabled && cruiseMode) {
      cruiseModeSwitch.checked = true;
      } else {
        cruiseModeSwitch.checked = false
      }

    if (plusModeSwitch.checked) {
      mainScreen.style.backgroundImage = `url('./AKETA SPACE GOLD.webp')`
      maxTokens = 128000
    } else {
      mainScreen.style.backgroundImage = `url('./AKETA SPACE-Fixed.webp')`
      maxTokens = 16385
    }
    tokens.textContent = `Tokens:0/${maxTokens}`  
    console.log(`获取 plus 模式权限:${isEnabled}`)
      
  thinkModeSwitch.addEventListener("change",(event) => {
    if (thinkModeSwitch.checked !== think) {
      log(5, `Set think mode: ${thinkModeSwitch.checked}`)
      refreshScreen()
      think = thinkModeSwitch.checked
      localStorage.setItem('think',think)
    }
    
  })

  cruiseModeSwitch.addEventListener("change", async (event) => {
    if (plusPermission) {
    if (cruiseModeSwitch.checked !== cruiseMode) {
      log(5, `Set cruise mode: ${cruiseMode.checked}`)
      cruiseMode = cruiseModeSwitch.checked;
      localStorage.setItem('cruiseMode',cruiseModeSwitch.checked);
      cruiseModeSwitch.disabled = !plusPermission;
      console.log(`设置巡航模式:${cruiseModeSwitch.checked}`);
      taskBtn.disabled = !cruiseModeSwitch.checked
      if (cruiseModeSwitch.checked) {
        taskBtn.title = `零个、一个或多个事项正在计时中…`
        taskWarn.textContent = `零个、一个或多个事项正在计时中……`
      } else {
        taskBtn.title = `日程系统仅能在巡航模式下工作。`
        taskWarn.textContent = `日程系统仅能在巡航模式下工作。`
        if ((await window.api.allTask()).length > 0) {
          taskBtn.title = `一个或多个事项正在计时中，但日程系统仅能在巡航模式下工作。`
          taskWarn.textContent = `一个或多个事项正在计时中，但日程系统仅能在巡航模式下工作。`
        }
      }
     linkIO()
    }
  } else {
    cruiseModeSwitch.disabled = true
    cruiseModeSwitch.checked = false
    cruiseMode = false
    localStorage.setItem('cruiseMode',false)
    taskBtn.disabled = true
    taskBtn.title = `日程系统仅能在巡航模式下工作。`
    taskWarn.textContent = `日程系统仅能在巡航模式下工作。`
  }
    
  })
  
  plusModeSwitch.addEventListener("change", (event) => {
    testPlusMode() 
  });

  leftSaveModeSwitch.addEventListener("change", (event) => {
    ToggleleftSaveMode()
  })

  }

/**
 * 函数“testPlusMode”用于处理切换Plus模式开关时的逻辑和行为。
 */
  function testPlusMode() {
    if (plus !== plusModeSwitch.checked) {
      refreshScreen()
    }

    if (plusModeSwitch.checked == false) {
    thinkModeSwitch.checked = false
    thinkModeSwitch.disabled = true

  }
  if (plusModeSwitch.checked == true) {
    thinkModeSwitch.disabled = false
  }
  localStorage.setItem('plus',plusModeSwitch.checked)
  localStorage.setItem("think",thinkModeSwitch.checked)
  localStorage.setItem("cruiseMode",cruiseModeSwitch.checked)  
  localStorage.setItem("sttp",sttModeSwitch.checked)
  log(5,`Set cruiseMode mode: ${cruiseMode}`)
  log(5,`Set plus mode: ${plus}`)
  log(5,`Set think mode: ${think}`)
  log(5,`Set stt mode: ${sttModeSwitch.checked}`)
  plus = plusModeSwitch.checked
  think = thinkModeSwitch.checked
  cruiseMode = cruiseModeSwitch.checked
  if (plus) {
    mainScreen.style.backgroundImage = `url('./AKETA SPACE GOLD.webp')`
    maxTokens = 128000
  } else {
    mainScreen.style.backgroundImage = `url('./AKETA SPACE-Fixed.webp')`
    maxTokens = 16385
  }
  tokens.textContent = `Tokens:0/${maxTokens}`
  } 

  sttModeSwitch.addEventListener("change", (event) => {
    localStorage.setItem('sttp',sttModeSwitch.checked)
    log(5,`Set stt mode: ${sttModeSwitch.checked}`)
    createErrBubble(getTime(),'system',`重启以应用该操作。`,null,'restart')
  })

  const selectContainer = document.getElementById('select-container')
  const moreButton = document.getElementById('more-icon')
/**
 * 函数toggleSelectMenu 用于切换选择菜单的显示并更改按钮的图标。
 */
function toggleSelectMenu() {
  if (taskContainer.style.display == 'block') {
    toggleTaskMenu()
    return
  }
    if (selectContainer.style.display == 'block') {
      moreButton.classList.add('icon-gengduo-xian')
      moreButton.classList.remove('icon-back')
      moreButton.title = `More Setting`
      selectContainer.style.animation = 'closeSelectMenu 0.1s ease-in-out'
      selectContainer.style.right = '-20%'
      setTimeout(() => {
          selectContainer.style.animation = ''
          selectContainer.style.display = 'none'
      }, 100);

    } else {
          selectContainer.style.display = 'block'
          selectContainer.style.right = '0'
          selectContainer.style.animation = 'toggleSelectMenu 0.1s ease-in-out'
          setTimeout(() => {
              selectContainer.style.animation = ''
          }, 100);
          moreButton.classList.remove('icon-gengduo-xian')
          moreButton.classList.add('icon-back')
          moreButton.title = `Back To Main`
    }

}



main.addEventListener("click", function(event) {
  closeWhenClickOther()
});
inputContainer.addEventListener("click", function(event) {
  closeWhenClickOther()
});
savesContainer.addEventListener("click", function(event) {
  closeWhenClickOther()
})
function closeWhenClickOther() {
  if (selectContainer.style.display == 'block') {
    toggleSelectMenu()
    }
    if (giftCode.style.display == 'block') {
    toggleCodeMenu()
    }
    if (setAPI.style.display == 'block') {
    toggleFreeAPIMenu()
    }
    if (PromptMenu.style.display == 'block') {
      togglePromptMenu()
    }
    if (taskContainer.style.display == 'block') {
      toggleTaskMenu()
    }
}


// 兑换码
const giftsTypes = {
  'plus':"Plus ZERO"
}

const giftCode = document.getElementById('giftCode')
const codeInput = document.getElementById('code-input')
function toggleCodeMenu() {
  if (giftCode.style.display == 'block') {
    giftCode.style.animation = 'closeCodeMenu 0.1s ease-in-out'
    setTimeout(() => {
        giftCode.style.animation = ''
        giftCode.style.display = 'none'
    }, 100);  } else {
    giftCode.style.display = 'block'
    giftCode.style.animation = 'toggleCodeMenu 0.1s ease-in-out'
    setTimeout(() => {
        giftCode.style.animation = ''
    }, 100);

  }
}

window.api.giftCode(async (code) => {
  if (code) {
    codeInput.value = code;
    await GiftCode(true)
  }
})

/**
 * GiftCode 函数检查礼品代码的有效性，并根据结果显示相应的消息。
 */
async function GiftCode(doNotClose) {
  return new Promise((resolve, reject) => {
  let tempCodeBubble
  const code = codeInput.value
  if (code) {
      tempCodeBubble = appendChatBubble('Waiting',"system",`正在核对你的兑换码信息。`)
      const status = document.getElementById('codeStatus')
      status.textContent = `请稍后，正在核对你的兑换码`
      status.style.backgroundColor = `black`
      log(5,`Checking gift code ${code}`)
    axios.get(`${root_url}/code?id=${localStorage.getItem('id')}&code=${code}`)
    .then((res) => {
      chatContainer.removeChild(tempCodeBubble)
      const result = res.data;
      console.log(result)
      if (result.code == 200) {
        const gift = result.content.gift
        log(5,`Gift code ${code} is valid: ${JSON.stringify(gift)}`)
        appendChatBubble(getTime(),'system',`使用兑换码成功！包含${giftsTypes[gift.type]}×${gift.time}小时（${(gift.time / 24).toFixed(2)}天）<br>有效期至${result.content.time}`)
        codeInput.value = ""
        status.textContent = ``
        status.backgroundColor = ``
        if (!doNotClose) toggleCodeMenu()
        getACCESS('giftCode',true)
      } else {
        log(2,`Gift code ${code} is invalid`)
        appendChatBubble(getTime(),'system',`${result.content}`)
      }
      resolve(gift)
    })
    .catch((err) => {
      log(3,`Checking gift code ${code} error: ${err}`)
      chatContainer.removeChild(tempCodeBubble)
      appendChatBubble(getTime(),'error',`发生异常错误：${err.code}<br>请联系开发者。`)
      codeInput.value = ""
      toggleCodeMenu()
      reject(err)
    })
  }
})

}



function togglePromptMenu() {
  if (PromptMenu.style.display == 'block') {
    PromptMenu.style.animation = 'closeCodeMenu 0.1s ease-in-out'
    setTimeout(() => {
      PromptMenu.style.animation = ''
      PromptMenu.style.display = 'none'
    }, 100);
  } else {
      if (plusPermission) {
      PromptInput.value = localStorage.getItem('customPrompt') || ''
      PromptMenu.style.display = 'block'
      PromptMenu.style.animation = 'toggleCodeMenu 0.1s ease-in-out'
    setTimeout(() => {
      PromptMenu.style.animation = ''
    }, 100);
  }
  }
}

function setPrompt() {
  const input = PromptInput.value
  localStorage.setItem('customPrompt',input)
  log(5,`Set custom prompt to ${input}`)
  window.location.reload()
}


function ToggleleftSaveMode() {
  localStorage.setItem('saveWhenLeft',leftSaveModeSwitch.checked)
  log(5,`Set leftSave mode to ${leftSaveModeSwitch.checked}`)
}



const taskContainer = document.getElementById('task-container')
const taskBtn = document.getElementById('task-button')

function toggleTaskMenu() {

  if (taskContainer.style.display == 'block') {
    taskContainer.style.animation = 'closeSelectMenu 0.1s ease-in-out'
    taskContainer.style.right = '-20%'
    setTimeout(() => {
      taskContainer.style.animation = ''
      taskContainer.style.display = 'none'
    }, 100);
    moreButton.classList.add('icon-gengduo-xian')
    moreButton.classList.remove('icon-back')
    moreButton.title = `More Setting`
  } else {

    taskContainer.style.display = 'block'
    taskContainer.style.right = '0'
    taskContainer.style.animation = 'toggleSelectMenu 0.1s ease-in-out'
        setTimeout(() => {
          taskContainer.style.animation = ''
        }, 100);
      moreButton.classList.remove('icon-gengduo-xian')
      moreButton.classList.add('icon-back')
      moreButton.title = `Back To Main`
      taskWave.style.display = 'none'
      taskBtn.style.boxShadow = ''
  }
}


