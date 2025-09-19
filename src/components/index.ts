import type { App } from 'vue'
import pageLayout from './pageLayout/index.vue'
import gridTable from './gridTable/index.vue'
import baseTable from './baseTable/baseTable'
import svgIcon from './svgIcon/svgIcon'
import searchCollapse from './searchCollapse/index.vue'
import appDrawer from './appDrawer/index.vue'
import appModal from './appModal/index.vue'
import appEcharts from './appEcharts/appEcharts'

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
    name: 'baseTable',
    component: baseTable,
  },
  {
    name: 'svgIcon',
    component: svgIcon,
  },
  {
    name: 'searchCollapse',
    component: searchCollapse,
  },
  {
    name: 'appDrawer',
    component: appDrawer,
  },
  {
    name: 'appModal',
    component: appModal,
  },
  {
    name: 'appEcharts',
    component: appEcharts,
  },
]

export default function install(app: App) {
  for (const { name, component } of globalComponent) {
    app.component(name, component)
  }
}
