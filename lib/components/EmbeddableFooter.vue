<template>
  <div class="embeddable-footer p-2 text-nowrap">
    <a
      :href="homeUrl"
      target="_blank"
      class="text-white embeddable-footer__brand"
    >
      <brand :size="40" no-border class="me-2" color="white" />
      <!-- @slot Slot to redefine title display -->
      <slot name="title">
        <span v-html="title"></span>
      </slot>
    </a>
    <div class="embeddable-footer__lead small text-truncate">
      <!-- @slot Main slot to redefine lead text display -->
      <slot :lead="lead">
        <span v-html="lead"></span>
      </slot>
    </div>
    <!-- @slot Override the sharing button -->
    <slot name="sharing-button" v-bind="{ sharingOptionsValues }">
      <button
        class="btn btn-link text-white btn-sm py-0 embeddable-footer__share-btn"
        :class="{ active: showShareOptions }"
        @click="showShareOptions = !showShareOptions"
      >
        <phosphor-icon name="share-network" fill size="1.2em" />
        <span class="visually-hidden">{{ $t('embeddable-footer.share') }}</span>
      </button>
    </slot>
    <sharing-options
      v-if="showShareOptions"
      :values="sharingOptionsValues"
      direction="column-reverse"
      :iframe-min-height="iframeMinHeight"
      :iframe-min-width="iframeMinWidth"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import IframeResizer from '@/utils/iframe-resizer'
import Brand from '@/components/Brand.vue'
import PhosphorIcon from '@/components/PhosphorIcon.vue'
import SharingOptions from '@/components/SharingOptions.vue'
import config from '@/config'

type EmbeddableFooterData = {
  showShareOptions: boolean
}
/**
 * EmbeddableFooter
 */
export default defineComponent({
  name: 'EmbeddableFooter',
  components: {
    PhosphorIcon,
    SharingOptions,
    Brand
  },
  props: {
    /**
     * Title to display next to ICIJ logo.
     */
    title: {
      type: String,
      default: () => config.get('project.name')
    },
    /**
     * Lead sentence to display next to the title.
     */
    lead: {
      type: String,
      default: ''
    },
    /**
     * Minimum height for the iframe generated in the embed form.
     */
    iframeMinHeight: {
      type: Number,
      default: 100
    },
    /**
     * Minimum width for the iframe generated in the embed form.
     */
    iframeMinWidth: {
      type: Number,
      default: 100
    },
    /**
     * Target of the ICIJ logo and title links.
     */
    homeUrl: {
      type: String,
      default: () => config.get('app.home')
    },
    /**
     * Sharing option values to bind to the sharing-options component in the bottom-right corner.
     */
    sharingOptionsValues: {
      type: Object,
      default: () => ({})
    }
  },
  data(): EmbeddableFooterData {
    return {
      showShareOptions: false
    }
  },
  mounted(): void {
    IframeResizer.create()
  }
})
</script>

<style lang="scss" scoped>
@import '../styles/lib';
@import '../styles/mixins';

@include keyframes(slideup) {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }

  100% {
    transform: translateY(0%);
    opacity: 1;
  }
}

.embeddable-footer {
  display: flex;
  flex-direction: row;
  align-items: center;

  z-index: $zindex-sticky;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: black;
  color: white;
  // Magic technique to have a minimum font-size (10px-ish)
  font-size: calc(10px + 1.5vh);

  @media screen and (min-height: 800px) {
    font-size: 1rem;
  }

  &__brand {
    padding-right: $spacer;
    margin-right: $spacer;
    border-right: 2px solid white;
    font-family: $jumbotron-font-family;
    font-size: 1.1em;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__lead {
    flex-grow: 1;
    min-width: 0;
    font-size: 0.9em;
  }

  &__share-btn {
    border: 1px solid transparent;
    height: 2.5em;
    line-height: 2.5em;
    width: 2.5em;
    text-align: center;
    border-radius: 50%;

    &.active {
      border-color: rgb(19, 18, 18);
    }

    &:hover {
      background: rgba(white, 0.1);
    }
  }

  .sharing-options {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin: $spacer * 0.25;

    .sharing-options__link {
      opacity: 0;
      animation: slideup 200ms forwards;
      @include animation-delay-loop(0, 10, 50ms);
    }
  }
}
</style>
