<template>
  <el-drawer
    v-model="visible"
    :append-to-body="appendToBody"
    :size="size"
    :direction="direction"
    :show-close="showClose"
  >
    <template #header>
      <header>
        <slot name="header">header</slot>
      </header>
    </template>
    <template #default>
      <main
        style="
          height: 100%;
          padding: 8px;
          box-sizing: border-box;
          overflow: auto;
        "
      >
        <slot name="default">default</slot>
      </main>
    </template>
    <template #footer>
      <footer>
        <slot name="footer">footer</slot>
      </footer>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { toRefs, type PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  appendToBody: {
    type: Boolean,
    default: true,
  },
  size: {
    type: [Number, String],
    default: 750,
  },
  direction: {
    type: String as PropType<'rtl' | 'ltr' | 'ttb' | 'btt'>,
    default: 'rtl',
  },
  showClose: {
    type: Boolean,
    default: false,
  },
})

const { appendToBody, size, direction } = toRefs(props)

const visible = defineModel({ type: Boolean })
</script>

<style lang="css">
.el-drawer {
  --el-drawer-padding-primary: 0 !important;
}

.el-drawer__header {
  margin-bottom: 0 !important;
}

.el-drawer__body {
  padding: 0 !important;
}
</style>
