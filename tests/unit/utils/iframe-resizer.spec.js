import startsWith from "lodash/startsWith";
import IframeResizer from "@/utils/iframe-resizer";

describe("iframe-resizer.ts", () => {
  it("should define a `create` static method", () => {
    expect(IframeResizer.create).toBeDefined();
  });

  it("should create an IframeResizer instance from a singleton", () => {
    const first = IframeResizer.create();
    const second = IframeResizer.create();
    expect(first).toEqual(second);
  });

  it("should return a promise from the `sendHeight` method", () => {
    const resizer = IframeResizer.create();
    expect(resizer.sendHeight()).toBeInstanceOf(Promise);
  });

  it("should define a `template` static method", () => {
    expect(IframeResizer.template).toBeDefined();
  });

  it("should return a script tag as template", () => {
    expect(startsWith(IframeResizer.template(), "<script ")).toBeTruthy();
  });

  it("should return a script tag as template with a custom id", () => {
    const template = IframeResizer.template(window.location.href, "uwu");
    expect(startsWith(template, "<script ")).toBeTruthy();
    expect(template.includes('id="uwu"')).toBeTruthy();
  });

  it("should define a `deletePymParams` static method", () => {
    expect(IframeResizer.deletePymParams).toBeDefined();
  });

  it("should delete Pym's params from the given location", () => {
    const url =
      "https://projects.icij.org/?initialWidth=720&childId=example-graphic";
    expect(IframeResizer.deletePymParams(url)).toBe(
      "https://projects.icij.org/",
    );
  });

  it("should delete Pym's params from the other given location", () => {
    const url = "https://projects.icij.org/test/?initialWidth=720";
    expect(IframeResizer.deletePymParams(url)).toBe(
      "https://projects.icij.org/test/",
    );
  });

  it("shouldn't delete Pym's params from given location because there is none", () => {
    const url = "https://projects.icij.org/test/?initial=720";
    expect(IframeResizer.deletePymParams(url)).toBe(url);
  });

  it("should define a `isEmbedded` static method", () => {
    expect(IframeResizer.isEmbedded).toBeDefined();
  });

  it("should say the current location is not embedded", () => {
    expect(IframeResizer.isEmbedded()).toBeFalsy();
  });

  it("should say the given location is not embedded", () => {
    const url = "https://projects.icij.org/";
    expect(IframeResizer.isEmbedded(url)).toBeFalsy();
  });

  it("should say the given location is embedded", () => {
    const url =
      "https://projects.icij.org/?initialWidth=720&childId=example-graphic";
    expect(IframeResizer.isEmbedded(url)).toBeFalsy();
  });
});
