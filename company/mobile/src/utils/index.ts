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