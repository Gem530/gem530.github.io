<template>
    <div class="order-detail">
        <nav-bar left-arrow>
            <template #title>{{ (state.currentOrder?.saleInfoVo?.code || '') +' '+ $t('orderPage.logisticsDetails') }}</template>
        </nav-bar>
        <div class="order-detail-title">{{$t('orderPage.findingsOfAuDit')}}: </div>
        
        <div class="order-detail-table">
            <div class="order-detail-table-label one">{{ $t('orderPage.findingsOfAuDit') }}:</div>
            <div class="order-detail-table-value one">
                <template v-if="['1','3'].includes(state.currentOrder?.saleInfoVo.reviewFlag)">
                    <div class="table-detail-wait">{{state.currentOrder?.saleInfoVo.reviewFlag && $t(orderReviewStatusText[state.currentOrder?.saleInfoVo.reviewFlag])}}</div>
                </template>
                <template v-else>
                    <div class="table-detail-wait">{{state.currentOrder?.saleInfoVo.reviewFlag && $t(orderPayStatusText[state.currentOrder?.saleInfoVo.reviewFlag])}}</div>
                </template>
            </div>
            <div class="order-detail-table-label one">{{ $t('orderPage.contactCustoMerService') }}:</div>
            <div class="order-detail-table-value one">market@pcbsuper.com</div>
        </div>

        <div class="order-detail-title margin-top">{{$t('orderPage.basicInforMation')}}: </div>
        <div class="order-detail-subtitle">{{$t('orderPage.orderTime')}}: {{state.currentOrder?.saleInfoVo?.createTime}}</div>
        <div shadow="never">
            <div class="order-detail-list flex flex-start">
                <div class="order-detail-item">{{$t('orderPage.orderNumber')}}: {{ state.currentOrder?.saleInfoVo.code }}</div>
                <div class="order-detail-item">{{$t('orderPage.deliveryTime')}}: {{ state.currentOrder?.saleInfoVo.delivery }}</div>
            </div>
            <van-collapse v-model="activeNames" :accordion="false">
                <van-collapse-item :border="false" :title="$t('orderPage.processInforMation')+':'" name="1" v-if="state.currentOrder?.saleInfoVo?.singleSmt != '1'">
                    <div class="order-detail-table" v-if="state.currentOrder && state.currentOrder.saleInfoList">
                        <template v-for="(item, index) in state.currentOrder.saleInfoList" :key="item.key">
                            <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName[item.key] }}:</div>
                            <div class="order-detail-table-value one">{{ item.value }}</div>
                        </template>
                        <!-- <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.boardCategory }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.boardCategory }}</div>
                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.boardQuantity }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.boardQuantity }}</div>

                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.boardLayers }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.boardLayers }}</div>
                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.productType }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.productType }}</div>
                        
                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.panelizationCount }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.panelizationCount }}</div>
                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.shipmentMethod }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.shipmentMethod }}</div>

                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.boardThickness }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.boardThickness }}</div>
                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.solderMaskColor }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.solderMaskColor }}</div>

                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.silkScreenColor }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.silkScreenColor }}</div>
                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.silkScreenColor }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.materialType }}</div>

                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.surfaceFinish }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.surfaceFinish }}</div>
                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.outerCopperThickness }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.outerCopperThickness }}</div>

                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.innerCopperThickness }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.innerCopperThickness }}</div>
                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.impedanceRequired }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.impedanceRequired }}</div>

                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.viaCoverage }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.viaCoverage }}</div>
                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.minHoleOuterDiameter }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.minHoleOuterDiameter }}</div>

                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.boardOutlineTolerance }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.boardOutlineTolerance }}</div>
                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.confirmProductionFiles }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.confirmProductionFiles }}</div>

                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.noCodeOnBoard }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.noCodeOnBoard }}</div>
                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.flyingProbeTest }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.flyingProbeTest }}</div>

                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.goldFingers }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.goldFingers }}</div>
                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.teethHoles }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.teethHoles }}</div>

                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.length }}({{ state.currentOrder?.saleInfoVo.unit }}):</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.length }}</div>
                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.width }}({{ state.currentOrder?.saleInfoVo.unit }}):</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.width }}</div>

                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.edgePlating }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.edgePlating }}</div>
                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.goldThickness }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.goldThickness }}</div>

                        <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName.pcbRemarks }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.pcbRemarks }}</div>

                        <div class="order-detail-table-label one">{{ $t('orderPage.orderRemarks') }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.orderRemark }}</div>

                        <div class="order-detail-table-label one">{{ $t('orderPage.labelRemarks') }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.tagRemark }}</div>

                        <div class="order-detail-table-label one">{{$t('orderPage.expressName')}}:</div>
                        <div class="order-detail-table-value one">{{$t('transportationInfo.DHL')}}</div>
                        <div class="order-detail-table-label one">{{$t('orderPage.expressDeliveryFee')}}:</div>
                        <div class="order-detail-table-value one">{{ priceFormat(state.currentOrder?.saleInfoVo.freight) }}</div> -->
                    </div>
                </van-collapse-item>
                <van-collapse-item :border="false" :title="'PCBA:'" name="5" v-if="state.currentOrder?.saleInfoVo?.pcbA == '1'">
                    <div class="order-detail-table" v-if="state.currentOrder && state.currentOrder.salePcbAInfoList">
                        <template v-for="(item, index) in state.currentOrder.salePcbAInfoList" :key="item.key">
                            <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName[item.key] }}:</div>
                            <div class="order-detail-table-value one">
                                <template v-if="['attach','pcbAMaterial','pcbAMaterialCpl'].includes(item.key) && item.value?.length">
                                    <div class="unline-blue pointer" @click="downloadFile(el.key)" v-for="(el) in item.value" :key="el.key">{{ el.name }}</div>
                                </template>
                                <template v-else-if="['assemblySideTop','assemblySideBottom'].includes(item.key) && item.value?.length">
                                    <van-image :src="el.url" style="width: 100px;height: 100px;"
                                        fit="cover"
                                        v-for="(el) in item.value" :key="el.key"
                                        @click="showImagePreview([el.url])"
                                    ></van-image>
                                </template>
                                <template v-else>{{ item.value }}</template>
                            </div>
                        </template>
                    </div>
                </van-collapse-item>
                <van-collapse-item :border="false" :title="'SMT:'" name="6" v-if="state.currentOrder?.saleInfoVo?.smt == '1'">
                    <div class="order-detail-table" v-if="state.currentOrder && state.currentOrder.saleSmtInfoList">
                        <template v-for="(item, index) in state.currentOrder.saleSmtInfoList" :key="item.key">
                            <div class="order-detail-table-label one">{{ state.currentOrder?.saleInfoVoName[item.key] }}:</div>
                            <div class="order-detail-table-value one">{{ item.value }}</div>
                        </template>
                    </div>
                </van-collapse-item>
                <van-collapse-item :border="false" :title="$t('orderPage.personalizeDInforMation')+':'" name="3">
                    <div class="order-detail-table">
                        <div class="order-detail-table-label one">{{$t('orderPage.packagingRequireMents')}}: </div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.packAsk && $t(packAskEnum[state.currentOrder?.saleInfoVo.packAsk as '1'|'2']) }}</div>
                        <div class="order-detail-table-label one">{{$t('orderPage.deliveryNote')}}: </div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.deliverOrder && $t(deliverOrderEnum[state.currentOrder?.saleInfoVo.deliverOrder as '1'|'2']) }}</div>
                        
                        <div class="order-detail-table-label one">{{$t('orderPage.manufacturingCycle')}}: </div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.manufacturingCycle && $t(manufacturingCycleEnum[state.currentOrder?.saleInfoVo.manufacturingCycle as '1'|'2']) }}</div>
                        <div class="order-detail-table-label one">{{$t('orderPage.shippingNotice')}}: </div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.deliveryCycle && $t(deliveryCycleEnum[state.currentOrder?.saleInfoVo.deliveryCycle as '1'|'2']) }}</div>

                        <div class="order-detail-table-label one">{{$t('orderPage.expressName')}}:</div>
                        <div class="order-detail-table-value one">{{$t('transportationInfo.DHL')}}</div>
                        <div class="order-detail-table-label one">{{$t('orderPage.expressDeliveryFee')}}:</div>
                        <div class="order-detail-table-value one">{{ priceFormat(state.currentOrder?.saleInfoVo.freight) }}</div>

                        <div class="order-detail-table-label one">{{ $t('orderPage.orderRemarks') }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.orderRemark }}</div>

                        <div class="order-detail-table-label one">{{ $t('orderPage.labelRemarks') }}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.tagRemark }}</div>
                    </div>
                </van-collapse-item>
                <van-collapse-item :border="false" :title="$t('orderPage.consigneeInformation')+':'" name="4">
                    <div class="order-detail-table">
                        <div class="order-detail-table-label one">{{$t('addressPage.customerType')}}:</div>
                        <div class="order-detail-table-value one">{{ (state.currentOrder?.saleInfoVo.customerType != undefined) ? $t(customerTypeEnum[state.currentOrder?.saleInfoVo.customerType as '0'|'1']) : '' }}</div>
                        <div class="order-detail-table-label one">{{$t('orderPage.name')}}:</div>
                        <div class="order-detail-table-value one">{{ (state.currentOrder?.saleInfoVo.firstName||'') +' '+ (state.currentOrder?.saleInfoVo.lastName||'') }}</div>
                        
                        <div class="order-detail-table-label one">{{$t('addressPage.counrtyRegion')}}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.counrtyName||'' }}</div>
                        <div class="order-detail-table-label one">{{$t('orderPage.address')}}:</div>
                        <div class="order-detail-table-value one">
                            {{ `${state.currentOrder?.saleInfoVo.state||''} ${state.currentOrder?.saleInfoVo.city||''} ${state.currentOrder?.saleInfoVo.streetAddress||''} ${state.currentOrder?.saleInfoVo.buildingHouseNo||''}` }}
                        </div>

                        <div class="order-detail-table-label one">{{$t('addressPage.postalCode')}}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.postalCode||'' }}</div>
                        <div class="order-detail-table-label one">{{$t('addressPage.cellMobileNumber')}}:</div>
                        <div class="order-detail-table-value one">{{ state.currentOrder?.saleInfoVo.userPhone||'' }}</div>
                    </div>
                </van-collapse-item>
                <van-collapse-item :border="false" name="2">
                    <template #title>
                        <div class="order-detail-total">
                            {{$t('orderPage.totalPrice')}}: <span>{{ useCurrencyInfo().value?.value }}{{priceFormat(state.currentOrder?.totalPrice || 0)}}</span>
                        </div>
                    </template>
                    <div>{{state.currentOrder?.saleInfoVo.singleSmt == '1' ? 'SMT' : 'PCB'}}:</div>
                    <div class="order-detail-list flex flex-start">
                        <div class="order-detail-item bisect" v-for="item in (state.currentOrder?.costList || [])" :key="item.key">
                            {{ item.name }}: {{ useCurrencyInfo().value?.value }}{{ priceFormat(item?.cost||0) }}
                        </div>
                        <div class="order-detail-item bisect" v-for="item in (state.currentOrder?.smtCostList || [])" :key="item.key">
                            {{ item.name }}: {{ useCurrencyInfo().value?.value }}{{ priceFormat(item?.cost||0) }}
                        </div>
                    </div>
                    <template v-if="state.currentOrder?.saleInfoVo?.pcbA == '1'">
                        <div>PCBA:</div>
                        <div class="order-detail-list flex flex-start">
                            <div class="order-detail-item bisect" v-for="item in (state.currentOrder.pcbACostList || [])" :key="item.key">
                                {{ item.name }}: {{ useCurrencyInfo().value?.value }}{{ priceFormat(item?.cost||0) }}
                            </div>
                        </div>
                    </template>
                </van-collapse-item>
            </van-collapse>
        </div>
    </div>
</template>

<script setup lang="ts" name="OrderDetail">
const { t } = useI18n()
definePageMeta({ layout: 'empty' })
useHead({ title: () => t('orderPage.OrderDetails') })

const route = useRoute()
const activeNames = ref(['1', '2', '3', '4','5', '6'])
const state = reactive<Record<string, any>>({
    currentOrder: undefined,
    ordersDetail: {
        total: 0,
        price: 0,
        quantity: 0,
    },
})

// 获取订单详情
const getOrderDetial = (id: string) => {
    // console.log(body)
    $http(`/purchase/sale/orderInfo/${id}`, {
        method: 'get',
        loading: true,
    }).then((res: any) => {
        state.currentOrder = res.data
    })
}

onMounted(() => {
    if (route.params?.id) {
        getOrderDetial(route.params?.id as string)
    }
})
</script>

<style lang="scss" scoped>
.order-detail {
    padding: 10px;
    .order-detail-title {
        // font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
        &.margin-top {
            margin-top: 10px;
        }
    }
    .order-detail-subtitle {
        font-size: 12px;
        margin-bottom: 10px;
    }

    .order-detail-list {
        margin-bottom: 10px;
        flex-wrap: wrap;
        align-items: stretch;
        .order-detail-item {
            margin-right: 10px;
            font-size: 12px;
            &.bisect {
                flex: none;
                width: 33%;
                margin-right: 0;
                margin-bottom: 5px;
            }
        }
    }

    .order-detail-total {
        span {
            color: #f56c6c;
        }
    }
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
}
</style>