<template>
    <div class="pay-result">
        <nav-bar left-arrow><template #title>{{$t('payPage.cashier')}}</template></nav-bar>
        <div class="pay-result-card">
            <div class="pay-result-price">{{$t('payPage.paymentAmount')}}:<span>{{ useCurrencyInfo().value?.value }}{{ priceFormat(state.orderInfo?.totalPrice) }}</span></div>
            <div class="pay-result-title">{{$t('payPage.orderFeeDetails')}}</div>
            <van-notice-bar
                wrapable
                :scrollable="false"
                left-icon="warning"
                :text="$t('payPage.theCurrentOrder')"
            />
            <div class="order-page flex flex-start flex-wrap" v-if="state.orderInfo.orders && state.orderInfo.orders.length > 1">
                <div class="order-current">{{ $t('payPage.currentOrder') }}: <span>{{state.orderInfo.orders[state.orderIndex]?.code}}</span></div>
                <van-button class="order-page-btn" type="primary" size="small"
                    v-if="0 < state.orderIndex" @click="state.orderIndex -= 1"
                >{{ $t('payPage.lastPage') }}</van-button>
                <van-button class="order-page-btn" type="primary" size="small"
                    v-if="(state.orderInfo.orders.length - 1) > state.orderIndex" @click="state.orderIndex += 1"
                >{{ $t('payPage.nextPage') }}</van-button>
            </div>
            <div class="order-detail-table margin-top">
                <div class="order-detail-table-label one">{{$t('payPage.productCategory')}}:</div>
                <div class="order-detail-table-value one">{{state.orderInfo.orders[state.orderIndex]?.boardCategory}}</div>
                <div class="order-detail-table-label one">{{$t('orderPage.orderNumber')}}:</div>
                <div class="order-detail-table-value one">{{state.orderInfo.orders[state.orderIndex]?.code}}</div>
                <div class="order-detail-table-label one">{{$t('payPage.orderTime')}}:</div>
                <div class="order-detail-table-value one">{{state.orderInfo.orders[state.orderIndex]?.createTime}}</div>

                <div class="order-detail-table-label one">{{$t('payPage.fileName')}}:</div>
                <div class="order-detail-table-value one">{{state.orderInfo.orders[state.orderIndex]?.fileName}}</div>
                <div class="order-detail-table-label one">{{$t('payPage.orderPrice')}}:</div>
                <div class="order-detail-table-value one">{{useCurrencyInfo().value?.value}}{{ priceFormat(state.orderInfo.orders[state.orderIndex]?.total || 0) }}</div>
                <div class="order-detail-table-label one">{{$t('payPage.collectionOfFreight')}}:</div>
                <div class="order-detail-table-value one">{{useCurrencyInfo().value?.value}}{{ priceFormat(state.orderInfo.orders[state.orderIndex]?.freight || 0) }}</div>
                
                <div class="order-detail-table-label one">{{$t('payPage.freight')}}:</div>
                <div class="order-detail-table-value one">
                    {{$t('payPage.total')}}: {{useCurrencyInfo().value?.value}}{{priceFormat(state.orderInfo.freight || 0)}} + {{$t('payPage.freightTax')}}: {{useCurrencyInfo().value?.value}}{{priceFormat(state.orderInfo.freightTax || 0)}}
                </div>
                <div class="order-detail-table-label one">{{$t('payPage.payment')}} {{$t('payPage.total')}}:</div>
                <div class="order-detail-table-value one">{{useCurrencyInfo().value?.value}}{{priceFormat(state.orderInfo.totalPrice || 0)}}</div>
            </div>
            <!-- <div class="pay-total-price flex flex-end">
                <div class="pay-total-freight">
                    ({{$t('payPage.freight')}} {{$t('payPage.total')}}: {{useCurrencyInfo().value?.value}}{{priceFormat(state.orderInfo.freight || 0)}} + {{$t('payPage.freightTax')}}: {{useCurrencyInfo().value?.value}}{{priceFormat(state.orderInfo.freightTax || 0)}})
                </div>
                <div class="pay-total-network">
                    {{$t('payPage.payment')}} {{$t('payPage.total')}}: {{useCurrencyInfo().value?.value}}{{priceFormat(state.orderInfo.totalPrice || 0)}}
                </div>
            </div> -->

            <div class="pay-result-title margin-top">
                {{$t('payPage.choosePaymentMethod')}}
                <span class="pay-result-tips">({{$t('payPage.reminder', { price: 10 })}})</span>
            </div>
            <van-tabs>
                <van-tab :title="t('payPage.onlinePayment')">
                    <div class="pay-method-list">
                        <div class="pay-method-item flex flex-between">
                            <div class="pay-method-info flex flex-start">
                                <div class="pay-method-img-box img1"></div>
                                <div class="pay-method-name">PayPal</div>
                            </div>
                            <van-button plain size="small" type="primary" class="pay-method-btn" @click="payOrder('1')">{{$t('payPage.confirmPayment')}}</van-button>
                        </div>
                        <!-- <div class="pay-method-item flex flex-between">
                            <div class="pay-method-info flex flex-start">
                                <div class="pay-method-img-box img2"></div>
                                <div class="pay-method-name">信用卡支付</div>
                            </div>
                            <van-button plain type="primary" class="pay-method-btn" @click="payOrder('2')">{{$t('payPage.confirmPayment')}}</van-button>
                        </div> -->
                    </div>
                </van-tab>
                <van-tab :title="t('payPage.offlinePayment')">
                    <div class="pay-method-list">
                        <div class="pay-method-item flex flex-between">
                            <div class="pay-method-info flex flex-start">
                                <div class="pay-method-img-box img3"></div>
                                <div class="pay-method-name pay-column">
                                    <div>{{$t('payPage.HSBCBank')}}</div>
                                    <!-- <div class="pay-method-account">
                                        <div>{{$t('payPage.HSBCBankHongKong')}}</div>
                                        <div>053484846838</div>
                                    </div> -->
                                    <div class="pay-method-account">{{$t('payPage.bankTip1')}}</div>
                                    <div class="pay-method-account">{{$t('payPage.bankTip2')}}</div>
                                    <div class="pay-method-account">{{$t('payPage.bankTip3')}}</div>
                                    <div class="pay-method-account">{{$t('payPage.bankTip4')}}</div>
                                    <div class="pay-method-account">{{$t('payPage.bankTip5')}}</div>
                                    <div class="pay-method-account">{{$t('payPage.bankTip6')}}</div>
                                </div>
                            </div>
                            <van-button plain size="small" type="primary" class="pay-method-btn" @click="payOrder('3')">{{$t('payPage.confirmPayment')}}</van-button>
                        </div>
                        <!-- <div class="pay-method-item flex flex-between">
                            <div class="pay-method-info flex flex-start">
                                <div class="pay-method-name">{{$t('payPage.westernUnion')}}</div>
                            </div>
                            <van-button plain size="small" type="primary" class="pay-method-btn" @click="payOrder('4')">{{$t('payPage.confirmPayment')}}</van-button>
                        </div> -->
                    </div>
                    <div class="pay-result-title">{{$t('payPage.uploadPaymentVoucher')}}</div>
                    <g-upload v-model:model-value="state.orderInfo.proveList"></g-upload>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script setup lang="ts" name="PayResult">
const { t } = useI18n()
definePageMeta({ layout: 'empty' })
useHead({ title: () => t('payPage.cashier') })
const route = useRoute()
const state = reactive<Record<string, any>>({
    id: undefined,
    orderIndex: 0,
    orderInfo: {
        orderId: undefined,
        orderRemark: undefined,
        tagRemark: undefined,
        eqConfirm: '1',
        packAsk: undefined, // 包装要求 1本厂标识 2中性包装
        deliverOrder: undefined, // 送货单 1电子版 2纸质
        manufacturingCycle: undefined, // 制作周期 1急单 2按周期
        deliveryCycle: undefined, // 发货通知 1无需 2需要
        // addressId: undefined, // 地址id
        orders: [],
        proveList: [], // 线下支付凭证

        // pcb价格
        price: 0,
        // 快递费
        freight: 0,
        // 总价格
        totalPrice: 0,
        freightTax: 0,
    }
})

const confirmPay = () => {
    return new Promise((resolve, reject) => {
        showConfirmDialog({
            // `确定删除 ${row.code} 订单吗？`,
            message: t('payPage.confirmPayment')+'？',
            title: t('systemPrompt'),
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: t('confirm'),
            cancelButtonText: t('cancel'),
        }).then(() => {
            resolve(true)
        }).catch(() => {
            reject(false)
        })
    })
}

// 提示需要凭证
const shouldFile = () => {
    return new Promise((resolve, reject) => {
        showConfirmDialog({
            // `确定删除 ${row.code} 订单吗？`,
            message: t('payPage.makeThePayment'),
            title: t('systemPrompt'),
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: t('confirm'),
            cancelButtonText: t('cancel'),
        }).then(() => {
            resolve(true)
        }).catch(() => {
            reject(false)
        })
    })
}

const payOrder = async (paymentType: string) => {
    if (!state.orderInfo.proveList?.length && ['3','4'].includes(paymentType)) {
        // if (!state.id) {
        //     const flag1 = await shouldFile()
        //     if (!flag1) return;
        // } else {
        showToast(t('payPage.submitTheVoucher'))
        return;
        // }
    } else {
        const flag = await confirmPay()
        if (!flag) return;
    }
    // console.log(body)
    if (!state.id) {
        // 支付方式 1 paypal 2 信用卡 3 汇丰银行 4 西联汇款
        const subjectList = state.orderInfo?.orders?.map((v: any) => v.id)
        const body = {
            subjectList,
            paymentType,
            // price: state.orderInfo.price || undefined,
            // freight: state.orderInfo.freight || undefined,
            // totalPrice: state.orderInfo.totalPrice || undefined,
            // freightTax: state.orderInfo.freightTax || undefined,

            // orderRemark: state.orderInfo.orderRemark || undefined,
            // tagRemark: state.orderInfo.tagRemark || undefined,
            // packAsk: state.orderInfo.packAsk || undefined,
            // deliverOrder: state.orderInfo.deliverOrder || undefined,
            // deliveryCycle: state.orderInfo.deliveryCycle || undefined,
            // manufacturingCycle: state.orderInfo.manufacturingCycle || undefined,
            // addressId: state.orderInfo.addressId || undefined,
            proveList: state.orderInfo.proveList || []
        }
        if (['1','2'].includes(body.paymentType)) {
            body.proveList = undefined
        }
        // 初次创建订单
        $http(`/purchase/order/pay`, {
            method: 'post',
            loading: true,
            body
        }).then((res: any) => {
            // console.log(res)
            if (['1','2'].includes(paymentType)) {
                window.open(res.data.url)
            } else if (['3','4'].includes(paymentType)) {
                // 线下支付
                // navigateTo('/orders')
                navigateTo('/order/0')
            }

            // getOrderNum()
        })
    } else {
        const body = {
            id: state.orderInfo.orderId,
            paymentType,
            proveList: state.orderInfo.proveList || []
        }
        if (['1','2'].includes(body.paymentType)) {
            body.proveList = undefined
        }
        // 继续支付
        $http(`/purchase/order/replace`, {
            method: 'post',
            loading: true,
            body
        }).then((res: any) => {
            // console.log(res)
            if (['1','2'].includes(paymentType)) {
                window.open(res.data.url)
            } else if (['3','4'].includes(paymentType)) {
                // 线下支付
                navigateTo('/order/0')
            }

            // getOrderNum()
        })
    }
}

const getSaleOrderDetail = (id: number) => {
    $http(`/purchase/sale/next`, {
        method: 'post',
        loading: true,
        body: { id }
    }).then((res: any) => {
        // console.log(res)
        const {
            orderId,
            // orderRemark,
            // tagRemark,
            // packAsk, // 包装要求 1本厂标识 2中性包装
            // deliverOrder, // 送货单 1电子版 2纸质
            // manufacturingCycle, // 制作周期 1急单 2按周期
            // deliveryCycle, // 发货通知 1无需 2需要
            // addressId, // 地址id
            orderList: orders,
            proveList, // 线下支付凭证

            // pcb价格
            price,
            // 快递费
            freight,
            // 总价格
            totalPrice,
            freightTax,
        } = res.data
        state.orderInfo = {
            orderId,
            // orderRemark,
            // tagRemark,
            eqConfirm: '1',
            // packAsk, // 包装要求 1本厂标识 2中性包装
            // deliverOrder, // 送货单 1电子版 2纸质
            // manufacturingCycle, // 制作周期 1急单 2按周期
            // deliveryCycle, // 发货通知 1无需 2需要
            // addressId, // 地址id
            orders,
            proveList: proveList || [], // 线下支付凭证

            // pcb价格
            price,
            // 快递费
            freight,
            // 总价格
            totalPrice,
            freightTax,
        }
    })
}

onMounted(() => {
    if (route.query?.id) {
        state.id = route.query.id
        getSaleOrderDetail(state.id)
    } else {
        state.orderInfo = useSelectOrder().value
    }
    // console.log(useSelectOrder().value)
})
</script>

<style lang="scss" scoped>
.pay-result {
    // width: 1000px;
    min-height: 100%;
    margin: 0 auto;
    padding: 20px 10px 30px;
    // background: #f1f3f6;
    .pay-result-card {
        box-shadow: none;

        .order-page {
            margin-top: 10px;
            .order-current {
                font-size: 12px;
                span {
                    font-weight: 600;
                }
            }
            .order-page-btn {
                margin-left: 5px;
            }
        }

        .pay-result-price {
            margin-bottom: 20px;
        }

        .pay-result-title {
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: 600;

            &.no-margin {
                margin: 0;
            }

            .pay-result-tips {
                margin-left: 15px;
                font-size: 14px;
            }
        }

        .pay-result-info {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            height: 100px;
            background: #f5f5f5;
            border-top: 5px solid #ff2832;
            border-top: 1px solid #dcdcdc;
            margin-bottom: 20px;
            padding: 0 30px;
            font-size: 14px;
            box-sizing: border-box;

            .pay-result-amount {
                flex: 1;

                span {
                    margin-left: 20px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #ff2832;
                }
            }

            .pay-result-number {
                flex: 1;

                span {
                    margin-left: 20px;
                }
            }
        }

        .pay-total-price {
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid #ebeef5;
            border-top: 0;

            .pay-total-freight {
                margin-right: 10px;
            }
        }

        .pay-method-list {
            width: 100%;
            margin-bottom: 20px;

            .pay-method-item {
                min-height: 70px;
                &:not(:last-child) {
                    border-bottom: 1px solid #ebeef5;
                }
                .pay-method-info {
                    .pay-method-img-box {
                        width: 50px;
                        height: 50px;
                        margin-right: 10px;
                        &.img1 {
                            background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/pay/paypal.png') no-repeat;
                            background-size: contain;
                            background-position: center center;
                        }
                        &.img2 {
                            background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/pay/card.png') no-repeat;
                            background-size: contain;
                            background-position: center center;
                        }
                        &.img3 {
                            background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/pay/bank.png') no-repeat;
                            background-size: contain;
                            background-position: center center;
                        }
                        // overflow: hidden;
                        // .pay-method-img {
                        //     width: 50px;
                        // }
                    }

                    .pay-method-name {
                        &.pay-column {
                            max-width: 180px;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            align-items: flex-start;
                            .pay-method-account {
                                font-size: 12px;
                                color: #999;
                            }
                        }
                    }
                }
            }
        }
    }
    .margin-top {
        margin-top: 20px;
    }
}
</style>