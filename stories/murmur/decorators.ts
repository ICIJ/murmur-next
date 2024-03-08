import {BModal, BPopover, useModal} from "bootstrap-vue-next";
import {Size} from "@/enums";
import {h, reactive, ref, toRef, toRefs} from "vue";

export const modalDecorator = (buttonLabel:string="Click to see the form",modalTitle:string|null,size:Size=Size.md) => ({
  components: {BModal},
  setup() {
    const {show} = useModal('formModal')
    return {show,buttonLabel,modalTitle,size};
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
  template:`<div>
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

export const toggleDecorator = (_storyFn:any,context:any) => ({
  setup() {
    const { active } = toRefs( context.args)
    function onClick(){
      active.value = !active.value
    }
    return {onClick}
  },
  template:`
    <div class="card card-xs mx-auto m-4" >
      <story />
      <div class="card-footer text-center">
        <button @click="onClick" type="button" class="btn btn-info">
          Click to toggle 
        </button>
      </div>
    </div>`
})


export const bgStripedDecorator = () => ({ template: '<div class="p-2 bg-striped"><story/></div>' })
