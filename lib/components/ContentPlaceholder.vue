<template>
  <div v-once class="content-placeholder">
    <div class="content-placeholder__wrapper" :style="{ backgroundSize: size }">
      <div
        v-for="(row, r) in formattedRows"
        :key="r"
        class="content-placeholder__wrapper__row"
        :style="{ height: row.height }"
      >
        <div v-for="(box, b) in row.boxes" :key="b" :style="box.style">
          <div v-if="box.subClass" :class="box.subClass" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import config from '@/config'
import { formatRows } from '@/utils/placeholder'
import type {
  ContentPlaceholderRows,
  ContentPlaceholderStyledRows
} from '@/utils/placeholderTypes'

/**
 * A component to fill empty spaces with animated placeholders until content is loaded.
 */
export default defineComponent({
  name: 'ContentPlaceholder',
  props: {
    /**
     * An array of lines describing a series of cell sizes and margin sizes.
     */
    rows: {
      type: Array as PropType<ContentPlaceholderRows>,
      default: () => config.get('content-placeholder.rows')
    },
    /**
     * The size of the background gradient with the elapsing effect.
     */
    size: {
      type: String,
      default: '250%'
    }
  },
  setup(props) {
    const formattedRows = computed((): ContentPlaceholderStyledRows => {
      return props.rows
        ? formatRows(props.rows, 'content-placeholder__wrapper__row__box')
        : []
    })
    return { formattedRows }
  }
})
</script>

<style scoped lang="scss">
@import '../styles/lib';

@keyframes placeHolderShimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.content-placeholder {
  overflow: hidden;

  &__wrapper {
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: #f6f7f8;
    background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
    position: relative;

    &__row {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex: 0 1 auto;
      flex-direction: row;
      flex-wrap: wrap;

      &__box {
        box-sizing: border-box;
        position: relative;
        height: 100%;
        margin-bottom: 0;
        background-color: white;
        overflow: hidden;
      }
    }
  }
}
</style>
