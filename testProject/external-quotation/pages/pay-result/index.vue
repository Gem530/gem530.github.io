<template>
    <div class="pay-result">
        <el-page-header @back="goBack" style="margin-bottom: 20px;">
            <template #content>
                <span class="text-large font-600 mr-3">{{ $t('payPage.cashier') }}</span>
            </template>
        </el-page-header>
        <el-card class="pay-result-card">
            <template #header>
                <div class="pay-result-title no-margin">{{$t('payPage.cashier')}}</div>
            </template>
            <div class="pay-result-price">{{$t('payPage.paymentAmount')}}:<span>{{ useCurrencyInfo().value?.value }}{{ priceFormat(state.orderInfo?.totalPrice) }}</span></div>
            <div class="pay-result-title">{{$t('payPage.orderFeeDetails')}}</div>
            <el-alert
                show-icon
                type="warning"
                :closable="false"
                style="margin-bottom: 20px;"
                :title="$t('payPage.theCurrentOrder')"
            />
            <el-table scrollbar-always-on :data="state.orderInfo.orders" border ref="receiverRef" style="height: 100%;">
                <el-table-column key="index" type="index" :label="$t('orderPage.number')" align="center" width="78"/>
                <el-table-column key="boardCategory" prop="boardCategory" :label="$t('payPage.productCategory')" align="center">
                    <template #="{ row }">
                        {{ row.boardCategory }}
                    </template>
                </el-table-column>
                <el-table-column key="code" prop="code" :label="$t('orderPage.orderNumber')" align="center"></el-table-column>
                <el-table-column key="createTime" prop="createTime" :label="$t('payPage.orderTime')" align="center" width="155"></el-table-column>
                <el-table-column key="fileName" prop="fileName" :label="$t('payPage.fileName')" align="center"></el-table-column>
                <el-table-column key="total" prop="total" :label="$t('payPage.orderPrice')" align="center" width="110">
                    <template #="{ row }">
                        <span>{{useCurrencyInfo().value?.value}}{{ priceFormat(row.total || 0) }}</span>
                    </template>
                </el-table-column>
                <el-table-column key="freight" prop="freight" :label="$t('payPage.collectionOfFreight')" align="center" min-width="100">
                    <template #="{ row }">
                        <span>{{useCurrencyInfo().value?.value}}{{ priceFormat(row.freight || 0) }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pay-total-price flex flex-end">
                <div class="pay-total-freight">
                    ({{$t('payPage.freight')}} {{$t('payPage.total')}}: {{useCurrencyInfo().value?.value}}{{priceFormat(state.orderInfo.freight || 0)}} + {{$t('payPage.freightTax')}}: {{useCurrencyInfo().value?.value}}{{priceFormat(state.orderInfo.freightTax || 0)}})
                </div>
                <div class="pay-total-network">
                    {{$t('payPage.payment')}} {{$t('payPage.total')}}: {{useCurrencyInfo().value?.value}}{{priceFormat(state.orderInfo.totalPrice || 0)}}
                </div>
            </div>

            <div class="pay-result-title">
                {{$t('payPage.choosePaymentMethod')}}
                <span class="pay-result-tips">({{$t('payPage.reminder', { price: 10 })}})</span>
            </div>
            <el-tabs type="border-card">
                <el-tab-pane :label="t('payPage.onlinePayment')">
                    <div class="pay-method-list">
                        <div class="pay-method-item flex flex-between">
                            <div class="pay-method-info flex flex-start">
                                <div class="pay-method-img-box img1"></div>
                                <div class="pay-method-name">PayPal</div>
                            </div>
                            <el-button plain type="primary" class="pay-method-btn" @click="payOrder('1')">{{$t('payPage.confirmPayment')}}</el-button>
                        </div>
                        <!-- <div class="pay-method-item flex flex-between">
                            <div class="pay-method-info flex flex-start">
                                <div class="pay-method-img-box img2"></div>
                                <div class="pay-method-name">信用卡支付</div>
                            </div>
                            <el-button plain type="primary" class="pay-method-btn" @click="payOrder('2')">{{$t('payPage.confirmPayment')}}</el-button>
                        </div> -->
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="t('payPage.offlinePayment')">
                    <div class="pay-method-list">
                        <div class="pay-method-item flex flex-between">
                            <div class="pay-method-info flex flex-start">
                                <div class="pay-method-img-box img3"></div>
                                <div class="pay-method-name">{{$t('payPage.HSBCBank')}}</div>
                                <!-- <div class="pay-method-account">{{$t('payPage.HSBCBankHongKong')}}<span>053484846838</span></div> -->
                                <el-card class="pay-method-account-box">
                                    <div class="pay-method-account">{{$t('payPage.bankTip1')}}</div>
                                    <div class="pay-method-account">{{$t('payPage.bankTip2')}}</div>
                                    <div class="pay-method-account">{{$t('payPage.bankTip3')}}</div>
                                    <div class="pay-method-account">{{$t('payPage.bankTip4')}}</div>
                                    <div class="pay-method-account">{{$t('payPage.bankTip5')}}</div>
                                    <div class="pay-method-account">{{$t('payPage.bankTip6')}}</div>
                                </el-card>
                            </div>
                            <el-button plain type="primary" class="pay-method-btn" @click="payOrder('3')">{{$t('payPage.confirmPayment')}}</el-button>
                        </div>
                        <!-- <div class="pay-method-item flex flex-between">
                            <div class="pay-method-info flex flex-start">
                                <div class="pay-method-name">{{$t('payPage.westernUnion')}}</div>
                            </div>
                            <el-button plain type="primary" class="pay-method-btn" @click="payOrder('4')">{{$t('payPage.confirmPayment')}}</el-button>
                        </div> -->
                    </div>
                    <div class="pay-result-title">{{$t('payPage.uploadPaymentVoucher')}}</div>
                    <XUpload v-model:model-value="state.orderInfo.proveList"></XUpload>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup lang="ts" name="PayResult">
const { t } = useI18n()
definePageMeta({ layout: 'empty' })
useHead({ title: () => t('payPage.cashier') })
const route = useRoute()
const state = reactive<Record<string, any>>({
    id: undefined,
    orderInfo: {
        orderId: undefined,
        orderRemark: undefined,
        tagRemark: undefined,
        eqConfirm: '1',
        packAsk: undefined, // 包装要求 1本厂标识 2中性包装
        deliverOrder: undefined, // 送货单 1电子版 2纸质
        manufacturingCycle: undefined, // 制作周期 1急单 2按周期
        deliveryCycle: undefined, // 发货通知 1无需 2需要
        addressId: undefined, // 地址id
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
        ElMessageBox.confirm(
            t('payPage.confirmPayment')+'？',
            t('systemPrompt'),
        ).then(() => {
            resolve(true)
        }).catch(() => {
            reject(false)
        })
    })
}

// 提示需要凭证
const shouldFile = () => {
    return new Promise((resolve, reject) => {
        ElMessageBox.confirm(
            t('payPage.makeThePayment'),
            t('systemPrompt'),
        ).then(() => {
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
        ElMessage.error(t('payPage.submitTheVoucher'))
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
            // 关税
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

const goBack = () => {
    useRouter().go(-1)
}
</script>

<style lang="scss" scoped>
.pay-result {
    width: 1000px;
    margin: 0 auto;
    padding: 20px 0;
    .pay-result-card {
        box-shadow: none;

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

                    .pay-method-account-box {
                        margin-left: 50px;
                        .pay-method-account {
                            // margin-left: 50px;
                            span {
                                margin-left: 10px;
                            }
                        }
                    }
                }
            }
        }

        :deep(.avatar-uploader) {
            margin-top: 20px;
            .el-upload {
                border: 1px dashed var(--el-border-color);
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                transition: var(--el-transition-duration-fast);

                &:hover {
                    border-color: var(--el-color-primary);
                }
            }

            .el-icon.avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 178px;
                height: 178px;
                text-align: center;
            }
        }
    }
}
</style>