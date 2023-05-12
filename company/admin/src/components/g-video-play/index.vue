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
const videoUrl = ref('https://1bb832b4337f37eff63cbc34aa79a608.v.smtcdns.com/om.tc.qq.com/AdH6c2sw7Wh17kXV7xIIyF_jqdjuUe4oqqtShNdAg4hE/B_9LhzPzw8agpeEeKUHV_JXlpNAIah7_7nm6yMlHSb0JQ/svp_50001/szg_8366_50001_0bc3smai4aaawmafv7suursfde6dr2jqbdsa.f622.mp4?sdtfrom=v3010&guid=407e3348668b70395a298bbbd7fe3b3f&vkey=706F8D7804CC03F6203F4127A040EAE1DABF5716ADA26526A8BB7E81FC25B2A54D5E283D96C737CD3080A5EFE935D826D16EE1BB4CCAFE3F07F47D897DE02B6C5EE7DE2247EDF771EA156824771759A0A82E6F03F26C10A79E8CBD8FF9AC1923A64BC3F430FE15FF4B4F14D30F20F8C20CBF263B993EFB06D1BBD2F6582A5667F561DBA27667834D')

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