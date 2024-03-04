import { CustomPagination } from "@/components";
import { StoryObj } from "@storybook/vue3";
import {Size} from "../../../lib/enums";

export default {
    title: 'Murmur/components/CustomPagination',
    component: CustomPagination,
    tags: ['autodocs'],
    argTypes: {
        modelValue:{ type:"number", min:0 },
        perPage:{ type:"number", min:0 },
        totalRows:{ type:"number", min:0 },
        pages:{ type:"number", min:0 },
        size:{ type:"select", options:["sm","md","lg"] }
    }
};

type Story = StoryObj<typeof CustomPagination>;
const Template: Story = (args: any) => ({
    components: { CustomPagination },
    setup() {
        return { args };
    },
    template: '<CustomPagination v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {modelValue:1, perPage:10,totalRows:200};
export const Small = Template.bind({});
Small.args = {modelValue:1, perPage:10,totalRows:200, size:Size.sm};
export const Medium = Template.bind({});
Medium.args = {modelValue:1, perPage:10,totalRows:200, size:Size.md};
export const Large = Template.bind({});
Large.args = {modelValue:1, perPage:10,totalRows:200, size:Size.lg};
export const Compact = Template.bind({});
Compact.args = {modelValue:1, perPage:10,totalRows:200, compact:true}
export const Pills = Template.bind({});
Pills.args = {modelValue:1, perPage:10,totalRows:200, pills:true}
export const PillsSmall = Template.bind({});
PillsSmall.args = {modelValue:1, perPage:10,totalRows:200, pills:true, size:Size.sm}
export const PillsCompact = Template.bind({});
PillsCompact.args = {modelValue:1, perPage:10,totalRows:200, pills:true, compact:true}
