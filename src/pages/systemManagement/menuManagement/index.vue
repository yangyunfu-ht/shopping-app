<template>
  <div style="height: 100%">
    <page-layout>
      <template #search>
        <search-collapse style="background-color: #fff">
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
        <el-button type="primary">新增</el-button>
        <el-button
          type="warning"
          @click="handleChange"
          >修改</el-button
        >
        <el-button type="danger">删除</el-button>
      </template>

      <template #table>
        <div style="height: 100%">
          <base-table
            :table-data="treeData"
            :columns="treeTableColumns"
            v-model:selection="selectRow"
            row-key="id"
            height="100%"
            max-height="100%"
            :default-expand-all="true"
            :reserve-selection="true"
            :tree-props="{
              children: 'children',
              hasChildren: 'hasChildren',
              checkStrictly: true,
            }"
          />
        </div>
      </template>
    </page-layout>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { wrapperColSmall, wrapperColLarge } from '@/utils/layout'
import type { TableColumn } from '#/column'

interface Department {
  id: number
  name: string
  manager: string
  children?: Department[]
}

const selectRow = ref<Department[]>([])
const searchForm = reactive({
  value: '',
})

const handleChange = () => {
  console.log('修改', selectRow.value, selectRow.value.length)
}

const treeData = ref<Department[]>([
  // {
  //   id: 1,
  //   name: '总公司',
  //   manager: '张三',
  //   children: [
  //     {
  //       id: 2,
  //       name: '技术部',
  //       manager: '李四',
  //       children: [
  //         { id: 3, name: '前端组', manager: '王五' },
  //         { id: 4, name: '后端组', manager: '赵六' },
  //       ],
  //     },
  //     {
  //       id: 5,
  //       name: '销售部',
  //       manager: '孙七',
  //       children: [{ id: 6, name: '销售一组', manager: '周八' }],
  //     },
  //   ],
  // },
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
