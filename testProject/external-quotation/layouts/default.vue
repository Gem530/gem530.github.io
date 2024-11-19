<template>
    <div class="default-layout">
        <div class="default-layout-header">
            <el-menu
                mode="horizontal"
                :ellipsis="false"
                menu-trigger="click"
                unique-opened
                :default-active="activeIndex"
                :close-on-click-outside="true"
                class="default-layout-menu main-width"
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
                <el-menu-item index="/online-count" @click="navigateTo('/online-count')" v-if="isEdit">{{$t('onlinePricing')}}</el-menu-item>
                <!-- <el-sub-menu index="1" popper-class="pop-menu">
                    <template #title>{{$t('onlinePricing')}}</template>
                    <el-menu-item index="1-1">{{$t('impedanceStackingDesign')}}</el-menu-item>
                    <el-menu-item index="1-2" @click="navigateTo('/online-count')">{{$t('fr4Board')}}</el-menu-item>
                    <el-menu-item index="1-3">{{$t('highFrequencyBoard')}}</el-menu-item>
                </el-sub-menu> -->
                <el-sub-menu index="1" popper-class="pop-menu">
                    <template #title>{{$t('capabilities')}}</template>
                    <el-menu-item index="/producible-products" @click="navigateTo('/producible-products')">{{$t('producibleProducts')}}</el-menu-item>
                    <el-menu-item index="/process-capability" @click="navigateTo('/process-capability')">{{$t('processCapability')}}</el-menu-item>
                    <el-menu-item index="/product-display" @click="navigateTo('/product-display')">{{$t('productDisplay')}}</el-menu-item>
                </el-sub-menu>
                <!-- <el-sub-menu index="4" popper-class="pop-menu">
                    <template #title>{{$t('productDisplay')}}</template>
                    <el-menu-item index="4-1">{{$t('impedanceStackingDesign')}}</el-menu-item>
                    <el-menu-item index="4-2" @click="navigateTo('/online-count')">{{$t('fr4Board')}}</el-menu-item>
                    <el-menu-item index="4-3">{{$t('highFrequencyBoard')}}</el-menu-item>
                </el-sub-menu> -->
                <!-- <el-menu-item index="5" @click="navigateTo('/service-guidelines')">{{$t('serviceGuidelines')}}</el-menu-item> -->
                <el-sub-menu index="5" popper-class="pop-menu">
                    <template #title>{{$t('serviceGuidelines')}}</template>
                    <!-- <el-menu-item index="/service-guidelines" @click="navigateTo('/service-guidelines')">{{$t('serviceGuidelines')}}</el-menu-item> -->
                    <el-menu-item index="/help-document" @click="navigateTo('/help-document')">{{$t('helpDocument')}}</el-menu-item>
                    <el-menu-item index="/order-assistant" @click="navigateTo('/order-assistant')">{{$t('orderAssistant')}}</el-menu-item>
                    <el-menu-item index="/transportation-method" @click="navigateTo('/transportation-method')">{{$t('transportationMethod')}}</el-menu-item>
                    <el-menu-item index="/direct-ceo" @click="navigateTo('/direct-ceo')">{{$t('directPage.title')}}</el-menu-item>
                    <!-- <el-menu-item index="/return-change-policy" @click="navigateTo('/return-change-policy')">{{$t('returnAndExchangePolicy')}}</el-menu-item> -->
                </el-sub-menu>
                <el-sub-menu index="6" popper-class="pop-menu">
                    <template #title>{{$t('aboutUs')}}</template>
                    <el-menu-item index="/company-introduct" @click="navigateTo('/company-introduct')">{{$t('companyIntroduction')}}</el-menu-item>
                    <!-- <el-menu-item index="/enterprise-dynamics" @click="navigateTo('/enterprise-dynamics')">{{$t('enterpriseDynamics')}}</el-menu-item> -->
                    <!-- <el-menu-item index="/notification-announcement" @click="navigateTo('/notification-announcement')">{{$t('notificationAnnouncement')}}</el-menu-item> -->
                    <el-menu-item index="/qualification-certification" @click="navigateTo('/qualification-certification')">{{$t('qualificationCertification')}}</el-menu-item>
                    <el-menu-item index="/send-email" @click="navigateTo('/send-email')">{{$t('sendEmail')}}</el-menu-item>
                </el-sub-menu>
                <div class="flex-grow"></div>
                <!-- <el-menu-item index="7">
                    <Country>
                        <template #reference>
                            <SvgIcon v-if="useCountryInfo().value?.icon" :name="useCountryInfo().value?.icon" class="glob-country-icon"></SvgIcon>
                            <template v-else>{{$t('deliveryTo')}}</template>
                        </template>
                    </Country>
                </el-menu-item> -->
                <el-menu-item class="icon-menu" index="8" @click="navigateTo('/order/0')">
                    <el-badge class="mark" :value="useOrderNumber().value ? useOrderNumber().value['1'] : 0"><el-icon><ShoppingCart /></el-icon></el-badge>
                </el-menu-item>
                <el-menu-item class="icon-menu" index="9">
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
                            <div class="flex flex-start user-default-item pointer hover-black-bold" @click="logHandle()">
                                <el-icon><SwitchButton /></el-icon>
                                <span>{{ userInfo().value?.userName ? $t('login.signOut') : $t('login.signIn') }}</span>
                            </div>
                        </div>
                    </el-popover>
                </el-menu-item>
                <!--  v-if="useRuntimeConfig().public.VITE_PACK_ENV != 'prod'" -->
                <el-menu-item index="10">
                    <!-- <ChangeLang></ChangeLang> -->
                    <Country v-if="activeIndex != '/pcba-file'">
                        <template #reference>
                            <!-- <SvgIcon v-if="useCountryInfo().value?.icon" :name="useCountryInfo().value?.icon" class="glob-country-icon"></SvgIcon> -->
                            <!-- <template v-else>{{$t('deliveryTo')}}</template> -->
                            {{ useLangInfo().value.name || $t('languageSwitching') }}
                        </template>
                    </Country>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="default-layout-content"><slot></slot></div>
        <div class="default-layout-footer">
            <div class="default-layout-footer-list main-width">
                <div class="footer-logo pointer" @click="navigateTo('/')">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/u1.png" alt="" class="footer-img">
                    <p class="footer-logo-name">PCBSUPER</p>
                </div>

                <ul>
                    <li class="footer-li li-title pointer hover-unline" @click="navigateTo('/online-count')">{{$t('onlinePricing')}}</li>
                    <!-- <li class="footer-li">{{$t('impedanceStackingDesign')}}</li>
                    <li class="footer-li" @click="navigateTo('/online-count')">{{$t('fr4Board')}}</li>
                    <li class="footer-li">{{$t('highFrequencyBoard')}}</li> -->
                </ul>

                <ul>
                    <li class="footer-li li-title">{{$t('productServices')}}</li>
                    <li class="footer-li pointer hover-unline" @click="navigateTo('/producible-products')">{{$t('producibleProducts')}}</li>
                    <li class="footer-li pointer hover-unline" @click="navigateTo('/process-capability')">{{$t('processCapability')}}</li>
                    <li class="footer-li pointer hover-unline" @click="navigateTo('/product-display')">{{$t('productDisplay')}}</li>
                </ul>

                <ul>
                    <li class="footer-li li-title">{{$t('freightPolicy')}}</li>
                    <li class="footer-li pointer hover-unline" @click="navigateTo('/transportation-method')">{{$t('transportationMethod')}}</li>
                    <!-- <li class="footer-li pointer hover-unline" @click="navigateTo('/return-change-policy')">{{$t('returnAndExchangePolicy')}}</li> -->
                </ul>

                <ul>
                    <li class="footer-li li-title">{{$t('helpCenter')}}</li>
                    <!-- <li class="footer-li pointer hover-unline" @click="navigateTo('/service-guidelines')">{{$t('serviceGuidelines')}}</li> -->
                    <li class="footer-li pointer hover-unline" @click="navigateTo('/help-document')">{{$t('helpDocument')}}</li>
                    <li class="footer-li pointer hover-unline" @click="navigateTo('/order-assistant')">{{$t('orderAssistant')}}</li>
                    <li class="footer-li pointer hover-unline" @click="navigateTo('/direct-ceo')">{{$t('directPage.title')}}</li>
                </ul>

                <ul>
                    <li class="footer-li li-title">{{$t('aboutUs')}}</li>
                    <li class="footer-li pointer hover-unline" @click="navigateTo('/company-introduct')">{{$t('companyIntroduction')}}</li>
                    <!-- <li class="footer-li pointer hover-unline" @click="navigateTo('/enterprise-dynamics')">{{$t('enterpriseDynamics')}}</li> -->
                    <!-- <li class="footer-li pointer hover-unline" @click="navigateTo('/notification-announcement')">{{$t('notificationAnnouncement')}}</li> -->
                    <li class="footer-li pointer hover-unline" @click="navigateTo('/qualification-certification')">{{$t('qualificationCertification')}}</li>
                    <li class="footer-li pointer hover-unline" @click="navigateTo('/send-email')">{{$t('sendEmail')}}</li>
                </ul>

                <ul>
                    <li class="footer-li li-title">{{$t('consultingService')}}</li>
                    <li class="footer-li">{{$t('enterpriseEmail')}}</li>
                    <li class="footer-li">{{$t('factoryAddress')}}</li>
                    <li class="footer-li">{{$t('internationalTradeDepartment')}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="DefaultLayout">
const route = useRoute()
const activeIndex = ref('')
const isEdit = ref(true)

watch(() => route.path, (val, oldV) => {
    if (val) {
        activeIndex.value = route.path
        if (route.path == '/online-count' && route.query?.id) {
            isEdit.value = false
        } else {
            isEdit.value = true
        }
        // console.log(activeIndex.value)
    }
}, { deep: true, immediate: true })
</script>

<style lang="scss" scoped>
.default-layout {
    .default-layout-header {
        background: #fff;
        .default-layout-menu {
            // background: #fff;
            &.el-menu--horizontal.el-menu,
            &.el-menu--horizontal>.el-menu-item,
            &.el-menu--horizontal>.el-menu-item.is-active {
                border-bottom: none;
            }
            :deep(.el-sub-menu) {
                .el-sub-menu__icon-arrow {
                    right: 5px;
                }
                .el-sub-menu__title {
                    padding-left: 10px;
                    padding-right: 25px;
                    border-bottom: none !important;
                    &:hover,
                    &:focus {
                        background: transparent;
                        font-weight: 600;
                        color: #000 !important;
                    }
                }
                

                &.is-active {
                    .el-sub-menu__title {
                        font-weight: 600;
                        color: #000 !important;
                    }
                }
            }
            :deep(.el-menu-item) {
                padding: 0 7px;
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
                padding: 0 10px;
                .mark {
                    line-height: normal;
                    height: 20px;
                }
                .el-icon {
                    margin-right: 0;
                }
            }
        }

        .flex-grow {
            flex-grow: 1;
        }
    }

    .default-layout-content {
        min-width: var(--min-width);
    }

    .default-layout-footer {
        min-width: var(--min-width);
        background: #353535;
        padding: 50px 0 30px;

        .default-layout-footer-list {
            display: flex;
            justify-content: flex-start;
            align-items: stretch;
            color: #fff;

            .footer-logo {
                flex: none;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                min-width: 200px;
                // line-height: 82px;
                .footer-img {
                    width: 100px;
                    height: 100px;
                    // margin-bottom: 10px;
                }

                .footer-logo-name {
                    font-size: 22px;
                    font-weight: 600;
                }
            }

            ul {
                min-width: 150px;
                margin: 0;
                padding-left: 15px;
                list-style-type: none;

                .footer-li {
                    margin-bottom: 5px;
                    font-size: 12px;
                    color: #9e9e9e;
                    &.li-title {
                        margin-bottom: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        color: #fff;
                    }
                }
            }
        }
    }
}
</style>