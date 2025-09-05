<template>
  <div>
    {{ keepAlive ? 1 : 0 }}
    <h2>我的</h2>
    <input
      v-model="value"
      type="text"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onActivated, ref } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'minePage',
})

const route = useRoute()
const value = ref<string>('')

const keepAlive = computed(() => {
  return route.meta.keepAlive
})

onActivated(() => {
  console.log('minePage onActivated')
})
</script>

<style lang="scss" scoped></style>
