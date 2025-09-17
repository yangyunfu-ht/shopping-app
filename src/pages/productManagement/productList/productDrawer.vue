<template>
  <app-drawer v-model="visible"> </app-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)

const openDrawer = () => {
  visible.value = true
}

defineExpose({
  openDrawer,
})
</script>

<style lang="scss" scoped></style>
