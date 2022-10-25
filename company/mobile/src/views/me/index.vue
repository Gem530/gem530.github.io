<template>
  <div>
    <h1>{{$t('router.me.title')}}</h1>
    <h2>测试scss文件</h2>
    <router-link to="/">首页</router-link>
  </div>
</template>

<script lang="ts" setup name="Me">
</script>

<style lang="scss" scoped>
h2 {
  color: $bodyColorWhite;
  background: #000;
}
</style>