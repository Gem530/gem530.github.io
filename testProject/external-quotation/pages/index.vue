<template>
    <div class="home">
        <Swiper
            :loop="true"
            :height="300"
            class="home-swiper"
            :slides-per-view="1"
            :effect="'creative'"
            :pagination="{ clickable: true }"
            :modules="[SwiperAutoplay, SwiperController, SwiperEffectCreative, SwiperPagination]"
            @swiper="(value) => swiper = value"
            :autoplay="{
                delay: 3000,
                disableOnInteraction: false
            }"
            :creative-effect="{
                prev: {
                    shadow: false,
                    translate: ['-100%', 0, -1]
                },
                next: {
                    translate: ['100%', 0, 0]
                }
            }"
            >
            <SwiperSlide
                :key="idx"
                v-for="(slide, idx) in 4"
                :class="`home-swiper-item home-img${idx+1}`"
                @click="homeToPath(idx)"
            >
            </SwiperSlide>
            <div class="swiper-prev pointer" @click="swiper.slidePrev()"><span>&lt;</span></div>
            <div class="swiper-next pointer" @click="swiper.slideNext()"><span>&gt;</span></div>
        </Swiper>
        <el-card class="box-card main-width">
            <!--  v-loading="state.loading" -->
            <el-form :inline="true" :model="state.form" class="demo-form-inline" size="default">
                <el-form-item
                    :key="item.id"
                    :label="item.name"
                    v-for="item in state.params">
                    <template v-if="item.type == 'inputNumber'">
                        <div class="base-input flex flex-start inputNumber">
                            <template :key="el.id" v-for="el in item.paramVos">
                                <template v-if="el.type == '1'">
                                    <el-form-item :prop="item.requiredFlag == '1' ? el.key : ''">
                                        <!-- :rules="item.requiredFlag == '1' ? { required: true, message: el.name+' is required', trigger: 'change' } : {}" -->
                                        <div class="base-input-item flex flex-start" v-if="el.showFlag == '1'">
                                            <el-input
                                                class="base-input-content"
                                                type="number"
                                                v-model="state.form[el.key]"
                                                :disabled="el.disableFlag == '1'"
                                            ><template #append v-if="el?.unit">{{ el.unit }}</template></el-input>
                                            <span class="base-input-to" v-if="el?.label && el?.label != '0'">{{ el?.label }}</span>
                                        </div>
                                    </el-form-item>
                                </template>
                                <el-select v-if="el.type == '2'" v-model="state.form[el.key]" style="width: 90px;">
                                    <el-option label="mm" value="mm" />
                                    <el-option label="inch" value="inch" />
                                </el-select>
                            </template>
                        </div>
                    </template>
                    <template v-if="item.type == 'quantity'">
                        <div class="base-input flex flex-start">
                            <div class="base-input-item">
                                <el-select
                                    class="base-input-content"
                                    v-model.trim="state.form[item.key]"
                                    :ref="(el) => getRefs(el, item.key)">
                                    <template #empty>
                                        <el-radio-group class="select-pop-radio" v-model="state.form[item.key]" @change="changeSelect(item.key)">
                                            <template :key="el.id" v-for="el in item.paramVos">
                                                <el-radio
                                                    border
                                                    :label="el.value"
                                                    v-if="el.showFlag == '1'"
                                                    :disabled="el.disableFlag == '1'"
                                                >{{ el.value }}</el-radio>
                                            </template>
                                        </el-radio-group>
                                    </template>
                                </el-select>
                            </div>
                        </div>
                    </template>
                    <template v-if="['select','radio'].includes(item.type)">
                        <div class="base-input flex flex-start">
                            <div class="base-input-item">
                                <el-select v-model="state.form[item.key]" class="base-input-content">
                                    <template :key="el.value" v-for="el in item.paramVos">
                                        <el-option
                                            :label="el.name"
                                            :value="el.value"
                                            v-if="el.showFlag == '1'"
                                            :disabled="el.disableFlag == '1'"
                                            @click="callBackHandle(el)"
                                        />
                                    </template>
                                </el-select>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <div class="form-grow"></div>
                <el-form-item>
                    <el-button class="home-count-btn" type="primary" @click="onSubmit">{{$t('home.quoteNow')}}</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <div class="product-preview">
            <AnimationColumn :list="state.prodList">
                <template #default="{row}">
                    <el-card class="product-preview-item pointer hover-blue">
                        <!-- <img class="preview-img" :src="row.img" alt=""> -->
                        <div :class="['preview-img', `img-${row.index + 1}`]"></div>
                        <div class="preview-content">
                            <div class="preview-content-title hover-has">{{row.title && row.title()}}</div>
                            <div class="preview-content-tips">{{row.tips && row.tips() || ''}}</div>
                        </div>
                    </el-card>
                </template>
            </AnimationColumn>

            <div class="product-more unline-blue pointer" @click="navigateTo('/product-display')">{{$t('home.viewMore')}}...</div>
        </div>

        <el-card class="business-partner main-width" id="business">
            <div class="business-partner-title">{{$t('home.businessPartners')}}</div>
            <div class="business-partner-subtitle" v-html="$t('home.haveChosenUs', {num:`<span style='font-size: 20px;color:var(--el-color-danger);'>${priceFormat(50000, 0)+'+'}</span>`})"></div>
            <div class="business-partner-list">
                <!-- <div class="business-partner-item hover-black-bold">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/bussiness1.png" alt="" class="business-partner-icon hover-scale pointer">
                </div>
                <div class="business-partner-item hover-black-bold">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/bussiness2.png" alt="" class="business-partner-icon hover-scale pointer">
                </div>
                <div class="business-partner-item hover-black-bold">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/bussiness3.png" alt="" class="business-partner-icon hover-scale pointer">
                </div>
                <div class="business-partner-item hover-black-bold">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/bussiness4.png" alt="" class="business-partner-icon hover-scale pointer">
                </div>
                <div class="business-partner-item hover-black-bold">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/bussiness5.png" alt="" class="business-partner-icon hover-scale pointer">
                </div> -->
                <div class="business-partner-item hover-black-bold" v-for="i in 12">
                    <img :src="`https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/bussiness${i}.png`" alt="" class="business-partner-icon hover-scale pointer">
                </div>
            </div>
        </el-card>

        <div class="how-order main-width">
            <div class="how-order-title text-center">{{ $t('home.HOWTOPLACE') }}</div>
            <div class="how-order-more pointer unline-blue text-center" @click="navigateTo('/order-assistant')">{{ $t('home.viewMore') }}</div>
            <!-- <el-icon><Right /></el-icon> -->
            <div class="how-order-list flex">
                <div class="how-order-item flex flex-column">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/how/how1.png" alt="">
                    <div class="how-order-item-name">{{ $t('home.onlineQuote') }}</div>
                    <el-icon class="how-order-item-right"><Right /></el-icon>
                </div>
                <div class="how-order-item flex flex-column">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/how/how2.png" alt="">
                    <div class="how-order-item-name">{{ $t('home.uploadPCBFile') }}</div>
                    <el-icon class="how-order-item-right"><Right /></el-icon>
                </div>
                <div class="how-order-item flex flex-column">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/how/how3.png" alt="">
                    <div class="how-order-item-name">{{ $t('home.orderReview') }}</div>
                    <el-icon class="how-order-item-right"><Right /></el-icon>
                </div>
                <div class="how-order-item flex flex-column">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/how/how4.png" alt="">
                    <div class="how-order-item-name">{{ $t('home.payment') }}</div>
                    <el-icon class="how-order-item-right"><Right /></el-icon>
                </div>
                <div class="how-order-item flex flex-column">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/how/how5.png" alt="">
                    <div class="how-order-item-name">{{ $t('home.fabrication') }}</div>
                    <el-icon class="how-order-item-right"><Right /></el-icon>
                </div>
                <div class="how-order-item flex flex-column">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/how/how6.png" alt="">
                    <div class="how-order-item-name">{{ $t('home.delivery') }}</div>
                    <el-icon class="how-order-item-right"><Right /></el-icon>
                </div>
                <div class="how-order-item flex flex-column">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/how/how7.png" alt="">
                    <div class="how-order-item-name">{{ $t('home.confirmReceived') }}</div>
                    <el-icon class="how-order-item-right"><Right /></el-icon>
                </div>
                <div class="how-order-item flex flex-column">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/how/how8.png" alt="">
                    <div class="how-order-item-name">{{ $t('home.shared') }}</div>
                    <!-- <el-icon class="how-order-item-right"><Right /></el-icon> -->
                </div>
            </div>
        </div>

        <el-card class="strong-point main-width">
            <div class="strong-point-title text-center">{{ $t('home.ourAdvantages') }}</div>
            <div class="strong-point-list">
                <div class="strong-point-item hover-black-bold">
                    <img class="strong-point-item-img  hover-scale" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/qiu1.png" alt="">
                    <div class="strong-info">
                        <div class="strong-info-title">{{$t('home.priceAdvantage')}}</div>
                        <div class="strong-info-tips">{{$t('home.SingleAndDoubleTip')}}</div>
                    </div>
                </div>
                <div class="strong-point-item hover-black-bold">
                    <img class="strong-point-item-img  hover-scale" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/qiu2.png" alt="">
                    <div class="strong-info">
                        <div class="strong-info-title">{{$t('home.highQuality')}}</div>
                        <div class="strong-info-tips">{{$t('home.highQualityTips')}}</div>
                    </div>
                </div>
                <div class="strong-point-item hover-black-bold">
                    <img class="strong-point-item-img  hover-scale" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/qiu3.png" alt="">
                    <div class="strong-info">
                        <div class="strong-info-title">{{$t('home.fastDeliveryTime')}}</div>
                        <div class="strong-info-tips">{{$t('home.fastDeliveryTimeTips')}}</div>
                    </div>
                </div>
                <!-- <div class="strong-point-item hover-black-bold">
                    <img class="strong-point-item-img  hover-scale" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/qiu4.png" alt="">
                    <div class="strong-info">
                        <div class="strong-info-title">{{$t('home.oneStopShop')}}</div>
                        <div class="strong-info-tips">{{$t('home.oneStopShopTips')}}</div>
                    </div>
                </div> -->
            </div>
        </el-card>
        <!-- <NuxtLink to="/user">用户中心</NuxtLink> -->
    </div>
</template>

<script setup lang="ts" name="Home">
const { t } = useI18n()
const swiper = ref()
const formSelectRef = reactive<Record<string, any>>({})
const getRefs = (e: any, id: string) => {
    formSelectRef[id] = e
}

const state = reactive<Record<string, any>>({
    loading: false,
    form: {},
    params: {},
    prodList: [
        { title: () => t('productShow.prod1'), tips: () => t('productShow.circuitBoardsForAutomotiveInstruments') },
        { title: () => t('productShow.prod2'), tips: () => t('productShow.circuitBoardForAutomotiveLights') },
        { title: () => t('productShow.prod3'), tips: () => t('productShow.circuitBoardForNetworkRouters') },
        { title: () => t('productShow.prod4'), tips: () => t('productShow.fourLayerLEDColorScreenCircuitBoard') },
        { title: () => t('productShow.prod5'), tips: () => t('productShow.automotiveInstrumentPeripheralCircuitBoard') },
        { title: () => t('productShow.prod6'), tips: () => t('productShow.circuitBoardForAutomotiveLights') },
        { title: () => t('productShow.prod7'), tips: () => t('productShow.carCompartmentLightIndicatorBoard') },
        { title: () => t('productShow.prod8'), tips: () => t('productShow.intelligentDrivingBoard') },
        { title: () => t('productShow.prod9'), tips: () => t('productShow.fourLayerIndustrialControlMotherboardCircuitBoard') },
        { title: () => t('productShow.prod10'), tips: () => t('productShow.carChargingStationPowerSupply') },
        { title: () => t('productShow.prod11'), tips: () => t('productShow.doubleSidedAutomotiveElectronicCircuitBoard') },
        { title: () => t('productShow.prod12'), tips: () => t('productShow.doubleSidedCompletionThicknessMMThinPlate') },
        { title: () => t('productShow.prod13'), tips: () => t('productShow.industrialControlLayerGoldFingerBoard') },
        { title: () => t('productShow.prod14'), tips: () => t('productShow.layerIndustrialControlBoard') },
        { title: () => t('productShow.prod15'), tips: () => t('productShow.batteryProtectionBoard') },
        { title: () => t('productShow.prod16'), tips: () => t('productShow.CarchargerPCBAassembly') },
        { title: () => t('productShow.prod17'), tips: () => t('productShow.SMTsurfacemountprocessingforindustrialcontrolboards') },
        { title: () => t('productShow.prod18'), tips: () => t('productShow.AssemblyofindustrialcontrolthroughholePCBA') },
        { title: () => t('productShow.prod19'), tips: () => t('productShow.ControlmotherboardSMTassembly') },
        { title: () => t('productShow.prod20'), tips: () => t('productShow.BluetoothtemplateSMTpatchprocessing') },
        { title: () => t('productShow.prod21'), tips: () => t('productShow.AutomotiveelectronicPCBAassembly') },
        { title: () => t('productShow.prod22'), tips: () => t('productShow.AssemblyofintelligentindustrialcommunicationPCBA') },
        { title: () => t('productShow.prod23'), tips: () => t('productShow.ProfessionalincarDVRPCBAassembly') },
        { title: () => t('productShow.prod24'), tips: () => t('productShow.LEDbatchPCBAassembly') },
    ]
})

const getHomeParams = (first: boolean = false) => {
    state.loading = true
    $http('/purchase/count/homeParams', {
        method: 'post',
        body: {
            boardCategory: state.form.boardCategory || undefined
        }
    }).then((res: any) => {
        state.loading = false
        state.params = res.data
        
        state.params.map((item: any) => {
            if (['radio','select','quantity','textarea'].includes(item.type)) {
                state.form[item.key] = (item.defaultValue == undefined || item.defaultValue == null || item.defaultValue == '') ? undefined : item.defaultValue
            } else {
                item?.paramVos?.length && item.paramVos.map((el: any) => {
                    if (first) {
                        state.form[el.key] = (el.value == undefined || el.value == null || el.value == '') ? undefined : el.value
                        state.form.unit = 'mm'
                    }
                })
            }
        })
    }).catch(() => {
        state.loading = false
    })
}

const onSubmit = () => {
    // console.log('立即计价')
    navigateTo({
        path: '/online-count',
        query: state.form
    })
    // init()
}

const changeSelect = (type: string) => {
    formSelectRef[type].blur()
}

const callBackHandle = (el: Record<string, any>, flag: boolean = false, type?: string) => {
    // configInfo.value.changeKey = el.key
    // if (type == 'checkbox') {
    //     getHomeParams(deepClone(el))
    //     return;
    // }
    if (el?.disableFlag == '1' || el.key != 'boardCategory') return;
    if (flag) state.form[el?.key] = el?.value;
    // const body = initConfig(configInfo.value)
    if (el?.callFlag == '1') {
        // 1再次调用接口，刷新页面
        getHomeParams()
    }
}

const homeToPath = (index: number) => {
    if (index == 3) {
        navigateTo('/online-count')
    }
}
onMounted(() => {
    getHomeParams(true)
})
</script>

<style lang="scss" scoped>
.home {
    .home-swiper {
        height: 500px;

        .home-swiper-item {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 50px;
            &.home-img1 {
                // background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/banner4.webp') no-repeat;
                background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/home/home4.jpg') no-repeat;
                // background: url('~/assets/images/home/home#{$i}.jpg') no-repeat;
                background-size: contain;
                background-position: center center;

                // &.home-img1,
                // &.home-img2,
                // &.home-img9 {
                //     background-size: contain;
                // }
            }

            @for $i from 2 through 4 {
                &.home-img#{$i} {
                    background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/home/home#{$i - 1}.jpg') no-repeat;
                    // background: url('~/assets/images/home/home#{$i}.jpg') no-repeat;
                    background-size: contain;
                    background-position: center center;

                    // &.home-img1,
                    // &.home-img2,
                    // &.home-img9 {
                    //     background-size: contain;
                    // }
                }
            }
        }

        .swiper-prev,
        .swiper-next {
            position: absolute;
            top: 50%;
            transform: translate(0, -50%);
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 120px;
            background: rgba($color: #000000, $alpha: 0.5);
            font-size: 26px;
            color: #fff;
            border-radius: 5px;
            z-index: 100;

            span {
                transform: scaleY(3);
            }
        }
        .swiper-prev {
            left: 50px;
        }
        .swiper-next {
            right: 50px;
        }

        :deep(.swiper-pagination) {
            bottom: 80px;
            .swiper-pagination-bullet {
                width: 50px;
                height: 5px;
                border-radius: 3px;

                &.swiper-pagination-bullet-active {
                    background: var(--el-color-primary);
                }
            }
        }
    }

    :deep(.box-card) {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 120px;
        margin: -60px 0 0;
        z-index: 10;
        box-sizing: border-box;

        .el-card__body {
            width: 100%;
        }
    }
    .el-card {
        box-shadow: 0 5px 30px 0 rgba(78,122,194,.2);
    }
    :deep(.demo-form-inline) {
        display: flex;
        .form-grow {
            flex: 1;
        }
        .el-form-item {
            margin-right: 12px;
            margin-bottom: 0;

            .el-form-item__content {
                flex-wrap: nowrap;
                justify-content: flex-start;

                .inputNumber {
                    .base-input-item {
                        .el-input {
                            max-width: 130px;
                        }
                    }
                }
            }
            &:last-child {
                margin-right: 0;
                .el-form-item__content {
                    justify-content: flex-end;
                }
            }

            .home-count-btn {
                min-width: 105px;
                // word-break: keep-all !important;
                white-space: wrap;
                line-height: 11px;
                // min-height: 40px;
                // padding-top: 5px;
                // padding-bottom: 5px;
            }
        }
    }

    .product-preview {
        position: relative;
        // display: flex;
        // justify-content: space-between;
        // align-items: center;
        width: 100%;
        overflow: hidden;
        // padding: 100px 0 120px;

        .product-more {
            position: absolute;
            bottom: 60px;
            left: 50%;
            transform: translate(-50%, 0);
            color: var(--el-color-primary);

            &:hover {
                text-decoration: underline;
            }
        }

        :deep(.product-preview-item) {
            width: 328px;
            height: 100%;
            // padding: 0 !important;
            --el-card-padding: 0px;
            padding-bottom: 35px;
            border: 8px;
            transition: transform 0.3s;

            &:hover {
                transform: translate(0, -10px);
            }

            .preview-img {
                // width: 100%;
                height: 160px;

                @for $i from 1 through 24 {
                    &.img-#{$i} {
                        background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/product/prod#{$i}.png') no-repeat;
                        background-size: cover;
                        background-position: left center;
                    }
                }
            }

            .preview-content {
                padding: 40px 30px 0;

                .preview-content-title {
                    font-size: 24px;
                    font-weight: 600;
                }
                .preview-content-tips {
                    margin-top: 16px;
                    font-size: 14px;
                    color: #999;
                    line-height: 20px;
                }
            }
        }
    }

    .business-partner {
        width: 100%;
        margin: 0 0 50px;
        --el-card-padding: 30px;
        text-align: center;
        box-shadow: none;

        .business-partner-title {
            margin-bottom: 15px;
            font-size: 20px;
            font-weight: 600;
        }

        .business-partner-subtitle {
            margin-bottom: 25px;
            font-size: 16px;
        }

        .business-partner-list {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;

            .business-partner-item {
                width: 25%;
                margin-bottom: 20px;
                color: #a6adbd;
                overflow: hidden;

                // &:not(:nth-child(5n)) {
                //     margin-right: 50px;
                // }
                .business-partner-icon {
                    height: 50px;
                    margin-bottom: 5px;
                }
            }
        }
    }

    .how-order {
        padding: 0 0 50px;

        .how-order-title {
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: 600;
        }

        .how-order-more {
            margin-bottom: 25px;
            font-size: 14px;
            // color: var(--el-color-danger);
            // text-decoration: underline;
        }

        .how-order-list {
            .how-order-item {
                position: relative;
                flex: 1;
                width: 160px;

                &:hover {
                    .how-order-item-name {
                        color: var(--el-color-primary);
                    }
                }

                img {
                    width: 75px;
                    height: 50px;
                }

                .how-order-item-name {
                    margin-top: 15px;
                    font-size: 12px;
                    transition: color 0.3s ease-in;
                }

                .how-order-item-right {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    transform: translate(50%, 0);
                }
            }
        }
    }

    .strong-point {
        --el-card-padding: 30px;
        margin-bottom: 30px;
        box-shadow: none;

        .strong-point-title {
            margin-bottom: 25px;
            font-size: 20px;
            font-weight: 600;
        }

        .strong-point-list {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .strong-point-item {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                width: 390px;

                .strong-point-item-img {
                    width: 70px;
                    // height: 100px;
                    margin-right: 15px;
                }
                
                .strong-info {
                    color: #333;
                    .strong-info-title {
                        margin-bottom: 6px;
                        font-size: 16px;
                        // font-weight: 500;
                    }
                    .strong-info-tips {
                        font-size: 14px;
                    }
                }
            }
        }
    }
}

.base-input-to {
    margin: 0 0 0 6px;
}
</style>