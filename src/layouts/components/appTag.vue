<template>
  <div class="tab-wrapper">
    <div
      v-if="showLeftButton"
      class="scroll-btn left"
      @click="scroll('left')"
    >
      &lt;
    </div>

    <div
      ref="tabContainerRef"
      class="tabs-container"
    >
      <TransitionGroup
        name="tab"
        tag="div"
        class="tab-list"
      >
        <div
          v-for="tab in tabs"
          :key="tab.fullPath"
          :class="['tab-item', { active: currentPath === tab.fullPath }]"
          @click="goToTab(tab)"
        >
          <span>{{ tab.meta.title || '新标签' }}</span>
          <span
            v-if="tabs.length > 1"
            class="close-btn"
            @click.stop="closeTab(tab)"
          >
            &times;
          </span>
        </div>
      </TransitionGroup>
    </div>

    <div
      v-if="showRightButton"
      class="scroll-btn right"
      @click="scroll('right')"
    >
      &gt;
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 引入持久化存储功能
const STORAGE_KEY = 'tab-history'
const tabs = ref([])
const currentPath = ref(route.fullPath)

// DOM 引用
const tabContainerRef = ref(null)
// 按钮显示状态
const showLeftButton = ref(false)
const showRightButton = ref(false)

// 1. 初始化时从 LocalStorage 读取数据
const initializeTabs = () => {
  const storedTabs = localStorage.getItem(STORAGE_KEY)
  if (storedTabs) {
    try {
      tabs.value = JSON.parse(storedTabs)
    } catch (e) {
      console.error('Failed to parse tabs from localStorage', e)
      tabs.value = []
    }
  }

  // 确保当前路由在标签页列表中
  const currentTab = tabs.value.find((tab) => tab.fullPath === route.fullPath)
  if (!currentTab) {
    // 如果当前路由不在列表中，则添加它
    tabs.value.push({
      fullPath: route.fullPath,
      meta: route.meta,
      name: route.name,
    })
  }

  // 始终更新当前激活的路径
  currentPath.value = route.fullPath
}

// 2. 监听路由变化，动态添加标签页
watch(
  () => route.fullPath,
  async (newPath) => {
    currentPath.value = newPath
    const existingTab = tabs.value.find((tab) => tab.fullPath === newPath)
    if (!existingTab) {
      tabs.value.push({
        fullPath: route.fullPath,
        meta: route.meta,
        name: route.name,
      })
    }
    // 等待 DOM 更新后计算按钮显示状态并保存
    await nextTick()
    updateButtonVisibility()
  },
  { immediate: true }
)

// 3. 监听标签页数组变化，更新按钮状态并保存数据
watch(
  tabs,
  async (newTabs) => {
    // 保存到 LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTabs))
    await nextTick()
    updateButtonVisibility()
  },
  { deep: true }
)

// 页面加载时或窗口大小改变时，更新按钮状态
onMounted(() => {
  // 在挂载时调用初始化函数
  initializeTabs()
  window.addEventListener('resize', updateButtonVisibility)
  updateButtonVisibility()
})

// 计算是否显示滚动按钮
const updateButtonVisibility = () => {
  const container = tabContainerRef.value
  if (container) {
    // 检查是否有溢出内容
    const isOverflow = container.scrollWidth > container.clientWidth
    showLeftButton.value = isOverflow && container.scrollLeft > 0
    showRightButton.value =
      isOverflow &&
      container.scrollLeft < container.scrollWidth - container.clientWidth
  }
}

// 滚动功能
const scroll = (direction) => {
  const container = tabContainerRef.value
  if (!container) return

  const scrollDistance = 200 // 每次滚动的距离
  const currentScrollLeft = container.scrollLeft

  if (direction === 'left') {
    container.scrollTo({
      left: currentScrollLeft - scrollDistance,
      behavior: 'smooth',
    })
  } else if (direction === 'right') {
    container.scrollTo({
      left: currentScrollLeft + scrollDistance,
      behavior: 'smooth',
    })
  }

  // 滚动后再次检查按钮状态
  setTimeout(updateButtonVisibility, 300) // 延迟执行，等待滚动动画完成
}

const goToTab = (tab) => {
  router.push(tab.fullPath)
}

const closeTab = (tab) => {
  if (currentPath.value === tab.fullPath) {
    const tabIndex = tabs.value.findIndex((t) => t.fullPath === tab.fullPath)
    const nextTab = tabs.value[tabIndex + 1] || tabs.value[tabIndex - 1]
    if (nextTab) {
      router.push(nextTab.fullPath)
    } else {
      router.push('/')
    }
  }
  tabs.value = tabs.value.filter((t) => t.fullPath !== tab.fullPath)
}
</script>

<style scoped>
/* 整个标签组件的包装器 */
.tab-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  background-color: #f0f2f5;
  box-sizing: border-box;
  font-size: 14px;
}

/* 标签容器 - 隐藏溢出内容 */
.tabs-container {
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 8px;
  overflow: hidden;
  white-space: nowrap;
  /* 允许平滑滚动 */
  scroll-behavior: smooth;
}

/* 标签列表 - 确保其内容不换行 */
.tab-list {
  display: flex;
  width: max-content;
}

/* 标签项 */
.tab-item {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  box-sizing: border-box;
  border-radius: 4px;
  margin-right: 8px;
  background-color: #fff;
  cursor: pointer;
  border-radius: var(--border-radius);
}

.tab-item.active {
  color: var(--el-color-primary);
}

.close-btn {
  margin-left: 8px;
  cursor: pointer;
  font-size: 14px;
}

/* 滚动按钮 */
.scroll-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  color: #555;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  /* 防止标签被挡住 */
  position: relative;
}

.scroll-btn.left {
  margin-left: 8px;
}

.scroll-btn.right {
  margin-right: 8px;
}

/* 过渡动画样式 */
.tab-enter-active,
.tab-leave-active {
  transition: opacity 0.3s ease;
}

.tab-enter-from,
.tab-leave-to {
  opacity: 0;
}

.tab-move {
  transition: transform 0.3s ease;
}
</style>
