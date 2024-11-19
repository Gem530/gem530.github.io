import svgIcon from '@/components/svg-icon/index.vue'
import 'virtual:svg-icons-register'
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.component('svg-icon', svgIcon)
})