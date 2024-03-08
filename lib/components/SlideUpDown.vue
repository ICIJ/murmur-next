<script lang="ts">
import { defineComponent } from 'vue'
import type { CSSProperties } from 'vue'

type StyleTransition = Pick<CSSProperties, 'overflow' | 'transition-property' | 'transition-duration' | 'height'>
const STATE = {
  PRE: 'pre',
  ACTIVE: 'active',
  POST: 'post'
}
interface SlideUpDownData {
  state: string
  mounted: boolean
  scrollHeight: number
}
/**
 * SlideUpDown
 */
export default defineComponent({
  name: 'SlideUpDown',
  props: {
    /**
     * Toggler property. Set to <em>false</em> to hide the component.
     */
    active: {
      type: Boolean,
      default: false
    },
    /**
     * Duration of the animation.
     */
    duration: {
      type: Number,
      default: 200
    },
    /**
     * HTML tag to render this component to.
     */
    tag: {
      type: String,
      default: 'div'
    }
  },
  data(): SlideUpDownData {
    return {
      state: STATE.POST,
      mounted: false,
      scrollHeight: 0
    }
  },
  computed: {
    stylePreTransition(): StyleTransition {
      return {
        overflow: 'hidden',
        'transition-property': 'height',
        'transition-duration': `${this.duration}ms`,
        height: this.mounted ? `${this.containerScrollHeight}px` : 0
      }
    },
    styleActiveTransition(): StyleTransition {
      return {
        overflow: 'hidden',
        'transition-property': 'height',
        'transition-duration': `${this.duration}ms`,
        height: this.mounted ? `${this.activeHeight}px` : 'auto'
      }
    },
    stylePostTransition(): StyleTransition {
      // Reset style when the element is active
      return this.active ? {} : this.styleActiveTransition
    },
    style(): StyleTransition {
      switch (this.state) {
        case STATE.PRE:
          return this.stylePreTransition
        case STATE.ACTIVE:
          return this.styleActiveTransition
        default:
          return this.stylePostTransition
      }
    },
    activeHeight(): number {
      return this.active ? this.containerScrollHeight : 0
    },
    containerScrollHeight(): number {
      return this.$container?.scrollHeight ?? 0
    },
    $container(): HTMLElement | undefined {
      return this.$refs.container as HTMLElement | undefined
    }
  },
  watch: {
    active(): Promise<void> {
      return this.triggerSlide()
    }
  },
  async mounted() {
    await this.deferredNextTick()
    this.mounted = true
    await this.cleanLayout(null)
    this.$container?.addEventListener('transitionend', (e) => this.cleanLayout(e))
  },
  methods: {
    async triggerSlide(): Promise<void> {
      this.state = STATE.PRE
      this.scrollHeight = this.containerScrollHeight
      // Deferred next tick to let the component render once
      await this.deferredNextTick()
      this.state = STATE.ACTIVE
    },
    cleanLayout(e: Event | null) {
      // This method can be triggered by animated child elements in
      // which case, we should do anything
      if (!e || e.target === this.$container) {
        this.state = STATE.POST
        return this.deferredNextTick()
      }
    },
    async deferredNextTick() {
      await new Promise((resolve) => setTimeout(resolve, 0))
      await this.$nextTick()
    }
  }
})
</script>

<template>
  <component :is="tag" ref="container" :style="style">
    <slot />
  </component>
</template>
