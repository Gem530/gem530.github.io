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
              // 获取视频的真实分辨率
              // console.log(e, that.video.videoWidth, that.video.videoHeight)
              if (that.width) {
                // 如果有传值，就使用接受的值为显示宽度
                that.widthD = that.width
              } else {
                that.widthD = that.video.videoWidth
              }
              if (that.height) {
                // 如果有传值，就使用接受的值为显示高度
                that.heightD = that.height
              } else {
                that.heightD = that.video.videoHeight
              }
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
  getPhoto (callback: any): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const video = this.video
    // const canvas = this.canvas
    const canvas = document.createElement('canvas') as any
    const ctx = canvas.getContext('2d')
    canvas.width = that.widthD
    canvas.height = that.heightD
    ctx.drawImage(video, 0, 0, that.widthD, that.heightD)
    const dataURL = canvas.toDataURL('image/jpeg')
    that.imgURL = dataURL
    that.cutImageUrl(function (item: any) {
      callback && callback(item)
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  cutImageUrl (callback: any): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const canvas = document.createElement('canvas') as any
    const ctx = canvas.getContext('2d')
    canvas.width = that.widthD
    canvas.height = that.heightD
    const img = new Image()
    img.src = that.imgURL
    img.crossOrigin = 'anonymous'
    img.onload = function () {
      ctx.drawImage(img, 0, 0, that.widthD, that.heightD, 0, 0, that.widthD, that.heightD)
      // const dataURL = canvas.toDataURL('image/jpeg')
      // that.imgNewURL = dataURL
      // callback && callback(that.imgNewURL)
      canvas.toBlob(function (blob: any) {
        // const formData = new FormData()
        // formData.append('file', blob || '')
        // formData.append('image_type', 'discern_vin')
        callback && callback(blob)
      }, 'image/png')
    }
  }

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
    object-fit: cover;
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
