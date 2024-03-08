import { OrdinalLegend } from "@/components";
import { StoryObj } from "@storybook/vue3";


const data = {
    highlighted: 'dc',
    icijOffices: [
        { id: 'paris', color: '#6e40aa', label: 'Paris, France' },
        { id: 'sydney', color: '#ff5e63', label: 'Sydney, Australia' },
        { id: 'dc', color: '#aff05b', label: 'Washington DC, USA' }
    ]}
export default {
    title: 'Murmur/components/OrdinalLegend',
    component: OrdinalLegend,
    tags: ['autodocs'],
    argTypes: {
    }
};

type Story = StoryObj<typeof OrdinalLegend>;
const Template: Story = (args: any) => ({
    components: { OrdinalLegend },
    setup() {
        return { args };
    },
    template: '<OrdinalLegend v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
    data:data.icijOffices,
    value:"paris"
};
export const Horizontal = Template.bind({});
Horizontal.args = {
    data:data.icijOffices,
    horizontal:true
};
export const Highlighted = Template.bind({});
Highlighted.args = {
    data:data.icijOffices,
    highlight:data.highlighted,
    horizontal:true
};
export const CustomMarker = Template.bind({});
CustomMarker.args = {
    data:data.icijOffices,
    markerPath:"M384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192H384z"
};
