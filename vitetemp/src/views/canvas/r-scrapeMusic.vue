<template>
    <div class="contanir theme">
        <g-scrape-music
            url="https://d1.faiusr.com/4/AAEIABAEGAAgtZ-56QUoufyr5gQw9gE4kwM.png"
            width="300px"
            height="400px"
            :maxArea="20"
            @getResult="getResult"
        ></g-scrape-music>
    </div>
</template>

<script lang="ts">
    export default { name: 'scrapeMusic' }
</script>
<script setup lang="ts">
    import { onMounted } from 'vue'
    import gScrapeMusic from '@/components/g-scrapeMusic/index.vue'
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted')
    })

    const getResult = (data: { currentArea: number, isSuccess: boolean }) => {
        console.log('getResult', data)
    }
</script>

<style lang="scss" scoped>

</style>