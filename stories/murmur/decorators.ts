import {BModal, useModal} from "bootstrap-vue-next";
import {Size} from "@/enums";

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
