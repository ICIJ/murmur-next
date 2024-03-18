<template>
  <div id="app" class="app">
    <div class="app__navbar d-block d-lg-none bg-dark p-3 clearfix">
      <router-link to="/">
        <img
          src="@/assets/images/murmur-white.svg"
          alt="ICIJ"
          class="border border-primary d-inline-block"
          height="30px"
        />
      </router-link>
      <button class="btn btn-link text-white float-end" @click="toggleMenu">
        <fa icon="bars" />
      </button>
    </div>
    <transition name="fade">
      <div v-if="!collapseMenu" class="app__overlay" @click="toggleMenu"></div>
    </transition>
    <div class="row no-gutters flex-nowrap">
      <div class="col app__menu" :class="{ 'app__menu--collapse': collapseMenu }">
        <docs-menu></docs-menu>
      </div>
      <div class="col">
        <div class="app__main">
          <docs-header></docs-header>
          <router-view class="app__main__view py-4"></router-view>
          <edit-link></edit-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { mapState } from 'vuex'

import DocsHeader from './DocsHeader.vue'
import DocsMenu from './DocsMenu.vue'
import EditLink from './EditLink.vue'

import { library } from '@/components/Fa'

export default {
  name: 'App',
  components: {
    DocsHeader,
    DocsMenu,
    EditLink
  },
  watch: {
    '$route.name': function () {
      this.$store.commit('collapseMenu')
    },
    collapseMenu: function () {
      // Use bootstrap's class to disable scrolling on the body
      document.body.classList.toggle('modal-open', !this.collapseMenu)
    }
  },
  beforeCreate() {
    library.add(faBars)
  },
  computed: {
    ...mapState(['collapseMenu'])
  },
  methods: {
    toggleMenu() {
      this.$store.commit('toggleMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';
@import 'node_modules/bootstrap/scss/_mixins.scss';

.app {
  &:deep(.hljs) {
    background: $dark;
    padding: $spacer;
    display: block;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 300ms;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  @include media-breakpoint-down(md) {
    &__overlay {
      z-index: $zindex-modal-backdrop;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: $modal-backdrop-bg;
    }
  }

  &__menu {
    max-width: $app-menu-max-width;
    min-width: $app-menu-max-width;
    background: $docs-menu-bg;

    @include media-breakpoint-down(md) {
      z-index: $zindex-modal;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: auto;
      overflow: auto;
      transform: translateX(0%);
      transition: transform 300ms;

      &--collapse {
        pointer-events: none;
        transform: translateX(-100%);
      }
    }
  }

  &__main {
    min-height: 100%;
    border: $spacer solid $docs-menu-bg;
    border-left: 0;

    @include media-breakpoint-down(md) {
      min-height: auto;
      border: 0;
    }

    &__view {
      max-width: $app-main-max-width;
      padding: 0 $spacer;
      margin: auto;
    }
  }
}
</style>
