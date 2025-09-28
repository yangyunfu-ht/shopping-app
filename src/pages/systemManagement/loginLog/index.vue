<template>
  <page-layout v-loading="loading">
    <template #search>
      <search-collapse
        :use-collapse="false"
        @query="getTableData"
      >
        <el-form label-width="100px">
          <el-row>
            <el-col v-bind="wrapperColSmall">
              <el-form-item label="用户名">
                <el-input
                  v-model="searchForm.username"
                  placeholder="请输入用户名"
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col v-bind="wrapperColLarge">
              <el-form-item label="登录时间">
                <el-date-picker
                  v-model="searchForm.createTime"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  date-format="YYYY-MM-DD"
                  time-format="HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </search-collapse>
    </template>

    <template #buttons>
      <el-button
        type="success"
        @click="handleExport"
        >导出</el-button
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
import { wrapperColSmall, wrapperColLarge } from '@/utils/layout'
import { useMessage } from '@/hooks/useMessage'
import { useRequest } from '@/hooks/useRequest'
import { Api } from './api'
import { dayjs } from 'element-plus'
import { downloadFile } from '@/utils/file'

defineOptions({
  name: 'loginLog',
})

const { request, loading } = useRequest()

const searchForm = reactive({
  username: '',
  createTime: [],
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
  try {
    const { data, code, msg } = await request<{
      total: number
      list: Array<any>
    } | null>({
      url: Api.list,
      method: 'get',
      params: {
        ...searchForm,
        pageNo: currentPage.value,
        pageSize: pageSize.value,
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
    console.log(err)
    useMessage({
      message: err.message,
      type: 'error',
    })
  }
}

const handleExport = () => {
  downloadFile(
    {
      url: Api.export,
      method: 'get',
      params: {
        ...searchForm,
        pageNo: currentPage.value,
        pageSize: pageSize.value,
      },
    },
    '登录日志.xlsx'
  )
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
    headerName: '用户名',
    field: 'username',
    colId: 'username',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '登录IP',
    field: 'userIp',
    colId: 'userIp',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '登录时间',
    field: 'createTime',
    colId: 'createTime',
    minWidth: 150,
    flex: 1,
    sortable: false,
    valueGetter: (params: ValueGetterParams) =>
      dayjs(params.data.createTime).format('YYYY-MM-DD HH:MM:ss'),
  },
  {
    headerName: '浏览器',
    field: 'userAgent',
    colId: 'userAgent',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '日志编号',
    field: 'id',
    colId: 'id',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '登录结果',
    field: 'result',
    colId: 'result',
    minWidth: 150,
    flex: 1,
    sortable: false,
    valueGetter: (params: ValueGetterParams) =>
      params.data.result === 0 ? '成功' : '失败',
  },
  {
    headerName: '登录类型',
    field: 'logType',
    colId: 'logType',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
])
</script>

<style lang="scss" scoped></style>
