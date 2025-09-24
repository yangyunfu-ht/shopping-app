export const uniqueArray = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr))
}

export interface FlatNode {
  id: string | number
  parentId: string | number | null
  [key: string]: any
}
export interface TreeNode extends FlatNode {
  children?: TreeNode[]
}

export function buildTree<T extends FlatNode>(
  list: T[],
  idKey: keyof T = 'id',
  parentIdKey: keyof T = 'parentId',
  childrenKey: string = 'children'
): TreeNode[] {
  const map = new Map<string | number, TreeNode>()
  const tree: TreeNode[] = []

  list.forEach((item) => {
    const node: TreeNode = { ...item, [childrenKey]: [] }
    map.set(item[idKey] as string | number, node)
  })

  list.forEach((item) => {
    const node = map.get(item[idKey] as string | number)!
    const parent = map.get(item[parentIdKey] as string | number)

    if (parent) {
      parent.children!.push(node)
    } else {
      tree.push(node)
    }
  })

  return tree
}
