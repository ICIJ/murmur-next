import { FormControlSelectableDropdown } from '@/components'
import { StoryObj } from '@storybook/vue3-vite'
import { onBeforeMount, toRefs } from 'vue'

const data = {
  country: 'Peru',
  countries: [],
  filteredCountries: ['Spain', 'Peru', 'France'],
  twoCountries: ['Spain', 'France'],
  treeCountries: ['Spain', 'Peru', 'France'],
  allCountries: ['France', 'United States of America', 'Spain', 'Peru'],
  countryCollection: [
    { label: 'Spain' },
    { label: 'Peru' },
    { label: 'France' }
  ],
  selectedGames: [{ uid: 'sf1' }, { uid: 'sf3' }, { uid: 'sf5' }],
  streetFighters: [
    { label: 'Street Fighter (I)', uid: 'sf1' },
    { label: 'Street Fighter (II)', uid: 'sf2' },
    { label: 'Street Fighter (III)', uid: 'sf3' },
    { label: 'Street Fighter (IV)', uid: 'sf4' },
    { label: 'Street Fighter (V)', uid: 'sf5' }
  ],
  frenchCities: [],
  selectedFrenchCities: []
}

const countryArgTypes = {
  modelValue: { control: 'multi-select', options: data.allCountries }
}
const SFArgTypes = {
  modelValue: { control: 'object' }
}
export default {
  title: 'Murmur/components/Form/FormControl/FormControlSelectableDropdown',
  component: FormControlSelectableDropdown,
  tags: ['autodocs']
}

type Story = StoryObj<typeof FormControlSelectableDropdown>
const Template: Story = (args: any, { updateArgs }) => ({
  components: { FormControlSelectableDropdown },
  setup() {
    return { args }
  },
  template:
    '<FormControlSelectableDropdown @update:modelValue="handleModelValue" v-bind="args" />',
  methods: {
    handleModelValue(modelValue) {
      updateArgs({ ...args, modelValue })
    }
  }
})

export const Default = Template.bind({})
Default.args = {
  modelValue: data.country,
  items: data.allCountries
}
Default.argTypes = countryArgTypes
export const WithSerializer = Template.bind({})
WithSerializer.args = {
  modelValue: data.country,
  items: data.allCountries,
  deactivateKeys: true,
  serializer: (item: string) => item.toUpperCase()
}
WithSerializer.argTypes = countryArgTypes
export const WithSerializerLabel = Template.bind({})
WithSerializerLabel.args = {
  modelValue: data.country,
  items: data.countryCollection,
  serializer: (item: { label: string }) => item.label,
  deactivateKeys: true,
  multiple: true
}
export const WithSerializerAndEqualFn = Template.bind({})

WithSerializerAndEqualFn.args = {
  eq: (item: any, other: any) => item.uid === other.uid,
  serializer: (item: { label: string }) => item.label,
  items: data.streetFighters,
  deactivateKeys: true,
  multiple: true,
  modelValue: data.selectedGames
}
WithSerializerAndEqualFn.argTypes = SFArgTypes

export const Multiple = Template.bind({})
Multiple.args = {
  modelValue: data.country,
  items: data.allCountries,
  deactivateKeys: true,
  multiple: true
}
Multiple.argTypes = countryArgTypes
export const DynamicList = Template.bind({})
DynamicList.decorators = [
  (_storyFn: any, context: any) => ({
    setup() {
      const { modelValue } = toRefs(context.args)
      function onClickThree() {
        modelValue.value = data.treeCountries
      }
      function onClickTwo() {
        modelValue.value = data.twoCountries
      }
      return { onClickTwo, onClickThree }
    },
    template: `    
    <story/>
    <button class="btn btn-outline-secondary mt-2 mx-2" @click="onClickThree">
      Tree countries
    </button>
    <button class="btn btn-outline-secondary mt-2 mx-2" @click="onClickTwo">
      Two countries
    </button>`
  })
]
DynamicList.args = {
  modelValue: data.filteredCountries,
  items: data.allCountries,
  deactivateKeys: true,
  multiple: true
}

DynamicList.argTypes = countryArgTypes

export const BigList = Template.bind({})
BigList.decorators = [
  (fn: any, ctx: any) => ({
    setup() {
      const args = toRefs(ctx.args)
      onBeforeMount(async () => {
        const url
          = 'https://raw.githubusercontent.com/high54/Communes-France-JSON/master/france.json'
        const cities = await fetch(url).then(data => data.json())
        args.items.value = [
          ...new Set(
            cities
              .map((city: any) => city.Code_postal + ' - ' + city.Nom_commune)
              .sort()
          )
        ]
      })

      return { ...args }
    },
    template: `<story />`
  })
]
BigList.args = {
  modelValue: [],
  items: data.frenchCities,
  deactivateKeys: true,
  multiple: true,
  scrollerHeight: '500px'
}
