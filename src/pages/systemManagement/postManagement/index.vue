<template>
  <div
    style="height: 100%"
    v-loading="loading"
  >
    <page-layout>
      <template #search>
        <search-collapse @query="getTableData">
          <el-form label-width="100px">
            <el-row>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="岗位名称">
                  <el-input
                    v-model.trim="searchForm.name"
                    clearable
                    placeholder="请输入岗位名称"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="岗位编码">
                  <el-input
                    v-model.trim="searchForm.code"
                    clearable
                    placeholder="请输入岗位编码"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="岗位状态">
                  <el-select
                    v-model="searchForm.status"
                    clearable
                    placeholder="请选择岗位状态"
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
        <grid-table
          :row-data="tableData"
          :columnDefs="columnDefs"
          v-model:selection="selectRow"
          v-model:page="currentPage"
          v-model:sizes="pageSize"
          :pageSizes="pageSizes"
          :total="total"
          @grid-ready="onGridReady"
          @current-change="changeCurrent"
          @size-change="changePageSize"
          @sort-change="getTableData"
        ></grid-table>
      </template>
    </page-layout>

    <post-drawer
      ref="postRef"
      @submit="getTableData"
    />
  </div>
</template>

<script setup lang="ts">
import { usePagination } from '@/hooks/usePagination'
import type {
  ColDef,
  ValueGetterParams,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community'
import { reactive, ref, shallowRef } from 'vue'
import { wrapperColSmall } from '@/utils/layout'
import postDrawer from './postDrawer.vue'
import { useMessage } from '@/hooks/useMessage'
import { useMessageBox } from '@/hooks/useMessageBox'
import { useRequest } from '@/hooks/useRequest'
import { Api } from './api'
import { dayjs } from 'element-plus'

defineOptions({
  name: 'postManagement',
})

const messageBox = useMessageBox()
const { request, loading } = useRequest()

const searchForm = reactive({
  name: '',
  code: '',
  status: null,
})

const {
  currentPage,
  pageSize,
  pageSizes,
  total,
  setTotal,
  changeCurrent,
  changePageSize,
} = usePagination({ callback: () => getTableData() })

const gridApi = shallowRef<GridApi<any> | null>(null)
const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params!.api
}

const selectRow = ref([])
const tableData = ref([])
const getTableData = async () => {
  try {
    const {
      data: { total = 0, list = [] },
      code,
      msg,
    } = await request<{
      total: number
      list: Array<any>
    }>({
      url: Api.list,
      method: 'get',
      params: {
        pageNo: currentPage.value,
        pageSize: pageSize.value,
        ...searchForm,
      },
    })
    if (code === 0) {
      gridApi.value!.setRowData(list)
      setTotal(total)
    } else {
      gridApi.value!.setRowData([])
      setTotal(0)
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

//新增
const postRef = ref<InstanceType<typeof postDrawer> | null>()
const handleCreate = () => {
  postRef.value!.openDrawer()
}

//修改
const handleChange = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要修改的岗位信息数据',
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
  postRef.value!.changeOpen(id)
}

const handleDelete = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要删除的岗位信息数据',
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
      message: `确认删除岗位名称为${name}的数据？`,
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

const columnDefs = ref<ColDef[]>([
  {
    headerName: '序号',
    field: 'rowIndex',
    colId: 'rowIndex',
    filter: false,
    width: 60,
    cellClass: 'ag-grid__rowIndexCell',
    headerClass: 'ag-grid__rowIndexCell',
    resizable: false,
    sortable: false,
    suppressNavigable: false,
    valueGetter: (params: ValueGetterParams) => {
      if (params.node!.rowPinned === 'bottom') {
        return '合计'
      } else {
        return (params.node!.rowIndex as number) + 1
      }
    },
  },
  {
    headerName: '',
    field: 'rowSelection',
    colId: 'rowSelection',
    cellClass: 'ag-grid__rowSelectionCell',
    headerClass: 'ag-grid__rowSelectionCell',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionCurrentPageOnly: true,
    headerCheckboxSelectionFilteredOnly: true,
    suppressNavigable: false,
    width: 30,
    filter: false,
  },
  {
    headerName: '岗位名称',
    field: 'name',
    colId: 'name',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '岗位编码',
    field: 'code',
    colId: 'code',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '岗位顺序',
    field: 'sort',
    colId: 'sort',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '岗位状态',
    field: 'status',
    colId: 'status',
    minWidth: 150,
    flex: 1,
    sortable: false,
    valueGetter: (params: ValueGetterParams) =>
      params.data.status === 0 ? '开启' : '关闭',
  },
  {
    headerName: '岗位备注',
    field: 'remark',
    colId: 'remark',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '创建时间',
    field: 'createTime',
    colId: 'createTime',
    minWidth: 150,
    flex: 1,
    sortable: false,
    valueGetter: (params: ValueGetterParams) =>
      dayjs(params.data.createTime).format('YYYY-MM-DD HH:MM:ss'),
  },
])
</script>

<style lang="scss" scoped></style>
