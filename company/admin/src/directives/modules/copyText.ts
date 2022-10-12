export default {
  name: 'copy',
  fn: {
    mounted(el: any, { value, arg }: any) {
      copyTextHandle(el, { value, arg })
    },
    updated(el: any, { value, arg }: any) {
      copyTextHandle(el, { value, arg })
    },
  }
}

const copyTextHandle = (el: any, { value, arg }: any) => {
  if (arg === "callback") {
    el.$copyCallback = value;
  } else {
    el.$copyValue = value;
    const handler = () => {
      copyTextToClipboard(el.$copyValue);
      if (el.$copyValue === null || el.$copyValue === undefined || el.$copyValue === '') return
      if (el.$copyCallback) {
        el.$copyCallback(el.$copyValue);
      }
    };
    // el.addEventListener("click", handler); // 经过update事件后，会触发多次
    el.onclick = handler // 经过update事件后，只会触发一次
  }
}

const copyTextToClipboard = (input: any, { target = document.body } = {}) => {
    if (!input) {
      // 值为空的时候，给出提示。可根据项目UI仔细设计
      console.log('无复制内容')
      return
    }
    // 动态创建 textarea 标签
    const textarea: any = document.createElement('textarea')
    // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
    textarea.readOnly = 'readonly'
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    // 将要 copy 的值赋给 textarea 标签的 value 属性
    textarea.value = input
    // 将 textarea 插入到 body 中
    document.body.appendChild(textarea)
    // 选中值并复制
    textarea.select()
    const result = document.execCommand('Copy')
    if (result) {
      console.log('复制成功') // 可根据项目UI仔细设计
    }
    document.body.removeChild(textarea)
}
