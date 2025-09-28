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
          label="签到天数"
          prop="day"
        >
          <el-input-number
            v-model="ruleForm.day"
            placeholder=""
            :min="0"
            :max="7"
            style="width: 100%"
          />

          <span style="color: var(--el-color-danger)"
            >只允许设置 1-7，默认签到 7 天为一个周期</span
          >
        </el-form-item>
        <el-form-item
          label="奖励积分"
          prop="point"
        >
          <el-input-number
            v-model="ruleForm.point"
            placeholder=""
            :min="0"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="奖励经验"
          prop="experience"
        >
          <el-input-number
            v-model="ruleForm.experience"
            placeholder=""
            :min="0"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-select
            v-model="ruleForm.status"
            placeholder="请选择状态"
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
  day: null,
  point: null,
  experience: null,
  status: 0,
  id: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  day: [
    {
      required: true,
      message: '请输入签到天数',
      trigger: 'blur',
    },
  ],
  point: [
    {
      required: true,
      message: '请输入奖励积分',
      trigger: 'blur',
    },
  ],
  experience: [
    {
      required: true,
      message: '请输入奖励经验',
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
  title.value = '新增标签'
  visible.value = true
}

const changeOpen = async (id: string) => {
  if (!id) return
  ruleForm.id = id
  title.value = '修改标签'
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
      ruleForm.day = data.day
      ruleForm.point = data.point
      ruleForm.experience = data.experience
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
