<template>
  <div>
    <h2>k线图-{{symbolName}}/echarts-kline</h2>
    <!-- <el-input v-model="symbolName" placeholder="输入币种名称"></el-input> -->
    <el-select
      filterable
      v-model="symbolName"
      placeholder="输入币种名称">
      <el-option
        :key="item.sc"
        :label="item.sc"
        :value="item.sc"
        v-for="item in symbolList"
      />
    </el-select>
    <!-- <g-light-charts></g-light-charts> -->
    <echart-k :currency="symbolName"></echart-k>
  </div>
</template>

<script lang="ts" setup name="k-detail">
import { ref } from 'vue'
import { getSymbolList } from '@/api'
import { useRoute } from 'vue-router'

const route = useRoute()
const symbolList = ref<any[]>([])
const symbolName = ref<string>('btcusdt')
if (route.params.id) {
  symbolName.value = route.params.id as string
}

const getSymbolListAPI = () => {
  getSymbolList().then((res: any) => {
    // console.log(res)
    symbolList.value = res.data || []
    symbolList.value = symbolList.value.filter((v: any) => v.state === 'online')
  })
}
getSymbolListAPI()
</script>

<style lang="scss">
</style>