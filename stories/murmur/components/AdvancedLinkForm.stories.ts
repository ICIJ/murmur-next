import {AdvancedLinkForm} from "@/components";
import {BButton, BModal, useModal} from "bootstrap-vue-next";
import {StoryObj} from "@storybook/vue3";
import {ref} from "vue";

export default {
    components: {AdvancedLinkForm, BModal},
    title: 'Murmur/components/AdvancedLinkForm',
    component: AdvancedLinkForm,
    tags: ['autodocs'],
    argTypes: {
    }
};

type Story = StoryObj<typeof AdvancedLinkForm>;
const Template: Story = (args: any) => ({
    components: { AdvancedLinkForm },
    setup() {
        const showModal = ref(false)
        const {show} = useModal('my-modal')
        return {args, showModal, show};
    },
    template: '<AdvancedLinkForm v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
    title:"Medtronic spends millions each year on lobbying in the US",
    link:"https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying",
    card:true
};
const modalDecorator = () => ({
        components: { BModal, BButton },
        setup(){
            const {show} = useModal('formModal')
            return {show};
        },
        template:`  <div class="p-4 text-center">
            <button class="btn btn-info font-weight-bold" @click="show">
                Click to see the form
            </button>
        </div>
        <b-modal hide-footer hide-header body-class="p-0" id="formModal" size="md" no-headings>
            <story/>
        </b-modal>`
    })
export const InsideModal = Template.bind({});
InsideModal.decorators= [modalDecorator]
InsideModal.args = {
    title:"Medtronic spends millions each year on lobbying in the US",
    link:"https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying",
    card:true
};






