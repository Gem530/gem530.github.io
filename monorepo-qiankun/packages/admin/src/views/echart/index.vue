<template>
  <div>
    <h2>echarts</h2>
    <el-input type="textarea" v-model="pie4Value" placeholder='请输入json格式，如：{"xAxis":{"type":"category"}}'></el-input>
    <p>在线js对象转json：<a href="https://uutool.cn/obj2json/" target="_blank">https://uutool.cn/obj2json/</a></p>
    <el-button @click="changeEchart(1)">pie1</el-button>
    <el-button @click="changeEchart(2)">pie2</el-button>
    <el-button @click="changeEchart(3)">pie3</el-button>
    <el-button @click="changeEchart(4)">json图表</el-button>
    <g-echart :options="pie1" width="500px" height="500px" v-if="type === 1"></g-echart>
    <g-echart :options="pie2" width="500px" height="500px" v-if="type === 2"></g-echart>
    <g-echart :options="pie3" width="500px" height="500px" v-if="type === 3"></g-echart>
    <g-echart :options="pie4" width="500px" height="500px" v-if="type === 4 && pie4"></g-echart>
  </div>
</template>

<script lang="ts" setup name="echart">
import { ref, getCurrentInstance, ComponentInternalInstance } from 'vue'
const { proxy } = getCurrentInstance() as ComponentInternalInstance as any
const pie1 = {
    title: {
        text: 'Referer of a Website',
        subtext: 'Fake Data',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
                itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
}
const pie2 = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
        },
        label: {
            show: false,
            position: 'center'
        },
        emphasis: {
            label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold'
            }
        },
        labelLine: {
            show: false
        },
        data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
        ]
        }
    ]
}
const pie3 = {
    legend: {
        top: 'bottom'
    },
    toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: false, readOnly: false }, // 显示数据图标
          restore: { show: false }, // 显示刷新echarts图标
          saveAsImage: { show: false } // 显示下载echarts图片图标
        }
    },
    series: [
        {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [20, 140],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
            borderRadius: 8
        },
        data: [
            { value: 40, name: 'rose 1' },
            { value: 38, name: 'rose 2' },
            { value: 32, name: 'rose 3' },
            { value: 30, name: 'rose 4' },
            { value: 28, name: 'rose 5' },
            { value: 26, name: 'rose 6' },
            { value: 22, name: 'rose 7' },
            { value: 18, name: 'rose 8' }
        ]
        }
    ]
}
const pie4 = ref()

const type = ref(1)
const pie4Value: any = ref("")
const changeEchart = (num: number) => {
  if (num === 4) {
    if (!pie4Value.value) {
      proxy.$modal.message({ type: 'error', message: 'json数据不能为空' })
      return
    }
    try {
      pie4Value.value = pie4Value.value.replace(/'/g, '"')
      pie4.value = JSON.parse(pie4Value.value)
    } catch (err: any) {
      // console.log(err.message)
      proxy.$modal.message({ type: 'error', message: err.message })
    }
  }
  type.value = num
}
changeEchart(1)
</script>