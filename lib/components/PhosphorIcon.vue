<template>
  <span class="phosphor-icon" :style="style" :class="classList" @mouseenter="hover = true" @mouseleave="hover = false">
    <component
      :size="rawSize"
      :is="component"
      :color="color"
      :weight="weight"
    >
      <animateTransform
        v-if="spin || spinReverse"
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        :dur="spinDuration"
        from="0 0 0"
        :to="spinTo"
        repeatCount="indefinite"
      />
      <animateTransform
        v-if="beat"
        attributeName="transform"
        attributeType="XML"
        type="scale"
        :dur="beatDuration"
        values="0.8; 1.2; 0.8"
        repeatCount="indefinite"
      />
      <animate
        v-if="fade"
        attributeName="opacity"
        from="1"
        to="0"
        begin="0s"
        :dur="fadeDuration"
        repeatCount="indefinite"
        values="1; 0; 1"
        keyTimes="0; 0.5; 1"/>
    </component>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, defineAsyncComponent, watch } from 'vue'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'

const WEIGHT_THIN: string = 'thin'
const WEIGHT_LIGHT: string = 'light'
const WEIGHT_REGULAR: string = 'regular'
const WEIGHT_BOLD: string = 'bold'
const WEIGHT_FILL: string = 'fill'
const WEIGHT_DUOTONE: string = 'duotone'

const WEIGHTS = Object.freeze({
  [WEIGHT_THIN]: WEIGHT_THIN,
  [WEIGHT_LIGHT]: WEIGHT_LIGHT,
  [WEIGHT_REGULAR]: WEIGHT_REGULAR,
  [WEIGHT_BOLD]: WEIGHT_BOLD,
  [WEIGHT_FILL]: WEIGHT_FILL,
  [WEIGHT_DUOTONE]: WEIGHT_DUOTONE
})

const hover = ref(false)

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: null
  },
  variant: {
    type: String,
    required: false,
    default: null
  },
  fill: {
    type: Boolean,
    required: false,
    default: false
  },
  weight: {
    type: String,
    required: false,
    default: 'regular'
  },
  hoverWeight: {
    type: String,
    required: false,
    default: null
  },
  beat: {
    type: Boolean
  },
  beatDuration: {
    type: String,
    default: '1s'
  },
  fade: {
    type: Boolean
  },
  fadeDuration: {
    type: String,
    default: '1s'
  },
  spin: {
    type: Boolean
  },
  spinReverse: {
    type: Boolean
  },
  spinDuration: {
    type: String,
    default: '1s'
  },
  hover: {
    type: Boolean
  }
})

function findComponentByName(name: string) {
  const filename = `Ph${upperFirst(camelCase(name))}`
  return defineAsyncComponent(async () => {
    try {
      return await import(`node_modules/@phosphor-icons/vue/dist/icons/${filename}.vue.mjs`)
    } catch {
      // eslint-disable-next-line import/extensions
      return import('node_modules/@phosphor-icons/vue/dist/icons/PhSelection.vue.mjs')
    }
  })
}

const component = shallowRef(findComponentByName(props.name))

watch(
  () => props.name,
  () => {
    component.value = findComponentByName(props.name)
  }
)

watch(
  () => props.hover,
  () => {
    hover.value = props.hover
  },
  { immediate: true }
)


const weight = computed(() => {
  if (hover.value && props.hoverWeight) {
    return WEIGHTS[props.hoverWeight]
  }

  if (props.fill) {
    return WEIGHT_FILL
  }

  if (WEIGHTS[props.weight]) {
    return WEIGHTS[props.weight]
  }

  return WEIGHT_REGULAR
})

const color = computed(() => {
  return `var(--bs-${props.variant}, currentColor)`
})

const spinTo = computed(() => {
  return props.spinReverse ? '-360 0 0' : '360 0 0'
})

const isRawSize = computed(() => {
  return !['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', null].includes(props.size)
})

const hasSize = computed(() => {
  return ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(props.size)
})

const rawSize = computed(() => {
  if (isRawSize.value) {
    return props.size
  }
  return '1.25em'
})

const style = computed(() => {
  return {
    '--phosphor-icon-color': color.value,
    '--phosphor-icon-weight': weight.value,
    '--phosphor-icon-raw-size': isRawSize.value ? props.size : null,
    '--phosphor-icon-size': hasSize.value ? props.size : null,
  }
})

const classList = computed(() => {
  return {
    [`phosphor-icon--size-${props.size}`]: hasSize.value,
    [`phosphor-icon--has-size`]: hasSize.value,
    [`phosphor-icon--hover`]: hover.value,
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/lib';
@import '@/styles/mixins';

.phosphor-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  @include ph-icon-size($ph-icon-size-scale-base);
 
  @each $size, $value in $ph-icon-sizes {
    &--size-#{$size} {
      @include ph-icon-size($value);
    }
  }
}
</style>
