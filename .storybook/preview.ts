import {setup, Preview} from '@storybook/vue3'
import './app.scss';
import Murmur from "@/main";

setup((app)=>{
  app.use(Murmur)
})
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const preview: Preview = {
  parameters
};
export default preview;
