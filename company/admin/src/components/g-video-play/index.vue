<template>
  <div
    ref="videoPlay"
    class="g-video-play"
    :style="{width: props.width,height: props.height}"
    @click="playVideo">

    <div class="g-loading" v-if="loading">加载中...</div>
    <div class="g-paused" v-else v-show="videoStatus === 0">
      <!-- 暂停中 -->
    </div>

    <div class="g-progress" v-if="duration">
      <div class="g-progress-bar" :style="{width: ((progress/duration) * 100)+'%'}"></div>
      <div class="g-progress-time">{{ getVideoFormat(progress)+'/'+getVideoFormat(duration) }}</div>
    </div>

    <!-- <div>视频播放</div> -->
    <!-- {{ fixedDom }} -->
    <!-- {{ props.url }} -->
    <!-- <video
      ref="videoRef"
      :src="props.url"
      class="video-dom"
      muted
      controls
      playsinline
      webkit-playsinline
      x5-video-player-fullscreen
    ></video> -->
    <canvas ref="myCanvas"></canvas>
  </div>
</template>

<script lang="ts" name="GVideoPlay" setup>
import { ref, defineProps, withDefaults } from 'vue'
import { mounted, twoNumberBetween } from '@/utils'

let ctx: any;
let video: any;
let canvas: any;
const w = ref(0)
const h = ref(0)
const x = ref(0)
const y = ref(0)
const myCanvas = ref()
const videoRef = ref()
const duration = ref(0) // 视频总长
const progress = ref(0) // 视频进度
const videoPlay = ref()
const loading = ref(true)
const videoStatus = ref<number>(0); // 1播放 0暂停
// const fixedDom = ref<any>([])

const props = withDefaults(defineProps<{
  url: string,
  width?: string,
  height?: string,
}>(), {
  width: '300px',
  height: '300px'
})

// https://m.v.qq.com/z/msite/play-short/index.html?cid=&vid=x351296fzuj&share_from=&ptag=v_qq_com#v.play.adaptor#3

// // video 标签播放
// let sym: number = 0,maxTime: number = 0,totalDuration: number = 0;

mounted(() => {
  initVideo()
  // 视频开启控制器时，不允许拖动滚动条
  // let video = videoRef.value
  // video.onloadedmetadata = function () {
  //   totalDuration = video.duration; // 获取视频时长
  //   if (video.duration) { // 如果有视频就自动播放
  //     video.play();
  //   }
  // };
  // let nIntervId: any = setInterval(function () { // 每 200 毫秒监听一次
  //   let time = video.currentTime; 
  //   if (time - maxTime > 1) {
  //     video.currentTime = sym; // 如果播放时间突然超过了最大播放时间，就退回去
  //   }
  //   sym = video.currentTime; 
  //   if (sym > maxTime) { 
  //     maxTime = sym; // 记录最大播放
  //   }
  //   video.playbackRate = 1; // 限制不能调倍速
  //   // 播放结束，停止定时器
  //   if (video.duration && video.currentTime >= video.duration) {
  //     clearInterval(nIntervId)
  //     nIntervId = null
  //   }
  //   console.log(video, video.currentTime, sym, maxTime, video.playbackRate, video.duration)
  // }, 200);
})

const initVideo = () => {
  w.value = videoPlay.value.clientWidth
  h.value = videoPlay.value.clientHeight

  // canvas = document.createElement('canvas')
  canvas = myCanvas.value
  ctx = canvas.getContext('2d')

  video = document.createElement('video')
  video.src = props.url
  // video.muted = true
  
  canvas.width = w.value
  canvas.height = h.value
  video.addEventListener('canplay', function (e: any) {
    // w.value = e.target.videoWidth
    // h.value = e.target.videoHeight
    const vWidth = e.target.videoWidth
    const vHeight = e.target.videoHeight
    console.log(vWidth, vHeight)
    // 视频宽高限制，不超出canvas范围，并计算出居中位置的xy坐标
    if (vWidth > canvas.width || vHeight > canvas.height) {
      // const wDifference = vWidth - canvas.width
      // const hDifference = vHeight - canvas.height
      // console.log(wDifference, hDifference)
      // if (wDifference > hDifference) {
      //   h.value = (w.value * vHeight) / vWidth
      // } else {
      //   w.value = (vWidth * h.value) / vHeight
      // }
      const canvaWH = canvas.width / canvas.height // <1：高长于宽 =1:正方形 >1：宽长于高
      const videoWH = vWidth / vHeight // <1：高长于宽 =1:正方形 >1：宽长于高
      console.log(canvaWH, videoWH)
      if (canvaWH <= 1) {
        if (videoWH <= 1 && videoWH > canvaWH) {
          h.value = (w.value * vHeight) / vWidth
        } else {
          w.value = (vWidth * h.value) / vHeight
        }
      } else {
        if (videoWH <= 1 && videoWH < canvaWH) {
          w.value = (vWidth * h.value) / vHeight
        } else {
          h.value = (w.value * vHeight) / vWidth
        }
      }
      // if (vWidth > vHeight) {
      //   h.value = (w.value * vHeight) / vWidth
      // } else {
      //   w.value = (vWidth * h.value) / vHeight
      // }
    } else {
      // // 原大小播放
      // w.value = vWidth
      // h.value = vHeight
      // 等比例放大
      if (vWidth > vHeight) {
        h.value = (w.value * vHeight) / vWidth
      } else {
        w.value = (vWidth * h.value) / vHeight
      }
    }
    x.value = (canvas.width - w.value) / 2
    y.value = (canvas.height - h.value) / 2

    // video.volume = 0.2 // 开启声音
    duration.value = video.duration
    getVideoToCanvas() // 实时播放
    getVideoMask() // 获取某一帧作为封面
  })
}

const twoNumberString = (val: number) => {
  return val < 10 ? '0' + val : val
}
const getVideoFormat = (val: number) => {
  type numOrStr = number|string

  let hh = twoNumberString(parseInt((val/3600)+''))
  let mm = twoNumberString(parseInt(((val%3600)/60)+''))
  let ss = twoNumberString(parseInt((val%60)+''))

  return val > 3600 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`
}

const playVideo = () => {
  if (!video && !canvas) return
  if (videoStatus.value === 1) {
    video.pause()
    videoStatus.value = 0
  } else {
    video.play()
    videoStatus.value = 1
    getVideoToCanvas()
  }
}

// 获取视频某帧作为封面
const getVideoMask = () => {
  const videoTemp = document.createElement('video')
  videoTemp.src = props.url
  videoTemp.currentTime = 10
  // videoTemp.currentTime = twoNumberBetween(0, duration.value)
  videoTemp.addEventListener('canplay', function (e: any) {
    ctx.drawImage(videoTemp, x.value, y.value, w.value, h.value)
    loading.value = false
  })
}

// 实时播放 video转为canvas
const getVideoToCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(video, x.value, y.value, w.value, h.value)
  progress.value = video.currentTime
  video.playbackRate = 1 // 限制不能调倍速
 
  if (videoStatus.value === 1) {
    requestAnimationFrame(getVideoToCanvas)
  }
}
</script>

<style lang="scss" scoped>
.g-video-play {
  position: relative;
  overflow: hidden;

  .g-loading {
    @include pcenter();
    @include flex();
    @include wh(100%, 100%);
    background: rgba($color: #000, $alpha: 0.3);
    color: #fff;
    z-index: 3;
  }

  .g-paused {
    @include pcenter();
    @include wh(50px, 50px);
    background: rgba($color: #fff, $alpha: 0.3);
    border-radius: 50%;
    z-index: 2;

    &::after {
      content: '';
      @include pcenter(50%, 70%);
      border: 15px solid #fff;
      border-right-color: transparent;
      border-bottom-color: transparent;
      border-top-color: transparent;
    }
  }

  .g-progress {
    @include pcenter(100%, 0, -100%, 0);
    @include wh(100%, 8px);
    background: #ededed;
    z-index: 2;

    .g-progress-bar {
      @include pcenter(0, 0, 0, 0);
      height: 100%;
      background: orangered;
    }

    .g-progress-time {
      @include pcenter(0, 100%, -100%, -100%);
    }
  }

  .video-dom {
    width: 300px;
  }
}
</style>