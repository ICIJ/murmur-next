import { EmbeddableFooter } from "@/components";
import { StoryObj } from "@storybook/vue3";
import { BButton } from "bootstrap-vue-next";

export default {
  title: "Murmur/components/EmbeddableFooter",
  decorators: [
    () => ({ template: `<div style='margin-top:200px;'><story/></div>` }),
  ],
  component: EmbeddableFooter,
  tags: ["autodocs"],
  argTypes: {},
};

type Story = StoryObj<typeof EmbeddableFooter>;
const Template: Story = (args: any) => ({
  components: { EmbeddableFooter },
  setup() {
    return { args };
  },
  template: '<EmbeddableFooter v-bind="args" ></EmbeddableFooter>',
});

export const Default = Template.bind({});
Default.args = { class: "position-relative card" };
export const LeadText = Template.bind({});
LeadText.args = { lead: "Secret project", class: "position-relative card" };
export const Title = Template.bind({});
Title.args = { title: "Secret project", class: "position-relative card" };
export const TitleSlot: Story = (args: any) => ({
  components: { EmbeddableFooter },
  setup() {
    return { args };
  },
  template: `<EmbeddableFooter v-bind="args" >
        <template #title>
            <span class="small">Demo<br />Project</span>
        </template>
    </EmbeddableFooter>`,
});

TitleSlot.args = { class: "position-relative card" };
export const MainSlot: Story = (args: any) => ({
  components: { EmbeddableFooter, BButton },
  setup() {
    return { args };
  },
  template: `<EmbeddableFooter v-bind="args" >
        <div class="d-flex align-items-center">
            <div class="flex-grow-1 me-2">
                This is an helpful text.
            </div>
            <b-button variant="info" pill size="sm" class="ms-auto me-2">
                Help
            </b-button>
        </div>
    </EmbeddableFooter>`,
});

MainSlot.args = { class: "position-relative card" };
