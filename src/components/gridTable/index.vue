<template>
  <div class="ag-grid-table__wrapper">
    <div>
      <ag-grid-vue
        class="ag-theme-alpine"
        style="width: 100%; height: 100%; min-height: 200px; overflow: hidden"
        :header-height="32"
        :row-height="32"
        :grid-options="gridOptions"
        :get-row-id="getRowId"
        :get-row-style="getRowStyle"
        :get-row-class="getRowClass"
        :row-data="rowData"
        :default-col-def="defaultColDef"
        :column-defs="columnDefs"
        :row-selection="rowSelection"
        :pinned-bottom-row-data="pinnedBottomRowData"
        :noRowsOverlayComponent="rowsEmpty"
        @grid-ready="onGridReady"
        @selection-changed="onSelectionChanged"
        @row-clicked="onRowClicked"
        @row-double-clicked="onRowDoubleClicked"
        @cell-clicked="onCellClicked"
        @cell-double-clicked="onCellDoubleClicked"
        @sort-changed="onSortChanged"
        @filter-changed="onFilterChanged"
      >
      </ag-grid-vue>
    </div>
    <div
      v-if="usePagination"
      class="ag-pagination__wrapper"
    >
      <div class="ag-pagination__wrapper__left">
        <slot name="config"></slot>
      </div>
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="sizes"
        :page-sizes="pageSizes"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, type ModelRef } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import rowsEmpty from './rowsEmpty'

import type {
  ColDef,
  GridReadyEvent,
  GridApi,
  RowClickedEvent,
  RowDoubleClickedEvent,
  CellClickedEvent,
  CellDoubleClickedEvent,
  GetRowIdParams,
  FilterChangedEvent,
  RowClassParams,
  ITextFilterParams,
  SortChangedEvent,
  GridOptions,
  SelectionChangedEvent,
} from 'ag-grid-community'

interface Props {
  rowData?: any[]
  rowSelection?: 'single' | 'multiple'
  getRowClass?: (params: RowClassParams) => string[] | string | undefined
  columnDefs?: ColDef[]
  pinnedBottomRowData?: any[]
  useRowIndex?: boolean
  pageSizes?: number[]
  total?: number
  usePagination?: boolean
  defaultColDef?: ColDef
  gridOptions?: GridOptions
}

const props = withDefaults(defineProps<Props>(), {
  rowData: () => [],
  rowSelection: 'multiple',
  getRowClass: () => undefined,
  columnDefs: () => [],
  pinnedBottomRowData: () => [],
  pageSizes: () => [50, 100, 200],
  total: 0,
  usePagination: true, //是否使用分页
  defaultColDef: () =>
    ({
      filter: true, //默认开启列过滤
      sortable: true, //默认开启列排序
      resizable: true, //默认开启列宽拖拽
      minWidth: 30, //列最小宽度
      floatingFilter: true, //默认开启列过滤行
      filterParams: {
        filterOptions: ['contains'], //默认列过选项为包含
      } as ITextFilterParams,
      cellDataType: 'text', //默认单元格数据类型为文本
    }) as ColDef,
  gridOptions: () =>
    ({
      suppressRowClickSelection: false, //点击行不选中行
      suppressDragLeaveHidesColumns: true, //拖拽列到容器外不隐藏列
      suppressMovableColumns: false, //禁止列位置拖拽
    }) as GridOptions,
})

const {
  rowData,
  rowSelection,
  getRowClass,
  columnDefs,
  pinnedBottomRowData,
  pageSizes,
  total,
  usePagination,
  gridOptions,
} = toRefs(props)

const page = defineModel('page', { default: 1, type: Number })
const sizes = defineModel('sizes', { default: 100, type: Number })
const selectRow: ModelRef<any> = defineModel('selection', {
  default: [],
  type: Array,
})
const sort: ModelRef<'asc' | 'desc' | undefined> = defineModel('sort', {
  default: undefined,
  type: String,
})
const sortField: ModelRef<string | undefined> = defineModel('sortField', {
  default: undefined,
  type: String,
})

const getRowId = (params: GetRowIdParams) => {
  return params?.data?.id
}

const getRowStyle = (params: RowClassParams) => {
  if (params.node!.rowPinned) {
    return {
      background: 'rgb(250, 250, 250)',
    }
  }
}

const gridApi = ref<GridApi<any> | null>(null)
const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params!.api
  emits('grid-ready', params)
}

const onSelectionChanged = (params: SelectionChangedEvent) => {
  selectRow.value = gridApi.value!.getSelectedRows()
  emits('select-change', gridApi.value!.getSelectedRows(), params)
}

const onRowClicked = (params: RowClickedEvent) => {
  emits('row-click', params)
}

const onRowDoubleClicked = (params: RowDoubleClickedEvent) => {
  emits('row-double-click', params)
}

// const { copy, isSupported } = useClipboard()
const onCellClicked = (params: CellClickedEvent) => {
  //   if (
  //     !['rowIndex', 'rowSelection'].includes(params.column!.getColId()) &&
  //     isSupported.value
  //   ) {
  //     copy(params.value)
  //   }
  emits('cell-click', params)
}

const onCellDoubleClicked = (params: CellDoubleClickedEvent) => {
  if (params.node.rowPinned) return
  emits('cell-double-click', params)
}

const onSortChanged = (params: SortChangedEvent) => {
  const [sortModel] = params.columnApi
    .getColumnState()
    .filter((column) => column.sort)
  sort.value = sortModel?.sort ?? undefined
  sortField.value = sortModel?.colId ?? undefined
  emits('sort-change', {
    sort: sortModel?.sort ?? undefined,
    sortField: sortModel?.colId ?? undefined,
  })
}

const onFilterChanged = (params: FilterChangedEvent) => {
  gridApi.value!.refreshCells({ force: true })
  emits('filter-change', params)
}

const handleCurrentChange = (val: number) => {
  emits('current-change', val)
}

const handleSizeChange = (val: number) => {
  emits('size-change', val)
}

interface SortChangedParams {
  sort: 'asc' | 'desc' | undefined
  sortField: string | undefined
}

const emits = defineEmits<{
  (e: 'grid-ready', params: GridReadyEvent): void
  (e: 'select-change', rows: any[], params: SelectionChangedEvent): void
  (e: 'row-click', params: RowClickedEvent): void
  (e: 'row-double-click', params: RowDoubleClickedEvent): void
  (e: 'cell-click', params: CellClickedEvent): void
  (e: 'cell-double-click', params: CellDoubleClickedEvent): void
  (e: 'sort-change', params: SortChangedParams): void
  (e: 'filter-change', params: FilterChangedEvent): void
  (e: 'current-change', value: number): void
  (e: 'size-change', value: number): void
}>()
</script>

<style>
.ag-grid-table__wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr;
  overflow: hidden !important;
}

.ag-grid-table__wrapper > div:first-child {
  height: 100% !important;
  width: 100% !important;
  overflow: hidden;
  --ag-line-height: 32px;
}

.ag-text-field-input {
  --ag-grid-size: 7px !important;
}

.ag-root-wrapper {
  border-radius: 0 !important;
}

.ag-header-cell .ag-floating-filter-button {
  display: none !important;
}

.ag-header-cell-resize::after {
  display: none !important;
}

.ag-floating-filter {
  padding: 2px !important;
}

.ag-floating-filter-body {
  width: 100%;
  box-sizing: border-box;
}

.ag-input-field-input {
  outline: none;
}

.pinned-row-data {
  background-color: #fafafa !important;
}

.ag-row-buttons {
  height: 40px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.ag-row-buttons button {
  height: 32px;
}

.ag-pagination__wrapper {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  padding-top: 5px;
  box-sizing: border-box;
}

.ag-pagination__wrapper .ag-pagination__wrapper__left {
  flex: 1;
  height: 40px;
}

.ag-theme-alpine {
  /* 边框样式 */
  --ag-borders: 1px solid !important;
  /* 边框颜色 */
  --ag-border-color: #dcdfe6 !important;
  /* 偶数行背景颜色 */
  --ag-odd-row-background-color: var(--el-color-white) !important;
  /* 单元格左右padding */
  --ag-cell-horizontal-padding: 7px !important;
  /* 标题单元格字体样色 */
  --ag-header-foreground-color: var(--el-text-color-regular) !important;
  /* 表格表头行和过滤行背景颜色 */
  --ag-header-background-color: rgb(250, 250, 250) !important;
  /* ag-grid图标大小 */
  --ag-icon-size: 13px !important;
  /* 表格选择列单元格半选中状态背景颜色 */
  --ag-checkbox-indeterminate-color: var(--el-color-primary) !important;
  /* 表格选择列单元格全选中状态背景颜色 */
  --ag-checkbox-checked-color: var(--el-color-primary) !important;
  /* 选中的列被禁颜色 */
  --ag-selected-row-background-color: rgba(33, 150, 243, 0.1) !important;
  /* 鼠标移到表格行的背景颜色 */
  --ag-row-hover-color: rgb(250, 250, 250) !important;
  /* 选择列复选框未选择时边框颜色 */
  --ag-checkbox-unchecked-color: var(--el-text-color-regular) !important;
  /* 过滤输入框和选择列复选框聚焦时盒子阴影 */
  --ag-input-focus-box-shadow: none !important;
  /* 过滤输入框和选择列复选框聚焦时边框颜色 */
  --ag-input-focus-border-color: var(--el-color-primary) !important;
  /* 表格单元格聚焦边框颜色 */
  --ag-range-selection-border-color: var(--el-color-primary) !important;
  /* 表格字体*/
  /* --ag-font-family: var(--el-font-family) !important; */
}

/* 单元格有边框样式 */
.ag-ltr .ag-cell {
  border-right: var(--ag-borders) var(--ag-border-color);
  color: #303133;
  font-size: 13px;
}

/* 表格表头行单元格样式 */
.ag-header-cell {
  border-right: var(--ag-borders) var(--ag-border-color);
}

/* 表格表头行单元格文字样式 */
.ag-header-group-cell-label,
.ag-header-cell-label {
  justify-content: center;
  font-size: 13px;
}

.ag-header-row .ag-header-group-cell {
  justify-content: center;
  font-size: 13px;
  border-right: var(--ag-borders) var(--ag-border-color);
}

.ag-header-cell-comp-wrapper .ag-cell-label-container .ag-header-icon {
  display: none !important;
}

.ag-header-cell-comp-wrapper
  .ag-cell-label-container
  .ag-header-cell-label
  .ag-header-icon {
  display: none !important;
}

.ag-grid__rowIndexCell,
.ag-grid__rowSelectionCell {
  text-align: center;
}

.ag-cell .ag-cell-wrapper .ag-selection-checkbox {
  margin-right: 0 !important;
}

/* 表格序号列和选择列单元格不允许聚焦显示边框 */
.ag-grid__rowIndexCell:not(.ag-cell-range-selected):focus-within,
.ag-grid__rowSelectionCell:not(.ag-cell-range-selected):focus-within {
  border: none !important;
  border-style: none !important;
  border-right: var(--ag-borders) var(--ag-border-color) !important;
  /* pointer-events: none; */
}
</style>
