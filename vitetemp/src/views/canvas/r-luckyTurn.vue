<template>
  <div class="contanir theme">
    <g-lucky-turn></g-lucky-turn>
  </div>
</template>

<script lang="ts">
export default { name: 'luckyTurn' }
</script>
<script setup lang="ts">
  import { onMounted } from 'vue'
  import gLuckyTurn from '@/components/g-luckyTurn/index.vue'
  // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
  // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
  onMounted(() => {
    console.log('onMounted')
  })
</script>

<style lang="scss" scoped>

</style>