<template>
  <app-drawer
    v-model="visible"
    title="分配角色"
    @close="handleClose(ruleFormRef)"
    @confirm="handleConfirm(ruleFormRef)"
  >
    <div
      style="height: 100%"
      v-loading="loading"
    >
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        :model="ruleForm"
        label-width="90px"
      >
        <el-form-item label="用户名称">
          <el-input
            v-model="ruleForm.username"
            disabled
          />
        </el-form-item>
        <el-form-item label="归属部门">
          <el-tree-select
            v-model="ruleForm.deptId"
            :data="treeData"
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
            placeholder="请选择上级部门"
            disabled
          />
        </el-form-item>
        <el-form-item label="用户角色">
          <el-checkbox-group
            v-model="ruleForm.roleIds"
            style="display: flex; flex-direction: column"
          >
            <el-checkbox
              v-for="role in roleData"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            >
              {{ role.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
  </app-drawer>
</template>

<script setup lang="ts">
import { useRequest } from '@/hooks/useRequest'
import type { TreeNode } from '@/utils/array'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref, toRefs, type PropType } from 'vue'
import { Api } from './api'
import { useMessage } from '@/hooks/useMessage'

const { request, loading } = useRequest()

const props = defineProps({
  treeData: {
    type: Array as PropType<TreeNode[]>,
    default: () => [],
  },
  roleData: {
    type: Array as PropType<{ id: number; name: string }[]>,
    default: () => [],
  },
})

const { treeData, roleData } = toRefs(props)

const visible = ref(false)

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  username: '',
  userId: null,
  deptId: null,
  roleIds: [],
})

const rules = reactive<FormRules<typeof ruleForm>>({
  roleIds: [
    {
      type: 'array',
      required: true,
      message: '请选择用户角色',
      trigger: 'change',
    },
  ],
})

const handleClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        const { code, msg } = await request({
          url: Api.assignRoles,
          method: 'post',
          data: {
            userId: ruleForm.userId,
            roleIds: ruleForm.roleIds,
          },
        })
        if (code === 0) {
          useMessage({
            type: 'success',
            message: msg,
          })
          visible.value = false
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

const openDrawer = async (username: string, userId: any, deptId: any) => {
  visible.value = true
  ruleForm.username = username
  ruleForm.userId = userId
  ruleForm.deptId = deptId
  try {
    const { data, code, msg } = await request({
      url: Api.queryUserRoles,
      method: 'get',
      params: {
        userId,
      },
    })
    if (code === 0) {
      ruleForm.roleIds = data
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
})
</script>

<style lang="scss" scoped></style>
