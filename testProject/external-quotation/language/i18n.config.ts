import en_US from '@/language/locale/en_US'
import zh_CN from '@/language/locale/zh_CN'
import ru_RU from '@/language/locale/ru_RU'
import ko_KR from '@/language/locale/ko_KR'
export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en_US',
    messages: {
      en_US,
      zh_CN,
      ru_RU,
      ko_KR,
    }
}))