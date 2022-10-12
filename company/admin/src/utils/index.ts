import { nextTick } from 'vue'

// 设置元素滚动位置
export const toScrollTop = (dom: HTMLElement, top: number) => {
  nextTick(() => {
      dom.scrollTop = top
  })
}

// 数组转化tree树形数组
export const handleTree = (data:any[], id:string='id', parentId:string='parentId', children:string='children') => {
  let treeArr: any[] = []
  for (let k in data) {
    if (!data[k][parentId]) {
      treeArr.push(data[k])
    }
  }

  childrenList(treeArr)
  function childrenList (arr: any[]) {
    arr.forEach((item: any) => {
      data.forEach((sub: any) => {
        if (item[id] === sub[parentId]) {
          item[children].push(sub)
        }
      })
      childrenList(item[children])
    })
  }
  return treeArr
}