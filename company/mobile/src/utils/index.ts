// 类型判断
export const type = (param: any) => {
  // es6中null的类型为object
  if(param === null){
    return param+''
  }
  if(typeof param === 'object'){        
    let val = Object.prototype.toString.call(param).split(' ')[1]
    let type = val.substr(0,val.length-1).toLowerCase()
    return type
  }else {
    return typeof param
  }
}

// 一维数组变为二维数组 [1,2,3,4,5,6] => [[1,2,3], [4,5,6]]
export const toArrayTwo = (arr: any[], num: number) => {
  let newArr = []
  for (let i = 0; i < arr.length; i+=num) {
    newArr.push(arr.slice(i, i+3))
  }
  return newArr
}