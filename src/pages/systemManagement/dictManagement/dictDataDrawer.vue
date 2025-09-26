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
          label="数据标签"
          prop="label"
        >
          <el-input
            v-model.trim="ruleForm.label"
            placeholder="请输入字典名称"
          />
        </el-form-item>

        <el-form-item
          label="数据值"
          prop="value"
        >
          <el-input
            v-model.trim="ruleForm.value"
            placeholder="请输入数据值"
          />
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

        <el-form-item
          label="颜色类型"
          prop="colorType"
        >
          <el-select
            v-model="ruleForm.colorType"
            placeholder="请选择颜色类型"
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
          label="css class"
          prop="type"
        >
          <el-input
            v-model.trim="ruleForm.cssClass"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model.trim="ruleForm.remark"
            type="textarea"
            :rows="3"
            show-word-limit
            :maxlength="50"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
    </div>
  </app-drawer>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref, toRefs } from 'vue'
import { useRequest } from '@/hooks/useRequest'
import { DictApi } from './api'
import { useMessage } from '@/hooks/useMessage'

const props = defineProps({
  dictType: {
    type: String,
    default: '',
  },
})

const { dictType } = toRefs(props)

const { request, loading } = useRequest()

const visible = ref(false)
const title = ref('')

const emits = defineEmits<{
  submit: []
}>()

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  label: '',
  value: '',
  sort: 0,
  status: 0,
  colorType: null,
  cssClass: '',
  remark: '',
  id: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  label: [
    {
      required: true,
      message: '请输入数据标签',
      trigger: 'blur',
    },
  ],
  value: [
    {
      required: true,
      message: '请输入数据值',
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
          url: ruleForm.id ? DictApi.change : DictApi.create,
          method: ruleForm.id ? 'put' : 'post',
          data: {
            ...ruleForm,
            dictType: dictType.value,
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
  title.value = '新增字典数据'
  visible.value = true
}

const changeOpen = async (id: string) => {
  if (!id) return
  ruleForm.id = id
  title.value = '修改字典数据'
  visible.value = true
  try {
    const { data, code, msg } = await request({
      url: DictApi.detail,
      method: 'get',
      params: {
        id,
      },
    })
    if (code === 0) {
      ruleForm.label = data.label
      ruleForm.value = data.value
      ruleForm.sort = data.sort
      ruleForm.status = data.status
      ruleForm.colorType = data.colorType
      ruleForm.cssClass = data.cssClass
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
