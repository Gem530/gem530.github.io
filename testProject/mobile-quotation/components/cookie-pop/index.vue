<template>
    <div class="cookie-pop flex flex-between" v-show="show">
        <div class="cookie-pop-content">{{$t('useCookiesToAnalyze')}}</div>
        <van-button type="primary" @click="closeCookie" size="large">{{$t('acceptClose')}}</van-button>
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
    left: 50%;
    width: 90%;
    height: 150px;
    background: #353535;
    padding: 0 20px;
    font-size: 20px;
    color: #fff;
    transform: translate(-50%, 0);
    border-radius: 10px;
    box-shadow: 0 0 10px #fff;
    z-index: 999;

    .van-button {
        font-size: 20px;
    }
}
</style>