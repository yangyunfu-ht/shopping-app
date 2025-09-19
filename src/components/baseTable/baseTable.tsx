import { defineComponent, h, ref } from 'vue'
import { ElTable, ElTableColumn, ElEmpty } from 'element-plus'
import { type VNode } from 'vue'
import type { TableColumn } from '#/column'

export default defineComponent({
  name: 'BaseTable',
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array as () => TableColumn[],
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: '暂无数据',
    },
    rowKey: {
      type: String,
      default: 'id', // 默认以 'id' 作为行数据的唯一标识
    },
    defaultExpandAll: {
      type: Boolean,
      default: false, // 默认不展开所有行
    },
    treeProps: {
      type: Object,
      default: () => ({ children: 'children' }), // 默认子节点字段为 'children'
    },
    selection: {
      type: Array,
      default: () => [],
    },
    headerCellStyle: {
      type: Object,
      default: () => ({
        backgroundColor: 'rgb(250, 250, 250)',
      }),
    },
    rowStyle: {
      type: Object,
      default: () => ({
        height: '32px',
      }),
    },
    cellStyle: {
      type: Object,
      default: () => ({
        color: '#303133',
        fontSize: '13px',
      }),
    },
  },
  emits: ['update:selection', 'onRowClick'],
  setup(props, { emit, slots, attrs }) {
    const multipleTableRef = ref<InstanceType<typeof ElTable> | null>(null)

    // 处理选择行
    const handleSelectionChange = (selection: any[]) => {
      emit('update:selection', selection)
    }

    // 处理行点击事件
    const handleOnRowClick = (row: any, column: any) => {
      if (multipleTableRef.value) {
        multipleTableRef.value.clearSelection()
        multipleTableRef.value?.toggleRowSelection(row, true)
      }
      emit('onRowClick', row, column)
    }

    // 渲染表格列
    const renderTableColumns = (): VNode[] => {
      return props.columns.map((column, index) => {
        const columnKey =
          column.colId || column.field || column.type || `col-${index}`

        // 索引列
        if (column.type === 'index') {
          return h(ElTableColumn, {
            key: columnKey,
            type: 'index',
            label: column.headerName || '序号',
            width: column.width || 60,
            align: column.align || 'center',
          })
        }

        // 选择列
        if (column.type === 'selection') {
          return h(ElTableColumn, {
            key: columnKey,
            type: 'selection',
            width: column.width || 40,
            align: column.align || 'center',
          })
        }

        // 普通列或自定义列
        return h(
          ElTableColumn,
          {
            key: columnKey,
            prop: column.colId || column.field,
            label: column.headerName,
            width: column.width || '',
            minWidth: column.minWidth || '',
            fixed: column.fixed,
            sortable: column.sortable,
            align: column.align || 'left',
          },
          {
            default: (scope: any) => {
              // 如果有自定义插槽，渲染插槽内容
              if (column.slot && slots[column.slot]) {
                return slots[column.slot]!({
                  row: scope.row,
                  $index: scope.$index,
                })
              }
              // 否则渲染默认值
              return scope.row[column.colId || column.field!]
            },
          }
        )
      })
    }

    return () => {
      return h(
        'div',
        {
          style: {
            height: '100%',
            width: '100%',
          },
        },
        [
          h(
            ElTable,
            {
              data: props.tableData,
              border: true,
              ...attrs,
              vLoading: props.loading,
              onSelectionChange: handleSelectionChange,
              rowKey: props.rowKey,
              defaultExpandAll: props.defaultExpandAll,
              treeProps: props.treeProps,
              headerCellStyle: props.headerCellStyle,
              rowStyle: props.rowStyle,
              cellStyle: props.cellStyle,
              onRowClick: handleOnRowClick,
              ref: multipleTableRef,
            },
            {
              // 动态渲染列
              default: () => [
                ...renderTableColumns(),
                slots.operation && slots.operation(),
              ],
              // 自定义空状态
              empty: () => h(ElEmpty, { description: props.emptyText }),
            }
          ),
        ]
      )
    }
  },
})
