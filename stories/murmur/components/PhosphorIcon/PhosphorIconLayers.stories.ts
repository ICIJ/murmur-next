import { PhosphorIcon, PhosphorIconLayers } from '@/components'
import { PhArrowClockwise, PhArrowCounterClockwise, PhCircle, PhStar } from '@phosphor-icons/vue'

export default {
  title: 'Murmur/components/PhosphorIcon/PhosphorIconLayers',
  component: PhosphorIconLayers,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'text' }
  },
  args: {
    size: '32px'
  }
}

export const Default = {
  render: (args: any) => ({
    components: { PhosphorIcon, PhosphorIconLayers },
    setup: () => ({ args, PhCircle, PhStar }),
    template: `
      <PhosphorIconLayers v-bind="args">
        <PhosphorIcon :name="PhCircle" v-bind="args" beat fade />
        <PhosphorIcon :name="PhStar" size="lg" variant="warning" spin-reverse spin-duration="2s" fill />
      </PhosphorIconLayers>
    `
  })
}

export const Sizings = {
  render: () => ({
    components: { PhosphorIcon, PhosphorIconLayers },
    setup: () => ({ PhArrowClockwise, PhArrowCounterClockwise }),
    template: `
      <p>
        <PhosphorIconLayers size="2xl">
          <PhosphorIcon :name="PhArrowCounterClockwise" spin-reverse />
          <PhosphorIcon :name="PhArrowClockwise" size="lg" variant="primary" spin weight="bold" />
          <PhosphorIcon :name="PhArrowCounterClockwise" size="xs" spin-reverse weight="bold" />
        </PhosphorIconLayers>
      </p>
    `
  })
}
