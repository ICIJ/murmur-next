<script setup lang="ts">
import { computed, toRef } from 'vue'

import { useSlideUpDown } from '@/composables/useSlideUpDown'

defineOptions({
  name: 'SlideUpDown'
})

export interface SlideUpDownProps {
  /**
   * Toggler property. Set to <em>false</em> to hide the component.
   */
  active?: boolean
  /**
   * Duration of the animation.
   */
  duration?: number
  /**
   * HTML tag to render this component to.
   */
  tag?: string
}

const props = withDefaults(defineProps<SlideUpDownProps>(), {
  active: false,
  duration: 200,
  tag: 'div'
})

const { container, state, mounted, style, triggerSlide, cleanLayout }
  = useSlideUpDown({
    active: toRef(props, 'active'),
    duration: toRef(props, 'duration')
  })

defineExpose({
  state,
  mounted,
  duration: computed(() => props.duration),
  triggerSlide,
  cleanLayout
})
</script>

<template>
  <component
    :is="tag"
    ref="container"
    :style="style"
  >
    <slot />
  </component>
</template>
