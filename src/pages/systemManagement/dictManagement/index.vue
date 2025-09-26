<template>
  <div
    class="dict-page"
    v-loading="loading"
  >
    <!-- 字典类型 -->
    <div class="dict-page__left">
      <page-layout>
        <template #buttons>
          <el-button
            type="primary"
            @click="handleCreateDictType"
            >新增</el-button
          >
          <el-button
            type="warning"
            @click="handleChangeDictType"
            >修改</el-button
          >
          <el-button
            type="danger"
            @click="handleDeleteDictType"
            >删除</el-button
          >
        </template>

        <template #table>
          <grid-table
            :row-data="leftTableData"
            :columnDefs="leftColumnDefs"
            v-model:selection="leftSelectRow"
            v-model:page="currentPage"
            v-model:sizes="pageSize"
            :pageSizes="pageSizes"
            :total="total"
            rowSelection="single"
            @grid-ready="onLeftGridReady"
            @current-change="changeCurrent"
            @size-change="changePageSize"
            @sort-change="getLeftTableData"
          ></grid-table>
        </template>
      </page-layout>

      <dict-drawer
        ref="dictRef"
        @submit="getLeftTableData"
      />
    </div>

    <!-- 字典数据 -->
    <div class="dict-page__right">
      <page-layout>
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
            :row-data="rightTableData"
            :columnDefs="rightColumnDefs"
            v-model:selection="rightSelectRow"
            v-model:page="rightCurrentPage"
            v-model:sizes="rightPageSize"
            :pageSizes="rightPageSizes"
            :total="rightTotal"
            rowSelection="single"
            @grid-ready="onRightGridReady"
            @current-change="changeRightCurrent"
            @size-change="changeRightPageSize"
            @sort-change="getRightTableData"
          ></grid-table>
        </template>
      </page-layout>

      <dict-data-drawer
        ref="dictDataRef"
        :dict-type="dictType"
        @submit="getRightTableData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  ColDef,
  ValueGetterParams,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community'
import { onMounted, ref, shallowRef, watch } from 'vue'
import { useMessage } from '@/hooks/useMessage'
import { useMessageBox } from '@/hooks/useMessageBox'
import { useRequest } from '@/hooks/useRequest'
import { Api, DictApi } from './api'
import { usePagination } from '@/hooks/usePagination'
import { dayjs } from 'element-plus'
import dictDrawer from './dictDrawer.vue'
import dictDataDrawer from './dictDataDrawer.vue'

defineOptions({
  name: 'dictManagement',
})

onMounted(() => {
  getLeftTableData()
})

const messageBox = useMessageBox()
const { request, loading } = useRequest()
const dictType = ref('')

const {
  currentPage,
  pageSize,
  pageSizes,
  total,
  setTotal,
  changeCurrent,
  changePageSize,
} = usePagination({ callback: () => getLeftTableData() })

const leftGridApi = shallowRef<GridApi<any> | null>(null)
const onLeftGridReady = (params: GridReadyEvent) => {
  leftGridApi.value = params!.api
}

const leftTableData = ref<any>([])
const leftSelectRow = ref<any>([])
const getLeftTableData = async () => {
  try {
    const leftResponse = await request<{
      total: number
      list: Array<any>
    } | null>({
      url: Api.list,
      method: 'get',
      params: {
        pageNo: currentPage.value,
        pageSize: pageSize.value,
      },
    })
    if (leftResponse.code === 0) {
      setTotal(leftResponse.data?.total ?? 0)
      leftTableData.value = leftResponse.data?.list ?? []
      leftGridApi.value!.setRowData(leftTableData.value)
    } else {
      useMessage({
        message: leftResponse.msg,
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

const dictRef = ref<InstanceType<typeof dictDrawer> | null>(null)
const handleCreateDictType = () => {
  dictRef.value!.openDrawer()
}

const handleChangeDictType = () => {
  if (leftSelectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要修改的字典数据',
      title: '提示',
      options: {
        showCancelButton: false,
        showConfirmButton: false,
        type: 'warning',
      },
    })
    return
  }
  const [{ id }] = leftSelectRow.value
  dictRef.value!.changeOpen(id)
}

const handleDeleteDictType = () => {
  if (leftSelectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要删除的字典数据',
      title: '提示',
      options: {
        showCancelButton: false,
        showConfirmButton: false,
        type: 'warning',
      },
    })
    return
  }
  const [{ name, id }] = leftSelectRow.value
  messageBox
    .confirm({
      message: `确认删除字典名称为${name}的数据？`,
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
          getLeftTableData()
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

const {
  currentPage: rightCurrentPage,
  pageSize: rightPageSize,
  pageSizes: rightPageSizes,
  total: rightTotal,
  setTotal: setRightTotal,
  changeCurrent: changeRightCurrent,
  changePageSize: changeRightPageSize,
} = usePagination({
  callback: () => getRightTableData(),
})

const rightGridApi = shallowRef<GridApi<any> | null>(null)
const onRightGridReady = (params: GridReadyEvent) => {
  rightGridApi.value = params!.api
}

watch(
  () => leftSelectRow.value,
  (newValue: Array<any>) => {
    if (newValue.length) {
      const [{ type }] = newValue
      dictType.value = type
      getRightTableData()
    } else {
      dictType.value = ''
      rightTableData.value = []
      setRightTotal(0)
      rightGridApi.value!.setRowData(rightTableData.value)
    }
  }
)

const rightTableData = ref<any>([])
const rightSelectRow = ref([])
const getRightTableData = async () => {
  try {
    const rightResponse = await request<{
      total: number
      list: Array<any>
    } | null>({
      url: DictApi.list,
      method: 'get',
      params: {
        dictType: dictType.value,
        pageNo: rightCurrentPage.value,
        pageSize: rightPageSize.value,
      },
    })
    if (rightResponse.code === 0) {
      setRightTotal(rightResponse.data?.total ?? 0)
      rightTableData.value = rightResponse.data?.list ?? []
      rightGridApi.value!.setRowData(rightTableData.value)
    } else {
      useMessage({
        message: rightResponse.msg,
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

const dictDataRef = ref<InstanceType<typeof dictDataDrawer> | null>(null)
const handleCreate = () => {
  if (!dictType.value) {
    messageBox.confirm({
      message: '请在左侧表格选择一条字典数据',
      title: '提示',
      options: {
        showCancelButton: false,
        showConfirmButton: false,
        type: 'warning',
      },
    })
    return
  }
  dictDataRef.value!.openDrawer()
}

const handleChange = () => {
  if (rightSelectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要修改的字典数据',
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
  dictDataRef.value!.changeOpen(id)
}

const handleDelete = () => {
  if (rightSelectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要删除的字典数据',
      title: '提示',
      options: {
        showCancelButton: false,
        showConfirmButton: false,
        type: 'warning',
      },
    })
    return
  }
  const [{ label, id }] = rightSelectRow.value
  messageBox
    .confirm({
      message: `确认删除数据标签为${label}的数据？`,
      title: '提示',
      options: {
        type: 'warning',
      },
    })
    .then(async () => {
      try {
        const { code, msg } = await request({
          url: DictApi.delete,
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

const leftColumnDefs = ref<ColDef[]>([
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
    headerCheckboxSelection: false,
    headerCheckboxSelectionCurrentPageOnly: true,
    headerCheckboxSelectionFilteredOnly: true,
    suppressNavigable: false,
    width: 30,
    filter: false,
  },
  {
    headerName: '字典名称',
    field: 'name',
    colId: 'name',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '字典类型',
    field: 'type',
    colId: 'type',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '字典编号',
    field: 'id',
    colId: 'id',
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
    headerName: '备注',
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
    headerCheckboxSelection: false,
    headerCheckboxSelectionCurrentPageOnly: true,
    headerCheckboxSelectionFilteredOnly: true,
    suppressNavigable: false,
    width: 30,
    filter: false,
  },
  {
    headerName: '数据标签',
    field: 'label',
    colId: 'label',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '数据值',
    field: 'value',
    colId: 'value',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '排序值',
    field: 'sort',
    colId: 'sort',
    minWidth: 100,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '状态',
    field: 'status',
    colId: 'status',
    minWidth: 100,
    flex: 1,
    sortable: false,
    valueGetter: (params: ValueGetterParams) =>
      params.data.status === 0 ? '开启' : '关闭',
  },
  {
    headerName: '颜色类型',
    field: 'colorType',
    colId: 'colorType',
    minWidth: 100,
    flex: 1,
    sortable: false,
  },
  {
    headerName: 'css class',
    field: 'cssClass',
    colId: 'cssClass',
    minWidth: 100,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '备注',
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
.dict-page {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  column-gap: 8px;

  .dict-page__left {
    height: 100%;
  }

  .dict-page__right {
    height: 100%;
  }
}
</style>
