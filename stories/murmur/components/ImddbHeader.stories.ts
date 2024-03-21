import { ImddbHeader } from "@/components";
import { StoryObj } from "@storybook/vue3";

export default {
  title: "Murmur/components/ImddbHeader",
  component: ImddbHeader,
  tags: ["autodocs"],
  argTypes: {},
};

type Story = StoryObj<typeof ImddbHeader>;
const Template: Story = (args: any) => ({
  components: { ImddbHeader },
  setup() {
    return { args };
  },
  template: '<ImddbHeader v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {};
Default.decorators = [
  () => ({ template: '<div style="height: 1800px"><story/></div>' }),
];
Default.parameters = { layout: "fullscreen" };

export const NoHeadroom = Template.bind({});
NoHeadroom.args = { noHeadroom: true, position: "relative" };
