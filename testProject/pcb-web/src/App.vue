<template>
  <el-config-provider :locale="appStore.locale" :size="size">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'
import useAppStore from '@/store/modules/app';

const appStore = useAppStore();
const size = computed(() => (appStore.size || 'small') as any);
const bold = computed(() => (appStore.bold || 'delault') as any);

watch(() => size.value, (val) => {
  if (val) {
    document.body.setAttribute('class', val)
  }
}, { deep: true, immediate: true })

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
    appStore.setBold(bold.value);
    const windowWidth = window.innerWidth
    if (!localStorage.getItem('sizeValue')) { //  && size.value != 'large'
      appStore.setSize(windowWidth > 1440 ? 'default' : 'small') // default
    }
    localStorage.setItem('sizeValue', '1')
  })
})
</script>
