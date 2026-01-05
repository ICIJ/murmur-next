import { GenericFooter } from '@/components'

export default {
  title: 'Murmur/components/Generic/GenericFooter',
  component: GenericFooter,
  tags: ['autodocs'],
  argTypes: {}
}

export const Default = {
  args: { class: 'card m-4' }
}

export const AboutUs = {
  args: { showAboutUs: true }
}

export const Version = {
  args: { version: 'alpha-10.2' }
}
