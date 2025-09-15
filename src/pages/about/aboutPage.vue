<template>
  <div
    class="page-layout"
    style="
      height: 100%;
      background-color: #fff;
      padding: 8px;
      box-sizing: border-box;
    "
  >
    <h2 style="padding: 0; margin: 0">关于</h2>
    <el-input v-model="input"></el-input>
  </div>
</template>

<script setup lang="ts">
import { onActivated, onMounted, ref } from 'vue'

defineOptions({
  name: 'aboutPage',
})

const input = ref('')

onActivated(() => {
  console.log('aboutPage onActivated')
})

onMounted(() => {
  console.log('aboutPage onMounted')
})
</script>

<style lang="scss" scoped></style>
