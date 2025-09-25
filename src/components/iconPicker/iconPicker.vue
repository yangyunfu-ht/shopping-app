<template>
  <el-popover
    :visible="popoverVisible"
    placement="bottom-start"
    :width="popoverWidth"
    trigger="click"
    @before-leave="handlePopoverLeave"
  >
    <template #reference>
      <el-input
        ref="inputRef"
        :model-value="modelValue"
        placeholder="请选择图标"
        clearable
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        @clear="handleInputClear"
      >
        <template #prefix>
          <svg-icon
            :icon="modelValue"
            v-if="modelValue"
          />
        </template>
      </el-input>
    </template>

    <div class="icon-picker-list">
      <el-scrollbar max-height="200px">
        <el-row>
          <el-col
            v-for="(iconName, index) in iconList"
            :key="index"
            :span="4"
            class="icon-item"
            @click="selectIcon(iconName)"
          >
            <svg-icon :icon="iconName" />
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, nextTick, toRefs } from 'vue'
import { iconsModules } from '@/router/addDynamicRouter'
import type { ElInput } from 'element-plus' // 导入 ElInput 组件的类型

// 接收外部 v-model 绑定的值
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const { modelValue } = toRefs(props)

// 定义组件的事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 图标列表，类型为 string[]
const iconList = ref<string[]>(
  Object.keys(iconsModules).map((icon) => {
    return icon.replace(/^.*\/([^/]+)\..*$/, '$1')
  })
)

// 定义 ref 变量的类型
const popoverVisible = ref<boolean>(false)
const inputRef = ref<InstanceType<typeof ElInput> | null>(null)
const popoverWidth = ref<number>(250)

// 输入框获得焦点，显示浮层
const handleInputFocus = () => {
  popoverVisible.value = true
  nextTick(() => {
    if (inputRef.value) {
      // 通过 $el 获取 HTML 元素，其类型为 HTMLElement
      popoverWidth.value = inputRef.value.$el.offsetWidth
    }
  })
}

// 输入框失去焦点，关闭浮层
const handleInputBlur = () => {
  popoverVisible.value = false
}

// 清空输入框
const handleInputClear = () => {
  emit('update:modelValue', '')
}

// 点击浮层中的图标
const selectIcon = (iconName: string) => {
  emit('update:modelValue', iconName)
  popoverVisible.value = false
}

// 浮层关闭前的回调
const handlePopoverLeave = () => {
  popoverVisible.value = false
}
</script>

<style scoped>
.icon-picker-list {
  text-align: center;
}
.icon-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  border-radius: 4px;
}
.icon-item:hover {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}
.icon-item .el-icon {
  font-size: 20px;
}
</style>
