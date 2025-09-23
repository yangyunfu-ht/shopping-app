<template>
  <app-drawer
    v-model="visible"
    title="新增商品"
    @open="handleOpen"
    @close="handleClose(ruleFormRef)"
    @confirm="handleConfirm(ruleFormRef)"
  >
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item
        label="Password"
        prop="pass"
      >
        <el-input
          v-model="ruleForm.pass"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="Confirm"
        prop="checkPass"
      >
        <el-input
          v-model="ruleForm.checkPass"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="Age"
        prop="age"
      >
        <el-input v-model.number="ruleForm.age" />
      </el-form-item>
      <el-form-item
        label="files"
        prop="files"
      >
        <el-upload v-model:file-list="ruleForm.files">
          <el-button type="primary">Click to upload</el-button>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500KB.
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
  </app-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules, UploadUserFile } from 'element-plus'

const ruleFormRef = ref<FormInstance>()

const checkAge = (_rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the age'))
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error('Please input digits'))
    } else {
      if (value < 18) {
        callback(new Error('Age must be greater than 18'))
      } else {
        callback()
      }
    }
  }, 1000)
}

const validatePass = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass')
    }
    callback()
  }
}
const validatePass2 = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}

const checkFiles = (_rule: any, value: UploadUserFile[], callback: any) => {
  if (value.length) {
    callback()
  } else {
    callback(new Error('就是就是计算机'))
  }
}

const ruleForm = reactive({
  pass: '',
  checkPass: '',
  age: '',
  files: [
    {
      name: 'element-plus-logo.svg',
      url: 'https://element-plus.org/images/element-plus-logo.svg',
    },
  ],
})

const rules = reactive<FormRules<typeof ruleForm>>({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  age: [{ validator: checkAge, trigger: 'blur' }],
  files: [{ validator: checkFiles, trigger: 'blur' }],
})

const visible = ref(false)

const handleOpen = () => {
  console.log('open')
}

const handleClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  console.log(formEl)
  formEl.resetFields()
}

const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    console.log(valid)
  })
}

const openDrawer = () => {
  visible.value = true
}

defineExpose({
  openDrawer,
})
</script>

<style lang="scss" scoped></style>
