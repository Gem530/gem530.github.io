<template>
  <div>
    <h1>{{$t('router.home.title')}}</h1>
    <van-button @click="changeLanguage">当前语言-{{locale}}</van-button>
    <p><router-link to="/me">我的</router-link></p>
    <p><router-link to="/detail">详情</router-link></p>
    <p><router-link to="/commonStyle">复用样式</router-link></p>
    <img :src="img" alt="">
    <Qrcode value="https://www.baidu.com"></Qrcode>
    <p></p>
    <GUpload v-model="imgs" multiple></GUpload>
    <GPicker
      v-model="ads"
      label="Picker"
      :data="columns"
      placeholder="请选择Picker"
      :attrs="{ columnsFieldNames: {text: 'name'} }"
    ></GPicker>
    <p :key="i" v-for="i in 100">内容-{{i}}</p>

    <img :src="postImg" style="width: 100%;">
  </div>
</template>

<script lang="ts" setup name="Home">
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import qrcode from '@/utils/qrcode'
import Poster from '@/utils/poster'
import useApp from '@/store/modules/app'
import { getLocalItem } from '@/utils/storage'
import poster_1 from '@/assets/images/33.jpg'

const appSotre = useApp()
// console.log(appSotre.count, appSotre.doubleCount, appSotre.device, appSotre)
const { locale, t } = useI18n()

const img = ref('')
const ads = ref('')
const imgs = ref(['https://fastly.jsdelivr.net/npm/@vant/assets/sand.jpeg'])
const postImg = ref('')

// const columns = ref([ '湖南', '广东', '广西' ])
const columns = ref([
  { name: '湖南', value: 1 },
  { name: '广东', value: 2 },
  { name: '广西', value: 3 },
])

const list: any[] = [
  [
    {
      x: 0,
      y: 0,
      width: 236,
      height: 428,
      url: poster_1,
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
      y: 358,
      name: 'link',
      type: 'text',
      url: '绘制文字',
      color: 'white',
      font: '26px Arial'
    }
  ]
]

watch(() => imgs.value, (val: string[]) => {
  console.log('imgs', val)
})

const changeLanguage = () => {
  locale.value = (getLocalItem('lang') == 'zh_CN') ? 'en_US' : 'zh_CN'
  appSotre.setLang(locale.value)
}

// qrcode('https://www.baidu.com').then(base => {
//   // console.log(base)
//   img.value = base as string
// })
// let poster: Poster = new Poster(list)
// poster.drawAll().then((base: string[]) => {
//   postImg.value = base[0]
//   console.log(base)
// })
nextTick(async () => {
  img.value = await qrcode('https://www.baidu.com') as string

  let poster: Poster = new Poster(list) // list为一维数组时不可调用drawAll，会报错
  const res = await poster.drawAll()
  postImg.value = res[0]
})
</script>

<style lang="scss" scoped>
div {
  .van-button {
    width: 200px;
    height: 100px;
    background: #00f;
    font-size: 16px;
    color: #fff;
  }
}
</style>