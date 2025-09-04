export interface DynamicRoute {
    path: string
    name: string
    component: string
    children?: DynamicRoute[]
    meta?: Record<string, any>
}