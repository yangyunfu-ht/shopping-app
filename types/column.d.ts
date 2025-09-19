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