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
  props: {
    mixins: [resize],
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
    legendData: {
      type: Array,
      default: function () {
        return ["前端", "大数据", "Java", "移动端"];
      },
    },
    seriesData: {
      type: Array,
      default: () => [
        { value: 100, name: "前端" },
        { value: 100, name: "大数据" },
        { value: 100, name: "Java" },
        { value: 100, name: "移动端" },
      ],
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    //当加载dom后， 会调用this.initChart()来进行初始化echarts实例
   
    this.$nextTick(() => { //console.log(this.legendData)
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
        title: {
          text: "各类书籍总数统计",
          left: "center",
        },
        tooltip: {
          //鼠标放上去的提示框格式
          trigger: "item",
        },
        legend: {
          //左上角
          orient: "vertical",
          left: "left",
          data: this.legendData,
        },
        series: [
          {
            name: "Access From",
            type: "pie", //饼状图
            radius: "50%", //圆大小
            data: this.seriesData, //
            emphasis: {
              itemStyle: {
                shadowBlur: 10, //圆形阴影的模糊大小
                shadowOffsetX: 0, //阴影水平方向的距离
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
  },
};
</script>
