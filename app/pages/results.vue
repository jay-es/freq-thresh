<script setup lang="ts">
import { freqLabel } from '~/utils/format'

const route = useRoute()
const toast = useToast()

function decodeList(param: unknown): Array<number | null> {
  if (typeof param !== 'string' || param === '') return []
  return param.split(',').map((s) => {
    if (s === '') return null
    const n = Number(s)
    return Number.isFinite(n) ? n : null
  })
}

const freqs = computed(() => decodeList(route.query.freqs).filter((v): v is number => v !== null))
const leftResults = computed(() => decodeList(route.query.l))
const rightResults = computed(() => decodeList(route.query.r))

const baseline = computed(() => {
  const all = [...leftResults.value, ...rightResults.value].filter((v): v is number => v !== null)
  return all.length > 0 ? Math.min(...all) : null
})

function formatDbfs(value: number | null | undefined): string {
  if (value == null || baseline.value === null) return '－'
  const rel = value - baseline.value
  return `+${rel} dB`
}

async function share(): Promise<void> {
  try {
    await navigator.clipboard.writeText(window.location.href)
    toast.add({ title: 'URLをコピーしました', icon: 'i-lucide-link' })
  } catch {
    toast.add({ title: 'コピーに失敗しました', icon: 'i-lucide-alert-circle', color: 'error' })
  }
}
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
            測定結果
          </h1>
        </div>
      </template>

      <div class="space-y-6">
        <p class="text-sm text-muted">
          最小可聴レベルを +0 dB として表示しています。値が大きいほど聞こえにくい周波数です。
        </p>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-default">
              <th class="py-2 text-left font-medium text-muted">
                周波数
              </th>
              <th class="py-2 text-center font-medium">
                左耳
              </th>
              <th class="py-2 text-center font-medium">
                右耳
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(freq, i) in freqs"
              :key="freq"
              class="border-b border-default last:border-0"
            >
              <td class="py-3 text-muted">
                {{ freqLabel(freq) }}
              </td>
              <td class="py-3 text-center tabular-nums">
                {{ formatDbfs(leftResults[i]) }}
              </td>
              <td class="py-3 text-center tabular-nums">
                {{ formatDbfs(rightResults[i]) }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="grid grid-cols-2 gap-3">
          <UButton
            label="シェア"
            color="neutral"
            variant="outline"
            icon="i-lucide-link"
            @click="share()"
          />
          <UButton
            label="ホームへ"
            color="primary"
            icon="i-lucide-house"
            @click="navigateTo('/')"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
