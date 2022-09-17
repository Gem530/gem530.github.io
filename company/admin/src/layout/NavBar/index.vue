<template>
  <div class="nav-bar">
    <div class="nav-left">
      <el-button
        size="small"
        type="primary"
        :icon="isCollapse ? 'Expand' : 'Fold'"
        @click="changeSide"
      ></el-button>
      <Breadcrumb></Breadcrumb>
    </div>

    <div class="nav-right">
      <el-button size="small" type="primary" @click="changeColor">换肤</el-button>
      <AdminInfo></AdminInfo>
    </div>
  </div>
</template>

<script lang="ts" setup name="NavBar">
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
// import { bgThemeWhiteInit, textBlackInit } from '@/assets/styles/variables.module.scss'
const store = useStore()
const isCollapse = computed(() => store.state.isCollapse)
const colorFlag = ref(false)

const changeSide = () => {
  store.commit('toggleCollapse')
  changeScssData('--base-side-bar-width', isCollapse.value ? '64px' : '200px')
}

const changeColor = () => {
  changeScssData('--bg-theme-white', colorFlag.value ? '#fff' : '#333')
  changeScssData('--text-theme-black', colorFlag.value ? '#333' : '#fff')
  colorFlag.value = !colorFlag.value
}

// 改变scss全局变量方法
const changeScssData = (varName: string, varValue: string) => {
  // 使用这个方法改变scss全局变量时，scss定义需要这样：$white: var(--colorWhite, #ffffff); 要加上var(--xxx, xxx)
  document.getElementsByTagName('body')[0].style.setProperty(varName, varValue)
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