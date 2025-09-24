<template>
  <div style="height: 100%">
    <page-layout v-loading="loading">
      <template #search>
        <search-collapse
          :use-collapse="false"
          @query="getTableData"
        >
          <el-form label-width="100px">
            <el-row>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="菜单名">
                  <el-input
                    v-model.trim="searchForm.name"
                    clearable
                    placeholder="请输入菜单名称"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </search-collapse>
      </template>

      <template #buttons>
        <el-button
          type="primary"
          @click="handleCreate"
          >新增</el-button
        >
        <el-button
          type="warning"
          @click="handleChange"
          >修改</el-button
        >
        <el-button
          type="danger"
          @click="handleDelete"
          >删除</el-button
        >
      </template>

      <template #table>
        <div style="height: 100%">
          <base-table
            :table-data="treeData"
            :columns="treeTableColumns"
            v-model:selection="selectRow"
            row-key="id"
            height="100%"
            max-height="100%"
            :reserve-selection="true"
            :tree-props="{
              children: 'children',
              hasChildren: 'hasChildren',
              checkStrictly: true,
            }"
          >
            <template #typeSlot="{ row }">
              {{ row.type === 1 ? '目录' : row.type === 2 ? '菜单' : '按钮' }}
            </template>
            <template #keepAliveSlot="{ row }">
              {{ row.keepAlive ? '是' : '否' }}
            </template>
            <template #visibleSlot="{ row }">
              {{ row.visible ? '是' : '否' }}
            </template>
          </base-table>
        </div>
      </template>
    </page-layout>

    <menu-drawer
      ref="menuRef"
      :menu-data="treeData"
      @submit="getTableData"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { wrapperColSmall } from '@/utils/layout'
import type { TableColumn } from '#/column'
import { useRequest } from '@/hooks/useRequest'
import { buildTree, type TreeNode } from '@/utils/array'
import { Api } from './api'
import { useMessage } from '@/hooks/useMessage'
import { useMessageBox } from '@/hooks/useMessageBox'
import menuDrawer from './menuDrawer.vue'

onMounted(() => {
  getTableData()
})

interface Department {
  id: number
  name: string
  manager: string
  children?: Department[]
}

const { request, loading } = useRequest()
const messageBox = useMessageBox()

const searchForm = reactive({
  name: '',
})

const selectRow = ref<Department[]>([])
const treeData = ref<TreeNode[]>([])

const getTableData = async () => {
  try {
    const { code, data, msg } = await request({
      url: Api.list,
      method: 'get',
      params: {
        pageNo: 1,
        pageSize: 1000,
        ...searchForm,
      },
    })
    if (code === 0) {
      treeData.value = buildTree(data ?? [], 'id', 'parentId')
    } else {
      useMessage({
        message: msg,
        type: 'error',
      })
    }
  } catch (err: any) {
    useMessage({
      message: err.message,
      type: 'error',
    })
  }
}

const menuRef = ref<InstanceType<typeof menuDrawer>>()
const handleCreate = () => {
  menuRef.value!.openDrawer()
}

//修改
const handleChange = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要修改的用户信息数据',
      title: '提示',
      options: {
        showCancelButton: false,
        showConfirmButton: false,
        type: 'warning',
      },
    })
    return
  }
  const [{ id }] = selectRow.value
  menuRef.value!.changeOpen(id)
}

const handleDelete = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要删除的用户信息数据',
      title: '提示',
      options: {
        showCancelButton: false,
        showConfirmButton: false,
        type: 'warning',
      },
    })
    return
  }
  const [{ name, id }] = selectRow.value
  messageBox
    .confirm({
      message: `确认删除用户名称为${name}的数据？`,
      title: '提示',
      options: {
        type: 'warning',
      },
    })
    .then(async () => {
      try {
        const { code, msg } = await request({
          url: Api.delete,
          method: 'delete',
          params: {
            id,
          },
          headers: {
            Accept: 'application/json, text/plain, */*',
          },
        })
        if (code === 0) {
          useMessage({
            message: msg,
            type: 'success',
          })
          getTableData()
        } else {
          useMessage({
            message: msg,
            type: 'error',
          })
        }
      } catch (err: any) {
        useMessage({
          message: err.message,
          type: 'error',
        })
      }
    })
}

const treeTableColumns: TableColumn[] = [
  {
    colId: 'index',
    field: 'index',
    type: 'index',
    headerName: '序号',
    align: 'center',
  },
  {
    colId: 'selection',
    field: 'selection',
    type: 'selection',
    headerName: '',
  },
  {
    colId: 'name',
    field: 'name',
    headerName: '菜单名称',
    minWidth: 100,
  },
  {
    colId: 'type',
    field: 'type',
    headerName: '菜单类型',
    minWidth: 100,
    slot: 'typeSlot',
  },
  {
    colId: 'sort',
    field: 'sort',
    headerName: '排序值',
    minWidth: 100,
  },
  {
    colId: 'icon',
    field: 'icon',
    headerName: '菜单图标',
    minWidth: 100,
  },
  {
    colId: 'path',
    field: 'path',
    headerName: '菜单路径',
    minWidth: 100,
  },
  {
    colId: 'component',
    field: 'component',
    headerName: '组件路径',
    minWidth: 100,
  },
  {
    colId: 'componentName',
    field: 'componentName',
    headerName: '组件名称',
    minWidth: 100,
  },
  {
    colId: 'keepAlive',
    field: 'keepAlive',
    headerName: '菜单缓存',
    minWidth: 100,
    slot: 'keepAliveSlot',
  },
  {
    colId: 'visible',
    field: 'visible',
    headerName: '菜单显示',
    minWidth: 100,
    slot: 'visibleSlot',
  },
]
</script>

<style lang="scss" scoped></style>
