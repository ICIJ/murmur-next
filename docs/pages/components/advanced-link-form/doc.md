---
title: Advanced Link Form
description: A form with tabs to offer several copy formats to users.
---

Inside a card:

:::sample-card
<div class="text-center p-4">
  <b-card no-body>
    <advanced-link-form
      card
      title="Medtronic spends millions each year on lobbying in the US"
      link="https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying" />
  </b-card>
</div>
:::

Inside a modal (the modal's body is set to have no body):

:::sample-card
<div>
  <div class="p-4 text-center">
    <button class="btn btn-info fw-bold" @click="$refs.formModal.show()">
      Click to see the form
    </button>
  </div>
  <b-modal hide-footer hide-header body-class="p-0" ref="formModal" size="md" no-headings>
    <advanced-link-form
      card
      title="Medtronic spends millions each year on lobbying in the US"
      link="https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying" />
  </b-modal>
</div>
:::

This component can be use inside a popover. Here is a example with only `raw`
and `markdown` forms, using no fading animation, and using a `small` layout:

:::sample-card
<template>
  <div>
    <div class="p-4 text-center">
      <button class="btn btn-info fw-bold" id="popover-button-sample">
        Click to see the form
      </button>
    </div>
    <b-popover ref="formPopover" target="popover-button-sample" placement="right" triggers="focus">
      <advanced-link-form
        card
        small
        no-fade
        :forms="['raw', 'markdown']"
        title="Medtronic spends millions each year on lobbying in the US"
        link="https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying" />
    </b-popover>
  </div>
</template>
:::

With tabs as pills:

:::sample-card
<div class="text-center p-4">
  <b-card no-body>
    <advanced-link-form
      card
      pills
      title="Medtronic spends millions each year on lobbying in the US"
      link="https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying" />
  </b-card>
</div>
:::

With tabs as pills and a different active class:

:::sample-card
<div class="text-center p-4">
  <b-card no-body>
    <advanced-link-form
      card
      pills
      active-nav-item-class="bg-primary fw-bold"
      title="Medtronic spends millions each year on lobbying in the US"
      link="https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying" />
  </b-card>
</div>
:::

With vertical tabs:

:::sample-card
<div class="text-center p-4">
  <b-card no-body>
    <advanced-link-form
      card
      vertical
      pills
      title="Medtronic spends millions each year on lobbying in the US"
      link="https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying" />
  </b-card>
</div>
:::

::: api-table components/AdvancedLinkForm.vue :::
