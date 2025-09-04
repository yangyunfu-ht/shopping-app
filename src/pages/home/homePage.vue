<template>
  <div>
    {{ keepAlive ? 1 : 0 }}
    <hello-world msg="首页页面" />
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
