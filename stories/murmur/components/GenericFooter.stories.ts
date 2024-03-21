import { GenericFooter } from "@/components";
import { StoryObj } from "@storybook/vue3";

export default {
  title: "Murmur/components/GenericFooter",
  component: GenericFooter,
  tags: ["autodocs"],
  argTypes: {},
};

type Story = StoryObj<typeof GenericFooter>;
const Template: Story = (args: any) => ({
  components: { GenericFooter },
  setup() {
    return { args };
  },
  template: '<GenericFooter v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = { class: "card m-4" };
export const AboutUs = Template.bind({});
AboutUs.args = { showAboutUs: true };

export const Version = Template.bind({});
Version.args = { version: "alpha-10.2" };
