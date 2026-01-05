import { ContentPlaceholder } from '@/components'
import { ContentPlaceholderRows } from '@/utils/placeholderTypes'

export default {
  title: 'Murmur/components/ContentPlaceholder/ContentPlaceholder',
  component: ContentPlaceholder,
  tags: ['autodocs'],
  argTypes: {}
}

const columnRows: ContentPlaceholderRows = [
  {
    height: '1em',
    boxes: [
      [0, '40%'],
      ['5%', '30%'],
      ['5%', '10%']
    ]
  }
]

const fourRowsDecorator = () => ({
  components: { ContentPlaceholder },
  template: `
    <div class="card card-xs py-2 px-3 mx-auto m-4">
      <story/>
      <story/>
      <story/>
      <story/>
    </div>
  `
})

export const Default = {
  args: {}
}

export const Columns = {
  args: { rows: columnRows }
}

export const FourRows = {
  args: { class: 'my-1' },
  decorators: [fourRowsDecorator]
}
