import { ResponsiveIframe } from "@/components";
import { StoryObj } from "@storybook/vue3";

export default {
  title: "Murmur/components/ResponsiveIframe",
  component: ResponsiveIframe,
  tags: ["autodocs"],
  argTypes: {},
};

type Story = StoryObj<typeof ResponsiveIframe>;
const Template: Story = (args: any) => ({
  components: { ResponsiveIframe },
  setup() {
    return { args };
  },
  template: `<ResponsiveIframe v-bind="args" />`,
});

export const Default = Template.bind({});
Default.args = {
  url: "https://projects.icij.org/the-implant-files/graphics/#/adverse-events?no-embeddable-footer=1",
};
