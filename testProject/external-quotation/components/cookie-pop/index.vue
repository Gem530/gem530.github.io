<template>
    <div class="cookie-pop" v-show="show">
        <div class="cookie-pop-content">{{$t('useCookiesToAnalyze')}}</div>
        <el-button class="fr" type="primary" @click="closeCookie" size="large">{{$t('acceptClose')}}</el-button>
    </div>
</template>

<script setup lang="ts" name="CookiePop">
const show = ref(false)
const closeCookie = () => {
    localStorage.setItem('cookiePolicy', '1')
    show.value = false
}

onMounted(() => {
    const cookiePolicy = localStorage.getItem('cookiePolicy')
    if (cookiePolicy && cookiePolicy == '1') {
        show.value = false
    } else {
        show.value = true
    }
})
</script>

<style lang="scss" scoped>
.cookie-pop {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 410px;
    height: 240px;
    background: #fff;
    padding: 35px;
    font-size: 20px;
    // transform: translate(-50%, 0);
    border-radius: 10px;
    box-shadow: 0 5px 30px 0 rgba(78,122,194,.2);
    // box-sizing: content-box;
    z-index: 999;

    .cookie-pop-content {
        margin-bottom: 20px;
        word-break: normal;
    }

    .fr {
        height: 36px;
        font-size: 18px;
    }
}
</style>