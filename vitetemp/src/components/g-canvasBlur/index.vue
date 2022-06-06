<template>
    <div class="component theme" ref="box">
    </div>
</template>

<script lang="ts">
export default { name: 'gCanvasBlur' }
</script>
<script setup lang="ts">
    import { onMounted, defineProps } from 'vue'
    const box = ref()

    const props = withDefaults(defineProps<{
        x?: number, // 模糊的起点x
        y?: number, // 模糊的起点y
        url?: string, // 图片url
        width?: number, // 模糊的宽度
        height?: number // 模糊的高度
    }>(), {
        x: 0,
        y: 0,
        url: 'https://gem530.github.io/img/33.jpg',
        width: 200,
        height: 200
    })
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(async () => {
    //    console.log('onMounted')
        const img = await imgload(props.url)
        initCanvas(img, props.x, props.y, props.width, props.height)
    })

    const imgload = (imgs: any) => {
        const imgsUrl = imgs
        return new Promise((resolve, reject) => {
            let img = new Image()
            img.crossOrigin = 'anonymous'
            img.src = imgsUrl
            img.onload = (data) => {
                resolve(img)
            }
            img.onerror = () => {
                reject()
            }
        })
    }

    // 初始化图像
    const initCanvas = (img: any, x: number, y: number, width: number, height: number) => {
        // const canvas = document.querySelector('#mycanvas')
        const canvas: any = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        // canvas.width = img.width
        // canvas.height = img.height
        const w = box.value.clientWidth
        const h = box.value.clientHeight
        canvas.width = w
        canvas.height = h
        
        ctx.drawImage(img, 0, 0, w, h)
        // 从画布获取一半的图像
        let data = ctx.getImageData(x, y, width, height)
        // 将图像数据进行高斯模糊，data.data是一个数组，每四个值代表一个像素点的rgba的值，data.width data.height分别代表高斯模糊的宽高
        let emptyData = gaussBlur(data)
        // 将模糊的图像数据再渲染到画布上
        ctx.putImageData(emptyData, x, y)
        let tempImg = canvas.toDataURL('image/jpeg')
        // this.imgBase = tempImg
        // 生成图片，添加到页面上
        let tempImgDom = new Image()
        tempImgDom.src = tempImg
        box.value.appendChild(tempImgDom)
    }

    // 模糊图像 从网上复制的方法
    const gaussBlur = (imgData: any) => {
        let pixes = imgData.data // 图像数据
        let width = imgData.width
        let height = imgData.height
        var gaussMatrix = [],
            gaussSum = 0,
            x, y,
            r, g, b, a,
            i, j, k, len;
        let radius = 10
        let sigma = 5
        a = 1 / (Math.sqrt(2*Math.PI) * sigma)
        b = -1 / (2 * sigma * sigma)
        // 生成高斯矩阵
        for (i = 0, x = -radius; x <= radius; x++, i++) {
        g = a * Math.exp(b * x * x)
        gaussMatrix[i] = g
        gaussSum += g
        }

        // 归一化，保证高斯矩阵的值再[0,1]之间
        for (i = 0, len = gaussMatrix.length; i < len; i++) {
        gaussMatrix[i] /= gaussSum
        }

        
        //x 方向一维高斯运算
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                r = g = b = a = 0;
                gaussSum = 0
                for (j = -radius; j <= radius; j++) {
                    k = x + j
                    if (k >= 0 && k < width) {//确保 k 没超出 x 的范围
                        //r,g,b,a 四个一组
                        i = (y * width + k) * 4
                        r += pixes[i] * gaussMatrix[j + radius]
                        g += pixes[i + 1] * gaussMatrix[j + radius]
                        b += pixes[i + 2] * gaussMatrix[j + radius]
                        // a += pixes[i + 3] * gaussMatrix[j];
                        gaussSum += gaussMatrix[j + radius]
                    }
                }
                i = (y * width + x) * 4
                // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
                // console.log(gaussSum)
                pixes[i] = r / gaussSum
                pixes[i + 1] = g / gaussSum
                pixes[i + 2] = b / gaussSum
                // pixes[i + 3] = a 
            }
        }

        //y 方向一维高斯运算
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                r = g = b = a = 0
                gaussSum = 0
                for (j = -radius; j <= radius; j++) {
                    k = y + j
                    if (k >= 0 && k < height) {//确保 k 没超出 y 的范围
                        i = (k * width + x) * 4
                        r += pixes[i] * gaussMatrix[j + radius]
                        g += pixes[i + 1] * gaussMatrix[j + radius]
                        b += pixes[i + 2] * gaussMatrix[j + radius]
                        // a += pixes[i + 3] * gaussMatrix[j];
                        gaussSum += gaussMatrix[j + radius]
                    }
                }
                i = (y * width + x) * 4
                pixes[i] = r / gaussSum
                pixes[i + 1] = g / gaussSum
                pixes[i + 2] = b / gaussSum
            }
        }
        return imgData

    }
</script>

<style lang="scss" scoped>
.component {
    width: 100%;
    height: 100%;
}
</style>