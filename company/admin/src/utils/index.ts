import { nextTick } from 'vue'

// 设置元素滚动位置
export const toScrollTop = (dom: HTMLElement, top: number) => {
  nextTick(() => {
      dom.scrollTop = top
  })
}