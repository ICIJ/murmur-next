import { ConfirmButton } from "@/components";
import { StoryObj } from "@storybook/vue3";

export default {
  title: "Murmur/components/ConfirmButton",
  component: ConfirmButton,
  tags: ["autodocs"],
  argTypes: {},
};

type Story = StoryObj<typeof ConfirmButton>;
const Template: Story = (args: any) => ({
  components: { ConfirmButton },
  setup() {
    return { args };
  },
  template: `<ConfirmButton v-bind="args" >Click to confirm</ConfirmButton>`,
});

function confirmedFn() {
  alert("Confirmed !");
}
export const Default = Template.bind({});
Default.args = {
  class: "btn btn-info",
  confirmed: confirmedFn,
  noCloseButton: true,
};
export const WithDescription = Template.bind({});
WithDescription.args = {
  class: "btn btn-info",
  description: "Do, or do not. There is no try.",
};
export const WithLabel = Template.bind({});
WithLabel.args = {
  class: "btn btn-info",
  label: "Will you bilge Matey?",
  yes: "Aye",
  no: "Abandon ship!",
};
