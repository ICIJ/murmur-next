import { memoize, flatten } from "lodash";

var assetUniqueIdCounter: number = 0;

export const injectAsset = memoize(function (
  file: string,
  id: string = `dynamic-asset-${assetUniqueIdCounter++}`,
): Promise<unknown> {
  return new Promise((resolve: (value?: unknown) => void) => {
    const parent: HTMLElement =
      document.querySelector("body") || document.querySelector("head")!;
    const parts = file.split(".");
    const ext = parts[parts.length - 1].toLowerCase();
    switch (ext) {
      case "js":
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.onload = resolve;
        parent.appendChild(script);
        script.setAttribute("src", file);
        script.setAttribute("id", id);
        break;
      case "css":
        var css = document.createElement("link");
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("type", "text/css");
        css.onload = resolve;
        parent.appendChild(css);
        css.setAttribute("href", file);
        css.setAttribute("id", id);
        break;
    }
  });
});

export const injectAssets = function (...args: string[]): Promise<void> {
  const files = flatten(args);
  return new Promise((resolve: () => void) => {
    var filesLoaded = 0;
    var allFilesLoaded = function () {
      if (++filesLoaded == files.length) {
        resolve();
      }
    };
    for (var i = 0; i < files.length; i++) {
      injectAsset(files[i]).then(allFilesLoaded);
    }
  });
};
