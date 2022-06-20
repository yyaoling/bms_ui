<template>
  <!-- 一个具备宽高的dom容器 -->
  <div
    ref="main"
    :class="className"
    :style="{ height: height, width: width }"
  ></div>
</template>

<script>
import * as echarts from "echarts";

//自适应窗口大小
import resize from "./mixins/resize";
//引入echarts主题
require("echarts/theme/macarons");
export default {
  //自适应窗口大小
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "400px",
    },
    xAxisData: {
      //x轴显示的数据
      type: Array,
      default: function () {
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      },
    },
    seriesData: {
      type: Array,
      default: () => [10, 52, 200, 334, 390, 330, 1000],
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    //当加载dom后， 会调用this.initChart()来进行初始化echarts实例
    this.$nextTick(() => {
      this.initChart();
    });
  },
  // 当组件销毁之前会调用
  beforeDestroy() {
    if (!this.chart) {
      return;
    } else {
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    initChart() {
      //第二个参数可以指定引用的主题
      this.chart = echarts.init(this.$refs.main, "macarons");

      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.xAxisData,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: this.seriesData,
          },
        ],
      });
    },
  },
};
</script>
