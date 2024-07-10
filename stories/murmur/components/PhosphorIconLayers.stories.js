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
        <phosphor-icon name="star" size="1.2em" variant="warning" spin-reverse spin-duration="2s" fill />
      </phosphor-icon-layers>
    `
  })
}

export const Default = {}
