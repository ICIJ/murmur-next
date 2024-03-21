import { TinyPagination } from "@/components";
import { StoryObj } from "@storybook/vue3";
import { Size } from "@/enums";

export default {
  title: "Murmur/components/TinyPagination",
  component: TinyPagination,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    pages: { type: "number", min: 0 },
  },
};

type Story = StoryObj<typeof TinyPagination>;
const Template: Story = (args: any) => ({
  components: { TinyPagination },
  setup() {
    return { args };
  },
  template: '<TinyPagination v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  modelValue: 1,
  totalRows: 200,
};

export const Small = Template.bind({});
Small.args = {
  modelValue: 1,
  perPage: 10,
  totalRows: 200,
  size: Size.sm,
};

export const Medium = Template.bind({});
Medium.args = {
  modelValue: 1,
  perPage: 10,
  totalRows: 200,
  size: Size.md,
};
export const Large = Template.bind({});
Large.args = {
  modelValue: 1,
  perPage: 10,
  totalRows: 200,
  size: Size.lg,
};
export const HideNavigation = Template.bind({});
HideNavigation.args = {
  modelValue: 1,
  perPage: 10,
  totalRows: 200,
  noNav: true,
};
export const CompactMode = Template.bind({});
CompactMode.args = {
  modelValue: 1,
  perPage: 10,
  totalRows: 200,
  compact: true,
};
