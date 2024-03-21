import { shallowMount } from "@vue/test-utils";
import ActiveTextTruncate from "@/components/ActiveTextTruncate.vue";

// Mock HTML element offset so the size of the wrapper can be calculated
// dynamically using JSDOM and tests
Object.defineProperties(window.HTMLElement.prototype, {
  offsetWidth: {
    get() {
      return parseFloat(this.style.width) || 0;
    },
  },
});

describe("ActiveTextTruncate.vue", () => {
  it("should be a Vue instance", () => {
    const wrapper = shallowMount(ActiveTextTruncate);
    expect(wrapper.vm).toBeTruthy();
  });

  it("should display text in the default slot", () => {
    const slots = { default: ["Lorem ipsum dolor sit amet."] };
    const wrapper = shallowMount(ActiveTextTruncate, { slots });
    expect(wrapper.text()).toBe("Lorem ipsum dolor sit amet.");
  });

  it("shoud wrap text", () => {
    const slots = { default: ["Lorem ipsum dolor sit amet."] };
    const wrapper = shallowMount(ActiveTextTruncate, { slots });
    expect(
      wrapper.find(".active-text-truncate__wrapper__text").exists(),
    ).toBeTruthy();
  });
});
