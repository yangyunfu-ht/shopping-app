import { createVNode, render } from 'vue'
import { ElImageViewer, type ImageViewerProps } from 'element-plus'

type PreviewOption = Partial<ImageViewerProps>

// 临时容器，用于挂载 ElImageViewer 组件
const container = document.createElement('div')

/**
 * 显示图片预览器
 * @param options 图片预览配置
 */
export function useImageViewer(options: PreviewOption) {
  const { urlList, initialIndex = 0 } = options

  if (!urlList || urlList.length === 0) {
    console.warn('图片 URL 列表不能为空')
    return
  }

  // 1. 创建一个临时的 DOM 容器，并添加到 body 中
  document.body.appendChild(container)

  // 2. 创建 ElImageViewer 的虚拟节点
  const vnode = createVNode(ElImageViewer, {
    urlList,
    initialIndex,
    // 3. 监听 close 事件，销毁组件
    onClose: () => {
      // unmount 虚拟节点
      render(null, container)
      // 移除 DOM 容器
      document.body.removeChild(container)
    },
  })

  // 4. 将虚拟节点渲染到 DOM 容器中
  render(vnode, container)
}
