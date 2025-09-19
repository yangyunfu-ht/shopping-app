<template>
  <app-drawer
    v-model="visible"
    title="新增商品"
    @open="handleOpen"
    @close="handleClose"
    @confirm="handleConfirm"
  ></app-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)

const handleOpen = (v: boolean) => {
  console.log('open', v)
}

const handleClose = (v: boolean) => {
  console.log('close', v)
}

const handleConfirm = (v: boolean) => {
  visible.value = false
  console.log('confirm', v)
}

const openDrawer = () => {
  visible.value = true
}

defineExpose({
  openDrawer,
})
</script>

<style lang="scss" scoped></style>
