<template>
  <div class="follow-us">
    <button class="btn btn-link text-light follow-us__close" @click="closeSignupPopover">
      <fa icon="times" />
    </button>
    <sign-up-form class="p-3" />
    <div class="px-3 pb-1 text-uppercase text-muted fw-bold">
      {{ t('follow-us-popover.heading') }}
    </div>
    <div class="p-3 bg-light container-fluid text-center">
      <div class="row w-100">
        <div class="col">
          <a
            href="https://twitter.com/ICIJorg"
            target="_blank"
            class="d-inline-block text-primary border border-primary rounded-circle bg-white follow-us__social-btn"
            title="Twitter"
          >
            <fa :icon="['fab', 'twitter']" size="lg" />
            <span class="sr-only">Twitter</span>
          </a>
        </div>
        <div class="col">
          <a
            href="https://www.facebook.com/ICIJ.org"
            target="_blank"
            class="d-inline-block text-primary border border-primary rounded-circle bg-white follow-us__social-btn"
            title="Facebook"
          >
            <fa :icon="['fab', 'facebook']" size="lg" />
            <span class="sr-only">Facebook</span>
          </a>
        </div>
        <div class="col">
          <a
            href="https://www.linkedin.com/company/1732242/"
            target="_blank"
            class="d-inline-block text-primary border border-primary rounded-circle bg-white follow-us__social-btn"
            title="Linkedin"
          >
            <fa :icon="['fab', 'linkedin']" size="lg" />
            <span class="sr-only">Linkedin</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter'
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import SignUpForm from './SignUpForm.vue'
import { library, default as Fa } from './Fa'
import {onBeforeMount} from "@vue/runtime-core";


/**
 * FollowUsPopover
 */
export default defineComponent({
  name: 'FollowUsPopover',
  components: {
    Fa,
    SignUpForm
  },
  emits:["update:show"],
  setup(_props,{emit}){
    const {t} = useI18n()
    onBeforeMount((): void=>{
        library.add(faTimes, faTwitter, faFacebook, faLinkedin)
    })
    function closeSignupPopover(): void {
      /**
       * Fired when user click on the `close` button
       *
       * @event update:show
       * @type {boolean}
       */
      emit('update:show', false)
    }

    return {
      t,
      closeSignupPopover
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../styles/lib';

.follow-us {
  position: relative;
  width: 300px;

  &__social-btn {
    height: 46px;
    width: 46px;
    line-height: 46px;

    i.fab {
      line-height: inherit;
      font-size: 1.5em;
    }
  }

  &__close {
    position: absolute;
    right: $spacer * 0.5;
    top: $spacer * 0.5;
  }
}
</style>
