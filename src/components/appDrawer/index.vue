<template>
  <el-drawer
    v-model="visible"
    :append-to-body="appendToBody"
    :lock-scroll="lockScroll"
    :close-on-click-modal="closeOnClickModal"
    :destroy-on-close="destroyOnClose"
    :size="size"
    :direction="direction"
    :show-close="false"
    :with-header="true"
    @open="handleOpen"
    @close="handleClose"
    style="padding-top: 0"
  >
    <template #header>
      <header class="app-drawer__header">
        <div class="app-drawer__header__title">
          <slot
            name="header"
            :title="title"
          >
            {{ title }}
          </slot>
        </div>
        <div
          class="app-drawer__header__icon"
          @click="handleCancel"
        >
          <el-icon>
            <Close />
          </el-icon>
        </div>
      </header>
    </template>
    <template #default>
      <main
        v-loading="loading"
        class="app-drawer__main"
        style="
          height: 100%;
          padding: 8px;
          box-sizing: border-box;
          overflow: auto;
        "
      >
        <slot name="default"></slot>
      </main>
    </template>
    <template
      #footer
      v-if="footer"
    >
      <footer class="app-drawer__footer">
        <slot name="footer">
          <el-button @click="handleCancel">{{ cancelText }}</el-button>
          <el-button
            type="primary"
            @click="handleConfirm"
            >{{ confirmText }}</el-button
          >
        </slot>
      </footer>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import type { ElDrawer } from 'element-plus'
import { toRefs, type PropType } from 'vue'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  appendToBody: {
    type: Boolean,
    default: true,
  },
  lockScroll: {
    type: Boolean,
    default: true,
  },
  closeOnClickModal: {
    type: Boolean,
    default: false,
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  direction: {
    type: String as PropType<'rtl' | 'ltr' | 'ttb' | 'btt'>,
    default: 'rtl',
  },
  size: {
    type: [Number, String],
    default: 500,
  },
  title: {
    type: String,
    default: '',
  },
  footer: {
    type: Boolean,
    default: true,
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  confirmText: {
    type: String,
    default: '确定',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const {
  appendToBody,
  lockScroll,
  closeOnClickModal,
  destroyOnClose,
  direction,
  size,
  title,
  footer,
  cancelText,
  confirmText,
  loading,
} = toRefs(props)

const visible = defineModel({ type: Boolean, default: false })

const emits = defineEmits<{
  open: []
  close: []
  confirm: []
}>()

const handleOpen = () => {
  emits('open')
}
const handleClose = () => {
  emits('close')
}
const handleConfirm = () => {
  emits('confirm')
}

const handleCancel = () => {
  visible.value = false
}
</script>

<style lang="scss" scoped>
.app-drawer__header {
  padding: 8px;
  box-sizing: border-box;
  min-height: 56px;
  display: grid;
  grid-template-columns: 1fr 32px;
  grid-template-rows: 1fr;
  background-color: var(--bg-color);

  .app-drawer__header__title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: var(--el-text-color-regular);
    font-size: 15px;
    font-weight: 550;
  }

  .app-drawer__header__icon {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .app-drawer__header__icon:hover {
    color: var(--el-color-primary);
  }
}

.app-drawer__main {
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
  overflow: auto;
}

.app-drawer__footer {
  padding: 8px;
  box-sizing: border-box;
  min-height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-color);
}
</style>
