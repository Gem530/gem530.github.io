<template>
  <div class="contanir theme">
    <!-- keep-alive 用法 -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </router-view>
  </div>
</template>

<script lang="ts">
export default { name: 'content' }
</script>
<script setup lang="ts">
  // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
  // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
  // onMounted(() => {
  //   console.log('onMounted')
  // })
</script>

<style lang="scss" scoped>
.contanir {
  position: fixed;
  top: $topHeight;
  left: $leftWidth;
  @include wh(calcF(100vw, $leftWidth), calcF(100vh, $topHeight));
  overflow-y: auto;
  z-index: 1;

  @include overflowAutoHid();
}
</style>