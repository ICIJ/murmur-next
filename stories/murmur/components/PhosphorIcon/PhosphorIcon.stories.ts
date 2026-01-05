import {
  PhChat,
  PhGlobe,
  PhHorse,
  PhLightbulb,
  PhLinkBreak,
  PhMoon,
  PhNewspaper,
  PhScanSmiley
} from '@phosphor-icons/vue'

import { variantsArgType, iconWeightsArgType } from '~storybook/utils'
import { PhosphorIcon } from '@/components'

export default {
  title: 'Murmur/components/PhosphorIcon/PhosphorIcon',
  component: PhosphorIcon,
  tags: ['autodocs'],
  argTypes: {
    variant: variantsArgType,
    weight: iconWeightsArgType,
    spin: { control: 'boolean' },
    size: { control: 'text' }
  },
  args: {
    weight: 'regular',
    spin: false,
    spinDuration: '1s'
  }
}

export const Default = {
  args: {
    name: 'User',
    size: '2xl'
  }
}

export const WeightBold = {
  args: {
    name: 'User',
    weight: 'bold',
    size: '2xl'
  }
}

export const WeightFill = {
  args: {
    name: 'User',
    weight: 'fill',
    size: '2xl'
  }
}

export const WeightDuotone = {
  args: {
    name: 'User',
    weight: 'duotone',
    size: '2xl'
  }
}

export const Spinning = {
  args: {
    name: 'circle-notch',
    size: '2xl',
    spin: true
  }
}

export const VariantPrimary = {
  args: {
    name: 'rocket',
    variant: 'primary',
    size: '2xl'
  }
}

export const VariantSecondary = {
  args: {
    name: 'rocket',
    variant: 'secondary',
    size: '2xl'
  }
}

export const WithComponent = {
  args: {
    name: PhHorse,
    variant: 'primary',
    size: '2xl'
  }
}

export const WithArray = {
  args: {
    name: ['windows-logo', 'fill'],
    variant: 'primary',
    size: '2xl'
  }
}

export const HoverWeight = {
  args: {
    name: 'lego',
    variant: 'primary',
    hoverWeight: 'duotone',
    size: '2xl'
  }
}

export const HoverVariant = {
  args: {
    name: 'trash',
    variant: 'link',
    hoverVariant: 'danger',
    hoverWeight: 'duotone',
    size: '2xl'
  }
}

export const WithText = {
  args: {
    name: 'globe',
    variant: 'primary'
  },
  render: (args: any) => ({
    components: { PhosphorIcon },
    setup: () => ({
      args,
      PhChat,
      PhLightbulb,
      PhLinkBreak,
      PhMoon,
      PhNewspaper,
      PhScanSmiley
    }),
    template: `
      <h2>
        <PhosphorIcon v-bind="args" />
        An ICIJ poem
      </h2>
      <p>
        In the shadows of whispers <PhosphorIcon :name="PhChat" /> and silk veils,<br />
        The ink of truth flows like moonlight <PhosphorIcon :name="PhMoon" /> on paper,<br />
        ICIJ, a lantern <PhosphorIcon :name="PhLightbulb" /> in the murk,<br />
        Unveils the hidden and the hushed.
      </p>
      <p>
        Words not bound by chains <PhosphorIcon :name="PhLinkBreak" />, but by liberty,<br />
        The silent scream <PhosphorIcon name="user-sound" /> of the unseen,<br />
        With each page turned, a revelation <PhosphorIcon :name="PhNewspaper" />,<br />
        A mirror held to the world's face <PhosphorIcon :name="PhScanSmiley" />.
      </p>
    `
  })
}

export const Sizings = {
  args: {
    name: 'globe'
  },
  render: (args: any) => ({
    components: { PhosphorIcon },
    setup: () => ({ args, PhGlobe }),
    template: `
      <p><PhosphorIcon :name="PhGlobe" size="2xs" /> Stories that rock the world (<code>2xs</code>).</p>
      <p><PhosphorIcon :name="PhGlobe" size="xs" /> Stories that rock the world (<code>xs</code>).</p>
      <p><PhosphorIcon :name="PhGlobe" size="sm" /> Stories that rock the world (<code>sm</code>).</p>
      <p><PhosphorIcon :name="PhGlobe" /> Stories that rock the world (<code>md</code>).</p>
      <p><PhosphorIcon :name="PhGlobe" size="lg" /> Stories that rock the world (<code>lg</code>).</p>
      <p><PhosphorIcon :name="PhGlobe" size="xl" /> Stories that rock the world (<code>xl</code>).</p>
      <p><PhosphorIcon :name="PhGlobe" size="2xl" /> Stories that rock the world (<code>2xl</code>).</p>
    `
  })
}

export const Scaling = {
  args: {
    name: 'balloon',
    weight: 'duotone',
    variant: 'primary'
  },
  render: (args: any) => ({
    components: { PhosphorIcon },
    setup: () => ({ args }),
    template: `
      <p>
        <PhosphorIcon v-bind="args" scale="1" />
        <PhosphorIcon v-bind="args" scale="2" />
        <PhosphorIcon v-bind="args" scale="3" />
        <PhosphorIcon v-bind="args" scale="4" />
        <PhosphorIcon v-bind="args" scale="5" />
        <PhosphorIcon v-bind="args" scale="6" />
        <PhosphorIcon v-bind="args" scale="7" />
        <PhosphorIcon v-bind="args" scale="8" />
        <PhosphorIcon v-bind="args" scale="9" />
        <PhosphorIcon v-bind="args" scale="10" />
      </p>
    `
  })
}
