<template>
  <div class="component theme" ref="box">
    <canvas
        class="myCanvas"
        ref="myCanvasRef"
        @mousedown="start"
        @mousemove="move"
        @mouseup="end"
        @touchStart="start"
        @touchMove="move"
        @touchEnd="end"
    ></canvas>
  </div>
</template>

<script setup lang="ts" name='g-draw-font'>
    import { ref, reactive, onMounted, defineProps } from 'vue'
    const myCanvasRef = ref()
    const box = ref()
    const props = withDefaults(defineProps<{
        text?: string
    }>(), {
        text: '富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善、'
    })
    const state: any = reactive({
        canvas: null, // canvas实例
        ctx: null, // 2d
        width: 0, // canvas宽
        height: 0, // canvas高
        text: '', // 文字
        textIndex: 0, // 文字下标
        fontSize: 5, // 字体字号
        isPc: true, // true PC端  false 移动端
        downFlag: false, // 鼠标是否按下
        point: {
            pageX: 0,
            pageY: 0
        }
    })
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
            state.isPc = false
        } else {
            state.isPc = true
        }
        state.width = 600
        state.height = 600
        init()
    })
    const init = () => {
        state.canvas = myCanvasRef
        state.ctx = state.canvas.getContext('2d')
        state.canvas.width = state.width
        state.canvas.height = state.height
        // this.ctx.fillText(this.text,0,20)
    }
    const returnXY = (event: MouseEvent|any) => {
        // return new Promise((resolve, reject))
        // 鼠标按下时的x/y坐标
        let e = { pageX: 0, pageY: 0 }
        if (!state.isPc) {
            // 移动端
            const eventNew: TouchEvent = event
            e = { pageX: eventNew.touches[0].pageX, pageY: eventNew.touches[0].pageY }
        } else {
            e = { pageX: event.pageX, pageY: event.pageY }
        }
        return e
    }
    const start = (event: MouseEvent) => {
        const e = returnXY(event)
        // console.log('start', e)
        state.downFlag = true
        state.point = {
            pageX: e.pageX,
            pageY: e.pageY
        }
    }
    const move = (event: MouseEvent) => {
        if (!state.downFlag) return
        const e = returnXY(event)
        const ctx = state.ctx as any
        // div.getBoundingClientRect().top 获取当前元素离屏幕顶部距离
        const top = box.value.getBoundingClientRect().top
        const left = box.value.getBoundingClientRect().left

        const width = betweenLength(e, state.point) // 移动间距
        const text = props.text[state.textIndex] // 当前文字
        const fontSzie = state.fontSize + width / 2 // 文字大小
        const textWidths = textWidth(fontSzie, text) // 当前文字的宽度
        var angle = Math.atan2(e.pageY - state.point.pageY, e.pageX - state.point.pageX) // 计算偏离角度

        if (width > textWidths) {
            // 文字绘制
            ctx.font = fontSzie + "px Arial" // 文字大小以及字体
            ctx.fillStyle = returnColor() // 文字颜色
            ctx.save() // 保存当前图像状态的一份拷贝  可以保存canvas的原点和旋转角度
            ctx.translate(state.point.pageX - left, state.point.pageY - top)
            ctx.rotate(angle)
            ctx.fillText(text, 0, 0)
            ctx.restore() // restore() 方法从栈中弹出存储的图形状态并恢复 CanvasRenderingContext2D 对象的属性、剪切路径和变换矩阵的值  可以取出save保存的canvas的原点和旋转角度

            state.textIndex = state.textIndex >= (props.text.length - 1) ? 0 : (state.textIndex + 1) // 文字下标更新
            // console.log('move', width, textWidth, e)
            state.point = { // 更新鼠标/手指位置
                pageX: e.pageX,
                pageY: e.pageY
            }
        }
    }
    const end = (event: MouseEvent) => {
        const e = returnXY(event)
        // console.log('end', e)
        state.downFlag = false
        state.textIndex = 0
    }
    const returnColor = () => {
        const r = twoBetween(0, 255)
        const g = twoBetween(0, 255)
        const b = twoBetween(0, 255)
        return `rgb(${r},${g},${b})`
    }
    // 取两数之间的随机数
    const twoBetween = (num1: number, num2: number) => {
        return Math.floor(Math.random() * (num2 - num1) + num1)
    }
    // 计算间距
    const betweenLength = (p1: any, p2: any) => {
        return Math.sqrt(Math.pow(p2.pageX - p1.pageX, 2) + Math.pow(p2.pageY - p1.pageY, 2));
    }
    // 获取文字宽度
    const textWidth = (fontSize: number, text: string) => {
        const ctx = state.ctx as any
        ctx.font = fontSize + "px Arial";
        if(ctx.fillText){
            return ctx.measureText(text).width;
        }else if(ctx.mozDrawText){
            return ctx.mozMeasureText(text);
        }
    }
</script>

<style lang="scss" scoped>
.myCanvas {
    border: 1px solid #000;
}
</style>