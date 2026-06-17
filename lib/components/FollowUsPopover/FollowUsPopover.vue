<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IPhXBold from '~icons/ph/x-bold'
import IPhXLogoFill from '~icons/ph/x-logo-fill'
import IPhFacebookLogoFill from '~icons/ph/facebook-logo-fill'
import IPhLinkedinLogoFill from '~icons/ph/linkedin-logo-fill'

import SignUpForm from '@/components/Form/FormSignUp.vue'
import AppIcon from '@/components/App/AppIcon.vue'

export interface FollowUsPopoverProps {
  /**
   * Compact layout for the sign-up form.
   */
  compact?: boolean
}

withDefaults(defineProps<FollowUsPopoverProps>(), {
  compact: false
})

const emit = defineEmits(['update:close'])
const { t } = useI18n()

// Social networks rendered as a row of round icon links. Kept as data so the
// markup stays a single loop instead of three near-identical blocks.
const socialNetworks = Object.freeze([
  { name: 'Twitter', href: 'https://x.com/ICIJorg', icon: IPhXLogoFill },
  { name: 'Facebook', href: 'https://www.facebook.com/ICIJ.org', icon: IPhFacebookLogoFill },
  { name: 'Linkedin', href: 'https://www.linkedin.com/company/1732242/', icon: IPhLinkedinLogoFill }
])

/**
 * Fired when a user clicks on the `close` button
 *
 * @event update:close
 * @type {boolean}
 */
function closeSignupPopover(): void {
  emit('update:close', false)
}
</script>

<template>
  <div class="follow-us">
    <button
      class="btn btn-link text-secondary follow-us__close"
      @click="closeSignupPopover"
    >
      <app-icon>
        <i-ph-x-bold />
      </app-icon>
    </button>
    <sign-up-form
      class="p-3"
      :compact="compact"
    />
    <div class="px-3 pb-1 text-uppercase text-muted fw-bold">
      {{ t('follow-us-popover.heading') }}
    </div>
    <div class="p-3 bg-light d-flex justify-content-between text-center">
      <div
        v-for="socialNetwork in socialNetworks"
        :key="socialNetwork.name"
        class="col"
      >
        <a
          :href="socialNetwork.href"
          target="_blank"
          class="text-primary border border-primary rounded-circle bg-white follow-us__social-btn"
          :title="socialNetwork.name"
        >
          <app-icon size="1.5em">
            <component :is="socialNetwork.icon" />
          </app-icon>
          <span class="visually-hidden">{{ socialNetwork.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.follow-us {
  position: relative;
  width: 100%;
  min-width: 298px;

  &__social-btn {
    height: 46px;
    width: 46px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__close {
    position: absolute;
    right: $spacer * 0.5;
    top: $spacer * 0.5;
  }
}
</style>
