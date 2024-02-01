// upgrade.html
let openStats = ''

function openTips(id,mobile) {
    const parentElement = document.getElementById(id)
    const TipsElement = document.getElementById('tips')
    const TipsContent = document.getElementById('tipsContent')
    const contentList = {
        "free-api":"允许用户填写自己的 ChatGPT API 秘钥，这可以允许您在使用自己账户配额的情况下使用任意模型，该情况下不具有系统 Prompt，将 ZERO AI 作为 API 接入器使用。但我们不具有保护您秘钥安全的义务。",
        "full-ai":"我们为 ZERO AI 精心设计了一套系统，使他可以在早、中、晚时主动问候您，在有突发事件时为您提供更多信息等更加人性化的机制，前提是您需要使 ZERO AI 保持在后台运行。更多信息，请等待后续开发。",
        "think":"这兴许是一个全新的概念？我们培养 AI 在回答问题时进行反复的思考与纠错，并且提供他的思考过程给您，不出意外时这将会大幅提高正确率。但代价是需要等待 AI 回答的时间更久。",
        "memory":"将一些内容储存在“记忆”中，使其永久保活。注意：该功能仍在测试中，对于 AI 会决定储存什么内容到“记忆”中，我们不做任何承诺，但通常来说，在会话刚发起时使用可能效果较好。"
    }
    if (openStats !== id) {
        openStats = id
    const top = parentElement.getBoundingClientRect().top
    const left = parentElement.getBoundingClientRect().left
    const y = top - 50
    TipsElement.style.top = y
    TipsElement.style.display = 'block'
    let i = 0.09
    let v = 0.0
    const interval = setInterval(() => {
        i += 0.001
        v += 0.1
        if (mobile) {
        var x = left + i*window.innerWidth
        } else {
        var x = left - i*window.innerWidth
        }
        TipsElement.style.left = x
        TipsElement.style.opacity = v
        if (i >= 0.12) {
            clearInterval(interval)
        }
    }, 5);
    TipsContent.innerHTML = contentList[id]
} else {
    closeTips()
}
}

function closeTips() {
    const TipsElement = document.getElementById('tips')
    TipsElement.style.top = 0
    TipsElement.style.left = 0
    TipsElement.style.display = 'none'
    TipsElement.style.opacity = 0
    openStats = ''
}

window.onload = function() {
    // 网页加载完成后执行的操作
    console.log("页面加载完成！");
    const readyOnLoad = document.getElementById('readyOnLoad')
    if (readyOnLoad) {
    readyOnLoad.style.animation = 'loadReady 1s ease-in-out'
    setTimeout(() => {
        readyOnLoad.style.display = 'none'
    }, 1000);
    }
  };

