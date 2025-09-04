<template>
  <div>
    <h3>登录页</h3>
    <button @click="handleClickLogin">点击登录</button>
    <el-button type="primary">点击登录</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const handleClickLogin = () => {
  router.replace({ path: '/home' })
}
</script>

<style lang="scss" scoped></style>
