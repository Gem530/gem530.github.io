<template>
    <div class="orders">
        <div class="header-logo flex flex-between">
            <div class="flex flex-start">
                <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/u1.png" alt="" class="img-logo">
                <span class="header-logo-text">PCB<span style="color: rgb(234, 102, 102);">SUPER</span>.COM</span>
            </div>

            <van-notice-bar class="header-notice" color="#666" background="transparent" scrollable :text="$t('home.yourPCB')" />
        </div>

        <van-tabs v-model:active="state.form.type" @change="handleClick" :ellipsis="false">
            <van-tab :name="0" :title="$t('orderPage.allOrders')"></van-tab>
            <van-tab :name="9" :title="$t('orderPage.Tobesubmitted')" :badge="state.orderNum['9']"></van-tab>
            <van-tab :name="1" :title="$t('orderPage.pendingPayment')" :badge="state.orderNum['1']"></van-tab>
            <van-tab :name="2" :title="$t('orderPage.inProduction')" :badge="state.orderNum['2']" title-class="primary-badge"></van-tab>
            <van-tab :name="4" :title="$t('orderPage.shipped')" :badge="state.orderNum['4']" title-class="primary-badge"></van-tab>
        </van-tabs>
        <div style="height: 20px;"></div>
        <template v-if="state.tableData?.length">
            <div class="order-item" :key="row.id" v-for="row in state.tableData">
                <div class="order-item-row head flex flex-between">
                    <div class="order-item-col">{{$t('orderPage.orderNumber')}}: {{ row.code }}</div>
                    <div class="order-item-col">
                        <van-tag :type="returnColor(row.status)" class="table-tag" v-if="row.status == 1 && row.reviewFlag == 1">{{$t('orderPage.paymentPendingReview')}}</van-tag>
                        <van-tag :type="returnColor(row.status)" class="table-tag" v-else>{{ row.status && $t(orderStatusText[row.status]) }}</van-tag>
                    </div>
                </div>
                <div class="table-detail-wait flex flex-end">
                    <van-tag class="detail-product-pcba" type="danger" v-if="row.pcbA == '1'">PCBA</van-tag>
                    <van-tag class="detail-product-pcba" type="danger" v-if="row.smt == '1'">SMT</van-tag>
                </div>

                <template v-if="row.status == 1">
                    <div class="table-detail-wait text-right" v-if="row.reviewFlag == 1">{{$t('orderPage.ourCompanyWillContact')}}</div>
                </template>
                <template v-else>
                    <div class="table-detail-wait text-right" v-if="['1'].includes(row.payStatus)">{{$t(orderPayStatusText[row.payStatus])}}</div>
                    <div class="table-detail-wait text-right red" v-if="['3'].includes(row.payStatus)">{{$t(orderPayStatusText[row.payStatus])}}</div>
                </template>

                <template v-if="row.singleSmt == '1'">
                    <div class="order-item-row flex flex-between">
                        <div class="order-item-col">{{$t('orderPage.OrderAmount')}}: {{useCurrencyInfo().value?.value}}{{ priceFormat(row.total || 0) }}</div>
                        <div class="order-item-col"></div>
                    </div>
                    <div class="order-item-row flex flex-between">
                        <div class="order-item-col">{{$t('orderPage.framework')}}: {{ row.framework }}</div>
                        <div class="order-item-col">{{$t('orderPage.stencilSide')}}: {{ row.stencilSide }}</div>
                    </div>
                </template>
                <template v-else>
                    <div class="order-item-row flex flex-between">
                        <div class="order-item-col">{{$t('orderPage.boardCategory')}}: {{ row.boardCategory }}</div>
                        <div class="order-item-col"></div>
                    </div>
                    <div class="order-item-row flex flex-between">
                        <div class="order-item-col">{{$t('orderPage.ProductionTime')}}: {{ row.delivery }}</div>
                        <div class="order-item-col">{{$t('orderPage.OrderAmount')}}: {{useCurrencyInfo().value?.value}}{{ priceFormat(row.total || 0) }}</div>
                    </div>
                    <div class="order-item-row flex flex-between">
                        <div class="order-item-col">{{$t('orderPage.NumberOfLayers')}}: {{ row.boardLayers }}</div>
                        <div class="order-item-col">{{$t('orderPage.PlateThickness')}}: {{ row.boardThickness }}</div>
                    </div>
                </template>
                <div class="order-item-row flex flex-between">
                    <template v-if="row.singleSmt == '1'">
                        <div class="order-item-col">{{$t('orderPage.OrderSize')}}: {{ row?.dimensionsStr }}</div>
                        <div class="order-item-col">{{$t('orderPage.OrderQuantity')}}: {{ row?.stencilQty || 0 }}</div>
                    </template>
                    <template v-else>
                        <div class="order-item-col">{{$t('orderPage.OrderSize')}}: 
                            <span v-if="row?.length">{{ row.length }}{{row.unit}}</span>
                            <span v-if="row?.length && row?.width"> * </span>
                            <span v-if="row?.width">{{ row.width }}{{row.unit}}</span>
                        </div>
                        <div class="order-item-col">{{$t('orderPage.OrderQuantity')}}: {{ row.boardQuantity || 0 }}PCS</div>
                    </template>
                </div>
                <div class="order-item-row flex flex-between">
                    <div class="order-item-col">
                        <div style="flex: 1;">{{ $t('orderPage.makeFile') }}: </div>
                        <div>
                            {{row.singleSmt == '1' ? 'SMT' : 'PCB'}}:
                            <div v-if="row.fileKey && row.fileName" class="file-downlod unline-blue overflow-omit" @click="downloadFile((row.fileKey as string))">{{ row.fileName }}</div>
                            <template v-if="row?.pcbAFiles?.length">
                                <div style="margin-top: 5px;">PCBA:</div>
                                <div v-for="p in row.pcbAFiles" :key="p.id" class="file-downlod unline-blue overflow-omit" @click="downloadFile((p.key as string))">{{ p.name }}</div>
                            </template>
                        </div>
                    </div>
                    <div class="order-item-col"><span class="unline-blue" @click="openDialog(1, row)">{{$t('orderPage.OrderDetails')}}</span></div>
                </div>
                <div class="order-item-row flex flex-between" v-if="[4].includes(state.form.type)">
                    {{$t('orderPage.shippingAddress')}}: 
                    {{ `${row.state||''} ${row.city||''} ${row.streetAddress||''} ${row.buildingHouseNo||''}` }}
                </div>
                <div class="flex flex-between">
                    <div class="flex-left">
                        <van-button class="order-btn" size="small" type="primary" v-if="row.orderId && ['1','3'].includes(row.payStatus) && ['1'].includes(row.status)" @click="continuePay(row)">{{$t('orderPage.continuePayment')}}</van-button>
                        <van-button class="order-btn" size="small" type="primary" v-if="row.orderId && ['1'].includes(row.status) && ['1'].includes(row.payStatus)" @click="cancelOrder(row)">{{$t('orderPage.cancelOrder')}}</van-button>
                        <van-button class="order-btn" size="small" type="primary" v-if="['9'].includes(row.status)" @click="navigateTo(`/online-count?id=${row.id}`)">{{$t('orderPage.edit')}}</van-button>
                        <van-button class="order-btn" size="small" type="primary" v-if="['1','5','6'].includes(row.status)" @click="delOrder(row)">{{$t('orderPage.delete')}}</van-button>
                        <van-button class="order-btn" size="small" type="primary" @click="openDialog(4, row)">{{$t('orderPage.progressTracking')}}</van-button>
                    </div>
                    <div class="flex-right" v-if="[1, 9].includes(state.form.type)">
                        <van-button
                            size="small"
                            type="primary"
                            class="order-btn"
                            @click="toPay(row)"
                            v-if="state.form.type == '1'"
                            :disabled="!(row.reviewFlag == '2' && !row.orderId)"
                        >{{$t('orderPage.goMakeThePayMent')}}</van-button>
                        <van-button
                            size="small"
                            type="primary"
                            class="order-btn"
                            @click="toSubmitOrder(row)"
                            v-if="state.form.type == 9"
                        >{{$t('payPage.placeOrder')}}</van-button>
                    </div>
                </div>
            </div>
        </template>
        <van-empty :description="$t('noData')" v-else />
    </div>
</template>

<script setup lang="ts" name="Orders">
const { t } = useI18n()
definePageMeta({ layout: 'empty' })
useHead({ title: () => t('orderManagement') })
const { $loadingStart, $loadingEnd } = useNuxtApp()

const tableRef = ref()
const route = useRoute()
const activeNames = ref(['1', '2', '3', '4'])
const state = reactive<Record<string, any>>({
    dialogType: 1, // 1订单详情 2物流详情 3联系快递员
    dialogTitle: '', // 1订单详情 2物流详情 3联系快递员
    dialogVisible: false,
    currentRow: undefined,
    form: {
        type: 0,
        page: 1,
        pageSize: 10,
        code: undefined,
        file: undefined,
        dateArr: undefined,
        dateEnd: undefined,
        dateStart: undefined,
    },
    orderNum: {
        '1': 0,
        '2': 0,
        '4': 0,
        '5': 0
    },
    total: 1000,
    tableData: [],
    selectOrder: [],
    currentOrder: undefined,
    ordersDetail: {
        total: 0,
        price: 0,
        quantity: 0,
    },
    wipIndex: 4,
    wipInfo: {
        // list :[
        //     {
        //         content: 'Custom icon',
        //         timestamp: '2018-04-12 20:46',
        //     },
        //     {
        //         content: 'Custom color',
        //         timestamp: '2018-04-03 20:46',
        //     },
        //     {
        //         content: 'Custom size',
        //         timestamp: '2018-04-03 20:46',
        //     },
        //     {
        //         content: 'Custom hollow',
        //         timestamp: '2018-04-03 20:46',
        //     },
        //     {
        //         content: 'Default node',
        //         timestamp: '2018-04-03 20:46',
        //     },
        // ]
    },
})

watch(() => route.params, (val) => {
    if (val) {
        state.form.type = Number(val?.type || 0)
    }
}, { immediate: true, deep: true })

// 是否可以勾选 reviewFlag 1待审核 2审核通过 3审核不通过
const selectable = (row: Record<string, any>, index: number) => {
    return row.reviewFlag == '2' && !row.orderId
}

// 选择订单
const selectionChange = (selection: any[]) => {
    for (let key in state.ordersDetail) {
        state.ordersDetail[key] = 0
    }

    state.selectOrder = selection || []
    state.ordersDetail.total = state.selectOrder?.length || 0
    state.selectOrder.map((item: Record<string, any>) => {
        state.ordersDetail.price += Number(item.total || 0)
        state.ordersDetail.quantity += Number(item.boardQuantity || 0)
    })
    // console.log(state.selectOrder, state.ordersDetail)
}

const returnColor = (num: string): "success" | "warning" | "primary" | "danger" | "default" => {
    let res: any = ''
    switch (num) {
        case '1':
            res = 'danger';
            break;
        case '2':
            res = 'warning';
            break;
        case '3':
            res = 'success';
            break;
        case '4':
            res = 'success';
            break;
        // case 4:
        //     res = 'success';
        //     break;
        // case 5:
        //     res = 'success';
        //     break;
        default:
            res = 'default'
    }
    return res
}

// 查询
const onSubmit = () => {
    if (state.form.dateArr && (state.form.dateArr as any[]).length) {
        state.form.dateStart = state.form.dateArr[0]
        state.form.dateEnd = state.form.dateArr[1]
    } else {
        state.form.dateStart = undefined
        state.form.dateEnd = undefined
    }
    // console.log('开始查询', state.form)
    getOrderList()
}

// 类型切换
const handleClick = (name: number) => {
    navigateTo(`/order/${name}`)
    // state.form.type = name
    // getOrderList()
}

// 打开弹框
const openDialog = (type: number, row: Record<string, any>) => {
    if (type == 1) {
        // state.dialogTitle = row.code + t('orderPage.OrderDetails')
        // getOrderDetial(row)
        navigateTo(`/order-detail/${row.id}`)
    } else if (type == 2) {
        state.dialogTitle = row.code + t('orderPage.logisticsDetails')
    } else if (type == 3) {
        state.dialogTitle = row.code + ' ' + t('orderPage.expressDeliveryPersonnel')
    } else if (type == 4) {
        // state.dialogTitle = row.code + ' ' + t('orderPage.progressTracking')
        // getProgressTracking(row)
        navigateTo(`/order-tracking/${row.id}`)
    }
    state.currentRow = row
    state.dialogType = type
    state.dialogVisible = true
    // console.log('state.currentRow', state.currentRow)
}

// 继续支付
const continuePay = (row: Record<string, any>) => {
    navigateTo(`/pay-result?id=${row.id}`)
}

// 取消订单
const cancelOrder = (row: Record<string, any>) => {
    showConfirmDialog({
        // `确定删除 ${row.code} 订单吗？`,
        message: t('areYouSureToCancel', { order: row.code }),
        title: t('systemPrompt'),
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: t('confirm'),
        cancelButtonText: t('cancel'),
    }).then(() => {
        $http(`/purchase/sale/cancel`, {
            method: 'post',
            loading: true,
            body: { id: row.id }
        }).then((res: any) => {
            getOrderList()
            // ElMessage({ type: 'success', message: '删除成功', })
        })
    })
}

// 删除
const delOrder = (row: Record<string, any>) => {
    showConfirmDialog({
        // `确定删除 ${row.code} 订单吗？`,
        message: t('areYouSureToDelete', { order: row.code }),
        title: t('systemPrompt'),
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: t('confirm'),
        cancelButtonText: t('cancel'),
    }).then(() => {
        // console.log(body)
        const ids = [row.id]
        $http(`/purchase/sale/${ids}`, {
            method: 'delete',
            loading: true,
        }).then((res: any) => {
            getOrderList()
            showToast(t('deleteSuccessful'))
        })
    })
}

// 获取订单列表
const getOrderList = (loading: boolean = true, allLoading?: boolean) => {
    // 1待支付、2生产中、3已发货、4生产完成、5待评价、6已完成
    const query = {
        createTimeStart: state.form.dateStart,
        createTimeEnd: state.form.dateEnd,
        code: state.form.code,
        fileName: state.form.file,
        status: state.form?.type == 0 ? undefined : state.form?.type
    }
    // console.log(body)
    $http('/purchase/sale/list', {
        method: 'get',
        loading,
        query
    }).then((res: any) => {
        if (allLoading) $loadingEnd()
        state.tableData = res.data || []
        state.tableData.map((v: any) => {
            v.makeFiles = []
        })
        getOrderNum()
        state.orderNum = useOrderNumber().value
    }).catch(() => {
        if (allLoading) $loadingEnd()
    })
}

// 上传文件
const fileChange = (files: any, row: Record<string, any>): any => {
    const {
        fileKey,
        fileName,
        fileSize,
        fileSuffix,
    } = fileDeal(files, 'object')
    const body = {
        id: row.id,
        fileKey,
        fileName,
        fileSize,
        fileSuffix,
    }
    $loadingStart()
    $http('/purchase/sale/uploadFile', {
        method: 'post',
        // loading: true,
        body
    }).then((res: any) => {
        getOrderList(false, true)
    })
}

// 去提交订单
const toSubmitOrder = (row: any) => {
    // if (!state.selectOrder?.length) {
    //     ElMessage.error(t('orderPage.pleaseSelectAnOrder'))
    //     return
    // }
    navigateTo('/pay')
    useSelectOrder().value.orders = [row]
    setLocal('useSelectOrder')
}

// 去付款
const toPay = (row: Record<string, any>) => {
    // if (!state.selectOrder?.length) {
    //     showToast(t('orderPage.pleaseSelectAnOrder'))
    //     return
    // }
    // navigateTo('/pay')
    useSelectOrder().value.orders = [row]
    // setLocal('useSelectOrder')
    
    useSelectOrder().value.orders = [row]
    const ids = useSelectOrder().value?.orders.map((v: any) => v.id) || []
    $http(`/purchase/sale/createOrder`, {
        method: 'post',
        loading: true,
        body: { ids }
    }).then((res: any) => {
        // useSelectOrder()
        // for (let key in state.form) {
        //     useSelectOrder().value[key] = state.form[key]
        // }
        // useSelectOrder().value.addressId = state.form.addressId

        // 接口返回
        useSelectOrder().value.orderId = res.data.orderId
        useSelectOrder().value.price = res.data.price
        useSelectOrder().value.totalPrice = res.data.totalPrice
        useSelectOrder().value.freight = res.data.freight
        useSelectOrder().value.freightTax = res.data.freightTax
        useSelectOrder().value.proveList = res.data.proveList || []

        setLocal('useSelectOrder')
        navigateTo('/pay-result')
    })
}

onMounted(() => {
    if (route.query?.msg) {
        showConfirmDialog({
            // `确定删除 ${row.code} 订单吗？`,
            message: route.query.msg as string,
            title: t('systemPrompt'),
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: t('confirm'),
            cancelButtonText: t('cancel'),
        }).then(() => {
            navigateTo(useRoute().path)
        }).catch(() => {
            navigateTo(useRoute().path)
        })
    }
    getOrderList()
    removeLocal('useSelectOrder')
})
</script>

<style lang="scss" scoped>
.orders {
    :deep(.primary-badge) {
        .van-badge__wrapper {
            .van-badge {
                background: var(--el-color-primary);
            }
        }
    }
    .order-item {
        border-radius: 6px;
        margin: 0 10px 10px;
        padding: 10px;
        box-shadow: 0 0 5px 0 rgba(78,122,194,.2);

        .order-item-row {
            margin-bottom: 5px;
            font-size: 14px;
            color: #323232;

            &.head {
                font-size: 16px;
                color: #000000;
                margin-bottom: 10px;
                .order-item-col {
                    width: auto;
                    text-align: right;
                }
            }

            .order-item-col {
                flex: none;
                width: 50%;
                text-align: left;

                .file-downlod {
                    flex: 1;
                    overflow: hidden;
                }
            }
        }

        .table-detail-wait {
            margin-bottom: 5px;
            font-size: 14px;
            color: #999;

            &.red {
                color: var(--van-red);
            }
        }

        .order-btn {
            margin: 10px 5px 0 0;
        }
    }
}

.table-tag {
    max-width: 104px;
    // min-height: 25px;
    text-align: center;
}
</style>