<template>
  <page-layout>
    <template #search>
      <search-collapse>
        <el-form label-width="100px">
          <el-row>
            <el-col v-bind="wrapperColSmall">
              <el-form-item label="查询条件">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col v-bind="wrapperColSmall">
              <el-form-item label="查询条件">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col v-bind="wrapperColLarge">
              <el-form-item label="查询条件">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col v-bind="wrapperColSmall">
              <el-form-item label="查询条件">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col v-bind="wrapperColSmall">
              <el-form-item label="查询条件">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col v-bind="wrapperColLarge">
              <el-form-item label="查询条件">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col v-bind="wrapperColSmall">
              <el-form-item label="查询条件">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col v-bind="wrapperColSmall">
              <el-form-item label="查询条件">
                <el-input></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>

        <template #collapse>
          <el-form label-width="100px">
            <el-row>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="查询条件">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="查询条件">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="查询条件">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="查询条件">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="查询条件">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="查询条件">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="查询条件">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col v-bind="wrapperColSmall">
                <el-form-item label="查询条件">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </search-collapse>
    </template>

    <template #buttons>
      <el-button type="primary">新增</el-button>
      <el-button type="warning">修改</el-button>
      <el-button type="danger">删除</el-button>
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
import { ref, shallowRef } from 'vue'
import { wrapperColSmall, wrapperColLarge } from '@/utils/layout'

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
  setTotal(1000)
  gridApi.value!.setFilterModel(null)
  gridApi.value!.deselectAll()

  gridApi.value!.setRowData(tableData.value)
}

const columnDefs = ref<ColDef[]>([
  {
    headerName: '序号',
    field: 'rowIndex',
    colId: 'rowIndex',
    filter: false,
    width: 60,
    pinned: 'left',
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
    pinned: 'left',
    filter: false,
  },
  {
    headerName: '通知编号',
    field: 'no',
    colId: 'no',
    width: 150,
    sortable: false,
  },
  {
    headerName: '运单号',
    field: 'orderNo',
    colId: 'orderNo',
    width: 150,
    sortable: false,
  },
  {
    headerName: '通知状态',
    field: 'statusText',
    colId: 'statusText',
    width: 150,
    sortable: false,
  },
  {
    headerName: '通知金额(元)',
    field: 'penaltyAmount',
    colId: 'penaltyAmount',
    width: 150,
  },
  {
    headerName: '通知部门',
    field: 'penaltyNetworkName',
    colId: 'penaltyNetworkName',
    width: 150,
    sortable: false,
  },
  {
    headerName: '通知时间',
    field: 'createDate',
    colId: 'createDate',
    width: 150,
    sortable: false,
  },
  {
    headerName: '通知原因',
    field: 'penaltyReason',
    colId: 'penaltyReason',
    flex: 1,
    minWidth: 150,
  },
  {
    headerName: '业务类型',
    field: 'penaltyTypeName',
    colId: 'penaltyTypeName',
    width: 150,
    sortable: false,
  },
  {
    headerName: '责任类型',
    field: 'dutyTypeText',
    colId: 'dutyTypeText',
    width: 150,
    sortable: false,
  },
  {
    headerName: '理赔方式',
    field: 'claimWayText',
    colId: 'claimWayText',
    width: 150,
    sortable: false,
  },
  {
    headerName: '缴款截止时间',
    field: 'deadline',
    colId: 'deadline',
    width: 150,
    sortable: false,
  },
  {
    headerName: '缴款时间',
    field: 'payDate',
    colId: 'payDate',
    width: 150,
    sortable: false,
  },
  {
    headerName: '缴款部门',
    field: 'deductNetworkName',
    colId: 'deductNetworkName',
    width: 150,
    sortable: false,
  },
  {
    headerName: '支付单号',
    field: 'payNo',
    colId: 'payNo',
    width: 200,
    sortable: false,
  },
  {
    headerName: '支付方式',
    field: 'payMethodText',
    colId: 'payMethodText',
    width: 150,
    sortable: false,
  },
  {
    headerName: '支付备注',
    field: 'payNo',
    colId: 'payNo',
    width: 150,
    sortable: false,
  },
  {
    headerName: '退款备注',
    field: 'refundRemark',
    colId: 'refundRemark',
    width: 150,
    sortable: false,
  },
  {
    headerName: '退款时间',
    field: 'refundTime',
    colId: 'refundTime',
    width: 150,
    sortable: false,
  },
])
</script>

<style lang="scss" scoped></style>
