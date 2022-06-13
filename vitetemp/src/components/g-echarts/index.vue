<template>
    <div class="component theme" ref="echartsDom" :style="`width: ${props.width};height: ${props.height};`"></div>
</template>

<script lang="ts">
    export default { name: 'drawBoard' }
</script>
<script setup lang="ts">
    import * as echarts from 'echarts'
    import { ref, nextTick, onMounted, defineProps } from 'vue'
    
    const echartsDom = ref()
    const props = withDefaults(defineProps<{
        width: string,
        height: string,
        options: any
    }>(), {
        width: '400px',
        height: '500px',
        options: ''
    })

    watch(() => props.options, (val, old) => {
        nextTick(() => {
            const myEcharts = echarts.init(echartsDom.value)
            myEcharts.setOption(val)
        })
    }, { deep: true, immediate: true })
</script>

<style lang="scss" scoped>

</style>