<template>
  <div
    class="attribute-page"
    v-loading="loading"
  >
    <!-- 商品参数 -->
    <div class="attribute-page__left">
      <page-layout>
        <template #search>
          <search-collapse
            :use-collapse="false"
            @query="getTableData"
          >
            <el-form label-width="100px">
              <el-row>
                <el-col v-bind="wrapperColLarge">
                  <el-form-item label="参数名称">
                    <el-input
                      v-model.trim="searchForm.name"
                      clearable
                      placeholder="请输入参数名称"
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

      <attribute-drawer
        ref="attributeRef"
        @submit="getTableData"
      />
    </div>

    <!-- 商品参数值 -->
    <div class="attribute-page__right">
      <page-layout>
        <template #search>
          <search-collapse
            :use-collapse="false"
            @query="getRightTableData"
          >
            <el-form label-width="100px">
              <el-row>
                <el-col v-bind="wrapperColLarge">
                  <el-form-item label="参数值名称">
                    <el-input
                      v-model.trim="rightSearchForm.name"
                      clearable
                      placeholder="请输入参数名称"
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
            @click="handleCreateRight"
            >新增</el-button
          >
          <el-button
            type="warning"
            @click="handleChangeRight"
            >修改</el-button
          >
          <el-button
            type="danger"
            @click="handleDeleteRight"
            >删除</el-button
          >
        </template>

        <template #table>
          <grid-table
            :row-data="rightTableData"
            :columnDefs="rightColumnDefs"
            v-model:selection="rightSelectRow"
            v-model:page="rightCurrentPage"
            v-model:sizes="rightPageSize"
            :pageSizes="rightPageSizes"
            :total="rightTotal"
            @grid-ready="onRightGridReady"
            @current-change="rightChangeCurrent"
            @size-change="rightChangePageSize"
            @sort-change="getRightTableData"
          ></grid-table>
        </template>
      </page-layout>

      <attribute-value-drawer
        ref="attributeValueRef"
        :property-id="rightSearchForm.propertyId"
        @submit="getRightTableData"
      />
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
import { onMounted, reactive, ref, shallowRef, watch } from 'vue'
import { wrapperColLarge } from '@/utils/layout'
import attributeDrawer from './attributeDrawer.vue'
import attributeValueDrawer from './attributeValueDrawer.vue'
import { useMessage } from '@/hooks/useMessage'
import { useMessageBox } from '@/hooks/useMessageBox'
import { useRequest } from '@/hooks/useRequest'
import { Api, ApiValue } from './api'
import { dayjs } from 'element-plus'

defineOptions({
  name: 'productParameters',
})

onMounted(() => {
  getTableData()
})

const messageBox = useMessageBox()
const { request, loading } = useRequest()

const searchForm = reactive({
  name: '',
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
      gridApi.value!.setRowData(data?.list ?? [])
      setTotal(data?.total ?? 0)
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
const attributeRef = ref<InstanceType<typeof attributeDrawer> | null>()
const handleCreate = () => {
  attributeRef.value!.openDrawer()
}

//修改
const handleChange = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要修改的参数信息数据',
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
  attributeRef.value!.changeOpen(id)
}

const handleDelete = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要删除的参数信息数据',
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
      message: `确认删除参数名称为${name}的数据？`,
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
    headerName: '参数名称',
    field: 'name',
    colId: 'name',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '参数编号',
    field: 'id',
    colId: 'id',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '参数备注',
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

// 参数值

const rightSearchForm = reactive({
  name: '',
  propertyId: null,
})

const {
  currentPage: rightCurrentPage,
  pageSize: rightPageSize,
  pageSizes: rightPageSizes,
  total: rightTotal,
  setTotal: rightSetTotal,
  changeCurrent: rightChangeCurrent,
  changePageSize: rightChangePageSize,
} = usePagination({ callback: () => getRightTableData() })

const rightGridApi = shallowRef<GridApi<any> | null>(null)
const onRightGridReady = (params: GridReadyEvent) => {
  rightGridApi.value = params!.api
}

const rightSelectRow = ref<any>([])
const rightTableData = ref<any>([])
const getRightTableData = async () => {
  if (!rightSearchForm.propertyId) {
    messageBox.confirm({
      message: '请在左侧表格选择一条商品参数数据',
      title: '提示',
      options: {
        showCancelButton: false,
        showConfirmButton: false,
        type: 'warning',
      },
    })
    return
  }
  try {
    const { data, code, msg } = await request<{
      total: number
      list: Array<any>
    } | null>({
      url: ApiValue.list,
      method: 'get',
      params: {
        pageNo: currentPage.value,
        pageSize: pageSize.value,
        ...rightSearchForm,
      },
    })
    if (code === 0) {
      rightTableData.value = data?.list ?? []
      rightGridApi.value!.setRowData(rightTableData.value)
      rightSetTotal(data?.total ?? 0)
    } else {
      rightGridApi.value!.setRowData([])
      rightSetTotal(0)
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

watch(
  () => selectRow.value,
  (newValue: any[]) => {
    if (newValue.length) {
      const [{ id }] = newValue
      rightSearchForm.propertyId = id
      getRightTableData()
    } else {
      rightSearchForm.propertyId = null
      rightTableData.value = []
      rightGridApi.value!.setRowData(rightTableData.value)
      rightSetTotal(0)
    }
  }
)

//新增
const attributeValueRef = ref<InstanceType<
  typeof attributeValueDrawer
> | null>()
const handleCreateRight = () => {
  if (!rightSearchForm.propertyId) {
    messageBox.confirm({
      message: '请在左侧表格选择一条商品参数数据',
      title: '提示',
      options: {
        showCancelButton: false,
        showConfirmButton: false,
        type: 'warning',
      },
    })
    return
  }
  attributeValueRef.value!.openDrawer()
}

//修改
const handleChangeRight = () => {
  if (rightSelectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要修改的参数信息数据',
      title: '提示',
      options: {
        showCancelButton: false,
        showConfirmButton: false,
        type: 'warning',
      },
    })
    return
  }
  const [{ id }] = rightSelectRow.value
  attributeValueRef.value!.changeOpen(id)
}

const handleDeleteRight = () => {
  if (rightSelectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要删除的参数信息数据',
      title: '提示',
      options: {
        showCancelButton: false,
        showConfirmButton: false,
        type: 'warning',
      },
    })
    return
  }
  const [{ name, id }] = rightSelectRow.value
  messageBox
    .confirm({
      message: `确认删除参数名称为${name}的数据？`,
      title: '提示',
      options: {
        type: 'warning',
      },
    })
    .then(async () => {
      try {
        const { code, msg } = await request({
          url: ApiValue.delete,
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
          getRightTableData()
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

const rightColumnDefs = ref<ColDef[]>([
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
    headerName: '参数值名称',
    field: 'name',
    colId: 'name',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '参数值编号',
    field: 'id',
    colId: 'id',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '参数值备注',
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

<style lang="scss" scoped>
.attribute-page {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  column-gap: 8px;

  .attribute-page__left {
    height: 100%;
  }

  .attribute-page__right {
    height: 100%;
  }
}
</style>
