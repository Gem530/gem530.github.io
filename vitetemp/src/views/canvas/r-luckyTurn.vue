<template>
  <div class="contanir theme">
    <div>
      <g-lucky-turn
        :luckyW="1500"
        :luckyH="1500"
        :luckyIndex="num"
        luckyImg='https://gem530.github.io/img/lucky_bg.png'
        @endPlay="endPlay"
      ></g-lucky-turn>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: "luckyTurn" };
</script>
<script setup lang="ts">
  import { onMounted } from "vue";
  import gLuckyTurn from "@/components/g-luckyTurn/index.vue";
  const num = ref(0)
  // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
  // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
  onMounted(() => {
    console.log("onMounted");
    num.value = twoNumberBetween(0, 8)
    console.log(num)
  });

  const endPlay = (data: boolean) => {
    console.log("endPlay---", data);
    num.value = twoNumberBetween(0, 8)
    console.log(num)
  };

  // 取两数之间的随机整数
  const twoNumberBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min)
  }
</script>

<style lang="scss" scoped>
</style>