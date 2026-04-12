<script setup lang="ts">
const measureStore = useMeasureStore()

const progress = computed(() => measureStore.currentStep + 1)

const earLabel = computed(() => measureStore.currentEar === 'left' ? '左耳' : '右耳')
const freqLabel = computed(() => {
  const hz = measureStore.currentFreq
  return hz >= 1000 ? `${hz / 1000}kHz` : `${hz}Hz`
})

onMounted(() => {
  measureStore.startMeasure()
})

onUnmounted(() => {
  const { stopSineTone } = useAudio()
  stopSineTone()
})

watch(() => measureStore.isComplete, (complete: boolean) => {
  if (complete) navigateTo('/results')
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
            {{ earLabel }} — {{ freqLabel }}
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
