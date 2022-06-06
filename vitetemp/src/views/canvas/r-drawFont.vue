<template>
  <div class="contanir theme">
    <input type="text" v-model="text" style="width: 100%;">
    <g-draw-font :text="text"></g-draw-font>
  </div>
</template>

<script lang="ts">
export default { name: 'drawFont' }
</script>
<script setup lang="ts">
  import { onMounted } from 'vue'
  import gDrawFont from '@/components/g-drawFont/index.vue'

  const text = ref('富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善、')
  // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
  // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
  onMounted(() => {
    console.log('onMounted')
  })
</script>

<style lang="scss" scoped>

</style>