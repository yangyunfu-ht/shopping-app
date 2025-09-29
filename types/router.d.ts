import type { RouteRecordNameGeneric } from 'vue-router'

export interface Menu {
    component: string
    componentName: string
    icon: string
    id: number
    keepAlive: boolean
    name: string
    parentId: number
    path: string
    visible: boolean
    children: Menu[] | null
}

export interface Meta {
    icon?: string
    keepAlive: boolean
    visible: boolean
    name: string
   [key: string]: any
}

export interface Tag {
    fullPath: string
    meta: Meta
    name: RouteRecordNameGeneric
}