<script setup lang="ts">
import { freqLabel } from '~/utils/format'

const measureStore = useMeasureStore()

const progress = computed(() => measureStore.currentStep + 1)

const earLabel = computed(() => measureStore.currentEar === 'left' ? '左耳' : '右耳')
const currentFreqLabel = computed(() => freqLabel(measureStore.currentFreq))

onMounted(() => {
  measureStore.startMeasure()
})

onUnmounted(() => {
  const { stopSineTone } = useAudio()
  stopSineTone()
})

watch(() => measureStore.isComplete, (complete: boolean) => {
  if (!complete) return
  const encode = (arr: Array<number | null>) => arr.map(v => v !== null ? String(v) : '').join(',')
  const freqs = measureStore.MEASURE_FREQS.join(',')
  navigateTo(`/results?freqs=${freqs}&l=${encode(measureStore.results[0] ?? [])}&r=${encode(measureStore.results[1] ?? [])}`)
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UCard class="max-w-lg w-full">
      <template #header>
        <div class="flex items-center justify-between">
          <UButton
            icon="i-lucide-arrow-left"
            variant="ghost"
            color="neutral"
            @click="navigateTo('/')"
          />
          <span class="text-sm font-medium text-muted">FreqThresh</span>
          <div class="size-8" />
        </div>
      </template>

      <div class="space-y-8">
        <div class="space-y-2">
          <div class="flex justify-between text-sm text-muted">
            <span>{{ progress }} / {{ measureStore.totalSteps }}</span>
          </div>
          <UProgress
            v-model="progress"
            :max="measureStore.totalSteps"
          />
        </div>

        <div class="text-center space-y-1">
          <p class="text-2xl font-bold">
            {{ earLabel }} — {{ currentFreqLabel }}
          </p>
        </div>

        <div class="text-center">
          <p class="text-muted">
            音が聞こえますか？
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <UButton
            label="聞こえる"
            color="primary"
            size="lg"
            icon="i-lucide-check"
            @click="measureStore.canHear()"
          />
          <UButton
            label="聞こえない"
            color="neutral"
            variant="outline"
            size="lg"
            icon="i-lucide-x"
            @click="measureStore.cannotHear()"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
