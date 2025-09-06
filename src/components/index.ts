import type { App } from 'vue'
import pageLayout from './pageLayout/index.vue'
import gridTable from './gridTable/index.vue'
import svgIcon from './svgIcon/svgIcon'

const globalComponent = [
  {
    name: 'pageLayout',
    component: pageLayout,
  },
  {
    name: 'gridTable',
    component: gridTable,
  },
  {
    name: 'svgIcon',
    component: svgIcon,
  },
]

export default function install(app: App) {
  for (const { name, component } of globalComponent) {
    app.component(name, component)
  }
}
