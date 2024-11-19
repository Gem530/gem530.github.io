<template>
    <div class="pay main-width">
        <nav-bar left-arrow><template #title>{{$t('payPage.placeOrder')}}</template></nav-bar>
        <div class="pay-card">
            <van-form ref="formRef" @submit="submitHandle" label-align="top">
                <div class="form-header">{{$t('payPage.orderInformation')}}</div>
                
                <div class="order-detail-table">
                    <div class="order-detail-table-label one">{{$t('orderPage.orderNumber')}}:</div>
                    <div class="order-detail-table-value one">{{useSelectOrder().value?.orders[0]?.code}}</div>
                    <template v-if="useSelectOrder().value?.orders[0]?.singleSmt != '1'">
                        <div class="order-detail-table-label one">{{$t('orderPage.ProductionTime')}}:</div>
                        <div class="order-detail-table-value one">{{useSelectOrder().value?.orders[0]?.delivery}}</div>
                        <div class="order-detail-table-label one">{{$t('orderPage.NumberOfLayers')}}:</div>
                        <div class="order-detail-table-value one">{{useSelectOrder().value?.orders[0]?.boardLayers}}</div>

                        <div class="order-detail-table-label one">{{$t('orderPage.PlateThickness')}}:</div>
                        <div class="order-detail-table-value one">{{useSelectOrder().value?.orders[0]?.boardThickness}}</div>
                    </template>
                    <div class="order-detail-table-label one">{{$t('payPage.productCategory')}}:</div>
                    <div class="order-detail-table-value one">{{useSelectOrder().value?.orders[0]?.boardCategory}}</div>
                    <div class="order-detail-table-label one">{{$t('payPage.pCBProductionFiles')}}:</div>
                    <div class="order-detail-table-value one">
                        <span class="unline-blue" @click="downloadFile((useSelectOrder().value?.orders[0]?.fileKey as string))">{{useSelectOrder().value?.orders[0]?.fileName}}</span>
                    </div>
                    <div class="order-detail-table-label one">{{$t('orderPage.OrderQuantity')}}:</div>
                    <div class="order-detail-table-value one" v-if="useSelectOrder().value?.orders[0]?.singleSmt == '1'">{{useSelectOrder().value?.orders[0]?.stencilQty || 0}}</div>
                    <div class="order-detail-table-value one" v-else>{{useSelectOrder().value?.orders[0]?.boardQuantity || 0}}PCS</div>
                    <!-- <div class="order-detail-table-label one">{{$t('orderPage.deliveryTime')}}:</div>
                    <div class="order-detail-table-value one">{{useSelectOrder().value?.orders[0]?.delivery}}</div> -->
                    <div class="order-detail-table-label one">{{$t('payPage.boardMakingOriginalPrice')}}:</div>
                    <div class="order-detail-table-value one">{{priceFormat(useSelectOrder().value?.orders[0]?.total || 0)}}</div>
                    <div class="order-detail-table-label one">{{$t('orderPage.estimatedEarliestDeliveryTime')}}:</div>
                    <div class="order-detail-table-value one">{{useSelectOrder().value?.orders[0]?.expectExpectTime}}</div>
                </div>
                <van-field
                    type="textarea"
                    name="orderRemark"
                    class="textarea-line-height"
                    v-model="state.form.orderRemark"
                    :label="$t('orderPage.orderRemarks')+':'"
                    :placeholder="$t('payPage.theDefaultCopperLaying')">
                </van-field>
                <div class="orange-tips">* {{$t('payPage.pleaseDoNotFill')}}</div>
                <van-field
                    type="textarea"
                    name="tagRemark"
                    class="textarea-line-height"
                    v-model="state.form.tagRemark"
                    :label="$t('orderPage.labelRemarks')+':'"
                    :placeholder="$t('payPage.dueToTagContent')"
                    :rules="[{ validator: validateText }]">
                </van-field>
                <div class="orange-tips">* {{$t('payPage.notFillInTheBoard')}}</div>

                <div class="form-header">
                    <div>{{$t('orderPage.consigneeInformation')}}</div>
                    <div class="flex-grow"></div>
                    <div class="small-font pointer hover-blue" @click="navigateTo('/address-add')">+ {{$t('addressPage.addShippingAddress')}}</div>
                </div>
                <van-address-list
                    right-icon=""
                    class="address-list"
                    :show-add-button="false"
                    :list="state.receiverTable"
                    v-model="state.form.addressId"
                    :default-tag-text="$t('addressPage.isDefault')">
                    <template #item-bottom="item">
                        <div class="address-default flex flex-start">
                            <div class="address-item">{{$t('addressPage.customerType')}}: <span class="address-value">{{ (item.customerType != undefined) && $t(customerTypeEnum[item.customerType as '0'|'1']) }}</span></div>
                            <div class="address-item">{{$t('addressPage.postalCode')}}: <span class="address-value">{{ item.postalCode }}</span></div>
                        </div>
                    </template>
                </van-address-list>

                <div class="form-header flex-wrap">
                    <div>{{$t('payPage.engineeringEQ')}}</div>
                    <van-icon style="margin: 0 20px 0 10px;" color="#999999" name="question" @click="tooltipHandle"/>
                    <van-radio-group v-model="state.form.eqConfirm" style="font-size: 14px !important;" shape="dot" icon-size="16px">
                        <van-radio name="1">{{$t('payPage.sendingEmails')}}</van-radio>
                    </van-radio-group>
                </div>

                <div class="form-header">{{$t('payPage.chooseExpressDelivery')}}</div>
                <div class="order-detail-table">
                    <div class="order-detail-table-label one">{{$t('payPage.paymentByExpressDelivery')}}:</div>
                    <div class="order-detail-table-value one">{{state.fastMailTable[0].send}}</div>
                    <div class="order-detail-table-label one">{{$t('orderPage.expressName')}}:</div>
                    <div class="order-detail-table-value one">{{state.fastMailTable[0].name}}</div>
                    <div class="order-detail-table-label one">{{$t('orderPage.expressDeliveryFee')}}:</div>
                    <div class="order-detail-table-value one">{{state.fastMailTable[0].price()}}</div>
                </div>

                <div class="form-header">{{$t('orderPage.personalizeDInforMation')}}</div>
                <van-field required :label="$t('orderPage.packagingRequireMents')+':'" name="packAsk"
                    :rules="[{ required: true, message: () => t('orderPage.packagingRequireMents') }]">
                    <template #input>
                        <van-radio-group v-model="state.form.packAsk" class="ml-4" direction="horizontal">
                            <van-radio :class="{'is-checked': '1' == state.form.packAsk}" name="1" border>{{$t(packAskEnum['1'])}}</van-radio>
                            <van-radio :class="{'is-checked': '2' == state.form.packAsk}" name="2" border>{{$t(packAskEnum['2'])}}</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field :label="$t('orderPage.deliveryNote')+':'" name="deliverOrder">
                    <template #input>
                        <van-radio-group v-model="state.form.deliverOrder" class="ml-4" direction="horizontal">
                            <van-radio :class="{'is-checked': '1' == state.form.deliverOrder}" name="1" border>{{$t(deliverOrderEnum['1'])}}</van-radio>
                            <van-radio :class="{'is-checked': '2' == state.form.deliverOrder}" name="2" border>{{$t(deliverOrderEnum['2'])}}</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field required :label="$t('orderPage.manufacturingCycle')+':'" name="manufacturingCycle"
                    :rules="[{ required: true, message: () => t('orderPage.manufacturingCycle') }]">
                    <template #input>
                        <van-radio-group v-model="state.form.manufacturingCycle" class="ml-4" direction="horizontal">
                            <van-radio :class="{'is-checked': '1' == state.form.manufacturingCycle}" name="1" border>{{$t(manufacturingCycleEnum['1'])}}</van-radio>
                            <van-radio :class="{'is-checked': '2' == state.form.manufacturingCycle}" name="2" border>{{$t(manufacturingCycleEnum['2'])}}</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field :label="$t('orderPage.shippingNotice')+':'" name="deliveryCycle">
                    <template #input>
                        <van-radio-group v-model="state.form.deliveryCycle" class="ml-4" direction="horizontal">
                            <van-radio :class="{'is-checked': '1' == state.form.deliveryCycle}" name="1" border>{{$t(deliveryCycleEnum['1'])}}</van-radio>
                            <van-radio :class="{'is-checked': '2' == state.form.deliveryCycle}" name="2" border>{{$t(deliveryCycleEnum['2'])}}</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>

                <div class="flex-end margin-top">
                    <div class="flex-end-item">{{$t('payPage.PCBprice')}}</div>
                    <div class="flex-end-value">{{ useCurrencyInfo().value?.value }}{{ priceFormat(state.form.price) }}</div>
                </div>

                <div class="flex-end">
                    <div class="flex-end-item">{{$t('orderPage.expressDeliveryFee')}}</div>
                    <div class="flex-end-value">{{ useCurrencyInfo().value?.value }}{{ priceFormat(state.form.freight) }}</div>
                </div>

                <div class="flex-end large">
                    <div class="flex-end-item">{{$t('payPage.totalPrice')}}</div>
                    <div class="flex-end-value">{{ useCurrencyInfo().value?.value }}{{ priceFormat(state.form.totalPrice) }}</div>
                </div>

                <div class="flex-end">
                    <van-button type="primary" class="order-btn" native-type="submit">{{$t('payPage.placeOrder')}}</van-button>
                </div>
            </van-form>
        </div>

        <!-- <address-dialog ref="addressDialogRef" :isDefault="!state.receiverTable?.length" @confirm="getAddressList"></address-dialog> -->
    </div>
</template>

<script setup lang="ts" name="Pay">
const { t } = useI18n()
definePageMeta({ layout: 'empty' })
useHead({ title: () => t('payPage.placeOrder') })

const validateText = (value: any, rule: any) => {
  if (!value) {
    return ''
  } else {
    if (validNumber(value) && value.toString().length > 15) {
        return t('payPage.theNumber')
    } else if (!validNumber(value) && value.toString().length > 10) {
        return t('payPage.theText')
    }
    return ''
  }
}


const formRef = ref()
const invoiceRef = ref()
const receiverRef = ref()
const fastMailRef = ref()
const fastMail1Ref = ref()
const dialogFormRef = ref()
const orderingInfoRef = ref()
// const addressDialogRef = ref()
const orderType = ref([
    { label: 'FR-4', value: '1' },
])
const state = reactive<Record<string, any>>({
    dialogType: 1, // 1新增收货人信息 2新增下单人信息 3新增发票信息
    dialogTitle: '',
    dialogVisible: false,
    dialogForm: {
        // 收货人信息
        getName: undefined,
        getPhone: undefined,
        address: undefined,
        addressDetail: undefined,

        // 下单人信息
        orderName: undefined,
        orderPhone: undefined,

        // 发票信息
        invoiceType: undefined,
        headType: undefined,
        invoiceHead: undefined,
        invoiceCode: undefined,
        invoiceAddress: undefined,
        invoicePhone: undefined,
        invoiceBank: undefined,
        invoiceAccount: undefined,
    },
    dialogRules: {
    },
    form: {
        orderRemark: undefined,
        tagRemark: undefined,
        eqConfirm: '1',
        openBill: undefined,
        packAsk: '1', // 包装要求 1本厂标识 2中性包装
        deliverOrder: '1', // 送货单 1电子版 2纸质
        manufacturingCycle: '2', // 制作周期 1急单 2按周期
        auditNotification: undefined,
        deliveryCycle: '1', // 发货通知 1无需 2需要
        addressId: undefined, // 地址id

        // pcb价格
        price: 0,
        // 快递费
        freight: 0,
        // 总价格
        totalPrice: 0,
    },
    fastMailTable: [
        { send: 'DHL', name: 'DHL', price: () => t('payPage.basicExpressDelivery') }
    ],
    currentFastMail: undefined,
    receiverTable: [],
    orderingInfoTable: [],
    currentOrderingInfo: undefined,
    invoiceTable: [],
    currentInvoice: undefined,
})

// 获取订单信息
const getOrderByIds = (ids: string[]) => {
    // console.log('ids', ids)
    $http(`/purchase/sale/order`, {
        method: 'post',
        loading: true,
        body: { ids }
    }).then((res: any) => {
        // console.log(res)
        state.form.price = res.data.price || 0
        state.form.freight = res.data.freight || 0
        state.form.totalPrice = res.data.totalPrice || 0
    })
}

// 获取地址列表
const getAddressList = (loading: boolean = false) => {
    $http('/purchase/address/userList', {
        method: 'get',
        loading
    }).then((res: any) => {
        state.receiverTable = res.data || []
        state.receiverTable.map((v: any) => {
            v.isDefault = v.isDefault == '1'
            if (v.isDefault) {
                state.form.addressId = v.id
            }
            v.name = v.firstName + ' ' + v.lastName
            v.tel = v.userPhone
            v.address = `${v.counrtyName} ${v.state} ${v.city} ${v.streetAddress} ${v.buildingHouseNo}`
        })
        if (state.form.addressId == undefined) {
            state.form.addressId = state.receiverTable[0].id
        }
        // console.log(state.receiverTable)
    })
}

// 打开弹框
const openDiaLog = (type: number) => {
    // if (type == 1) {
    //     state.dialogTitle = '新增收货人信息'
    // } else
    // if (type == 2) {
    //     state.dialogTitle = '新增下单人信息'
    // } else {
    //     state.dialogTitle = '新增发票信息'
    // }
    state.dialogType = type
    state.dialogVisible = true
    nextTick(()=> dialogFormRef.value.clearValidate())
}

// 弹框关闭
const cancelHandle = () => {
    state.dialogVisible = false
    for (let key in state.dialogForm) {
        state.dialogForm[key] = undefined
    }
}

const tooltipHandle = () => {
    showDialog({ message: t('payPage.engineeringEQ') });
}

// 弹框确认
const confirmHandle = () => {
    dialogFormRef.value.validate((val: boolean) => {
        if (val) {
            // const params = deepClone(state.dialogForm)
            const params = deepClone(state.dialogForm)
            params.isChecked = false
            // console.log('dialogForm', params)
            // if (state.dialogType == 1) {
            //     state.receiverTable.push(params)
            // } else
            if (state.dialogType == 2) {
                state.orderingInfoTable.push(params)
            } else if (state.dialogType == 3) {
                state.invoiceTable.push(params)
            }
            cancelHandle()
        }
    })
}

// 表格选择
const selectHandle = (selection: any, row: any, refStr: string) => {
    const refObj: Record<string, any> = {
        invoiceRef: invoiceRef.value,
        receiverRef: receiverRef.value,
        fastMailRef: fastMailRef.value,
        fastMail1Ref: fastMail1Ref.value,
        orderingInfoRef: orderingInfoRef.value,
    }
    refObj[refStr].clearSelection()
    refObj[refStr].toggleRowSelection(row, !!selection.length)
    // console.log(selection, row, refStr)
}

// 表格单选
const changeRadio = (row: any, tableData: string) => {
    const tableName = tableData + 'Table'
    const currentName = 'current' + strToUpper(tableData)
    state[tableName] = state[tableName].map((v: Record<string, any>) => {
        if (v == row) {
            v.isChecked = !!v.isChecked
            state[currentName] = v.isChecked ? row : undefined
        } else {
            v.isChecked = false
        }
        return v
    })
    // console.log(state[tableData], currentName, state[currentName])
}

const submitOrder = () => {
    const subjectList = useSelectOrder().value?.orders.map((v: any) => v.id) || []
    const body = {
        subjectList,
        // paymentType,
        orderRemark: state.form.orderRemark || undefined,
        tagRemark: state.form.tagRemark || undefined,
        packAsk: state.form.packAsk || undefined,
        deliverOrder: state.form.deliverOrder || undefined,
        deliveryCycle: state.form.deliveryCycle || undefined,
        manufacturingCycle: state.form.manufacturingCycle || undefined,
        addressId: state.form.addressId || undefined,
        // proveList: state.form.proveList || []
    }
    $http(`/purchase/sale/submitOrder`, {
        method: 'post',
        loading: true,
        body
    }).then((res: any) => {
        navigateTo('/order/1')
    })
}

const submitHandle = () => {
    if (state.form.addressId == undefined || state.form.addressId == null || state.form.addressId == '') {
        showToast(t('payPage.pleaseSelectAnAddress'))
        return
    }
    // formRef.value.validate((val: boolean) => {
    //     // console.log('val', val)
    //     if (val) {
    //         // for (let key in state.form) {
    //         //     useSelectOrder().value[key] = state.form[key]
    //         // }
    //         // useSelectOrder().value.addressId = state.form.addressId
    //         // console.log('提交订单', state.form, useSelectOrder().value)
    submitOrder()
    //     }
    // })
}

onMounted(() => {
    if (useSelectOrder().value.orders) {
        const ids = useSelectOrder().value?.orders.map((v: any) => v.id) || []
        if (ids) {
            getOrderByIds(ids)
        }
    }
    getAddressList()
    // console.log(useSelectOrder().value)
})
</script>

<style lang="scss" scoped>
.pay {
    padding: 20px 10px;

    .pay-card {
        box-shadow: none;

        .pay-header {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .pay-header-title {
                font-size: 20px;
                font-weight: 600;
            }
            .pay-header-time {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-left: 30px;
                font-size: 14px;

            }
        }

        .form-header {
            position: relative;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-left: 20px;
            margin-bottom: 20px;
            // font-size: 18px;
            font-weight: 600;

            &:not(:first-child) {
                margin-top: 20px;
            }

            &::before {
                content: "";
                position: absolute;
                top: -1px;
                left: 0;
                width: 5px;
                height: 18px;
                background: var(--el-color-primary);
                // transform: translate(0, -50%);
                border-radius: 3px;
            }

            &.flex-wrap {
                flex-wrap: wrap;
            }

            .flex-grow {
                flex-grow: 1;
            }

            .small-font {
                font-size: 14px;
                font-weight: 400;
            }

            .form-header-tips {
                width: auto;
                margin-left: 10px;
            }
        }

        .van-cell.van-field {
            padding-left: 0;
            padding-right: 0;
        }

        .input-width {
            width: 600px;
        }
        .form-input-fill {
            width: calc(100% - 600px);
        }
        .orange-tips {
            font-size: 14px;
            color: #e99933;
        }

        .info-tips {
            // position: relative;
            .rigth-top {
                position: absolute;
                top: 0;
                right: 0;
                transform: translate(25px, -50%);
            }
        }

        .flex-end {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            font-size: 14px;

            &.margin-top {
                margin-top: 20px;
            }

            &.large {
                font-size: 18px;
                margin: 20px 0 30px;
                .flex-end-value {
                    color: #de1f37;
                }
            }

            .flex-end-item {
                width: 150px;
                text-align: left;
            }
            .flex-end-value {
                width: 130px;
                text-align: right;
                font-weight: 600;
            }

            .order-btn {
                width: 100%;
                height: 40px;
                font-size: 16px;
            }
        }
    }

    :deep(.textarea-line-height) {
        .van-field__control {
            line-height: 16px;
        }
    }

    :deep(.address-list) {
        padding: 0;
        // &:not(:last-child) {
        //     .van-address-item {
        //         border-bottom: 1px solid #f1f2f3;
        //     }
        // }
        .van-address-item {
            &:not(:last-child) {
                border-bottom: 1px solid #f1f2f3;
                margin-bottom: 0;
            }

            .address-default {
                padding-left: 29px;
                .address-item {
                    flex: none;
                    width: 50%;
                    margin-top: 10px;
                    font-size: 12px;
                    color: #323233;
                }
                .address-value {
                    font-weight: 600;
                }
            }
        }
    }

    
    .table-detail {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .detail-product-img {
            width: 100px;
            margin-right: 10px;
        }

        .table-detail-info {
            flex: 1;
            .table-detail-flex {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;

                span {
                    flex: none;
                    width: 50%;
                    text-align: left;
                }

                .table-detail-wait {
                    font-size: 12px;
                    color: #999;
                }
            }
        }
    }
}
</style>