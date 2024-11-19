<template>
    <div class="order-assistant main-width">
        <div class="order-assistant-title text-center">{{$t('orderAssistant')}}</div>
        <div class="glob-header-border">{{$t('assistantInfo.processSupportedOur')}}</div>
        <div class="order-assistan-banner flex">
            <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/order-assistant.png" alt="">
        </div>
        <div class="glob-header-border">{{$t('assistantInfo.placementProcess')}}</div>
        <div class="order-assistant-step">1.{{$t('assistantInfo.customerRegistrationLogin')}}</div>
        <div class="order-assistant-text">{{$t('assistantInfo.youNeedToPlace')}}</div>
        <el-image class="order-assistant-img" :src="importImage('order-assistant/step1.png')"></el-image>
        <div class="order-assistant-step">2.{{$t('assistantInfo.instantQuotation')}}</div>
        <div class="order-assistant-text">{{$t('assistantInfo.afterRegistering')}}</div>
        <div class="order-assistant-text">{{$t('assistantInfo.clickToUploadPCBfile')}}</div>
        <el-image class="order-assistant-img" :src="importImage('order-assistant/step2.png')"></el-image>
        <el-image class="order-assistant-img" :src="importImage('order-assistant/step3.png')"></el-image>
        <div class="order-assistant-step">3.{{$t('assistantInfo.howToMakePayment')}}</div>
        <div class="order-assistant-text">{{$t('assistantInfo.clickOnOrderManagement')}}</div>
        <div class="order-assistant-text"><span class="red">*</span>{{$t('assistantInfo.ifYouChooseOfflinePayment')}}</div>
        <el-image class="order-assistant-img" :src="importImage('order-assistant/step4.png')"></el-image>
        <el-image class="order-assistant-img" :src="importImage('order-assistant/step5.png')"></el-image>
        <div class="order-assistant-text">{{$t('assistantInfo.pleaseReviewTheSubmission')}}</div>
    </div>
</template>

<script setup lang="ts" name="OrderAssistant">
const { t } = useI18n()
useHead({ title: () => t('orderAssistant') })
</script>

<style lang="scss" scoped>
.order-assistant {
    padding: 60px 0;
    .order-assistant-title {
        margin-bottom: 40px;
        font-size: 36px;
        font-weight: 600;
    }
    .order-assistan-banner {
        margin-bottom: 20px;
        img {
            width: 1000px;
        }
    }
    .order-assistant-step {
        width: 772px;
        margin: 0 0 10px;
        font-weight: 600;
    }

    .order-assistant-img {
        max-width: 1000px;
        margin: 10px 0;
    }

    .red {
        color: #f56c6c;
    }
}
</style>