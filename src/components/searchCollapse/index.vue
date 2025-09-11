<template>
  <div
    ref="cardRef"
    class="collapse-wrapper"
  >
    <div class="collapse-container">
      <div>
        <div>
          <slot name="default"> </slot>
        </div>
        <el-collapse-transition>
          <div v-show="show">
            <div ref="collapseRef">
              <slot name="collapse"></slot>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <div
        class="query-wrapper"
        v-show="useQuery"
      >
        <slot name="query">
          <el-button
            type="primary"
            @click="handleQuery"
            >查询</el-button
          >
        </slot>
      </div>
    </div>

    <div
      v-show="useCollapse"
      class="collapse-area"
      @click="handleClickToggle"
      :title="show ? '收起查询条件' : '展开查询条件'"
    >
      <svg-icon
        class="svg-icon"
        :class="show ? 'expanded' : 'closed'"
        icon="expand"
        :size="18"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElCard } from 'element-plus'
import { ref, toRefs } from 'vue'

const props = defineProps({
  useCollapse: {
    type: Boolean,
    default: true,
  },
  useQuery: {
    type: Boolean,
    default: true,
  },
})

const show = defineModel<boolean>({ default: false })

const { useCollapse, useQuery } = toRefs(props)

const cardRef = ref<InstanceType<typeof ElCard> | null>(null)
const collapseRef = ref<HTMLDivElement | null>(null)

const emits = defineEmits<{
  (e: 'query'): void
}>()

const handleClickToggle = () => {
  show.value = !show.value
}

const handleQuery = () => {
  emits('query')
}
</script>

<style lang="scss" scoped>
.collapse-wrapper {
  padding: 16px 0 8px 0;
  box-sizing: border-box;
  position: relative;
  border: none !important;
}

.collapse-container {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr;
  padding: 6px 0;
  will-change: transform;

  .query-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    min-width: 90px;
  }
}

.collapse-area {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  height: 15px;
  width: 180px;
  background-color: #f5f5f5;
  clip-path: polygon(20% 0, 80% 0, 100% 100%, 0 100%);
  cursor: pointer;
  text-align: center;

  .svg-icon {
    transition: transform 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  .expanded {
    transform: rotate(180deg);
  }
  .closed {
    transform: rotate(360deg);
  }
}

:deep(.el-form-item) {
  margin-bottom: 12px;
}
</style>
