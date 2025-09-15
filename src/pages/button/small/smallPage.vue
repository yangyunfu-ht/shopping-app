<template>
  <div>
    <el-button size="small">smallPage Button</el-button>
    <el-input v-model="small"></el-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'smallButton',
})

const small = ref('')
</script>

<style lang="scss" scoped></style>
