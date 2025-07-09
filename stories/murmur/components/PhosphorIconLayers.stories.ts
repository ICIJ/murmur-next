import { PhosphorIcon, PhosphorIconLayers } from '@/components'

export default {
  title: 'Murmur/Components/PhosphorIconLayers',
  tags: ['autodocs'],
  components: PhosphorIconLayers,
  argTypes: {
    size: {
      control: { type: 'string' }
    }
  },
  args: {
    size: '32px'
  },
  render: (args) => ({
    components: {
      PhosphorIcon,
      PhosphorIconLayers
    },
    setup() {
      return {
        args
      }
    },
    template: `
      <phosphor-icon-layers v-bind="args">
        <phosphor-icon name="circle" v-bind="args" beat fade />
        <phosphor-icon name="star" size="lg" variant="warning" spin-reverse spin-duration="2s" fill />
      </phosphor-icon-layers>
    `
  })
}

export const Default = {}

export const Sizings = {
  render: () => ({
    components: {
      PhosphorIcon
    },
    template: `
      <p>
        <phosphor-icon-layers size="2xl">
          <phosphor-icon name="arrow-counter-clockwise" spin-reverse />
          <phosphor-icon name="arrow-clockwise" size="lg" variant="primary" spin weight="bold" />
          <phosphor-icon name="arrow-counter-clockwise" size="xs" spin-reverse weight="bold" />
        </phosphor-icon-layers>
      </p>
    `
  })
}
