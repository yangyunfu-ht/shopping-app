import {
  ElMessage,
  type MessageParams,
  type MessageHandler,
} from 'element-plus'
import { ref } from 'vue'

const messageInstance = ref<MessageHandler | null>(null)
export function useMessage(options: MessageParams) {
  const showMessage = () => {
    if (messageInstance.value) {
      messageInstance.value?.close()
    }

    messageInstance.value = ElMessage(options)

    return messageInstance.value
  }

  return showMessage()
}
