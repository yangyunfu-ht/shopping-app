import { createApp } from 'vue'
import App from './App.tsx'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'normalize.css'
import '@/styles/style.scss'

import router from '@/router'
import store from '@/store'

// 注册全局指令
import directives from '@/directives'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(directives)
app.mount('#app')
