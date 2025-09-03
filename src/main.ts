import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 注册全局指令
import directives from '@/directives'

const app = createApp(App)
app.use(directives)
app.mount('#app')
