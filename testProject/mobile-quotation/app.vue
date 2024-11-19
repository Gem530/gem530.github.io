<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <!-- <CookiePop></CookiePop> -->
      <g-footer></g-footer>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import * as vant from 'vant';
// 引入英文语言包
import zh_CN from 'vant/es/locale/lang/zh-CN';
import en_US from 'vant/es/locale/lang/en-US';
import ru_RU from 'vant/es/locale/lang/ru-RU';
import ko_KR from 'vant/es/locale/lang/ko-KR';

// Locale.use('en-US', enUS);
const languageObj: any = {
  zh_CN,
  en_US,
  ru_RU,
  ko_KR,
};

const route = useRoute()
const { locale } = useI18n()
// 多语言没切换，需要使用computed或者函数引用
onMounted(() => {
  let initArr = Object.keys(languageObj)
  let lang: undefined|null|string = useIPLang().value
  if (localStorage.getItem('lang')) lang = localStorage.getItem('lang')
  // if (route.query?.lang) {
  //   lang = route.query.lang
  // }
  // console.log(lang)
  if (lang && !lang?.includes('_')) {
    lang = undefined
  }
  locale.value = lang || useRuntimeConfig().public.VITE_BASE_LOCALE
  locale.value = initArr.includes(locale.value) ? locale.value : 'en_US'
  vant.Locale.use(locale.value.replace('_','-'), locale.value)
  useLang().value = locale.value
  localStorage.setItem('lang', locale.value)
  // 全局数据的持久化
  getLocal()
  // if (env().VITE_PACK_ENV != 'dev') {
  //   window.onbeforeunload = () => {
  //     setLocal()
  //   }
  // }
})
useSeoMeta({
  title: 'PCBSUPER | PCB | PCBA | Quick-turn PCB | Prototype | Small batch',
  ogTitle: 'PCBSUPER | PCB | PCBA | Quick-turn PCB | Prototype | Small batch',
  description: 'PCBSUPER | PCB | PCBA | Quick-turn PCB | Prototype | Small batch',
  ogDescription: 'PCBSUPER | PCB | PCBA | Quick-turn PCB | Prototype | Small batch',
  // ogImage: 'https://example.com/image.png',
  // twitterCard: 'summary_large_image',
})
</script>

<style lang="scss" scoped>
// @import url('~/assets/styles/index.scss');
</style>
