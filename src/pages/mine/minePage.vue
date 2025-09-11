<template>
  <div>
    <h2>我的</h2>
  </div>
</template>

<script setup lang="ts">
import { onActivated } from 'vue'

defineOptions({
  name: 'minePage',
})

onActivated(() => {
  console.log('minePage onActivated')
})
</script>

<style lang="scss" scoped></style>
