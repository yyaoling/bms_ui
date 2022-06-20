<template>
  <div class="dashboard-container">
    <panel-group
      :bookTotal="bookTotal"
      :bookBorrow="bookBorrow"
      :bookReturn="bookReturn"
    ></panel-group>
    <el-row :gutter="40">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card>
          <pie-chart
            v-if="flag"
            :legendData="categoryTotal.nameList"
            :seriesData="bookCategories.nameAndValueList"
          ></pie-chart>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="12">
        <el-card>
          <bar-chart
            v-if="flag"
            :xAxisData="monthbookReturn.yearMonthList"
            :seriesData="monthbookReturn.bookReturnList"
          ></bar-chart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Panel from "@/pages/admin/components/Panel";
import PanelGroup from "./components/PanelGroup.vue";
import PieChart from "./components/PieChart.vue";
import BarChart from "./components/BarChart.vue";
import {
  getBookCategories,
  getBookCount,
  getRecordCount,
} from "@/pages/admin/api/index.js";
export default {
  name: "DashBoard",
  components: {
    Panel,
    PieChart,
    BarChart,
    PanelGroup,
  },
  data() {
    return {
      bookCategories: {},
      bookTotal: 0,
      bookReturn: 0,
      bookBorrow: 0,
      categoryTotal: {},
      monthbookReturn: {},
      flag: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      ///饼状图
      let res = await getBookCategories();
      res = res.data;
      function compare(property) {
        return function (obj1, obj2) {
          var value1 = obj1[property];
          var value2 = obj2[property];
          return value2 - value1; // 降序
        };
      }
      var sortObj = res.sort(compare("bookCount"));
      //console.log(sortObj);
      this.bookCategories.nameAndValueList = sortObj;

      //panelGroup数据
      let bookCountRes = await getBookCount();
      this.bookTotal = bookCountRes.data;
      //console.log(this.bookTotal)
      let bookBorrowRes0 = await getRecordCount("", "", 0);
      let bookBorrowRes1 = await getRecordCount("", "", 1);

      this.bookBorrow = bookBorrowRes0.data + bookBorrowRes1.data;
      this.bookReturn = bookBorrowRes1.data;
      console.log(bookBorrowRes0); //未归还
      console.log(bookBorrowRes1); //已经归还

      this.flag = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

