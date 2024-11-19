<template>
  <div>
    <el-config-provider :locale="languageObj[locale]" size="default">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <el-backtop :right="20" :bottom="260" />
    </el-config-provider>
    <CookiePop></CookiePop>
  </div>
</template>

<script setup lang="ts">
import zh_CN from 'element-plus/es/locale/lang/zh-cn';
import en_US from 'element-plus/es/locale/lang/en';
import ru_RU from 'element-plus/es/locale/lang/ru';
import ko_KR from 'element-plus/es/locale/lang/ko';
const languageObj: any = {
  zh_CN,
  en_US,
  ru_RU,
  ko_KR
};

const route = useRoute()
const { locale } = useI18n()
locale.value = useLang().value
// 多语言没切换，需要使用computed或者函数引用
onMounted(() => {
  let initArr = Object.keys(languageObj)
  // if (useLang().value != 'en_US') {
  //   localStorage.setItem('lang', useLang().value)
  // }
  let lang: undefined|null|string = useIPLang().value
  if (localStorage.getItem('lang')) lang = localStorage.getItem('lang')
  // if (route.query?.lang) {
  //   lang = route.query.lang as string
  // }
  if (lang && !lang?.includes('_')) {
    lang = undefined
  }
  locale.value = lang || useRuntimeConfig().public.VITE_BASE_LOCALE
  locale.value = initArr.includes(locale.value) ? locale.value : 'en_US'
  useLang().value = locale.value
  localStorage.setItem('lang', locale.value)
  // 全局数据的持久化
  getLocal()

  setTimeout(() => {
    console.log('useHeadersParams().value', useHeadersParams().value)
  }, 1000)
  // if (env().VITE_PACK_ENV != 'dev') {
  //   window.onbeforeunload = () => {
  //     setLocal()
  //   }
  // }

  // $http('prod-api1/check', {
  //   method: 'get',
  //   isHttp: true
  // }).then((res: any) => {
  //   if (res.success) {
  //     navigateTo({
  //       path: '/welcome',
  //       replace: true
  //     })
  //   }
  //   sessionStorage.setItem('useIsCountry', res.success)
  // })
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
