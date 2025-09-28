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
          label="等级名称"
          prop="name"
        >
          <el-input
            v-model.trim="ruleForm.name"
            placeholder="请输入等级名称"
          />
        </el-form-item>
        <el-form-item
          label="等级"
          prop="level"
        >
          <el-input-number
            v-model="ruleForm.level"
            placeholder=""
            :min="0"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="等级图标"
          prop="icon"
        >
          <app-upload v-model="ruleForm.icon" />
        </el-form-item>
        <el-form-item
          label="等级背景图"
          prop="backgroundUrl"
        >
          <app-upload v-model="ruleForm.backgroundUrl" />
        </el-form-item>
        <el-form-item
          label="升级经验"
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
          label="享受折扣(%)"
          prop="discountPercent"
        >
          <el-input-number
            v-model="ruleForm.discountPercent"
            placeholder=""
            :min="0"
            :max="100"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="等级状态"
          prop="status"
        >
          <el-select
            v-model="ruleForm.status"
            placeholder="请选择等级状态"
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
  name: '',
  level: null,
  icon: [] as any[],
  backgroundUrl: [] as any[],
  experience: null,
  discountPercent: null,
  status: 0,
  id: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [
    {
      required: true,
      message: '请输入等级名称',
      trigger: 'blur',
    },
  ],
  level: [
    {
      required: true,
      message: '请输入等级',
      trigger: 'blur',
    },
  ],
  icon: [
    {
      required: true,
      message: '请上传等级图标',
      trigger: 'blur',
    },
  ],
  backgroundUrl: [
    {
      required: true,
      message: '请上传等级背景图',
      trigger: 'blur',
    },
  ],
  experience: [
    {
      required: true,
      message: '请输入升级经验',
      trigger: 'blur',
    },
  ],
  discountPercent: [
    {
      required: true,
      message: '请输入享受折扣',
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
          data: {
            ...ruleForm,
            icon: ruleForm.icon[0]?.url,
            backgroundUrl: ruleForm.backgroundUrl[0]?.url,
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
  title.value = '新增等级'
  visible.value = true
}

const changeOpen = async (id: string) => {
  if (!id) return
  ruleForm.id = id
  title.value = '修改等级'
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
      ruleForm.level = data.level
      ruleForm.icon = [{ name: '', url: data.icon }]
      ruleForm.backgroundUrl = [{ name: '', url: data.backgroundUrl }]
      ruleForm.experience = data.experience
      ruleForm.discountPercent = data.discountPercent
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
