<template>
  <div class="component theme" ref="box">
    <canvas class="myCanvasPlum" ref="myCanvasPlum"></canvas>
  </div>
</template>

<script lang="ts">
    export default { name: 'g-plum-tree' }
</script>
<script setup lang="ts">
    import { onMounted } from 'vue'
    const box = ref()
    const myCanvasPlum = ref()
    const state: any = reactive({
        canvas: null, // canvas实例
        ctx: null, // ctx 2d
        width: 0, // canvas的宽度
        height: 0, // canvas的高度
        deepMax: 3, // 最少递归次数
        lineLength: 3, // 最短树枝长度
        point: { // 存储起点
        x: 0,
        y: 0
        },
        pendingTasks: [], // 存储起任务，最后使用动画函数实现逐步画树
        frameCount: 0 // 控制动画函数多少帧画一次
    })

    onMounted(() => {
        state.canvas = myCanvasPlum as any
        state.ctx = state.canvas.getContext('2d')
        state.width = box.value.clientWidth
        state.height = box.value.clientHeight
        // 设置canvas的宽高
        state.canvas.width = state.width
        state.canvas.height = state.height
        // 上方梅花树
        const startTop = { x: twoBetween(200, state.width - 200), y: 0 }
        initCanvas(startTop, 'top')
        // 下方梅花树
        const startBottom = { x: twoBetween(200, state.width - 200), y: state.height }
        initCanvas(startBottom, 'bottom')
        // 左侧梅花树
        const startLeft = { x: 0, y: twoBetween(200, state.height - 200) }
        initCanvas(startLeft, 'left')
        // 右侧梅花树
        const startRight = { x: state.width, y: twoBetween(200, state.height - 200) }
        initCanvas(startRight, 'right')
        // 动画函数递归
        startFrame()
    })
    // 执行所有保存的函数
    const frame = () => {
        const tasks = [...state.pendingTasks]
        state.pendingTasks.length = 0
        tasks.forEach(fn => fn())
    }
    // 递归动画函数
    const startFrame = () => {
        requestAnimationFrame(() => {
            state.frameCount += 1
            if (state.frameCount % 3 === 0) frame()
            startFrame()
        })
    }
    // 初始化canvas
    const initCanvas = (start: any, directon: any) => {
        const angle = directon === 'top' ? Math.PI / 2 : directon === 'bottom' ? -Math.PI / 2 : directon === 'left' ? Math.PI / 16 : Math.PI
        const branch = {
            start,
            length: state.lineLength,
            angle
        }
        setup(branch)
    }
    // 画线并且保存到pendingTasks任务中
    const setup = (b: any, deepth = 0) => {
        const end = getEndPoint(b)
        drawBranch(b)

        if (deepth < state.deepMax || Math.random() < 0.5) {
        // 50%的概率或者不少于这个递归的次数，就添加到任务中
        state.pendingTasks.push(() => {
            setup({
                start: end,
                length: state.lineLength + twoBetween(1, 5),
                angle: b.angle - 0.3 * Math.random()
            }, deepth += 1)})
        }
        if (deepth < state.deepMax || Math.random() < 0.5) {
            state.pendingTasks.push(() => {setup({
                start: end,
                length: state.lineLength + twoBetween(1, 5),
                angle: b.angle + 0.3 * Math.random()
            }, deepth += 1)})
        }
    }
    // 传入上一次的坐标以及最新的长度和角度，生成最新坐标并且画线
    const drawBranch = (branch: any) => {
        const { start, length, angle } = branch
        const end = getEndPoint(branch)
        lineTo(start, end)
    }
    // 画线，并且随机颜色
    const lineTo = (start: any, end: any) => {
        const ctx = state.ctx as any
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        const r = twoBetween(200, 255)
        const g = twoBetween(200, 255)
        const b = twoBetween(200, 255)
        ctx.strokeStyle = `rgb(${r},${g},${b})`
        ctx.lineWidth = 1
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
    }
    // 根据上一次坐标以及长度和角度生成最新的坐标
    const getEndPoint = (branch: any) => {
        const { start, length, angle } = branch
        return {
            x: start.x + length * Math.cos(angle),
            y: start.y + length * Math.sin(angle)
        }
    }
    // 取两数之间的随机数
    const twoBetween = (num1: number, num2: number) => {
        return Math.floor(Math.random() * (num2 - num1) + num1)
    }
</script>

<style lang="scss" scoped>
    .component {
        width: 100%;
        height: 100%;
    }
</style>