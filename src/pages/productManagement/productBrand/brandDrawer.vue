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
          label="品牌名称"
          prop="name"
        >
          <el-input
            v-model.trim="ruleForm.name"
            placeholder="请输入品牌名称"
          />
        </el-form-item>
        <el-form-item
          label="品牌图片"
          prop="code"
        >
          <app-upload v-model="ruleForm.picUrl" />
        </el-form-item>
        <el-form-item
          label="品牌排序"
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
          label="品牌状态"
          prop="status"
        >
          <el-select
            v-model="ruleForm.status"
            placeholder="请选择品牌状态"
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
        <el-form-item
          label="品牌描述"
          prop="description"
        >
          <el-input
            v-model.trim="ruleForm.description"
            type="textarea"
            :rows="3"
            show-word-limit
            :maxlength="50"
            placeholder="请输入品牌描述"
          />
        </el-form-item>
      </el-form>
    </div>
  </app-drawer>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRequest } from '@/hooks/useRequest'
import { Api } from './api'
import { useMessage } from '@/hooks/useMessage'

const { request, loading } = useRequest()

const visible = ref(false)
const title = ref('')

const emits = defineEmits<{
  submit: []
}>()

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  name: '',
  picUrl: [] as any[],
  sort: 0,
  status: 0,
  description: '',
  id: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [
    {
      required: true,
      message: '请输入品牌名称',
      trigger: 'blur',
    },
  ],
  picUrl: [
    {
      required: true,
      message: '请上传品牌图片',
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
  title.value = '新增品牌'
  visible.value = true
}

const changeOpen = async (id: string) => {
  if (!id) return
  ruleForm.id = id
  title.value = '修改品牌'
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
      ruleForm.name = data.name
      ruleForm.picUrl = [{ name: '', url: data.picUrl }]
      ruleForm.sort = data.sort
      ruleForm.status = data.status
      ruleForm.description = data.description
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
