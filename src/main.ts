import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import App from './App.tsx'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import 'element-plus/theme-chalk/dark/css-vars.css'
import 'normalize.css'
import '@/styles/style.scss'

import router from '@/router'
import store from '@/store'

import directives from '@/directives'
import components from '@/components'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(directives)
app.use(components)
app.mount('#app')
