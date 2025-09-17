import { ElMessageBox, type ElMessageBoxOptions } from 'element-plus'
import { ref, type VNode } from 'vue'

const isMessageBoxOpen = ref(false)

interface UseMessageBoxParams {
  method: 'alert' | 'confirm' | 'prompt'
  message: string | VNode
  title: string
  options?: ElMessageBoxOptions
}

export function useMessageBox() {
  const handleAction = async (params: UseMessageBoxParams) => {
    if (isMessageBoxOpen.value) return

    try {
      isMessageBoxOpen.value = true
      const result = await ElMessageBox[params.method](
        params.message,
        params.title,
        params.options
      )

      return Promise.resolve(result)
    } catch (e) {
      return Promise.reject(e)
    } finally {
      isMessageBoxOpen.value = false
    }
  }

  return {
    alert: (params: Omit<UseMessageBoxParams, 'method'>) =>
      handleAction({ ...params, method: 'alert' }),
    confirm: (params: Omit<UseMessageBoxParams, 'method'>) =>
      handleAction({ ...params, method: 'confirm' }),
    prompt: (params: Omit<UseMessageBoxParams, 'method'>) =>
      handleAction({ ...params, method: 'prompt' }),
  }
}
