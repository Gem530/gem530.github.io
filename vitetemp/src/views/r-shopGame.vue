<template>
  <div class="contanir">
    九宫格抽奖
    <!--
      gift 中奖的id 0-7
      number 抽奖次数
      width 组件宽度
      height 组件高度
      list 奖品列表 目前只用了name，image { id: 0, name: '奖励11', image: 'https://img2.baidu.com/it/u=3719466279,99109861&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', type: 1, number: 1 }
      luckResult 结束方法 返回所中奖的对象 { id: 0, name: '奖励11', image: 'https://img2.baidu.com/it/u=3719466279,99109861&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', type: 1, number: 1 }
    -->
    <shopGameDom
      :gift="state.gift"
      :list="state.list"
      :width="350"
      :height="350"
      :number="state.number"
      @luckResult="luckResult"
    ></shopGameDom>
  </div>
</template>

<script lang="ts">
export default { name: 'shopGame' }
</script>
<script setup lang="ts">
  import shopGameDom from '@/components/shopGame/index.vue'
  import { reactive, onMounted } from 'vue'

  const state = reactive({
    gift: 5,
    number: 5,
    list: []
  })

  // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
  onMounted(() => {
    // console.log('onMounted')
    state.gift = twoNumberBetween(0, 7)
    state.number = twoNumberBetween(0, 7)
  })

  // 抽奖结束方法
  const luckResult = (data: any) => {
    console.log('结束', data)
    state.number -= 1
    state.gift = twoNumberBetween(0, 7)
  }

  // 取两数之间的随机整数
  const twoNumberBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min)
  }
</script>

<style lang="scss" scoped>

</style>