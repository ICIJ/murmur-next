import { EmbeddableFooter } from '@/components'
import { BButton } from 'bootstrap-vue-next'

export default {
  title: 'Murmur/components/EmbeddableFooter/EmbeddableFooter',
  component: EmbeddableFooter,
  tags: ['autodocs'],
  decorators: [() => ({ template: '<div style="margin-top:200px;"><story/></div>' })],
  argTypes: {},
  args: {
    class: 'position-relative card'
  }
}

export const Default = {
  args: {}
}

export const LeadText = {
  args: { lead: 'Secret project' }
}

export const Title = {
  args: { title: 'Secret project' }
}

export const TitleSlot = {
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

export const MainSlot = {
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
