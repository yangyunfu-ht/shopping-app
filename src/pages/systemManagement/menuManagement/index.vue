<template>
  <div class="page-container menu-management">
    <!-- <div>
      <h2>部门组织架构</h2>
    </div> -->

    <div style="height: 100%">
      <base-table
        :table-data="treeData"
        :columns="treeTableColumns"
        row-key="id"
        height="100%"
        :default-expand-all="true"
        :tree-props="{
          children: 'children',
          hasChildren: 'hasChildren',
          checkStrictly: true,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@/components/baseTable/baseTable'
import { ref } from 'vue'

interface Department {
  id: number
  name: string
  manager: string
  children?: Department[]
}

const treeData = ref<Department[]>([
  {
    id: 1,
    name: '总公司',
    manager: '张三',
    children: [
      {
        id: 2,
        name: '技术部',
        manager: '李四',
        children: [
          { id: 3, name: '前端组', manager: '王五' },
          { id: 4, name: '后端组', manager: '赵六' },
        ],
      },
      {
        id: 5,
        name: '销售部',
        manager: '孙七',
        children: [{ id: 6, name: '销售一组', manager: '周八' }],
      },
    ],
  },
])

const treeTableColumns: TableColumn[] = [
  {
    colId: 'index',
    field: 'index',
    type: 'index',
    headerName: '序号',
    align: 'center',
  },
  {
    colId: 'selection',
    field: 'selection',
    type: 'selection',
    headerName: '',
  },
  { colId: 'name', field: 'name', headerName: '部门名称', minWidth: 100 },
  { colId: 'manager', field: 'manager', headerName: '负责人', minWidth: 100 },
]
</script>

<style lang="scss" scoped></style>
