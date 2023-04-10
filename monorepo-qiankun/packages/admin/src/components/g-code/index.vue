<template>
    <canvas
        ref="loginCheckout"
        :width="props.w"
        :height="props.h"
    >当前浏览器不支持canvas，请更换浏览器后再试</canvas>
</template>

<script setup lang="ts" name='g-code'>
import { ref, watch, nextTick, defineProps } from 'vue'
import { returnColor, twoNumberBetween } from '@/utils'
const loginCheckout = ref()
const props = withDefaults(defineProps<{
    w?: number,
    h?: number,
    num?: string|number
}>(), {
    w: 320,
    h: 150,
    num: '1000'
})

let canvas: any = undefined
let ctx: any = undefined
watch(() => props.num, (val, old) => {
    nextTick(() => {
        canvas = loginCheckout.value
        ctx = canvas.getContext('2d')
        handleLoginCheckCode()
    })
}, { deep: true, immediate: true })

// 绘制文字
const drawText = (text: string, x: number, color: string) => {
    return new Promise((resolve, reject) => {
        try {
            // 绘制文字
            ctx.beginPath()
            ctx.restore() // 恢复之前保存的绘图状态。
            ctx.save() // 保存当前的绘图状态。
            const helfHeight = canvas.height / 2
            ctx.font = helfHeight +'px bold 黑体'

            ctx.translate(x, helfHeight) // 改变中心点
            ctx.rotate(twoNumberBetween(-180,180) * Math.PI / 180)
            ctx.translate(-x, -helfHeight)

            ctx.fillStyle = color
            // 设置水平对齐方式
            ctx.textAlign = 'center'
            // 设置垂直对齐方式
            ctx.textBaseline = 'middle'
            ctx.fillText(text, x, canvas.height / 2)
            resolve(true)
        } catch(err) {
            reject(err)
        }
    })
  }

// 生成验证码
const handleLoginCheckCode = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const arr = props.num.toString().split('')
    const oneW = canvas.width / arr.length
    arr.forEach((v, i) => {
        drawText(v, (oneW * i) + (oneW / 2), returnColor(50, 255))
    })
}
</script>

<style lang="scss" scoped>
    canvas {
        background: #000000;
    }
</style>