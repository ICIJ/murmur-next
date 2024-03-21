import { AccordionStep } from '@/components'
import { StoryObj } from '@storybook/vue3'
import { BButton } from 'bootstrap-vue-next'
const stepsEnum = Object.freeze({
  MAILVELOPE: Symbol('MAILVELOPE'),
  EXPORT_PUBLIC_KEY: Symbol('EXPORT_PUBLIC_KEY'),
  UPLOAD_PUBLIC_KEY: Symbol('UPLOAD_PGP')
})
export default {
  title: 'Murmur/components/AccordionStep',
  component: AccordionStep,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof AccordionStep>
const Template: Story = (args: any) => ({
  components: { AccordionStep, BButton },
  setup() {
    return { args }
  },
  template: `<AccordionStep v-bind="args" ><template #title>
        <b-button @click="args.active = !args.active">{{args.active?'Expanded':'Collapsed'}}</b-button> Install Mailvelope
    </template></AccordionStep>`
})

export const Default = Template.bind({})
Default.args = {
  active: 'active',
  step: stepsEnum.MAILVELOPE,
  content: 'Install Mailvelope and create your key'
}
