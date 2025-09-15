export interface Meta {
    keepAlive: boolean
    title: string
    icon?: string
   [key: string]: any
}

export interface DynamicRoute {
    path: string
    name: string
    component: string
    children?: DynamicRoute[]
    meta?: Meta
}