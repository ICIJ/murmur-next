<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import type { Parent } from 'pym.js'

import { injectAssets } from '@/utils/assets'

defineOptions({
  name: 'ResponsiveIframe'
})

type StartsWithIcijIframe = `icij-iframe-${string}`

const props = defineProps<{
  /**
   * URL of the generated iframe code.
   */
  url: string
  /**
   * Option to pass to the constructor of the pymParent instance
   */
  options?: object
}>()

const instance = getCurrentInstance()
const iframeId = ref<StartsWithIcijIframe>(`icij-iframe-${instance?.uid ?? Math.random()}`)
const pymParent = ref<Parent | null>(null)

onMounted(async (): Promise<void> => {
  await injectAssets('https://pym.nprapps.org/pym.v1.min.js')
  pymParent.value = new window.pym.Parent(
    iframeId.value,
    props.url,
    props.options ?? {}
  )
})
</script>

<template>
  <div :id="iframeId" />
</template>
