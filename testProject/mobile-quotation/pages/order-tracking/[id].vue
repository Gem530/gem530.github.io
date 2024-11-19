<template>
    <div class="wip-info">
        <nav-bar left-arrow>
            <template #title>{{ (state.wipInfo?.orderSale?.code || '') +' '+ $t('orderPage.progressTracking') }}</template>
        </nav-bar>
        <van-collapse v-model="activeNames" :accordion="false">
            <van-collapse-item :border="false" :title="$t('orderPage.orderProgress')+':'" name="1">
                <van-steps direction="vertical" :active="state.wipInfo?.recordVoList?.length || 0">
                    <van-step>
                        <h3>{{$t('orderPage.ordered')}}</h3>
                        <p>{{getCurrentTime(0)}}</p>
                    </van-step>
                    <van-step>
                        <h3>{{$t('orderPage.examine')}}</h3>
                        <p>{{getCurrentTime(1)}}</p>
                    </van-step>
                    <van-step>
                        <h3>{{$t('orderPage.payment')}}</h3>
                        <p>{{getCurrentTime(2)}}</p>
                    </van-step>
                    <van-step>
                        <h3>{{$t('orderPage.confirm')}}</h3>
                        <p>{{getCurrentTime(3)}}</p>
                    </van-step>
                    <van-step>
                        <h3>{{$t('orderPage.production')}}</h3>
                        <p>{{getCurrentTime(4)}}</p>
                    </van-step>
                    <van-step>
                        <h3>{{$t('orderPage.delivery')}}</h3>
                        <p>{{getCurrentTime(5)}}</p>
                    </van-step>
                </van-steps>
                <div class="order-detail-table">
                    <div class="order-detail-table-label one">{{$t('orderPage.confirmTime')}}:</div>
                    <div class="order-detail-table-value one unline-blue">{{getCurrentTime((state.wipInfo?.recordVoList?.length || 1) - 1)}}</div>
                    <div class="order-detail-table-label one">{{$t('orderPage.estimatedEarliestDeliveryTime')}}:</div>
                    <div class="order-detail-table-value one">{{state.wipInfo?.orderSale?.expectExpectTime}}</div>
                </div>
            </van-collapse-item>
            <van-collapse-item :border="false" :title="$t('orderPage.productionSchedule')+':'" name="2"
                v-if="state.wipInfo?.orderSale?.status && !['1','9','8'].includes(state.wipInfo?.orderSale?.status)">
                <div class="wip-schedule flex flex-column">
                    <div class="wip-schedule-left">
                        <div class="wip-schedule-file">
                            <div class="wip-schedule-file-text">{{ $t('orderPage.makeFile') }}</div>
                            <div class="wip-schedule-file-name overflow-omit">{{state.wipInfo.orderSale.fileName}}</div>
                        </div>
                        <div class="wip-schedule-number">{{$t('orderPage.orderNumber')}}: {{state.wipInfo.orderSale.code}}</div>
                        <van-steps direction="vertical" class="time-line"
                            :active="state.wipInfo.miNodeInfos.filter((v: any) => v.completeFlag == '1').length - 1">
                            <!--  :active="state.wipInfo.miNodeInfos.filter((v: any) => v.completeFlag == '1').length" -->
                            <van-step :key="index" v-for="(activity, index) in state.wipInfo.miNodeInfos">
                                <h3>{{activity.usName}}</h3>
                                <p>{{activity.completeFlag == '1' ? activity.changTime : ''}}</p>
                            </van-step>
                        </van-steps>
                    </div>
                    <div class="wip-schedule-right">
                        <van-circle
                            :stroke-width="100"
                            layer-color="#ebedf0"
                            :rate="state.wipInfo.craftCompletion"
                            :text="state.wipInfo.craftCompletion + '%'"
                            v-model:current-rate="state.wipInfo.craftCompletion"
                        />
                    </div>
                </div>
            </van-collapse-item>
            <van-collapse-item :border="false" :title="$t('orderPage.transportationProgress')+':'" name="3"
                v-if="state.wipInfo?.orderSale?.status && !['1','3','2','9','8'].includes(state.wipInfo?.orderSale?.status)">
                <div class="order-detail-table">
                    <div class="order-detail-table-label one">{{$t('orderPage.trackingNumber')}}:</div>
                    <div class="order-detail-table-value one unline-blue">{{state.wipInfo.orderSale.trackingNumber}}</div>
                    <div class="order-detail-table-label one">{{$t('orderPage.shippingCountry')}}:</div>
                    <div class="order-detail-table-value one">{{$t('addressPage.JiangxiChina')}}</div>
                    <div class="order-detail-table-label one">{{$t('orderPage.destinationCountry')}}:</div>
                    <div class="order-detail-table-value one">{{state.wipInfo.orderSale.counrtyName}}</div>
                    <div class="order-detail-table-label one">{{$t('orderPage.expressCompany')}}:</div>
                    <div class="order-detail-table-value one">{{'DHL'}}</div>
                    <div class="order-detail-table-label one">{{$t('orderPage.specificAddress')}}:</div>
                    <div class="order-detail-table-value one">
                        {{ `${state.wipInfo.orderSale.state||''} ${state.wipInfo.orderSale.city||''} ${state.wipInfo.orderSale.streetAddress||''} ${state.wipInfo.orderSale.buildingHouseNo||''}` }}
                    </div>
                </div>
            </van-collapse-item>
        </van-collapse>
    </div>
</template>

<script setup lang="ts" name="OrderTracking">
const { t } = useI18n()
definePageMeta({ layout: 'empty' })
useHead({ title: () => t('orderPage.progressTracking') })

const route = useRoute()
const activeNames = ref(['1', '2', '3', '4'])
const state = reactive<Record<string, any>>({
    wipIndex: 4,
    wipInfo: {
    },
})

const getCurrentTime = (index: number) => {
    let res = ''
    if ((state.wipInfo?.recordVoList?.length || 0) > index) {
        res = state.wipInfo?.recordVoList[index]?.changTime
    }
    return res
}

// 获取进度跟踪
const getProgressTracking = (id: string) => {
    // console.log(body)
    $http(`/purchase/sale/wip/${id}`, {
        method: 'get',
        loading: true,
    }).then((res: any) => {
        state.wipInfo = res.data
        state.wipInfo.craftCompletion = ((Number(state.wipInfo.craftCompletion) * 100) * 100 / 100).toFixed(0)
        // console.log(res)
    })
}

onMounted(() => {
    if (route.params?.id) {
        getProgressTracking(route.params?.id as string)
    }
})
</script>

<style lang="scss" scoped>
:deep(.van-nav-bar__title) {
    &.van-ellipsis {
        overflow: visible !important;
    }
}
.wip-info {
    padding: 10px;

    :deep(.van-collapse) {
        .van-cell {
            padding-left: 0;
            padding-right: 0;
        }
        .van-collapse-item__content {
            padding: 0;
            color: #000;
        }
    }
    
    :deep(.van-steps) {
        h3 {
            padding: 0;
            margin: 0;
        }

        .van-step--finish {
            color: var(--el-color-primary);
        }
        // .van-step--process {
        //     .van-step__icon--active,
        //     .van-step__title--active {
        //         color: #07c160 !important;
        //     }
        // }
    }
    
    :deep(.time-line) {
        .van-step--process {
            .van-step__circle-container {
                // display: none;
                width: 5px;
                height: 5px;
                overflow: hidden;
                background: var(--van-step-finish-line-color);
                border-radius: 50%;
            }
        }
    }
    
    .wip-schedule {
        align-items: stretch;
        .wip-schedule-left {
            flex: 1;
            .wip-schedule-file {
                max-width: 270px;
                padding: 5px 15px;
                background: #5a5c68;
                color: #ffffff;

                // .wip-schedule-file-name {}
            }
            .wip-schedule-number {
                margin: 10px 0 20px;
            }
            .el-timeline {
                padding-left: 3px;
                
                .el-timeline-item__node {
                    .el-icon {
                        font-size: 10px;
                    }
                }

                .el-timeline-item__wrapper {
                    display: flex;
                    .el-timeline-item__content {
                        flex: none;
                        width: 50%;
                    }
                    .el-timeline-item__timestamp {
                        flex: none;
                        width: 50%;
                    }
                }
            }
        }
        .wip-schedule-right {
            flex: 1;
        }
    }
}
</style>