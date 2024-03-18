import { SymbolMap } from "@/maps";
import { StoryObj } from "@storybook/vue3";

export default {
    title: 'Murmur/maps/SymbolMap',
    component: SymbolMap,
    tags: ['autodocs'],
    argTypes: {
    }
};

type Story = StoryObj<typeof SymbolMap>;
const Template: Story = (args: any) => ({
    components: { SymbolMap },
    setup() {
        return { args };
    },
    template: `<SymbolMap v-bind="args" />`
});

export const Default = Template.bind({});
Default.args = {

};
