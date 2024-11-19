<template>
    <div class="home">
        <div class="header-logo flex flex-between">
            <div class="flex flex-start">
                <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/u1.png" alt="" class="img-logo">
                <span class="header-logo-text">PCB<span style="color: rgb(234, 102, 102);">SUPER</span>.COM</span>
            </div>

            <van-notice-bar class="header-notice" color="#666" background="transparent" scrollable :text="$t('home.yourPCB')" />
        </div>
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
                <!-- :style="`background-color: #79bbff; color: #fff;`" -->
                <!-- {{ idx }} -->
            </SwiperSlide>
            <!-- <div class="swiper-prev pointer" @click="swiper.slidePrev()"><span>&lt;</span></div>
            <div class="swiper-next pointer" @click="swiper.slideNext()"><span>&gt;</span></div> -->
        </Swiper>

        <div class="product-preview">
            <div class="product-preview-title text-center">{{$t('productDisplay')}}</div>
            <AnimationColumn :list="state.prodList">
                <template #default="{row}">
                    <div class="product-preview-item pointer hover-blue">
                        <!-- <img class="preview-img" :src="row.img" alt=""> -->
                        <div :class="['preview-img', `img-${row.index + 1}`]"></div>
                        <div class="preview-content">
                            <div class="preview-content-title hover-has">{{row.title && row.title() || ''}}</div>
                            <div class="preview-content-tips">{{row.tips && row.tips() || ''}}</div>
                        </div>
                    </div>
                </template>
            </AnimationColumn>

            <div class="product-more pointer" @click="navigateTo('/product-display')">{{$t('home.viewMore')}}...</div>
        </div>

        <div class="business-partner main-width">
            <div class="business-partner-title">{{$t('home.businessPartners')}}</div>
            <div class="business-partner-subtitle" v-html="$t('home.haveChosenUs', {num:`<span style='font-size: 20px;color:#f56c6c;'>${priceFormat(50000, 0)+'+'}</span>`})"></div>
            <div class="business-partner-list">
                <!-- <div class="business-partner-item flex">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/bussiness1.png" alt="" class="business-partner-icon hover-scale pointer">
                </div>
                <div class="business-partner-item flex">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/bussiness2.png" alt="" class="business-partner-icon hover-scale pointer">
                </div>
                <div class="business-partner-item flex">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/bussiness3.png" alt="" class="business-partner-icon hover-scale pointer">
                </div>
                <div class="business-partner-item flex">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/bussiness4.png" alt="" class="business-partner-icon hover-scale pointer">
                </div>
                <div class="business-partner-item all">
                    <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/bussiness5.png" alt="" class="business-partner-icon">
                </div> -->
                <div class="business-partner-item" v-for="i in 12">
                    <img :src="`https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/bussiness${i}.png`" alt="" class="business-partner-icon">
                </div>
            </div>
        </div>

        <div class="strong-point main-width">
            <div class="strong-point-list">
                <div class="strong-point-item">
                    <img class="strong-point-item-img" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/qiu1.png" alt="">
                    <div class="strong-info">
                        <div class="strong-info-title">{{$t('home.priceAdvantage')}}</div>
                        <!-- <div class="strong-info-tips">{{$t('home.SingleAndDoubleTip')}}</div> -->
                    </div>
                </div>
                <div class="strong-point-item">
                    <img class="strong-point-item-img" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/qiu2.png" alt="">
                    <div class="strong-info">
                        <div class="strong-info-title">{{$t('home.highQuality')}}</div>
                        <!-- <div class="strong-info-tips">{{$t('home.highQualityTips')}}</div> -->
                    </div>
                </div>
                <div class="strong-point-item">
                    <img class="strong-point-item-img" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/qiu3.png" alt="">
                    <div class="strong-info">
                        <div class="strong-info-title">{{$t('home.fastDeliveryTime')}}</div>
                        <!-- <div class="strong-info-tips">{{$t('home.fastDeliveryTimeTips')}}</div> -->
                    </div>
                </div>
                <!-- <div class="strong-point-item">
                    <img class="strong-point-item-img" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/qiu4.png" alt="">
                    <div class="strong-info">
                        <div class="strong-info-title">{{$t('home.oneStopShop')}}</div>
                    </div>
                </div> -->
            </div>
        </div>
        <!-- <NuxtLink to="/user">用户中心</NuxtLink> -->
    </div>
</template>

<script setup lang="ts" name="Home">
definePageMeta({ layout: 'empty' })
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
        method: 'post'
    }).then((res: any) => {
        state.loading = false
        state.params = res.data
        
        state.params.map((item: any) => {
            if (['radio','select','quantity','textarea'].includes(item.type)) {
                state.form[item.key] = (item.defaultValue == undefined || item.defaultValue == null || item.defaultValue == '') ? undefined : item.defaultValue
            } else {
                item.paramVos.length && item.paramVos.map((el: any) => {
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
// console.log(fiveList.value, useRuntimeConfig())
// 接口调用与封装
// $http('/auth/code').then((res) => {
//     console.log(res)
//     navigateTo('/login')
// })

const homeToPath = (index: number) => {
    if (index == 3) {
        navigateTo('/online-count')
    }
}

// const init = () => {
//     nextTick(() => {
//         console.log(11)
//         useFetch('/api/auth/code').then((res) => {
//             console.log(res)
//         })
//     })
// }
// init()


// 全局管理数据
// console.log(useHH().value)
// console.log(useHH().value = useHH().value + 1)
// console.log(useHH().value)
onMounted(() => {
    // getHomeParams(true)
})
</script>

<style lang="scss" scoped>
.home {
    .home-swiper {
        height: 100px;

        .home-swiper-item {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 50px;
            &.home-img1 {
                // background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/banner4.webp') no-repeat;
                background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/home/home4.jpg') no-repeat;
                background-size: contain;
                background-position: center center;
            }

            @for $i from 2 through 4 {
                &.home-img#{$i} {
                    background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/home/home#{$i - 1}.jpg') no-repeat;
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

        // .swiper-prev,
        // .swiper-next {
        //     position: absolute;
        //     top: 50%;
        //     transform: translate(0, -50%);
        //     display: flex;
        //     justify-content: center;
        //     align-items: center;
        //     width: 50px;
        //     height: 120px;
        //     background: rgba($color: #000000, $alpha: 0.5);
        //     font-size: 26px;
        //     color: #fff;
        //     border-radius: 5px;
        //     z-index: 100;

        //     span {
        //         transform: scaleY(3);
        //     }
        // }
        // .swiper-prev {
        //     left: 50px;
        // }
        // .swiper-next {
        //     right: 50px;
        // }

        :deep(.swiper-pagination) {
            // bottom: 80px;
            .swiper-pagination-bullet {
                // width: 50px;
                // height: 5px;
                // border-radius: 3px;

                &.swiper-pagination-bullet-active {
                    background: #fff;
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
        // margin: -60px 0 0;
        z-index: 10;
    }

    .product-preview {
        position: relative;
        width: 100%;
        overflow: hidden;
        padding: 20px 0 0;

        .product-preview-title {
            font-size: 20px;
            font-weight: 600;
        }

        .product-more {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translate(-50%, 0);
            font-size: 16px;
            color: var(--el-color-primary);

            &:hover {
                text-decoration: underline;
            }
        }

        :deep(.product-preview-item) {
            width: 200px;
            height: 100%;
            // padding: 0 !important;
            padding-bottom: 15px;
            border: 8px;
            transition: transform 0.3s;
            box-shadow: 0 5px 30px 0 rgba(78,122,194,.2);
            border-radius: 6px;
            overflow: hidden;

            &:hover {
                transform: translate(0, -10px);
            }

            .preview-img {
                // width: 100%;
                height: 100px;

                @for $i from 1 through 24 {
                    &.img-#{$i} {
                        background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/product/prod#{$i}.png') no-repeat;
                        background-size: cover;
                        background-position: left center;
                    }
                }
            }

            .preview-content {
                padding: 20px 15px 0;

                .preview-content-title {
                    font-size: 18px;
                    font-weight: 600;
                }
                .preview-content-tips {
                    margin-top: 16px;
                    font-size: 12px;
                    color: #999;
                    line-height: 20px;
                }
            }
        }
    }

    .business-partner {
        width: 100%;
        margin: 0 0 10px;
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
                width: 50%;
                margin-bottom: 20px;
                color: #a6adbd;
                overflow: hidden;

                // &.all {
                //     width: 100%;
                // }

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

    .strong-point {
        box-shadow: none;

        .strong-point-list {
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            flex-wrap: wrap;
            padding: 0 10px;
            .strong-point-item {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                flex: none;
                width: 33%;
                margin-bottom: 20px;

                .strong-point-item-img {
                    width: 35px;
                    // height: 100px;
                    margin: 0 0 10px;
                }
                
                .strong-info {
                    color: #333;
                    .strong-info-title {
                        margin-bottom: 6px;
                        font-size: 12px;
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