<template>
  <span
    class="phosphor-icon"
    :class="classList"
    :style="style"
    @mouseenter="currentHover = true"
    @mouseleave="currentHover = hover ?? false"
  >
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
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
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

const props = defineProps({
  name: {
    type: [String, Object, Array],
    required: true
  },
  size: {
    type: String,
    default: null
  },
  scale: {
    type: Number,
    default: 1
  },
  variant: {
    type: String,
    required: false,
    default: null
  },
  hoverVariant: {
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
      //@ts-ignore
      return await import(`node_modules/@phosphor-icons/vue/dist/icons/${filename}.vue.mjs`)
    } catch {
      // @ts-expect-error Importing not typescript module
      // eslint-disable-next-line import/extensions
      return import('node_modules/@phosphor-icons/vue/dist/icons/PhSelection.vue.mjs')
    }
  })
}

const component = shallowRef()

const setComponent = (icon: Array<any> | string | object) => {
  if (isArray(icon)) {
    setComponent(icon[0])
  } else if (isObject(icon)) {
    component.value = icon
  } else {
    component.value = findComponentByName(icon)
  }
}

watch(() => props.name, setComponent, { immediate: true })

const currentHover = ref(false)
watch(() => props.hover, () => { currentHover.value = props.hover }, { immediate: true })


const weight = computed(() => {
  if (isArray(props.name) && props.name.length > 1) {
    return WEIGHTS[props.name[1]]
  }

  if (currentHover.value && props.hoverWeight) {
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
  let colorVariant = 'currentColor'

  if(props.variant){
    colorVariant = `var(--bs-${props.variant}, currentColor)`
  }

  if (currentHover.value && props.hoverVariant) {
    colorVariant = `var(--bs-${props.hoverVariant}, ${colorVariant})`
  }

  return colorVariant
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
    '--phosphor-icon-raw-size': isRawSize.value ? props.size : undefined,
    '--phosphor-icon-size': hasSize.value ? props.size : undefined,
    '--phosphor-icon-scale': props.scale ?? 1,
  }
})

const classList = computed(() => {
  return {
    [`phosphor-icon--size-${props.size}`]: hasSize.value,
    [`phosphor-icon--has-size`]: hasSize.value,
    [`phosphor-icon--hover`]: currentHover.value,
  }
})
</script>

<style lang="scss" scoped>
@import '../styles/lib';
@import '../styles/mixins';

.phosphor-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  @include ph-icon-size($ph-icon-size-scale-base, var(--phosphor-icon-scale, 1));

  @each $size, $value in $ph-icon-sizes {
    &--size-#{$size} {
      @include ph-icon-size($value, var(--phosphor-icon-scale));
    }
  }
}
</style>
