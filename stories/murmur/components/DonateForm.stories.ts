import {DonateForm} from "@/components";
import {StoryObj} from "@storybook/vue3";
import {BModal, useModal} from "bootstrap-vue-next";

export default {
  title: 'Murmur/components/DonateForm',
  component: DonateForm,
  tags: ['autodocs'],
  argTypes: {}
};

type Story = StoryObj<typeof DonateForm>;
const Template: Story = (args: any) => ({
  components: {DonateForm},
  setup() {
    return {args};
  },
  template: '<DonateForm v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {};
const modalDecorator = () => ({
  components: {BModal},
  setup() {
    const {show} = useModal('formModal')
    return {show};
  },
  template: `
    <div class="p-4 text-center">
      <button class="btn btn-info fw-bold" @click="show">
        Click to see the form
      </button>
    </div>
    <b-modal hide-footer lazy title="Support ICIJ" id="formModal" size="lg" no-headings>
      <story/>
    </b-modal>`
})

export const InModal = Template.bind({})
InModal.decorators = [modalDecorator]
InModal.args = {
  noTitle:true
}
