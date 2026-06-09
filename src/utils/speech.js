// 语音合成工具 - Web Speech API 封装
// 自动选择最佳中文语音，Apple风格语速

let cachedVoice = null

/**
 * 获取最佳中文语音
 * 优先级：Ting-Ting(Mac) > Microsoft YaXiao > Google 中文 > 任意中文
 */
function getBestChineseVoice() {
  if (cachedVoice) return cachedVoice

  const voices = window.speechSynthesis.getVoices()

  // 1. Apple Ting-Ting (macOS)
  cachedVoice = voices.find(v =>
    v.lang.startsWith('zh') && v.name.includes('Ting')
  )
  if (cachedVoice) return cachedVoice

  // 2. Apple 中文（其他）
  cachedVoice = voices.find(v =>
    v.lang.startsWith('zh-CN') && v.name.includes('Apple')
  )
  if (cachedVoice) return cachedVoice

  // 3. Microsoft YaXiao / Kangkang
  cachedVoice = voices.find(v =>
    v.lang.startsWith('zh') && (v.name.includes('YaXiao') || v.name.includes('Kangkang'))
  )
  if (cachedVoice) return cachedVoice

  // 4. Google 中文
  cachedVoice = voices.find(v =>
    v.lang.startsWith('zh-CN') && v.name.includes('Google')
  )
  if (cachedVoice) return cachedVoice

  // 5. 任意中文
  cachedVoice = voices.find(v => v.lang.startsWith('zh-CN'))
  if (cachedVoice) return cachedVoice

  // 6. 任意中文（不限定地区）
  cachedVoice = voices.find(v => v.lang.startsWith('zh'))

  return cachedVoice
}

/**
 * 播放语音解说
 * @param {string} text - 要朗读的文本
 * @param {object} options - 可选参数
 * @param {number} options.rate - 语速 (0.5~2, 默认1)
 * @param {number} options.pitch - 音调 (0.5~2, 默认1)
 * @param {number} options.volume - 音量 (0~1, 默认0.8)
 */
export function speak(text, options = {}) {
  if (!window.speechSynthesis) {
    console.warn('Web Speech API 不可用')
    return
  }

  // 先取消正在播放的语音
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)

  const voice = getBestChineseVoice()
  if (voice) {
    utterance.voice = voice
  }

  utterance.lang = 'zh-CN'
  utterance.rate = options.rate || 1.0
  utterance.pitch = options.pitch || 1.0
  utterance.volume = options.volume || 0.8

  window.speechSynthesis.speak(utterance)

  return utterance
}

/**
 * 停止语音播放
 */
export function stopSpeak() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

/**
 * 检查语音是否可用
 */
export function isSpeechAvailable() {
  return typeof window !== 'undefined' && !!window.speechSynthesis
}

/**
 * 预加载语音列表（某些浏览器需要异步加载）
 */
export function preloadVoices() {
  if (!window.speechSynthesis) return
  // 触发语音列表加载
  window.speechSynthesis.getVoices()
  // Chrome 需要监听事件
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices()
  }
}
