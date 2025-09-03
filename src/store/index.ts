import { createPinia } from 'pinia'
import piniaPluginPersisredstats from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersisredstats)

export default pinia
