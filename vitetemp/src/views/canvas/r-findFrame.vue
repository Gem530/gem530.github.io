<template>
    <div class="contanir theme">
        <g-find-frame :width="w" :height="h" @getPhotoBlob="getPhotoBlob">
            <button style="width: 100px;height: 30px;text-align: center; line-height: 30px;color: red;">拍-拍-照</button>
        </g-find-frame>
        {{ w }}/{{ h }}

        <img :src="url" alt="">
    </div>
</template>

<script lang="ts">
    export default { name: 'findFrame' }
</script>
<script setup lang="ts">
    import { onMounted } from 'vue'
    import gFindFrame from '@/components/g-findFrame/index.vue'

    const url = ref('')
    const w = ref(500)
    const h = ref(300)
    
    const reg = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    if (!reg) {
        w.value = 500
        h.value = 300
    } else {
        w.value = 300
        h.value = 500
    }

    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted')
    })

    const getPhotoBlob = (data: { blob: Blob, baseUrl: string }) => {
        // console.log('blob----', data)
        url.value = data.baseUrl
    }
</script>

<style lang="scss" scoped>

</style>