<template>
  <app-drawer
    v-model="visible"
    :title="title"
    @confirm="handleConfirm(ruleFormRef)"
    @close="handleClose(ruleFormRef)"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      label-width="100px"
    >
      <div
        v-for="(item, index) in ruleForm"
        :key="index"
        class="carousel-card"
      >
        <header class="carousel-card__header">
          <span>轮播图{{ index + 1 }}</span>
          <el-button
            v-if="index !== 0"
            :icon="Delete"
            text
            @click="removeItem(index)"
          />
        </header>
        <el-form-item
          label="图片"
          :prop="`items.${index}.imageUrl`"
          :rules="{
            required: true,
            message: '请上传图片',
            trigger: 'change',
          }"
        >
          <app-upload v-model="item.imageUrl" />
        </el-form-item>

        <el-form-item label="跳转链接">
          <el-input
            v-model="item.linkUrl"
            placeholder="请输入跳转链接"
          />
        </el-form-item>
      </div>

      <el-form-item>
        <el-button
          type="primary"
          :icon="CirclePlus"
          @click="addItem"
        >
          添加轮播图项
        </el-button>
      </el-form-item>
    </el-form>
  </app-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type FormInstance } from 'element-plus'
import { Delete, CirclePlus } from '@element-plus/icons-vue'

interface CarouselItem {
  imageUrl: Array<any>
  linkUrl: string
}

const visible = ref(false)
const title = ref('')

const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<CarouselItem[]>([
  // 初始数据
  {
    imageUrl: [],
    linkUrl: '',
  },
])

const addItem = () => {
  ruleForm.value.push({
    imageUrl: [],
    linkUrl: '',
  })
}

const removeItem = (index: number) => {
  if (index === 0) return
  ruleForm.value.splice(index, 1)
}

const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    console.log(valid)
  })
}

const handleClose = (formEl: FormInstance | undefined) => {
  if (formEl) formEl.resetFields()
  ruleForm.value = [
    {
      imageUrl: [],
      linkUrl: '',
    },
  ]
}

const openDrawer = () => {
  title.value = '新增轮播图'
  visible.value = true
}

defineExpose({
  openDrawer,
})
</script>

<style lang="scss" scoped>
.carousel-card {
  .carousel-card__header {
    height: 32px;
    display: flex;
    padding: 8px;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(250, 250, 250);
    margin-bottom: 20px;
  }

  &:last-child {
    border-bottom: none;
  }
}
</style>
