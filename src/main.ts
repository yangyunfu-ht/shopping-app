import { createApp } from 'vue'
import './style.css'
import 'normalize.css'
import App from './App.vue'

import router from '@/router'
import store from '@/store'

// 注册全局指令
import directives from '@/directives'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(directives)
app.mount('#app')
