<template>
  <div ref="echartsDom" :style="`width: ${props.width};height: ${props.height};`"></div>
</template>

<script lang="ts" setup name="g-echart">
import echarts from './requestEachrts'
// import * as echarts from 'echarts'
// 在app.vue中导入echarts 当前组件接受，可以加快echarts加载速度，但会影响首页加载速度
// provide("echarts", echarts)
import {
  ref,
  inject,
  onMounted,
  defineProps,
  withDefaults
} from 'vue'

const echartsDom = ref()
// const echarts: any = inject("echarts")
const props = withDefaults(defineProps<{
    width?: string,
    height?: string,
    options: any
}>(), {
    width: '400px',
    height: '500px',
    options: ''
})

onMounted(() => {
  const options = props.options
  if (!options) return
  const myEcharts = echarts.init(echartsDom.value)
  myEcharts.setOption(options)
})
</script>