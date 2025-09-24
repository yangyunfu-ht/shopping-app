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
          label="上级菜单"
          prop="parentId"
        >
          <el-tree-select
            v-model="ruleForm.parentId"
            :data="menuData"
            check-strictly
            node-key="id"
            :render-after-expand="false"
            :props="{
              label: 'name',
              children: 'children',
            }"
            filterable
            clearable
            style="width: 100%"
            placeholder="请选择上级菜单"
          />
        </el-form-item>
        <el-form-item
          label="菜单名称"
          prop="name"
        >
          <el-input
            v-model.trim="ruleForm.name"
            placeholder="请输入菜单名称"
          />
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="phone"
        >
          <el-input
            v-model.trim="ruleForm.phone"
            placeholder="请输入联系电话"
          />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model.trim="ruleForm.email"
            placeholder="请输入邮箱"
          />
        </el-form-item>
        <el-form-item
          label="排序"
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
          label="菜单状态"
          prop="status"
        >
          <el-select
            v-model="ruleForm.status"
            placeholder="请选择菜单状态"
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
import { validPhone } from '@/utils/validator'
import type { TreeNode } from '@/utils/array'

const props = defineProps({
  menuData: {
    type: Array as PropType<TreeNode[]>,
    default: () => [],
  },
})

const { menuData } = toRefs(props)

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
  phone: '',
  email: '',
  sort: 0,
  status: 0,
  id: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: 'blur',
    },
  ],
  phone: [
    {
      required: true,
      validator: (_rule: any, value: string, callback: any) => {
        if (validPhone(value)) {
          callback()
        } else {
          callback(new Error('请输入联系电话'))
        }
      },
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
  title.value = '新增菜单'
  visible.value = true
}

const changeOpen = async (id: any) => {
  if (!id) return
  ruleForm.id = id
  title.value = '修改菜单'
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
      ruleForm.parentId = data.parentId
      ruleForm.name = data.name
      ruleForm.phone = data.phone
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
