import { ActiveTextTruncate } from '@/components'
import { StoryObj } from '@storybook/vue3'
import { bgStripedDecorator } from '../decorators'

type Story = StoryObj<typeof ActiveTextTruncate>
const Template: Story = (args: any, { argTypes }: any) => ({
  components: { ActiveTextTruncate },
  props: Object.keys(argTypes),

  setup() {
    return { args }
  },
  template:
    '<active-text-truncate v-bind="args">https://www.icij.org/investigations/luanda-leaks/banking-documents-reveal-consulting-giants-cash-windfall-under-angolan-billionaire-isabel-dos-santos/</active-text-truncate>'
})

export const Default = Template.bind({})
Default.args = { direction: 'ltr' }
export const RightToLeft = Template.bind({})
RightToLeft.args = { direction: 'rtl' }

export default {
  title: 'Murmur/components/ActiveTextTruncate',
  component: ActiveTextTruncate,
  decorators: [bgStripedDecorator],
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'inline-radio', options: ['ltr', 'rtl'] },
    ppms: { control: { type: 'number', min: 0 } },
    fadingMinWidth: { control: { type: 'number', min: 0 } },
    fadingMaxWidth: { control: { type: 'number', min: 0 } }
  }
}
