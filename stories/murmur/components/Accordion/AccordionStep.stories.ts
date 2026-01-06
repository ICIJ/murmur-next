import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { AccordionStep } from '@/components'
import { BButton } from 'bootstrap-vue-next'

const meta: Meta<typeof AccordionStep> = {
  title: 'Murmur/components/Accordion/AccordionStep',
  component: AccordionStep,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

const MAILVELOPE = Symbol('MAILVELOPE')

export const Default: Story = {
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
