<template>
  <div class="switch-list">
    <div
      :key="item"
      :class="{ 'switch-item':true, 'active':item===switchItem}"
      v-for="item in switchList"
      @click="switchTime(item)"
    >{{item}}</div>
  </div>
  <div ref="GLightChartsRef" class="light-charts-ref"></div>
</template>

<script lang="ts" setup name="light-charts">
// https://aitrade.ga/books/lightweight-charts-docs-cn/book/home.html k线图学习链接
import { createChart } from "lightweight-charts"
import {
  ref,
  onMounted
} from 'vue'


let timer: any
let chart: any
let series: any
let lineSeries: any
let count: number = 1
let histogramSeries: any
const upcolor = '#26a69a'
const downcolor = '#FF6347'
const switchItem: any = ref('1D')
const switchList = ref(['1D', '1Y'])
const GLightChartsRef = ref()
const lineData = ref([
  { time: "2018-12-19 12:20:06", open: 141.77, high: 170.39, low: 120.25, close: 145.72 },
  { time: "2018-12-20 12:20:06", open: 145.72, high: 147.99, low: 100.11, close: 108.19 },
  { time: "2018-12-21 12:20:06", open: 108.19, high: 118.43, low: 74.22, close: 75.16 },
  { time: "2018-12-22 12:20:06", open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
  { time: "2018-12-23 12:20:06", open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
  { time: "2018-12-24 12:20:06", open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
  { time: "2018-12-25 12:20:06", open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
  { time: "2018-12-26 12:20:06", open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
  { time: "2018-12-27 12:20:06", open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
  { time: "2018-12-28 12:20:06", open: 111.51, high: 142.83, low: 103.34, close: 131.25 },
  { time: "2018-12-29 12:20:06", open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
  { time: "2018-12-30 12:20:06", open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
  { time: "2018-12-31 12:20:06", open: 109.87, high: 114.69, low: 85.66, close: 111.26 }
])
const lineList: any = ref([])
const histogramData: any = ref([])
const lineDataY = ref([
  { time: "2017-01-01 12:20:06", open: 181.77, high: 190.39, low: 120.25, close: 155.72 },
  { time: "2018-01-01 12:20:06", open: 141.77, high: 170.39, low: 120.25, close: 145.72 },
])
const seriesItem: any = new Map([
  ['1D', lineData.value],
  ['1Y', lineDataY.value],
])
const currentPrice: any = ref({
  open: 100,
  high: 200,
  low: 130,
  close: 140,
  time: {
    year: '2019',
    month: '01',
    day: '01'
  }
})

onMounted(() => {
  chart = createChart(GLightChartsRef.value, {
    width: 400,
    height: 300,
    layout: {
      backgroundColor: '#000000',
      textColor: 'rgba(255, 255, 255, 0.9)',
    },
    timeScale: { // 时间刻度
      tickMarkFormatter: (time: any) => {
        const date = new Date(time.year, time.month - 1, time.day);
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      },
    },
    localization: { // 十字线时间刻度
      dateFormat: "yyyy/MM/dd"
    },
    grid: {
      horzLines: {
        visible: false
      },
      vertLines: {
        visible: false,
      }
    },
  })
  // k线图
  series = chart.addCandlestickSeries({
    // upColor: "#6495ED",
    // downColor: "#FF6347"
  })
  lineSeries = chart.addLineSeries({
    lineWidth: 1,
    crosshairMarkerRadius: 2
  })
  histogramSeries = chart.addHistogramSeries({
		// scaleMargins: {
		// 	bottom: 0,
		// },
    base: 0
  })
  init()
})
function businessDayToString(businessDay: any) {
	return businessDay.year + '-' + businessDay.month + '-' + businessDay.day
}

const switchTime = (type: string) => {
  if (switchItem.value === type) return
  switchItem.value = type
  initData()
  init()
  cricule()
}

const initData = () => {
  histogramData.value = seriesItem.get(switchItem.value).map((v: any) => { return {
    time: v.time,
    value: v.close * 0.1,
    color: v.open > v.close ? downcolor : upcolor
  } })
  lineList.value = seriesItem.get(switchItem.value).map((v: any) => { return {
    time: v.time,
    value: v.close * 0.5
  } })
}
initData()

const init = () => {
  const data = seriesItem.get(switchItem.value)
  series.setData(data)

  // 柱状图
  histogramSeries.setData(histogramData.value)

  // 折线图
  lineSeries.setData(lineList.value)

  // tooltip
  const toolTipWidth = 160
  const toolTipHeight = 160
  let toolTip = document.createElement('div')
  toolTip.className = 'floating-tooltip-2'
  const container = GLightChartsRef.value
  container.appendChild(toolTip)
  // update tooltip
  chart.subscribeCrosshairMove(function(param: any) {
    if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > container.clientWidth || param.point.y < 0 || param.point.y > container.clientHeight) {
      toolTip.style.display = 'none'
    } else {
      const dateStr = businessDayToString(param.time)
      toolTip.style.display = 'block'
      let seriesData: any = param.seriesPrices.get(series)
      toolTip.innerHTML = `
        <div style="color: #009688">Apple Inc.</div>
        <div style="font-size: 16px;margin: 4px 0px;color: #21384d;">close:${seriesData.close}</div>
        <div style="font-size: 16px;margin: 4px 0px;color: #21384d;">high:${seriesData.high}</div>
        <div style="font-size: 16px;margin: 4px 0px;color: #21384d;">low:${seriesData.low}</div>
        <div style="font-size: 16px;margin: 4px 0px;color: #21384d;">open:${seriesData.open}</div>
        <div style="color: #21384d">${dateStr}</div>
      `
      let shiftedCoordinate = param.point.x - toolTipWidth
      shiftedCoordinate = param.point.x < toolTipWidth ? param.point.x + 10 : shiftedCoordinate
      // let coordinateY = param.point.y - (toolTipHeight/2)
      let coordinateY = param.point.y + 10
      toolTip.style.left = shiftedCoordinate + 'px'
      toolTip.style.top = coordinateY + 'px'
    }
  })
}

const nextPrice = () => {
  currentPrice.value.time = nextDate(currentPrice.value.time)
  currentPrice.value.open = betweenNum(100, 180)
  currentPrice.value.high = betweenNum(currentPrice.value.open, 220)
  currentPrice.value.low = betweenNum(60, currentPrice.value.open)
  currentPrice.value.close = betweenNum(currentPrice.value.low, currentPrice.value.high)
  const v = currentPrice.value
  series.update(currentPrice.value)
  const num1 = {
    time: v.time,
    value: v.close * 0.1,
    color: v.open > v.close ? downcolor : upcolor
  }
  const num2 = {
    time: v.time,
    value: v.close * 0.5
  }
  histogramSeries.update(num1)
  lineSeries.update(num2)
}

const betweenNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min
}

const nextDate = (time: any) => {
	var d = new Date();
	d.setUTCFullYear(time.year);
	d.setUTCMonth(time.month - 1);
	d.setUTCDate(time.day + 1);
	d.setUTCHours(0, 0, 0, 0);
	return {
		year: d.getUTCFullYear(),
		month: d.getUTCMonth() + 1,
		day: d.getUTCDate(),
	};
}

const cricule = () => {
  if (timer) {
    count = 1
    clearInterval(timer)
    criculeHandle()
    return
  }
  criculeHandle()
}

const criculeHandle = () => {
  timer = setInterval(() => {
    if (count > 10) {
      clearInterval(timer)
      return
    }
    count++
    nextPrice()
  }, 1000)
}
cricule()
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
<style lang="scss">
.light-charts-ref {
  position: relative;
}
.floating-tooltip-2 {
	width: 150px;
	min-height: 160px;
	position: absolute;
	display: none;
	padding: 8px;
	box-sizing: border-box;
	font-size: 12px;
	color: #131722;
	background-color: rgba(255, 255, 255, 1);
	text-align: left;
	z-index: 1000;
	top: 12px;
	left: 12px;
	pointer-events: none;
	border: 1px solid rgba(0, 150, 136, 1);
	border-radius: 2px;
  word-break: break-all;
}
</style>