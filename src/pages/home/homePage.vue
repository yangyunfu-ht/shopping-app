<template>
  <div style="height: 100%; background-color: aqua">
    {{ keepAlive ? 1 : 0 }}
    <input
      v-model="value"
      type="text"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onActivated, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const value = ref<string>('')

defineOptions({
  name: 'homePage',
})
const keepAlive = computed(() => {
  return route.meta.keepAlive
})

onActivated(() => {
  console.log('homePage onActivated')
})
</script>

<style lang="scss" scoped></style>
