import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { AppFooter } from '@/components'

const meta: Meta<typeof AppFooter> = {
  title: 'Murmur/components/App/AppFooter',
  component: AppFooter,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { class: 'card m-4' }
}

export const AboutUs: Story = {
  args: { showAboutUs: true }
}

export const Version: Story = {
  args: { version: 'alpha-10.2' }
}
