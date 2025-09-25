<template>
  <div
    style="height: 100%"
    v-loading="loading"
  >
    <div class="area-tree">
      <el-input
        v-model="query"
        style="width: 100%; margin-bottom: 8px"
        placeholder="请输入地区名称"
        clearable
        @input="onQueryChanged"
      />
      <el-tree-v2
        ref="treeRef"
        style="max-width: 600px"
        :data="treeData"
        :props="treeProps"
        :filter-method="filterMethod"
        :height="appHeight - 190"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { shallowRef, ref, onMounted } from 'vue'
import {
  type FilterNodeMethodFunction,
  type TreeInstance,
  type TreeNodeData,
} from 'element-plus'
import { useGlobalStore } from '@/store/globalStore'
import { storeToRefs } from 'pinia'
import { useRequest } from '@/hooks/useRequest'
import { Api } from './api'
import { useMessage } from '@/hooks/useMessage'

onMounted(() => {
  getTreeData()
})

const { request, loading } = useRequest()
const globalStore = useGlobalStore()
const { appHeight } = storeToRefs(globalStore)

const query = ref('')
const treeRef = ref<TreeInstance>()
const treeData = shallowRef<TreeNodeData[]>([])
const treeProps = {
  value: 'id',
  label: 'name',
  children: 'children',
}

const getTreeData = async () => {
  try {
    const { data, code, msg } = await request({
      url: Api.areaTree,
      method: 'get',
    })
    if (code === 0) {
      treeData.value = data
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

const onQueryChanged = (query: string) => {
  treeRef.value!.filter(query)
}

const filterMethod: FilterNodeMethodFunction = (
  value: string,
  data: TreeNodeData
) => data.name!.includes(value)
</script>

<style lang="scss" scoped>
.area-tree {
  height: 100%;
  width: 485px;
  background-color: var(--el-color-white);
  padding: 8px;
  box-sizing: border-box;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
}
</style>
