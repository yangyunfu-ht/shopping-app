<template>
  <div class="page">
    <div class="page-menu__tree">
      <branch-tree />
    </div>

    <div class="page-menu__table">
      <page-layout v-loading="loading">
        <template #search>
          <search-collapse @query="getTableData">
            <el-form label-width="100px">
              <el-row>
                <el-col v-bind="wrapperColSmall">
                  <el-form-item label="查询条件">
                    <el-input v-model="searchForm.value"></el-input>
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
          <el-button
            type="danger"
            @click="handleOpen"
            >打开modal</el-button
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

      <product-drawer ref="productRef" />

      <product-modal ref="modalRef" />
    </div>
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
import { h, reactive, ref, shallowRef } from 'vue'
import { wrapperColSmall, wrapperColLarge } from '@/utils/layout'
import branchTree from './branchTree.vue'
import productDrawer from './productDrawer.vue'
import productModal from './productModal.vue'
import { useMessage } from '@/hooks/useMessage'
import { useMessageBox } from '@/hooks/useMessageBox'
import { useRequest } from '@/hooks/useRequest'

defineOptions({
  name: 'dataPage',
})

const messageBox = useMessageBox()
const { request, loading } = useRequest()

const searchForm = reactive({
  value: '',
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
    const response = await request({
      url: '111',
      method: 'post',
      data: {
        name: 'yyf',
      },
    })
    console.log(response)
    setTotal(1000)
    gridApi.value!.setFilterModel(null)
    gridApi.value!.deselectAll()

    gridApi.value!.setRowData(tableData.value)
  } catch (err: any) {
    console.log(err)
    useMessage({
      message: err.message,
      type: 'error',
    })
  }
}

const productRef = ref<InstanceType<typeof productDrawer> | null>(null)
const handleCreate = () => {
  productRef.value!.openDrawer()
}

const handleChange = () => {
  messageBox
    .confirm({
      message: h('p', '这是一个拍标签'),
      title: '提示',
      options: {},
    })
    .then(() => {
      console.log('确定')
    })
    .catch(() => {
      console.log('取消')
    })
    .finally(() => {
      console.log('关闭')
    })
}

const handleDelete = () => {
  useMessage({
    type: 'error',
    message: '这是一个搓搓',
  })
}

const modalRef = ref<InstanceType<typeof productModal> | null>(null)
const handleOpen = () => {
  modalRef.value!.openModal()
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
    headerName: '通知编号',
    field: 'no',
    colId: 'no',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '运单号',
    field: 'orderNo',
    colId: 'orderNo',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '通知状态',
    field: 'statusText',
    colId: 'statusText',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '通知金额(元)',
    field: 'penaltyAmount',
    colId: 'penaltyAmount',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '通知部门',
    field: 'penaltyNetworkName',
    colId: 'penaltyNetworkName',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '通知时间',
    field: 'createDate',
    colId: 'createDate',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '通知原因',
    field: 'penaltyReason',
    colId: 'penaltyReason',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '业务类型',
    field: 'penaltyTypeName',
    colId: 'penaltyTypeName',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '责任类型',
    field: 'dutyTypeText',
    colId: 'dutyTypeText',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '理赔方式',
    field: 'claimWayText',
    colId: 'claimWayText',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '缴款截止时间',
    field: 'deadline',
    colId: 'deadline',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '缴款时间',
    field: 'payDate',
    colId: 'payDate',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
])
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 1fr;
  column-gap: 8px;

  .page-menu__tree {
    height: 100%;
    padding: 8px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
  }

  .page-menu__table {
    height: 100%;
    background-color: #fff;
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
  }
}
</style>
