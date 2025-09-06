<template>
  <header>
    <RouterLink
      to="/home/homePage"
      style="margin-right: 100px"
      >首页</RouterLink
    >
    <RouterLink
      to="/about/aboutPage"
      style="margin-right: 100px"
      >关于</RouterLink
    >
    <RouterLink
      to="/mine/minePage"
      style="margin-right: 100px"
      >我的</RouterLink
    >
    <RouterLink
      to="/data/dataPage"
      style="margin-right: 100px"
      >数据</RouterLink
    >
    <el-button
      style="margin-right: 100px"
      @click="handleBack"
      >返回首页</el-button
    >
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  localStorage.removeItem('token')
  router.push({ path: '/login' })
  window.location.reload()
}
</script>

<style lang="scss" scoped></style>
