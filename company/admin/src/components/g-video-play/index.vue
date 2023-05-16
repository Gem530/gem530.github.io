<template>
  <div
    ref="videoPlay"
    class="g-video-play"
    :style="{width: w+'px',height: h+'px'}"
    @click="playVideo">

    <div class="g-paused" v-show="videoStatus === 0">
      <!-- 暂停中 -->
    </div>

    <div class="g-progress" v-if="duration">
      <div class="g-progress-bar" :style="{width: ((progress/duration) * 100)+'%'}"></div>
      <div class="g-progress-time">{{ getVideoFormat(progress)+'/'+getVideoFormat(duration) }}</div>
    </div>

    <!-- <div>视频播放</div> -->
    <!-- {{ fixedDom }} -->
    <!-- {{ videoUrl }} -->
    <!-- <video
      ref="videoRef"
      :src="videoUrl"
      class="video-dom"
      muted
      controls
      playsinline
      webkit-playsinline
      x5-video-player-fullscreen
    ></video> -->
    <!-- <canvas ref="myCanvas"></canvas> -->
  </div>
</template>

<script lang="ts" name="GVideoPlay" setup>
import { ref } from 'vue'
import { mounted } from '@/utils'

let ctx: any;
let video: any;
let canvas: any;
const w = ref(0)
const h = ref(0)
const myCanvas = ref()
const videoRef = ref()
const duration = ref(0) // 视频总长
const progress = ref(0) // 视频进度
const videoPlay = ref()
const videoStatus = ref<number>(1); // 1播放 0暂停
// const fixedDom = ref<any>([])

// https://m.v.qq.com/z/msite/play-short/index.html?cid=&vid=x351296fzuj&share_from=&ptag=v_qq_com#v.play.adaptor#3
const videoUrl = ref('https://gem530.github.io/img/testVideo.mp4')

// // video 标签播放
// let sym: number = 0,maxTime: number = 0,totalDuration: number = 0;

mounted(() => {
  canvas = document.createElement('canvas')
  ctx = canvas.getContext('2d')

  video = document.createElement('video')
  video.src = videoUrl.value
  video.muted = true
  // video.autoplay = true

  video.play()
  videoStatus.value = 1
  // video.volume = 0.9
  
  video.addEventListener('canplay', function (e: any) {
    w.value = e.target.videoWidth
    h.value = e.target.videoHeight

    canvas.width = w.value
    canvas.height = h.value

    duration.value = video.duration

    getVideoToCanvas()

    videoPlay.value.appendChild(canvas)
  })

  // const elems: any = document.body.getElementsByTagName("*")
  // for (let i = 0; i < elems.length; i++) {
  //   if (window.getComputedStyle(elems[i], null).getPropertyValue('position') == 'fixed') {
  //     console.log(elems[i].classList)
  //     fixedDom.value.push(elems[i].classList.value)
  //   }
  // }

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

const getVideoToCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
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