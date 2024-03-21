import { TexturedDeck } from '@/components'
import { StoryObj } from '@storybook/vue3'
import { BButton } from 'bootstrap-vue-next'
import { Brand } from '@/components'

export default {
  title: 'Murmur/components/TexturedDeck',
  component: TexturedDeck,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'select',
      options: ['brick', 'crack', 'rock', 'sand']
    },
    size: {
      control: 'select',
      options: ['cover', 'contain', 'auto', '50%', '50%', 'auto']
    }
  }
}

type Story = StoryObj<typeof TexturedDeck>
const Template: Story = (args: any) => ({
  components: { TexturedDeck },
  setup() {
    return { args }
  },
  template: `<TexturedDeck class="p-5 m-4" v-bind="args" >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </TexturedDeck>`
})

export const Default = Template.bind({})
Default.args = {}
export const Black = Template.bind({})
Black.args = {
  black: true
}

export const BrickDonate = (args: any) => ({
  components: { TexturedDeck, BButton },
  setup() {
    return { args }
  },
  template: `<textured-deck class="p-5 m-4 row no-gutters align-items-center" v-bind="args">
        <div class="col">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div class="col-4 text-center">
            <b-button variant="primary" class="text-dark">
                Donate now
            </b-button>
        </div>
    </textured-deck>`
})

BrickDonate.args = {
  modelValue: 'brick'
}
export const CrackBrand = (args: any) => ({
  components: { TexturedDeck, Brand },
  setup() {
    return { args }
  },
  template: `<textured-deck class="p-5 m-4 d-flex align-items-center" v-bind="args">
        <brand class="me-5" /> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </textured-deck>`
})

CrackBrand.args = {
  modelValue: 'crack'
}
export const Rock = Template.bind({})
Rock.args = {
  modelValue: 'rock'
}
export const Sand = Template.bind({})
Sand.args = {
  modelValue: 'sand'
}
export const Crack = Template.bind({})
Crack.args = {
  modelValue: 'crack'
}
export const Carbon = Template.bind({})
Carbon.args = {
  modelValue: 'carbon'
}
