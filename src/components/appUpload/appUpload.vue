<template>
  <el-upload
    class="image-uploader"
    :class="{ 'hide-upload': hideUploadButton }"
    :action="action"
    accept="image/*"
    :headers="headers"
    :list-type="listType"
    :on-success="handleSuccess"
    :on-error="handleError"
    :before-upload="beforeUpload"
    :multiple="multiple"
    :limit="limit"
    :on-exceed="handleExceed"
    :show-file-list="showFileList"
    v-model:file-list="fileList"
  >
    <el-icon><Plus /></el-icon>

    <template #file="{ file, index }">
      <div>
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          fit="fill"
          :alt="file.name"
          style="
            width: var(--el-upload-list-picture-card-size);
            height: var(--el-upload-list-picture-card-size);
          "
        />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handleOnPreview(index)"
          >
            <el-icon :size="20"><zoom-in /></el-icon>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click="handleDeleteFile(file)"
          >
            <el-icon :size="20"><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
    <template #tip>
      <slot name="tip"></slot>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { computed, type PropType, toRefs } from 'vue'
import {
  ElMessage,
  type UploadFile,
  type UploadFiles,
  type UploadUserFile,
} from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useTokenStore } from '@/store/tokenStore'
import { storeToRefs } from 'pinia'
import type { ResponseResult } from '#/hooks'
import { useImageViewer } from '@/hooks/useImageViewer'
import { useMessage } from '@/hooks/useMessage'
import { ZoomIn, Delete } from '@element-plus/icons-vue'

const tokenStore = useTokenStore()
const { token } = storeToRefs(tokenStore)

const action = import.meta.env.VITE_APP_UPLOAD_URL as string
const headers = {
  Authorization: token.value,
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<UploadUserFile[]>,
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    default: 1,
  },
  listType: {
    type: String as PropType<'text' | 'picture' | 'picture-card'>,
    default: 'picture-card',
  },
  showFileList: {
    type: Boolean,
    default: true,
  },
})

const { modelValue, multiple, limit, listType, showFileList } = toRefs(props)

const emits = defineEmits(['update:modelValue', 'success', 'error', 'remove'])

const fileList = computed({
  get() {
    return modelValue.value
  },
  set(val: UploadFile[]) {
    emits('update:modelValue', val)
  },
})

const hideUploadButton = computed(() => {
  return fileList.value.length >= props.limit
})

const handleSuccess = (
  response: ResponseResult<string>,
  uploadFile: UploadFile,
  _uploadFiles: UploadFiles
) => {
  if (response.code === 0 && response.data) {
    emits('update:modelValue', [
      {
        name: uploadFile.name,
        url: response.data,
      },
    ])
    emits('success', response)
  } else {
    emits(
      'update:modelValue',
      fileList.value.filter((file) => file.url !== uploadFile.url)
    )
    emits('error', response)
    useMessage({
      type: 'error',
      message: response.msg,
    })
  }
}

const handleOnPreview = (index: number) => {
  useImageViewer({
    urlList: fileList.value.map((file) => file.url as string),
    initialIndex: index,
    zIndex: 99999,
  })
}

// 上传失败处理
const handleError = (error: Error) => {
  ElMessage.error('上传失败')
  emits('error', error)
}

// 文件移除处理
const handleDeleteFile = (uploadFile: UploadFile) => {
  emits(
    'update:modelValue',
    fileList.value.filter((file) => file.url !== uploadFile.url)
  )
}

// 上传数量超出限制时
const handleExceed = () => {
  ElMessage.warning(`最多只能上传 ${props.limit} 张图片`)
}

// 上传前的校验
const beforeUpload = (rawFile: any) => {
  const isLt2M = rawFile.size / 1024 / 1024 < 2

  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
  }
  return isLt2M
}
</script>

<style scoped>
.image-uploader .uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 146px; /* 适配 picture-card 尺寸 */
  height: 146px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 隐藏超出限制的上传按钮 */
.image-uploader.hide-upload :deep(.el-upload--picture-card) {
  display: none;
}
</style>
