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
                <el-form-item label="分类名称">
                  <el-input
                    v-model.trim="searchForm.name"
                    placeholder="请输入分类名称"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="分类状态">
                  <el-select
                    v-model="searchForm.status"
                    placeholder="请选择分类状态"
                    clearable
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
            :columns="columnDefs"
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
            <template #picUrlSlot="{ row }">
              <el-image
                style="width: 40px; height: 40px; cursor: pointer"
                :src="row.picUrl"
                fit="fill"
                @click="handleOnPreview(row.picUrl)"
              />
            </template>
            <template #statusSlot="{ row }">
              <span>
                {{ row.status === 0 ? '开启' : '关闭' }}
              </span>
            </template>
            <template #createTimeSlot="{ row }">
              <span>
                {{ dayjs(row.createTime).format('YYYY-MM-DD HH:MM:ss') }}
              </span>
            </template>
          </base-table>
        </div>
      </template>
    </page-layout>

    <categories-drawer
      ref="categoriesRef"
      :parent-category="parentCategory"
      @submit="getTableData"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { wrapperColSmall } from '@/utils/layout'
import categoriesDrawer from './categoriesDrawer.vue'
import { useMessage } from '@/hooks/useMessage'
import { useMessageBox } from '@/hooks/useMessageBox'
import { useRequest } from '@/hooks/useRequest'
import type { TableColumn } from '#/column'
import { Api } from './api'
import { dayjs } from 'element-plus'
import { buildTree, type TreeNode } from '@/utils/array'
import { useImageViewer } from '@/hooks/useImageViewer'

defineOptions({
  name: 'productCategories',
})

onMounted(() => {
  getTableData()
})

const messageBox = useMessageBox()
const { request, loading } = useRequest()

const searchForm = reactive({
  name: '',
  status: null,
})

const parentCategory = ref([])
const selectRow = ref([])
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
      parentCategory.value = (data ?? []).filter((el: any) => el.parentId === 0)
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

const categoriesRef = ref<InstanceType<typeof categoriesDrawer> | null>(null)
const handleCreate = () => {
  categoriesRef.value!.openDrawer()
}

//修改
const handleChange = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要修改的商品分类数据',
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
  categoriesRef.value!.changeOpen(id)
}

const handleDelete = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要删除的商品分类数据',
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
      message: `确认删除商品分类名称为${name}的数据？`,
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

const handleOnPreview = (url: string) => {
  useImageViewer({
    urlList: [url],
    initialIndex: 0,
    zIndex: 99999,
  })
}

const columnDefs = ref<TableColumn[]>([
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
    headerName: '分类名称',
    minWidth: 100,
    align: 'center',
  },
  {
    colId: 'phone',
    field: 'phone',
    headerName: '分类图片',
    minWidth: 100,
    align: 'center',
    slot: 'picUrlSlot',
  },
  {
    colId: 'sort',
    field: 'sort',
    headerName: '排序值',
    minWidth: 100,
    align: 'center',
  },
  {
    colId: 'status',
    field: 'status',
    headerName: '分类状态',
    minWidth: 100,
    align: 'center',
    slot: 'statusSlot',
  },
  {
    colId: 'createTime',
    field: 'createTime',
    headerName: '创建时间',
    minWidth: 100,
    align: 'center',
    slot: 'createTimeSlot',
  },
])
</script>

<style lang="scss" scoped></style>
