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
  computed: {
    PhLightbulb() {
      return PhLightbulb
    },
    PhScanSmiley() {
      return PhScanSmiley
    },
    PhNewspaper() {
      return PhNewspaper
    },
    PhLinkBreak() {
      return PhLinkBreak
    },
    PhMoon() {
      return PhMoon
    },
    PhChat() {
      return PhChat
    },
    PhGlobe() {
      return PhGlobe
    }
  },
  title: 'Murmur/Components/PhosphorIcon',
  tags: ['autodocs'],
  component: PhosphorIcon,
  argTypes: {
    variant: variantsArgType,
    weight: iconWeightsArgType,
    spin: {
      control: { type: 'boolean' }
    },
    size: {
      control: { type: 'string' }
    }
  },
  args: {
    weight: 'regular',
    spin: false,
    spinDuration: '1s'
  },
  render: args => ({
    components: {
      PhosphorIcon
    },
    setup() {
      return {
        args
      }
    },
    template: `
      <phosphor-icon v-bind="args"/>
    `
  })
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
    variant: 'primary',
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
  render: args => ({
    components: {
      PhosphorIcon
    },
    setup() {
      return {
        args
      }
    },
    template: `
      <h2>
        <phosphor-icon v-bind="args" />
        An ICIJ poem
      </h2>
      <p>
        In the shadows of whispers <phosphor-icon :name="PhChat" /> and silk veils,<br />
        The ink of truth flows like moonlight <phosphor-icon :name="PhMoon" /> on paper,<br />
        ICIJ, a lantern <phosphor-icon :name="PhLightbulb" /> in the murk,<br />
        Unveils the hidden and the hushed.
      </p>
      <p>
        Words not bound by chains <phosphor-icon :name="PhLinkBreak" />, but by liberty,<br />
        The silent scream <phosphor-icon name="user-sound" /> of the unseen,<br />
        With each page turned, a revelation <phosphor-icon :name="PhNewspaper" />,<br />
        A mirror held to the world's face <phosphor-icon :name="PhScanSmiley" />.
      </p>   
    `
  })
}

export const Sizings = {
  args: {
    name: 'globe'
  },
  render: args => ({
    components: {
      PhosphorIcon
    },
    setup() {
      return {
        args
      }
    },
    template: `
      <p><phosphor-icon :name="PhGlobe" size="2xs" /> Stories that rock the world (<code>2xs</code>).</p>
      <p><phosphor-icon :name="PhGlobe" size="xs" /> Stories that rock the world (<code>xs</code>).</p>
      <p><phosphor-icon :name="PhGlobe" size="sm" /> Stories that rock the world (<code>sm</code>).</p>
      <p><phosphor-icon :name="PhGlobe" /> Stories that rock the world (<code>md</code>).</p>
      <p><phosphor-icon :name="PhGlobe" size="lg" /> Stories that rock the world (<code>lg</code>).</p>
      <p><phosphor-icon :name="PhGlobe" size="xl" /> Stories that rock the world (<code>xl</code>).</p>
      <p><phosphor-icon :name="PhGlobe" size="2xl" /> Stories that rock the world (<code>2xl</code>).</p>
    `
  })
}

export const Scaling = {
  args: {
    name: 'balloon',
    weight: 'duotone',
    variant: 'primary'
  },
  render: args => ({
    components: {
      PhosphorIcon
    },
    setup() {
      return {
        args
      }
    },
    template: `
      <p>
        <phosphor-icon v-bind="args" scale="1" />      
        <phosphor-icon v-bind="args" scale="2" />      
        <phosphor-icon v-bind="args" scale="3" />      
        <phosphor-icon v-bind="args" scale="4" />      
        <phosphor-icon v-bind="args" scale="5" />      
        <phosphor-icon v-bind="args" scale="6" />      
        <phosphor-icon v-bind="args" scale="7" />      
        <phosphor-icon v-bind="args" scale="8" />      
        <phosphor-icon v-bind="args" scale="9" />      
        <phosphor-icon v-bind="args" scale="10" />      
      </p>
    `
  })
}
