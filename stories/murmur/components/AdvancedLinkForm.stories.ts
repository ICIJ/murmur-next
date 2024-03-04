import {AdvancedLinkForm} from "@/components";
import {BButton, BCard, BModal, BPopover, useModal} from "bootstrap-vue-next";
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
            <button class="btn btn-info fw-bold" @click="show">
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

const popoverDecorator = () => ({
    components: { BPopover },
    template:`    <div>
        <div class="p-4 text-center">
            <button class="btn btn-info fw-bold" id="popover-button-sample">
                Click to see the form
            </button>
        </div>
        <b-popover target="popover-button-sample" placement="right" >
            <story id="popover-button-sample"/>
        </b-popover>
    </div>`
})

export const InsidePopover = Template.bind({});
InsidePopover.decorators= [popoverDecorator]
InsidePopover.args = {
    title:"Medtronic spends millions each year on lobbying in the US",
    link:"https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying",
    card:true,
    small:true,
    noFade:true,
    forms:['raw', 'markdown']
};

const tabPillsDecorator = () => ({
    components: { BCard },
    template:`<div class="text-center p-4">
        <b-card no-body>
            <story/>
        </b-card>
    </div>`
})
export const WithTabPills = Template.bind({});
WithTabPills.decorators= [tabPillsDecorator]
WithTabPills.args = {
    title:"Medtronic spends millions each year on lobbying in the US",
    link:"https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying",
    card:true,
    pills:true,
};
export const WithTabPillsActiveClass = Template.bind({});
WithTabPillsActiveClass.decorators= [tabPillsDecorator]
WithTabPillsActiveClass.args = {
    title:"Medtronic spends millions each year on lobbying in the US",
    link:"https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying",
    card:true,
    pills:true,
    activeNavItemClass:"bg-primary fw-bold"
};
