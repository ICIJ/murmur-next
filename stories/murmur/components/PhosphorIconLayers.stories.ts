import { PhosphorIcon, PhosphorIconLayers } from '@/components'
import {PhArrowClockwise, PhArrowCounterClockwise, PhCircle, PhStar} from "@phosphor-icons/vue";

export default {
  computed: {
    PhArrowClockwise() {
      return PhArrowClockwise
    },
    PhArrowCounterClockwise() {
      return PhArrowCounterClockwise
    },
    PhCircle() {
      return PhCircle
    },
    PhStar() {
      return PhStar
    }
  },
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
        <phosphor-icon :name="PhCircle" v-bind="args" beat fade />
        <phosphor-icon :name="PhStar" size="lg" variant="warning" spin-reverse spin-duration="2s" fill />
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
          <phosphor-icon :name="PhArrowCounterClockwise" spin-reverse />
          <phosphor-icon :name="PhArrowClockwise" size="lg" variant="primary" spin weight="bold" />
          <phosphor-icon :name="PhArrowCounterClockwise" size="xs" spin-reverse weight="bold" />
        </phosphor-icon-layers>
      </p>
    `
  })
}
