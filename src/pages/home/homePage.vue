<template>
  <div>
    <h2>首页</h2>
    <input
      v-model="value"
      type="text"
    />
  </div>
</template>

<script setup lang="ts">
import { onActivated, ref } from 'vue'

const value = ref<string>('')

defineOptions({
  name: 'homePage',
})

onActivated(() => {
  console.log('homePage onActivated')
})
</script>

<style lang="scss" scoped></style>
