import { createApp, h, type App, type VNode } from 'vue'
import VModal from '@/components/VModal.vue'

// 存储当前弹框实例的引用，用于实现单例模式
let modalAppInstance: App | null = null
let container: HTMLDivElement | null = null

interface ModalOptions {
  header?: string
  footer?: string
}

/**
 * 命令式调用弹框组件。
 *
 * @param content 要在弹框主体显示的内容（可以是字符串或VNode）。
 * @param options 配置项。
 * @returns Promise，在弹框关闭时解决或拒绝。
 */
export const showModal = (
  content: string | VNode,
  options?: ModalOptions
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 检查是否已存在实例，如果存在，先销毁它
    if (modalAppInstance) {
      modalAppInstance.unmount()
      if (container) {
        document.body.removeChild(container)
      }
    }

    // 创建一个临时的 DOM 容器
    container = document.createElement('div')
    container.id = 'modal-container'
    document.body.appendChild(container)

    const closeModal = (action: 'confirm' | 'cancel') => {
      // 销毁实例并移除 DOM
      modalAppInstance?.unmount()
      if (container) {
        document.body.removeChild(container)
        container = null
      }
      // 根据操作类型解决或拒绝 Promise
      action === 'confirm' ? resolve() : reject()
    }

    // 使用 h 函数创建 VModal 组件的 VNode
    const modalVNode = h(
      VModal,
      {
        visible: true,
        'onUpdate:visible': (val: boolean) => {
          if (!val) {
            closeModal('cancel')
          }
        },
      },
      {
        // 默认插槽：弹框主体内容
        default: () => content,
        // 头部插槽
        header: options?.header ? () => h('h3', options.header) : undefined,
        // 底部插槽
        footer: () =>
          h('div', [
            h(
              'button',
              {
                onClick: () => closeModal('cancel'),
              },
              '取消'
            ),
            h(
              'button',
              {
                style: { marginLeft: '10px' },
                onClick: () => closeModal('confirm'),
              },
              '确定'
            ),
          ]),
      }
    )

    // 创建 Vue 应用实例并挂载
    modalAppInstance = createApp({
      render: () => modalVNode,
    })
    modalAppInstance.mount(container)
  })
}
