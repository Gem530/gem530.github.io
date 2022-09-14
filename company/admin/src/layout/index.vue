<template>
  <div class="app-wrapper">
    <div class="side-bar">
      <SideBar></SideBar>
    </div>
    <div class="main-wrapper">
      <div class="fixed-header">头部</div>
      <div class="header-mask"></div>
      <div>主体</div>
    </div>
  </div>
</template>

<script lang="ts" setup name="layout">
import SideBar from './SideBar/index.vue'
</script>

<style lang="scss" scoped>
.app-wrapper {
  width: 100%;
  height: 100%;
  display: flex;

  .side-bar {
    flex: none;
    width: $baseSideBarWidth;
  }

  .main-wrapper {
    flex: none;
    width: calc(100% - $baseSideBarWidth);

    .fixed-header {
      position: fixed;
      top: 0;
      left: $baseSideBarWidth;
      width: 100%;
      height: $baseFixedHeaderHeight;
    }

    .header-mask {
      height: $baseFixedHeaderHeight;
    }
  }
}
</style>