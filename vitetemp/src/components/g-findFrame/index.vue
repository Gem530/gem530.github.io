<template>
    <!-- 人脸识别 -->
  <div class="component theme"
      :style="`width: ${state.clientWidthD}px;height: ${state.heightD}px;`">
    <div
      class="photo-overflow"
      v-show="state.photoFlag"
    >
      <video
        class="video-contain"
        ref="video"
        id="videoDom"
        :width="state.clientWidthD"
        :height="state.heightD"
        autoplay
        playsinline
        webkit-playsinline="true"
        muted
      ></video>
    </div>
    <div
      class="error"
      :style="`width: ${state.clientWidthD}px;height: ${state.heightD}px;`"
      v-show="!state.photoFlag"
    >
      <span>未获取到取景框拍照权限</span>
      <span>请点击右上角刷新后授权，或者</span>
      <button>
        直接手机拍照
        <input
          type="file"
          ref="qrcodeImageDom"
          id="ground-push-image"
          @change="fileChange"
          accept="image/*"
          capture
        />
      </button>
    </div>
    <canvas id="tempCanvas" :width="state.clientWidthD" :height="state.heightD"></canvas>
    <div class="btn-photo" @click="getPhoto">
      <button @click.stop="resetPhoto('user')">前置摄像头</button>
      <slot>
        <button style="position: absolute; top: 0px; left: 0px">拍照</button>
      </slot>
      <button @click.stop="resetPhoto('environment')">后置摄像头</button>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: "g-find-frame" };
</script>
<script setup lang="ts">
import 'tracking/build/tracking-min'
import 'tracking/build/data/face-min'
import { ref, reactive, onMounted, nextTick, defineEmits, defineProps, onActivated, onBeforeUnmount } from 'vue'

const emits = defineEmits(['getPhotoBlob'])

const video: any = ref()
const qrcodeImageDom: any = ref()
const trackerTask = ref<any>()
const props = withDefaults(defineProps<{
    width?: number,
    height?: number
}>(), {
    width: 350,
    height: 200
})
const state: any = reactive({
    flag: true, // true 移动端
    imgNewURL: '',
    widthD: 0,
    heightD: 0,
    clientWidthD: 0,
    clientHeightD: 0,
    photoW: 0, // 摄像头分辨率宽度
    photoH: 0, // 摄像头分辨率高度
    photoFlag: true
})
const windowDom: any = window

// https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
// 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
onMounted(() => {
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        state.flag = true
    } else {
        state.flag = false
    }
    // console.log('onMounted')
})

onActivated(() => {
    nextTick(() => {
        initPhoto('environment')
    })
})

onBeforeUnmount(() => {
    destoryTracking()
})

// 切换摄像头
const resetPhoto = (face: string) => {
    stopPhoto()
    initPhoto(face)
}

const stopPhoto = () => {
    return video.value.srcObject && video.value.srcObject.getTracks().map((t: any) => t.stop());
}

// 销毁tracking
const destoryTracking = () => {
    trackerTask.value.stop()
    trackerTask.value.closeCamera()
}

// 初始化 摄像头
const initPhoto = (face: string) => {
    state.widthD = props.width
    state.heightD = props.height
    state.clientWidthD = props.width
    state.clientHeightD = props.height


    // eslint-disable-next-line @typescript-eslint/no-this-alias
    // state.clientWidthD = document.body.clientWidth
    // state.clientHeightD = document.body.clientHeight

    // if (props.width) {
    //     // 如果有传值，就使用接受的值为显示宽度
    //     state.widthD = props.width
    //     state.clientWidthD = props.width
    // } else {
    //     state.widthD = state.clientWidthD
    // }
    // if (props.height) {
    //     // 如果有传值，就使用接受的值为显示高度
    //     state.heightD = props.height
    //     state.clientHeightD = props.height
    // } else {
    //     state.heightD = state.clientHeightD
    // }

    const navigators: any = navigator
    // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
    if (navigators.mediaDevices === undefined) {
        navigators.mediaDevices = {}
    }

    // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
    // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
    if (navigators.mediaDevices.getUserMedia === undefined) {
        navigators.mediaDevices.getUserMedia = function(constraints: any) {
            // 首先，如果有getUserMedia的话，就获得它
            const getUserMedia = navigators.webkitGetUserMedia || navigators.mozGetUserMedia
            // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
            }
            // 否则，为老的navigator.getUserMedia方法包裹一个Promise
            return new Promise(function(resolve, reject) {
                getUserMedia.call(navigators, constraints, resolve, reject)
            })
        }
    }

    navigators.mediaDevices.getUserMedia({
            audio: false,
            video: {
                // 电脑端没问题,移动端会有问题
                width: props.width,
                height: props.height,
                facingMode: face
            }
        })
        .then(function(stream: any) {
                // 旧的浏览器可能没有srcObject
            if ('srcObject' in video.value) {
                video.value.srcObject = stream
            } else {
                // 防止在新的浏览器里使用它，应为它已经不再支持了
                video.value.src = window.URL.createObjectURL(stream)
            }
            video.value.onloadedmetadata = function() {
                video.value.play()
            }
            nextTick(() => {
                video.value.addEventListener('canplay', () => {
                    // 获取视频的真实分辨率 480 640
                    // console.log(video.value.videoWidth, video.value.videoHeight)
                    state.photoW = video.value.videoWidth
                    state.photoH = video.value.videoHeight
                    if (state.widthD > state.photoW) {
                        state.widthD = state.photoW
                    }
                    if (state.heightD > state.photoH) {
                        state.heightD = (state.photoH * state.widthD) / state.photoW
                    }
                })
            })
        })
        .catch(function(err: any) {
            state.photoFlag = false
            console.log(err.name + ': ' + err.message, err)
        })

        // -------------------------- tracking ---------------------------
        // console.log(windowDom.tracking)
        // windowDom.tracking.initUserMedia_()
        const canvas: any = document.getElementById('tempCanvas')
        const videoDOMs: any = document.getElementById('videoDom')
        const ctx: any = canvas.getContext('2d')
        let tracker = new windowDom.tracking.ObjectTracker('face')
        tracker.setInitialScale(4)
        tracker.setStepSize(2)
        tracker.setEdgesDensity(0.1)

        trackerTask.value = windowDom.tracking.track('#videoDom', tracker, { camera: true })

        tracker.on('track', (event: any) => {
            // console.log(event)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            event.data.forEach((rect: any) => {
                // ctx.drawImage(videoDOMs, 0, 0, state.photoW, state.photoW * (state.heightD / state.widthD), 0, 0, canvas.width, canvas.height)
                ctx.drawImage(videoDOMs, 0, 0, canvas.width, canvas.height)
                ctx.font = '16px Helvetica'
                // ctx.fillText('12', 100, 100)
                ctx.strokeStyle = '#1890ff'
                ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
            })

            if (event.data.length !== 0) {
                // 说明检测到人脸了，此时就可以截取图片上传给后端
                // canvas.toDataURL('image/jpeg')
            }
        })
        // -------------------------- tracking ---------------------------
}

// 拍照
const getPhoto = async () => {
    if (!state.photoFlag) {
        // this.fileChange()
        qrcodeImageDom.value.click()
        return
    }
    // const video = video as any
    // const canvas = this.canvas
    const canvas = document.createElement('canvas')
    const ctx: any = canvas.getContext('2d')
    // let tempW = 0
    // let tempH = 0
    if (!state.flag) {
        canvas.width = state.widthD
        canvas.height = state.heightD
    } else {
        // 移动端宽高对换
        // canvas.width = state.widthD * 2
        // canvas.height = state.heightD * 2
        canvas.width = state.widthD
        canvas.height = state.heightD
    }
    ctx.drawImage(video.value, 0, 0, state.photoW, state.photoW * (state.heightD / state.widthD), 0, 0, canvas.width, canvas.height)
    // console.log(state.photoW, state.photoW * (state.heightD / state.widthD), state.widthD, state.heightD)
    const dataURL = canvas.toDataURL('image/jpeg', 1)
    const blob = await convertBase64UrlToBlob(dataURL)
    emits('getPhotoBlob', {
        blob: blob,
        baseUrl: dataURL
    })
}


// 调用手机摄像头
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const fileChange = async () => {
    const inputFile: HTMLInputElement|any = document.getElementById('ground-push-image')

    const fileList = inputFile.files[0]

    const img: any = await toImage(fileList)
    const blob = await compressImgQuality(img)
    emits('getPhotoBlob', {
        blob: blob,
        baseUrl: img.src
    })
}

/**
 * @author wenbin
 * @description 将将文件处理成 Image 对象
 * @param file 文件对象
 */
const toImage = (file: File) => {
    return new Promise((resolve, reject) => {
        const img = new Image() as any
        const reader = new FileReader()
        reader.onload = function (e: any) {
            img.src = e.target.result
        }
        reader.onerror = function (e: any) {
            reject(e)
        }
        reader.readAsDataURL(file)
        img.onload = function () {
            resolve(img)
        }
        img.onerror = function (e: any) {
            reject(e)
        }
    })
}

/**
 * @author hjj
 * @description 通过画布改变图片质量，不改变大小
 * @param img 被压缩的img对象
 * @param quality 压缩的质量，值越小图片大小越小，例：quality=0.13，压缩后，6.4M的图片只有630kb
 */
const compressImgQuality = (img: HTMLImageElement, quality = 0.13) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d') as any
            const { width, height } = img
            canvas.width = width
            canvas.height = height
            context.clearRect(0, 0, width, height)
            // 图片绘制
            context.drawImage(img, 0, 0, width, height)
            const tempFile = canvas.toDataURL('image/jpeg', quality)
            const blob = await convertBase64UrlToBlob(tempFile)
            // console.log(blob)
            resolve(blob)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * @author hjj
 * @param urlData
 * 将以base64的图片url数据转换为Blob 用url方式表示的base64图片数据
 */
const convertBase64UrlToBlob = (urlData: string) => {
    const bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byt
    // 处理异常,将ascii码小于0的转换为大于0
    const ab = new ArrayBuffer(bytes.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
    }
    return new Blob([ab], { type: 'image/jpeg' })
}
</script>

<style lang="scss" scoped>
.component {
    position: relative;
    // overflow: hidden;

    .btn-photo {
        display: inline-block;
        @include pcenter(100%, 50%, -100%, -50%);
    }

    .photo-overflow {
        // border: 1px solid gray;
        overflow: hidden;

        .video-contain {
            // border: 1px solid #f00;
            // object-fit: cover;
            // object-position: 0 0;
        }
    }

    #tempCanvas {
        position: absolute;
        top: 0;
        left: 0;
    }

    .error {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #ffffff;
        text-align: center;
    }
}
</style>