<template>
  <div>
    <h1>{{$t('router.home.title')}}</h1>
    <van-button @click="changeLanguage">按钮</van-button>
    <router-link to="/me">我的</router-link>
    <router-link to="/detail">详情</router-link>
    <img :src="img" alt="">
    <Qrcode value="https://www.baidu.com"></Qrcode>
    <p></p>
    <GUpload v-model="imgs" multiple></GUpload>
    <GPicker
      v-model="ads"
      label="Picker"
      :data="columns"
      placeholder="请选择Picker"
      :columns-field-names="customFieldName"
    ></GPicker>
    <p :key="i" v-for="i in 100">内容-{{i}}</p>
  </div>
</template>

<script lang="ts" setup name="Home">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import qrcode from '@/utils/qrcode'
import useApp from '@/store/modules/app'
import { getLocalItem } from '@/utils/storage'

const appSotre = useApp()
// console.log(appSotre.count, appSotre.doubleCount, appSotre.device, appSotre)
const { locale, t } = useI18n()

const img = ref('')
const ads = ref('')
const imgs = ref(['https://fastly.jsdelivr.net/npm/@vant/assets/sand.jpeg'])

// const columns = ref([ '湖南', '广东', '广西' ])
const columns = ref([
  { name: '湖南', value: 1 },
  { name: '广东', value: 2 },
  { name: '广西', value: 3 },
])

const customFieldName = {
  text: 'name',
};

watch(() => imgs.value, (val: string[]) => {
  console.log('imgs', val)
})

const changeLanguage = () => {
  locale.value = (getLocalItem('lang') == 'zh_CN') ? 'en_US' : 'zh_CN'
  appSotre.setLang(locale.value)
}

qrcode('https://www.baidu.com').then(base => {
  // console.log(base)
  img.value = base as string
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