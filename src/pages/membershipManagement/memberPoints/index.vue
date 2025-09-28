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
                <el-form-item label="会员名称">
                  <el-input
                    v-model.trim="searchForm.nickname"
                    clearable
                    placeholder="请输入会员名称"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="积分标题">
                  <el-input
                    v-model.trim="searchForm.title"
                    clearable
                    placeholder="请输入积分标题"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="业务类型">
                  <el-select
                    v-model="searchForm.bizType"
                    clearable
                    placeholder="请选择业务类型"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </search-collapse>
      </template>

      <template #buttons> </template>

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
import { useMessage } from '@/hooks/useMessage'
import { useRequest } from '@/hooks/useRequest'
import { Api } from './api'
import { dayjs } from 'element-plus'
import pointCellRender from './pointCellRender'

defineOptions({
  name: 'memberPoints',
})

const { request, loading } = useRequest()

const searchForm = reactive({
  nickname: '',
  title: '',
  bizType: null,
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
      tableData.value = data?.list ?? []
      gridApi.value!.setRowData(tableData.value)
      setTotal(data?.total ?? 0)
    } else {
      tableData.value = []
      gridApi.value!.setRowData(tableData.value)
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
    headerName: '会员名称',
    field: 'nickname',
    colId: 'nickname',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '总积分',
    field: 'totalPoint',
    colId: 'totalPoint',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '获得积分',
    field: 'point',
    colId: 'point',
    minWidth: 150,
    flex: 1,
    sortable: false,
    cellRenderer: pointCellRender,
  },
  {
    headerName: '获得时间',
    field: 'createTime',
    colId: 'createTime',
    minWidth: 150,
    flex: 1,
    sortable: false,
    valueGetter: (params: ValueGetterParams) =>
      dayjs(params.data.createTime).format('YYYY-MM-DD HH:MM:ss'),
  },
  {
    headerName: '业务类型',
    field: 'bizType',
    colId: 'bizType',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '业务编码',
    field: 'bizId',
    colId: 'bizId',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '积分标题',
    field: 'title',
    colId: 'title',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '描述',
    field: 'description',
    colId: 'description',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
])
</script>

<style lang="scss" scoped></style>
