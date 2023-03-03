<template>
  <div class="nav-bar">
    <div class="nav-left">
      <el-button
        size="small"
        type="primary"
        v-if="!isMobile()"
        :icon="isCollapse ? 'Expand' : 'Fold'"
        @click="changeSide"
      ></el-button>
      <breadcrumb></breadcrumb>
    </div>

    <div class="nav-right">
      <el-button
        size="small"
        type="primary"
        v-if="isMobile()"
        :icon="isCollapse ? 'Expand' : 'Fold'"
        @click="changeSide"
      ></el-button>
      <el-button class="hidden-xs-only" size="small" type="primary" @click="changeColor">换肤</el-button>
      <admin-info></admin-info>
    </div>
  </div>
</template>

<script lang="ts" setup name="nav-bar">
import { isMobile } from '@/utils'
import { useWindowSize } from '@vueuse/core'
import { ref, computed, watchEffect } from 'vue'
import useLayoutStore from '@/store/modules/layout'
import { toggleTheme, changeScssData } from '@/utils/theme'
const layoutStore = useLayoutStore()
const isCollapse = computed(() => layoutStore.isCollapse)
const isMobileCollapse = computed(() => layoutStore.isMobileCollapse)
const colorFlag = ref(false)

const changeSide = () => {
  if (isMobile()) {
    layoutStore.changeMobileCollapse(!isMobileCollapse.value)
    return
  }
  layoutStore.changeCollapse(!isCollapse.value)
}

const { width, height } = useWindowSize();
const minWIDTH = 992; // refer to Bootstrap's responsive design
watchEffect(() => {
  if (isMobile()) {
    changeScssData('--base-side-bar-width', '0px')
    return
  }
  if (minWIDTH < width.value) {
    layoutStore.changeCollapse(false)
  } else {
    layoutStore.changeCollapse(true)
  }
})

const changeColor = () => {
  const theme = {
    bg: colorFlag.value ? '#fff' : '#333',
    text: colorFlag.value ? '#333' : '#fff'
  }
  toggleTheme(theme)
  colorFlag.value = !colorFlag.value
}
</script>

<style lang="scss" scoped>
.nav-bar {
  @include flex(space-between);
  height: 40px;
  padding: 5px 10px 0;

  .nav-left {
    @include flex(flex-start);
  }

  .nav-right {
    @include flex(flex-end);
  }
}
</style>