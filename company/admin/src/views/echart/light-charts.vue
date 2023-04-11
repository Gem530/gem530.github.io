<template>
  <div>
    <!-- <h2>k线图/lightweight-charts</h2>
    <g-light-charts></g-light-charts>
    <echart-k></echart-k> -->

    <h2>实时数据列表</h2>
    <div class="list">
      <div class="list-name title">币种名称</div>
      <div class="list-price title">价格</div>
      <div class="list-vol title">交易量</div>
    </div>
    <div class="list" v-for="item in liveList" :key="item.symbol">
      <div class="list-name">{{ item.symbol.toLocaleUpperCase().replace('USDT','') }}</div>
      <div class="list-price">{{ item.amount }}</div>
      <div class="list-vol">{{ item.vol }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup name="light-charts">
import { ref } from 'vue'
import { currencyType, getTimestamp } from '@/api'
import { mounted, unMounted } from '@/utils'
import useWebSocket from '@/store/modules/socket'
const useSocket = useWebSocket()

const liveList = ref<currencyType[]>([])

const getTimestampAPI = () => {
  getTimestamp().then((res: any) => {
    console.log(res)
  })
}
getTimestampAPI()

mounted(() => {
  useSocket.send('market.overview', 'OVERVIEW', (res: any) => {
    liveList.value = res.data || []
  })
})

unMounted(() => {
  useSocket.unSend('market.overview', 'OVERVIEW')
})
</script>

<style lang="scss">
.list {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: lightblue;
  }

  .list-name,
  .list-price,
  .list-vol {
    flex: 1;
    &.title {
      font-weight: 600;
    }
  }
}
</style>