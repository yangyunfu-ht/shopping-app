<template>
  <app-drawer
    v-model="visible"
    :title="title"
    @close="handleClose(ruleFormRef)"
    @confirm="handleConfirm(ruleFormRef)"
  >
    <div
      style="height: 100%"
      v-loading="loading"
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="用户名称"
          prop="username"
        >
          <el-input
            v-model.trim="ruleForm.username"
            placeholder="请输入用户名称"
          />
        </el-form-item>

        <el-form-item
          label="用户密码"
          prop="password"
          v-if="!ruleForm.id"
        >
          <el-input
            v-model.trim="ruleForm.password"
            placeholder="请输入用户密码"
          />
        </el-form-item>

        <el-form-item
          label="归属部门"
          prop="deptId"
        >
          <el-tree-select
            v-model="ruleForm.deptId"
            :data="treeData"
            check-strictly
            node-key="id"
            :render-after-expand="false"
            :props="{
              label: 'name',
              children: 'children',
            }"
            filterable
            clearable
            style="width: 100%"
            placeholder="请选择上级部门"
          />
        </el-form-item>

        <el-form-item
          label="手机号码"
          prop="mobile"
        >
          <el-input
            v-model.trim="ruleForm.mobile"
            placeholder="请输入手机号码"
          />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model.trim="ruleForm.email"
            placeholder="请输入邮箱"
          />
        </el-form-item>
        <el-form-item
          label="用户性别"
          prop="sex"
        >
          <el-select
            v-model="ruleForm.sex"
            placeholder="请选择用户性别"
          >
            <el-option
              :value="1"
              label="男"
            />
            <el-option
              :value="2"
              label="女"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="岗位"
          prop="postIds"
        >
          <el-select
            v-model="ruleForm.postIds"
            placeholder="请选择岗位"
            multiple
            clearable
          >
            <el-option
              v-for="post in postData"
              :key="post.id"
              :value="post.id"
              :label="post.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="商场授权"
          prop="dataScope"
        >
          <el-select
            v-model="ruleForm.dataScope"
            placeholder="强选择商场授权"
          >
            <el-option
              :value="1"
              label="全部"
            />
            <el-option
              :value="2"
              label="指定商场"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="授权商场"
          prop="dataScopeMarketIds"
          v-if="ruleForm.dataScope === 2"
        >
          <el-select
            v-model="ruleForm.dataScopeMarketIds"
            placeholder="请选择授权商场"
            multiple
            clearable
          >
            <el-option
              v-for="post in marketData"
              :key="post.id"
              :value="post.id"
              :label="post.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="用户备注"
          prop="remark"
        >
          <el-input
            v-model.trim="ruleForm.remark"
            type="textarea"
            :rows="3"
            show-word-limit
            :maxlength="50"
            placeholder="请输入用户备注"
          />
        </el-form-item>
      </el-form>
    </div>
  </app-drawer>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref, toRefs, watch, type PropType } from 'vue'
import { useRequest } from '@/hooks/useRequest'
import { Api } from './api'
import { useMessage } from '@/hooks/useMessage'
import type { TreeNode } from '@/utils/array'
import { validPhone } from '@/utils/validator'

const props = defineProps({
  treeData: {
    type: Array as PropType<TreeNode[]>,
    default: () => [],
  },
  postData: {
    type: Array as PropType<{ id: number; name: string }[]>,
    default: () => [],
  },
  marketData: {
    type: Array as PropType<{ id: number; name: string }[]>,
    default: () => [],
  },
})

const { treeData, postData, marketData } = toRefs(props)

const { request, loading } = useRequest()

const visible = ref(false)
const title = ref('')

const emits = defineEmits<{
  submit: []
}>()

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  username: '',
  password: '',
  deptId: null,
  mobile: '',
  email: '',
  sex: null,
  postIds: [],
  dataScope: 1, // 1全部 2指定
  dataScopeMarketIds: [],
  remark: '',
  id: '',
})

watch(
  () => ruleForm.dataScope,
  (val: number) => {
    if (val === 1) {
      ruleForm.dataScopeMarketIds = []
    }
  }
)

const rules = reactive<FormRules<typeof ruleForm>>({
  username: [
    {
      required: true,
      message: '请输入用户名称',
      trigger: 'blur',
    },
    {
      min: 4,
      max: 30,
      message: '用户名称最短4位,最长30位',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      validator: (_rule: any, value: string, callback: any) => {
        if (/^[a-zA-Z0-9]{1,6}$/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入数字或者字母,长度不超过6位'))
        }
      },
      trigger: 'blur',
    },
  ],
  deptId: [
    {
      required: true,
      message: '请选择归属部门',
      trigger: 'change',
    },
  ],
  mobile: [
    {
      required: true,
      validator: (_rule: any, value: string, callback: any) => {
        if (validPhone(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的手机号码'))
        }
      },
      trigger: 'blur',
    },
  ],
  dataScopeMarketIds: [
    {
      type: 'array',
      required: true,
      message: '请选择授权商场',
      trigger: 'change',
    },
  ],
})

const handleClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  ruleForm.id = ''
}

const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        const { code, msg } = await request({
          url: ruleForm.id ? Api.change : Api.create,
          method: ruleForm.id ? 'put' : 'post',
          data: ruleForm,
        })
        if (code === 0) {
          visible.value = false
          emits('submit')
          useMessage({
            type: 'success',
            message: msg,
          })
        } else {
          useMessage({
            type: 'error',
            message: msg,
          })
        }
      } catch (err: any) {
        useMessage({
          type: 'error',
          message: err.message,
        })
      }
    }
  })
}

const openDrawer = () => {
  title.value = '新增用户'
  visible.value = true
}

const changeOpen = async (id: string) => {
  if (!id) return
  ruleForm.id = id
  title.value = '修改用户'
  visible.value = true
  try {
    const { data, code, msg } = await request({
      url: Api.detail,
      method: 'get',
      params: {
        id,
      },
    })
    if (code === 0) {
      ruleForm.username = data.username
      ruleForm.deptId = data.deptId
      ruleForm.mobile = data.mobile
      ruleForm.email = data.email
      ruleForm.sex = data.sex
      ruleForm.postIds = data.postIds
      ruleForm.remark = data.remark
    } else {
      useMessage({
        type: 'error',
        message: msg,
      })
    }
  } catch (err: any) {
    useMessage({
      type: 'error',
      message: err.message,
    })
  }
}

defineExpose({
  openDrawer,
  changeOpen,
})
</script>

<style lang="scss" scoped></style>
