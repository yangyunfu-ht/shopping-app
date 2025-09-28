<template>
  <el-row :gutter="8">
    <el-col
      :xl="12"
      :lg="12"
      :md="12"
      :sm="24"
      :xs="24"
      style="margin-bottom: 16px"
    >
      <el-card
        :body-style="{ height: '300px' }"
        style="
          border: none;
          box-shadow: var(--box-shadow);
          border: 1px solid rgba(219, 223, 233, 0.3);
        "
      >
        <app-echarts
          :options="barChartOption"
          class="chart-item"
        />
      </el-card>
    </el-col>

    <el-col
      :xl="12"
      :lg="12"
      :md="12"
      :sm="24"
      :xs="24"
      style="margin-bottom: 16px"
    >
      <el-card
        :body-style="{ height: '300px' }"
        shadow="never"
        style="
          border: none;
          box-shadow: var(--box-shadow);
          border: 1px solid rgba(219, 223, 233, 0.3);
        "
      >
        <app-echarts
          :options="pieChartOption"
          class="chart-item"
        />
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

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
  // legend: {
  //   orient: 'vertical',
  //   left: 'left',
  // },
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

<style lang="scss" scoped></style>
