import { Brand } from "@/components";
import { StoryObj } from "@storybook/vue3";

export default {
    title: 'Murmur/components/Brand',
    component: Brand,
    tags: ['autodocs'],
    argTypes : {
        color: { control: {type: 'color' }},
        background: { control: {type: 'color' }},
        size: {control: {type: 'number' }}
}
};

type Story = StoryObj<typeof Brand>;
const Template: Story = (args: any, argTypes:any) => ({
    components: { Brand },
    props:Object.keys(argTypes),
    setup() {
        return { args };
    },
    template: '<Brand v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {};
export const Animated = Template.bind({});
Animated.args = {animated:true,background: '#cacaca'};
export const Square = Template.bind({});
Square.args = {square:true, background: '#cacaca'};
