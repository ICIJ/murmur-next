import startsWith from "lodash/startsWith";
import { shallowMount, mount } from "@vue/test-utils";
import EmbedForm from "@/components/EmbedForm.vue";

describe("EmbedForm.vue", () => {
  const global = { stubs: { HapticCopy: true } };
  const propsData = {
    url: "https://projects.icij.org/the-implant-files/graphics/",
  };

  it("is a Vue instance", () => {
    const wrapper = shallowMount(EmbedForm, { propsData, global });
    expect(wrapper.vm).toBeTruthy();
  });

  it("shows title when props.noTitle isn't passed", () => {
    const wrapper = shallowMount(EmbedForm, { propsData, global });
    expect(wrapper.find(".embed-form__heading").exists()).toBeTruthy();
  });

  it("hides show title when props.noTitle is passed", () => {
    const noTitle = true;
    const wrapper = shallowMount(EmbedForm, {
      propsData: { noTitle, ...propsData },
    });
    expect(wrapper.find(".embed-form__heading").exists()).toBeFalsy();
  });

  it("shows a preview panel when props.noPreview isn't passed", () => {
    const wrapper = shallowMount(EmbedForm, { propsData, global });
    expect(wrapper.find(".embed-form__preview").exists()).toBeTruthy();
  });

  it("hides a show preview panel when props.noPreview is passed", () => {
    const noPreview = true;
    const wrapper = shallowMount(EmbedForm, {
      propsData: { noPreview, ...propsData },
      global,
    });
    expect(wrapper.find(".embed-form__preview").exists()).toBeFalsy();
  });

  it("shows a preview panel with an iframe targeting the passed props.url", () => {
    const wrapper = shallowMount(EmbedForm, { propsData, global });
    const src = wrapper.element.querySelector(
      ".embed-form__preview iframe",
    ).src;
    expect(src).toBe(propsData.url);
  });

  it("shows a preview panel with an iframe targeting the passed props.url without pym params", () => {
    const url =
      "https://projects.icij.org/the-implant-files/graphics/?initialWidth=720&childId=example-graphic";
    const wrapper = shallowMount(EmbedForm, {
      propsData: { url },
      global,
    });
    const src = wrapper.element.querySelector(
      ".embed-form__preview iframe",
    ).src;
    expect(src).toBe("https://projects.icij.org/the-implant-files/graphics/");
  });

  it("renders iframe height to 150 according to the passed props.height", () => {
    const wrapper = shallowMount(EmbedForm, {
      propsData: { height: 150, ...propsData },
      global,
    });
    const height = wrapper.element.querySelector(
      ".embed-form__preview iframe",
    ).height;
    expect(height).toBe("150");
  });

  it("renders iframe height to 250 according to the passed props.height", () => {
    const wrapper = shallowMount(EmbedForm, {
      propsData: { height: 250, ...propsData },
      global,
    });
    const height = wrapper.element.querySelector(
      ".embed-form__preview iframe",
    ).height;
    expect(height).toBe("250");
  });

  it("renders iframe width to 100% when no value is passed to props.width", () => {
    const wrapper = shallowMount(EmbedForm, { propsData, global });
    const width = wrapper.element.querySelector(
      ".embed-form__preview iframe",
    ).width;
    expect(width).toBe("100%");
  });

  it("renders iframe width to 150 according to the passed props.width", () => {
    const wrapper = shallowMount(EmbedForm, {
      propsData: { width: 150, ...propsData },
      global,
    });
    const width = wrapper.element.querySelector(
      ".embed-form__preview iframe",
    ).width;
    expect(width).toBe("150");
  });

  it("renders iframe width to 250 according to the passed props.width", () => {
    const wrapper = shallowMount(EmbedForm, {
      propsData: { width: 250, ...propsData },
      global,
    });
    const width = wrapper.element.querySelector(
      ".embed-form__preview iframe",
    ).width;
    expect(width).toBe("250");
  });

  it("renders a responsive iframe when `responsiveCheck` is true", () => {
    const wrapper = shallowMount(EmbedForm, { propsData, global });
    expect(startsWith(wrapper.vm.embedCode(), "<iframe ")).toBeTruthy();
    wrapper.vm.responsiveCheck = true;
    expect(startsWith(wrapper.vm.embedCode(), "<script ")).toBeTruthy();
  });

  it("mount", () => {
    const wrapper = mount(EmbedForm, { propsData, global });
    expect(startsWith(wrapper.vm.embedCode(), "<iframe ")).toBeTruthy();
    wrapper.vm.responsiveCheck = true;
    expect(startsWith(wrapper.vm.embedCode(), "<script ")).toBeTruthy();
  });
});
