<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'SlideUpDown'
})

type StyleTransition = Pick<
  CSSProperties,
  'overflow' | 'transition-property' | 'transition-duration' | 'height'
>

const STATE = {
  PRE: 'pre',
  ACTIVE: 'active',
  POST: 'post'
}

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

const state = ref(STATE.POST)
const mounted = ref(false)
const scrollHeight = ref(0)
const container = ref<HTMLElement | undefined>(undefined)

const stylePreTransition = computed((): StyleTransition => {
  return {
    'overflow': 'hidden',
    'transition-property': 'height',
    'transition-duration': `${props.duration}ms`,
    'height': mounted.value ? `${containerScrollHeight.value}px` : 0
  }
})

const styleActiveTransition = computed((): StyleTransition => {
  return {
    'overflow': 'hidden',
    'transition-property': 'height',
    'transition-duration': `${props.duration}ms`,
    'height': mounted.value ? `${activeHeight.value}px` : 'auto'
  }
})

const stylePostTransition = computed((): StyleTransition => {
  // Reset style when the element is active
  return props.active ? {} : styleActiveTransition.value
})

const style = computed((): StyleTransition => {
  switch (state.value) {
    case STATE.PRE:
      return stylePreTransition.value
    case STATE.ACTIVE:
      return styleActiveTransition.value
    default:
      return stylePostTransition.value
  }
})

const activeHeight = computed((): number => {
  return props.active ? containerScrollHeight.value : 0
})

const containerScrollHeight = computed((): number => {
  return container.value?.scrollHeight ?? 0
})

async function triggerSlide(): Promise<void> {
  state.value = STATE.PRE
  scrollHeight.value = containerScrollHeight.value
  // Deferred next tick to let the component render once
  await deferredNextTick()
  state.value = STATE.ACTIVE
}

function cleanLayout(e: Event | null) {
  // This method can be triggered by animated child elements in
  // which case, we should do anything
  if (!e || e.target === container.value) {
    state.value = STATE.POST
    return deferredNextTick()
  }
}

async function deferredNextTick() {
  await new Promise(resolve => setTimeout(resolve, 0))
  await nextTick()
}

watch(() => props.active, (): Promise<void> => {
  return triggerSlide()
})

onMounted(async () => {
  await deferredNextTick()
  mounted.value = true
  await cleanLayout(null)
  container.value?.addEventListener('transitionend', (e: TransitionEvent) =>
    cleanLayout(e)
  )
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
