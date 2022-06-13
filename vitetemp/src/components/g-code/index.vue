<template>
    <canvas
        ref="loginCheckout"
        :width="props.w"
        :height="props.h"
    >当前浏览器不支持canvas，请更换浏览器后再试</canvas>
</template>

<script lang="ts">
    export default { name: 'g-code' }
</script>
<script setup lang="ts">
    import { ref, watch, nextTick, onMounted, defineProps } from 'vue'
    const loginCheckout = ref()
    const props = withDefaults(defineProps<{
        w: number,
        h: number,
        num: string|number
    }>(), {
        w: 320,
        h: 150,
        num: '1000'
    })
    watch(() => props.num, (val, old) => {
        nextTick(() => {
            handleLoginCheckCode()
        })
    }, { deep: true, immediate: true })

    // 生成验证码
    const handleLoginCheckCode = () => {
        var canvas = loginCheckout.value
        var ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // 设置字体
        const fontsize = canvas.height / 2
        ctx.font = fontsize +'px bold 黑体'
        // 设置颜色
        ctx.fillStyle = '#fff'
        // 设置水平对齐方式
        ctx.textAlign = 'center'
        // 设置垂直对齐方式
        ctx.textBaseline = 'middle'
        // // 随机数 1000-9999
        // _self.randomNum = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
        // 绘制文字（参数：要写的字，x坐标，y坐标）
        ctx.fillText(props.num, canvas.width / 2, canvas.height / 2)
        // console.log(canvas);
    }
</script>

<style lang="scss" scoped>
    canvas {
        background: #000000;
    }
</style>