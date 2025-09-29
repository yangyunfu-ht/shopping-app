export interface Menu {
    alwaysShow: boolean
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