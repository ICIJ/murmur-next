import { AppIcon, AppIconLayers } from '@/components'

// Icon imports
import IPhCircle from '~icons/ph/circle'
import IPhStarFill from '~icons/ph/star-fill'
import IPhArrowCounterClockwise from '~icons/ph/arrow-counter-clockwise'
import IPhArrowClockwiseBold from '~icons/ph/arrow-clockwise-bold'
import IPhArrowCounterClockwiseBold from '~icons/ph/arrow-counter-clockwise-bold'

export default {
  title: 'Murmur/components/AppIcon/AppIconLayers',
  component: AppIconLayers,
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

export const Sizings = {
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
