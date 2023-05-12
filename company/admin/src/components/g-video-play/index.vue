<template>
  <div class="g-video-play" ref="videoPlay">
    <!-- <div>视频播放</div> -->
    <!-- {{ fixedDom }} -->
    <!-- {{ videoUrl }} -->
    <!-- <video :src="videoUrl" class="video-dom" muted autoplay></video> -->
    <!-- <canvas ref="myCanvas"></canvas> -->
  </div>
</template>

<script lang="ts" name="GVideoPlay" setup>
import { ref } from 'vue'
import { mounted } from '@/utils'

let ctx: any;
let video: any;
let canvas: any;
let videoStatus: number = 1; // 1播放 0暂停
const myCanvas = ref()
const videoPlay = ref()
// const fixedDom = ref<any>([])

// https://m.v.qq.com/z/msite/play-short/index.html?cid=&vid=x351296fzuj&share_from=&ptag=v_qq_com#v.play.adaptor#3
const videoUrl = ref('https://aced65762f2d918ad0fef321e79c4605.v.smtcdns.com/om.tc.qq.com/ABFv5tqlQWkm7qXaHwu5XtFRaX8EnqyIBMeZqS5kPpIc/B_9LhzPzw8agpeEeKUHV_JXlpNAIah7_7nm6yMlHSb0JQ/svp_50001/szg_8366_50001_0bc3smai4aaawmafv7suursfde6dr2jqbdsa.f622.mp4?sdtfrom=v3010&guid=407e3348668b70395a298bbbd7fe3b3f&vkey=36F7732A85D96F21ADEE2A20AA001F05AB9E0784A51D1B6171F8A0FC38FBCCF385FA3033398B539D5B4D198FD5D70C05B44446FABD04D0C6ABEF62E6207794B0EF3922364C8AD91BAC880AA5788AECE03A7D411F96D54E3F55EE15474C92DF283C2758BC2DF1AEFB660CE0BA966F42C2443C53ED72CB79F1D79E52651BE836940CF2E099AE23D585')

mounted(() => {
  canvas = document.createElement('canvas')
  ctx = canvas.getContext('2d')

  video = document.createElement('video')
  video.src = videoUrl.value
  video.muted = true
  // video.autoplay = true

  video.play()
  videoStatus = 1
  // video.volume = 0.9
  
  video.addEventListener('canplay', function (e: any) {
    console.log(e.target.videoWidth)

    canvas.width = e.target.videoWidth
    canvas.height = e.target.videoHeight

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
})

const getVideoToCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
 
  if (videoStatus === 1) {
    requestAnimationFrame(getVideoToCanvas)
  }
}
</script>

<style lang="scss" scoped>
.g-video-play {
  .video-dom {
    width: 100%;
  }
}
</style>