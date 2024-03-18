<template>
  <component :is="tag" class="collapsible-block card mb-5" :class="{ 'collapsible-block--visible': visible }">
    <div class="d-flex">
      <a class="py-3 px-4 d-block collapsible-block__caret" @click="toggle">
        <fa icon="caret-right" :rotation="show ? 90 : null" />
      </a>
      <div class="flex-grow-1">
        <slot name="label" v-bind:label="label">
          <a v-if="label" class="py-3 pe-4 collapsible-block__label d-block" @click="toggle">
            {{ label }}
          </a>
        </slot>
      </div>
    </div>
    <b-collapse :visible="show" class="collapsible-block__body">
      <slot v-if="useSlot" />
      <pre v-else-if="json"><code class="hljs language-json" v-html="formattedJson"></code></pre>
    </b-collapse>
  </component>
</template>

<script>
  import hljs from 'highlight.js'
  import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight'

  import { library, default as Fa } from '@/components/Fa'

  export default {
    name: 'CollapsibleBlock',
    components: {
      Fa
    },
    beforeMount () {
      library.add(faCaretRight)
    },
    model: {
      prop: 'visible',
      event: 'input'
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      tag: {
        type: [String, Object],
        default: 'div'
      },
      label: {
        type: String,
        default: null
      },
      json: {
        default: null
      }
    },
    data() {
      return {
        show: this.visible
      }
    },
    watch: {
      visible (value) {
        if (value !== this.show) {
          this.show = value
        }
      },
      show (value, oldValue) {
        if (value !== oldValue) {
          this.$emit('input', this.show)
        }
      }
    },
    created() {
      this.show = this.visible
    },
    mounted() {
      this.show = this.visible
    },
    beforeDestroy() {
      this.show = false
    },
    methods: {
      toggle() {
        this.show = !this.show
      }
    },
    computed: {
      useSlot() {
        return !!this.$slots.default && !!this.$slots.default.length
      },
      stringifiedJson() {
        return JSON.stringify(this.json, null, 2)
      },
      formattedJson() {
        const language = 'json'
        const { value } = hljs.highlight(this.stringifiedJson, { language })
        return value
      }
    }
  }
</script>

<style lang="scss">
  .collapsible-block {

    &__caret, &__label {
      cursor: pointer;
    }

    &__caret .svg-inline--fa{
      transition: transform 300ms;
    }

    &__body {
      // Exception for code block
      & *[class^=language-] pre {
        margin-bottom: 0;
      }
    }
  }
</style>
