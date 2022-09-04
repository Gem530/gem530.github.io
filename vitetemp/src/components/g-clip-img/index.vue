<template>
    <div class="component theme">
        <!-- 图片裁剪组件 -->
        <canvas id="canvas" ref="myCanvas" :width="props.width" :height="props.height"></canvas>
        <img :src="imgUrl" alt="">
        <div>
            <button @click="clipHandle">裁剪</button>
        </div>
    </div>
</template>

<!-- <script lang="ts">
    export default { name: 'g-clip-img' }
</script> -->
<script setup lang="ts" name="g-clip-img">
    import { ref, onMounted } from 'vue'
    import { fabric } from 'fabric'
    import imgLocal from '@/assets/img/login.jpeg'
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted')
        init()
    })
    const props = defineProps({
        width: {
            type: Number,
            default: 500
        },
        height: {
            type: Number,
            default: 500
        },
        x: {
            type: Number,
            default: 250
        },
        y: {
            type: Number,
            default: 250
        },
        clipWidth: {
            type: Number,
            default: 100
        },
        clipHeight: {
            type: Number,
            default: 100
        },
        maskColor: {
            type: String,
            default: 'rgba(0, 0, 0, 0.5)'
        }
    })
    const myCanvas = ref()
    const imgUrl = ref('')
    const top = props.y - (props.clipHeight / 2)
    const left = props.x - (props.clipWidth / 2)
    const canvasRef = ref(null)
    // const scale = reactive({
    //     x: 1,
    //     y: 1
    // })

    const init = () => {
        const width = props.width
        const height  = props.height
        const right = props.x + (props.clipWidth / 2)
        const bottom = props.y + (props.clipHeight / 2)
        const maskColor = props.maskColor
        const canvas = new fabric.Canvas('canvas', {
            width,
            height,
            preserveObjectStacking: true
        })

        fabric.Image.fromURL(imgLocal, img => {
            const imgWidth = img.width > width ? width : img.width
            const imgHeight = img.height > height ? height : img.height
            imgWidth >= imgHeight ? img.scaleToWidth(imgWidth) : img.scaleToHeight(imgHeight)

            img.top = height / 2
            img.left = width / 2
            img.originX = 'center'
            img.originY = 'center'
            img.cornerStyle = 'circle'
            canvas.add(img)

            const group = new fabric.Group([
                new fabric.Rect({ width, height: top + 0.08, fill: maskColor, top: 0, left: 0 }), // 上
                new fabric.Rect({ width: width - right, height: bottom - top, fill: maskColor, top, left: right }), // 右
                new fabric.Rect({ width, height: height - bottom, fill: maskColor, top: bottom - 0.06, left: 0 }), // 下
                new fabric.Rect({ width: left, height: bottom - top, fill: maskColor, top, left: 0 }), // 左
            ])
            group.evented = false
            group.selectable = false
            canvas.add(group)

            canvas.on("mouse:wheel", function(event) {
                const { e } = event
                var zoomX = (e.deltaY > 0 ? -0.1 : 0.1) + img.scaleX;
                var zoomY = (e.deltaY > 0 ? -0.1 : 0.1) + img.scaleY;
                zoomX = Math.max(0.1, zoomX); //最小为原来的1/10
                zoomX = Math.min(3, zoomX); //最大是原来的3倍
                zoomY = Math.max(0.1, zoomY); //最小为原来的1/10
                zoomY = Math.min(3, zoomY); //最大是原来的3倍
                img.scaleX = zoomX
                img.scaleY = zoomY
                canvas.renderAll()
                canvasRef.value = canvas
            });
            canvasRef.value = canvas
        })
    }

    const clipHandle = () => {
        console.log(canvasRef.value.img)
        const tempURL = canvasRef.value.toDataURL({
            format: 'png',
            left,
            top,
            width: props.clipWidth,
            height: props.clipHeight,
            quality: 1
        })
        imgUrl.value = tempURL
        console.log(imgUrl.value)
    }
</script>

<style lang="scss" scoped>

</style>