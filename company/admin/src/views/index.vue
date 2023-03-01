<template>
  <div class="app-main">
    <h1>首页</h1>
    <img :src="postImg" title="海报" style="width: 300px;">
  </div>
</template>

<script setup lang="ts" name="home">
import { ref, nextTick } from 'vue'
import Poster from '@/utils/poster'

const postImg = ref()
const list: any[] = [
  [
    {
      x: 0,
      y: 0,
      width: 236,
      height: 428,
      url: 'https://fastly.jsdelivr.net/npm/@vant/assets/sand.jpeg',
      type: 'image',
      name: 'baseImg',
    },
    {
      x: 180,
      y: 375,
      width: 45,
      height: 45,
      type: 'image',
      name: 'qrcode',
      url: 'https://www.baidu.com',
    },
    {
      x: 10,
      y: 400,
      name: 'link',
      type: 'text',
      url: 'https://www.baidu.com',
      color: 'white',
      font: '26px Arial'
    }
  ]
]
nextTick(async () => {
  let poster: Poster = new Poster(list) // list为一维数组时不可调用drawAll，会报错
  const res = await poster.drawAll()
  postImg.value = res[0]
})
</script>