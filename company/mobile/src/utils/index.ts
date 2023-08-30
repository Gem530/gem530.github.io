import {
  nextTick,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
} from 'vue'

// 判断是否为移动端
export const isMobile = () => {
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
}

// 封装keep-alive缓存时，初始mounted
export const mounted = (callback: Function) => {
  onMounted(() => {
      callback && callback()
  })
  onActivated(() => {
      callback && callback()
  })
}
export const unMounted = (callback: Function) => {
  onUnmounted(() => {
      callback && callback()
  })
  onDeactivated(() => {
      callback && callback()
  })
}

// 指定位置插入字符 source源字符串 start要插入的位置 newStr插入的字符串
export const insertStr = (source: string, start: number, newStr: string) => {
  return source.slice(0, start) + newStr + source.slice(start)
}

// 取两数之间的随机整数
export const twoNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}

// 返回随机颜色
export const returnColor = (min: number = 0, max: number = 255, o: number = 1) => {
    const r = twoNumberBetween(min, max)
    const g = twoNumberBetween(min, max)
    const b = twoNumberBetween(min, max)
    return `rgba(${r},${g},${b},${o})`
}

// 判断变量类型 返回小写单词
export const isType = (val: any) => {
  let type = Object.prototype.toString.call(val).replace(']', '').split(' ')[1].toLocaleLowerCase()
  return type
}

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

// 一维数组变为二维数组 [1,2,3,4,5,6] => [[1,2,3], [4,5,6]]
export const toArrayTwo = (arr: any[], num: number) => {
  let newArr = []
  for (let i = 0; i < arr.length; i+=num) {
    newArr.push(arr.slice(i, i+num))
  }
  return newArr
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
    if (['object', 'array'].includes(isType(obj[k]))) {
    // if (typeof obj[k] === 'object') {
      newobj[k] = cloneDeep(obj[k])
    } else {
      // 5.如果数据为基本类型，则直接赋值
      newobj[k] = obj[k]
    }
  }
  // 6.把存放了数据的新对象返回出去
  return newobj
}


/**
 * 脱敏公用
 * @param str 脱敏字符串
 * @param begin 起始保留长度，从0开始
 * @param end 结束保留长度，到str.length结束
 * @returns {string}
 */
export const desensitizedCommon = (str: string, begin: number = 3, end: number = 4, symbol: string = '*') => {
  if (!str || (begin + end) >= str.length) {
      return "";
  }
  if(str.indexOf(symbol)!==-1){
      return str;
  }

  let leftStr = str.substring(0, begin);
  let rightStr = str.substring(str.length - end, str.length);

  let strCon = ''
  for (let i = 0; i < str.length - end - begin; i++) {
      strCon += symbol;
  }
  return leftStr + strCon + rightStr;
}