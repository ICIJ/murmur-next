import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";

import {
  default as ChoroplethMapAnnotation,
  PLACEMENTS,
} from "@/maps/ChoroplethMapAnnotation.vue";
import type { ParentMap, ParentMapProvide } from "@/types.js";
import { ParentKey } from "@/keys.js";
import { computed } from "vue";
import { geoRobinson } from "d3-geo-projection";
import { GeoProjection } from "d3-geo";

describe("ChoroplethMapAnnotation", () => {
  const generateParentMock = ({
    rX = 0,
    rY = 0,
    width = 500,
    height = 500,
    k = 1,
  }) => ({
    rotatingMapProjection: computed((): GeoProjection | Function => {
      if (rX && rY) {
        return () => [rX, rY];
      }
      return geoRobinson();
    }),
    mapTransform: computed(() => ({ k, x: 0, y: 0, rotateX: 0, rotateY: 0 })),
    mapRect: computed(() => new DOMRect(0, 0, width, height)),
  });

  it("renders with default props", () => {
    const mockParentMap: ParentMap = generateParentMock({});
    const provide: ParentMapProvide = { [ParentKey]: mockParentMap };
    const wrapper = shallowMount(ChoroplethMapAnnotation, {
      propsData: {
        latitude: 0,
        longitude: 0,
      },
      global: { provide },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("computes position correctly", () => {
    const mockParentMap: ParentMap = generateParentMock({
      rX: 100,
      rY: 200,
      k: 1,
      width: 500,
      height: 500,
    });
    const provide: ParentMapProvide = { [ParentKey]: mockParentMap };
    const wrapper = shallowMount(ChoroplethMapAnnotation, {
      propsData: {
        latitude: 10,
        longitude: 20,
      },
      global: { provide },
    });

    expect(wrapper.vm.x).toEqual(100);
    expect(wrapper.vm.y).toEqual(200);
  });

  describe("placements", () => {
    const mockParentMap: ParentMap = generateParentMock({});
    const provide: ParentMapProvide = { [ParentKey]: mockParentMap };
    const testPlacement = (placement, expectedResults) => {
      it(`computes placement correctly for ${placement}`, () => {
        const wrapper = shallowMount(ChoroplethMapAnnotation, {
          propsData: {
            latitude: 0,
            longitude: 0,
            placement,
          },
          global: { provide },
        });

        expect(wrapper.vm.isRight).toBe(!!expectedResults.isRight);
        expect(wrapper.vm.isLeft).toBe(!!expectedResults.isLeft);
        expect(wrapper.vm.isTop).toBe(!!expectedResults.isTop);
        expect(wrapper.vm.isBottom).toBe(!!expectedResults.isBottom);
        expect(wrapper.vm.isCenter).toBe(!!expectedResults.isCenter);
      });
    };

    testPlacement(PLACEMENTS.TOP, { isTop: true });
    testPlacement(PLACEMENTS.TOPLEFT, { isLeft: true, isTop: true });
    testPlacement(PLACEMENTS.TOPRIGHT, { isRight: true, isTop: true });
    testPlacement(PLACEMENTS.RIGHT, { isRight: true });
    testPlacement(PLACEMENTS.RIGHTTOP, { isRight: true, isTop: true });
    testPlacement(PLACEMENTS.RIGHTBOTTOM, { isRight: true, isBottom: true });
    testPlacement(PLACEMENTS.BOTTOM, { isBottom: true });
    testPlacement(PLACEMENTS.BOTTOMLEFT, { isLeft: true, isBottom: true });
    testPlacement(PLACEMENTS.BOTTOMRIGHT, { isRight: true, isBottom: true });
    testPlacement(PLACEMENTS.LEFT, { isLeft: true });
    testPlacement(PLACEMENTS.LEFTTOP, { isLeft: true, isTop: true });
    testPlacement(PLACEMENTS.LEFTBOTTOM, { isLeft: true, isBottom: true });
    testPlacement(null, { isCenter: true });
  });

  describe("wrapperTransformOrigin", () => {
    const mockParentMap: ParentMap = generateParentMock({});
    const provide: ParentMapProvide = { [ParentKey]: mockParentMap };
    const testTransformOrigin = (
      placement: string,
      expectedX: string,
      expectedY: string,
    ) => {
      it(`computes wrapperTransformOrigin correctly for ${placement}`, () => {
        const wrapper = shallowMount(ChoroplethMapAnnotation, {
          propsData: {
            latitude: 0,
            longitude: 0,
            placement,
          },
          global: { provide },
        });

        expect(wrapper.vm.wrapperTransformOriginX).toBe(expectedX);
        expect(wrapper.vm.wrapperTransformOriginY).toBe(expectedY);
        expect(wrapper.vm.wrapperTransformOrigin).toBe(
          `${expectedX} ${expectedY}`,
        );
      });
    };

    testTransformOrigin(PLACEMENTS.TOP, "center", "bottom");
    testTransformOrigin(PLACEMENTS.TOPLEFT, "right", "bottom");
    testTransformOrigin(PLACEMENTS.TOPRIGHT, "left", "bottom");
    testTransformOrigin(PLACEMENTS.RIGHT, "left", "center");
    testTransformOrigin(PLACEMENTS.RIGHTTOP, "left", "bottom");
    testTransformOrigin(PLACEMENTS.RIGHTBOTTOM, "left", "top");
    testTransformOrigin(PLACEMENTS.BOTTOM, "center", "top");
    testTransformOrigin(PLACEMENTS.BOTTOMLEFT, "right", "top");
    testTransformOrigin(PLACEMENTS.BOTTOMRIGHT, "left", "top");
    testTransformOrigin(PLACEMENTS.LEFT, "right", "center");
    testTransformOrigin(PLACEMENTS.LEFTTOP, "right", "bottom");
    testTransformOrigin(PLACEMENTS.LEFTBOTTOM, "right", "top");
  });

  describe("transform", () => {
    const mockParentMap: ParentMap = generateParentMock({
      rX: 100,
      rY: 200,
      k: 1,
      width: 500,
      height: 500,
    });
    const provide: ParentMapProvide = { [ParentKey]: mockParentMap };
    const mountComponentWithProps = (propsData: any) => {
      return shallowMount(ChoroplethMapAnnotation, {
        propsData,
        global: { provide },
      });
    };

    const testCases = [
      {
        placement: PLACEMENTS.TOP,
        height: 150,
        width: 150,
        translateX: -75,
        translateY: -150,
      },
      {
        placement: PLACEMENTS.BOTTOM,
        height: 100,
        width: 200,
        translateX: -100,
        translateY: 0,
      },
      {
        placement: PLACEMENTS.LEFT,
        height: 200,
        width: 100,
        translateX: -100,
        translateY: -100,
      },
      {
        placement: PLACEMENTS.RIGHT,
        height: 150,
        width: 250,
        translateX: 0,
        translateY: -75,
      },
    ];

    testCases.forEach(
      ({ placement, height, width, translateX, translateY }) => {
        it(`computes transform correctly for placement ${placement} with height ${height} and width ${width}`, () => {
          const wrapper = mountComponentWithProps({
            latitude: 0,
            longitude: 0,
            height,
            width,
            placement,
          });

          expect(wrapper.vm.translateX).toBe(translateX);
          expect(wrapper.vm.translateY).toBe(translateY);
          expect(wrapper.vm.transform).toBe(
            `translate(${translateX}, ${translateY})`,
          );
        });
      },
    );
  });

  describe("isVisible", () => {
    it("is visible when within geoDistanceThreshold", () => {
      const mockParentMap: ParentMap = generateParentMock({});
      const provide: ParentMapProvide = { [ParentKey]: mockParentMap };
      const wrapper = shallowMount(ChoroplethMapAnnotation, {
        propsData: {
          latitude: 10,
          longitude: 0,
        },
        global: { provide },
      });

      expect(wrapper.vm.isVisible).toBeTruthy();
    });

    it("is not visible when outside geoDistanceThreshold", () => {
      const mockParentMap: ParentMap = generateParentMock({ rX: 500, rY: 0 });
      const provide: ParentMapProvide = { [ParentKey]: mockParentMap };
      const wrapper = shallowMount(ChoroplethMapAnnotation, {
        propsData: {
          latitude: 0,
          longitude: 90,
        },
        global: { provide },
      });
      expect(wrapper.vm.isVisible).toBeFalsy();
    });
  });
});
