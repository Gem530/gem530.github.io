<template>
  <div class="app-main">
    <h1>首页</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane
        :key="item.id"
        :name="item.id"
        :label="item.name"
        v-for="item in tabsList"
      ></el-tab-pane>
    </el-tabs>

    <template v-if="activeName == 1">
      <!-- 海报和二维码 -->
      <img :src="postImg" title="海报" style="width: 300px;">
      <br/>
      <img :src="qrcodeImg" title="二维码" style="width: 100px;">
    </template>

    <!-- 毛玻璃 -->
    <GCanvasBlur
      v-if="activeName == 2"
      :x='100'
      :y='100'
      :width='200'
      :height='200'
      url='https://gem530.github.io/img/33.jpg'
    ></GCanvasBlur>

    <!-- 头像裁剪 -->
    <GClipImg
      v-if="activeName == 3"
      :x="150"
      :y="150"
      :width="300"
      :rotate="90"
      :height="300"
      :maxScale="3"
      :minScale="0.01"
      :clipWidth="80"
      :clipHeight="80"
      :scaleStep="0.01"
      maskColor="rgba(0, 0, 0, 0.5)"
      @getImg="getImg"
    ></GClipImg>

    <!-- 图形验证码 -->
    <GCode num="2357" v-if="activeName == 4"/>

    <template v-if="activeName == 5">
      <!-- 签字板 -->
      <GDrawBoard v-model:url="drawBoardImg" width="300px" height="300px"/>
      <img :src="drawBoardImg" alt="">
    </template>

    <!-- 文字绘图 -->
    <GDrawFont v-if="activeName == 6"/>

    <!-- 网站摄像头 -->
    <template v-if="activeName == 7">
      只能在localhost或者https下才能使用该功能
      <GFindFrame/>
    </template>

    <!-- 图片标注 -->
    <GImgOverlays
      v-if="activeName == 8"
      :width="300"
      :height="300"
      @getImg="getImg"
    />

    <!-- 轮盘抽奖 -->
    <GLuckyTurn v-if="activeName == 9"/>

    <!-- 梅花背景 -->
    <GPlumTree v-if="activeName == 10"/>

    <!-- 九宫格抽奖 -->
    <GShopGame
      v-if="activeName == 11"
      :gift="state.gift"
      :list="state.list"
      :width="350"
      :height="350"
      :number="state.number"
      @luckResult="luckResult"
    />

    <!-- 刮刮乐 -->
    <GScrapeMusic
      v-if="activeName == 12"
      :maxArea="20"
      width="300px"
      height="400px"
      url="https://d1.faiusr.com/4/AAEIABAEGAAgtZ-56QUoufyr5gQw9gE4kwM.png"
      @getResult="getResult"
    ></GScrapeMusic>
  </div>
</template>

<script setup lang="ts" name="home">
import { ref, reactive, nextTick } from 'vue'
import Poster from '@/utils/poster'
import qrcode from '@/utils/qrcode'
import tableHook from '@/hooks/table'
import { twoNumberBetween } from '@/utils'
const {
  succesTip
} = tableHook()
interface imgInfo {
    url: String,
    blob: Blob
}

const postImg = ref()
const qrcodeImg = ref()
const activeName = ref(4)
const drawBoardImg = ref()
const tabsList = ref([
  { id: 1, name: '海报' },
  { id: 2, name: '毛玻璃' },
  { id: 3, name: '头像裁剪' },
  { id: 4, name: '图形验证码' },
  { id: 5, name: '签字板' },
  { id: 6, name: '文字绘图' },
  { id: 7, name: '网站摄像头' },
  { id: 8, name: '图片标注' },
  { id: 9, name: '轮盘抽奖' },
  { id: 10, name: '梅花背景' },
  { id: 11, name: '九宫格抽奖' },
  { id: 12, name: '刮刮乐' },
])
const state = reactive({
  gift: 5,
  number: 5,
  list: []
})
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
  qrcode('https://www.baidu.com').then((res) => {
    qrcodeImg.value = res
  })
})

// 获取截取的图片
const getImg = (item: imgInfo) => {
    console.log(item)
}

// 抽奖结束方法
const luckResult = (data: any) => {
    // console.log('结束', data)
    succesTip('恭喜您，获得了' + data.name)
    state.number -= 1
    state.gift = twoNumberBetween(0, 7)
}

const getResult = (data: { currentArea: number, isSuccess: boolean }) => {
  console.log('getResult', data)
}
</script>