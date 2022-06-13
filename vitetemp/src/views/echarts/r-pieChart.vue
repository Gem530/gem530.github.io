<template>
    <div class="contanir theme">
        <button @click="pie1Handle">普通饼状图</button>
        <button @click="pie2Handle">环形饼状图</button>
        <button @click="pie3Handle">南丁格尔饼状图</button>
        <g-echarts :options="state.options" width="500px" height="500px" v-if="state.flag"></g-echarts>
    </div>
</template>

<script lang="ts">
    export default { name: 'drawBoard' }
</script>
<script setup lang="ts">
    import { reactive, onMounted } from 'vue'
    import gEcharts from '@/components/g-echarts/index.vue'
    const state = reactive({
        flag: true,
        options: ''
    })
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
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
            }
        },
        series: [
            {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [50, 250],
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
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted')
    })

    const pie1Handle = () => {
        state.flag = false
        setTimeout(() => {
            state.flag = true
            state.options = pie1
        }, 10)
    }

    const pie2Handle = () => {
        state.flag = false
        setTimeout(() => {
            state.flag = true
            state.options = pie2
        }, 10)
    }

    const pie3Handle = () => {
        state.flag = false
        setTimeout(() => {
            state.flag = true
            state.options = pie3
        }, 10)
    }
    pie1Handle()
</script>

<style lang="scss" scoped>

</style>