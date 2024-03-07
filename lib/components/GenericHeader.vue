<template>
  <div>
    <component
      :is="rootElement"
      id="generic-header"
      data-turbolinks-permanent
      class="navbar navbar-expand-lg navbar-light generic-header"
      :offset="100"
      :z-index="1020"
      :on-unpin="closeFollowUsPopover"
      :class="{ 'headroom--frozen': !collapseNavbar, 'generic-header--collapsed': collapseNavbar }"
      :style="{ position: position }"
    >
      <!-- @slot Redefines brand -->
      <slot name="brand">
        <a :href="homeUrl" class="navbar-brand generic-header__brand">
          <brand-expansion :size="45" :mode="shortMode" class="d-inline-block d-sm-none" />
          <brand-expansion :size="45" :mode="longMode" class="d-none d-sm-inline-block" />
          <span class="sr-only">International Consortium of Investigative Journalists</span>
        </a>
      </slot>
      <button class="navbar-toggler border-0" type="button" aria-label="Toggle navigation" @click="toggleNavbar">
        <fa icon="bars" size="xl" class="text-primary" />
      </button>
      <div class="navbar-collapse" :class="{ collapse: collapseNavbar }">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a href="https://www.icij.org/investigations/" target="_blank" class="nav-link text-uppercase">
              {{ t('generic-header.navbar.investigations') }}
            </a>
          </li>
          <li class="nav-item">
            <a href="https://www.icij.org/leak/" target="_blank" class="nav-link text-uppercase">
              {{ t('generic-header.navbar.leak') }}
            </a>
          </li>
          <li class="nav-item">
            <a id="follow-us-toggler" class="nav-link text-uppercase" @mouseenter="showFollowUsPopover=true">
              {{ t('generic-header.navbar.follow') }}
            </a>
          </li>
          <li class="nav-item mr-lg-3">
            <slot name="donate-link">
              <a class="text-uppercase btn btn-primary fw-bold" target="_blank" :href="donateUrl">
                {{ t('generic-header.navbar.support') }}
              </a>
            </slot>
          </li>
        </ul>
        <b-popover
            v-model="showFollowUsPopover"
            target="follow-us-toggler"
            placement="bottom-start"
            ref="followUsPopover"
            click
        >
          <follow-us-popover @update:close="closeFollowUsPopover" @keydown.esc="closeFollowUsPopover" />
        </b-popover>
      </div>
    </component>
  </div>
</template>

<script lang="ts">
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import headroom  from 'vue-headroom/src/headroom.vue';
import {
  computed,
  defineComponent,
  type PropType,
  ref,
  onBeforeMount,
  watch,
  ComponentPublicInstance
} from 'vue'

import config from '@/config'
import Fa, { library } from '@/components/Fa'
import BrandExpansion from '@/components/BrandExpansion.vue'
import FollowUsPopover from '@/components/FollowUsPopover.vue'
import {BrandMode} from '@/enums'
import {useI18n} from "vue-i18n";
import {BPopover} from "bootstrap-vue-next";

type BrandOptions = {
  noBorder: boolean
  size: number
  color: string
  background: string
}

/**
 * GenericHeader
 */
export default defineComponent({
  name: 'GenericHeader',
  components: {
    BPopover,
    BrandExpansion,
    Fa,
    FollowUsPopover,
    headroom
  },
  props: {
    /**
     * CSS position of the header. Can be <em>absolute</em>, <em>relative</em>, <em>static</em> or <em>fixed</em> (default).
     */
    position: {
      type: String,
      default: 'fixed'
    },
    /**
     * Disable Headroom for hiding header until needed.
     */
    noHeadroom: {
      type: Boolean,
      default:false
    },
    /**
     * Target link of the ICIJ logo and project name.
     */
    homeUrl: {
      type: String,
      default: () => config.get('app.home')
    },
    /**
     * Default options to pass to the brand component
     */
    brandOptions: {
      type: Object as PropType<BrandOptions>,
      default: () => ({})
    },
    /**
     * Target link of the donate button.
     */
    donateUrl: {
      type: String,
      default: () => config.get('app.donate-url')
    }
  },
  setup(props) {

    onBeforeMount((): void =>{
      library.add(faBars)
    })

    const {t}= useI18n()
    const followUsPopover = ref<ComponentPublicInstance<typeof BPopover>|null>(null)
    const closable = ref(false)
    const showFollowUsPopover = ref<boolean>(false)
    const collapseNavbar = ref(true)
    const shortMode = ref(BrandMode.Short)
    const longMode = ref(BrandMode.Long)
    const rootElement = computed((): string => {
      return props.noHeadroom ? 'div' : 'headroom'
    })
    const appliedBrandOptions = computed((): BrandOptions => {
      return {...defaultBrandOptions.value,... props.brandOptions}
    })
    const  defaultBrandOptions = computed((): BrandOptions => {
      return {
        noBorder: true,
        size: 50,
        color: 'white',
        background: '#A10207'
      }
    })
    function closeFollowUsPopover() {
      if(followUsPopover.value?.hide){
        followUsPopover.value?.hide(new Event('forceHide'))
      }
      showFollowUsPopover.value=false
    }
    function toggleNavbar(): void {
      collapseNavbar.value = !collapseNavbar.value
      closeFollowUsPopover()
    }

    return {
      t,
      rootElement,
      showFollowUsPopover,
      followUsPopover,
      collapseNavbar,
      shortMode,
      longMode,
      appliedBrandOptions,
      closable,
      closeFollowUsPopover,
      toggleNavbar
    }
  }
})
</script>

<style lang="scss">
@import '../styles/lib';

.generic-header {
  background: white;
  position: relative;
  top: 0;
  width: 100%;
  z-index: $zindex-sticky;


  .popover {
    width: 100%;
  }

  & .headroom {
    will-change: transform;
    transition: transform 200ms linear;
    display: flex;
    flex-grow: 1;
    &--unpinned {
      transform: translateY(-100%) !important;
    }

    &--pinned {
      transform: translateY(0%);
    }

    &--frozen {
      transform: translateY(0%) !important;
    }
  }

  &__brand {
    position: relative;
    font-weight: bolder;
    padding: $spacer;
    font-size: 1rem;
    display: inline-block;
  }

  .navbar-toggler {
    position: absolute;
    right: $spacer;
    top: $spacer;
    margin: 1px 0 0;
  }

  .nav-item {
    margin: 0 $spacer * 0.5;
    font-weight: bold;
    text-transform: uppercase;
    color: black;

    .nav-link {
      color: inherit;
      cursor: pointer;
    }
  }
}
</style>
