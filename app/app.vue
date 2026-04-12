<script setup lang="ts">
const colorMode = useColorMode()
colorMode.preference = 'dark'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
    { property: 'og:title', content: 'FreqThresh' },
    { property: 'og:description', content: '聴力周波数閾値テスト' },
    { property: 'og:image', content: '/ogp.svg' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ],
  htmlAttrs: {
    lang: 'ja'
  }
})
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
