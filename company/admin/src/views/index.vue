<template>
  <div class="app-main">
    <h1>首页</h1>
    <GTsx v-model:text="gtsxText" :tsxList="tsxList" @getInfo="getTsxData">
      <template #form-slot="{item}">
        <div>slot插槽--data:{{ item.value }}</div>
      </template>
    </GTsx>
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
      <img v-if="postImg" :src="postImg" title="海报" style="width: 300px;">
      <br/>
      <img v-if="qrcodeImg" :src="qrcodeImg" title="二维码" style="width: 100px;">
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
      <img v-if="drawBoardImg" :src="drawBoardImg" alt="">
    </template>

    <!-- 文字绘图 -->
    <GDrawFont v-if="activeName == 6"/>

    <!-- 网站摄像头 -->
    <template v-if="activeName == 7">
      只能在localhost或者https下才能使用该功能
      <!-- <GFindFrame/> -->
      
      <GFindFrame :width="500" :height="300" @getPhotoBlob="getPhotoBlob">
          <button style="width: 100px;height: 30px;text-align: center; line-height: 30px;color: red;">拍-拍-照</button>
      </GFindFrame>
      <img v-if="photoImg" :src="photoImg" title="照片">
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

    <!-- 视频播放 -->
    <GVideoPlay
      v-if="activeName == 13"
      width="350px"
      height="500px"
      url="https://gem530.github.io/img/testVideo.mp4"
    ></GVideoPlay>
    <GVideoPlay
      v-if="activeName == 13"
      width="550px"
      height="300px"
      url="https://gem530.github.io/img/testVideo2.mp4"
    ></GVideoPlay>
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
const photoImg = ref()
const qrcodeImg = ref()
const activeName = ref(13)
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
  { id: 13, name: '视频播放' },
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

const gtsxText = ref('首页测试g-tsx组件')
const tsxList = ref([
  { type: 'p', value: '这里是p标签' },
  { type: 'button', value: '这里是el-button标签', attrs: { type: 'primary' } },
  { type: 'slot', value: '这里是slot标签', prop: 'form-slot' },
])

const getTsxData = (val: string) => {
  console.log('getTsxData:', val)
}

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

const getPhotoBlob = (data: { blob: Blob, baseUrl: string }) => {
  console.log('blob----', data)
  photoImg.value = data.baseUrl
}
</script>