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
  render: (args: any) => ({
    components: { ButtonIcon, IPhCirclesThreePlus },
    setup: () => ({ args }),
    template: `
      <ButtonIcon v-bind="args" label="Button">
        <template #start>
          <IPhCirclesThreePlus class="me-2" />
        </template>
      </ButtonIcon>
    `
  }),
  args: {
    variant: VARIANT.primary,
    size: 'md'
  }
}

export const IconBothSide: Story = {
  render: (args: any) => ({
    components: { ButtonIcon, IPhCirclesThreePlus, IPhUsers },
    setup: () => ({ args }),
    template: `
      <ButtonIcon v-bind="args" label="Save search">
        <template #start>
          <IPhCirclesThreePlus class="me-2" />
        </template>
        <template #end>
          <IPhUsers class="ms-2" />
        </template>
      </ButtonIcon>
    `
  }),
  args: {
    variant: VARIANT.primary,
    size: 'md'
  }
}

export const IconRight: Story = {
  render: (args: any) => ({
    components: { ButtonIcon, IPhUsers },
    setup: () => ({ args }),
    template: `
      <ButtonIcon v-bind="args" label="Button">
        <template #end>
          <IPhUsers class="ms-2" />
        </template>
      </ButtonIcon>
    `
  }),
  args: {
    variant: VARIANT.primary,
    size: 'md'
  }
}

export const WithCounter: Story = {
  render: (args: any) => ({
    components: { ButtonIcon, IPhUserCircle },
    setup: () => ({ args }),
    template: `
      <ButtonIcon v-bind="args" label="Shakira" :counter="134">
        <template #start>
          <IPhUserCircle class="me-2" />
        </template>
      </ButtonIcon>
    `
  }),
  args: {
    variant: VARIANT.outline_primary,
    size: 'md'
  }
}

export const HideLabel: Story = {
  render: (args: any) => ({
    components: { ButtonIcon, IPhUsers },
    setup: () => ({ args }),
    template: `
      <ButtonIcon v-bind="args" label="Button" hide-label>
        <template #end>
          <IPhUsers />
        </template>
      </ButtonIcon>
    `
  }),
  args: {
    variant: VARIANT.primary,
    size: 'md'
  }
}

export const Square: Story = {
  render: (args: any) => ({
    components: { ButtonIcon, IPhPath },
    setup: () => ({ args }),
    template: `
      <ButtonIcon v-bind="args" label="Path" hide-label square>
        <template #end>
          <IPhPath />
        </template>
      </ButtonIcon>
    `
  }),
  args: {
    variant: VARIANT.primary,
    size: 'md',
    pill: false
  }
}

export const SquareWithCounter: Story = {
  render: (args: any) => ({
    components: { ButtonIcon, IPhPath },
    setup: () => ({ args }),
    template: `
      <ButtonIcon v-bind="args" label="Path" hide-label square :counter="6" counter-variant="action">
        <template #end>
          <IPhPath />
        </template>
      </ButtonIcon>
    `
  }),
  args: {
    variant: VARIANT.primary,
    size: 'md',
    pill: false
  }
}

export const SquarePill: Story = {
  render: (args: any) => ({
    components: { ButtonIcon, IPhX },
    setup: () => ({ args }),
    template: `
      <ButtonIcon v-bind="args" label="Close" hide-label square pill>
        <template #end>
          <IPhX />
        </template>
      </ButtonIcon>
    `
  }),
  args: {
    variant: VARIANT.primary,
    size: 'md'
  }
}

export const Truncated: Story = {
  args: {
    variant: VARIANT.primary,
    size: 'md',
    truncate: true
  },
  render: (args: any) => ({
    components: { ButtonIcon, IPhFloppyDisk },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 150px">
        <ButtonIcon v-bind="args" label="Saving the tags" truncate>
          <template #start>
            <IPhFloppyDisk class="me-2" />
          </template>
        </ButtonIcon>
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
          <AppIcon class="me-2" :spin="loading" spin-duration="500ms"><IPhArrowClockwise /></AppIcon>
        </template>
      </ButtonIcon>
    `
  })
}
