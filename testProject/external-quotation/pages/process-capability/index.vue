<template>
    <div class="process-capability">
        <div class="main-width">
            <div class="process-capability-title text-center">{{$t('processCapability')}}</div>
            
            <div class="form-table border hover process head-bg">
                <div class="form-table-item">{{$t('processInfo.item')}}</div>
                <div class="form-table-item flex-2">{{$t('processInfo.productionCapacity')}}</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.layersCounts')}}</div>
                <div class="form-table-item flex-2">1-16 {{$t('processInfo.layers')}}</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.finishedBoardThickness')}}</div>
                <div class="form-table-item flex-2">0.6-2.4mm</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.maxPanelSize')}}</div>
                <div class="form-table-item flex-2">150mm x 200mm - 550mm x 680mm</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.availableLaminateMaterial')}}</div>
                <div class="form-table-item flex-2">FR-4、CEM-3、High TG、High CTI</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.finishedBoardThicknessTolerance')}}</div>
                <div class="form-table-item flex-2">+/- 10%</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.laminatesSuppliersAccommodate')}}</div>
                <div class="form-table-item flex-2">KB、 SY、 NY、GOM （Tg135、Tg150、Tg170）</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.solderMaskSuppliersAccommodate')}}</div>
                <div class="form-table-item flex-2">
                    Taiyo、KUANGXING、UTEK<br/>
                    {{$t('processInfo.colorMore')}}
                </div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.impedanceControl')}}</div>
                <div class="form-table-item flex-2">+/- 10%</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.minInnerLayerWidthSpacing')}}</div>
                <div class="form-table-item flex-2">4mil (0.1mm)</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.minOuterLayerWidthspacing')}}</div>
                <div class="form-table-item flex-2">4mil (0.1mm)</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.maxAspectRatio')}}</div>
                <div class="form-table-item flex-2">8:1</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.copperThickness')}}</div>
                <div class="form-table-item flex-2">18um、 35um、 70um、 105um 、 (HOZ - 3OZ)</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.minfinishedHoleSize')}}</div>
                <div class="form-table-item flex-2">0.20mm (10mil)</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.osp')}}</div>
                <div class="form-table-item">
                    {{$t('processInfo.oSPThickness')}}
                </div>
                <div class="form-table-item">0.2 〜0.5um</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.immersionGold')}}</div>
                <div class="form-table-item">
                    {{$t('processInfo.goldThickness')}}、{{$t('processInfo.nickelThickness')}}
                </div>
                <div class="form-table-item">Ni：3～5um、Au：0.025 〜0.125um</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.immersionTin')}}</div>
                <div class="form-table-item">{{$t('processInfo.tinThickness')}}</div>
                <div class="form-table-item">Sn：1.0〜2um(40〜80u")</div>
            </div>
            <div class="form-table border hover process">
                <div class="form-table-item">{{$t('processInfo.hasl')}}</div>
                <div class="form-table-item">{{$t('processInfo.leadFree')}}</div>
                <div class="form-table-item">2.5um-25um(100〜1000u")</div>
            </div>

            <!-- <div class="process-capability-title text-center margin-top">{{$t('processInfo.mainBusiness')}}</div>
            <div class="process-capability-subtitle text-center">{{$t('processInfo.organicNanoConductiveFilm')}}</div>
            <p class="process-capability-p">{{$t('processInfo.organicNanoConductiveFilmTips')}}</p>
            <div class="process-capability-subtitle text-center">{{$t('processInfo.organicNanoMetalPlating')}}</div>
            <p class="process-capability-p">{{$t('processInfo.organicNanoMetalPlatingTips')}}</p> -->
            <div class="process-capability-title text-center margin-top">{{$t('processInfo.graphicElectroplatingProcessParameters')}}</div>
            <table class="show-table" border>
                <tr>
                    <td>{{$t('processInfo.cylinderName')}}</td>
                    <td>{{$t('processInfo.tsingMaterials')}}</td>
                    <td>{{$t('processInfo.cylinderVolume')}}</td>
                    <td>{{$t('processInfo.configurationConcentration')}}</td>
                    <td>{{$t('processInfo.cylinderOpeningQuantity')}}</td>
                    <td>{{$t('processInfo.workingHours')}}</td>
                </tr>
                <tr>
                    <td>{{$t('processInfo.acidDegreasing')}}</td>
                    <td>AC-22</td>
                    <td>600L</td>
                    <td>2.50%</td>
                    <td>15L</td>
                    <td>3-6{{$t('processInfo.minute')}}</td>
                </tr>
                <tr>
                    <td rowspan="2">{{$t('processInfo.microetching')}}</td>
                    <td>NPS</td>
                    <td>300L</td>
                    <td>50g/l</td>
                    <td>15kg</td>
                    <td rowspan="2">40-60{{$t('processInfo.second')}}</td>
                </tr>
                <tr>
                    <td>H2SO4(CP)</td>
                    <td>300L</td>
                    <td>4%</td>
                    <td>12L</td>
                </tr>
                <tr>
                    <td>{{$t('processInfo.pickling')}}</td>
                    <td>HSO4(CP)</td>
                    <td>300L</td>
                    <td>0.60%</td>
                    <td>2L</td>
                    <td>2-5{{$t('processInfo.minute')}}</td>
                </tr>
                <tr>
                    <td rowspan="4">{{$t('processInfo.electroplatedCopper')}}</td>
                    <td>CuS04.5H2SO4</td>
                    <td>2000L</td>
                    <td>75g/l</td>
                    <td>150 kg</td>
                    <td rowspan="4">{{$t('processInfo.andCurrentIntensity')}}</td>
                </tr>
                <tr>
                    <td>HSO4(AR)</td>
                    <td>2000L</td>
                    <td>200ml/l</td>
                    <td>400L</td>
                </tr>
                <tr>
                    <td>HCL({{$t('processInfo.strong')}})</td>
                    <td>2000L</td>
                    <td>50ppm</td>
                    <td>250ml</td>
                </tr>
                <tr>
                    <td>{{$t('processInfo.copperPhotosensitizer')}}</td>
                    <td>2000L</td>
                    <td>4ml/l</td>
                    <td>9L</td>
                </tr>
                <tr>
                    <td rowspan="3">{{$t('processInfo.electroplatingTin')}}</td>
                    <td>SnS04</td>
                    <td>2000L</td>
                    <td>30k/l</td>
                    <td>50kg</td>
                    <td rowspan="3">10-15{{$t('processInfo.minute')}}</td>
                </tr>
                <tr>
                    <td>HSO4(AR)</td>
                    <td>2000L</td>
                    <td>200ml/l</td>
                    <td>180L</td>
                </tr>
                <tr>
                    <td>{{$t('processInfo.tinningAgent')}}</td>
                    <td>2000L</td>
                    <td>15ml/l</td>
                    <td>8L</td>
                </tr>
            </table>

            <div class="process-capability-title text-center margin-top">{{$t('processInfo.equipmentDisplay')}}</div>
            <div class="process-capability-list-device">
                <div class="process-capability-device flex flex-start">
                    <div class="device-img img1"></div>
                    <div class="device-img img2"></div>
                    <div class="device-info">
                        <div class="device-title">{{$t('processInfo.equipmentTitle1')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips1')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips2')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips3')}}</div>
                    </div>
                </div>

                <div class="process-capability-device flex flex-start reverse">
                    <div class="device-img img3"></div>
                    <div class="device-img img4"></div>
                    <div class="device-info">
                        <div class="device-title">{{$t('processInfo.equipmentTitle2')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips21')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips22')}}</div>
                    </div>
                </div>

                <div class="process-capability-device flex flex-start">
                    <div class="device-img img5"></div>
                    <div class="device-img img6"></div>
                    <div class="device-info">
                        <div class="device-title">{{$t('processInfo.equipmentTitle3')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips31')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips32')}}</div>
                    </div>
                </div>

                <div class="process-capability-device flex flex-start reverse">
                    <div class="device-img img7"></div>
                    <div class="device-img img8"></div>
                    <div class="device-info">
                        <div class="device-title">{{$t('processInfo.equipmentTitle4')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips41')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips42')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips43')}}</div>
                    </div>
                </div>

                <div class="process-capability-device flex flex-start">
                    <div class="device-img img9"></div>
                    <div class="device-img img10"></div>
                    <div class="device-info">
                        <div class="device-title">{{$t('processInfo.equipmentTitle5')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips51')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips52')}}</div>
                    </div>
                </div>

                <div class="process-capability-device flex flex-start reverse">
                    <div class="device-img img11"></div>
                    <div class="device-img img12"></div>
                    <div class="device-info">
                        <div class="device-title">{{$t('processInfo.equipmentTitle6')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips61')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips62')}}</div>
                    </div>
                </div>

                <div class="process-capability-device flex flex-start">
                    <div class="device-img img13"></div>
                    <div class="device-img img14"></div>
                    <div class="device-info">
                        <div class="device-title">{{$t('processInfo.equipmentTitle7')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips71')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips72')}}</div>
                    </div>
                </div>

                <div class="process-capability-device flex flex-start reverse">
                    <div class="device-img img15"></div>
                    <div class="device-img img16"></div>
                    <div class="device-info">
                        <div class="device-title">{{$t('processInfo.equipmentTitle8')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips81')}}</div>
                        <div class="device-tips">{{$t('processInfo.equipmentTips82')}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="ProcessCapability">
const { t } = useI18n()
definePageMeta({ layout: 'default' })
useHead({ title: () => t('processCapability') })
</script>

<style lang="scss" scoped>
.process-capability {
    padding: 60px 0;

    .process-capability-title {
        margin-bottom: 40px;
        font-size: 36px;
        font-weight: 600;

        &.margin-top {
            margin-top: 40px;
        }
    }
    .process-capability-subtitle {
        font-size: 18px;
        font-weight: 600;
        margin: 10px 0;
    }
    .process-capability-p {
        text-indent: 32px;
    }

    .process-capability-list-device {
        .process-capability-device {
            width: 100%;
            height: 350px;
            justify-content: space-between;
            &:not(:last-child) {
                margin-bottom: 40px;
            }

            &.reverse {
                flex-flow: row-reverse;
                .device-img {
                    margin: 0 0 0 10px;
                }
            }

            .device-img {
                width: calc(100% / 3);
                height: 350px;
                margin: 0 10px 0 0;
                @for $i from 1 through 16 {
                    &.img#{$i} {
                        background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/device/device#{$i}.png') no-repeat;
                        background-size: cover;
                    }
                }
            }

            .device-info {
                flex: 1;
                height: 100%;
                background: #f1f3f6;
                padding: 40px;
                box-sizing: border-box;

                .device-title {
                    margin-bottom: 20px;
                    font-size: 18px;
                    font-weight: 600;
                }
                .device-tips {
                    margin-bottom: 8px;
                    font-size: 14px;
                }
            }
        }
    }
}
</style>