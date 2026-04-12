<script setup lang="ts">
const audioStore = useAudioStore()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UCard class="max-w-lg w-full">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-ear"
            class="size-7 text-primary shrink-0"
          />
          <h1 class="text-2xl font-bold tracking-tight">
            FreqThresh
          </h1>
        </div>
      </template>

      <div class="space-y-6">
        <p class="text-muted">
          各周波数の最小可聴レベルを測定します。<br>
          再生機器の周波数特性が結果に影響するため、フラットな特性のヘッドフォンまたはスピーカーを使用してください。
        </p>

        <div class="space-y-2">
          <p class="text-sm font-medium">
            音量を調整する
          </p>
          <p class="text-sm text-muted">
            テストトーンを再生して、測定に適した音量に設定してください。
          </p>
          <UButton
            :icon="audioStore.isPlaying ? 'i-lucide-square' : 'i-lucide-volume-2'"
            :label="audioStore.isPlaying ? '停止' : 'テストトーンを再生'"
            :color="audioStore.isPlaying ? 'error' : 'neutral'"
            variant="outline"
            @click="audioStore.toggleWhiteNoise()"
          />
        </div>

        <UButton
          label="テストを開始"
          color="primary"
          size="lg"
          class="w-full"
          trailing-icon="i-lucide-arrow-right"
          @click="navigateTo('/measure')"
        />
      </div>
    </UCard>
  </div>
</template>
