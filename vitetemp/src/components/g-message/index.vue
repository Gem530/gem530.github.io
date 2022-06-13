<template>
    <div class="component theme">
        <div class="g-message" :class="props.type">
            {{props.message}}
        </div>
    </div>
</template>

<script lang="ts">
    export default { name: 'g-message' }
</script>
<script setup lang="ts">
    import { ref, onMounted, defineProps } from 'vue'
    const props = withDefaults(defineProps<{
        message: string,
        type?: string
    }>(),{
        message: '',
        type: 'success'
    })

    const top = ref(50)
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
    //    console.log('onMounted')
        // const list = document.querySelectorAll('.g-message')
        // top.value = (list.length * 50) + (list.length * 10)
        // console.log(list.length, top.value)
    })
</script>

<style lang="scss">
    .g-message-box {
        position: fixed;
        left: 50%;
        transform: translate(-50%, -50%);
        @include flex();
        transition: all 0.2s linear;
        z-index: 999;
    }
    .g-message {
        border-radius: 5px;
        box-shadow: 0px 0px 5px rgba($color: #000000, $alpha: 0.2);
        @include wh(500px, 50px, min);
        @include textcenter(50px);

        &.success {
            color: #00ff00;
        }
        &.error {
            color: #ff0000;
        }
        &.info {
            color: #888888;
        }
        &.wranning {
            color: #ffff00;
        }
    }
</style>