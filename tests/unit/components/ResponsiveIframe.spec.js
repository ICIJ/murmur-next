import { shallowMount } from "@vue/test-utils";
import ResponsiveIframe from "@/components/ResponsiveIframe";

describe("ResponsiveIframe", () => {
  const propsData = {
    url: "https://projects.icij.org/the-implant-files/graphics/",
  };

  it("is a Vue instance", () => {
    const wrapper = shallowMount(ResponsiveIframe, { propsData });
    expect(wrapper.vm).toBeTruthy();
  });

  it("creates a root div with a unique id", () => {
    const first = shallowMount(ResponsiveIframe, { propsData });
    const second = shallowMount(ResponsiveIframe, { propsData });
    expect(first.element.id).not.toBe(second.element.id);
  });
});
