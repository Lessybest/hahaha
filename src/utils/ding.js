// Web Audio API 音效生成器
// 生成清脆的"叮"确认音（类似Apple支付成功音效）

let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

/**
 * 播放"叮"确认音
 * 频率组合：E6(1318Hz) + G#6(1568Hz) + B6(1976Hz) 和弦
 * 持续时间：0.15秒，快速衰减
 */
export function playDing() {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  const now = ctx.currentTime

  // 三个音符组成和弦
  const frequencies = [1318.51, 1567.98, 1975.53] // E6, G#6, B6

  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)

    // 快速起音，自然衰减
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.25, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now + i * 0.008) // 轻微错开，更有层次
    osc.stop(now + 0.25)
  })
}

/**
 * 播放开始音（上行音阶）
 */
export function playStart() {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  const now = ctx.currentTime
  const notes = [523.25, 659.25, 783.99, 1046.50] // C5 E5 G5 C6 上行

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)

    gain.gain.setValueAtTime(0, now + i * 0.08)
    gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now + i * 0.08)
    osc.stop(now + 0.5)
  })
}

/**
 * 播放完成音（下行和弦 + 持续）
 */
export function playComplete() {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  const now = ctx.currentTime
  const frequencies = [1046.50, 783.99, 523.25] // C6 G5 C5 下行

  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.25, now + 0.02)
    gain.gain.setValueAtTime(0.25, now + 0.25)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.8)
  })
}

/**
 * 检查音效是否可用
 */
export function isAudioAvailable() {
  return typeof window !== 'undefined' && 
    (window.AudioContext || window.webkitAudioContext)
}
