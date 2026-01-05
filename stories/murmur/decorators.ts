import { BModal, BPopover, Size, useModal } from 'bootstrap-vue-next'
import { SIZE } from '@/enums'
import { toRefs } from 'vue'
import { geoOrthographic } from 'd3-geo'
import { defineComponent } from 'vue'
import { ChoroplethMap } from '@/maps'

export default defineComponent({
  components: { ChoroplethMap }
})

export const modalDecorator = (
  buttonLabel = 'Click to see the form',
  modalTitle: string | null,
  size: Size = SIZE.md
) => ({
  components: { BModal },
  setup() {
    const { show } = useModal('formModal')
    return { show, buttonLabel, modalTitle, size }
  },
  template: `
    <div class="p-4 text-center">
      <button class="btn btn-info fw-bold" @click="show">
        {{buttonLabel}}
      </button>
    </div>
    <b-modal hide-footer lazy :title="modalTitle" id="formModal" :size="size" no-headings>
      <story/>
    </b-modal>`
})

export const popoverDecorator = () => ({
  components: { BPopover },
  template: `<div>
        <div class="p-4 text-center">
            <button class="btn btn-info fw-bold" id="popover-button-sample">
                Click to see the form
            </button>
        </div>
        <b-popover target="popover-button-sample" placement="right" >
            <story id="popover-button-sample"/>
        </b-popover>
    </div>`
})

export const toggleDecorator = (_storyFn: any, context: any) => ({
  setup() {
    const { active } = toRefs(context.args)
    function onClick() {
      active.value = !active.value
    }
    return { onClick }
  },
  template: `
    <div class="card card-xs mx-auto m-4" >
      <story />
      <div class="card-footer text-center">
        <button @click="onClick" type="button" class="btn btn-info">
          Click to toggle 
        </button>
      </div>
    </div>`
})

export const bgPolkaDecorator = () => ({
  template: '<div class="p-2 bg-polka"><story/></div>'
})

export const bgFlexPolkaDecorator = () => ({
  template: '<div class="p-2 bg-polka d-flex"><story/></div>'
})

export const bgInlineFlexPolkaDecorator = () => ({
  template: '<div class="p-2 bg-polka d-inline-flex"><story/></div>'
})

export const leakSizeDecorator = () => ({
  template: `
  <h4>Leaks size</h4>
  <p class="text-muted">
    Size of each ICIJ's leak.
  </p>
  <story/>
  <p class="text-muted small">
    Source: ICIJ. 
  </p>`
})

export const icijOfficesDecorator = () => ({
  template: `
    <h4>ICIJ Offices</h4>
    <p class="mb-4">A non-exhaustive list of ICIJ offices and operations.</p>
    <story/>
 `
})

export const choroplethDecorator = () => ({
  components: [ChoroplethMap],
  decorators: [icijOfficesDecorator],
  setup() {
    const props = {
      color: '#faa',
      outlineColor: '#000',
      graticuleColor: '#eee',
      graticule: true,
      outline: true,
      hideLegend: true,
      zoomable: true,
      spherical: true,
      zoomMin: 0.9,
      projection: geoOrthographic
    }
    return { props }
  },
  template: `
  <choropleth-map v-bind="props"  >
   <story/>
  </choropleth-map>
  `
})
