import ellipsisTooltip from "@/directives/EllipsisTooltip.ts"

export default {
  title: 'Murmur/directives/v-ellipsis-tooltip',
  tags: ['autodocs'],
  argTypes: {},
  render: (args) => ({
    setup() {
      return { args }
    },
    directives: { ellipsisTooltip },
    template: `
      <div class="bg-light p-2 mb-3 text-truncate" v-ellipsis-tooltip="{ placement: 'right' }" title="Stories that rock the world">
        Stories that rock the world
      </div>
      <div class="bg-light p-2 text-truncate" style="width: 150px" v-ellipsis-tooltip="{ placement: 'right' }" title="Stories that rock the world">
        Stories that rock the world      
      </div>
    `
  })
}

export const Default = {}