<template>
  <app-drawer
    v-model="visible"
    title="分配数据权限"
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
        <el-form-item label="数据权限">
          <el-checkbox-group
            v-model="ruleForm.marketIds"
            style="display: flex; flex-direction: column"
          >
            <el-checkbox
              v-for="shop in shopMallData"
              :key="shop.id"
              :label="shop.name"
              :value="shop.id"
            >
              {{ shop.name }}
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
})

const { treeData } = toRefs(props)

const emits = defineEmits<{
  (e: 'submit'): void
}>()

const shopMallData = ref<{ id: number; name: string }[]>([])
const visible = ref(false)

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  username: '',
  userId: null,
  deptId: null,
  marketIds: [],
})

const rules = reactive<FormRules<typeof ruleForm>>({
  marketIds: [
    {
      type: 'array',
      required: true,
      message: '请选择数据权限',
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
          url: Api.dataAssignment,
          method: 'post',
          data: {
            userId: ruleForm.userId,
            marketIds: ruleForm.marketIds,
          },
        })
        if (code === 0) {
          useMessage({
            type: 'success',
            message: msg,
          })
          emits('submit')
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

const openDrawer = async (
  username: string,
  userId: any,
  deptId: any,
  dataAssignment = []
) => {
  visible.value = true
  console.log(dataAssignment)
  ruleForm.username = username
  ruleForm.userId = userId
  ruleForm.deptId = deptId
  try {
    const { data, code, msg } = await request({
      url: Api.marketList,
      method: 'get',
    })
    if (code === 0) {
      shopMallData.value = data
      ruleForm.marketIds = dataAssignment
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
