<template>
    <div class="component theme" :style="`width: ${props.width}px;`">
        <!-- 图片裁剪组件 -->
        <canvas id="canvasDom" ref="myCanvas" :width="props.width" :height="props.height"></canvas>
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
            <button @click="initScle">还原</button>
            <button @click="clipHandle">裁剪</button>
            <div v-show="state.isCreateObject">
                <div class="flex">
                    <div
                        :key="item"
                        v-for="item in props.colors"
                        :style="`background: ${item};`"
                        :class="{ 'flex-item': true, 'active-flex': item == activeColor }"
                        @click="activeColor = item"
                    ></div>
                </div>
                <div class="flex">
                    <div
                        :key="item.key"
                        v-for="item in props.graphical"
                        :class="{ 'flex-item': true, 'active-flex': item.key == activeGraphical }"
                        @click="chooseGraphical(item)"
                    >{{item.name}}</div>
                </div>
            </div>
            <div class="flex">
                <button @click="handleOperat('isMove')">移动</button>
                <button @click="handleOperat('isCreateObject')">绘制</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="g-img-overlays">
    import { ref, onMounted } from 'vue'
    import { fabric } from 'fabric'
    // import defaultImg from '@/assets/img/login.jpeg'
    const props: any = defineProps({
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
            default: 'https://img1.baidu.com/it/u=2644452384,3800439215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        },
        colors: {
            type: Array,
            default: () => ['pink', 'skyblue', 'orange']
        },
        graphical: {
            type: Array,
            default: () => [
                { key: 'Rect', name: '矩形' },
                { key: 'RectR', name: '圆角矩形' },
                { key: 'Circle', name: '圆' },
                { key: 'Ellipse', name: '椭圆' },
                { key: 'Triangle', name: '三角形' },
                { key: 'Line', name: '线段' },
                // { key: 'Polygon', name: '多边形' },
                { key: 'IText', name: '文字' },
            ]
        }
    })

    const state: any = reactive({
        isMove: false,
        isCreateObject: true
    })

    const emits = defineEmits(['getImg'])

    let group: any = null
    let canvas: any = null
    let currentObject: any = null

    const myCanvas = ref()
    const uploadInput = ref()
    const imgValue = ref<any>(null)

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
    const activeColor = ref(props.colors[0])
    const activeGraphical = ref(props.graphical[0]?.key)

    nextTick(() => {
        fTop.value = myCanvas.value.getBoundingClientRect().top
        fLeft.value = myCanvas.value.getBoundingClientRect().left
    })

    // imgSizes.value = [...props.imgSizes, ...[props.clipWidth]].sort((a, b) => { return a - b })

    onMounted(() => {
        init()
    })

    // 画布事件
    const handleOperat = (type: string) => {
        for (let k in state) {
            state[k] = k == type
        }
    }

    const init = async () => {
        canvas = new fabric.Canvas('canvasDom', {
            width,
            height,
            // preserveObjectStacking: true // true 选中控件后不会置顶层级
        })
        canvas.lastzoomPointX = width/2
        canvas.lastzoomPointY = height/2
        canvas.relativeX = 0 // canvas移动的x坐标位移
        canvas.relativeY = 0 // canvas移动的x坐标位移

        const img = await imgInit()
        imgStyleInit()
        imgSizeInit()
        // canvas.add(img)
        canvas.setBackgroundImage(img)
        canvas.renderAll()
        canvas.selection = false // 不允许直接从画布框选
        canvas.selectionFullyContained = true // 只选择完全包含在拖动选择矩形中的形状
        fabricHandleEvent()
    }

    // fabric事件
    const fabricHandleEvent = () => {
        canvas.on({
            'mouse:up': (e: any) => mouseUpHandle(e),
            'mouse:move': (e: any) => mouseMoveHandle(e), 
            'mouse:down': (e: any) => mouseDownHandle(e),
            'mouse:wheel': (e: any) => mouseWheelHandle(e),
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
    const mouseWheelHandle = ({ e }: any) => {
        const type = e.deltaY < 0 ? '+' : '-'
        ImgScaleHandle(type, e.pageX - fLeft.value, e.pageY - fTop.value)
    }

    // 鼠标按下
    const mouseDownHandle = ({ e }: any) => {
        canvas.isDragging = true // isDragging 是自定义的
        canvas.lastPosX = e.clientX // lastPosX 是自定义的
        canvas.lastPosY = e.clientY // lastPosY 是自定义的
        if (state.isCreateObject) {
            const relaX = canvas.relativeX > 0 ? (canvas.relativeX * 2) : 0
            const relaY = canvas.relativeY > 0 ? (canvas.relativeY * 2) : 0
            const top = ((canvas.lastPosY - fTop.value + Math.abs(canvas.viewportTransform[5]) - relaY) / step.value)
            const left = ((canvas.lastPosX - fLeft.value + Math.abs(canvas.viewportTransform[4]) - relaX) / step.value)
            switch (activeGraphical.value) {
                case 'Rect':
                    currentObject = new fabric.Rect()
                    break;
                case 'RectR':
                    currentObject = new fabric.Rect()
                    break;
                case 'Circle':
                    currentObject = new fabric.Circle()
                    break;
                case 'Ellipse':
                    currentObject = new fabric.Ellipse()
                    break;
                case 'Triangle':
                    currentObject = new fabric.Triangle()
                    break;
                case 'IText':
                    currentObject = new fabric.IText('请输入。。', { top, left })
                    break;
            }
        }
    }

    // 鼠标移动
    const mouseMoveHandle = ({ e }: any) => {
        if (canvas.isDragging) {
            if (state.isMove) {
                // 是否可以移动
                let vpt = canvas.viewportTransform // 聚焦视图的转换
                vpt[4] += e.clientX - canvas.lastPosX
                vpt[5] += e.clientY - canvas.lastPosY
                canvas.requestRenderAll()
                canvas.lastPosX = e.clientX
                canvas.lastPosY = e.clientY
                canvas.relativeX = vpt[4] // canvas移动的x坐标位移
                canvas.relativeY = vpt[5] // canvas移动的x坐标位移
                canvas.setViewportTransform(canvas.viewportTransform)
                console.log(canvas.relativeX, canvas.relativeY, canvas.viewportTransform)
            }
            if (state.isCreateObject) {
                const relaX = canvas.relativeX > 0 ? (canvas.relativeX * 2) : 0
                const relaY = canvas.relativeY > 0 ? (canvas.relativeY * 2) : 0
                const top = ((canvas.lastPosY - fTop.value + Math.abs(canvas.viewportTransform[5]) - relaY) / step.value)
                const left = ((canvas.lastPosX - fLeft.value + Math.abs(canvas.viewportTransform[4]) - relaX) / step.value)
                const w = (e.clientX - canvas.lastPosX) / step.value
                const h = (e.clientY - canvas.lastPosY) / step.value
                switch (activeGraphical.value) {
                    case 'Rect':
                        currentObject.set({ width: w, height: h, fill: activeColor.value, top, left })
                        canvas.add(currentObject)
                        break;
                    case 'RectR':
                        currentObject.set({ width: w, height: h, fill: activeColor.value, top, left, rx: 5, ry: 5 })
                        canvas.add(currentObject)
                        break;
                    case 'Circle':
                        currentObject.set({ radius: w / 2, fill: activeColor.value, top, left })
                        canvas.add(currentObject)
                        break;
                    case 'Ellipse':
                        currentObject.set({ rx: w / 2, ry: h / 2, fill: activeColor.value, top, left })
                        canvas.add(currentObject)
                        break;
                    case 'Triangle':
                        currentObject.set({ width: w, height: h, fill: activeColor.value, top, left })
                        canvas.add(currentObject)
                        break;
                }
                canvas.renderAll()
            }
        }
    }

    // 鼠标抬起
    const mouseUpHandle = ({ e }: any) => {
        canvas.isDragging = false
        if (state.isCreateObject) {
            const relaX = canvas.relativeX > 0 ? (canvas.relativeX * 2) : 0
            const relaY = canvas.relativeY > 0 ? (canvas.relativeY * 2) : 0
            const top = ((canvas.lastPosY - fTop.value + Math.abs(canvas.viewportTransform[5]) - relaY) / step.value)
            const left = ((canvas.lastPosX - fLeft.value + Math.abs(canvas.viewportTransform[4]) - relaX) / step.value)
            const right = (e.clientX - fLeft.value) / step.value
            const bottom = (e.clientY - fTop.value) / step.value
            switch (activeGraphical.value) {
                case 'Line':
                    currentObject = new fabric.Line([left, top, right, bottom],{ stroke: activeColor.value })
                    canvas.add(currentObject)
                    break;
                case 'IText':
                    canvas.renderAll()
                    break;
            }
        }
    }

    // 选择图形
    const chooseGraphical = (item: any) => {
        activeGraphical.value = item.key
    }

    // // 生成矩形
    // const createRect = (top: number, left: number, w: number, h: number, rx: number = 0, ry: number = 0) => {
    //     currentObject = new fabric.Rect({ width: w, height: h, fill: activeColor.value, top, left, rx, ry })
    //     canvas.add(currentObject)
    // }
    // // 生成圆
    // const createCircle = (top: number, left: number, r: number) => {
    //     currentObject = new fabric.Circle({ radius: r, fill: activeColor.value, top, left })
    //     canvas.add(currentObject)
    // }
    // // 生成椭圆
    // const createEllipse = (top: number, left: number, rx: number, ry: number) => {
    //     currentObject = new fabric.Ellipse({ rx, ry, fill: activeColor.value, top, left })
    //     canvas.add(currentObject)
    // }
    // // 生成三角形
    // const createTriangle = (top: number, left: number, w: number, h: number) => {
    //     currentObject = new fabric.Triangle({ width: w, height: h, fill: activeColor.value, top, left })
    //     canvas.add(currentObject)
    // }
    // // 生成线段
    // const createLine = (top: number, left: number, right: number, bottom: number) => {
    //     currentObject = new fabric.Line([top, left, right, bottom],{ stroke: activeColor.value })
    //     canvas.add(currentObject)
    // }
    // // 生成线段
    // const createIText = (top: number, left: number) => {
    //     currentObject = new fabric.IText('请输入文字', { top, left })
    //     canvas.add(currentObject)
    // }

    // 图片初始化
    const imgStyleInit = () => {
        imgValue.value.top = height / 2
        imgValue.value.left = width / 2
        imgValue.value.originX = 'center'
        imgValue.value.originY = 'center'
        imgValue.value.selectable = false
        imgValue.value.cornerStyle = 'circle'

        imgValue.value.rotate(0)
    }

    // canvas缩放
    const ImgScaleHandle = (type: string, x: number, y: number) => {
        let zoom = undefined
        if (type == 'change') zoom = step.value
        else if (type == 'init') {
            zoom = 1
            canvas.relativeX = 0 // canvas移动的x坐标位移
            canvas.relativeY = 0 // canvas移动的x坐标位移
            const arr = [1, 0, 0, 1, 0, 0]
            canvas.setViewportTransform(arr)
        }
        else {
            zoom = (type == '-' ? -props.scaleStep : props.scaleStep) + canvas.getZoom()
        }
        zoom = Math.max(1, zoom) //最小为原来的1/10
        zoom = Math.min(props.maxScale, zoom) //最大是原来的3倍
        canvas.lastzoomPointX = x
        canvas.lastzoomPointY = y
        const zoomPoint = new fabric.Point(x, y)
        canvas.relativeX = canvas.viewportTransform[4]/zoom // canvas移动的x坐标位移
        canvas.relativeY = canvas.viewportTransform[5]/zoom // canvas移动的x坐标位移
        canvas.zoomToPoint(zoomPoint, zoom)
        canvas.setViewportTransform(canvas.viewportTransform) // 设置此画布实例的视口转换
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
            fabric.Image.fromURL(imgLocal.value, (img: ImageBitmap) => {
                imgValue.value = img
                resolve(img)
            }, { crossOrigin: 'anonymous' })
        })
    }

    // 返回base64图片
    const toBase64 = (quality: Number = 1, format: String = 'png') => {
        return canvas.toDataURL({ top: 0, left: 0, width, height, format, quality })
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
    const convertBase64UrlToBlob = (urlData: any) => {
      var arr: any = urlData.split(','),
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

    .flex-item {
        min-width: 30px;
        height: 30px;
        border: 1px solid transparent;
        padding: 0 5px;
        margin-right: 5px;
        text-align: center;
        line-height: 30px;

        &.active-flex {
            border: 1px solid red;
        }
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