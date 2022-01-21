<template>
  <div>
    <div class="photo-overflow" :style="`width: ${clientWidthD}px;height: ${heightD}px;`" v-show="photoFlag">
      <video
        class="video-contain"
        ref="video"
        id="video"
        :width="clientWidthD"
        autoplay
        playsinline
        webkit-playsinline="true"
        muted
      ></video>
    </div>
    <div class="error" :style="`width: ${clientWidthD}px;height: ${heightD}px;`" v-show="!photoFlag">
      您的浏览器不支持取景框<br/>如未弹出授权框，请点击右上角刷新页面
    </div>
  </div>
</template>

<script lang='ts'>
// import {
// // uploadFileApi
//   getAccountStaffApi
// } from '@/api/commonApi'
// import { Toast } from 'vant'
// import { getAccountIcon } from '@/utils/banks'
import { convertBase64UrlToBlob } from '@/utils/compressImage'
import { Component, Vue, Prop, Ref } from 'vue-property-decorator'
// import { toImage, compressImg } from '@/utils/compressImage'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import adapter from 'webrtc-adapter'
// import { BrowserMultiFormatReader } from '@zxing/library'

@Component
export default class QrcodePhoto extends Vue {
  @Ref() readonly video: any
  @Ref() readonly canvas: any
  @Prop() width!: number
  @Prop() height!: number

  imgURL: any = ''
  imgNewURL: any = ''
  widthD = 0
  heightD = 0
  clientWidthD = 0
  clientHeightD = 0
  photoW = 0 // 摄像头分辨率宽度
  photoH = 0 // 摄像头分辨率高度

  photoFlag = true

  // tempdom = new BrowserMultiFormatReader()

  mounted (): void {
    this.initPhoto()
  }

  // 初始化 摄像头
  initPhoto (): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    this.$nextTick(() => {
      that.clientWidthD = document.body.clientWidth
      that.clientHeightD = document.body.clientHeight

      if (that.width) {
        // 如果有传值，就使用接受的值为显示宽度
        that.widthD = that.width
      } else {
        that.widthD = that.clientWidthD
      }
      if (that.height) {
        // 如果有传值，就使用接受的值为显示高度
        that.heightD = that.height
      } else {
        that.heightD = that.clientHeightD
      }

      console.log(that.height, that.widthD, that.clientWidthD, that.heightD, that.clientHeightD)

      const navigators: any = navigator
      // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
      if (navigators.mediaDevices === undefined) {
        navigators.mediaDevices = {}
      }

      // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
      // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
      if (navigators.mediaDevices.getUserMedia === undefined) {
        navigators.mediaDevices.getUserMedia = function (constraints: any) {
          // 首先，如果有getUserMedia的话，就获得它
          const getUserMedia = navigators.webkitGetUserMedia || navigators.mozGetUserMedia
          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
          }
          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigators, constraints, resolve, reject)
          })
        }
      }

      navigators.mediaDevices.getUserMedia({
        audio: false,
        video: {
          // width: that.widthD,
          // height: that.heightD,
          facingMode: 'environment'
        }
      })
        .then(function (stream: any) {
          // console.log(stream, 'stream', that.widthD, that.heightD, that.clientWidthD, that.clientHeightD)
          const video = that.video
          // 旧的浏览器可能没有srcObject
          if ('srcObject' in video) {
            video.srcObject = stream
          } else {
            // 防止在新的浏览器里使用它，应为它已经不再支持了
            video.src = window.URL.createObjectURL(stream)
          }
          video.onloadedmetadata = function () {
            video.play()
          }
          that.$nextTick(() => {
            that.video.addEventListener('canplay', () => {
              // 获取视频的真实分辨率 480 640
              console.log(that.video.videoWidth, that.video.videoHeight)
              that.photoW = that.video.videoWidth
              that.photoH = that.video.videoHeight
              // that.widthD = that.video.videoWidth
              // that.heightD = that.video.videoHeight
              // if (that.$isPc) {
              //   that.widthD = that.video.videoWidth
              //   that.heightD = that.video.videoHeight
              // } else {
              //   that.widthD = that.video.videoHeight
              //   that.heightD = that.video.videoWidth
              //   // that.heightD = that.video.videoWidth
              //   // 移动端宽高对换
              // }
              // if (that.width) {
              //   // 如果有传值，就使用接受的值为显示宽度
              //   that.widthD = that.width
              // } else {
              //   that.widthD = that.video.videoWidth
              // }
              // if (that.height) {
              //   // 如果有传值，就使用接受的值为显示高度
              //   that.heightD = that.height
              // } else {
              //   that.heightD = that.video.videoHeight
              // }
            })
          })
        })
        .catch(function (err: any) {
          that.photoFlag = false
          console.log(err.name + ': ' + err.message, err)
        })
    })
  }

  // 拍照
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getPhoto (callback: any): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const video = this.video
    // const canvas = this.canvas
    const canvas = document.createElement('canvas') as any
    const ctx = canvas.getContext('2d')
    // let tempW = 0
    // let tempH = 0
    if (that.$isPc) {
      canvas.width = that.widthD
      canvas.height = that.heightD
    } else {
      // 移动端宽高对换
      // canvas.width = that.heightD
      // canvas.height = (canvas.width * that.heightD) / that.widthD
      // tempW = that.heightD
      // tempH = (canvas.width * that.heightD) / that.widthD
      canvas.width = that.widthD * 2
      canvas.height = that.heightD * 2
      // canvas.width = that.photoW
      // canvas.height = that.heightD
    }
    ctx.drawImage(video, 0, 0, that.photoW, that.photoW * (that.heightD / that.widthD), 0, 0, canvas.width, canvas.height)
    console.log(that.photoW, that.photoW * (that.heightD / that.widthD), that.widthD, that.heightD)
    const dataURL = canvas.toDataURL('image/jpeg', 1)
    that.imgURL = dataURL
    // const a = document.createElement('a') // 创建a标签
    // a.download = '裁剪-PHOTO' // 文件名
    // a.href = dataURL // 下载的文件地址
    // a.click() // 点击下载
    const blob = await convertBase64UrlToBlob(dataURL)
    callback && callback(blob)
    // that.cutImageUrl(function (item: any) {
    //   callback && callback(item)
    // })
  }

  // // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // cutImageUrl (callback: any): void {
  //   // eslint-disable-next-line @typescript-eslint/no-this-alias
  //   const that = this
  //   const canvas = document.createElement('canvas') as any
  //   const ctx = canvas.getContext('2d')
  //   canvas.width = that.widthD
  //   canvas.height = that.heightD
  //   const img = new Image()
  //   img.src = that.imgURL
  //   img.crossOrigin = 'anonymous'
  //   img.onload = async function () {
  //     const tempHeight = that.heightInit ? that.heightInit : that.heightD
  //     ctx.drawImage(img, 0, 0, that.widthD, tempHeight, 0, 0, that.widthD, tempHeight)
  //     const tempFile = canvas.toDataURL('image/jpeg', 0.13)
  //     // that.imgNewURL = dataURL
  //     // callback && callback(that.imgNewURL)
  //     const blob = await convertBase64UrlToBlob(tempFile)
  //     callback && callback(blob)
  //     // canvas.toBlob(function (blob: any) {
  //     //   // const formData = new FormData()
  //     //   // formData.append('file', blob || '')
  //     //   // formData.append('image_type', 'discern_vin')
  //     //   callback && callback(blob)
  //     // }, 'image/jpg')
  //   }
  // }

  // 返回上一页
  goBack (): void {
    this.$router.go(-1)
  }
}
</script>

<style lang='scss' scoped>
.photo-overflow {
  // border: 1px solid gray;
  overflow: hidden;

  .video-contain {
    // border: 1px solid #f00;
    // object-fit: cover;
    object-position: 0 0;
  }
}

.error {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  text-align: center;
}
</style>
