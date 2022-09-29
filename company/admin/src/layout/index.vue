<template>
  <div class="app-wrapper">
    <side-bar></side-bar>
    <div class="main-wrapper theme">
      <div class="fixed-header">
        <nav-bar/>
        <tags-menu/>
      </div>
      <div class="header-mask"></div>
      <app-main/>
    </div>
  </div>
</template>

<script lang="ts" setup name="layout">
</script>

<style lang="scss" scoped>
.app-wrapper {
  width: 100%;
  height: 100%;
  display: flex;

  .main-wrapper {
    flex: none;
    width: calc(100% - $baseSideBarWidth);
    padding: 10px;
    overflow-y: auto;

    .fixed-header {
      position: fixed;
      top: 0;
      left: $baseSideBarWidth;
      width: calc(100% - $baseSideBarWidth);
      height: $baseFixedHeaderHeight;
    }

    .header-mask {
      height: $baseFixedHeaderHeight;
    }
  }
}
</style>