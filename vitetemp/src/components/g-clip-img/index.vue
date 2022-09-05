<template>
    <div class="component theme" :style="`width: ${props.width}px;`">
        <!-- 图片裁剪组件 -->
        <canvas id="canvas" ref="myCanvas" :width="props.width" :height="props.height"></canvas>
        <img :src="imgUrl" alt="">
        <!-- <div class="flex">
            <div
                class="flex-item"
                :key="i"
                v-for="(item, i) in imgShowList">
                <img :src="item.url" :alt="item.size + 'px'"/>
                <span>{{item.size}}px</span>
            </div>
        </div> -->
        <div class="flex">
            <button class="upload-btn">上传头像
                <input
                    type="file"
                    accept="image/*"
                    ref="uploadInput"
                    class="upload-file-input"
                    @change="handleChangeUploadImg"
                >
            </button>
            <button @click="handleScale('-')">-</button>
            <input
                type="range"
                v-model="step"
                :min="props.minScale"
                :max="props.maxScale"
                :step="props.scaleStep"
                @input="handleScale('change')"
            />
            <button @click="handleScale('+')">+</button>
            <button @click="handleRotate('right')">右旋转</button>
            <button @click="handleRotate('left')">左旋转</button>
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
    import defaultImg from '@/assets/img/login.jpeg'
    const props = defineProps({
        width: {
            type: Number,
            default: 300
        },
        height: {
            type: Number,
            default: 300
        },
        x: {
            type: Number,
            default: 150
        },
        y: {
            type: Number,
            default: 150
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
        },
        minScale: {
            type: Number,
            default: 0.01
        },
        maxScale: {
            type: Number,
            default: 3
        },
        scaleStep: {
            type: Number,
            default: 0.01
        },
        rotate: {
            type: Number,
            default: 90
        },
        // imgSizes: {
        //     type: Array,
        //     default: () => [64, 128]
        // },
    })

    const emits = defineEmits(['getImg'])

    const myCanvas = ref()
    const uploadInput = ref()
    const imgValue = ref(null)
    const canvasRef = ref<any>(null)

    const imgUrl = ref(undefined)
    // const imgSizes = ref([])
    // const imgShowList = ref([])
    const imgLocal = ref(defaultImg)

    const step = ref(1)
    const rotate = ref(0)
    const width = props.width
    const height = props.height
    const maskColor = props.maskColor
    const top = props.y - (props.clipHeight / 2)
    const left = props.x - (props.clipWidth / 2)
    const right = props.x + (props.clipWidth / 2)
    const bottom = props.y + (props.clipHeight / 2)

    // imgSizes.value = [...props.imgSizes, ...[props.clipWidth]].sort((a, b) => { return a - b })

    onMounted(() => {
        init()
    })

    const init = async () => {
        const canvas = new fabric.Canvas('canvas', {
            width,
            height,
            preserveObjectStacking: true // true 选中控件后不会置顶层级
        })

        const img = await imgInit()
        imgStyleInit()
        canvas.add(img)

        const maskGroup = new fabric.Group([
            new fabric.Rect({ width, height: top + 0.08, fill: maskColor, top: 0, left: 0 }), // 上
            new fabric.Rect({ width: width - right, height: bottom - top, fill: maskColor, top, left: right }), // 右
            new fabric.Rect({ width, height: height - bottom, fill: maskColor, top: bottom - 0.06, left: 0 }), // 下
            new fabric.Rect({ width: left, height: bottom - top, fill: maskColor, top, left: 0 }), // 左
        ])
        maskGroup.evented = false
        maskGroup.selectable = false
        canvas.add(maskGroup)
        canvas.renderAll()

        canvasRef.value = canvas
        mouseWheelHandle()
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

    // 图片大小初始化
    const imgSizeInit = () => {
        // const imgWidth = imgValue.value.width > width ? width : imgValue.value.width
        // const imgHeight = imgValue.value.height > height ? height : imgValue.value.height
        // imgWidth >= imgHeight ? imgValue.value.scaleToWidth(imgWidth) : imgValue.value.scaleToHeight(imgHeight)

        const imgWidth = imgValue.value.width > width ? width / imgValue.value.width : imgValue.value.width / width
        const imgHeight = imgValue.value.height > height ? height / imgValue.value.height : imgValue.value.height / width
        const scale = imgWidth <= imgHeight ? imgWidth : imgHeight
        imgValue.value.scaleX = scale
        imgValue.value.scaleY = scale

        step.value = scale
    }

    // 图片渲染
    const imgInit = () => {
        return new Promise((resolve, reject) => {
            fabric.Image.fromURL(imgLocal.value, img => {
                imgValue.value = img
                imgSizeInit()
                resolve(img)
            })
        })
    }

    // 控制缩放
    const handleScale = (type: string, e: Event) => {
        if (type === '-') step.value -= props.scaleStep
        else if (type === '+') step.value += props.scaleStep
        ImgScaleHandle()
    }

    // 图片旋转
    const handleRotate = (type: string) => {
        if (type === 'right') rotate.value += props.rotate
        else rotate.value -= props.rotate
        
        imgValue.value.rotate(rotate)
        canvasRef.value.renderAll()
    }

    // 鼠标滚轮缩放
    const mouseWheelHandle = () => {
        canvasRef.value.on("mouse:wheel", function({ e }) {
            step.value = (e.deltaY > 0 ? -props.scaleStep : props.scaleStep) + imgValue.value.scaleX;
            ImgScaleHandle()
        });
    }

    // 图片缩放
    const ImgScaleHandle = () => {
        step.value = Math.max(props.minScale, step.value); //最小为原来的1/10
        step.value = Math.min(props.maxScale, step.value); //最大是原来的3倍
        imgValue.value.scaleX = step.value
        imgValue.value.scaleY = step.value
        canvasRef.value.renderAll()
    }

    // 图片上传
    const handleChangeUploadImg = ({ target }) => {
        let reader = new FileReader()
        reader.readAsDataURL(target.files[0])
        reader.onload = function(e) {
            rotate.value = 0
            imgUrl.value = undefined
            imgLocal.value = e.target.result
            imgValue.value.setSrc(imgLocal.value, img => {
                imgValue.value = img
                imgStyleInit()
                imgSizeInit()
                canvasRef.value.renderAll()
            })
        }
    }

    // 返回base64图片
    const toBase64 = (width: Number, height: Number, quality: Number = 1, format: String = 'png') => {
        return canvasRef.value.toDataURL({ top, left, width, height, format, quality })
    }

    // 截图
    const clipHandle = () => {
        imgUrl.value = toBase64(props.clipWidth, props.clipHeight)
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