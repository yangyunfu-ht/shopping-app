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
          label="属性名称"
          prop="name"
        >
          <el-input
            v-model.trim="ruleForm.name"
            placeholder="请输入属性名称"
          />
        </el-form-item>
        <el-form-item
          label="属性备注"
          prop="remark"
        >
          <el-input
            v-model.trim="ruleForm.remark"
            type="textarea"
            :rows="3"
            show-word-limit
            :maxlength="50"
            placeholder="请输入属性备注"
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
  remark: '',
  id: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [
    {
      required: true,
      message: '请输入属性名称',
      trigger: 'blur',
    },
  ],
})

const handleClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  ruleForm.id = ''
}

const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        const { code, msg } = await request({
          url: ruleForm.id ? Api.change : Api.create,
          method: ruleForm.id ? 'put' : 'post',
          data: ruleForm,
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
  title.value = '新增属性'
  visible.value = true
}

const changeOpen = async (id: string) => {
  if (!id) return
  ruleForm.id = id
  title.value = '修改属性'
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
      ruleForm.remark = data.remark
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
