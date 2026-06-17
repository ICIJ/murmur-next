<script setup lang="ts">
import { useResponsiveIframe } from '@/composables/useResponsiveIframe'

defineOptions({
  name: 'ResponsiveIframe'
})

export interface ResponsiveIframeProps {
  /**
   * URL of the generated iframe code.
   */
  url: string
  /**
   * Option to pass to the constructor of the pymParent instance
   */
  options?: object
}

const props = defineProps<ResponsiveIframeProps>()

const { iframeId } = useResponsiveIframe({
  url: () => props.url,
  options: () => props.options
})
</script>

<template>
  <div :id="iframeId" />
</template>
