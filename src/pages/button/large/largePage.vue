<template>
  <div>
    <el-button size="large"> LargePage Button </el-button>
    <el-input v-model="large"></el-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'largeButton',
})

const large = ref('')
</script>

<style lang="scss" scoped></style>
