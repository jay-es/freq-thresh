export const useAudioStore = defineStore('audio', () => {
  const isPlaying = ref(false)

  function toggleWhiteNoise(): void {
    const { startWhiteNoise, stopWhiteNoise } = useAudio()
    if (isPlaying.value) {
      stopWhiteNoise()
    } else {
      startWhiteNoise()
    }
    isPlaying.value = !isPlaying.value
  }

  return { isPlaying, toggleWhiteNoise }
})
