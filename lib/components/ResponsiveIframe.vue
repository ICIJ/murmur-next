<template>
  <div :id="iframeId" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Parent } from 'pym.js'

import { injectAssets } from '@/utils/assets'

let iframeUniqueIdCounter = 0
type StartsWithIcijIframe = `icij-iframe-${string}`
interface ResponsiveIframeData {
  iframeId: StartsWithIcijIframe
  pymParent: null | Parent
}

/**
 * ResponsiveIframe
 */
export default defineComponent({
  name: 'ResponsiveIframe',
  props: {
    /**
     * URL of the generated iframe code.
     */
    url: {
      type: String,
      required: true
    },
    /**
     * Option to pass to the constructor of the pymParent instance
     */
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data(): ResponsiveIframeData {
    return {
      iframeId: `icij-iframe-${++iframeUniqueIdCounter}`,
      pymParent: null
    }
  },
  async mounted(): Promise<void> {
    await injectAssets('https://pym.nprapps.org/pym.v1.min.js')
    this.pymParent = new window.pym.Parent(
      this.iframeId,
      this.url,
      this.options
    )
  }
})
</script>
