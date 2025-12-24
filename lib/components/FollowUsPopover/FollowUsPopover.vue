<template>
  <div class="follow-us">
    <button
      class="btn btn-link text-secondary follow-us__close"
      @click="closeSignupPopover"
    >
      <phosphor-icon :name="PhX" />
    </button>
    <sign-up-form class="p-3" />
    <div class="px-3 pb-1 text-uppercase text-muted fw-bold">
      {{ t('follow-us-popover.heading') }}
    </div>
    <div class="p-3 bg-light d-flex justify-content-between text-center">
      <div class="col">
        <a
          href="https://x.com/ICIJorg"
          target="_blank"
          class="text-primary border border-primary rounded-circle bg-white follow-us__social-btn"
          title="Twitter"
        >
          <phosphor-icon
            :name="PhXLogo"
            size="1.5em"
            fill
          />
          <span class="visually-hidden">Twitter</span>
        </a>
      </div>
      <div class="col">
        <a
          href="https://www.facebook.com/ICIJ.org"
          target="_blank"
          class="text-primary border border-primary rounded-circle bg-white follow-us__social-btn"
          title="Facebook"
        >
          <phosphor-icon
            :name="PhFacebookLogo"
            size="1.5em"
            fill
          />
          <span class="visually-hidden">Facebook</span>
        </a>
      </div>
      <div class="col">
        <a
          href="https://www.linkedin.com/company/1732242/"
          target="_blank"
          class="text-primary border border-primary rounded-circle bg-white follow-us__social-btn"
          title="Linkedin"
        >
          <phosphor-icon
            :name="PhLinkedinLogo"
            size="1.5em"
            fill
          />
          <span class="visually-hidden">Linkedin</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SignUpForm from '@/components/SignUpForm/SignUpForm.vue'
import PhosphorIcon from '@/components/PhosphorIcon/PhosphorIcon.vue'
import { PhFacebookLogo, PhLinkedinLogo, PhX, PhXLogo } from '@phosphor-icons/vue'

/**
 * FollowUsPopover
 */
const emit = defineEmits(['update:close'])
const { t } = useI18n()

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
