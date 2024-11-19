<template>
    <el-select v-model="lang" class="address-choose" @change="changeLang">
        <el-option :label="$t('english')" value="en_US"/>
        <el-option :label="$t('chinese')" value="zh_CN"/>
        <el-option :label="$t('russian')" value="ru_RU"/>
    </el-select>
</template>

<script setup lang="ts" name="ChangeLang">
const { locale } = useI18n()
const lang = ref(useRuntimeConfig().public.VITE_BASE_LOCALE)
onMounted(() => {
  let language: undefined|null|string = localStorage.getItem('lang')
  if (language && !language?.includes('_')) {
    language = undefined
  }
  if (language) lang.value = language
})

const changeLang = (val: string) => {
    lang.value = val
    locale.value = lang.value
    localStorage.setItem('lang', lang.value)
    useLang().value = locale.value
}
</script>

<style lang="scss" scoped>
.address-choose {
    width: 100px;
    margin-left: 5px;

    :deep(.el-input__suffix-inner) {
        width: 25px;
    }
}
</style>