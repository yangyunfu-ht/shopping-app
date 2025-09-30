<template>
  <app-drawer
    v-model="visible"
    title="菜单分配"
    @confirm="handleConfirm"
  >
    <div
      style="height: 100%; padding: 0 8px"
      v-loading="loading"
    >
      <el-tree-v2
        v-if="visible"
        ref="treeRef"
        style="width: 100%"
        :data="treeData"
        :props="{
          value: 'id',
          label: 'name',
          children: 'children',
        }"
        show-checkbox
        :height="appHeight - 140"
        check-strictly
      />
    </div>
  </app-drawer>
</template>

<script setup lang="ts">
import { useRequest } from '@/hooks/useRequest'
import { useGlobalStore } from '@/store/globalStore'
import type { TreeNode } from '@/utils/array'
import type { ElTreeV2 } from 'element-plus'
import { storeToRefs } from 'pinia'
import { ref, toRefs, type PropType } from 'vue'
import { Api } from './api'
import { useMessage } from '@/hooks/useMessage'

const props = defineProps({
  treeData: {
    type: Array as PropType<TreeNode[]>,
    default: () => [],
  },
})
const { treeData } = toRefs(props)
const { request, loading } = useRequest()
const globalStore = useGlobalStore()
const { appHeight } = storeToRefs(globalStore)

const treeRef = ref<InstanceType<typeof ElTreeV2>>()
const visible = ref(false)
const roleId = ref<null | number>(null)

const openDrawer = async (id: number) => {
  if (!id) return
  roleId.value = id
  visible.value = true
  try {
    const { data, code, msg } = await request({
      url: Api.getMenuAuthor,
      method: 'get',
      params: {
        roleId: id,
      },
    })
    if (code === 0) {
      treeRef.value!.setCheckedKeys(data)
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

const handleConfirm = async () => {
  if (!treeRef.value) return
  try {
    const { code, msg } = await request({
      url: Api.roleAuthor,
      method: 'post',
      data: {
        roleId: roleId.value,
        menuIds: treeRef.value!.getCheckedKeys(),
      },
    })
    if (code === 0) {
      useMessage({
        message: msg,
        type: 'success',
      })
      visible.value = false
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

defineExpose({
  openDrawer,
})
</script>

<style lang="scss" scoped></style>
