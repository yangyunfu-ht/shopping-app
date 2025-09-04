<template>
  <div>
    {{ keepAlive ? 1 : 0 }}
    <hello-world msg="我的页面" />
    <input
      v-model="value"
      type="text"
    />
    <button @click="openConfirmModal">打开确认弹框</button>
    <button @click="openConfirmModal1">打开确认弹框</button>
  </div>
</template>

<script setup lang="ts">
import { computed, onActivated, ref } from 'vue'
import HelloWorld from '@/components/helloWorld.vue'
import { useRoute } from 'vue-router'
import { showModal } from '@/utils/modal'

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

const openConfirmModal = () => {
  showModal('你确定要继续吗？', {
    header: '确认',
    footer: '自定义底部内容',
  })
    .then(() => {
      console.log('用户点击了确认')
    })
    .catch(() => {
      console.log('用户点击了取消或关闭')
    })
}
const openConfirmModal1 = () => {
  showModal('你确定要继续吗？', {
    header: '确认',
    footer: '自定义底部内容',
  })
    .then(() => {
      console.log('用户点击了确认')
    })
    .catch(() => {
      console.log('用户点击了取消或关闭')
    })
}
</script>

<style lang="scss" scoped></style>
