<template>
    <div class="component theme">
        <div class="user">
            <img class="user-avator" :src="store.getters.user.avator || avatorImg" alt="">
            <div class="user-name">{{store.getters.user.name || '未登录'}}</div>
        </div>
    </div>
</template>

<script lang="ts">
    export default { name: 'g-main' }
</script>
<script setup lang="ts">
    import { onMounted } from 'vue'
    import { useStore } from 'vuex'
    import avatorImg from '@/assets/img/avator.jpg'

    const store = useStore()

    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        //    console.log('onMounted')
    })
</script>

<style lang="scss" scoped>
.component {
    height: 100%;
    padding-top: 10px;
    
    .user {
        padding: 10px;
        margin: 0 auto;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.3);
        box-sizing: border-box;
        @include wh(90%, 80px);
        @include flex(flex-start, center);

        .user-avator {
            margin-right: 10px;
            @include wh(50px, 50px);
        }
    }
}
</style>