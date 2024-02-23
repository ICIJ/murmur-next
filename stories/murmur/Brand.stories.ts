import {Brand} from '@/components'
import {Meta, StoryObj} from '@storybook/vue3'
export default {
    title: 'Murmur/Brand',
    component: Brand,
    tags: ['autodocs'],
    argTypes : {
        color: {
            control: {type: 'color' }
        },
        background: {
            control: {type: 'color' }
        },
        size: {
            control: {type: 'number' }
        }
    }
} as Meta
type Story = StoryObj<typeof Brand>

const Template:Story  = (args: any ) => ({
    components: { Brand },
    setup() {
        return { args }
    },
    template: '<Brand v-bind="args" />',
})
export const Default =Template.bind({})
Default.args={}

