<template>
  <div class="contanir theme">
    签字板
    <!--
      left="true" // 下方的按钮是否显示在左侧
      width="350px" // 非必填 签字板宽度 默认100%
      height="350px" // 非必填 签字板高度 默认200px
      background="#000" // 非必填 签字板背景色 默认#fff
      default-color="pink" // 非必填 默认画笔颜色
      default-thickness="7" // 非必填 默认画笔粗细
      :colors="[{name:'黑',value:'#000'},{name:'粉',value:'pink'}]" // 非必填 画笔颜色列表 格式[{ name: '', value: '' }]
      :thickness="[{name:'细',value:'1'},{name:'粗',value:'5'}]" // 非必填 画笔粗细列表 格式[{ name: '', value: '' }]
      @upload="getImageBase" // 签字板结果 返回一个参数 blob 暂时是返回base64，便于演示结果
    -->
    <g-draw-board
      ref="drawBoardRef"
      :left="false"
      width="350px"
      height="350px"
      background="#fff"
      default-color="pink"
      default-thickness="2"
      :colors="[{name:'黑',value:'#000'},{name:'粉',value:'pink'}]"
      :thickness="[{name:'细',value:'1'},{name:'粗',value:'5'}]"
      @upload="getImageBase"
    ></g-draw-board>
    <div><button @click="changes">屏幕变化</button></div>
    <img :src="state.imageUrl" title="签字板结果">
  </div>
</template>

<script lang="ts">
export default { name: 'drawBoard' }
</script>
<script setup lang="ts">
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import gDrawBoard from '@/components/g-drawBoard/index.vue'

  let drawBoardRef = ref<any>(null)
  const state = reactive({
    imageUrl: ''
  })
  // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
  // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
  onMounted(() => {
    // console.log('onMounted')
  })

  // 签字板图片获取
  const getImageBase = (url: string) => {
    // console.log(url)
    state.imageUrl = url
  }

  const changes = () => {
    // 子组件需要defineExpose把resizeChange抛出来，才可以调用resizeChange
    drawBoardRef.value.resizeChange()
  }
</script>

<style lang="scss" scoped>

</style>