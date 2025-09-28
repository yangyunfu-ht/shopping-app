<template>
  <div>
    <first-row />

    <second-row />

    <three-row />

    <four-row />

    <five-row />
  </div>
</template>

<script setup lang="ts">
import { onActivated } from 'vue'
import firstRow from './components/firstRow.vue'
import secondRow from './components/secondRow.vue'
import threeRow from './components/threeRow.vue'
import fourRow from './components/fourRow.vue'
import fiveRow from './components/fiveRow.vue'

defineOptions({
  name: 'homePage',
})

onActivated(() => {
  console.log('homePage onActivated')
})
</script>

<style lang="scss" scoped></style>
