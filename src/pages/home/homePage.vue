<template>
  <div>
    <h2>首页</h2>
    <div class="chart-wrapper">
      <app-echarts
        :options="barChartOption"
        class="chart-item"
      />

      <app-echarts
        :options="pieChartOption"
        class="chart-item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onActivated, reactive } from 'vue'

defineOptions({
  name: 'homePage',
})

onActivated(() => {
  console.log('homePage onActivated')
})

// 柱状图配置
const barChartOption = reactive({
  title: {
    text: '年度销售量',
  },
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20],
    },
  ],
})

// 饼图配置
const pieChartOption = reactive({
  title: {
    text: '销售占比',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: '销售来源',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' },
        { value: 484, name: '联盟广告' },
        { value: 300, name: '视频广告' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
})
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  margin-bottom: 20px;
}
.chart-wrapper {
  height: 500px;
  display: flex;
  gap: 20px;
  justify-content: center;
}
.chart-item {
  width: 500px;
  height: 400px;
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
