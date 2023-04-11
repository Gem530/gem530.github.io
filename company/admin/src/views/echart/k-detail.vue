<template>
  <div>
    <h2>k线图/lightweight-charts</h2>
    <!-- <g-light-charts></g-light-charts> -->
    <echart-k></echart-k>
  </div>
</template>

<script lang="ts" setup name="light-charts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { klineType, getKline } from '@/api'
import { mounted, unMounted } from '@/utils'
import useWebSocket from '@/store/modules/socket'
const useSocket = useWebSocket()

const route = useRoute()
const kLine = ref<klineType[]>([])
const symbolName = ref<string>('btcusdt')
if (route.query.id) {
  symbolName.value = route.query.id as string
}

const getKlineAPI = () => {
  const params = {
    symbol: symbolName.value,
    period: '1min',
    size: 2000
  }
  getKline(params).then((res: any) => {
    console.log(res)
  })
}
getKlineAPI()

// mounted(() => {
//   useSocket.send('market.overview', 'OVERVIEW', (res: any) => {
//     liveList.value = res.data || []
//   })
// })

// unMounted(() => {
//   useSocket.unSend('market.overview', 'OVERVIEW')
// })
</script>

<style lang="scss">
</style>