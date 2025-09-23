<template>
  <div style="height: 100%">
    <el-input
      v-model="query"
      style="width: 100%; margin-bottom: 8px"
      placeholder="请输入部门名称"
      clearable
      @input="onQueryChanged"
    />
    <el-tree-v2
      ref="treeRef"
      style="max-width: 600px"
      :data="data"
      :props="props"
      :filter-method="filterMethod"
      :height="appHeight - 190"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElTreeV2, type TreeNodeData } from 'element-plus'
import { useGlobalStore } from '@/store/globalStore'
import { storeToRefs } from 'pinia'

const globalStore = useGlobalStore()
const { appHeight } = storeToRefs(globalStore)

type TreeV2Instance = InstanceType<typeof ElTreeV2>

interface Tree {
  id: string
  label: string
  children?: Tree[]
}

const getKey = (prefix: string, id: number) => `${prefix}-${id}`

const createData = (
  maxDeep: number,
  maxChildren: number,
  minNodesNumber: number,
  deep = 1,
  key = 'node'
): Tree[] => {
  let id = 0
  return Array.from({ length: minNodesNumber })
    .fill(deep)
    .map(() => {
      const childrenNumber =
        deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren)
      const nodeKey = getKey(key, ++id)
      return {
        id: nodeKey,
        label: '得胜物流' + nodeKey,
        children: childrenNumber
          ? createData(maxDeep, maxChildren, childrenNumber, deep + 1, nodeKey)
          : undefined,
      }
    })
}

const query = ref('')
const treeRef = ref<TreeV2Instance>()
const data = createData(4, 30, 5)
const props = {
  value: 'id',
  label: 'label',
  children: 'children',
}

const onQueryChanged = (query: string) => {
  treeRef.value!.filter(query)
}
const filterMethod = (query: string, node: TreeNodeData) =>
  node.label!.includes(query)
</script>
