import type { App } from 'vue'
import pageLayout from './pageLayout/index.vue'
import gridTable from './gridTable/index.vue'
import svgIcon from './svgIcon/svgIcon'
import searchCollapse from './searchCollapse/index.vue'

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
  {
    name: 'searchCollapse',
    component: searchCollapse,
  },
]

export default function install(app: App) {
  for (const { name, component } of globalComponent) {
    app.component(name, component)
  }
}
