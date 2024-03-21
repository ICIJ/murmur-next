import { DigitsInput } from "@/components";
import { StoryObj } from "@storybook/vue3";

export default {
  title: "Murmur/components/DigitsInput",
  component: DigitsInput,
  tags: ["autodocs"],
  argTypes: {
    length: { type: "number", min: 0 },
  },
};

type Story = StoryObj<typeof DigitsInput>;
const Template: Story = (args: any) => ({
  components: { DigitsInput },
  setup() {
    return { args };
  },
  template: '<DigitsInput v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {};
export const FourDigits = Template.bind({});
FourDigits.args = {
  length: 4,
  modelValue: 2017,
};
