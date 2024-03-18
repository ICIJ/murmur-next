---
title: Embed Form
---

::: sample-card
<embed-form url="https://projects.icij.org/the-implant-files/graphics/#/device-related-incidents-in-europe" :height="330" no-preview class="card card-sm mx-auto my-4 pt-2"></embed-form>
:::

We usualy put this form inside a modal (here, with Boostrap Vue).

::: sample-card
<div class="p-4 text-center">
  <button class="btn btn-info fw-bold" @click="$refs.formModal.show()">
    Click to see the form with preview
  </button>
</div>
<b-modal hide-footer lazy title="Embed form with a preview" ref="formModal" size="lg">
  <embed-form no-title url="https://projects.icij.org/the-implant-files/graphics/#/device-related-incidents-in-europe?no-embeddable-footer=1" :height="550"></embed-form>
</b-modal>
:::

::: api-table components/EmbedForm.vue :::
