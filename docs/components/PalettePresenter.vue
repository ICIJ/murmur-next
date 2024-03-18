<template>
  <div class="palette-presenter">
    <ul class="list-unstyled palette-presenter__list">
      <li v-for="(value, name) in colors" :key="name" :style="bgStyle(name)" class="palette-presenter__list__item">
        <span class="fw-bold palette-presenter__list__item__name">
          {{ name }}
        </span>
        <span class="fw-bold palette-presenter__list__item__value d-flex align-items-center">
          <span class="palette-presenter__list__item__value__hex">
            {{ value }}
          </span>
          <haptic-copy class="btn-sm btn-link ms-2" hide-label :text="value.hex" />
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import chroma from 'chroma-js'

export default {
  props: {
    colors: {
      type: Object
    }
  },
  methods: {
    bgStyle(name) {
      return {
        backgroundColor: this.colors[name],
        color: this.textContrast(name)
      }
    },
    textContrast(name) {
      const hex = this.colors[name]
      return chroma.contrast(hex, '#000') > 8 ? '#000' : '#fff'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';
@import 'node_modules/bootstrap/scss/_mixins.scss';

.palette-presenter {
  &__list {
    margin: 0 -1 * $spacer;
    display: flex;
    flex-wrap: wrap;

    &__item {
      padding: 0;
      display: block;
      position: relative;
      flex: calc(50% - #{$spacer * 2}) 0;
      margin: $spacer;
      box-shadow: inset 0 0 0 1px rgba(#000, 0.1);

      @include media-breakpoint-down(md) {
        flex: 100% 0;
      }

      &:after {
        content: '';
        display: block;
        width: 100%;
        padding-top: 30%;
        min-height: 4rem * $line-height-base;
      }

      &__name {
        position: absolute;
        top: $spacer;
        left: $spacer;
      }

      &__value {
        position: absolute;
        right: $spacer;
        bottom: $spacer;
        padding: 0.25em;
        padding-left: 0.5em;
        background: rgba(#fff, 0.2);
        box-shadow: 0 0 0 1px rgba(#000, 0.1);

        button {
          color: inherit;
          background: rgba(#fff, 0.2);
        }
      }
    }
  }
}
</style>
