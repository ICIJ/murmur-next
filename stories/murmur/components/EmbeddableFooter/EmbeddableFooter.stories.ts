import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { EmbeddableFooter } from '@/components'
import { BButton } from 'bootstrap-vue-next'

const meta: Meta<typeof EmbeddableFooter> = {
  title: 'Murmur/components/EmbeddableFooter/EmbeddableFooter',
  component: EmbeddableFooter,
  tags: ['autodocs'],
  decorators: [() => ({ template: '<div style="margin-top:200px;"><story/></div>' })],
  argTypes: {},
  args: {
    class: 'position-relative card'
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}

export const LeadText: Story = {
  args: { lead: 'Secret project' }
}

export const Title: Story = {
  args: { title: 'Secret project' }
}

export const TitleSlot: Story = {
  render: (args: any) => ({
    components: { EmbeddableFooter },
    setup: () => ({ args }),
    template: `
      <EmbeddableFooter v-bind="args">
        <template #title>
          <span class="small">Demo<br />Project</span>
        </template>
      </EmbeddableFooter>
    `
  })
}

export const MainSlot: Story = {
  render: (args: any) => ({
    components: { EmbeddableFooter, BButton },
    setup: () => ({ args }),
    template: `
      <EmbeddableFooter v-bind="args">
        <div class="d-flex align-items-center">
          <div class="flex-grow-1 me-2">
            This is an helpful text.
          </div>
          <BButton variant="info" pill size="sm" class="ms-auto me-2">
            Help
          </BButton>
        </div>
      </EmbeddableFooter>
    `
  })
}
