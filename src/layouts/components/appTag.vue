<template>
  <div
    class="app-tag-element"
    :key="appTagsHistory.length"
  >
    <div class="app-tag-element__left">
      <div
        class="app-tag-buttons"
        v-show="showScrollButtons"
        @click.stop="scroll('left')"
        style="margin-right: 8px"
      >
        <el-icon>
          <DArrowLeft />
        </el-icon>
      </div>
    </div>

    <div
      class="app-tag-element__center"
      ref="tabContainerRef"
    >
      <div
        v-for="tab in appTagsHistory"
        :key="tab.fullPath"
        :class="['tag-item', { active: currentPath === tab.fullPath }]"
        @click="goToTab(tab.fullPath)"
      >
        <span>{{ tab.meta.name }}</span>
        <span
          v-if="appTagsHistory.length > 1"
          class="close-btn"
          @click.stop="closeTab(tab)"
        >
          &times;
        </span>
      </div>
    </div>

    <div class="app-tag-element__right">
      <div
        class="app-tag-buttons"
        v-show="showScrollButtons"
        @click.stop="scroll('right')"
        style="margin-left: 8px"
      >
        <el-icon>
          <DArrowRight />
        </el-icon>
      </div>

      <div
        class="app-tag-buttons"
        @click.stop="handleRefresh"
      >
        <el-icon>
          <RefreshRight />
        </el-icon>
      </div>

      <el-popover
        placement="bottom"
        :width="120"
        trigger="click"
        v-if="appTagsHistory.length >= 2"
      >
        <template #reference>
          <div class="app-tag-buttons">
            <el-icon>
              <More />
            </el-icon>
          </div>
        </template>
        <div style="width: 100%">
          <el-button
            text
            style="margin: 0"
            @click="
              menuStore.closeOtherTags(
                appTagsHistory.find((tab) => tab.fullPath === currentPath)
              )
            "
          >
            关闭其他标签
          </el-button>
          <el-button
            text
            style="margin: 0"
            @click="menuStore.closeAllTags()"
          >
            关闭所有标签
          </el-button>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowRight,
  DArrowLeft,
  DArrowRight,
  More,
  RefreshRight,
} from '@element-plus/icons-vue'
import { ref, watch, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMenuStore } from '@/store/menuStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const { appTagsHistory } = storeToRefs(menuStore)
const showScrollButtons = ref(false)

const currentPath = ref(route.fullPath)
const tabContainerRef = ref(null)

watch(
  () => route.fullPath,
  async (newPath) => {
    currentPath.value = newPath
    const existingTab = appTagsHistory.value.find(
      (tab) => tab.fullPath === newPath
    )
    if (!existingTab) {
      menuStore.addAppTagsHistory({
        fullPath: route.fullPath,
        meta: route.meta,
        name: route.name,
      })
    }
  },
  { immediate: true }
)

watch(
  () => appTagsHistory.value.length,
  () => {
    calculateScrollButton()
  }
)

const scroll = (direction) => {
  const container = tabContainerRef.value
  if (!container) return
  if (container.scrollWidth > container.clientWidth) {
    const scrollDistance = 200
    const currentScrollLeft = container.scrollLeft

    if (direction === 'left') {
      container.scrollTo({
        left: currentScrollLeft - scrollDistance,
        behavior: 'smooth',
      })
    }
    if (direction === 'right') {
      container.scrollTo({
        left: currentScrollLeft + scrollDistance,
        behavior: 'smooth',
      })
    }
  }
}

const handleRefresh = () => {
  window.location.reload()
}

// 跳转到指定标签页
const goToTab = (fullPath) => {
  router.push({ path: fullPath })
}

const closeTab = (tab) => {
  if (currentPath.value === tab.fullPath) {
    const tabIndex = appTagsHistory.value.findIndex(
      (t) => t.fullPath === tab.fullPath
    )
    const nextTab =
      appTagsHistory.value[tabIndex + 1] || appTagsHistory.value[tabIndex - 1]
    if (nextTab) {
      router.push(nextTab.fullPath)
    } else {
      router.push('/')
    }
  }
  appTagsHistory.value = appTagsHistory.value.filter(
    (t) => t.fullPath !== tab.fullPath
  )
}

const calculateScrollButton = () => {
  nextTick(() => {
    const container = tabContainerRef.value
    if (!container) {
      showScrollButtons.value = true
      return
    }

    showScrollButtons.value = container.scrollWidth > container.clientWidth
  })
}

onMounted(() => {
  calculateScrollButton()
  window.addEventListener('resize', calculateScrollButton)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateScrollButton)
})
</script>

<style lang="scss" scoped>
.app-tag-element {
  width: 100%;
  height: 36px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr;
  user-select: none;
  transition: var(--el-transition-all);

  .app-tag-element__left,
  .app-tag-element__right {
    display: flex;
    align-items: center;
  }

  .app-tag-element__center {
    flex: 1;
    height: 100%;
    overflow: hidden;

    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: scroll;
    height: 100%;
    white-space: nowrap;
    box-sizing: border-box;

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

    .tag-item {
      display: flex;
      gap: 8px;
      align-items: center;
      height: 32px;
      background-color: var(--el-color-white);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      cursor: pointer;
      padding: 0 12px;
      border: 1px solid rgba(219, 223, 233, 0.3);
      box-sizing: border-box;
      font-size: 13px;
      white-space: nowrap;
      flex-shrink: 0;

      &:hover {
        color: var(--el-color-primary);
      }

      &.active {
        background-color: var(--el-color-primary);
        color: var(--el-color-white);
      }

      .close-btn {
        cursor: pointer;
        font-weight: bold;
      }
    }
  }
}

.app-tag-buttons {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--el-color-white);
  border-right: 1px solid var(--el-border-color-light);
  font-size: 13px;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);

  &:hover {
    background-color: var(--el-fill-color-light);
    color: var(--el-color-primary);
    cursor: pointer;
  }
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
