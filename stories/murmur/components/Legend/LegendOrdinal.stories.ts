import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { LegendOrdinal } from '@/components'

const meta: Meta<typeof LegendOrdinal> = {
  title: 'Murmur/components/Legend/LegendOrdinal',
  component: LegendOrdinal,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

const icijOffices = [
  { id: 'paris', color: '#6e40aa', label: 'Paris, France' },
  { id: 'sydney', color: '#ff5e63', label: 'Sydney, Australia' },
  { id: 'dc', color: '#aff05b', label: 'Washington DC, USA' }
]

const markerPath
  = 'M384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192H384z'

export const Default: Story = {
  args: {
    data: icijOffices,
    value: 'paris'
  }
}

export const Horizontal: Story = {
  args: {
    data: icijOffices,
    horizontal: true
  }
}

export const Highlighted: Story = {
  args: {
    data: icijOffices,
    highlight: 'dc',
    horizontal: true
  }
}

export const CustomMarker: Story = {
  args: {
    data: icijOffices,
    markerPath
  }
}
