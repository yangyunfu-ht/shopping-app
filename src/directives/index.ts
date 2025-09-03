import type { App } from 'vue'
import { permission } from './permission'

const directives = [
  {
    name: 'permission',
    directive: permission,
  },
]

export default function install(app: App) {
  for (const { name, directive } of directives) {
    app.directive(name, directive)
  }
}
