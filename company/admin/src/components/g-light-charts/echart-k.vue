<template>
  <div class="switch-list">
    <div
      :key="item"
      :class="{ 'switch-item':true, 'active':item===curTime}"
      v-for="item in switchList"
      @click="switchTime(item)"
    >{{item}}</div>
  </div>
  <div ref="echartsDom" :style="`width: ${props.width};height: ${props.height};`"></div>
</template>

<script lang="ts" setup name="g-echart-k">
// import * as echarts from 'echarts'
import echarts from '../g-echart/requestEachrts'
// import { jsonList, jsonList1 } from '@/views/echart/config'
import {
  ref,
  watch,
  nextTick,
  defineProps,
  withDefaults
} from 'vue'
import dayjs from 'dayjs'
import { klineType, getKline } from '@/api'
import { mounted, unMounted } from '@/utils'
import useWebSocket from '@/store/modules/socket'
const useSocket = useWebSocket()

const echartsDom = ref()
const props = withDefaults(defineProps<{
    width?: string,
    height?: string,
    currency?: string,
}>(), {
    width: '800px',
    height: '500px',
    currency: 'btcusdt',
})

let myChart: any
let upColor: any
let downColor: any
const switchList = ref(['1min', '5min', '15min', '30min', '60min', '4hour', '1day', '1mon', '1week', '1year'])
const kLine = ref<klineType[]>([])
const curTime = ref<string>('1min')

watch(() => props.currency, (val, old) => {
  if (old) {
    // console.log(old)
    unSendWsKline(old)
  }
  if (val) {
    nextTick(() => {
      getKlineAPI()
    })
  }
}, { immediate: true })

const getKlineAPI = () => {
  const params = {
    symbol: props.currency,
    period: curTime.value,
    size: 2000
  }
  getKline(params).then((res: any) => {
    kLine.value = (res.data || []).sort((a: klineType, b: klineType) => {
      return a.id - b.id
    })

    nextTick(() => {
      myChart = echarts.init(echartsDom.value, 'dark')
      upColor = '#00c087';
      downColor = '#ff7858';
      init()
      unSendWsKline()
      sendWsKline()
    })
    
  })
}

// mounted(() => {
// })

unMounted(() => {
  unSendWsKline()
})

const sendWsKline = () => {
  useSocket.send(`market.${props.currency}.kline.${curTime.value}`, props.currency, (res: any) => {
    // console.log(res.tick)
    if (res.tick) {
      const index = kLine.value.findIndex((v: klineType) => v.id === res.tick.id)

      if (index === -1) kLine.value.push(res.tick)
      else kLine.value.splice(index, 1, res.tick)

      update()
    }
  })
}

const unSendWsKline = (val:string = props.currency) => {
  useSocket.unSend(`market.${val}.kline.${curTime.value}`, props.currency)
}

const init = () => {
  var data = splitData(JSON.parse(JSON.stringify(kLine.value)));
  myChart.setOption({
    animation: false,
    legend: {
      bottom: 30,
      left: 'center',
      data: ['蜡烛图', 'MA5', 'MA10', 'MA20', 'MA30']
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      textStyle: {
        color: '#000'
      },
      position: function (pos: any, params: any, el: any, elRect: any, size: any) {
        const obj: any = {
          top: 10
        };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        return obj;
      }
      // extraCssText: 'width: 170px'
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all'
        }
      ],
      label: {
        backgroundColor: '#777'
      }
    },
    // toolbox: {
    //   feature: {
    //     dataZoom: {
    //       yAxisIndex: false
    //     },
    //     brush: {
    //       type: ['lineX', 'clear']
    //     }
    //   }
    // },
    // brush: {
    //   xAxisIndex: 'all',
    //   brushLink: 'all',
    //   outOfBrush: {
    //     colorAlpha: 0.1
    //   }
    // },
    visualMap: {
      show: false,
      seriesIndex: 5,
      dimension: 2,
      pieces: [
        {
          value: 1,
          color: downColor
        },
        {
          value: -1,
          color: upColor
        }
      ]
    },
    grid: [
      {
        left: '5%',
        right: '10%',
        height: '50%'
      },
      {
        left: '5%',
        right: '10%',
        top: '63%',
        height: '16%'
      }
    ],
    xAxis: [
      {
        axisLabel: {
          formatter: function (value: any) {
            return dayjs(value).format('MM-DD HH:mm');
          }
        },
        type: 'category',
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          z: 100
        }
      },
      {
        type: 'category',
        gridIndex: 1,
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: 'dataMin',
        max: 'dataMax'
      }
    ],
    yAxis: [
      {
        position: 'right',
        scale: true,
        splitArea: {
          show: true
        }
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false }
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 98,
        end: 100
      },
      // {
      //   show: true,
      //   xAxisIndex: [0, 1],
      //   type: 'slider',
      //   top: '85%',
      //   start: 98,
      //   end: 100
      // }
    ],
    series: [
      {
        name: '蜡烛图',
        type: 'candlestick',
        data: data.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined
        },
        tooltip: {
          formatter: function (param: any) {
            param = param[0];
            return [
              'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
              'Open: ' + param.data[0] + '<br/>',
              'Close: ' + param.data[1] + '<br/>',
              'Lowest: ' + param.data[2] + '<br/>',
              'Highest: ' + param.data[3] + '<br/>'
            ].join('');
          }
        }
      },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5, data),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(10, data),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA20',
        type: 'line',
        data: calculateMA(20, data),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA30',
        type: 'line',
        data: calculateMA(30, data),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'Volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.volumes
      }
    ]
  })
  // 遮罩层
  // myChart.dispatchAction({
  //   type: 'brush',
  //   areas: [
  //     {
  //       brushType: 'lineX',
  //       coordRange: ['2016-06-02', '2016-06-20'],
  //       xAxisIndex: 0
  //     }
  //   ]
  // });
}

const update = () => {
  var data = splitData(JSON.parse(JSON.stringify(kLine.value)));
  myChart.setOption({
    xAxis: [
      {
        data: data.categoryData,
      },
      {
        data: data.categoryData,
      }
    ],
    series: [
      {
        // name: '蜡烛图',
        data: data.values,
      },
      {
        // name: 'MA5',
        data: calculateMA(5, data),
      },
      {
        // name: 'MA10',
        data: calculateMA(10, data),
      },
      {
        // name: 'MA20',
        data: calculateMA(20, data),
      },
      {
        // name: 'MA30',
        data: calculateMA(30, data),
      },
      {
        // name: 'Volume',
        data: data.volumes
      }
    ]
  })
}

const switchTime = (type: string) => {
  if (curTime.value === type) return
  curTime.value = type
  getKlineAPI()
}

function splitData(rawData: any) {
  let categoryData = [];
  let values = [];
  let volumes = [];
  for (let i = 0; i < rawData.length; i++) {
    const item = rawData[i]
    const time = dayjs(item.id * 1000).format('YYYY-MM-DD HH:mm:ss')
    categoryData.push(time);
    values.push([item.open, item.close, item.low, item.high, item.id]);
    volumes.push([i, item.close, item.open > item.close ? 1 : -1]);
  }
  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes
  };
}
function calculateMA(dayCount: any, data: any) {
  var result = [];
  for (var i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1];
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
}
</script>

<style lang="scss" scoped>
.switch-list {
  @include flex(flex-start);

  .switch-item {
    padding: 5px 10px;
    border: 1px solid #131722;
    border-radius: 5px;
    cursor: pointer;

    &.active {
      background: #26a69a;
      color: #ffffff;
    }

    &:not(:first-of-type) {
      margin-left: 5px;
    }
  }
}
</style>