import { ref, onBeforeMount } from 'vue'
import { FormControlSelectableDropdown } from '@/components'

const countries = ['France', 'United States of America', 'Spain', 'Peru']
const countryCollection = [{ label: 'Spain' }, { label: 'Peru' }, { label: 'France' }]
const streetFighters = [
  { label: 'Street Fighter (I)', uid: 'sf1' },
  { label: 'Street Fighter (II)', uid: 'sf2' },
  { label: 'Street Fighter (III)', uid: 'sf3' },
  { label: 'Street Fighter (IV)', uid: 'sf4' },
  { label: 'Street Fighter (V)', uid: 'sf5' }
]

export default {
  title: 'Murmur/components/Form/FormControl/FormControlSelectableDropdown',
  component: FormControlSelectableDropdown,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'object' },
    items: { control: 'object' },
    multiple: { control: 'boolean' },
    deactivateKeys: { control: 'boolean' }
  }
}

export const Default = {
  args: {
    modelValue: 'Peru',
    items: countries
  }
}

export const WithSerializer = {
  args: {
    modelValue: 'Peru',
    items: countries,
    deactivateKeys: true,
    serializer: (item: string) => item.toUpperCase()
  }
}

export const WithSerializerLabel = {
  args: {
    modelValue: 'Peru',
    items: countryCollection,
    serializer: (item: { label: string }) => item.label,
    deactivateKeys: true,
    multiple: true
  }
}

export const WithSerializerAndEqualFn = {
  args: {
    eq: (item: any, other: any) => item.uid === other.uid,
    serializer: (item: { label: string }) => item.label,
    items: streetFighters,
    deactivateKeys: true,
    multiple: true,
    modelValue: [{ uid: 'sf1' }, { uid: 'sf3' }, { uid: 'sf5' }]
  }
}

export const Multiple = {
  args: {
    modelValue: 'Peru',
    items: countries,
    deactivateKeys: true,
    multiple: true
  }
}

export const DynamicList = {
  args: {
    modelValue: ['Spain', 'Peru', 'France'],
    items: countries,
    deactivateKeys: true,
    multiple: true
  },
  render: (args: any) => ({
    components: { FormControlSelectableDropdown },
    setup() {
      const modelValue = ref(args.modelValue)
      const setThree = () => {
        modelValue.value = ['Spain', 'Peru', 'France']
      }
      const setTwo = () => {
        modelValue.value = ['Spain', 'France']
      }
      return { args, modelValue, setThree, setTwo }
    },
    template: `
      <FormControlSelectableDropdown v-bind="args" v-model="modelValue" />
      <button class="btn btn-outline-secondary mt-2 mx-2" @click="setThree">Three countries</button>
      <button class="btn btn-outline-secondary mt-2 mx-2" @click="setTwo">Two countries</button>
    `
  })
}

export const BigList = {
  args: {
    modelValue: [],
    items: [],
    deactivateKeys: true,
    multiple: true,
    scrollerHeight: '500px'
  },
  render: (args: any) => ({
    components: { FormControlSelectableDropdown },
    setup() {
      const items = ref<string[]>([])
      const modelValue = ref<string[]>([])

      onBeforeMount(async () => {
        const url
          = 'https://raw.githubusercontent.com/high54/Communes-France-JSON/master/france.json'
        const cities = await fetch(url).then(data => data.json())
        items.value = [
          ...new Set(
            cities.map((city: any) => city.Code_postal + ' - ' + city.Nom_commune).sort()
          )
        ] as string[]
      })

      return { args, items, modelValue }
    },
    template: `
      <FormControlSelectableDropdown
        v-bind="args"
        v-model="modelValue"
        :items="items"
      />
    `
  })
}
