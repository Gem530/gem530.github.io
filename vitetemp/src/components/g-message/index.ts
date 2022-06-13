    // 引入创建虚拟节点和渲染方法
    import { createVNode, render } from "vue"
    import tip from "./index.vue";

    interface obj {
        message: string,
        type?: string,
        duration?: number
    }

    export default (data: obj) => {
        // 定义一个div容器
        const div = document.createElement("div")
        div.setAttribute('class', 'g-message-box')
        // 将定义的容器添加到dom上
        document.body.appendChild(div)
    
        // 定义定时器：一定时间后清除
        let timer: null|ReturnType<typeof setTimeout> = null

        const { message, type } = data
        // 调用创建虚拟节点方法
        // 第一个参数为要创建的虚拟节点即编写好的vue组件
        // 第二个参数为props的参数
        const vnode = createVNode(tip, { message, type })
        const list = document.querySelectorAll('.g-message-box')
        div.style.top = (list.length * 50) + (list.length * 10) + 'px'
        // 调用渲染方法：将虚拟节点渲染到dom中
        render(vnode, div)
        // 开启定时器，若原先存在则先进行清除
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            render(null, div)
            document.body.removeChild(div)
            const list1 = document.querySelectorAll('.g-message-box')
            list1.forEach((item: any) => {
                let top = item.style.top
                // console.log('before', top, top.substring(0, top.length - 2), item)
                item.style.top = (top.substring(0, top.length - 2)) - 60 + 'px'
                // console.log('after', item.style.top)
            })
        }, data.duration || 1000)
    }