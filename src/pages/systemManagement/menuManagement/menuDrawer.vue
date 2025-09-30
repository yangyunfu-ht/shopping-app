<template>
  <app-drawer
    v-model="visible"
    :title="title"
    @close="handleClose"
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
          label="菜单类型"
          prop="name"
        >
          <el-radio-group v-model="ruleForm.type">
            <el-radio-button
              label="目录"
              :value="1"
            />
            <el-radio-button
              label="菜单"
              :value="2"
            />
            <el-radio-button
              label="按钮"
              :value="3"
            />
          </el-radio-group>
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

        <!-- 目录 -->
        <template v-if="ruleForm.type === 1">
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
            label="菜单图标"
            prop="icon"
          >
            <icon-picker
              v-model="ruleForm.icon"
              placeholder="请选择菜单图标"
            />
          </el-form-item>

          <el-form-item
            label="路由地址"
            prop="path"
          >
            <el-input
              v-model.trim="ruleForm.path"
              placeholder="请输入路由地址"
            />
          </el-form-item>

          <el-form-item
            label="组件路径"
            prop="component"
          >
            <el-input
              v-model.trim="ruleForm.component"
              placeholder="请输入组件路径"
            />
          </el-form-item>

          <el-form-item
            label="组件名称"
            prop="componentName"
          >
            <el-input
              v-model.trim="ruleForm.componentName"
              placeholder="请输入组件路径"
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
            label="菜单显示"
            prop="visible"
          >
            <el-select
              v-model="ruleForm.visible"
              placeholder="请选择"
            >
              <el-option
                :value="true"
                label="显示"
              />
              <el-option
                :value="false"
                label="隐藏"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="菜单缓存"
            prop="keepAlive"
          >
            <el-select
              v-model="ruleForm.keepAlive"
              placeholder="请选择菜单缓存"
            >
              <el-option
                :value="true"
                label="缓存"
              />
              <el-option
                :value="false"
                label="不缓存"
              />
            </el-select>
          </el-form-item>
        </template>

        <!-- 菜单 -->
        <template v-if="ruleForm.type === 2">
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
            label="菜单图标"
            prop="icon"
          >
            <icon-picker
              v-model="ruleForm.icon"
              placeholder="请选择菜单图标"
            />
          </el-form-item>

          <el-form-item
            label="路由地址"
            prop="path"
          >
            <el-input
              v-model.trim="ruleForm.path"
              placeholder="请输入路由地址"
            />
          </el-form-item>

          <el-form-item
            label="组件路径"
            prop="component"
          >
            <el-input
              v-model.trim="ruleForm.component"
              placeholder="请输入组件路径"
            />
          </el-form-item>

          <el-form-item
            label="组件名称"
            prop="componentName"
          >
            <el-input
              v-model.trim="ruleForm.componentName"
              placeholder="请输入组件路径"
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
            label="菜单显示"
            prop="visible"
          >
            <el-select
              v-model="ruleForm.visible"
              placeholder="请选择"
            >
              <el-option
                :value="true"
                label="显示"
              />
              <el-option
                :value="false"
                label="隐藏"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="菜单缓存"
            prop="keepAlive"
          >
            <el-select
              v-model="ruleForm.keepAlive"
              placeholder="请选择菜单缓存"
            >
              <el-option
                :value="true"
                label="缓存"
              />
              <el-option
                :value="false"
                label="不缓存"
              />
            </el-select>
          </el-form-item>
        </template>

        <!-- 按钮 -->
        <template v-if="ruleForm.type === 3">
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
            label="权限标识"
            prop="permission"
          >
            <el-input
              v-model.trim="ruleForm.permission"
              placeholder="请输入权限标识"
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
        </template>
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
  type: 2, // 菜单类型
  name: '', //菜单名称
  parentId: null, //父菜单ID
  icon: '', // 菜单图标
  path: '', //路由地址
  component: '', // 组件路径
  componentName: '', // 组件名
  sort: 0, // 显示顺序
  status: 0, // 菜单状态
  visible: true, // 是否可见
  keepAlive: true, // 是否缓存
  permission: '', // 权限标识
  alwaysShow: true,
  id: null, //菜单ID
})

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: 'blur',
    },
  ],
})

const handleClose = () => {
  ruleForm.type = 2
  ruleForm.name = ''
  ruleForm.parentId = null
  ruleForm.icon = ''
  ruleForm.path = ''
  ruleForm.component = ''
  ruleForm.componentName = ''
  ruleForm.sort = 0
  ruleForm.status = 0
  ruleForm.visible = true
  ruleForm.keepAlive = true
  ruleForm.permission = ''
  ruleForm.alwaysShow = true
  ruleForm.id = null
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
      ruleForm.type = data.type
      ruleForm.name = data.name
      ruleForm.parentId = data.parentId === 0 ? null : data.parentId
      ruleForm.icon = data.icon
      ruleForm.path = data.path
      ruleForm.component = data.component
      ruleForm.componentName = data.componentName
      ruleForm.sort = data.sort
      ruleForm.status = data.status
      ruleForm.visible = data.visible
      ruleForm.keepAlive = data.keepAlive
      ruleForm.permission = data.permission
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
