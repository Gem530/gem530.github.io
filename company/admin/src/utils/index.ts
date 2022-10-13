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

// 深拷贝 https://www.cnblogs.com/kirkor-sort/p/13022427.html?ivk_sa=1024320u
export const cloneDeep = (obj: any) => {
  // 3.根据obj为对象或者数组，产生一个空的对象或数组，存放数据
  var newobj: any = obj instanceof Array ? [] : {}
  // 1.for...in进入循环
  for (var k in obj) {
    // 2.判断对象的第一个属性是否为数组或者对象，如果是，则进入递归
    // if (obj[k] instanceof Array) {
    //   newobj[k] = cloneDeep(obj[k])
    // } else if (obj[k] instanceof Object) {
    //   newobj[k] = cloneDeep(obj[k])
    // }
    // 4.上面两个执行逻辑一样，进行合并
    if (typeof obj[k] === 'object') {
      newobj[k] = cloneDeep(obj[k])
    } else {
      // 5.如果数据为基本类型，则直接赋值
      newobj[k] = obj[k]
    }
  }
  // 6.把存放了数据的新对象返回出去
  return newobj
}