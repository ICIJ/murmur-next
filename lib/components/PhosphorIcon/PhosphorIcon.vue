<template>
  <span
    class="phosphor-icon"
    :class="classList"
    :style="style"
    @mouseenter="currentHover = true"
    @mouseleave="currentHover = hover ?? false"
  >
    <component
      :is="component"
      :size="rawSize"
      :color="color"
      :weight="weightComp"
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
        keyTimes="0; 0.5; 1"
      />
    </component>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, defineAsyncComponent, watch } from 'vue'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import { IconPhosphor, IconWeight, PhosphorIconProps } from '@/types'
import { ICON_WEIGHT } from '@/enums'

const props = withDefaults(defineProps<PhosphorIconProps>(), {
  scale: 1,
  fill: false,
  weight: 'regular',
  beatDuration: '1s',
  fadeDuration: '1s',
  spinDuration: '1s'
})

function findComponentByName(name: string): IconPhosphor {
  const filename = `Ph${upperFirst(camelCase(name))}`
  return defineAsyncComponent(async () => {
    try {
      return await import(`node_modules/@phosphor-icons/vue/dist/icons/${filename}.vue.mjs`)
    }
    catch {
      // @ts-expect-error Importing not typescript module
      return import('node_modules/@phosphor-icons/vue/dist/icons/PhSelection.vue.mjs')
    }
  })
}

const component = shallowRef()

const setComponent = (icon: string | string[] | IconPhosphor) => {
  if (isArray(icon)) {
    setComponent(icon[0])
  }
  else if (isObject(icon)) {
    component.value = icon
  }
  else {
    component.value = findComponentByName(icon)
  }
}

watch(() => props.name, setComponent, { immediate: true })

const currentHover = ref(false)
watch(() => props.hover, () => (currentHover.value = props.hover), { immediate: true })

const weightComp = computed((): IconWeight => {
  if (isArray(props.name) && props.name.length > 1) {
    const weight = props.name[1] as IconWeight
    return ICON_WEIGHT[weight]
  }

  if (currentHover.value && props.hoverWeight) {
    return ICON_WEIGHT[props.hoverWeight]
  }

  if (props.fill) {
    return ICON_WEIGHT.fill
  }

  if (ICON_WEIGHT[props.weight]) {
    return ICON_WEIGHT[props.weight]
  }

  return ICON_WEIGHT.regular
})

const color = computed(() => {
  let colorVariant = 'currentColor'

  if (props.variant) {
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
  return !['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', undefined].includes(props.size)
})

const hasSize = computed(() => {
  return ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(props.size ?? '')
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
    '--phosphor-icon-weight': weightComp.value,
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

@import '../../styles/mixins';

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
