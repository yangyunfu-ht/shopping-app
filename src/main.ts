import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import App from './app.tsx'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import 'element-plus/dist/index.css'
import 'normalize.css'
import './styles/style.scss'

import router from './router'
import store from './store'

import directives from './directives'
import components from './components'

const startApp = async () => {
  const app = createApp(App)
  app.use(router)
  app.use(store)
  app.use(directives)
  app.use(components)
  app.mount('#app')
}

startApp()
// .then(() => {
//   window.addEventListener('load', async () => {
//     try {
//       const module = await import('@/utils/updateUser.ts')
//       const { updateUser } = module

//       await updateUser()
//     } catch (error) {
//       console.log(error)
//     }
//   })
// })
