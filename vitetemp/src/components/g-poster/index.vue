<template>
    <div class="canvas-box component theme" ref="canvasParent">
        <canvas id="mycanvas" ref="canvas"></canvas>
    </div>
</template>

<script lang="ts">
export default { name: 'g-poster' }
</script>
<script setup lang="ts">
    import { onMounted, nextTick, defineProps } from 'vue'
    const canvas: any = ref()
    const canvasParent: any = ref()
    const props = defineProps<{
        list: any[]
    }>()
    const state: any = reactive({
        width: 0, // canvas宽度
        height: 0, // canvas高度
    })
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted')
        state.width = canvasParent.value.clientWidth // 获取包裹canvas的外层盒子宽度
        state.height = canvasParent.value.clientHeight // 获取包裹canvas的外层盒子高度
        // 设置canvas的宽高，不能使用css控制canvas宽高  使用css控制canvas宽高，会导致canvas绘制的内容变形
        // 必须使用标签上的width和height来修改canvas宽高，这是canvas自带的参数
        canvas.value.width = state.width
        canvas.value.height = state.height

        nextTick(() => {
            draw()
        })
    })

    const draw = async () => {
        const ctx = canvas.value.getContext('2d')
        for (let i = 0; i < props.list.length; i++) {
            const item = props.list[i]
            if (item.type === 'image') {
                // 绘制图片
                await drawImage(ctx, item.url, item.x, item.y, item.width, item.height)
            }
            if (item.type === 'text') {
                // 绘制文字
                await drawText(ctx, item.url, item.x, item.y, item.color, item.font)
            }
        }

        // // 导入底图
        // const baseImg: any = new Image()
        // baseImg.crossorigin = 'Anonymous'
        // baseImg.src = 'https://gem530.github.io/img/u=118500493,3886661582&fm=26&fmt=auto&gp=0.jpg'
        // // 导入头像
        // const avatorImg: any = new Image()
        // avatorImg.crossorigin = 'Anonymous'
        // avatorImg.src = 'https://gem530.github.io/img/lADPD26eNnXBjezNAuPNAuM_739_739.jpg'

        // // // 绘制底图
        // // drawImage(ctx, 'https://gem530.github.io/img/u=1819817697,2457372120&fm=26&fmt=auto&gp=0.jpg', 0, 0, state.width, state.height).then(() => {
        // //     // 绘制文字 由于图片需要等待加载完毕才能绘制，导致文字会被遮挡。所以使用promise，文字放在那张图片的上层，就在哪个方法的then里绘制文字
        // //     drawText(ctx, '绘制文字', 100, 640)
        // // })
        // await drawImage(ctx, 'https://gem530.github.io/img/u=1819817697,2457372120&fm=26&fmt=auto&gp=0.jpg', 0, 0, state.width, state.height)
        // // 绘制头像
        // await drawImage(ctx, 'https://gem530.github.io/img/lADPD26eNnXBjezNAuPNAuM_739_739.jpg', 10, 630, 70, 70)
        // // 绘制文字 由于图片需要等待加载完毕才能绘制，导致文字会被遮挡。所以使用promise，文字放在那张图片的上层，就在哪个方法的then里绘制文字
        // await drawText(ctx, '绘制文字', 100, 640)
    }

    // 绘制图片封装
    const drawImage = (ctx: any, dom: any, x: number, y: number, width: number, height: number) => {
        return new Promise((resolve, reject) => {
            // 导入图片
            const img: any = new Image()
            img.crossorigin = 'Anonymous'
            img.src = dom
            img.onload = () => {
                // 图片加载完 开始绘制图片
                ctx.beginPath()
                ctx.drawImage(img, x, y, width, height)
                resolve(true)
            }
            img.onerror = () => {
                reject()
            }
        })
    }

    // 绘制文字封装
    const drawText = (ctx: any, dom: any, x: number, y: number, color: string, font: string = '16px Arial') => {
        return new Promise(resolve => {
            // 绘制文字
            ctx.beginPath()
            ctx.font = font
            ctx.fillStyle = color
            ctx.fillText(dom, x, y)
            resolve(true)
        })
    }
</script>

<style lang="scss" scoped>
    .canvas-box {
      width: 100%;
      height: 100%;
    }
</style>