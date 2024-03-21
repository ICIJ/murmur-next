import { addons } from "@storybook/manager-api";

import murmurTheme from "./murmur_theme";

addons.setConfig({
  navSize: 300,
  theme: murmurTheme,
});
