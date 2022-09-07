<template>
    <div class="component theme" :style="`width: ${props.width}px;`">
        <!-- 图片裁剪组件 -->
        <canvas id="canvas" ref="myCanvas" :width="props.width" :height="props.height"></canvas>
        <img :src="imgUrl" alt="">
        <div class="flex">
            <button @click="handleScale('-')">-</button>
            <input
                type="range"
                v-model="step"
                :min="1"
                :max="props.maxScale"
                :step="props.scaleStep"
                @input="handleScale('change')"
            />
            <button @click="handleScale('+')">+</button>
            <button @click="initScle">1:1还原</button>
            <button @click="clipHandle">裁剪</button>
        </div>
    </div>
</template>

<script setup lang="ts" name="g-img-overlays">
    import { ref, onMounted } from 'vue'
    import { fabric } from 'fabric'
    import defaultImg from '@/assets/img/login.jpeg'
    const props = defineProps({
        width: {
            type: Number,
            default: 500
        },
        height: {
            type: Number,
            default: 500
        },
        maxScale: {
            type: Number,
            default: 3
        },
        scaleStep: {
            type: Number,
            default: 0.01
        },
        img: {
            type: String,
            default: defaultImg
        }
    })

    const state = reactive({
        isMove: false,
        isCreateObject: true
    })

    const emits = defineEmits(['getImg'])

    const myCanvas = ref()
    const uploadInput = ref()
    const imgValue = ref(null)
    const canvasRef = ref<any>(null)

    const imgUrl = ref(undefined)
    // const imgSizes = ref([])
    // const imgShowList = ref([])
    const imgLocal = ref(props.img)

    const step = ref(1)
    const fTop = ref(0)
    const fLeft = ref(0)
    const initStep = ref(1)
    const width = props.width
    const height = props.height

    nextTick(() => {
        fTop.value = myCanvas.value.getBoundingClientRect().top
        fLeft.value = myCanvas.value.getBoundingClientRect().left
    })

    // imgSizes.value = [...props.imgSizes, ...[props.clipWidth]].sort((a, b) => { return a - b })

    onMounted(() => {
        init()
    })

    const init = async () => {
        const canvas = new fabric.Canvas('canvas', {
            width,
            height,
            // preserveObjectStacking: true // true 选中控件后不会置顶层级
        })

        const img = await imgInit()
        imgStyleInit()
        imgSizeInit()
        // canvas.add(img)
        canvas.setBackgroundImage(img)
        canvas.renderAll()
        fabricHandleEvent(canvas)

        canvasRef.value = canvas
        // mouseWheelHandle()
    }

    // fabric事件
    const fabricHandleEvent = (canvas) => {
        canvas.on({
            'mouse:up': (e) => mouseUpHandle(e, canvas),
            'mouse:move': (e) => mouseMoveHandle(e, canvas), 
            'mouse:down': (e) => mouseDownHandle(e, canvas),
            'mouse:wheel': (e) => mouseWheelHandle(e),
        })
    }

    // 1:1还原缩放
    const initScle = () => {
        ImgScaleHandle('init', width/2, height/2)
    }

    // 控制缩放
    const handleScale = (type: string) => {
        ImgScaleHandle(type, width/2, height/2)
    }

    // 鼠标滚轮缩放
    const mouseWheelHandle = ({ e }) => {
        const type = e.deltaY < 0 ? '+' : '-'
        ImgScaleHandle(type, e.pageX - fLeft.value, e.pageY - fTop.value)
    }

    // 鼠标按下
    const mouseDownHandle = ({ e }, canvas) => {
        canvas.isDragging = true // isDragging 是自定义的
        canvas.lastPosX = e.clientX // lastPosX 是自定义的
        canvas.lastPosY = e.clientY // lastPosY 是自定义的
        console.log(canvas.lastPosY, canvas.lastPosX)
    }

    // 鼠标移动
    const mouseMoveHandle = ({ e }, canvas) => {
        if (canvas.isDragging) {
            if (state.isMove) {
                // 是否可以移动
                let vpt = canvas.viewportTransform // 聚焦视图的转换
                vpt[4] += e.clientX - canvas.lastPosX
                vpt[5] += e.clientY - canvas.lastPosY
                canvas.requestRenderAll()
                canvas.lastPosX = e.clientX
                canvas.lastPosY = e.clientY
            }
        }
    }

    // 鼠标抬起
    const mouseUpHandle = ({ e }, canvas) => {
        // console.log(e)
        if (state.isCreateObject) {
            console.log(e.clientY, e.clientX, e.clientX - canvas.lastPosX, e.clientY - canvas.lastPosY)
            createRect(canvas, canvas.lastPosY, canvas.lastPosX, e.clientX - canvas.lastPosX, e.clientY - canvas.lastPosY, e)
        }
        canvas.setViewportTransform(canvas.viewportTransform) // 设置此画布实例的视口转换
        canvas.isDragging = false
    }

    // 生成矩形
    const createRect = (canvas, top, left, width, height, e) => {
        console.log(top, left, width, height, e.offsetX, e.offsetY, fLeft.value, fTop.value)
        // top = top - fTop.value
        // left = left - fLeft.value

        // top = (top - fTop.value) / step.value
        // left = (left - fLeft.value) / step.value
        top = (top - fTop.value)
        left = (left - fLeft.value)
        width = width / step.value
        height = height / step.value
        console.log(top, left, width, height)
        const rect = new fabric.Rect({ width, height, fill: 'pink', top, left })
        // const rect = new fabric.Rect({ width, height: top + 0.08, fill: 'pink', top: 0, left: 0 })
        canvas.add(rect)
    }

    // 图片初始化
    const imgStyleInit = () => {
        imgValue.value.top = height / 2
        imgValue.value.left = width / 2
        imgValue.value.originX = 'center'
        imgValue.value.originY = 'center'
        imgValue.value.cornerStyle = 'circle'

        imgValue.value.rotate(0)
    }

    // canvas缩放
    const ImgScaleHandle = (type: string, x: number, y: number) => {
        let zoom = undefined
        if (type == 'change') zoom = step.value
        else if (type == 'init') {
            zoom = 1
            const arr = [1, 0, 0, 1, 0, 0]
            canvasRef.value.setViewportTransform(arr)
        }
        else {
            zoom = (type == '-' ? -props.scaleStep : props.scaleStep) + canvasRef.value.getZoom()
        }
        zoom = Math.max(1, zoom) //最小为原来的1/10
        zoom = Math.min(props.maxScale, zoom) //最大是原来的3倍
        // console.log(zoom, initStep.value)
        const zoomPoint = new fabric.Point(x, y)
        canvasRef.value.zoomToPoint(zoomPoint, zoom)
        step.value = zoom
    }

    // 图片大小初始化
    const imgSizeInit = () => {
        const imgWidth = imgValue.value.width > width ? width / imgValue.value.width : imgValue.value.width / width
        const imgHeight = imgValue.value.height > height ? height / imgValue.value.height : imgValue.value.height / width
        const scale = imgWidth <= imgHeight ? imgWidth : imgHeight
        imgValue.value.scaleX = scale
        imgValue.value.scaleY = scale

        initStep.value = scale
    }

    // 图片渲染
    const imgInit = () => {
        return new Promise((resolve, reject) => {
            fabric.Image.fromURL(imgLocal.value, img => {
                imgValue.value = img
                resolve(img)
            })
        })
    }

    // 返回base64图片
    const toBase64 = (quality: Number = 1, format: String = 'png') => {
        return canvasRef.value.toDataURL({ top: 0, left: 0, width, height, format, quality })
    }

    // 截图
    const clipHandle = () => {
        imgUrl.value = toBase64()
        const blobs = convertBase64UrlToBlob(imgUrl.value)
        emits('getImg', {
            url: imgUrl.value,
            blob: blobs
        })
        // imgSizes.value.forEach((valW) => {
        //     console.log(valW)
        //     const w = valW
        //     const h = props.clipHeight * valW / props.clipWidth
        //     imgShowList.value.push({
        //         url: toBase64(w, h),
        //         size: valW
        //     })
        // })
    }

    // 用于产看压缩后的图片大小
    const convertBase64UrlToBlob = (urlData) => {
      var arr = urlData.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
</script>

<style lang="scss" scoped>
.flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: center;
    input {
        margin-right: 5px;
    }

    .upload-btn {
        position: relative;

        .upload-file-input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }
    }
}
</style>