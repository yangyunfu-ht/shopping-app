<template>
  <div
    style="height: 100%"
    v-loading="loading"
  >
    <page-layout>
      <template #search>
        <search-collapse
          :use-collapse="false"
          @query="getTableData"
        >
          <el-form label-width="100px">
            <el-row>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="商场名称">
                  <el-input
                    v-model.trim="searchForm.name"
                    clearable
                    placeholder="请输入商场名称"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="商场电话">
                  <el-input
                    v-model.trim="searchForm.phone"
                    clearable
                    placeholder="请输入商场电话"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="商场状态">
                  <el-select
                    v-model="searchForm.status"
                    clearable
                    placeholder="请选择商场状态"
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

    <shop-mall-drawer
      ref="shopMallRef"
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
import shopMallDrawer from './shopMallDrawer.vue'
import { useMessage } from '@/hooks/useMessage'
import { useMessageBox } from '@/hooks/useMessageBox'
import { useRequest } from '@/hooks/useRequest'
import { Api } from './api'
import logoCellRender from './logoCellRender'

defineOptions({
  name: 'shopMallList',
})

const messageBox = useMessageBox()
const { request, loading } = useRequest()

const searchForm = reactive({
  name: undefined,
  phone: undefined,
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
  getTableData()
}

const selectRow = ref<any[]>([])
const tableData = ref<any[]>([])
const getTableData = async () => {
  gridApi.value!.deselectAll()
  try {
    const { data, code, msg } = await request<{
      total: number
      list: Array<any>
    } | null>({
      url: Api.list,
      method: 'get',
      params: {
        pageNo: currentPage.value,
        pageSize: pageSize.value,
        ...searchForm,
      },
    })
    if (code === 0) {
      setTotal(data?.total ?? 0)
      tableData.value = data?.list ?? []
      gridApi.value!.setRowData(tableData.value)
    } else {
      setTotal(0)
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
const shopMallRef = ref<InstanceType<typeof shopMallDrawer> | null>()
const handleCreate = () => {
  shopMallRef.value!.openDrawer()
}

//修改
const handleChange = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要修改的商场信息数据',
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
  shopMallRef.value!.changeOpen(id)
}

const handleDelete = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要删除的商场信息数据',
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
      message: `确认删除商场名称为${name}的数据？`,
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
    headerName: '商场名称',
    field: 'name',
    colId: 'name',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '商场logo',
    field: 'logo',
    colId: 'logo',
    minWidth: 150,
    flex: 1,
    sortable: false,
    cellRenderer: logoCellRender,
  },
  {
    headerName: '商场电话',
    field: 'phone',
    colId: 'phone',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '商场简介',
    field: 'introduction',
    colId: 'introduction',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '详细地址',
    field: 'detailAddress',
    colId: 'detailAddress',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '营业开始时间',
    field: 'openingTime',
    colId: 'openingTime',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '营业结束时间',
    field: 'closingTime',
    colId: 'closingTime',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '经度',
    field: 'longitude',
    colId: 'longitude',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '纬度',
    field: 'latitude',
    colId: 'latitude',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '商场状态',
    field: 'status',
    colId: 'status',
    minWidth: 150,
    flex: 1,
    sortable: false,
    valueGetter: (params: ValueGetterParams) =>
      params.data.status === 0 ? '开启' : '关闭',
  },
])
</script>

<style lang="scss" scoped></style>
