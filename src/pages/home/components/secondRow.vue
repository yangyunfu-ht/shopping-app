<template>
  <el-row :gutter="8">
    <el-col v-bind="wrapperColLarge">
      <div class="entry-home">
        <header class="entry_home__header">快捷入口</header>
        <main class="entry_home__main">
          <div
            class="entry_home__main__item"
            v-for="(entry, index) in entryData"
            :key="index"
          >
            <div class="entry-home__main__item__icon"></div>
            <div class="entry-home__main__item__title">
              {{ entry }}
            </div>
          </div>
        </main>
      </div>
    </el-col>

    <el-col v-bind="wrapperColLarge">
      <div class="entry-home">
        <header class="entry_home__header">运营数据</header>
        <main class="entry_home__main">
          <div
            class="entry_home__main__item"
            v-for="(operation, index) in operationData"
            :key="index"
          >
            <div class="entry-home__main__item__icon"></div>
            <div class="entry-home__main__item__title">
              {{ operation }}
            </div>
          </div>
        </main>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { wrapperColLarge } from '@/utils/layout'
import { ref } from 'vue'

const entryData = ref([
  '用户管理',
  '商品列表',
  '订单管理',
  '售后管理',
  '分销管理',
  '优惠券',
  '订单管理',
  '会员统计',
])

const operationData = ref([
  '用户管理',
  '商品列表',
  '订单管理',
  '售后管理',
  '分销管理',
  '优惠券',
  '订单管理',
  '会员统计',
])
</script>

<style lang="scss" scoped>
.entry-home {
  background-color: var(--el-color-white);
  padding: 16px;
  box-sizing: border-box;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  margin-bottom: 8px;
  border: 1px solid rgba(219, 223, 233, 0.3);

  .entry_home__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 8px 16px 8px;
    font-size: 18px;
    border-bottom: 1px solid var(--el-border-color);
  }

  .entry_home__main {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    row-gap: 32px;
    padding: 8px;

    .entry_home__main__item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 8px;
      cursor: pointer;

      .entry-home__main__item__icon {
        height: 50px;
        width: 50px;
      }
    }
  }
}
</style>
