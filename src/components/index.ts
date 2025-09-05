import type { App } from 'vue'
import pageLayout from './pageLayout.vue'
import gridTable from './gridTable.vue'
import svgIcon from './svgIcon.tsx'

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
