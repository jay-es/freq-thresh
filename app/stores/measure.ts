import { MEASURE_FREQS, MEASURE_STEP_DB, TEST_TONE_DBFS } from '~/constants/audio'

const EARS = ['left', 'right'] as const
type Ear = typeof EARS[number]

export const useMeasureStore = defineStore('measure', () => {
  const currentEarIndex = ref(0)
  const currentFreqIndex = ref(0)
  const currentDbfs = ref(TEST_TONE_DBFS)
  const lastHeardDbfs = ref<number | null>(null)
  const isComplete = ref(false)
  const results = ref<Array<Array<number | null>>>(
    [Array(MEASURE_FREQS.length).fill(null), Array(MEASURE_FREQS.length).fill(null)]
  )

  const totalSteps = MEASURE_FREQS.length * EARS.length
  const currentStep = computed(() =>
    currentEarIndex.value * MEASURE_FREQS.length + currentFreqIndex.value
  )
  const currentFreq = computed(() => MEASURE_FREQS[currentFreqIndex.value])
  const currentEar = computed((): Ear => EARS[currentEarIndex.value])

  function startMeasure(): void {
    currentEarIndex.value = 0
    currentFreqIndex.value = 0
    currentDbfs.value = TEST_TONE_DBFS
    lastHeardDbfs.value = null
    isComplete.value = false
    results.value = [Array(MEASURE_FREQS.length).fill(null), Array(MEASURE_FREQS.length).fill(null)]
    const { startSineTone } = useAudio()
    startSineTone(currentFreq.value, currentDbfs.value, currentEar.value)
  }

  function canHear(): void {
    lastHeardDbfs.value = currentDbfs.value
    currentDbfs.value -= MEASURE_STEP_DB
    const { startSineTone } = useAudio()
    startSineTone(currentFreq.value, currentDbfs.value, currentEar.value)
  }

  function cannotHear(): void {
    results.value[currentEarIndex.value][currentFreqIndex.value] = lastHeardDbfs.value
    advance()
  }

  function advance(): void {
    if (currentFreqIndex.value < MEASURE_FREQS.length - 1) {
      currentFreqIndex.value++
    }
    else if (currentEarIndex.value < EARS.length - 1) {
      currentEarIndex.value++
      currentFreqIndex.value = 0
    }
    else {
      const { stopSineTone } = useAudio()
      stopSineTone()
      isComplete.value = true
      return
    }
    currentDbfs.value = TEST_TONE_DBFS
    lastHeardDbfs.value = null
    const { startSineTone } = useAudio()
    startSineTone(currentFreq.value, currentDbfs.value, currentEar.value)
  }

  return {
    EARS,
    MEASURE_FREQS,
    currentEarIndex,
    currentFreqIndex,
    currentDbfs,
    lastHeardDbfs,
    isComplete,
    results,
    totalSteps,
    currentStep,
    currentFreq,
    currentEar,
    startMeasure,
    canHear,
    cannotHear
  }
})
