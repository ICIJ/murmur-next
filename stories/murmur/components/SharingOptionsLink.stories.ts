import { SharingOptionsLink } from "@/components";
import { StoryObj } from "@storybook/vue3";

export default {
    title: 'Murmur/components/SharingOptionsLink',
    component: SharingOptionsLink,
    tags: ['autodocs'],
    argTypes: {
        network:{control:"select",options:["twitter","facebook","linkedin","email"]}
    }
};

type Story = StoryObj<typeof SharingOptionsLink>;
const Template: Story = (args: any) => ({
    components: { SharingOptionsLink },
    setup() {
        return { args };
    },
    template: '<SharingOptionsLink v-bind="args" >{{args.default}}</SharingOptionsLink>',
});

export const Default = Template.bind({});
Default.args = {
    network:"twitter",
    class:"btn btn-outline-primary mx-1",
    url:"https://www.icij.org"
};

export const NoIcon = Template.bind({});
NoIcon.args = {
    network:"twitter",
    class:"btn btn-outline-primary mx-1",
    url:"https://www.icij.org",
    noIcon:true
};
export const CustomSlot = Template.bind({});
CustomSlot.args = {
    network:"twitter",
    class:"btn btn-outline-primary mx-1",
    url:"https://www.icij.org",
    noIcon:true,
    default:"Share twitter"
};
export const CustomTagAndSlot = Template.bind({});
CustomTagAndSlot.args = {
    network:"twitter",
    title:"Murmur Design System",
    class:"btn btn-warning",
    url:"https://www.icij.org",
    noIcon:true,
    tag:"button",
    default:"Twitter Button"
};
