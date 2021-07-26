<template>
  <el-card>
    <BreadLink menuName="数据展示" />
    <div class="echarts-container" style="margin:0 auto">
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div ref="divRef" style="width: 600px; height: 400px;"></div>
    </div>
  </el-card>
</template>

<script>
import BreadLink from "../../components/BreadLink.vue";
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
export default {
  components:{BreadLink},
  setup() {
    //divRef
    const divRef = ref(null);
    onMounted(() => {
      console.log(echarts);
      let myChart = echarts.init(divRef.value);
      let option = {
        title: {
          text: "文章分类数量",
        },
        tooltip: {},
        legend: {
          data: ["数量"],
        },
        xAxis: {
          data: ["java", "js", "c", "python", "php", "c++"],
        },
        yAxis: {},
        series: [
          {
            name: "数量",
            type: "bar",
            data: [235, 220, 336, 350, 382, 235],
          },
        ],
      };
      myChart.setOption(option);
    });
    return { divRef };
  },
};
</script>

<style lang="scss" scoped>

</style>