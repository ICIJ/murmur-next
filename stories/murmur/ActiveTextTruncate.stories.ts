import {Meta, StoryObj} from '@storybook/vue3'
import {ActiveTextTruncate} from "@/components";

export default {
  title: 'Murmur/ActiveTextTruncate',
  component: ActiveTextTruncate,
  decorators: [() => ({ template: '<div class="p-2 bg-striped"><story/></div>' })],
  tags: ['autodocs'],
  render: (args: any) => ({
    components: {ActiveTextTruncate},
    setup() {
      return {args}
    },
    template: '<active-text-truncate v-bind="args">https://www.icij.org/investigations/luanda-leaks/banking-documents-reveal-consulting-giants-cash-windfall-under-angolan-billionaire-isabel-dos-santos/</active-text-truncate>',
  }),
  argTypes: {
    direction: {
      control: 'inline-radio', options: ['ltr', 'rtl']
    }
  }

} as Meta
type Story = StoryObj<typeof ActiveTextTruncate>;



export const Default  ={
  args: {
    direction:'ltr'
  }
}
export const RightToLeft ={
  args:{
    direction:'rtl'
  }
}

// Default.args={
//   direction: "ltr"
// };
