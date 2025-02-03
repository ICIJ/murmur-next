<template>
  <footer class="generic-footer">
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-5">
          <h5
            class="text-uppercase text-white clearfix generic-footer__icij mb-3"
          >
            <a
              href="https://icij.org"
              target="_blank"
              class="generic-footer__icij__logo text-decoration-none"
            >
              <brand-expansion :mode="mode" dark />
              <span class="visually-hidden"
                >International Consortium of Investigative Journalists</span
              >
            </a>
          </h5>
          <p>
            <!-- @slot Override office's address  -->
            <slot name="address">
              1800 M Street NW, Front 1 #33019<br />
              Washington, D.C. 20033 USA
            </slot>
          </p>
          <p>
            <strong>
              <a :href="contactEmailMailto" class="">{{ contactEmail }}</a>
            </strong>
          </p>
          <!-- @slot Additional content on the left side of the footer -->
          <slot name="left" />
        </div>
        <div class="col-12 col-lg-7">
          <div class="row justify-content-end">
            <div v-if="showAboutUs" class="col-6 col-lg-4">
              <h5 class="text-uppercase mb-3">About Us</h5>
              <ul class="list-unstyled">
                <li class="list-unstyled-item">
                  <a
                    href="https://www.icij.org/about/our-team/"
                    target="_blank"
                  >
                    Our team
                  </a>
                </li>
                <li class="list-unstyled-item">
                  <a
                    href="https://www.icij.org/about/our-supporters/"
                    target="_blank"
                  >
                    Our supporters
                  </a>
                </li>
                <li class="list-unstyled-item">
                  <a href="https://www.icij.org/about/awards/" target="_blank">
                    ICIJ's Awards
                  </a>
                </li>
                <li class="list-unstyled-item">
                  <a
                    href="https://www.icij.org/about/corporate/"
                    target="_blank"
                  >
                    Corporate
                  </a>
                </li>
                <li class="list-unstyled-item">
                  <a
                    href="https://www.icij.org/about/work-with-us/"
                    target="_blank"
                  >
                    Work with us
                  </a>
                </li>
                <li class="list-unstyled-item">
                  <a href="https://www.icij.org/journalists/" target="_blank">
                    Journalists
                  </a>
                </li>
              </ul>
            </div>
            <div class="col-6 col-lg-4">
              <h5 class="text-uppercase mb-3">
                {{ $t('generic-footer.investigations') }}
              </h5>

              <!-- @slot List of investigations -->
              <slot name="investigations">
                <ul class="list-unstyled">
                  <li class="list-unstyled-item">
                    <a
                      href="https://www.icij.org/investigations/uber-files/"
                      target="_blank"
                    >
                      The Uber Files
                    </a>
                  </li>
                  <li class="list-unstyled-item">
                    <a
                      href="https://www.icij.org/investigations/russia-archive/"
                      target="_blank"
                    >
                      Russia Archive
                    </a>
                  </li>
                  <li class="list-unstyled-item">
                    <a
                      href="https://www.icij.org/investigations/ericsson-list/"
                      target="_blank"
                    >
                      The Ericsson List
                    </a>
                  </li>
                  <li class="list-unstyled-item">
                    <a
                      href="https://www.icij.org/investigations/pandora-papers/"
                      target="_blank"
                    >
                      Pandora Papers
                    </a>
                  </li>
                  <li class="list-unstyled-item">
                    <a
                      href="https://www.icij.org/investigations/fincen-files/"
                      target="_blank"
                    >
                      FinCEN Files
                    </a>
                  </li>
                  <li class="list-unstyled-item">
                    <a
                      href="https://www.icij.org/investigations/"
                      target="_blank"
                    >
                      More investigations
                    </a>
                  </li>
                </ul>
              </slot>
            </div>
            <div class="col-6 col-lg-4">
              <h5 class="text-uppercase mb-3">
                {{ $t('generic-footer.follow-us') }}
              </h5>
              <ul class="list-unstyled">
                <li class="list-unstyled-item">
                  <a href="https://www.facebook.com/ICIJ.org" target="_blank">
                    Facebook
                  </a>
                </li>
                <li class="list-unstyled-item">
                  <a
                    href="https://www.linkedin.com/company/1732242/"
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                </li>
                <li class="list-unstyled-item">
                  <a href="https://twitter.com/ICIJorg" target="_blank">
                    Twitter
                  </a>
                </li>
                <li class="list-unstyled-item">
                  <a href="https://instagram.com/icijorg" target="_blank">
                    Instagram
                  </a>
                </li>
                <li class="list-unstyled-item">
                  <a href="https://www.icij.org/signup/" target="_blank">
                    Sign-up
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p class="text-white text-md-right small mt-5">
        <strong>
          © <span class="generic-footer__year">{{ year }}</span> — The
          International Consortium of Investigative Journalists.
        </strong>
        {{ $t('generic-footer.all-rights') }}
        <br />
        <span v-if="version" class="text-muted generic-footer__version">
          {{ $t('generic-footer.version', { version }) }}
        </span>
      </p>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import config from '../config'
import BrandExpansion from './BrandExpansion.vue'

import { BrandMode } from '@/enums'

/**
 * GenericFooter
 */
export default defineComponent({
  name: 'GenericFooter',
  components: { BrandExpansion },
  props: {
    /**
     * Version of the app to display in the bottom-right corner of the footer
     */
    version: {
      type: String,
      default: null
    },
    /**
     * Whether to show the About Us column or not
     */
    showAboutUs: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { mode: BrandMode.Long }
  },
  computed: {
    year(): number {
      return new Date().getFullYear()
    },
    contactEmail(): string {
      return config.get('contact-email')
    },
    contactEmailMailto(): string {
      return `mailto:${this.contactEmail}`
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../styles/lib';

.generic-footer {
  background: $black;
  color: $white;
  padding: $spacer * 4 0;

  @include media-breakpoint-down(md) {
    padding: $spacer;
  }

  a {
    color: inherit;
    border-bottom: 0 !important;
  }

  h5 {
    font-family: $font-family-sans-serif;
    font-size: 1.1rem;
    color: $gray-600;
  }

  .list-unstyled .list-unstyled-item {
    line-height: 1.5em;
    margin: 5px 0;
  }

  &__icij {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    @include media-breakpoint-down(xs) {
      display: block;
    }

    &__logo {
      display: block;

      img {
        height: 54px;
      }

      @include media-breakpoint-down(xs) {
        margin-bottom: $spacer;
      }
    }
  }
}
</style>
