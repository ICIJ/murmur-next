import { SharingOptions } from "@/components";
import { StoryObj } from "@storybook/vue3";

export default {
    title: 'Murmur/components/SharingOptions',
    component: SharingOptions,
    tags: ['autodocs'],
    argTypes: {
        direction:{control:'select',options:['row', 'row-reverse', 'column', 'column-reverse']}
    }
};

type Story = StoryObj<typeof SharingOptions>;
const Template: Story = (args: any) => ({
    components: { SharingOptions },
    setup() {
        return { args };
    },
    template: `<SharingOptions v-bind="args" />`,
});

export const Default = Template.bind({});
Default.args = {};
export const WithUrl = Template.bind({});
WithUrl.args = {
    url:"https://www.icij.org/",
    class:"justify-content-center"
};
export const DirectionColumn = Template.bind({});
DirectionColumn.args = {
    direction:"column"
};
