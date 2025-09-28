<template>
  <el-row :gutter="8">
    <el-col
      v-bind="wrapperColSmall"
      v-for="(card, index) in homeCardData"
      :key="index"
    >
      <div class="home-card">
        <header class="home-card__header">
          <span>{{ card.title }}</span>
          <el-tag type="primary">{{ card.subTitle }}</el-tag>
        </header>
        <main class="home-card__main">
          <span>{{ card.count }}</span>
          <span>{{ card.rate }}</span>
        </main>
        <footer class="home-card__footer">
          <span>{{ card.footerTitle }}</span>
          <span>{{ card.footerData }}</span>
        </footer>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { wrapperColSmall } from '@/utils/layout'
import { ref } from 'vue'

const homeCardData = ref([
  {
    title: '销售额',
    subTitle: '今日',
    count: 0,
    rate: '100%',
    footerTitle: '昨日数据',
    footerData: 0,
  },
  {
    title: '用户访问量',
    subTitle: '今日',
    count: 0,
    rate: '100%',
    footerTitle: '昨日数据',
    footerData: 0,
  },
  {
    title: '订单量',
    subTitle: '今日',
    count: 0,
    rate: '100%',
    footerTitle: '昨日数据',
    footerData: 0,
  },
  {
    title: '新增用户',
    subTitle: '今日',
    count: 0,
    rate: '100%',
    footerTitle: '昨日数据',
    footerData: 0,
  },
])
</script>

<style lang="scss" scoped>
.home-card {
  background-color: var(--el-color-white);
  padding: 16px;
  box-sizing: border-box;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  margin-bottom: 8px;
  border: 1px solid rgba(219, 223, 233, 0.3);

  .home-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
  }

  .home-card__main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 8px 16px 8px;
  }

  .home-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 8px 0 8px;
    border-top: 1px solid var(--el-border-color);
  }
}
</style>
