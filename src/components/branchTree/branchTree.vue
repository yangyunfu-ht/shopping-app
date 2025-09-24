<template>
  <div style="height: 100%">
    <el-input
      v-model="query"
      style="width: 100%; margin-bottom: 8px"
      placeholder="请输入部门名称"
      clearable
      @input="onQueryChanged"
    />
    <el-tree
      ref="treeRef"
      style="max-width: 600px"
      :data="treeData"
      :props="treeProps"
      :filter-node-method="filterMethod"
      :height="appHeight - 190"
      :highlight-current="highlightCurrent"
      :default-expand-all="defaultExpandAll"
      :show-checkbox="showCheckbox"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, type PropType } from 'vue'
import {
  type FilterNodeMethodFunction,
  type TreeInstance,
  type TreeNodeData,
} from 'element-plus'
import { useGlobalStore } from '@/store/globalStore'
import { storeToRefs } from 'pinia'

const emits = defineEmits<{
  'node-click': [data: any, node: any, treeNode: any, event: any]
}>()

const props = defineProps({
  treeData: {
    type: Array as PropType<TreeNodeData[]>,
    default: () => [],
  },
  treeProps: {
    type: Object,
    default: () => ({
      value: 'id',
      label: 'name',
      children: 'children',
    }),
  },
  highlightCurrent: {
    type: Boolean,
    default: true,
  },
  defaultExpandAll: {
    type: Boolean,
    default: true,
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
})

const {
  treeData,
  treeProps,
  highlightCurrent,
  defaultExpandAll,
  showCheckbox,
} = toRefs(props)

const globalStore = useGlobalStore()
const { appHeight } = storeToRefs(globalStore)

const query = ref('')
const treeRef = ref<TreeInstance>()

const onQueryChanged = (query: string) => {
  treeRef.value!.filter(query)
}

const filterMethod: FilterNodeMethodFunction = (
  value: string,
  data: TreeNodeData
) => data.name!.includes(value)

const handleNodeClick = (data: any, node: any, treeNode: any, event: any) => {
  emits('node-click', data, node, treeNode, event)
}
</script>
