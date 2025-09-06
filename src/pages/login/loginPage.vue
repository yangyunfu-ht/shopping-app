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
/* 整个登录页面的背景 */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('https://picsum.photos/1920/1080'); /* Replace with your background image */
  background-size: cover;
  background-position: center;
}

/* 登录卡片容器 */
.login-card {
  width: 400px;
  max-width: 90%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.1); /* Semi-transparent background */
  backdrop-filter: blur(10px); /* The key for the frosted glass effect */
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Adjust Element Plus components for better visibility */
:deep(.el-input__inner) {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  backdrop-filter: blur(5px);
}

:deep(.el-form-item__label) {
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* Make sure the placeholder text is visible */
:deep(.el-input__inner::placeholder) {
  color: #ccc;
}
</style>
