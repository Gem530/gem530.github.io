<template>
    <div class="custom-layout">
        <div class="custom-layout-header">
            <el-menu
                mode="horizontal"
                :ellipsis="false"
                active-text-color="#303133"
                class="custom-layout-menu"
            >
                <el-menu-item index="0" @click="navigateTo('/')">
                    <div class="logo-box flex flex-start">
                        <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/u1.png" alt="" class="logo-img">
                        <div class="logo-text flex flex-column" style="margin-left: 10px;">
                            <div class="header-logo-text">PCB<span style="color: rgb(234, 102, 102);">SUPER</span>.COM</div>
                            <van-notice-bar class="logo-notice" color="#666" background="transparent" scrollable :text="$t('home.yourPCB')" />
                        </div>
                    </div>
                </el-menu-item>
                <div class="flex-grow"></div>
                <el-menu-item index="1" @click="navigateTo('/online-count')">{{$t('onlinePricing')}}</el-menu-item>
                <el-menu-item index="2">
                    <el-popover width="200px">
                        <template #reference>{{$t('contactUs')}}</template>
                        <div class="contact-us">
                            <div class="contact-us-item">
                                <div class="contact-us-item-label">{{$t('companyEmail')}}:</div>
                                <div class="contact-us-item-value">market@pcbsuper.com</div>
                            </div>
                            <!-- <div class="contact-us-item">
                                <div class="contact-us-item-label">服务投诉：</div>
                                <div class="contact-us-item-value">19966667777</div>
                            </div> -->
                        </div>
                    </el-popover>
                </el-menu-item>
                <el-menu-item class="icon-menu" index="3" @click="navigateTo('/order/1')">
                    <el-badge class="mark" :value="useOrderNumber().value ? useOrderNumber().value['1'] : 0"><el-icon><ShoppingCart /></el-icon>{{$t('shoppingCart')}}</el-badge>
                </el-menu-item>
                <el-menu-item class="icon-menu" index="4">
                    <el-popover
                        :width="220"
                        placement="bottom"
                        popper-class="user-default-popper">
                        <template #reference>
                            <template v-if="userInfo().value?.userName">{{ userInfo().value?.userName }}</template>
                            <el-icon v-else><User /></el-icon>
                        </template>
                        <div class="user-default-box">
                            <div class="flex flex-start user-default-item pointer hover-black-bold" @click="navigateTo('/user')">
                                <el-icon><User /></el-icon>
                                <span>{{$t('basicUserInformation')}}</span>
                            </div>
                            <div class="flex flex-start user-default-item pointer hover-black-bold" @click="logHandle">
                                <el-icon><SwitchButton /></el-icon>
                                <span>{{ userInfo().value?.userName ? $t('login.signOut') : $t('login.signIn') }}</span>
                            </div>
                        </div>
                    </el-popover>
                </el-menu-item>
                <!-- <el-menu-item index="5" v-if="useRuntimeConfig().public.VITE_PACK_ENV != 'prod'">
                    <ChangeLang></ChangeLang>
                </el-menu-item> -->
            </el-menu>
        </div>

        <div class="custom-layout-content">
            <el-menu
                class="silder-menu"
                :default-active="activeIndex"
                :default-openeds="['1','2','3','4']"
            >
                <el-sub-menu index="1">
                    <template #title>{{$t('pcbProductProduction')}}</template>
                    <!-- <el-menu-item index="1-1">{{$t('impedanceStackingDesign')}}</el-menu-item> -->
                    <el-menu-item index="/online-count" @click="navigateTo('/online-count')">{{$t('onlinePricing')}}</el-menu-item>
                    <!-- <el-menu-item index="1-3">{{$t('highFrequencyBoard')}}</el-menu-item> -->
                </el-sub-menu>
                <el-sub-menu index="2">
                    <template #title>{{$t('orderManagement')}}</template>
                    <el-menu-item index="/order/0" @click="navigateTo('/order/0')">{{$t('allOrders')}}</el-menu-item>
                    <el-menu-item index="/order/1" @click="navigateTo('/order/1')">{{$t('myShoppingCart')}}</el-menu-item>
                    <el-menu-item index="/order/2" @click="navigateTo('/order/2')">{{$t('orderProgressTracking')}}</el-menu-item>
                    <el-menu-item index="/order/4" @click="navigateTo('/order/4')">{{$t('orderLogistics')}}</el-menu-item>
                    <!-- <el-menu-item index="/order/5" @click="navigateTo('/order/5')">{{$t('afterSaleService')}}</el-menu-item> -->
                </el-sub-menu>
                <el-sub-menu index="3">
                    <template #title>{{$t('personalInformationCenter')}}</template>
                    <el-menu-item index="/user" @click="navigateTo('/user')">{{$t('basicUserInformation')}}</el-menu-item>
                    <!-- <el-menu-item index="3-2">{{$t('paymentAccountManagement')}}</el-menu-item> -->
                    <!-- <el-menu-item index="/notify" @click="navigateTo('/notify')">{{$t('messagePush')}}</el-menu-item> -->
                    <el-menu-item index="/address-manage" @click="navigateTo('/address-manage')">{{$t('receivingAddress')}}</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="4">
                    <template #title>{{$t('serviceGuidelines')}}</template>
                    <!-- <el-menu-item index="4-1">{{$t('customerServiceConsultation')}}</el-menu-item> -->
                    <!-- <el-menu-item index="4-2" @click="navigateTo('/service-guidelines')">{{$t('serviceGuidelines')}}</el-menu-item> -->
                    <el-menu-item index="4-2" @click="navigateTo('/help-document')">{{$t('helpDocument')}}</el-menu-item>
                    <el-menu-item index="4-3" @click="navigateTo('/order-assistant')">{{$t('orderAssistant')}}</el-menu-item>
                    <el-menu-item index="4-4" @click="navigateTo('/transportation-method')">{{$t('transportationMethod')}}</el-menu-item>
                    <el-menu-item index="4-5" @click="navigateTo('/direct-ceo')">{{$t('directPage.title')}}</el-menu-item>
                    <!-- <el-menu-item index="4-5" @click="navigateTo('/return-change-policy')">{{$t('returnAndExchangePolicy')}}</el-menu-item> -->
                </el-sub-menu>
            </el-menu>
            <div class="custom-body">
                <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
                <slot></slot>
            </div>
        </div>
        <!-- <div class="custom-layout-footer main-width">客户尾部</div> -->
    </div>
</template>

<script setup lang="ts" name="CustomtLayout">
const route = useRoute()
const activeIndex = ref('0')

watch(() => route.path, (val, oldV) => {
    if (val) {
        // if (route.path.includes('order')) {
        //     activeIndex.value = '2-' + ((Number(route?.params?.type) || 0) + 1)
        // }
        // if (route.path.includes('user')) { activeIndex.value = '3-1' }
        // if (route.path.includes('notify')) { activeIndex.value = '3-3' }
        // if (route.path.includes('address-manage')) { activeIndex.value = '3-4' }
        activeIndex.value = route.path
    }
}, { deep: true, immediate: true })
</script>

<style lang="scss" scoped>
.custom-layout {
    height: 100%;
    overflow: hidden;
    .custom-layout-header {
        background: #fff;
        .custom-layout-menu {
            // &.el-menu--horizontal.el-menu,
            &.el-menu--horizontal>.el-menu-item,
            &.el-menu--horizontal>.el-menu-item.is-active {
                border-bottom: none;
            }
            :deep(.el-menu-item) {
                padding: 0 15px;
                &:hover,
                &:focus {
                    background: transparent;
                    font-weight: 600;
                    color: #000 !important;
                }

                &.is-active {
                    font-weight: 600;
                    color: #000 !important;
                }
            }
            :deep(.el-sub-menu__title) {
                border-bottom: none !important;
            }

            .address-choose {
                width: 130px;
                margin-left: 5px;

                :deep(.el-input__suffix-inner) {
                    width: 25px;
                }
            }

            
            .logo-box {
                height: 100%;
                line-height: 16px;
                .logo-img {
                    // width: 128px;
                    height: 100%;
                }

                .logo-text {
                    align-items: flex-start;

                    .header-logo-text {
                        margin-left: 6px;
                        font-size: 16px;
                        font-weight: 600;
                        color: var(--el-color-primary);
                    }
                    .logo-notice {
                        width: 200px;
                        height: 20px;
                        padding: 0;
                    }
                }
            }

            .icon-menu {
                // padding: 0 10px;
                line-height: normal;
                .mark {
                    height: 20px;
                }
                .el-icon {
                    margin-right: 0;
                }
            }
        }
        .logo-img {
            // width: 128px;
            height: 100%;
        }
        .flex-grow {
            flex-grow: 1;
        }
    }

    .custom-layout-content {
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        width: 100%;
        height: calc(100% - 60px);
        // min-height: calc(100vh - 60px);
        // overflow: hidden;

        :deep(.silder-menu) {
            width: 220px;
            height: 100%;
            overflow-y: auto;

            .el-sub-menu .el-sub-menu__title,
            .el-menu-item {
                height: 35px !important;
                font-size: 12px !important;
                line-height: 35px !important;

                &.is-active {
                    font-weight: 600;
                    color: #000 !important;
                }
            }
        }

        .custom-body {
            flex: 1;
            height: 100%;
            padding: 10px;
            overflow-y: auto;
        }
    }
}

.contact-us {
    .contact-us-item {
        padding: 10px 0;
        &:not(:last-child) {
            border-bottom: 1px solid #f5f5f5;
        }

        .contact-us-item-label {
            margin-bottom: 5px;
        }
    }
}
</style>