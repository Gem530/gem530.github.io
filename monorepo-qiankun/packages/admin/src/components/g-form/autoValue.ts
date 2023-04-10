import { chineseList } from './chinese'
import { twoNumberBetween } from '@/utils'

export const createChinese = (len: number = 4) => {
  let str = ''
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(chineseList[twoNumberBetween(0, chineseList.length - 1)])
  }
  return str
}

export const createNumber = (max: number = 3) => {
  return twoNumberBetween(0, max)
}