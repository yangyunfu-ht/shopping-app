<template>
  <Transition name="modal">
    <div
      v-if="visible"
      class="v-modal-overlay"
      @click.self="closeModal"
    >
      <div class="v-modal-content">
        <div class="v-modal-header">
          <slot name="header">
            <h3>提示</h3>
          </slot>
          <span
            class="v-modal-close"
            @click="closeModal"
            >&times;</span
          >
        </div>

        <div class="v-modal-body">
          <slot></slot>
        </div>

        <div
          v-if="$slots.footer"
          class="v-modal-footer"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible'])

const closeModal = () => {
  emit('update:visible', false)
}
</script>

<style scoped>
/* 遮罩层样式 */
.v-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center; /* 关键：使用 Flexbox 实现上下左右居中 */
  z-index: 1000;
}

/* 弹框内容样式 */
.v-modal-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  padding: 20px;
  position: relative;
}

/* 头部样式 */
.v-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.v-modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.v-modal-close {
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: #999;
}

.v-modal-close:hover {
  color: #666;
}

/* 动画效果：使用 transition 名称 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.5s ease;
}

/* 进入动画：从不可见，缩小状态进入 */
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 居中动画：在离开时，让弹框从中心向外扩散 */
.modal-leave-to {
  transform: scale(1.05);
}
</style>
