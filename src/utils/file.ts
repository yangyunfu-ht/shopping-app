import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import service from './request'

export const downloadFile = async (
  options = {} as AxiosRequestConfig,
  fileName: string
) => {
  try {
    const response = await service({
      ...options,
      responseType: 'blob',
    })

    console.log(response)

    if (!response) {
      throw new Error('文件下载失败')
    }

    const blobUrl = window.URL.createObjectURL(response.data)

    const link = document.createElement('a')
    link.href = blobUrl
    link.download = fileName

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (error: any) {
    throw new Error(error?.message || '文件下载失败')
  }
}

export const uploadFile = (
  url: string,
  file: File,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const config: AxiosRequestConfig = {
    method: 'post', // File uploads are typically POST requests
    url: url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...options,
  }
  return service(config)
}

/**
 * 弹出文件选择框，让用户选择文件。
 * @param {string} [accept] - 可选的文件类型，例如 'image/png, image/jpeg'。
 * @param {boolean} [multiple] - 是否允许选择多个文件，默认为 false。
 * @returns {Promise<File[]>} 一个 Promise，成功时返回选中的文件数组，取消时返回 rejected Promise。
 */
export const chooseFile = (
  accept: string = 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .csv',
  multiple: boolean = false
): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    // 创建隐藏的 input 元素
    const input = document.createElement('input')
    input.type = 'file'
    input.style.display = 'none'

    // 设置文件类型和多选属性
    input.setAttribute('accept', accept)
    if (multiple) {
      input.setAttribute('multiple', 'true')
    }

    // 将 input 元素添加到文档中
    document.body.appendChild(input)

    // 监听文件选择事件
    input.onchange = (event: Event) => {
      const files = (event.target as HTMLInputElement).files
      // 如果有文件被选中，解析 Promise 并返回文件列表
      if (files && files.length > 0) {
        resolve(Array.from(files))
      } else {
        // 如果没有文件（用户取消了选择），拒绝 Promise
        reject(new Error('用户取消了文件选择'))
      }

      // 清理：移除 input 元素，避免内存泄漏
      document.body.removeChild(input)
    }

    // 模拟点击，触发文件选择框
    input.click()

    // 监听 blur 事件以处理用户取消操作
    // 这是一个备用方案，因为 onchange 在某些浏览器中取消选择时不会触发
    // 注意：input.click() 之后会立即触发 blur，所以需要延迟执行
    setTimeout(() => {
      // 如果 input 元素仍然在文档中，说明用户可能取消了
      if (document.body.contains(input)) {
        // 这里我们不主动调用 reject，因为 onchange 会处理
        // 这样做主要是为了确保 onchange 的逻辑被优先执行，
        // 避免在用户取消时重复抛出错误。
      }
    }, 500) // 适当的延迟，确保 click 事件处理完毕
  })
}
