import { AccordionStep } from '@/components'
import { BButton } from 'bootstrap-vue-next'

export default {
  title: 'Murmur/components/Accordion/AccordionStep',
  component: AccordionStep,
  tags: ['autodocs'],
  argTypes: {}
}

const MAILVELOPE = Symbol('MAILVELOPE')

export const Default = {
  args: {
    active: 'active',
    step: MAILVELOPE,
    content: 'Install Mailvelope and create your key'
  },
  render: (args: any) => ({
    components: { AccordionStep, BButton },
    setup: () => ({ args }),
    template: `
      <AccordionStep v-bind="args">
        <template #title>
          <BButton @click="args.active = !args.active">
            {{ args.active ? 'Expanded' : 'Collapsed' }}
          </BButton>
          Install Mailvelope
        </template>
      </AccordionStep>
    `
  })
}
