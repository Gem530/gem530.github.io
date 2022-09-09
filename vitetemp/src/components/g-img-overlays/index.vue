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
                    @click="activeGraphical = item.key"
                >{{item.name}}</div>
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
                // { key: 'Line', name: '线段' },
                // { key: 'Polygon', name: '多边形' },
                { key: 'IText', name: '文字' },
            ]
        }
    })

    const state = reactive({
        isMove: false,
        isCreateObject: true
    })

    const emits = defineEmits(['getImg'])

    let group: any = null
    let canvas: any = null
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

    const init = async () => {
        canvas = new fabric.Canvas('canvasDom', {
            width,
            height,
            // preserveObjectStacking: true // true 选中控件后不会置顶层级
        })
        canvas.lastzoomPointX = width/2
        canvas.lastzoomPointY = height/2

        const img = await imgInit()
        imgStyleInit()
        imgSizeInit()
        // canvas.add(img)
        canvas.setBackgroundImage(img)
        canvas.renderAll()
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
            }
        }
    }

    // 鼠标抬起
    const mouseUpHandle = ({ e }: any) => {
        if (state.isCreateObject) {
            const top = (canvas.lastPosY - fTop.value + Math.abs(canvas.viewportTransform[5])) / step.value
            const left = (canvas.lastPosX - fLeft.value + Math.abs(canvas.viewportTransform[4])) / step.value
            const w = (e.clientX - canvas.lastPosX) / step.value
            const h = (e.clientY - canvas.lastPosY) / step.value
            const right = e.clientX / step.value
            const bottom = e.clientY / step.value
            switch (activeGraphical.value) {
                case 'Rect':
                    createRect(top, left, w, h);
                    break;
                case 'RectR':
                    createRect(top, left, w, h, 10, 10);
                    break;
                case 'Circle':
                    createCircle(top, left, w / 2);
                    break;
                case 'Ellipse':
                    createEllipse(top, left, w / 2, h / 2);
                    break;
                case 'Triangle':
                    createTriangle(top, left, w, h);
                    break;
                case 'Line':
                    createLine(top, left, right, bottom);
                    break;
                case 'IText':
                    createIText(top, left);
                    break;
                    
            }
            // if (activeGraphical.value == 'rect') {
            //     createRect(canvas.lastPosY, canvas.lastPosX, e.clientX - canvas.lastPosX, e.clientY - canvas.lastPosY)
            // }
        }
        canvas.isDragging = false
    }

    // 生成矩形
    const createRect = (top: number, left: number, w: number, h: number, rx: number = 0, ry: number = 0) => {
        const rect = new fabric.Rect({ width: w, height: h, fill: activeColor.value, top, left, rx, ry })
        canvas.add(rect)
    }

    // 生成圆
    const createCircle = (top: number, left: number, r: number) => {
        const circle = new fabric.Circle({ radius: r, fill: activeColor.value, top, left })
        canvas.add(circle)
    }

    // 生成椭圆
    const createEllipse = (top: number, left: number, rx: number, ry: number) => {
        const Ellipse = new fabric.Ellipse({ rx, ry, fill: activeColor.value, top, left })
        canvas.add(Ellipse)
    }

    // 生成三角形
    const createTriangle = (top: number, left: number, w: number, h: number) => {
        const Triangle = new fabric.Triangle({ width: w, height: h, fill: activeColor.value, top, left })
        canvas.add(Triangle)
    }

    // 生成线段
    const createLine = (top: number, left: number, right: number, bottom: number) => {
        const Line = new fabric.Line(
            [top, left, right, bottom],{ stroke: activeColor }
        )
        canvas.add(Line)
    }

// 生成线段
const createIText = (top: number, left: number) => {
    const IText = new fabric.IText('请输入文字', { top, left })
    canvas.add(IText)
}

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