<template>
  <div>
    <h1>{{$t('router.home.title')}}</h1>
    <van-button @click="changeLanguage">按钮</van-button>
    <router-link to="/me">我的</router-link>
    <router-link to="/detail">详情</router-link>
    <img :src="img" alt="">
    <Qrcode value="https://www.baidu.com"></Qrcode>
    <p :key="i" v-for="i in 100">内容-{{i}}</p>
  </div>
</template>

<script lang="ts" setup name="Home">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import qrcode from '@/utils/qrcode'
import useApp from '@/store/modules/app'
import { getLocalItem } from '@/utils/storage'

const appSotre = useApp()
// console.log(appSotre.count, appSotre.doubleCount, appSotre.device, appSotre)
const { locale, t } = useI18n()

const img = ref('')

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