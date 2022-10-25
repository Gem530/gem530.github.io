import Pinia from '@/store'
import { watch } from 'vue'
import { Locale } from 'vant'
import { createI18n } from 'vue-i18n'
import useApp from '@/store/modules/app'

const appStore = useApp(Pinia)

// 自定义国际化文件
import zh_CN from './lang/zh_CN'
import en_US from './lang/en_US'
import zhCN from 'vant/es/locale/lang/zh-CN'
import enUS from 'vant/es/locale/lang/en-US'

const messages = {
  zh_CN:{
      ...zhCN,
      ...zh_CN
  },
  en_US:{
      ...enUS,
      ...en_US,
  }
}

//获取默认语言
const lang = appStore.lang;

const i18n = createI18n({
    legacy: false, // Composition API 模式
    globalInjection: true, // 全局注册 $t方法
    // 默认语言
    locale: lang,
    // 语言库
    messages
});
/* 获取语言包 */
const m: any = i18n.global.messages.value
/* 默认设置Vant语言 */
Locale.use(lang, m[lang]);

//监听变化语言变化切换Vant组件语言
watch(()=>i18n.global.locale.value,(newValue: string, oldValue: string)=>{
  Locale.use(newValue, m[newValue]);
  if(newValue!==oldValue){
    appStore.setLang(newValue).then(() => {
        location.reload()
    })
  }
})

export default i18n