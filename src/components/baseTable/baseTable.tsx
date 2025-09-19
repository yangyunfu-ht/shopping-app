import { defineComponent, h } from 'vue'
import { ElTable, ElTableColumn, ElEmpty } from 'element-plus'
import { type VNode } from 'vue'

// 定义表格列的类型
export interface TableColumn {
  field: string
  colId: string
  headerName: string
  width?: number | string
  minWidth?: number | string
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean | 'custom'
  type?: 'selection' | 'index' // 新增 type 属性
  slot?: string // 自定义列的插槽名
  align?: 'left' | 'center' | 'right'
}

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
  },
  emits: ['update:page', 'selection-change'],
  setup(props, { emit, slots, attrs }) {
    // 处理选择行
    const handleSelectionChange = (selection: any[]) => {
      emit('selection-change', selection)
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
            padding: '8px',
            boxSizing: 'border-box',
            backgroundColor: 'var(--el-color-white)',
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
