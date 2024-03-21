<script lang="ts">
import { values } from "lodash";
import { geoDistance, GeoProjection } from "d3-geo";
import { computed, defineComponent, inject, toRaw } from "vue";
import { ParentKey } from "@/keys";
import { ParentMap } from "@/types";

export const PLACEMENTS = {
  TOP: "top",
  TOPLEFT: "topleft",
  TOPRIGHT: "topright",
  RIGHT: "right",
  RIGHTTOP: "righttop",
  RIGHTBOTTOM: "rightbottom",
  BOTTOM: "bottom",
  BOTTOMLEFT: "bottomleft",
  BOTTOMRIGHT: "bottomright",
  LEFT: "left",
  LEFTTOP: "lefttop",
  LEFTBOTTOM: "leftbottom",
};

export default defineComponent({
  name: "ChoroplethMapAnnotation",
  props: {
    /**
     * Latitude of the annotation.
     */
    latitude: {
      type: Number,
      required: true,
    },
    /**
     * Longitude of the annotation.
     */
    longitude: {
      type: Number,
      required: true,
    },
    /**
     * Maximum height of the annotation container.
     */
    height: {
      type: Number,
      default: 150,
    },
    /**
     * Maximum width of the annotation container.
     */
    width: {
      type: Number,
      default: 150,
    },
    /**
     * If true the annotation will scale with the map zoom.
     */
    scale: {
      type: Boolean,
    },
    /**
     * Text color of the annotation.
     */
    color: {
      type: String,
    },
    /**
     * Override the default drop-shadow filter applied to the annotation.
     */
    dropShadow: {
      type: String,
    },
    /**
     * Radian distance from the center of the Earth after which the annotation is hidden.
     * The Earth's circumference can be divided into 360 degrees, or 2π radians.
     * Therefore, 1.57 radians is approximately a quarter of π (since π≈3.14), which corresponds to
     * a quarter of the Earth's circumference.
     */
    geoDistanceThreshold: {
      type: Number,
      default: 1.57,
    },
    /**
     * Placement of the annotation. Can be: top, topleft, topright, right,<br />
     * righttop, rightbottom, bottom, bottomleft, bottomright, left, lefttop,
     * and leftbottom. If `null`, the annotation will be centered.
     */
    placement: {
      type: String,
      default: null,
      validator: (p: null | string) =>
        p === null || values(PLACEMENTS).includes(p),
    },
  },
  setup(props) {
    const parent = inject<ParentMap>(ParentKey);

    if (!parent) {
      throw new Error("parent is undefined");
    }

    const mapRect = parent.mapRect;
    const mapTransform1 = parent.mapTransform;
    const rotatingMapProjection = parent.rotatingMapProjection;
    const mapTransform = computed(() => {
      return toRaw(parent.mapTransform);
    });

    const translateY = computed(() => {
      if (isTop.value) {
        return 0 - props.height;
      }
      if (isBottom.value) {
        return 0;
      }
      return 0 - props.height / 2;
    });
    const isTop = computed(() => {
      return [
        PLACEMENTS.TOP,
        PLACEMENTS.TOPLEFT,
        PLACEMENTS.TOPRIGHT,
        PLACEMENTS.LEFTTOP,
        PLACEMENTS.RIGHTTOP,
      ].includes(props.placement);
    });
    const classList = computed(() => {
      return {
        "choropleth-map-annotation--center": isCenter.value,
        "choropleth-map-annotation--right": isRight.value,
        "choropleth-map-annotation--left": isLeft.value,
        "choropleth-map-annotation--top": isTop.value,
        "choropleth-map-annotation--bottom": isBottom.value,
      };
    });

    const center = computed((): [number, number] => {
      return [props.longitude, props.latitude];
    });

    const projection = computed(() => {
      return rotatingMapProjection.value as GeoProjection;
    });

    const position = computed(() => {
      const [x, y] = projection.value(center.value);
      return { x, y };
    });

    const mapK = computed(() => {
      return mapTransform.value.k;
    });

    const translateX = computed(() => {
      if (isRight.value) {
        return 0;
      }
      if (isLeft.value) {
        return 0 - props.width;
      }
      return 0 - props.width / 2;
    });

    const transform = computed(() => {
      return `translate(${translateX.value}, ${translateY.value})`;
    });

    const x = computed(() => {
      return position.value.x;
    });

    const y = computed(() => {
      return position.value.y;
    });

    const isRight = computed(() => {
      return [
        PLACEMENTS.RIGHT,
        PLACEMENTS.RIGHTBOTTOM,
        PLACEMENTS.RIGHTTOP,
        PLACEMENTS.BOTTOMRIGHT,
        PLACEMENTS.TOPRIGHT,
      ].includes(props.placement);
    });

    const isLeft = computed(() => {
      return [
        PLACEMENTS.LEFT,
        PLACEMENTS.LEFTBOTTOM,
        PLACEMENTS.LEFTTOP,
        PLACEMENTS.BOTTOMLEFT,
        PLACEMENTS.TOPLEFT,
      ].includes(props.placement);
    });

    const isBottom = computed(() => {
      return [
        PLACEMENTS.BOTTOM,
        PLACEMENTS.BOTTOMLEFT,
        PLACEMENTS.BOTTOMRIGHT,
        PLACEMENTS.LEFTBOTTOM,
        PLACEMENTS.RIGHTBOTTOM,
      ].includes(props.placement);
    });

    const isCenter = computed(() => {
      return !isLeft.value && !isRight.value && !isTop.value && !isBottom.value;
    });

    const wrapperStyle = computed(() => {
      return {
        "--color": props.color,
        "--drop-shadow": props.dropShadow,
        "--scale": props.scale ? null : 1 / mapK.value,
        "--transform-origin": wrapperTransformOrigin.value,
      };
    });

    const wrapperTransformOrigin = computed(() => {
      return `${wrapperTransformOriginX.value} ${wrapperTransformOriginY.value}`;
    });

    const wrapperTransformOriginX = computed(() => {
      if (isRight.value) {
        return "left";
      } else if (isLeft.value) {
        return "right";
      }
      return "center";
    });

    const wrapperTransformOriginY = computed(() => {
      if (isTop.value) {
        return "bottom";
      } else if (isBottom.value) {
        return "top";
      }
      return "center";
    });
    const geoDistanceFromCenter = computed(() => {
      try {
        if (!projection.value?.invert) {
          return 0;
        }
        const mapCenter = projection.value.invert([
          mapRect.value.width / 2,
          mapRect.value.height / 2,
        ]);
        return geoDistance(center.value, mapCenter);
      } catch (_) {
        return 0;
      }
    });
    const isVisible = computed(() => {
      return geoDistanceFromCenter.value <= props.geoDistanceThreshold;
    });

    return {
      classList,
      x,
      y,
      wrapperStyle,
      isVisible,
      isRight,
      isLeft,
      isTop,
      isBottom,
      isCenter,
      translateX,
      translateY,
      transform,
      wrapperTransformOriginX,
      wrapperTransformOriginY,
      wrapperTransformOrigin,
      geoDistanceFromCenter,
      mapTransform,
    };
  },
});
</script>

<template>
  <g :class="classList" class="choropleth-map-annotation">
    <foreignObject
      :height="height"
      :transform="transform"
      :width="width"
      :x="x"
      :y="y"
    >
      <div
        v-show="isVisible"
        :style="wrapperStyle"
        class="choropleth-map-annotation__wrapper"
      >
        <div class="choropleth-map-annotation__wrapper__content">
          <slot />
        </div>
      </div>
    </foreignObject>
  </g>
</template>

<style lang="scss" scoped>
@import "../styles/lib";

.choropleth-map-annotation {
  --color: #{$body-color};
  --drop-shadow: 0 0 1px #fff;
  --scale: 1;
  --transform-origin: "center center";

  pointer-events: none;
  font-size: 1rem;
  line-height: 1;

  &__wrapper {
    color: var(--color);
    height: 100%;
    width: 100%;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    transform: scale(var(--scale));
    transform-origin: var(--transform-origin);
    filter: drop-shadow(var(--drop-shadow));

    .choropleth-map-annotation--right & {
      justify-content: start;
      text-align: left;
    }

    .choropleth-map-annotation--left & {
      justify-content: end;
      text-align: right;
    }

    .choropleth-map-annotation--top & {
      align-items: end;
    }

    .choropleth-map-annotation--bottom & {
      align-items: start;
    }
  }
}
</style>
