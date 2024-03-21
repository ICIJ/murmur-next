<template>
  <span class="brand" :style="style" :class="{ 'brand--animated': animated }">
    <svg
      :width="width"
      :height="height"
      viewBox="0 0 147.151 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path class="triangle" d="M101.997 200H45.155l28.42-46.427z" />
      <path
        class="globe"
        d="M119.771 19.138C107.432 6.793 91.028 0 73.576 0S39.719 6.793 27.38 19.138C15.035 31.477 8.242 47.882 8.242 65.334c0 17.451 6.793 33.856 19.138 46.195 12.339 12.339 28.744 19.138 46.196 19.138 17.452 0 33.856-6.793 46.195-19.138C132.11 99.19 138.91 82.785 138.91 65.334c0-17.452-6.793-33.857-19.138-46.196zm3.397 23.028a54.35 54.35 0 0 1 4.863 17.86H108.79c-.262-6.173-.968-12.175-2.094-17.86h16.478zM112.266 26.65a54.792 54.792 0 0 1 4.346 4.894H103.98c-1.254-3.939-2.733-7.634-4.431-11.024a61.475 61.475 0 0 0-2.6-4.681c5.619 2.654 10.793 6.288 15.316 10.81zm-14.11 33.376H78.89v-17.86h16.965c1.241 5.6 2.02 11.614 2.3 17.86zm-8.109-34.758a63.605 63.605 0 0 1 2.71 6.276H78.89v-19.48c4.03 2.174 7.92 6.721 11.157 13.204zm-32.943 0c3.238-6.477 7.134-11.03 11.158-13.203v19.473H54.395a62.794 62.794 0 0 1 2.709-6.276zm11.158 16.898v17.86H48.996c.286-6.246 1.065-12.26 2.3-17.86zM34.886 26.65A54.905 54.905 0 0 1 50.2 15.833a59.443 59.443 0 0 0-2.6 4.68c-1.698 3.391-3.177 7.086-4.43 11.025H30.538a55.764 55.764 0 0 1 4.347-4.894zm5.57 15.516c-1.127 5.685-1.833 11.687-2.095 17.86H19.12a54.201 54.201 0 0 1 4.863-17.86h16.478ZM23.976 88.507a54.35 54.35 0 0 1-4.863-17.86h19.241c.262 6.173.968 12.181 2.094 17.86H23.971Zm10.902 15.517a54.793 54.793 0 0 1-4.346-4.894h12.631c1.254 3.938 2.733 7.633 4.432 11.023a61.476 61.476 0 0 0 2.599 4.681 54.569 54.569 0 0 1-15.316-10.816zm14.11-33.376h19.266v17.86H51.29c-1.241-5.6-2.02-11.615-2.3-17.86Zm8.109 34.757a63.605 63.605 0 0 1-2.71-6.275h13.867v19.472c-4.03-2.173-7.919-6.72-11.157-13.203zm32.943 0c-3.238 6.477-7.134 11.03-11.157 13.203V99.136H92.75a62.793 62.793 0 0 1-2.709 6.275zM78.884 88.507v-17.86h19.265c-.286 6.246-1.065 12.26-2.3 17.86zm33.376 15.517a54.759 54.759 0 0 1-15.316 10.81 59.444 59.444 0 0 0 2.6-4.68c1.698-3.391 3.177-7.086 4.43-11.024h12.632a55.763 55.763 0 0 1-4.346 4.894zm-5.57-15.517c1.126-5.685 1.832-11.687 2.094-17.86h19.241a54.201 54.201 0 0 1-4.863 17.86h-16.478z"
        style="stroke-width: 0.608717"
      />
      <path
        class="plate"
        d="M 147.151 136.809 L 147.151 147.431 L 9.02755e-15 147.431 L 8.37714e-15 136.809 Z"
        style="stroke-width: 0.608717"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
/**
 * A component to create variations of ICIJ logo
 */
import { computed, ref } from "vue";
import isString from "lodash/isString";

interface BrandProps {
  /**
   * Add a balancing effect to the globe
   */
  animated?: boolean;
  /**
   * Monochromatic logo's color
   */
  color?: string | null;
  /**
   * Logo's background color
   */
  background?: string | null;
  /**
   * Logo's size
   */
  size?: number | string;
  /**
   * Force the width of the logo to be the same as the height
   */
  square?: boolean;
}

interface BrandStyle {
  "--monochrome-color": string | null;
  color: string | null;
  background: string | null;
  width: string | number;
}

const props = withDefaults(defineProps<BrandProps>(), {
  color: null,
  background: null,
  size: "70px",
});
const sizeAsNumber = ref(
  isString(props.size) ? parseInt(props.size) : props.size,
);

const width = computed(() => `${(147.151 / 200) * sizeAsNumber.value}px`);
const height = computed(() => `${sizeAsNumber.value}px`);

const style = computed<BrandStyle>(() => {
  const { square } = props;
  const widthValue = square ? height.value : "auto";

  return {
    "--monochrome-color": props.color,
    color: props.color,
    background: props.background,
    width: widthValue,
  };
});
</script>

<style scoped lang="scss">
@keyframes balancing-plate {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(7deg);
  }
  50% {
    transform: rotate(-7deg);
  }
  75% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes balancing-globe {
  0% {
    transform: rotate(0deg);
  }
  35% {
    transform: rotate(7deg);
  }
  65% {
    transform: rotate(-7deg);
  }
  85% {
    transform: rotate(3deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    .triangle,
    .globe {
      fill: var(--monochrome-color, #ff0000);
    }

    .plate {
      fill: var(--monochrome-color, #999999);
    }
  }

  &--animated svg {
    .plate {
      animation: balancing-plate 5s infinite cubic-bezier(0.37, 0, 0.63, 1);
    }
    .globe {
      animation: balancing-globe 5s infinite cubic-bezier(0.37, 0, 0.63, 1);
    }

    .plate,
    .globe {
      //noinspection CssInvalidPropertyValue
      animation-direction: repeat;
      transform: rotate(0deg);
      transform-origin: bottom center;
      transform-box: fill-box;
    }
  }
}
</style>
