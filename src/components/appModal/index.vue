<template>
  <el-dialog
    v-model="visible"
    :width="width"
    :align-center="alignCenter"
    :modal="modal"
    :append-to-body="appendToBody"
    :lock-scroll="lockScroll"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="false"
    @open="handleOpen"
    @close="handleClose"
  >
    <template #header>
      <header class="app-dialog__header">
        <div class="app-dialog__header__title">
          {{ title }}
        </div>
        <div
          class="app-dialog__header__icon"
          @click="handleCancel"
        >
          <el-icon>
            <Close />
          </el-icon>
        </div>
      </header>
    </template>
    <main class="app-dialog__main">
      <slot name="default">default</slot>
    </main>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">{{ cancelText }}</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: 'modal',
  },
  width: {
    type: [Number, String],
    default: 500,
  },
  alignCenter: {
    type: Boolean,
    default: true,
  },
  modal: {
    type: Boolean,
    default: true,
  },
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
  closeOnPressEscape: {
    type: Boolean,
    default: false,
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  confirmText: {
    type: String,
    default: '确定',
  },
})

const {
  title,
  width,
  alignCenter,
  modal,
  appendToBody,
  lockScroll,
  closeOnClickModal,
  closeOnPressEscape,
  cancelText,
  confirmText,
} = toRefs(props)

const visible = defineModel({ type: Boolean, default: false })

const emits = defineEmits<{
  open: [value: boolean]
  close: [value: boolean]
  confirm: []
}>()

const handleOpen = () => {
  emits('open', visible.value)
}

const handleClose = () => {
  emits('close', visible.value)
}

const handleConfirm = () => {
  emits('confirm')
}

const handleCancel = () => {
  visible.value = false
}
</script>

<style lang="scss" scoped>
.app-dialog__header {
  padding: 8px;
  box-sizing: border-box;
  min-height: 48px;
  display: grid;
  grid-template-columns: 1fr 32px;
  grid-template-rows: 1fr;

  .app-dialog__header__title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-weight: 550;
  }

  .app-dialog__header__icon {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .app-dialog__header__icon:hover {
    color: var(--el-color-primary);
  }
}

.app-dialog__main {
  font-size: 16px;
  padding: 8px;
  box-sizing: border-box;
}
</style>
