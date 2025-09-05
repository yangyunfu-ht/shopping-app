<template>
  <div class="login-page">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>登录</span>
        </div>
      </template>

      <el-form
        ref="loginRef"
        :model="loginForm"
        :rules="rules"
        label-width="80px"
        hide-required-asterisk
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="loginForm.username" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="loginForm.password"
            type="password"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onLogin(loginRef)"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, useTemplateRef } from 'vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { useRouter } from 'vue-router'

interface LoginForm {
  username: string
  password: string
}

const router = useRouter()

const loginRef = useTemplateRef('loginRef')
const loginForm = reactive({
  username: '',
  password: '',
})
const rules = reactive<Record<keyof LoginForm, FormItemRule[]>>({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
})

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      localStorage.setItem('token', 'token')

      router.replace({ path: '/home/homePage' })
    }
  })
}
</script>

<style lang="scss" scoped>
@use '@/styles/loginPage.scss';
</style>
