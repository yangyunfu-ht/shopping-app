<template>
  <app-modal
    v-model="visible"
    title="通知消息"
    @open="handleOpen"
    @close="handleClose"
    @confirm="handleConfirm"
  ></app-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const visible = ref(false)

const handleOpen = (v: boolean) => {
  console.log('open', v)
}

const handleClose = (v: boolean) => {
  console.log('close', v)
}

const handleConfirm = () => {
  visible.value = false
}

const openModal = () => {
  visible.value = true
}

defineExpose({
  openModal,
})
</script>

<style lang="scss" scoped></style>
