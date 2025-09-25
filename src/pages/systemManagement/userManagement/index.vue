<template>
  <div class="use-page">
    <div class="branch-tree">
      <branchTree
        :tree-data="treeData"
        @node-click="handleNodeClick"
      />
    </div>

    <div
      class="use-list"
      v-loading="loading"
    >
      <page-layout v-loading="false">
        <template #search>
          <search-collapse
            :use-collapse="false"
            @query="getTableData"
          >
            <el-form label-width="100px">
              <el-row>
                <el-col v-bind="wrapperColSmall">
                  <el-form-item label="用户名称">
                    <el-input
                      v-model.trim="searchForm.username"
                      clearable
                      placeholder="请输入用户名称"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-bind="wrapperColSmall">
                  <el-form-item label="手机号码">
                    <el-input
                      v-model.trim="searchForm.mobile"
                      clearable
                      placeholder="请输入用户名称"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-bind="wrapperColSmall">
                  <el-form-item label="用户状态">
                    <el-select
                      v-model="searchForm.status"
                      clearable
                      placeholder="请选择用户状态"
                    >
                      <el-option
                        :value="0"
                        label="开启"
                      />
                      <el-option
                        :value="1"
                        label="关闭"
                      />
                    </el-select>
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
          <el-button
            type="success"
            @click="
              downloadFile(
                {
                  url: Api.downloadTemplate,
                  method: 'get',
                },
                '用户导入模板.xlsx'
              )
            "
            >下载导入模板</el-button
          >
          <el-button
            type="success"
            @click="handleImport"
            >导入</el-button
          >
          <el-button
            type="success"
            @click="handleExport"
            >导出</el-button
          >
          <el-button
            type="success"
            @click="handleResetPassword"
            >重置密码</el-button
          >
          <el-button
            type="success"
            @click="handleAssignRoles"
            >分配角色</el-button
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

      <user-drawer
        ref="userRef"
        :tree-data="treeData"
        :post-data="postData"
        :market-data="marketData"
        @submit="getTableData"
      />

      <assign-roles
        ref="assignRef"
        :tree-data="treeData"
        :role-data="rolesData"
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
import { onMounted, reactive, ref, shallowRef } from 'vue'
import { wrapperColSmall } from '@/utils/layout'
import userDrawer from './userDrawer.vue'
import { useMessage } from '@/hooks/useMessage'
import { useMessageBox } from '@/hooks/useMessageBox'
import { useRequest } from '@/hooks/useRequest'
import { dayjs } from 'element-plus'
import { Api } from './api'
import { buildTree, type TreeNode } from '@/utils/array'
import { chooseFile, downloadFile } from '@/utils/file'
import assignRoles from './assignRoles.vue'

defineOptions({
  name: 'userManagement',
})

onMounted(() => {
  getTreeData()
  getPostData()
  getMarketData()
  getRolesData()
  getTableData()
})

const treeData = ref<TreeNode[]>([])
const getTreeData = async () => {
  try {
    const { data, code, msg } = await request({
      url: Api.branchList,
      method: 'get',
    })
    if (code === 0) {
      treeData.value = buildTree(data, 'id', 'parentId')
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
}

const handleNodeClick = (data: any) => {
  getTableData(data?.id)
}

const postData = ref([])
const getPostData = async () => {
  try {
    const { data, code, msg } = await request({
      url: Api.postList,
      method: 'get',
    })
    if (code === 0) {
      postData.value = data
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
}

const marketData = ref([])
const getMarketData = async () => {
  try {
    const { data, code, msg } = await request({
      url: Api.marketList,
      method: 'get',
    })
    if (code === 0) {
      marketData.value = data
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
}

const rolesData = ref([])
const getRolesData = async () => {
  try {
    const { data, code, msg } = await request({
      url: Api.roleList,
      method: 'get',
    })
    if (code === 0) {
      rolesData.value = data
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
}

const messageBox = useMessageBox()
const { request, loading } = useRequest()

const searchForm = reactive({
  username: '',
  mobile: '',
  status: null,
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
const tableData = ref<any>([])
const getTableData = async (deptId = null) => {
  try {
    const { data, code, msg } = await request<{
      total: number
      list: Array<any>
    } | null>({
      url: Api.list,
      method: 'get',
      params: {
        ...searchForm,
        deptId,
        pageNo: currentPage.value,
        pageSize: pageSize.value,
      },
    })
    if (code === 0) {
      setTotal(data?.total ?? 0)
      tableData.value = data?.list ?? []
      gridApi.value!.setRowData(data?.list ?? [])
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
}

const userRef = ref<InstanceType<typeof userDrawer> | null>(null)
const handleCreate = () => {
  userRef.value!.openDrawer()
}

//修改
const handleChange = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要修改的用户信息数据',
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
  userRef.value!.changeOpen(id)
}

const handleDelete = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条需要删除的用户信息数据',
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
      message: `确认删除用户名称为${name}的数据？`,
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

const handleImport = async () => {
  const file = await chooseFile()
  console.log(file[0].name)
}

const handleExport = () => {
  downloadFile(
    {
      url: Api.exportFile,
      method: 'get',
      params: {
        ...searchForm,
      },
    },
    '用户列表.xlsx'
  )
}

const handleResetPassword = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条用户信息数据',
      title: '提示',
      options: {
        showCancelButton: false,
        showConfirmButton: false,
        type: 'warning',
      },
    })
    return
  }
  const [{ username, id, mobile }] = selectRow.value
  const password = (mobile as string) ? (mobile as string).slice(-6) : '123456'
  messageBox
    .confirm({
      message: `确认重置用户名称为${username}的登录密码吗? 确认重置后新密码为手机号码后6位!`,
      title: '提示',
      options: {
        type: 'warning',
      },
    })
    .then(async () => {
      try {
        const { code, msg } = await request({
          url: Api.resetPassword,
          method: 'put',
          data: {
            id,
            password,
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

const assignRef = ref<InstanceType<typeof assignRoles>>()
const handleAssignRoles = () => {
  if (selectRow.value.length !== 1) {
    messageBox.confirm({
      message: '请选择一条用户信息数据',
      title: '提示',
      options: {
        showCancelButton: false,
        showConfirmButton: false,
        type: 'warning',
      },
    })
    return
  }
  const [{ username, id, deptId }] = selectRow.value
  assignRef.value!.openDrawer(username, id, deptId)
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
    headerName: '用户名称',
    field: 'username',
    colId: 'username',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '归属部门',
    field: 'deptName',
    colId: 'deptName',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '手机号码',
    field: 'mobile',
    colId: 'mobile',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    headerName: '邮箱',
    field: 'email',
    colId: 'email',
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  // {
  //   headerName: '用户密码',
  //   field: 'createDate',
  //   colId: 'createDate',
  //   minWidth: 150,
  //   flex: 1,
  //   sortable: false,
  // },
  {
    headerName: '用户状态',
    field: 'status',
    colId: 'status',
    minWidth: 150,
    flex: 1,
    sortable: false,
    valueGetter: (params: ValueGetterParams) =>
      params.data?.status === 0 ? '开启' : '关闭',
  },
  {
    headerName: '用户性别',
    field: 'sex',
    colId: 'sex',
    minWidth: 150,
    flex: 1,
    sortable: false,
    valueGetter: (params: ValueGetterParams) =>
      params.data?.sex === 1 ? '男' : '女',
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
.use-page {
  height: 100%;
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 1fr;
  column-gap: 8px;

  .branch-tree {
    height: 100%;
    background-color: var(--el-color-white);
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
    border: 1px solid rgba(219, 223, 233, 0.3);
    padding: 8px;
    box-sizing: border-box;
  }
}
</style>
