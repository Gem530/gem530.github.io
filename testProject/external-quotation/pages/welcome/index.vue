<template>
    <!-- <div class="flex all">
        <div class="welcome flex flex-column text-center">
            <div class="welcome-name">江西诺思特PCB</div>
            <div>我们专注PCB行业20年，主营PCB、PCBA、快板、样板、小批量，自营工厂，一流的设备和制程，100%全测，7*24小时可报价，快速交付，保证品质交期，时效达（顺丰、跨越、京东），公众号提供1对1专人服务，订单实时进度查询！</div>
            <div>您可以微信扫描下方二维码，关注公众号，将有专人与您对接。</div>
            <img class="welcome-qrcode" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/company-qrcode.png" alt="">
        </div>
    </div> -->
    <div :class="`welcome flex ${!show ? 'flex-between' : 'ipad-welcome'}`">
        <div v-if="!show" class="welcome-item one flex flex-column">
            <div class="welcome-title">江西诺思特电路有限公司</div>
            <div class="welcome-map">
                <Swiper
                    :loop="true"
                    :effect="'fade'"
                    :slides-per-view="1"
                    class="welcome-swiper"
                    :allowTouchMove="false"
                    :pagination="{ clickable: true }"
                    :modules="[SwiperAutoplay, SwiperEffectFade]"
                    @swiper="(value) => swiper = value"
                    @mouseenter="mouseHandle('stop')"
                    @mouseleave="mouseHandle('start')"
                    :autoplay="{
                        delay: 1500,
                        disableOnInteraction: false
                    }"
                    >
                    <SwiperSlide
                        :key="idx"
                        v-for="(slide, idx) in 11"
                        :class="`welcome-swiper-item welcome-img${idx+1}`"
                    >
                    </SwiperSlide>
                    <div class="swiper-prev pointer" @click="prevHandle"></div>
                    <div class="swiper-next pointer" @click="nextHandle"></div>
                </Swiper>
            </div>
        </div>
        <div class="welcome-item two">
            <!-- <div class="welcome-btn"></div> -->
        </div>
        <div v-if="!show" class="welcome-item thr flex flex-column">
            <div class="welcome-vertical">
                <div class="welcome-right"></div>
                <Swiper
                    :loop="true"
                    :mousewheel="true"
                    class="card-swiper"
                    :slides-per-view="5"
                    :direction="'vertical'"
                    :allowTouchMove="false"
                    :modules="[SwiperAutoplay, SwiperEffectCreative]"
                    @swiper="(value) => swiperDir = value"
                    @mouseenter="mouseHandle('stop')"
                    @mouseleave="mouseHandle('start')"
                    :autoplay="{
                        delay: 1500,
                        disableOnInteraction: false
                    }"
                    @activeIndexChange="activeIndexChange"
                    >
                    <SwiperSlide
                        :key="idx"
                        v-for="(slide, idx) in 11"
                        :class="`card-swiper-item ${idx == activeIndex ? `mark-img${idx+1}`: `card-img${idx+1}`}`"
                        @click="toSlide(idx)"
                    >
                    <!-- @mouseenter="mouseIndexHandle('enter', idx)"
                    @mouseleave="mouseIndexHandle('leave', idx)"
                    @click="toSlide(idx)" -->
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Welcome">
definePageMeta({ layout: 'empty' })
const swiper = ref()
const show = ref(true)
const swiperDir = ref()
const mouseIndex = ref(-1)
const activeIndex = ref(0)
const maxRecursion = ref(1)

const mouseHandle = (type: string) => {
    // console.log(swiper, swiper.value)
    if (type == 'stop') {
        // 鼠标移入，停止自动滚动
        swiper.value.autoplay.stop()
        swiperDir.value.autoplay.stop()
    } else if (type == 'start') {
        // 鼠标移出，开始自动滚动
        swiper.value.autoplay.start()
        swiperDir.value.autoplay.start()
    }
}

// 上一个
const prevHandle = () => {
    swiper.value.slidePrev()
    swiperDir.value.slidePrev()
}
// 下一个
const nextHandle = () => {
    swiper.value.slideNext()
    swiperDir.value.slideNext()
}
// 鼠标移入高亮，移出取消
const mouseIndexHandle = (type: string, index: number) => {
    if (type == 'enter') {
        mouseIndex.value = index
    } else {
        mouseIndex.value = -1
    }
}
// 递归调用
const recursionHandle = (times: number, type: string, duration: number = 1500) => {
    if (times > maxRecursion.value) {
        swiper.value.params.speed = 300
        swiperDir.value.params.speed = 300
        return
    }
    // console.log(times, maxRecursion.value)
    if (type == 'next') {
        nextHandle()
    } else if (type == 'prev') {
        prevHandle()
    }
    setTimeout(() => {
        recursionHandle(times + 1, type, duration)
    }, duration)
}
const activeIndexChange = (e: any) => {
    // console.log('activeIndexChange', e)
    activeIndex.value = e.realIndex
}
// 滚动到某一项
const toSlide = (index: number) => {
    // console.log(index, swiperDir.value, swiperDir.value.realIndex)
    // swiper.value.slideToLoop(index, 1500, false);
    // swiperDir.value.slideToLoop(index, 1500, false);
    // swiperDir.value.updateSlidesClasses()
    // swiperDir.value.updateProgress()
    // swiperDir.value.updateAutoHeight(1500)
    // swiperDir.value.updateSlides()
    // swiperDir.value.update(swiperDir.value.el)
    // swiperDir.value.updateSize()
    // swiperDir.value.init(swiperDir.value.el)
    // swiperDir.value.slideReset(0);
    // nextHandle()

    const crtIndex = swiperDir.value.activeIndex
    const clickedIndex = swiperDir.value.clickedIndex
    const countIndex = clickedIndex - crtIndex
    const countIndexAbs = Math.abs(countIndex)

    maxRecursion.value = countIndexAbs
    const duration = 1500 / countIndexAbs
    swiper.value.params.speed = 0
    swiperDir.value.params.speed = 0
    // console.log(duration, maxRecursion.value)
    if (countIndex > 0) recursionHandle(1, 'next', 16.7)
    else if (countIndex < 0) recursionHandle(1, 'prev', 16.7)
}

onMounted(() => {
    show.value = isIpad()
})
</script>

<style lang="scss" scoped>
// .all {
//     height: 100%;
//     overflow: hidden;
//     color: #333;
//     background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8)), url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/webcome-bg.png');
//     background-size: 100% 100%;

//     .welcome {
//         width: 500px;
//         font-weight: 600;
//         word-break: normal;

//         div {
//             margin-bottom: 20px;
//             word-break: normal;
//         }

//         .welcome-qrcode {
//             max-width: 100%;
//         }

//         .welcome-name {
//             font-size: 24px;
//         }
//     }
// }
.welcome {
    width: 100%;
    height: 100vh;
    padding: 0 120px 0 76px;
    background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/zh-user/bg.png') no-repeat center center;
    background-size: cover;
    box-sizing: border-box;
    // overflow-y: hidden;
    overflow: auto;
    &.ipad-welcome {
        padding: 20px;
        .two {
            max-width: 100%;
            max-height: 100%;
            margin: 0;
        }
    }

    .welcome-item {
        flex: none;
        height: 100%;
    }
    .one {
        width: 526px;
        align-items: flex-start;
        // margin-right: 57px;

        .welcome-title {
            // position: absolute;
            // top: -67px;
            // left: 26px;
            // transform: translate(0, -100%);
            margin: 0 0 67px 26px;
            font-family: PuHuiTi;
            font-weight: normal;
            font-size: 32px;
            color: #333333;
            line-height: 38px;
            text-align: left;
            font-style: normal;
            text-transform: none;
        }
        .welcome-map {
            position: relative;
            width: 100%;
            height: 694px;
            .welcome-swiper {
                position: relative;
                height: 100%;
                .welcome-swiper-item {
                    opacity: 0 !important;
                    &.swiper-slide-active {
                        opacity: 1 !important;
                    }
                    
                    @for $i from 1 through 11 {
                        &.welcome-img#{$i} {
                            background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/zh-user/#{$i}.png') no-repeat;
                            // background: url('~/assets/images/home/home#{$i}.jpg') no-repeat;
                            background-size: contain;
                            background-position: center center;
                        }
                    }
                }
                .swiper-prev,
                .swiper-next {
                    position: absolute;
                    // top: 262px;
                    top: 50%;
                    transform: translate(0, -85px);
                    width: 43px;
                    height: 60px;
                    z-index: 100;
                }
                .swiper-prev {
                    left: 18px;
                    background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/zh-user/prev.png') no-repeat center center;
                    background-size: contain;
                }
                .swiper-next {
                    right: 18px;
                    background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/zh-user/next.png') no-repeat center center;
                    background-size: contain;
                }
                :deep(.swiper-pagination) {
                    display: none !important;
                }
            }
        }
    }
    .two {
        position: relative;
        // position: absolute;
        // top: 50%;
        // left: 50%;
        // transform: translate(-50%, -50%);
        width: 603px;
        background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/zh-user/main.png') no-repeat center center;
        background-size: contain;
        height: 817px;
        // // margin-right: 188px;
        // .welcome-btn {
        //     position: absolute;
        //     top: 515px;
        //     left: 50%;
        //     transform: translate(-50%, 0);
        //     width: 366px;
        //     height: 49px;
        //     background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/zh-user/btn.png') no-repeat center center;
        //     background-size: contain;
        // }
    }
    .thr {
        width: 390px;
        height: 100%;
        padding-left: 40px;
        // padding-bottom: 130px;
        // padding-bottom: 250px;
        box-sizing: border-box;
        overflow-y: hidden;
        
        .welcome-vertical {
            position: relative;
            width: 100%;
            .welcome-right {
                position: absolute;
                top: 65px;
                left: 0;
                transform: translate(-100%, -50%);
                display: block;
                width: 26px;
                height: 32px;
                background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/zh-user/right.png') no-repeat;
                // background: url('~/assets/images/home/home#{$i}.jpg') no-repeat;
                background-size: contain;
                z-index: 9999;
            }
            .card-swiper {
                // position: absolute;
                // bottom: 0;
                // left: 0;
                width: 100%;
                height: 650px;
                overflow: visible;
                
    
                .card-swiper-item {
                    // height: 130px !important;
                    @for $i from 1 through 11 {
                        &.card-img#{$i} {
                            background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/zh-user/card#{$i}.png') no-repeat;
                            // background: url('~/assets/images/home/home#{$i}.jpg') no-repeat;
                            background-size: contain;
                            background-position: center center;
                        }
                        &.mark-img#{$i} {
                            background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/zh-user/mark#{$i}.png') no-repeat;
                            // background: url('~/assets/images/home/home#{$i}.jpg') no-repeat;
                            background-size: contain;
                            background-position: center center;
                        }
                    }
                }
            }
        }
    }
}
@media screen and (max-width: 1800px) {
    body {
        .welcome {
            padding: 0 90px 0 36px;
        }
    }
}
@media screen and (max-width: 1440px) {
    body {
        .welcome {
            padding: 0 50px 0 0;
            .one {
                margin-right: -100px;
            }
            .two {
                margin-top: 20px;
            }
            .thr {
                margin-left: -30px;
            }
        }
    }
}
</style>