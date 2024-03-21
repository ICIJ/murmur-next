import * as d3 from "d3";
import { mount, flushPromises } from "@vue/test-utils";
import ColumnChart from "@/datavisualisations/ColumnChart.vue";

vi.mock("d3", async () => {
  return {
    ...(await vi.importActual("d3")),
  };
});

// Mock HTML element offset so the size of the chart can be calculated
// dynamicly using JSDOM and tests
Object.defineProperties(window.HTMLElement.prototype, {
  offsetWidth: {
    get() {
      return parseFloat(this.style.width) || 0;
    },
  },
  offsetHeight: {
    get() {
      return parseFloat(this.style.height) || 0;
    },
  },
});

describe("ColumnChart.vue", () => {
  describe("a five columns chart with 1 highlight and no y axis", () => {
    let wrapper;

    beforeEach(async () => {
      const propsData = {
        data: [
          { date: 2000, value: 0 },
          { date: 2001, value: 1 },
          { date: 2002, value: 2 },
          { date: 2003, value: 3, highlight: true },
          { date: 2004, value: 4 },
        ],
        noYAxis: true,
      };

      wrapper = mount(ColumnChart, { propsData });

      wrapper.vm.$el.style.width = "500px";
      await wrapper.vm.$nextTick();
    });

    it("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy();
    });

    it("creates five x-axis ticks", () => {
      expect(wrapper.findAll(".column-chart__axis--x .tick")).toHaveLength(5);
    });

    it("creates no y-axis but a x-axis", () => {
      expect(wrapper.find(".column-chart__axis--y").exists()).toBeFalsy();
      expect(wrapper.find(".column-chart__axis--x").exists()).toBeTruthy();
    });

    it("creates x-axis ticks with the right years ", () => {
      const ticks = wrapper.findAll(".column-chart__axis--x .tick");
      expect(ticks.at(0).text()).toBe("2000");
      expect(ticks.at(1).text()).toBe("2001");
      expect(ticks.at(2).text()).toBe("2002");
      expect(ticks.at(3).text()).toBe("2003");
      expect(ticks.at(4).text()).toBe("2004");
    });

    it("creates five columns", () => {
      expect(wrapper.findAll(".column-chart__columns__item__bar")).toHaveLength(
        5,
      );
    });

    it("creates the first column with minimum height", () => {
      const column = wrapper.findAll(".column-chart__columns__item__bar").at(0);
      const height = parseFloat(column.attributes("height"));
      expect(height).toBe(0);
    });

    it("creates the third column with medium height", () => {
      const column = wrapper.findAll(".column-chart__columns__item__bar").at(2);
      const height = parseFloat(column.attributes("height"));
      expect(height).toBe(wrapper.vm.padded.height / 2);
    });

    it("creates the last column with maximum height", () => {
      const column = wrapper.findAll(".column-chart__columns__item__bar").at(4);
      const height = parseFloat(column.attributes("height"));
      expect(height).toBe(wrapper.vm.padded.height);
    });

    it("should highlight only the fourth column", () => {
      const columns = wrapper.findAll(".column-chart__columns__item");
      expect(
        columns.at(0).classes("column-chart__columns__item--highlight"),
      ).toBeFalsy();
      expect(
        columns.at(1).classes("column-chart__columns__item--highlight"),
      ).toBeFalsy();
      expect(
        columns.at(2).classes("column-chart__columns__item--highlight"),
      ).toBeFalsy();
      expect(
        columns.at(3).classes("column-chart__columns__item--highlight"),
      ).toBeTruthy();
      expect(
        columns.at(4).classes("column-chart__columns__item--highlight"),
      ).toBeFalsy();
    });
  });

  describe("a two columns chart with no highlights using remote JSON", () => {
    let wrapper;

    beforeAll(async () => {
      d3.json = vi.fn().mockResolvedValue([
        { date: 2019, value: 50 },
        { date: 2020, value: 100 },
      ]);
    });

    beforeEach(async () => {
      const propsData = { data: "http://localhost/data.json" };
      wrapper = mount(ColumnChart, { propsData });
      wrapper.vm.$el.style.width = "500px";
      await wrapper.vm.$nextTick();
      await flushPromises();
    });

    it("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy();
    });

    it("creates two x-axis ticks", () => {
      expect(wrapper.findAll(".column-chart__axis--x .tick")).toHaveLength(2);
    });

    it("creates x-axis ticks with the right years ", () => {
      const ticks = wrapper.findAll(".column-chart__axis--x .tick");
      expect(ticks.at(0).text()).toBe("2019");
      expect(ticks.at(1).text()).toBe("2020");
    });

    it("creates two columns", () => {
      expect(wrapper.findAll(".column-chart__columns__item__bar")).toHaveLength(
        2,
      );
    });

    it("creates the first column with medium height", () => {
      const column = wrapper.findAll(".column-chart__columns__item__bar").at(0);
      const height = parseFloat(column.attributes("height"));
      expect(height).toBe(wrapper.vm.padded.height / 2);
    });

    it("creates the second column with maximum height", () => {
      const column = wrapper.findAll(".column-chart__columns__item__bar").at(1);
      const height = parseFloat(column.attributes("height"));
      expect(height).toBe(wrapper.vm.padded.height);
    });

    it("should have no highlighted column", () => {
      const columns = wrapper.findAll(".column-chart__columns__item");
      expect(
        columns.at(0).classes("column-chart__columns__item--highlight"),
      ).toBeFalsy();
      expect(
        columns.at(1).classes("column-chart__columns__item--highlight"),
      ).toBeFalsy();
    });
  });

  describe("a 10 columns chart with two highlights using remote CSV and no tooltips", () => {
    let wrapper;

    beforeAll(() => {
      d3.csv = vi.fn().mockReturnValue([
        { date: 2000, indicator: 0, highlight: false },
        { date: 2001, indicator: 10, highlight: false },
        { date: 2002, indicator: 20, highlight: false },
        { date: 2003, indicator: 30, highlight: false },
        { date: 2004, indicator: 40, highlight: false },
        { date: 2005, indicator: 50, highlight: true },
        { date: 2006, indicator: 60, highlight: false },
        { date: 2007, indicator: 70, highlight: true },
        { date: 2008, indicator: 80, highlight: false },
        { date: 2009, indicator: 90, highlight: false },
      ]);
    });

    beforeEach(async () => {
      const propsData = {
        data: "http://localhost/data.csv",
        dataUrlType: "csv",
        seriesName: "indicator",
        noTooltips: true,
      };
      wrapper = mount(ColumnChart, { propsData });
      wrapper.vm.$el.style.width = "500px";
      await wrapper.vm.$nextTick();
    });

    it("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy();
    });

    it("creates ten x-axis ticks", () => {
      expect(wrapper.findAll(".column-chart__axis--x .tick")).toHaveLength(10);
    });

    it("creates x-axis ticks with the right years ", () => {
      const ticks = wrapper.findAll(".column-chart__axis--x .tick");
      expect(ticks.at(0).text()).toBe("2000");
      expect(ticks.at(1).text()).toBe("2001");
      expect(ticks.at(2).text()).toBe("2002");
      expect(ticks.at(3).text()).toBe("2003");
      expect(ticks.at(4).text()).toBe("2004");
      expect(ticks.at(5).text()).toBe("2005");
      expect(ticks.at(6).text()).toBe("2006");
      expect(ticks.at(7).text()).toBe("2007");
      expect(ticks.at(8).text()).toBe("2008");
      expect(ticks.at(9).text()).toBe("2009");
    });

    it("creates ten columns", () => {
      expect(wrapper.findAll(".column-chart__columns__item__bar")).toHaveLength(
        10,
      );
    });

    it("creates the first column with medium height", () => {
      const column = wrapper.findAll(".column-chart__columns__item__bar").at(0);
      const height = parseFloat(column.attributes("height"));
      expect(height).toBe(0);
    });

    it("creates the last column with maximum height", () => {
      const column = wrapper.findAll(".column-chart__columns__item__bar").at(9);
      const height = parseFloat(column.attributes("height"));
      expect(height).toBe(wrapper.vm.padded.height);
    });

    it("should have two highlighted columns", () => {
      const columns = wrapper.findAll(".column-chart__columns__item");
      expect(
        columns.at(0).classes("column-chart__columns__item--highlight"),
      ).toBeFalsy();
      expect(
        columns.at(1).classes("column-chart__columns__item--highlight"),
      ).toBeFalsy();
      expect(
        columns.at(2).classes("column-chart__columns__item--highlight"),
      ).toBeFalsy();
      expect(
        columns.at(3).classes("column-chart__columns__item--highlight"),
      ).toBeFalsy();
      expect(
        columns.at(4).classes("column-chart__columns__item--highlight"),
      ).toBeFalsy();
      expect(
        columns.at(5).classes("column-chart__columns__item--highlight"),
      ).toBeTruthy();
      expect(
        columns.at(6).classes("column-chart__columns__item--highlight"),
      ).toBeFalsy();
      expect(
        columns.at(7).classes("column-chart__columns__item--highlight"),
      ).toBeTruthy();
      expect(
        columns.at(8).classes("column-chart__columns__item--highlight"),
      ).toBeFalsy();
      expect(
        columns.at(9).classes("column-chart__columns__item--highlight"),
      ).toBeFalsy();
    });

    it("should have 0 tooltips", () => {
      const tooltips = wrapper.findAll(".column-chart__tooltips__item");
      expect(tooltips).toHaveLength(0);
    });
  });

  describe("a three columns chart with no highlights using remote JSON", () => {
    let wrapper;

    beforeAll(() => {
      // eslint-disable-next-line no-import-assign
      d3.json = vi.fn().mockResolvedValue([
        { date: 2019, value: 30 },
        { date: 2020, value: 60 },
        { date: 2021, value: 90 },
      ]);
    });

    beforeEach(async () => {
      const propsData = { data: "http://localhost/data.json", noXAxis: true };
      wrapper = mount(ColumnChart, { propsData });
      wrapper.vm.$el.style.width = "500px";
      await wrapper.vm.$nextTick();
    });

    it("creates no x-axis but a y-axis", () => {
      expect(wrapper.find(".column-chart__axis--x").exists()).toBeFalsy();
      expect(wrapper.find(".column-chart__axis--y").exists()).toBeTruthy();
    });

    it("should have a max value to 100 set with a property", async () => {
      const propsData = { data: "http://localhost/data.json", maxValue: 100 };
      wrapper = mount(ColumnChart, { propsData });
      wrapper.vm.$el.style.width = "500px";
      await new Promise((resolve) => setTimeout(resolve));
      await wrapper.vm.$nextTick();

      const column = wrapper.findAll(".column-chart__columns__item__bar").at(2);
      const height = parseFloat(column.attributes("height"));
      expect(height).toBe(wrapper.vm.padded.height * 0.9);
    });

    it("should have a max value to 180 set with a property", async () => {
      const propsData = { data: "http://localhost/data.json", maxValue: 180 };
      wrapper = mount(ColumnChart, { propsData });
      wrapper.vm.$el.style.width = "500px";
      await new Promise((resolve) => setTimeout(resolve));
      await wrapper.vm.$nextTick();

      const column = wrapper.findAll(".column-chart__columns__item__bar").at(2);
      const height = parseFloat(column.attributes("height"));
      expect(height).toBe(wrapper.vm.padded.height / 2);
    });

    it("should have 3 tooltips, none visible", () => {
      const tooltips = wrapper.findAll(".column-chart__tooltips__item");
      expect(tooltips).toHaveLength(3);
      const visibleTooltips = wrapper.findAll(
        ".column-chart__tooltips__item__wrapper",
      );
      expect(visibleTooltips).toHaveLength(0);
    });

    it("should have one tooltip visible after the mouse overs a column", async () => {
      await wrapper
        .findAll(".column-chart__columns__item")
        .at(0)
        .trigger("mouseover"); // TODO fix me
      await wrapper.vm.$nextTick();
      const visibleTooltips = wrapper.findAll(
        ".column-chart__tooltips__item__wrapper",
      );
      expect(visibleTooltips).toHaveLength(1);
    });

    it("should hide the tooltip after the mouse leaves a column", async () => {
      const firstColumn = wrapper.findAll(".column-chart__columns__item").at(0);

      await firstColumn.trigger("mouseover");
      await wrapper.vm.$nextTick();
      expect(
        wrapper.findAll(".column-chart__tooltips__item__wrapper"),
      ).toHaveLength(1);

      await firstColumn.trigger("mouseleave");
      await wrapper.vm.$nextTick();
      expect(
        wrapper.findAll(".column-chart__tooltips__item__wrapper"),
      ).toHaveLength(0);
    });

    it("should position the first tooltip next to the first bar", () => {
      const { element: firstTooltip } = wrapper
        .findAll(".column-chart__tooltips__item")
        .at(0);
      const x =
        wrapper.vm.bars[0].x +
        wrapper.vm.bars[0].width / 2 +
        wrapper.vm.margin.left;
      const y = wrapper.vm.bars[0].y + wrapper.vm.margin.top;
      expect(firstTooltip.style.left).toBe(`${x}px`);
      expect(firstTooltip.style.top).toBe(`${y}px`);
    });

    it("should position the third tooltip before to the third bar", () => {
      const { element: thirdTooltip } = wrapper
        .findAll(".column-chart__tooltips__item")
        .at(2);
      const x =
        wrapper.vm.bars[2].x +
        wrapper.vm.bars[2].width / 2 +
        wrapper.vm.margin.left;
      const y = wrapper.vm.bars[2].y + wrapper.vm.margin.top;
      expect(thirdTooltip.style.left).toBe(`${x}px`);
      expect(thirdTooltip.style.top).toBe(`${y}px`);
    });

    it('should emit a "select" event when clicking on an item', async () => {
      await wrapper
        .findAll(".column-chart__columns__item__bar")
        .at(0)
        .trigger("click");

      expect(wrapper.emitted().select).toBeTruthy();
      expect(wrapper.emitted().select[0][0]).toBe(wrapper.vm.bars[0].datum);
    });
  });
});
