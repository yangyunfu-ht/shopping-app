<template>
  <div>
    <h2>首页</h2>
  </div>
</template>

<script setup lang="ts">
import { onActivated } from 'vue'

defineOptions({
  name: 'homePage',
})

onActivated(() => {
  console.log('homePage onActivated')
})
</script>

<style lang="scss" scoped></style>
