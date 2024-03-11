import { StackedBarChart } from "@/datavisualisations";
import { StoryObj } from "@storybook/vue3";
import {humanReadableGb} from "../utils";
import {h} from "vue";

export default {
    title: 'Murmur/datavisualisations/StackedBarChart',
    component: StackedBarChart,
    tags: ['autodocs'],
    argTypes: {
    }
};

type Story = StoryObj<typeof StackedBarChart>;
const Template: Story = (args: any) => ({
    components: { StackedBarChart },
    setup() {
        return { args };
    },
    template: `<StackedBarChart v-bind="args" >
      {{args['header-right'].toString()}}
      <template #header-left v-if="args['header-left']">${args['header-left']}</template>
      <template #header-right v-if="args['header-right']!==null">${args['header-right']?.({sortBy:args.sortBy})??''}</template>
    </StackedBarChart>`
});
const leakIncidentsDecorator = () => ({
    template: `
  <h4>
    Medical device companies reported tens of thousands of incidents in 2017
  </h4>
   <p class="text-muted">
    Companies must report when a patient has potentially been hurt or killed by one of their medical devices.
  </p>
  <story/>
  <p class="text-muted small">
    Note: The companies shown here are 10 of the biggest participants in the medical device industry. Numbers for Becton, Dickinson and Company include adverse events reported by C. R. Bard, which was acquired in 2017. Source: U.S. Food and Drug Administration, ICIJ analysis.
  </p>
  <p class="text-muted small">
    Source: ICIJ.
  </p>`
})
const data = {fixedHeight: 400,
    incidentReports: [
        {
            "label":"Medtronic PLC",
            "injury":71444,
            "death":1828
        },
        {
            "label":"Abbott Laboratories",
            "injury":40200,
            "death":2816
        },
        {
            "label":"Johnson & Johnson",
            "injury":25863,
            "death":104
        },
        {
            "label":"Boston Scientific",
            "injury":20509,
            "death":725
        },
        {
            "label":"Zimmer Biomet Holdings",
            "injury":15733,
            "death":146
        },
        {
            "label":"Tandem Diabetes Care, Inc.",
            "injury":13658,
            "death":26
        },
        {
            "label":"Stryker",
            "injury":5102,
            "death":90
        },
        {
            "label":"Becton, Dickinson and Company",
            "injury":3569,
            "death":130
        },
        {
            "label":"DexCom, Inc.",
            "injury":1198,
            "death":25
        },
        {
            "label":"Philips",
            "injury":450,
            "death":268
        }
    ],
    moviesUrl: "https://gist.githubusercontent.com/pirhoo/20ce1b795555210c926967a291f8a7ad/raw/13d972b7d2b98b174c33fff38aac2b7d69c85fa7/stacked-bars-movies.json",
    isRelative: true,
    sortKeys: ['movie', 'budget', 'box_office'],
    sortKey: ['movie'],
    groups: ['Budget', 'Box Office'],
    leakSizes: [
        { label: 'Paradise Papers', value: 1.4 * 1e3 },
        { label: 'Panama Papers', value: 2.6 * 1e3 },
        { label: 'Swiss Leaks', value: 3.3 },
        { label: 'LuxLeaks', value: 4 },
        { label: 'Offshore Leaks', value: 260 }
    ]}
export const Default = Template.bind({});
Default.decorators=[leakIncidentsDecorator]
Default.args = {
  data:data.incidentReports,
};
export const LabelAbove = Template.bind({});
LabelAbove.decorators=[leakIncidentsDecorator]
LabelAbove.args = {
  data:data.incidentReports,
  labelAbove:true
};
const leaksSizeDecorator = () => ({
  template: `
   <h4>Leaks size</h4>
  <p class="text-muted">
    Size of each leak in GB.
  </p>
  <story/>`
})

export const FixedHeightHideLegend = Template.bind({});
FixedHeightHideLegend.decorators=[leaksSizeDecorator]
FixedHeightHideLegend.args = {
  data:data.leakSizes,
  fixedHeight:400,
  xAxisTickFormat:humanReadableGb,
  hideLegend:true
};


export const hideEmptyValues = Template.bind({});
hideEmptyValues.decorators=[]
hideEmptyValues.args = {
  data:data.moviesUrl,
  labelField:"movie",
  groups:data.groups,
  hideEmptyValues:true
};
export const sortByKey = Template.bind({});
sortByKey.decorators=[]
sortByKey.args = {
  data:data.moviesUrl,
  labelField:"movie",
  sortBy:data.sortKey,
  groups:data.groups,
};
sortByKey.argTypes={
  sortBy:{control:"select",options:data.sortKeys}
}
export const relativeValues = Template.bind({});
relativeValues.decorators=[]
relativeValues.args = {
  data:data.moviesUrl,
  labelField:"movie",
  sortBy:data.sortKey,
  groups:data.groups,
  relative:true
};

export const HeaderLeft = Template.bind({});
HeaderLeft.decorators=[leakIncidentsDecorator]
HeaderLeft.args = {
  data:data.leakSizes,
  fixedHeight:400,
  xAxisTickFormat:humanReadableGb,
  hideLegend:false,
  'header-left':"<h1>Header Left</h1>",
};

HeaderLeft.argTypes={
  sortBy:{control:"select",options:data.sortKeys}
}

export const HeaderRight = Template.bind({});
HeaderRight.decorators=[leakIncidentsDecorator]
HeaderRight.args = {
  data:data.moviesUrl,
  labelField:"movie",
  sortBy:data.sortKey,
  hideEmptyValues:true,
  relative:true,
  groups:data.groups,
  hideLegend:true,
  'header-right':({sortBy}:{sortBy:string})=>`<div class="ms-auto d-flex  align-items-center p-0">
        <label class="m-2 d-flex align-items-center">
          Sort by  ${sortBy}
        </label>
      </div>`
};

HeaderRight.argTypes={
  sortBy:{control:"select",options:data.sortKeys}
}
