<template>
    <div class="transportation-method main-width">
        <div class="transportation-method-title text-center">{{$t('transportationMethod')}}</div>
        <div class="transportation-method-subtitle text-center">{{$t('transportationInfo.theFollowingAreTheDelivery')}}</div>
        <div class="transportation-method-list">
            <el-card class="transportation-method-item">
                <div class="transportation-method-img img1"></div>
                <div class="transportation-method-content">
                    <div class="transportation-method-item-title">1:{{$t('transportationInfo.DHL')}}</div>
                    <div class="transportation-method-item-tips">
                        <div>{{$t('transportationInfo.DHLProvidesInternational')}}</div>
                        <div>{{$t('transportationInfo.thePackageUsuallyTakes')}}</div>
                        <div style="color: var(--el-color-primary);">{{$t('transportationInfo.onlyThisExpressDelivery')}}</div>
                    </div>
                </div>
            </el-card>
            <el-card class="transportation-method-item">
                <div class="transportation-method-img img2"></div>
                <div class="transportation-method-content">
                    <div class="transportation-method-item-title">2:{{$t('transportationInfo.UPS')}}</div>
                    <div class="transportation-method-item-tips">
                        <div>{{$t('transportationInfo.UPSObtainsInformation')}}</div>
                        <div>{{$t('transportationInfo.thePackageUsuallyTakes')}}</div>
                    </div>
                </div>
            </el-card>
            <el-card class="transportation-method-item">
                <div class="transportation-method-img img3"></div>
                <div class="transportation-method-content">
                    <div class="transportation-method-item-title">3:{{$t('transportationInfo.EMS')}}</div>
                    <div class="transportation-method-item-tips">
                        <div>{{$t('transportationInfo.EMSAlsoProvides')}}</div>
                        <div>{{$t('transportationInfo.itUsuallyTakes')}}</div>
                    </div>
                </div>
            </el-card>
            <el-card class="transportation-method-item">
                <div class="transportation-method-img img4"></div>
                <div class="transportation-method-content">
                    <div class="transportation-method-item-title">4:{{$t('transportationInfo.FedEx')}}</div>
                    <div class="transportation-method-item-tips">
                        <div>{{$t('transportationInfo.fedExProvidesDelivery')}}</div>
                        <div>{{$t('transportationInfo.itTakesWorking')}}</div>
                    </div>
                </div>
            </el-card>
            <el-card class="transportation-method-item">
                <div class="transportation-method-img img5"></div>
                <div class="transportation-method-content">
                    <div class="transportation-method-item-title">5:{{$t('transportationInfo.hongKongPost')}}</div>
                    <div class="transportation-method-item-tips">
                        <div>{{$t('transportationInfo.forCustomersWho')}}</div>
                        <div>{{$t('transportationInfo.itUsuallyTakesWorking')}}</div>
                    </div>
                </div>
            </el-card>
            <el-card class="transportation-method-item">
                <div class="transportation-method-img img6"></div>
                <div class="transportation-method-content">
                    <div class="transportation-method-item-title">6:{{$t('transportationInfo.airSeaIntegrationSeaFreight')}}</div>
                    <div class="transportation-method-item-tips">
                        <div>{{$t('transportationInfo.ifYourOrderVolume')}}</div>
                        <div>{{$t('transportationInfo.pleaseContactYourSales')}}</div>
                    </div>
                </div>
            </el-card>
        </div>
        <div class="tansportation-describe">
            <div>1.{{$t('transportationInfo.thePurposeOfOrder')}}</div>
            <div>2.{{$t('transportationInfo.mergeAllTheseOrders')}}</div>
            <div>3.{{$t('transportationInfo.ifThereAreUrgentOrders')}}</div>
            <div>4.{{$t('transportationInfo.weStronglyRecommend')}}</div>
            <div>5.{{$t('transportationInfo.byCheckingTheBox')}}</div>
        </div>
    </div>
</template>

<script setup lang="ts" name="TransportationMethod">
const { t } = useI18n()
useHead({ title: () => t('transportationMethod') })
</script>

<style lang="scss" scoped>
.transportation-method {
    padding: 60px 0;

    .transportation-method-title {
        margin-bottom: 20px;
        font-size: 36px;
        font-weight: 600;
    }
    .transportation-method-subtitle {
        margin-bottom: 30px;
        font-size: 16px;
        font-weight: 600;
    }

    .transportation-method-list {
        :deep(.transportation-method-item) {
            margin-bottom: 30px;
            .el-card__body {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .transportation-method-img {
                    width: 220px;
                    height: 220px;
                    @for $i from 1 through 6 {
                        &.img#{$i} {
                            background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/ems#{$i}.png') no-repeat center center;
                            background-size: contain;
                        }
                    }
                }

                .transportation-method-content {
                    margin-left: 20px;
                    font-size: 14px;

                    .transportation-method-item-title {
                        margin-bottom: 10px;
                        font-size: 18px;
                        font-weight: 600;
                    }
                    .transportation-method-item-tips {
                        &>div {
                            margin-bottom: 5px;
                        }
                    }
                }
            }
        }
    }

    .tansportation-describe {
        background: #f0ece6;
        padding: 20px 30px;
        margin-top: 50px;
        font-size: 14px;
        color: #6d000e;
        border-radius: 5px;

        &>div {
            margin-bottom: 5px;
        }
    }
}
</style>