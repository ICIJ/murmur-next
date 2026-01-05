import { TexturedDeck, Brand } from '@/components'
import { BButton } from 'bootstrap-vue-next'

export default {
  title: 'Murmur/components/TexturedDeck/TexturedDeck',
  component: TexturedDeck,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'select',
      options: ['brick', 'crack', 'rock', 'sand', 'carbon']
    },
    size: {
      control: 'select',
      options: ['cover', 'contain', 'auto', '50%']
    }
  }
}

const loremText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

const shortLorem =
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

export const Default = {
  args: {},
  render: (args: any) => ({
    components: { TexturedDeck },
    setup: () => ({ args, loremText }),
    template: '<TexturedDeck class="p-5 m-4" v-bind="args">{{ loremText }}</TexturedDeck>'
  })
}

export const Black = {
  args: { black: true },
  render: (args: any) => ({
    components: { TexturedDeck },
    setup: () => ({ args, loremText }),
    template: '<TexturedDeck class="p-5 m-4" v-bind="args">{{ loremText }}</TexturedDeck>'
  })
}

export const BrickDonate = {
  args: { modelValue: 'brick' },
  render: (args: any) => ({
    components: { TexturedDeck, BButton },
    setup: () => ({ args, shortLorem }),
    template: `
      <TexturedDeck class="p-5 m-4 row no-gutters align-items-center" v-bind="args">
        <div class="col">{{ shortLorem }}</div>
        <div class="col-4 text-center">
          <BButton variant="primary" class="text-dark">Donate now</BButton>
        </div>
      </TexturedDeck>
    `
  })
}

export const CrackBrand = {
  args: { modelValue: 'crack' },
  render: (args: any) => ({
    components: { TexturedDeck, Brand },
    setup: () => ({ args, shortLorem }),
    template: `
      <TexturedDeck class="p-5 m-4 d-flex align-items-center" v-bind="args">
        <Brand class="me-5" /> {{ shortLorem }}
      </TexturedDeck>
    `
  })
}

export const Rock = {
  args: { modelValue: 'rock' },
  render: (args: any) => ({
    components: { TexturedDeck },
    setup: () => ({ args, loremText }),
    template: '<TexturedDeck class="p-5 m-4" v-bind="args">{{ loremText }}</TexturedDeck>'
  })
}

export const Sand = {
  args: { modelValue: 'sand' },
  render: (args: any) => ({
    components: { TexturedDeck },
    setup: () => ({ args, loremText }),
    template: '<TexturedDeck class="p-5 m-4" v-bind="args">{{ loremText }}</TexturedDeck>'
  })
}

export const Crack = {
  args: { modelValue: 'crack' },
  render: (args: any) => ({
    components: { TexturedDeck },
    setup: () => ({ args, loremText }),
    template: '<TexturedDeck class="p-5 m-4" v-bind="args">{{ loremText }}</TexturedDeck>'
  })
}

export const Carbon = {
  args: { modelValue: 'carbon' },
  render: (args: any) => ({
    components: { TexturedDeck },
    setup: () => ({ args, loremText }),
    template: '<TexturedDeck class="p-5 m-4" v-bind="args">{{ loremText }}</TexturedDeck>'
  })
}
