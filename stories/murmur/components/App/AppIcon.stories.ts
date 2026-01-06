import { variantsArgType } from '~storybook/utils'
import { AppIcon } from '@/components'

// Icon imports
import IPhUser from '~icons/ph/user'
import IPhUserBold from '~icons/ph/user-bold'
import IPhUserFill from '~icons/ph/user-fill'
import IPhUserDuotone from '~icons/ph/user-duotone'
import IPhCircleNotch from '~icons/ph/circle-notch'
import IPhRocket from '~icons/ph/rocket'
import IPhTrashDuotone from '~icons/ph/trash-duotone'
import IPhGlobe from '~icons/ph/globe'
import IPhChat from '~icons/ph/chat'
import IPhMoon from '~icons/ph/moon'
import IPhLightbulb from '~icons/ph/lightbulb'
import IPhLinkBreak from '~icons/ph/link-break'
import IPhUserSound from '~icons/ph/user-sound'
import IPhNewspaper from '~icons/ph/newspaper'
import IPhScanSmiley from '~icons/ph/scan-smiley'
import IPhBalloonDuotone from '~icons/ph/balloon-duotone'

export default {
  title: 'Murmur/components/App/AppIcon',
  component: AppIcon,
  tags: ['autodocs'],
  argTypes: {
    variant: variantsArgType,
    hoverVariant: variantsArgType,
    spin: { control: 'boolean' },
    spinReverse: { control: 'boolean' },
    beat: { control: 'boolean' },
    fade: { control: 'boolean' },
    size: { control: 'text' }
  },
  args: {
    spin: false,
    spinDuration: '1s'
  }
}

export const Default = {
  args: {
    size: '2xl',
    name: IPhUser
  },
  render: (args: any) => ({
    components: { AppIcon },
    setup: () => ({ args }),
    template: `<AppIcon v-bind="args" />`
  })
}

export const UsingSlot = {
  args: {
    size: '2xl'
  },
  render: (args: any) => ({
    components: { AppIcon, IPhUser },
    setup: () => ({ args }),
    template: `
      <AppIcon v-bind="args">
        <IPhUser />
      </AppIcon>
    `
  })
}

export const WeightBold = {
  args: {
    size: '2xl',
    name: IPhUserBold
  },
  render: (args: any) => ({
    components: { AppIcon },
    setup: () => ({ args }),
    template: `<AppIcon v-bind="args" />`
  })
}

export const WeightFill = {
  args: {
    size: '2xl',
    name: IPhUserFill
  },
  render: (args: any) => ({
    components: { AppIcon },
    setup: () => ({ args }),
    template: `<AppIcon v-bind="args" />`
  })
}

export const WeightDuotone = {
  args: {
    size: '2xl',
    name: IPhUserDuotone
  },
  render: (args: any) => ({
    components: { AppIcon },
    setup: () => ({ args }),
    template: `<AppIcon v-bind="args" />`
  })
}

export const Spinning = {
  args: {
    size: '2xl',
    spin: true,
    name: IPhCircleNotch
  },
  render: (args: any) => ({
    components: { AppIcon },
    setup: () => ({ args }),
    template: `<AppIcon v-bind="args" />`
  })
}

export const VariantPrimary = {
  args: {
    variant: 'primary',
    size: '2xl',
    name: IPhRocket
  },
  render: (args: any) => ({
    components: { AppIcon },
    setup: () => ({ args }),
    template: `<AppIcon v-bind="args" />`
  })
}

export const VariantSecondary = {
  args: {
    variant: 'secondary',
    size: '2xl',
    name: IPhRocket
  },
  render: (args: any) => ({
    components: { AppIcon },
    setup: () => ({ args }),
    template: `<AppIcon v-bind="args" />`
  })
}

export const HoverVariant = {
  args: {
    variant: 'link',
    hoverVariant: 'danger',
    size: '2xl',
    name: IPhTrashDuotone
  },
  render: (args: any) => ({
    components: { AppIcon },
    setup: () => ({ args }),
    template: `<AppIcon v-bind="args" />`
  })
}

export const WithText = {
  args: {
    variant: 'primary'
  },
  render: (args: any) => ({
    components: { AppIcon, IPhGlobe, IPhChat, IPhMoon, IPhLightbulb, IPhLinkBreak, IPhUserSound, IPhNewspaper, IPhScanSmiley },
    setup: () => ({ args }),
    template: `
      <h2>
        <AppIcon v-bind="args"><IPhGlobe /></AppIcon>
        An ICIJ poem
      </h2>
      <p>
        In the shadows of whispers <AppIcon><IPhChat /></AppIcon> and silk veils,<br />
        The ink of truth flows like moonlight <AppIcon><IPhMoon /></AppIcon> on paper,<br />
        ICIJ, a lantern <AppIcon><IPhLightbulb /></AppIcon> in the murk,<br />
        Unveils the hidden and the hushed.
      </p>
      <p>
        Words not bound by chains <AppIcon><IPhLinkBreak /></AppIcon>, but by liberty,<br />
        The silent scream <AppIcon><IPhUserSound /></AppIcon> of the unseen,<br />
        With each page turned, a revelation <AppIcon><IPhNewspaper /></AppIcon>,<br />
        A mirror held to the world's face <AppIcon><IPhScanSmiley /></AppIcon>.
      </p>
    `
  })
}

export const Sizings = {
  render: () => ({
    components: { AppIcon, IPhGlobe },
    template: `
      <p><AppIcon size="2xs"><IPhGlobe /></AppIcon> Stories that rock the world (<code>2xs</code>).</p>
      <p><AppIcon size="xs"><IPhGlobe /></AppIcon> Stories that rock the world (<code>xs</code>).</p>
      <p><AppIcon size="sm"><IPhGlobe /></AppIcon> Stories that rock the world (<code>sm</code>).</p>
      <p><AppIcon><IPhGlobe /></AppIcon> Stories that rock the world (<code>md</code>).</p>
      <p><AppIcon size="lg"><IPhGlobe /></AppIcon> Stories that rock the world (<code>lg</code>).</p>
      <p><AppIcon size="xl"><IPhGlobe /></AppIcon> Stories that rock the world (<code>xl</code>).</p>
      <p><AppIcon size="2xl"><IPhGlobe /></AppIcon> Stories that rock the world (<code>2xl</code>).</p>
    `
  })
}

export const Scaling = {
  args: {
    variant: 'primary'
  },
  render: (args: any) => ({
    components: { AppIcon, IPhBalloonDuotone },
    setup: () => ({ args }),
    template: `
      <p>
        <AppIcon v-bind="args" :scale="1"><IPhBalloonDuotone /></AppIcon>
        <AppIcon v-bind="args" :scale="2"><IPhBalloonDuotone /></AppIcon>
        <AppIcon v-bind="args" :scale="3"><IPhBalloonDuotone /></AppIcon>
        <AppIcon v-bind="args" :scale="4"><IPhBalloonDuotone /></AppIcon>
        <AppIcon v-bind="args" :scale="5"><IPhBalloonDuotone /></AppIcon>
        <AppIcon v-bind="args" :scale="6"><IPhBalloonDuotone /></AppIcon>
        <AppIcon v-bind="args" :scale="7"><IPhBalloonDuotone /></AppIcon>
        <AppIcon v-bind="args" :scale="8"><IPhBalloonDuotone /></AppIcon>
        <AppIcon v-bind="args" :scale="9"><IPhBalloonDuotone /></AppIcon>
        <AppIcon v-bind="args" :scale="10"><IPhBalloonDuotone /></AppIcon>
      </p>
    `
  })
}
