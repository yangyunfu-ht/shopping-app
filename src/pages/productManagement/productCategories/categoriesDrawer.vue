<template>
  <app-drawer
    v-model="visible"
    :title="title"
    @close="handleClose(ruleFormRef)"
    @confirm="handleConfirm(ruleFormRef)"
  >
    <div
      style="height: 100%"
      v-loading="loading"
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="上级分类"
          prop="parentId"
        >
          <el-select
            v-model="ruleForm.parentId"
            clearable
            style="width: 100%"
            placeholder="请选择上级分类"
          >
            <el-option
              v-for="categories in parentCategory"
              :key="categories.id"
              :value="categories.id"
              :label="categories.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="分类名称"
          prop="name"
        >
          <el-input
            v-model.trim="ruleForm.name"
            placeholder="请输入分类名称"
          />
        </el-form-item>

        <el-form-item
          label="分类图片"
          prop="picUrl"
        >
          <app-upload
            v-model.trim="ruleForm.picUrl"
            placeholder="请输入联系电话"
          >
            <template #tip>
              <div>推荐分类图片尺寸为180*180</div>
            </template>
          </app-upload>
        </el-form-item>

        <el-form-item
          label="排序值"
          prop="sort"
        >
          <el-input-number
            v-model="ruleForm.sort"
            placeholder=""
            :min="0"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="分类状态"
          prop="status"
        >
          <el-select
            v-model="ruleForm.status"
            placeholder="请选择分类状态"
          >
            <el-option
              :value="0"
              label="开启"
            />
            <el-option
              :value="1"
              label="关闭"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </app-drawer>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref, toRefs, type PropType } from 'vue'
import { useRequest } from '@/hooks/useRequest'
import { Api } from './api'
import { useMessage } from '@/hooks/useMessage'

const props = defineProps({
  parentCategory: {
    type: Array as PropType<Array<{ id: number; name: string }>>,
    default: () => [],
  },
})

const { parentCategory } = toRefs(props)

const { request, loading } = useRequest()

const visible = ref(false)
const title = ref('')

const emits = defineEmits<{
  submit: []
}>()

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  parentId: null,
  name: '',
  picUrl: [] as any[],
  email: '',
  sort: 0,
  status: 0,
  id: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [
    {
      required: true,
      message: '请输入分类名称',
      trigger: 'blur',
    },
  ],
  picUrl: [
    {
      required: true,
      message: '请上传分类图片',
      trigger: 'change',
    },
  ],
})

const handleClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  ruleForm.id = ''
  ruleForm.picUrl = []
}

const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        const { code, msg } = await request({
          url: ruleForm.id ? Api.change : Api.create,
          method: ruleForm.id ? 'put' : 'post',
          data: {
            ...ruleForm,
            parentId: ruleForm.parentId === null ? 0 : ruleForm.parentId,
            picUrl: (ruleForm.picUrl[0] as any).url,
          },
        })
        if (code === 0) {
          visible.value = false
          emits('submit')
          useMessage({
            type: 'success',
            message: msg,
          })
        } else {
          useMessage({
            type: 'error',
            message: msg,
          })
        }
      } catch (err: any) {
        useMessage({
          type: 'error',
          message: err.message,
        })
      }
    }
  })
}

const openDrawer = () => {
  title.value = '新增分类'
  visible.value = true
}

const changeOpen = async (id: string) => {
  if (!id) return
  ruleForm.id = id
  title.value = '修改分类'
  visible.value = true
  try {
    const { data, code, msg } = await request({
      url: Api.detail,
      method: 'get',
      params: {
        id,
      },
    })
    if (code === 0) {
      ruleForm.parentId = data.parentId === 0 ? null : data.parentId
      ruleForm.name = data.name
      ruleForm.picUrl = [{ name: '', url: data.picUrl }]
      ruleForm.sort = data.sort
      ruleForm.status = data.status
    } else {
      useMessage({
        type: 'error',
        message: msg,
      })
    }
  } catch (err: any) {
    useMessage({
      type: 'error',
      message: err.message,
    })
  }
}

defineExpose({
  openDrawer,
  changeOpen,
})
</script>

<style lang="scss" scoped></style>
