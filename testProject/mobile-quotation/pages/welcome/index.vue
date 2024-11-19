<template>
    <!-- <div class="flex all">
        <div class="welcome flex flex-column text-center">
            <div class="welcome-name">江西诺思特PCB</div>
            <div>我们专注PCB行业20年，主营PCB、PCBA、快板、样板、小批量，自营工厂，一流的设备和制程，100%全测，7*24小时可报价，快速交付，保证品质交期，时效达（顺丰、跨越、京东），公众号提供1对1专人服务，订单实时进度查询！</div>
            <div>您可以微信扫描下方二维码，关注公众号，将有专人与您对接。</div>
            <img class="welcome-qrcode" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/company-qrcode.png" alt="">
        </div>
    </div> -->
    <div :class="`welcome flex`">
        <div class="welcome-item two"></div>
    </div>
</template>

<script setup lang="ts" name="Welcome">
definePageMeta({ layout: 'empty' })
</script>

<style lang="scss" scoped>
.welcome {
    width: 100%;
    height: 100vh;
    padding: 10px;
    background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/zh-user/mobile-main.png') no-repeat, #000;
    background-size: contain;
    background-position: center center;

    .welcome-item {
        flex: none;
        height: 100%;
    }
    // .two {
    //     position: relative;
    //     // position: absolute;
    //     // top: 50%;
    //     // left: 50%;
    //     // transform: translate(-50%, -50%);
    //     width: 100%;
    //     background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/zh-user/mobile-main.png') no-repeat center center;
    //     background-size: contain;
    //     height: 100%;
    // }
}
</style>