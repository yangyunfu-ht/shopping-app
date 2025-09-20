import type { RouteRecordNameGeneric } from 'vue-router'

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

export interface Tag {
    fullPath: string
    meta: Meta
    name: RouteRecordNameGeneric
}