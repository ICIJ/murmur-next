import { AccordionWrapper } from "@/components";
import { StoryObj } from "@storybook/vue3";
import { BButton } from "bootstrap-vue-next";
import { bgStripedDecorator } from "../decorators";

export default {
  title: "Murmur/components/AccordionWrapper",
  component: AccordionWrapper,
  tags: ["autodocs"],
  argTypes: {},
};

type Story = StoryObj<typeof AccordionWrapper>;
const stepsEnum = Object.freeze({
  MAILVELOPE: Symbol("MAILVELOPE"),
  EXPORT_PUBLIC_KEY: Symbol("EXPORT_PUBLIC_KEY"),
  UPLOAD_PUBLIC_KEY: Symbol("UPLOAD_PGP"),
});
const data = {
  step: stepsEnum.MAILVELOPE,
  steps: Object.values(stepsEnum),
  active: false,
};
const Template: Story = (args: any) => ({
  components: { AccordionWrapper, BButton },
  setup() {
    return { stepsEnum, args };
  },
  template: `<AccordionWrapper v-bind="args" @step-change="args.step=$event">
        <accordion-step
          :step="stepsEnum.MAILVELOPE"
          class="accordion-step__mailvelope"
          title="Install Mailvelope"
          content="Install Mailvelope and create your key"
        />
        <accordion-step
          :step="stepsEnum.EXPORT_PUBLIC_KEY"
          title="Export your public key"
        >
            <template #content>
                <p>
                    Export your public PGP key as a .asc file and download on your
                    computer
                </p>
            </template>
        </accordion-step>
        <accordion-step
          :step="stepsEnum.UPLOAD_PUBLIC_KEY"
        >
            <template #title>
                Upload your publickey
            </template>
            <template #nextStepButton>
                <b-button variant="info">The end!</b-button>
            </template>
        </accordion-step>
    </AccordionWrapper>`,
});

export const Default = Template.bind({});
Default.decorators = [bgStripedDecorator];
Default.args = {
  steps: data.steps,
  step: data.step,
  class: "p-2",
};
