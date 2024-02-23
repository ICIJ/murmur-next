import {ActiveTextTruncate} from "@/components";
import {Meta, StoryObj} from '@storybook/vue3'

export default {
  title: 'Murmur/ActiveTextTruncate',
  component: ActiveTextTruncate,
  decorators: [() => ({ template: '<div class="p-2 bg-striped"><story/></div>' })],
  tags: ['autodocs']
} as Meta
type Story = StoryObj<typeof ActiveTextTruncate>;

const Template: Story = (args: any) => ({
  components: {ActiveTextTruncate},
  setup() {
    return {args}
  },
  template: '<active-text-truncate v-bind="args">https://www.icij.org/investigations/luanda-leaks/banking-documents-reveal-consulting-giants-cash-windfall-under-angolan-billionaire-isabel-dos-santos/</active-text-truncate>',
  argTypes: {
    direction: {
      control: 'radio', options: ['ltr', 'rtl']
    }
  }
})
export const Default =Template.bind({})

// Default.args={
//   direction: "ltr"
// };
