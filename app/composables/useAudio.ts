import { TEST_TONE_DBFS, WHITE_NOISE_BUFFER_SEC } from '~/constants/audio'

export type Ear = 'left' | 'right'

let ctx: AudioContext | null = null
let sourceNode: AudioBufferSourceNode | null = null
let gainNode: GainNode | null = null
let sineSource: OscillatorNode | null = null
let sineGain: GainNode | null = null
let sinePanner: StereoPannerNode | null = null
let sineBeepTimer: ReturnType<typeof setInterval> | null = null

export function useAudio() {
  function getContext(): AudioContext {
    try {
      if (!ctx) ctx = new AudioContext()
      if (ctx.state === 'suspended') ctx.resume()
      return ctx
    } catch {
      throw new Error('AudioContext の初期化に失敗しました。ブラウザが対応していない可能性があります。')
    }
  }

  function startWhiteNoise(): void {
    const context = getContext()
    const length = context.sampleRate * WHITE_NOISE_BUFFER_SEC
    const buffer = context.createBuffer(1, length, context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1

    gainNode = context.createGain()
    gainNode.gain.value = 10 ** (TEST_TONE_DBFS / 20)
    gainNode.connect(context.destination)

    sourceNode = context.createBufferSource()
    sourceNode.buffer = buffer
    sourceNode.loop = true
    sourceNode.connect(gainNode)
    sourceNode.start()
  }

  function stopWhiteNoise(): void {
    try {
      sourceNode?.stop()
    } catch { /* already stopped */ }
    sourceNode?.disconnect()
    gainNode?.disconnect()
    sourceNode = null
    gainNode = null
  }

  function startSineTone(freq: number, dbfs: number, ear: Ear): void {
    stopSineTone()
    const context = getContext()

    sineGain = context.createGain()
    sineGain.gain.value = 0

    sinePanner = context.createStereoPanner()
    sinePanner.pan.value = ear === 'left' ? -1 : 1

    sineSource = context.createOscillator()
    sineSource.type = 'sine'
    sineSource.frequency.value = freq
    sineSource.connect(sineGain)
    sineGain.connect(sinePanner)
    sinePanner.connect(context.destination)
    sineSource.start()

    // ピーピーピー、ピーピーピー… パターン
    const amplitude = 10 ** (dbfs / 20)
    const onSec = 0.25 // 1ビープの長さ
    const offSec = 0.15 // ビープ間の無音
    const count = 3 // 1グループのビープ数
    const gapSec = 1 // グループ間の無音
    const delaySec = 0.4 // 開始までの遅延
    const lookaheadSec = 1.5 // 先読み幅
    const scheduleIntervalMs = 500 // スケジューラーの見回り頻度
    const period = count * (onSec + offSec) + gapSec
    let nextTime = context.currentTime + delaySec

    const scheduleGroup = () => {
      const g = sineGain!.gain
      const lookahead = context.currentTime + lookaheadSec
      while (nextTime < lookahead) {
        let t = nextTime
        for (let i = 0; i < count; i++) {
          g.setValueAtTime(amplitude, t)
          g.setValueAtTime(0, t + onSec)
          t += onSec + offSec
        }
        nextTime += period
      }
    }

    scheduleGroup()
    sineBeepTimer = setInterval(scheduleGroup, scheduleIntervalMs)
  }

  function stopSineTone(): void {
    if (sineBeepTimer !== null) {
      clearInterval(sineBeepTimer)
      sineBeepTimer = null
    }
    try {
      sineSource?.stop()
    } catch { /* already stopped */ }
    sineSource?.disconnect()
    sineGain?.disconnect()
    sinePanner?.disconnect()
    sineSource = null
    sineGain = null
    sinePanner = null
  }

  return { startWhiteNoise, stopWhiteNoise, startSineTone, stopSineTone }
}
