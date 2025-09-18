<template>
  <app-drawer
    v-model="visible"
    :footer="false"
    title="通知消息"
  >
    通知消息
  </app-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalStore } from '@/store/globalStore'
import { storeToRefs } from 'pinia'

const globalStore = useGlobalStore()
const { appMessageVisible } = storeToRefs(globalStore)

const visible = computed({
  get() {
    return appMessageVisible.value
  },
  set() {
    globalStore.setAppMessageVisible(!appMessageVisible.value)
  },
})
</script>

<style lang="scss" scoped></style>
