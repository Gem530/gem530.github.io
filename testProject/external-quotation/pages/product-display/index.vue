<template>
    <div class="product-display main-width">
        <div class="product-display-title text-center">{{$t('productDisplay')}}</div>

        <!-- <img :src="importImage('about-banner.png')"/> -->

        <div class="product-preview">
            <template v-for="(item, index) in state.prodList" :key="index">
                <el-card class="product-preview-item pointer hover-blue">
                    <div :class="['preview-img', `img-${index + 1}`]" @click="viewImg(index)"></div>
                    <div class="preview-content">
                        <div class="preview-content-title hover-has">{{item.title && item.title() || ''}}</div>
                        <div class="preview-content-tips">{{item.tips && item.tips() || ''}}</div>
                    </div>
                </el-card>
            </template>
        </div>

        <!-- <el-image :src="importImage('product/prod1.png')"></el-image> -->
        <el-image-viewer v-if="state.showView" :initial-index="state.imgIndex" :url-list="(state.prodList.map((v: any) => v.url) as string[])"
            @close="closeViewer"></el-image-viewer>
    </div>
</template>

<script setup lang="ts" name="ProcessCapability">
const { t } = useI18n()
definePageMeta({ layout: 'default' })
useHead({ title: () => t('productDisplay') })

const state = reactive<Record<string, any>>({
    showView: false,
    imgIndex: 1,
    prodList: [
        { url: importImage('product/prod1.png'), title: () => t('productShow.prod1'), tips: () => t('productShow.circuitBoardsForAutomotiveInstruments') },
        { url: importImage('product/prod2.png'), title: () => t('productShow.prod2'), tips: () => t('productShow.circuitBoardForAutomotiveLights') },
        { url: importImage('product/prod3.png'), title: () => t('productShow.prod3'), tips: () => t('productShow.circuitBoardForNetworkRouters') },
        { url: importImage('product/prod4.png'), title: () => t('productShow.prod4'), tips: () => t('productShow.fourLayerLEDColorScreenCircuitBoard') },
        { url: importImage('product/prod5.png'), title: () => t('productShow.prod5'), tips: () => t('productShow.automotiveInstrumentPeripheralCircuitBoard') },
        { url: importImage('product/prod6.png'), title: () => t('productShow.prod6'), tips: () => t('productShow.circuitBoardForAutomotiveLights') },
        { url: importImage('product/prod7.png'), title: () => t('productShow.prod7'), tips: () => t('productShow.carCompartmentLightIndicatorBoard') },
        { url: importImage('product/prod8.png'), title: () => t('productShow.prod8'), tips: () => t('productShow.intelligentDrivingBoard') },
        { url: importImage('product/prod9.png'), title: () => t('productShow.prod9'), tips: () => t('productShow.fourLayerIndustrialControlMotherboardCircuitBoard') },
        { url: importImage('product/prod10.png'), title: () => t('productShow.prod10'), tips: () => t('productShow.carChargingStationPowerSupply') },
        { url: importImage('product/prod11.png'), title: () => t('productShow.prod11'), tips: () => t('productShow.doubleSidedAutomotiveElectronicCircuitBoard') },
        { url: importImage('product/prod12.png'), title: () => t('productShow.prod12'), tips: () => t('productShow.doubleSidedCompletionThicknessMMThinPlate') },
        { url: importImage('product/prod13.png'), title: () => t('productShow.prod13'), tips: () => t('productShow.industrialControlLayerGoldFingerBoard') },
        { url: importImage('product/prod14.png'), title: () => t('productShow.prod14'), tips: () => t('productShow.layerIndustrialControlBoard') },
        { url: importImage('product/prod15.png'), title: () => t('productShow.prod15'), tips: () => t('productShow.batteryProtectionBoard') },
        { url: importImage('product/prod16.png'), title: () => t('productShow.prod16'), tips: () => t('productShow.CarchargerPCBAassembly') },
        { url: importImage('product/prod17.png'), title: () => t('productShow.prod17'), tips: () => t('productShow.SMTsurfacemountprocessingforindustrialcontrolboards') },
        { url: importImage('product/prod18.png'), title: () => t('productShow.prod18'), tips: () => t('productShow.AssemblyofindustrialcontrolthroughholePCBA') },
        { url: importImage('product/prod19.png'), title: () => t('productShow.prod19'), tips: () => t('productShow.ControlmotherboardSMTassembly') },
        { url: importImage('product/prod20.png'), title: () => t('productShow.prod20'), tips: () => t('productShow.BluetoothtemplateSMTpatchprocessing') },
        { url: importImage('product/prod21.png'), title: () => t('productShow.prod21'), tips: () => t('productShow.AutomotiveelectronicPCBAassembly') },
        { url: importImage('product/prod22.png'), title: () => t('productShow.prod22'), tips: () => t('productShow.AssemblyofintelligentindustrialcommunicationPCBA') },
        { url: importImage('product/prod23.png'), title: () => t('productShow.prod23'), tips: () => t('productShow.ProfessionalincarDVRPCBAassembly') },
        { url: importImage('product/prod24.png'), title: () => t('productShow.prod24'), tips: () => t('productShow.LEDbatchPCBAassembly') },
    ]
})

const viewImg = (index: number) => {
    state.showView = true
    state.imgIndex = index
    document.body.style.overflowY = 'hidden'
}
const closeViewer = () => {
    state.showView = false
    document.body.style.overflowY = 'auto'
}

// onMounted(() => {
//     const img = importImage('product/prod1.png')
//     console.log(img)
// })
</script>

<style lang="scss" scoped>
.product-display {
    padding: 60px 0;

    .product-display-title {
        margin-bottom: 40px;
        font-size: 36px;
        font-weight: 600;
    }

    .product-preview {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: stretch;
        width: 100%;
        // overflow: hidden;
        // padding: 100px 0 120px;

        // .product-more {
        //     position: absolute;
        //     bottom: 60px;
        //     left: 50%;
        //     transform: translate(-50%, 0);
        //     color: var(--el-color-primary);

        //     &:hover {
        //         text-decoration: underline;
        //     }
        // }

        :deep(.product-preview-item) {
            flex: 0 0 calc((100% - 126px) / 4);
            // width: 328px;
            // height: 100%;
            // padding: 0 !important;
            --el-card-padding: 0px;
            padding-bottom: 35px;
            border: 8px;
            transition: transform 0.3s;
            margin-bottom: 40px;
            margin: 0 42px 40px 0;
            &:nth-child(4n) {
                margin-right: 0;
            }

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
}
</style>