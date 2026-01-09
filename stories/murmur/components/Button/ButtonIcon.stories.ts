import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { ref } from 'vue'
import { AppIcon, ButtonIcon } from '@/components'
import { buttonSizesArgType, variantsArgType } from '~storybook/utils'
import { VARIANT } from '@/enums'

// Icon imports
import IPhCirclesThreePlus from '~icons/ph/circles-three-plus'
import IPhUsers from '~icons/ph/users'
import IPhUserCircle from '~icons/ph/user-circle'
import IPhPath from '~icons/ph/path'
import IPhX from '~icons/ph/x'
import IPhFloppyDisk from '~icons/ph/floppy-disk'
import IPhCircleNotch from '~icons/ph/circle-notch'
import IPhArrowClockwise from '~icons/ph/arrow-clockwise'

const meta: Meta<typeof ButtonIcon> = {
  title: 'Murmur/components/Button/ButtonIcon',
  component: ButtonIcon,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div class="p-4"><story /></div>'
    })
  ],
  argTypes: {
    size: buttonSizesArgType,
    variant: variantsArgType,
    pill: {
      control: { type: 'boolean' }
    },
    loading: {
      control: { type: 'boolean' }
    },
    counter: {
      control: { type: 'number' }
    },
    counterVariant: variantsArgType
  },
  args: {
    variant: VARIANT.primary,
    size: 'md',
    pill: false,
    loading: false
  },
  parameters: {
    pseudo: {
      hover: ['#hover'],
      focus: ['#focus'],
      active: ['#active']
    }
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const IconLeft: Story = {
  component: ButtonIcon,
  args: {
    variant: VARIANT.primary,
    label: 'Button',
    size: 'md',
    iconLeft: IPhCirclesThreePlus
  }
}

export const IconBothSide: Story = {
  component: ButtonIcon,
  args: {
    variant: VARIANT.primary,
    size: 'md',
    label: 'Save search',
    iconLeft: IPhCirclesThreePlus,
    iconRight: IPhUsers
  }
}

export const IconRight: Story = {
  component: ButtonIcon,
  args: {
    variant: VARIANT.primary,
    size: 'md',
    iconRight: IPhUsers,
    label: 'Button'
  }
}

export const WithCounter: Story = {
  component: ButtonIcon,
  args: {
    variant: VARIANT.outline_primary,
    size: 'md',
    iconLeft: IPhUserCircle,
    label: 'Shakira',
    counter: 134,
    counterVariant: VARIANT.primary
  }
}

export const HideLabel: Story = {
  component: ButtonIcon,
  args: {
    variant: VARIANT.primary,
    size: 'md',
    iconRight: IPhUsers,
    label: 'Button',
    hideLabel: true
  }
}

export const Square: Story = {
  component: ButtonIcon,
  args: {
    variant: VARIANT.primary,
    size: 'md',
    pill: false,
    iconRight: IPhPath,
    hideLabel: true,
    square: true
  }
}

export const SquareWithCounter: Story = {
  component: ButtonIcon,
  args: {
    variant: VARIANT.primary,
    size: 'md',
    pill: false,
    iconRight: IPhPath,
    label: 'Path',
    hideLabel: true,
    square: true,
    iconRiht: IPhPath,
    counter: 6,
    counterVariant: VARIANT.action
  }
}

export const SquarePill: Story = {
  component: ButtonIcon,
  args: {
    variant: VARIANT.primary,
    size: 'md',
    iconLeft: IPhX,
    label: 'Close',
    pill: true,
    hideLabel: true,
    square: true
  }
}

export const Truncated: Story = {
  args: {
    variant: VARIANT.primary,
    size: 'md',
    truncate: true,
    label: 'Saving the tags',
    iconLeft: IPhFloppyDisk
  },
  render: (args: any) => ({
    components: { ButtonIcon },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 150px">
        <ButtonIcon v-bind="args" />
      </div>
    `
  })
}

export const Loading: Story = {
  args: {
    variant: VARIANT.primary,
    size: 'md',
    pill: true
  },
  render: (args: any) => ({
    components: { ButtonIcon, AppIcon, IPhFloppyDisk, IPhCircleNotch },
    setup() {
      const loading = ref(true)
      return { args, loading }
    },
    template: `
      <p class="text-muted">Click to toggle loading state.</p>
      <ButtonIcon v-bind="args" label="Save" @click="loading = !loading">
        <template #start>
          <AppIcon class="me-2" v-if="!loading"><IPhFloppyDisk /></AppIcon>
          <AppIcon class="me-2" spin v-else><IPhCircleNotch /></AppIcon>
        </template>
      </ButtonIcon>
    `
  })
}

export const LoadingSpinner: Story = {
  args: {
    variant: VARIANT.secondary,
    size: 'md',
    pill: true
  },
  render: (args: any) => ({
    components: { ButtonIcon, AppIcon, IPhArrowClockwise },
    setup() {
      const loading = ref(true)
      return { args, loading }
    },
    template: `
      <p class="text-muted">Click to toggle loading state.</p>
      <ButtonIcon v-bind="args" :label="loading ? 'Refreshing...' : 'Refresh'" @click="loading = !loading">
        <template #start>
          <AppIcon class="me-2" :spin="loading" spin-duration="500ms">
            <IPhArrowClockwise />
          </AppIcon>
        </template>
      </ButtonIcon>
    `
  })
}
export const AllSizes: Story = {
  render: () => ({
    components: { ButtonIcon },
    setup: () => ({ IPhCirclesThreePlus }),
    template: `
      <div class="d-flex align-items-center gap-3">
        <ButtonIcon size="sm" variant="primary" label="Small" :icon-left="IPhCirclesThreePlus" />
        <ButtonIcon size="md" variant="primary" label="Medium" :icon-left="IPhCirclesThreePlus" />
        <ButtonIcon size="lg" variant="primary" label="Large" :icon-left="IPhCirclesThreePlus" />
      </div>
    `
  })
}

export const SizeSmall: Story = {
  component: ButtonIcon,
  args: {
    variant: VARIANT.primary,
    size: 'sm',
    iconLeft: IPhCirclesThreePlus,
    label: 'Small Button'
  }
}

export const SizeLarge: Story = {
  component: ButtonIcon,
  args: {
    variant: VARIANT.primary,
    size: 'lg',
    iconLeft: IPhCirclesThreePlus,
    label: 'Large Button'
  }
}

export const SquareAllSizes: Story = {
  render: () => ({
    components: { ButtonIcon },
    setup: () => ({ IPhPath }),
    template: `
      <div class="d-flex align-items-center gap-3">
        <ButtonIcon size="sm" variant="primary" label="Small" hide-label square :icon-left="IPhPath" />
        <ButtonIcon size="md" variant="primary" label="Medium" hide-label square :icon-left="IPhPath" />
        <ButtonIcon size="lg" variant="primary" label="Large" hide-label square :icon-left="IPhPath" />
      </div>
    `
  })
}
