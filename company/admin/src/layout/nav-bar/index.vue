<template>
  <div class="nav-bar">
    <div class="nav-left">
      <el-button
        size="small"
        type="primary"
        :icon="isCollapse ? 'Expand' : 'Fold'"
        @click="changeSide"
      ></el-button>
      <breadcrumb></breadcrumb>
    </div>

    <div class="nav-right">
      <el-button size="small" type="primary" @click="changeColor">换肤</el-button>
      <admin-info></admin-info>
    </div>
  </div>
</template>

<script lang="ts" setup name="nav-bar">
import { ref, computed } from 'vue'
import useLayoutStore from '@/store/modules/layout'
import { toggleTheme, changeScssData } from '@/utils/theme'
const layoutStore = useLayoutStore()
const isCollapse = computed(() => layoutStore.isCollapse)
const colorFlag = ref(false)

const changeSide = () => {
  layoutStore.toggleCollapse()
  changeScssData('--base-side-bar-width', isCollapse.value ? '64px' : '200px')
}

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
  padding: 5px 10px;

  .nav-left {
    @include flex(flex-start);
  }

  .nav-right {
    @include flex(flex-end);
  }
}
</style>