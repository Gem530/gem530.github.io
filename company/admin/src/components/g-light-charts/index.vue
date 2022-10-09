<template>
  <div ref="GLightChartsRef" class="light-charts-ref"></div>
</template>

<script lang="ts" setup name="light-charts">
// https://aitrade.ga/books/lightweight-charts-docs-cn/book/home.html k线图学习链接
import { createChart } from "lightweight-charts"
import {
  ref,
  onMounted
} from 'vue'

const GLightChartsRef = ref()

onMounted(() => {
  const chart = createChart(GLightChartsRef.value, { width: 400, height: 300 })
  const lineSeries = chart.addCandlestickSeries({
    // upColor: "#6495ED",
    // downColor: "#FF6347"
  })
  const lineData = [
    { time: "2018-12-19", open: 141.77, high: 170.39, low: 120.25, close: 145.72 },
    { time: "2018-12-20", open: 145.72, high: 147.99, low: 100.11, close: 108.19 },
    { time: "2018-12-21", open: 108.19, high: 118.43, low: 74.22, close: 75.16 },
    { time: "2018-12-22", open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: "2018-12-23", open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: "2018-12-24", open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: "2018-12-25", open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: "2018-12-26", open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: "2018-12-27", open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    { time: "2018-12-28", open: 111.51, high: 142.83, low: 103.34, close: 131.25 },
    { time: "2018-12-29", open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
    { time: "2018-12-30", open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    { time: "2018-12-31", open: 109.87, high: 114.69, low: 85.66, close: 111.26 }
  ]
  lineSeries.setData(lineData)

  const histogramSeries = chart.addHistogramSeries({
		// scaleMargins: {
		// 	bottom: 0,
		// },
    base: 0
  })
  const upcolor = '#26a69a'
  const downcolor = '#FF6347'
  const histogramData: any[] = []
  lineData.forEach((item: any) => {
    histogramData.push({
      time: item.time,
      value: item.close * 0.1,
      color: item.open > item.close ? downcolor : upcolor
    })
  })
  // 设置数据
  histogramSeries.setData(histogramData)

  const toolTipWidth = 160
  const toolTipHeight = 160

  let toolTip = document.createElement('div')
  toolTip.className = 'floating-tooltip-2'
  const container = GLightChartsRef.value
  container.appendChild(toolTip)
  // update tooltip
  chart.subscribeCrosshairMove(function(param) {
    if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > container.clientWidth || param.point.y < 0 || param.point.y > container.clientHeight) {
      toolTip.style.display = 'none'
    } else {
      const dateStr = businessDayToString(param.time)
      toolTip.style.display = 'block'
      let seriesData: any = param.seriesPrices.get(lineSeries)
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
      let coordinateY = param.point.y - (toolTipHeight/2)
      toolTip.style.left = shiftedCoordinate + 'px'
      toolTip.style.top = coordinateY + 'px'
    }
  })
})
function businessDayToString(businessDay: any) {
	return businessDay.year + '-' + businessDay.month + '-' + businessDay.day
}
</script>

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