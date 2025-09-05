<template>
  <div>
    {{ keepAlive ? 1 : 0 }}

    <input
      v-model="value"
      type="text"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'aboutPage',
})

const route = useRoute()
const value = ref<string>('')

const keepAlive = computed(() => {
  return route.meta.keepAlive
})

onActivated(() => {
  console.log('aboutPage onActivated')
})

onMounted(() => {
  console.log('aboutPage onMounted')
})
</script>

<style lang="scss" scoped></style>
