import { AccordionWrapper, AccordionStep } from '@/components'
import { BButton } from 'bootstrap-vue-next'
import { bgPolkaDecorator } from '../../decorators'

export default {
  title: 'Murmur/components/Accordion/AccordionWrapper',
  component: AccordionWrapper,
  tags: ['autodocs'],
  argTypes: {}
}

const stepsEnum = Object.freeze({
  MAILVELOPE: Symbol('MAILVELOPE'),
  EXPORT_PUBLIC_KEY: Symbol('EXPORT_PUBLIC_KEY'),
  UPLOAD_PUBLIC_KEY: Symbol('UPLOAD_PGP')
})

const steps = Object.values(stepsEnum)

export const Default = {
  args: {
    steps,
    step: stepsEnum.MAILVELOPE,
    class: 'p-2'
  },
  decorators: [bgPolkaDecorator],
  render: (args: any) => ({
    components: { AccordionWrapper, AccordionStep, BButton },
    setup: () => ({ stepsEnum, args }),
    template: `
      <AccordionWrapper v-bind="args" @step-change="args.step = $event">
        <AccordionStep
          :step="stepsEnum.MAILVELOPE"
          class="accordion-step__mailvelope"
          title="Install Mailvelope"
          content="Install Mailvelope and create your key"
        />
        <AccordionStep :step="stepsEnum.EXPORT_PUBLIC_KEY" title="Export your public key">
          <template #content>
            <p>Export your public PGP key as a .asc file and download on your computer</p>
          </template>
        </AccordionStep>
        <AccordionStep :step="stepsEnum.UPLOAD_PUBLIC_KEY">
          <template #title>Upload your publickey</template>
          <template #nextStepButton>
            <BButton variant="info">The end!</BButton>
          </template>
        </AccordionStep>
      </AccordionWrapper>
    `
  })
}
