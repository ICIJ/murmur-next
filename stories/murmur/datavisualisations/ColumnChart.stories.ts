import {ColumnChart} from "@/datavisualisations";
import {StoryObj} from "@storybook/vue3";
import {ref} from "vue";
import {humanReadableGb} from "../utils";
import {leakSizeDecorator} from "../decorators";

export default {
  title: 'Murmur/datavisualisations/ColumnChart',
  component: ColumnChart,
  tags: ['autodocs'],
  argTypes: {}
};

type Story = StoryObj<typeof ColumnChart>;
const Template: Story = (args: any) => ({
  components: {ColumnChart},
  setup() {
    return {args};
  },
  template: `
    <ColumnChart v-bind="args"/>`
});

const fixedHeight = 300
const dataUrl = "https://gist.githubusercontent.com/pirhoo/259a1a5159db4a665d0c043fac71beef/raw/e74087b06cd12be2b2d3a8ca995730e38719cd4b/colums-incidents.json"
const discreteData = [
  {leak: 'Paradise Papers', size: 1.4 * 1e3},
  {leak: 'Panama Papers', size: 2.6 * 1e3},
  {leak: 'Swiss Leaks', size: 3.3},
  {leak: 'LuxLeaks', size: 4},
  {leak: 'Offshore Leaks', size: 260}
]



const leakInjuriesDecorator = () => ({
    template: `
  <h4>Breast implant companies buried evidence of injuries for years</h4>
  <p class="text-muted">
    Incidents were reported as routine events that did not require public disclosure. After the U.S. Food and Drug Administration tightened enforcement of its reporting rules in 2017, reports of injuries soared.
  </p>
  <story/>
  <p class="text-muted small">
    Note: 2018 data includes January to June. Source: U.S. Food and Drug Administration, ICIJ analysis
  </p>`
})
export const Default = Template.bind({})
Default.decorators = [ leakInjuriesDecorator]
Default.args = {
    data:dataUrl,
    xAxisTickCollapse:true,
    hover:true
}
export const TooltipSlot: Story = (args: any) => ({
  components: {ColumnChart},
  setup() {
    return { args};
  },
  template: `
    <column-chart v-bind="args">
      <template #tooltip="{ datum: { leak, size } }">
        <span>The {{ leak }} investigation is {{ args.yAxisTickFormat(size)}}</span>
      </template>
    </column-chart>`
});
TooltipSlot.decorators = [leakSizeDecorator]


TooltipSlot.args = {
    data: discreteData,
    seriesName: "size",
    timeseriesKey: "leak",
    yAxisTickFormat: humanReadableGb,
    yAxisYTicks: 4,
    maxValue: 3000
};
export const DynamicHeight = TooltipSlot.bind({})
const clicked=ref(null)
DynamicHeight.args = {
    data: discreteData,
    seriesName: "size",
    timeseriesKey: "leak",
    yAxisTickFormat: humanReadableGb,
    yAxisYTicks: 4,
    maxValue: 3000,
    stripped:true,
    fixedHeight:fixedHeight
}
