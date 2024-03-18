---
title: Donate Form
description: A form to encourage donations.
tags: depracted
---

We usualy put this form inside a modal.

::: sample-card
<div class="p-4 text-center">
  <button class="btn btn-info fw-bold" @click="$refs.formModal.show()">
    Click to see the form
  </button>
</div>
<b-modal hide-footer lazy title="Support ICIJ" ref="formModal" size="lg" no-headings>
  <donate-form no-title></donate-form>
</b-modal>
:::

::: api-table components/DonateForm.vue :::
