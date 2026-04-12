import { TEST_TONE_DBFS, WHITE_NOISE_BUFFER_SEC } from '~/constants/audio'

let ctx: AudioContext | null = null
let sourceNode: AudioBufferSourceNode | null = null
let gainNode: GainNode | null = null

export function useAudio() {
  function getContext(): AudioContext {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
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
    sourceNode?.stop()
    sourceNode?.disconnect()
    gainNode?.disconnect()
    sourceNode = null
    gainNode = null
  }

  return { startWhiteNoise, stopWhiteNoise }
}
