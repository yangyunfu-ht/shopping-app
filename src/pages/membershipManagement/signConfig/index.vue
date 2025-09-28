<template>
  <div
    style="height: 100%"
    v-loading="loading"
  >
    <page-layout>
      <template #search> </template>

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
          :use-pagination="false"
          @grid-ready="onGridReady"
          @sort-change="getTableData"
        ></grid-table>
      </template>
    </page-layout>

    <config-drawer
      ref="configRef"
      @submit="getTableData"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  ColDef,
  ValueGetterParams,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community'
import { reactive, ref, shallowRef } from 'vue'
import configDrawer from './configDrawer.vue'
import { useMessage } from '@/hooks/useMessage'
import { useRequest } from '@/hooks/useRequest'
import { Api } from './api'
import { dayjs } from 'element-plus'
import { useMessageBox } from '@/hooks/useMessageBox'

defineOptions({
  name: 'signConfig',
})

const messageBox = useMessageBox()
const { request, loading } = useRequest()

const searchForm = reactive({
  name: '',
})

const gridApi = shallowRef<GridApi<any> | null>(null)
const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params!.api
  getTableData()
}

const selectRow = ref<any[]>([])
const tableData = ref<any[]>([])
const getTableData = async () => {
  gridApi.value!.deselectAll()
  try {
    const { data, code, msg } = await request({
      url: Api.list,
      method: 'get',
      params: {
        ...searchForm,
      },
    })
    if (code === 0) {
      tableData.value = data
      gridApi.value!.setRowData(tableData.value)
    } else {
      tableData.value = []
      gridApi.value!.setRowData(tableData.value)

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
const configRef = ref<InstanceType<typeof configDrawer> | null>()
const handleCreate = () => {
  configRef.value!.openDrawer()
}

//修改
const handleChange = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要修改的签到配置数据',
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
  configRef.value!.changeOpen(id)
}

const handleDelete = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要删除的签到配置数据',
      title: '提示',
      options: {
        showCancelButton: false,
        showConfirmButton: false,
        type: 'warning',
      },
    })
    return
  }
  const [{ day, id }] = selectRow.value
  messageBox
    .confirm({
      message: `确认删除签到天数为${day}的数据？`,
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
    headerName: '签到天数',
    field: 'day',
    colId: 'day',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '奖励积分',
    field: 'point',
    colId: 'point',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '奖励经验',
    field: 'experience',
    colId: 'experience',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '状态',
    field: 'status',
    colId: 'status',
    minWidth: 150,
    flex: 1,
    sortable: false,
    valueGetter: (params: ValueGetterParams) =>
      params.data.status === 0 ? '开启' : '关闭',
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
