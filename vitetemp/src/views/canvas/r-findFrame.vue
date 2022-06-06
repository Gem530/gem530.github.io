<template>
  <div class="contanir theme">
    <g-find-frame :width="500" :height="300" @getPhotoBlob="getPhotoBlob">
      <button style="width: 100px;height: 30px;text-align: center; line-height: 30px;color: red;">拍-拍-照</button>
    </g-find-frame>

    <img :src="url" alt="">
  </div>
</template>

<script lang="ts">
export default { name: 'findFrame' }
</script>
<script setup lang="ts">
  import { onMounted } from 'vue'
  import gFindFrame from '@/components/g-findFrame/index.vue'

  const url = ref('')
  // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
  // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
  onMounted(() => {
    // console.log('onMounted')
  })

  const getPhotoBlob = (data: { blob: Blob, baseUrl: string }) => {
    // console.log('blob----', data)
    url.value = data.baseUrl
  }
</script>

<style lang="scss" scoped>

</style>