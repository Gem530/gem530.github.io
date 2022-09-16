<template>
  <div class="app-wrapper">
    <SideBar></SideBar>
    <div class="main-wrapper">
      <div class="fixed-header">
        <NavBar/>
      </div>
      <div class="header-mask"></div>
      <AppMain/>
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