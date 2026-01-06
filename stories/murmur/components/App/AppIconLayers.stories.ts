import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { AppIcon, AppIconLayers } from '@/components'

// Icon imports
import IPhCircle from '~icons/ph/circle'
import IPhStarFill from '~icons/ph/star-fill'
import IPhArrowCounterClockwise from '~icons/ph/arrow-counter-clockwise'
import IPhArrowClockwiseBold from '~icons/ph/arrow-clockwise-bold'
import IPhArrowCounterClockwiseBold from '~icons/ph/arrow-counter-clockwise-bold'

const meta: Meta<typeof AppIconLayers> = {
  title: 'Murmur/components/App/AppIconLayers',
  component: AppIconLayers,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'text' }
  },
  args: {
    size: '32px'
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args: any) => ({
    components: { AppIcon, AppIconLayers, IPhCircle, IPhStarFill },
    setup: () => ({ args }),
    template: `
      <AppIconLayers v-bind="args">
        <AppIcon v-bind="args" beat fade>
          <IPhCircle />
        </AppIcon>
        <AppIcon size="lg" variant="warning" spin-reverse spin-duration="2s">
          <IPhStarFill />
        </AppIcon>
      </AppIconLayers>
    `
  })
}

export const Sizings: Story = {
  render: () => ({
    components: { AppIcon, AppIconLayers, IPhArrowCounterClockwise, IPhArrowClockwiseBold, IPhArrowCounterClockwiseBold },
    template: `
      <p>
        <AppIconLayers size="2xl">
          <AppIcon spin-reverse>
            <IPhArrowCounterClockwise />
          </AppIcon>
          <AppIcon size="lg" variant="primary" spin>
            <IPhArrowClockwiseBold />
          </AppIcon>
          <AppIcon size="xs" spin-reverse>
            <IPhArrowCounterClockwiseBold />
          </AppIcon>
        </AppIconLayers>
      </p>
    `
  })
}
