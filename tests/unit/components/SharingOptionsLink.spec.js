import { mount } from "@vue/test-utils";

import SharingOptionsLink, { $popup } from "@/components/SharingOptionsLink";

function mockPopupParent() {
  return {
    open: vi.fn().mockImplementation(() => {
      return {
        focus: vi.fn(),
        close: vi.fn(),
      };
    }),
  };
}

vi.useFakeTimers();

describe("SharingOptionsLink", () => {
  const propsData = { network: "twitter" };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("should be a Vue instance", () => {
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.vm).toBeTruthy();
  });

  it("should generate the component with `a` tag", () => {
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.element.tagName).toBe("A");
  });

  it("should generate the component with `button` tag", () => {
    const propsData = { network: "twitter", tag: "button" };
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.element.tagName).toBe("BUTTON");
  });

  it("should validate prop against platforms names", () => {
    const validator = SharingOptionsLink.props.network.validator;
    expect(validator("foo")).toBe(false);
    expect(validator("email")).toBe(true);
  });

  it("should give a different `base` for Twitter", () => {
    const propsData = { network: "twitter" };
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.vm.base).toBe("https://twitter.com/intent/tweet?");
  });

  it("should give a different `base` for Facebook", () => {
    const propsData = { network: "facebook" };
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.vm.base).toBe("https://www.facebook.com/sharer.php?");
  });

  it("should give a different `base` for Linkedin", () => {
    const propsData = { network: "linkedin" };
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.vm.base).toBe(
      "https://www.linkedin.com/sharing/share-offsite/?",
    );
  });

  it("should have a popup", () => {
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.vm.hasPopup()).toBeTruthy();
  });

  it("shouldn't have a popup when network is `email`", () => {
    const propsData = { network: "email" };
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.vm.hasPopup()).toBeFalsy();
  });

  it("should create a query with the correct `url` param", () => {
    const propsData = { network: "twitter", url: "https://icij.org" };
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.vm.query.url).toBe(propsData.url);
  });

  it("should create a query with the correct `u` param", () => {
    const propsData = { network: "facebook", url: "https://icij.org" };
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.vm.query.u).toBe(propsData.url);
  });

  it("should create a query with the correct `text` param", () => {
    const propsData = { network: "twitter", title: "Foo" };
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.vm.query.text).toBe(propsData.title);
  });

  it("should create a query with the correct `title` param", () => {
    const propsData = { network: "facebook", title: "Foo" };
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.vm.query.title).toBe(propsData.title);
  });

  it("should create a query with the correct `summary` param", () => {
    const propsData = { network: "linkedin", description: "Foo" };
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.vm.query.summary).toBe(propsData.description);
  });

  it("should have correct `args` for Twitter", () => {
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.vm.args).toHaveProperty("url");
    expect(wrapper.vm.args).toHaveProperty("text");
    expect(wrapper.vm.args).toHaveProperty("via");
    expect(wrapper.vm.args).toHaveProperty("hashtags");
  });

  it("should have correct `args` for Facebook", () => {
    const propsData = { network: "facebook" };
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect(wrapper.vm.args).toHaveProperty("u");
    expect(wrapper.vm.args).toHaveProperty("title");
    expect(wrapper.vm.args).toHaveProperty("description");
    expect(wrapper.vm.args).toHaveProperty("hashtag");
  });

  it("should create open a popup when clicking on the component", async () => {
    const propsData = { network: "twitter", title: "Foo" };
    const wrapper = mount(SharingOptionsLink, { propsData });
    // Create two spies that must be called when clicking
    const spyOpenPopup = vi
      .spyOn(wrapper.vm, "openPopup")
      .mockImplementation(() => null);
    const spyCleanExistingPopup = vi
      .spyOn(wrapper.vm, "cleanExistingPopupInstance")
      .mockImplementation(() => null);
    await wrapper.trigger("click");
    expect(spyOpenPopup).toBeCalled();
    expect(spyCleanExistingPopup).toBeCalled();
  });

  it("should clear the interval and close existing popup when clicking on the component", () => {
    const wrapper = mount(SharingOptionsLink, { propsData });
    $popup.instance = { close: vi.fn(), focus: vi.fn() };
    $popup.interval = setInterval(() => null);
    wrapper.vm.cleanExistingPopupInstance();
    expect($popup.interval).toBe(undefined);
    expect($popup.instance.close).toBeCalled();
  });

  it("should share popup between components", () => {
    $popup.instance = { close: vi.fn(), focus: vi.fn() };
    $popup.interval = setInterval(() => null);
    const wrapperA = mount(SharingOptionsLink, { propsData });
    const wrapperB = mount(SharingOptionsLink, { propsData });
    wrapperA.vm.cleanExistingPopupInstance();
    expect($popup.interval).toBe(undefined);
    expect($popup.instance.close).toBeCalled();
    wrapperB.vm.cleanExistingPopupInstance();
    expect($popup.interval).toBe(undefined);
    expect($popup.instance.close).toBeCalled();
  });

  it("should open a popup wgen clicking on the component", async () => {
    // Return a fake popup instance
    $popup.parent = mockPopupParent();
    const wrapper = mount(SharingOptionsLink, { propsData });
    expect($popup.parent.open).not.toBeCalled();
    await wrapper.trigger("click");
    expect($popup.parent.open).toBeCalled();
  });

  it("should clear the popup instance once it been closed", async () => {
    // Return a fake popup instance
    $popup.parent = mockPopupParent();
    const wrapper = mount(SharingOptionsLink, { propsData });
    wrapper.vm.cleanExistingPopupInstance();
    await wrapper.trigger("click");
    expect($popup.instance).not.toBe(null);
    expect($popup.interval).not.toBe(undefined);
    // Close the popup
    $popup.instance.closed = true;
    // Wait for the interval to be called
    vi.advanceTimersByTime(1000);
    // And check again!
    expect($popup.instance).toBe(null);
    expect($popup.interval).toBe(undefined);
  });
});
