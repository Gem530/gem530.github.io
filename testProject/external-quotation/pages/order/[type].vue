<template>
    <div class="order table-page">
        <el-card class="table-card">
            <template #header>
                <div class="card-header-title">{{$t('orderPage.myOrder')}}</div>
            </template>
            <div class="order-title">
                <el-form :inline="true" :model="state.form" class="demo-form-inline">
                    <el-form-item :label="$t('orderPage.orderDate')">
                        <el-date-picker
                            clearable
                            type="daterange"
                            value-format="YYYY-MM-DD"
                            v-model="state.form.dateArr"
                            :end-placeholder="$t('orderPage.endDate')"
                            :start-placeholder="$t('orderPage.startDate')"
                        />
                    </el-form-item>

                    <el-form-item :label="$t('orderPage.orderNumber')">
                        <el-input type="text" v-model="state.form.code" :placeholder="$t('orderPage.orderNumber')"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('orderPage.makeFile')">
                        <el-input type="text" v-model="state.form.file" :placeholder="$t('orderPage.makeFile')"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">{{$t('orderPage.query')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="tab-overflow">
                <el-tabs
                    type="card"
                    class="tab-boxs"
                    :model-value="state.form.type"
                    @tab-click="handleClick"
                >
                    <el-tab-pane :label="$t('orderPage.allOrders')" :name="0"></el-tab-pane>
                    <el-tab-pane :name="9">
                        <template #label>
                            <el-badge class="mark" type="primary" :value="state.orderNum['9']">{{$t('orderPage.Tobesubmitted')}}</el-badge>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane :name="1">
                        <template #label>
                            <el-badge class="mark" :value="state.orderNum['1']">{{$t('orderPage.pendingPayment')}}</el-badge>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane :name="2">
                        <template #label>
                            <el-badge class="mark" type="primary" :value="state.orderNum['2']">{{$t('orderPage.inProduction')}}</el-badge>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane :name="4">
                        <template #label>
                            <el-badge class="mark" type="primary" :value="state.orderNum['4']">{{$t('orderPage.shipped')}}</el-badge>
                        </template>
                    </el-tab-pane>
                    <!-- <el-tab-pane :name="5">
                        <template #label>
                            <el-badge class="mark" type="primary" :value="state.orderNum['5']">{{$t('orderPage.toBeEvaluated')}}</el-badge>
                        </template>
                    </el-tab-pane> -->
                </el-tabs>
            </div>

            <!-- border -->
            <el-table
                ref="tableRef"
                key="orderTable"
                scrollbar-always-on
                :data="state.tableData"
                :cell-style="tableBorder"
                :header-cell-style="tableBorder"
                style="width: 100%;height: 100%;"
                @selection-change="selectionChange">
                <el-table-column key="selection" type="selection" align="center" :selectable="selectable" v-if="[1].includes(state.form.type)"/>
                <el-table-column key="selection" type="selection" align="center" v-if="[9].includes(state.form.type)"/>
                <el-table-column key="index" type="index" :label="$t('orderPage.number')" align="center" min-width="78"/>
                <el-table-column key="status" prop="status" :label="$t('orderPage.OrderStatus')" align="center" v-if="![3, 4].includes(state.form.type)" min-width="130">
                    <template #="{ row }">
                        <el-tag :type="returnColor(row.status)" :class="`table-tag ${useLang().value == 'ru_RU' && 'min40'}`" v-if="row.status == 1 && row.reviewFlag == 1">{{$t('orderPage.paymentPendingReview')}}</el-tag>
                        <el-tag :type="returnColor(row.status)" :class="`table-tag ${useLang().value == 'ru_RU' && 'min40'}`" v-else>{{ row.status && $t(orderStatusText[row.status]) }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column key="detail" prop="detail" :label="$t('orderPage.OrderDetails')" align="center" min-width="365">
                    <template #="{ row }">
                        <div class="table-detail">
                            <div class="detail-product-img-box flex">
                                <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/test.jpg" alt="" class="detail-product-img">
                                <el-tag class="detail-product-pcba" effect="dark" size="small" type="danger" v-if="row.pcbA == '1'">PCBA</el-tag>
                                <el-tag class="detail-product-pcba" effect="dark" size="small" type="danger" v-if="row.smt == '1'">SMT</el-tag>
                            </div>
                            <div class="table-detail-info">
                                <div class="table-detail-flex">
                                    <template v-if="row.status == 1">
                                        <div class="table-detail-wait text-left" v-if="row.reviewFlag == 1">{{$t('orderPage.ourCompanyWillContact')}}</div>
                                    </template>
                                    <template v-else>
                                        <div class="table-detail-wait text-left" v-if="['1'].includes(row.payStatus)">{{$t(orderPayStatusText[row.payStatus])}}</div>
                                        <div class="table-detail-wait text-left red" v-if="['3'].includes(row.payStatus)">{{$t(orderPayStatusText[row.payStatus])}}</div>
                                    </template>
                                </div>
                                <div class="table-detail-flex">
                                    <div class="table-detail-code">{{$t('orderPage.orderNumber')}}: {{ row.code }}</div>
                                </div>
                                <template v-if="row.singleSmt == '1'">
                                    <div class="table-detail-flex">{{$t('orderPage.framework')}}: {{ row.framework }}</div>
                                    <div class="table-detail-flex">{{$t('orderPage.stencilSide')}}: {{ row.stencilSide }}</div>
                                </template>
                                <template v-else>
                                    <div class="table-detail-flex">{{$t('orderPage.boardCategory')}}: {{ row.boardCategory }}</div>
                                    <div class="table-detail-flex">{{$t('orderPage.ProductionTime')}}: {{ row.delivery }}</div>
                                    <div class="table-detail-flex">
                                        {{$t('orderPage.NumberOfLayers')}}: {{ row.boardLayers }}
                                    </div>
                                    <div class="table-detail-flex">
                                        {{$t('orderPage.PlateThickness')}}: {{ row.boardThickness }}
                                    </div>
                                </template>
                                <div class="unline-blue pointer" @click="openDialog(1, row)">{{$t('orderPage.OrderDetails')}}...</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column key="length" prop="length" :label="$t('orderPage.OrderSize')" align="center" min-width="160">
                    <template #="{ row }">
                        <template v-if="row.singleSmt == '1'">
                           {{ row.dimensionsStr }}
                        </template>
                        <template v-else>
                            <span v-if="row?.length">{{ row.length }}{{row.unit}}</span>
                            <span v-if="row?.length && row?.width"> * </span>
                            <span v-if="row?.width">{{ row.width }}{{row.unit}}</span>
                        </template>
                    </template>
                </el-table-column>

                <el-table-column key="boardQuantity" prop="boardQuantity" :label="$t('orderPage.OrderQuantity')" align="center">
                    <template #="{ row }">
                        <template v-if="row.singleSmt == '1'">
                            <span>{{ row?.stencilQty }}</span>
                        </template>
                        <template v-else>
                            <span>{{ row?.boardQuantity }}PCS</span>
                        </template>
                    </template>
                </el-table-column>

                <el-table-column key="total" prop="total" :label="$t('orderPage.OrderAmount')" align="center" min-width="100px" >
                    <template #="{ row }">
                        <span v-if="row?.total">{{useCurrencyInfo().value?.value}}{{ priceFormat(row.total || 0) }}</span>
                    </template>
                </el-table-column>

                <el-table-column key="fileName" prop="fileName" :label="$t('orderPage.makeFile')" align="center" min-width="120px" >
                    <template #="{ row }">
                        <template v-if="row?.fileName && row.fileKey">
                            <div class="text-left">{{row.singleSmt == '1' ? 'SMT' : 'PCB'}}:</div>
                            <div class="file-downlod unline-blue pointer text-left overflow-omit"
                                :title="row.fileName"
                                @click="downloadFile((row.fileKey as string))"
                            >{{ row.fileName }}</div>
                        </template>
                        <template v-else>
                            <XUpload v-model="row.makeFiles" model="download" :show-file-list="false" @file-change="(files: any) => fileChange(files, row)">
                                <div class="file-upload unline-blue pointer">{{$t('orderPage.UploadFiles')}}</div>
                            </XUpload>
                        </template>
                        <template v-if="row?.pcbAFiles?.length">
                            <div class="text-left" style="margin-top: 5px;">PCBA:</div>
                            <div class="file-downlod unline-blue pointer text-left overflow-omit"
                                :title="p.name"
                                @click="downloadFile((p.key as string))"
                                v-for="p in row.pcbAFiles" :key="p.id"
                            >{{ p.name }}</div>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column key="counrtyName" prop="counrtyName" :label="$t('orderPage.shippingAddress')" v-if="[4].includes(state.form.type)" align="center" min-width="100px">
                    <template #="{ row }">
                        {{ `${row.counrtyName||''} ${row.state||''} ${row.city||''} ${row.streetAddress||''} ${row.buildingHouseNo||''}` }}
                    </template>
                </el-table-column>
                <!-- <el-table-column key="progress" prop="progress" label="物流进度" align="center" min-width="200" v-if="[3].includes(state.form.type)">
                    <template #="{ row }">
                        <div class="progress-detail">
                            <div class="progress-detail-item">
                                <div class="progress-text">收货地址:{{ row.address }}</div>
                                <div class="progress-text">快递公司:{{ row.company }}</div>
                                <div class="progress-text">物流进度:
                                    <div class="progress-line">
                                        <div :class="{'progress-line-status':true,'arrival':row.progress==1}">{{ row.progress == 0 ? '已发货' : '已到达' }}</div>
                                        <div class="progress-line-address">{{ row.progressTips }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-detail-item">
                                <div class="progress-text" v-if="row.progress == 1">预计到货:{{ row.arrivalTime }}</div>
                                <div class="unline-blue pointer" @click="openDialog(2, row)">物流详情...</div>
                                <div class="unline-blue pointer" v-if="row.progress != 1" @click="openDialog(3, row)">联系快递员</div>
                            </div>
                        </div>
                    </template>
                </el-table-column> -->
                <el-table-column key="make" prop="make" :label="$t('orderPage.operation')" align="center" v-if="![3].includes(state.form.type)" :min-width="useLang().value == 'ru_RU' ? '215' : '175'">
                    <template #="{ row }">
                        <div class="flex make-box">
                        <el-button type="primary" v-if="row.orderId && ['1','3'].includes(row.payStatus) && ['1'].includes(row.status)" @click="continuePay(row)">{{$t('orderPage.continuePayment')}}</el-button>
                        <el-button type="primary" v-if="row.orderId && ['1'].includes(row.status) && ['1'].includes(row.payStatus)" @click="cancelOrder(row)">{{$t('orderPage.cancelOrder')}}</el-button>
                        <el-button type="primary" v-if="['9'].includes(row.status)" @click="navigateTo(`/online-count?id=${row.id}`)">{{$t('orderPage.edit')}}</el-button>
                        <el-button type="primary" v-if="['1','5','6','9'].includes(row.status)" @click="delOrder(row)">{{$t('orderPage.delete')}}</el-button>
                        <el-button type="primary" @click="openDialog(4, row)">{{$t('orderPage.progressTracking')}}</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <el-pagination
                background
                :total="state.total"
                class="table-pagination"
                :page-sizes="[10, 20, 30, 40, 100]"
                v-model:current-page="state.form.page"
                v-model:page-size="state.form.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
            /> -->

            <template v-if="[1, 9].includes(state.form.type)">
                <div class="shop-car">
                    <div class="shop-car-item">{{$t('orderPage.settleMentOrDer')}}: <strong>{{state.ordersDetail.total}}</strong></div>
                    <div class="shop-grow"></div>
                    <!-- <div class="shop-car-item">{{$t('orderPage.totalOrDerQuantity')}}: {{state.ordersDetail.quantity}}PCS</div> -->
                    <!-- <div class="shop-car-item">折扣金额:<span class="red-amount red-line">$15.00</span></div> -->
                    <div class="shop-car-item">{{$t('orderPage.totalOrDerAMount')}}: <span class="red-amount">{{useCurrencyInfo().value?.value}}{{priceFormat(state.ordersDetail.price)}}</span></div>
                    <el-button type="primary" @click="toPay" v-if="state.form.type == 1">{{$t('orderPage.goMakeThePayMent')}}</el-button>
                    <el-button type="primary" @click="toSubmitOrder" v-if="state.form.type == 9">{{$t('payPage.placeOrder')}}</el-button>
                </div>
                <div class="shop-tip">1. {{$t('orderPage.weWillReviewYour')}}</div>
                <div class="shop-tip">2. {{$t('orderPage.whenTheProDuct')}}</div>
            </template>
        </el-card>

        <el-dialog
            width="900px"
            :title="state.dialogTitle"
            v-model="state.dialogVisible"
            modal-class="order-dialog-more">
            <div class="order-detail" v-if="state.dialogType == 1 && state.currentOrder">
                <el-card shadow="never">
                    <div class="order-detail-title">{{$t('orderPage.findingsOfAuDit')}}: </div>
                    <el-descriptions :column="24" border>
                        <el-descriptions-item :span="24" :label="$t('orderPage.findingsOfAuDit')+':'">
                            <template v-if="['1','3'].includes(state.currentOrder.saleInfoVo.reviewFlag)">
                                <div class="table-detail-wait">{{state.currentOrder.saleInfoVo.reviewFlag && $t(orderReviewStatusText[state.currentOrder.saleInfoVo.reviewFlag])}}</div>
                            </template>
                            <template v-else>
                                <div class="table-detail-wait">{{state.currentOrder.saleInfoVo.reviewFlag && $t(orderPayStatusText[state.currentOrder.saleInfoVo.reviewFlag])}}</div>
                            </template>
                        </el-descriptions-item>
                        <el-descriptions-item :span="24" :label="$t('orderPage.contactCustoMerService')+':'">market@pcbsuper.com</el-descriptions-item>
                    </el-descriptions>

                    <div class="order-detail-title margin-top">{{$t('orderPage.basicInforMation')}}: </div>
                    <div class="order-detail-subtitle">{{$t('orderPage.orderTime')}}: {{state.currentOrder.saleInfoVo?.createTime}}</div>
                    <el-card shadow="never">
                        <div class="order-detail-list flex flex-start">
                            <div class="order-detail-item">{{$t('orderPage.orderNumber')}}: {{ state.currentOrder.saleInfoVo.code }}</div>
                            <div class="order-detail-item">{{$t('orderPage.deliveryTime')}}: {{ state.currentOrder.saleInfoVo.delivery }}</div>
                        </div>
                        <el-collapse v-model="activeNames" :accordion="false">
                            <el-collapse-item :title="$t('orderPage.processInforMation')+':'" name="1" v-if="state.currentOrder.saleInfoVo?.singleSmt != '1'">
                                <div class="order-detail-table" v-if="state.currentOrder && state.currentOrder.saleInfoList">
                                    <template v-for="(item, index) in state.currentOrder.saleInfoList" :key="item.key">
                                        <div class="order-detail-table-label" :class="{'one': (index == state.currentOrder.saleInfoList.length - 1) && (index % 2 == 0)}">{{ state.currentOrder.saleInfoVoName[item.key] }}:</div>
                                        <div class="order-detail-table-value" :class="{'one': (index == state.currentOrder.saleInfoList.length - 1) && (index % 2 == 0)}">{{ item.value }}</div>
                                    </template>
                                    <!-- <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.boardCategory }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.boardCategory }}</div>
                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.boardQuantity }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.boardQuantity }}</div>

                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.boardLayers }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.boardLayers }}</div>
                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.productType }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.productType }}</div>
                                    
                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.panelizationCount }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.panelizationCount }}</div>
                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.shipmentMethod }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.shipmentMethod }}</div>

                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.boardThickness }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.boardThickness }}</div>
                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.solderMaskColor }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.solderMaskColor }}</div>

                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.silkScreenColor }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.silkScreenColor }}</div>
                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.silkScreenColor }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.materialType }}</div>

                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.surfaceFinish }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.surfaceFinish }}</div>
                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.outerCopperThickness }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.outerCopperThickness }}</div>

                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.innerCopperThickness }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.innerCopperThickness }}</div>
                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.impedanceRequired }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.impedanceRequired }}</div>

                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.viaCoverage }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.viaCoverage }}</div>
                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.minHoleOuterDiameter }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.minHoleOuterDiameter }}</div>

                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.boardOutlineTolerance }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.boardOutlineTolerance }}</div>
                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.confirmProductionFiles }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.confirmProductionFiles }}</div>

                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.noCodeOnBoard }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.noCodeOnBoard }}</div>
                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.flyingProbeTest }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.flyingProbeTest }}</div>

                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.goldFingers }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.goldFingers }}</div>
                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.teethHoles }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.teethHoles }}</div>

                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.length }}({{ state.currentOrder.saleInfoVo.unit }}):</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.length }}</div>
                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.width }}({{ state.currentOrder.saleInfoVo.unit }}):</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.width }}</div>

                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.edgePlating }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.edgePlating }}</div>
                                    <div class="order-detail-table-label">{{ state.currentOrder.saleInfoVoName.goldThickness }}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.goldThickness }}</div>

                                    <div class="order-detail-table-label one">{{ state.currentOrder.saleInfoVoName.pcbRemarks }}:</div>
                                    <div class="order-detail-table-value one">{{ state.currentOrder.saleInfoVo.pcbRemarks }}</div>

                                    <div class="order-detail-table-label one">{{ $t('orderPage.orderRemarks') }}:</div>
                                    <div class="order-detail-table-value one">{{ state.currentOrder.saleInfoVo.orderRemark }}</div>

                                    <div class="order-detail-table-label one">{{ $t('orderPage.labelRemarks') }}:</div>
                                    <div class="order-detail-table-value one">{{ state.currentOrder.saleInfoVo.tagRemark }}</div>

                                    <div class="order-detail-table-label">{{$t('orderPage.expressName')}}:</div>
                                    <div class="order-detail-table-value">{{$t('transportationInfo.DHL')}}</div>
                                    <div class="order-detail-table-label">{{$t('orderPage.expressDeliveryFee')}}:</div>
                                    <div class="order-detail-table-value">{{ priceFormat(state.currentOrder.saleInfoVo.freight) }}</div> -->
                                </div>
                            </el-collapse-item>
                            <el-collapse-item :title="'PCBA:'" name="5" v-if="state.currentOrder.saleInfoVo?.pcbA == '1'">
                                <div class="order-detail-table" v-if="state.currentOrder && state.currentOrder.salePcbAInfoList">
                                    <template v-for="(item, index) in state.currentOrder.salePcbAInfoList" :key="item.key">
                                        <div class="order-detail-table-label" :class="{'one': (index == state.currentOrder.salePcbAInfoList.length - 1) && (index % 2 == 0)}">{{ state.currentOrder.saleInfoVoName[item.key] }}:</div>
                                        <div class="order-detail-table-value" :class="{'one': (index == state.currentOrder.salePcbAInfoList.length - 1) && (index % 2 == 0)}">
                                            <template v-if="['attach','pcbAMaterial','pcbAMaterialCpl'].includes(item.key) && item.value?.length">
                                                <div class="unline-blue pointer" @click="downloadFile(item.value[0].key)" v-for="(el) in item.value" :key="el.key">{{ item.value[0].name }}</div>
                                            </template>
                                            <template v-else-if="['assemblySideTop','assemblySideBottom'].includes(item.key) && item.value?.length">
                                                <el-image :src="el.url" style="width: 100px;height: 100px;"
                                                    :zoom-rate="1.2"
                                                    :max-scale="7"
                                                    :min-scale="0.2"
                                                    :preview-src-list="[el.url]"
                                                    :initial-index="4"
                                                    fit="cover"
                                                    v-for="(el) in item.value" :key="el.key"
                                                ></el-image>
                                            </template>
                                            <template v-else>{{ item.value }}</template>
                                        </div>
                                    </template>
                                </div>
                            </el-collapse-item>
                            <el-collapse-item :title="'SMT:'" name="6" v-if="state.currentOrder.saleInfoVo?.smt == '1'">
                                <div class="order-detail-table" v-if="state.currentOrder && state.currentOrder.saleSmtInfoList">
                                    <template v-for="(item, index) in state.currentOrder.saleSmtInfoList" :key="item.key">
                                        <div class="order-detail-table-label" :class="{'one': (index == state.currentOrder.saleSmtInfoList.length - 1) && (index % 2 == 0)}">{{ state.currentOrder.saleInfoVoName[item.key] }}:</div>
                                        <div class="order-detail-table-value" :class="{'one': (index == state.currentOrder.saleSmtInfoList.length - 1) && (index % 2 == 0)}">{{ item.value }}</div>
                                    </template>
                                </div>
                            </el-collapse-item>
                            <el-collapse-item :title="$t('orderPage.personalizeDInforMation')+':'" name="3">
                                <div class="order-detail-table">
                                    <div class="order-detail-table-label">{{$t('orderPage.packagingRequireMents')}}: </div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.packAsk && $t(packAskEnum[state.currentOrder.saleInfoVo.packAsk as '1'|'2']) }}</div>
                                    <div class="order-detail-table-label">{{$t('orderPage.deliveryNote')}}: </div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.deliverOrder && $t(deliverOrderEnum[state.currentOrder.saleInfoVo.deliverOrder as '1'|'2']) }}</div>
                                    
                                    <div class="order-detail-table-label">{{$t('orderPage.manufacturingCycle')}}: </div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.manufacturingCycle && $t(manufacturingCycleEnum[state.currentOrder.saleInfoVo.manufacturingCycle as '1'|'2']) }}</div>
                                    <div class="order-detail-table-label">{{$t('orderPage.shippingNotice')}}: </div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.deliveryCycle && $t(deliveryCycleEnum[state.currentOrder.saleInfoVo.deliveryCycle as '1'|'2']) }}</div>

                                    <div class="order-detail-table-label">{{$t('orderPage.expressName')}}:</div>
                                    <div class="order-detail-table-value">{{$t('transportationInfo.DHL')}}</div>
                                    <div class="order-detail-table-label">{{$t('orderPage.expressDeliveryFee')}}:</div>
                                    <div class="order-detail-table-value">{{ priceFormat(state.currentOrder.saleInfoVo.freight) }}</div>
                                    
                                    <div class="order-detail-table-label one">{{ $t('orderPage.orderRemarks') }}:</div>
                                    <div class="order-detail-table-value one">{{ state.currentOrder.saleInfoVo.orderRemark }}</div>

                                    <div class="order-detail-table-label one">{{ $t('orderPage.labelRemarks') }}:</div>
                                    <div class="order-detail-table-value one">{{ state.currentOrder.saleInfoVo.tagRemark }}</div>
                                </div>
                            </el-collapse-item>
                            <el-collapse-item :title="$t('orderPage.consigneeInformation')+':'" name="4">
                                <div class="order-detail-table">
                                    <div class="order-detail-table-label">{{$t('addressPage.customerType')}}:</div>
                                    <div class="order-detail-table-value">{{ (state.currentOrder.saleInfoVo.customerType != undefined) ? $t(customerTypeEnum[state.currentOrder.saleInfoVo.customerType as '0'|'1']) : '' }}</div>
                                    <div class="order-detail-table-label">{{$t('orderPage.name')}}:</div>
                                    <div class="order-detail-table-value">{{ (state.currentOrder.saleInfoVo.firstName||'') +' '+ (state.currentOrder.saleInfoVo.lastName||'') }}</div>
                                    
                                    <div class="order-detail-table-label">{{$t('addressPage.counrtyRegion')}}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.counrtyName||'' }}</div>
                                    <div class="order-detail-table-label">{{$t('orderPage.address')}}:</div>
                                    <div class="order-detail-table-value">
                                        {{ `${state.currentOrder.saleInfoVo.state||''} ${state.currentOrder.saleInfoVo.city||''} ${state.currentOrder.saleInfoVo.streetAddress||''} ${state.currentOrder.saleInfoVo.buildingHouseNo||''}` }}
                                    </div>

                                    <div class="order-detail-table-label">{{$t('addressPage.postalCode')}}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.postalCode||'' }}</div>
                                    <div class="order-detail-table-label">{{$t('addressPage.cellMobileNumber')}}:</div>
                                    <div class="order-detail-table-value">{{ state.currentOrder.saleInfoVo.userPhone||'' }}</div>
                                </div>
                            </el-collapse-item>
                            <el-collapse-item name="2">
                                <template #title>
                                    <div class="order-detail-total">
                                        {{$t('orderPage.totalPrice')}}: <span>{{ useCurrencyInfo().value?.value }}{{priceFormat(state.currentOrder.totalPrice || 0)}}</span>
                                    </div>
                                </template>
                                <div>{{state.currentOrder?.saleInfoVo?.singleSmt == '1' ? 'SMT' : 'PCB'}}:</div>
                                <div class="order-detail-list flex flex-start">
                                    <div class="order-detail-item bisect" v-for="item in (state.currentOrder.costList || [])" :key="item.key">
                                        {{ item.name }}: {{ useCurrencyInfo().value?.value }}{{ priceFormat(item?.cost||0) }}
                                    </div>
                                    <div class="order-detail-item bisect" v-for="item in (state.currentOrder.smtCostList || [])" :key="item.key">
                                        {{ item.name }}: {{ useCurrencyInfo().value?.value }}{{ priceFormat(item?.cost||0) }}
                                    </div>
                                </div>
                                <template v-if="state.currentOrder.saleInfoVo?.pcbA == '1'">
                                    <div>PCBA:</div>
                                    <div class="order-detail-list flex flex-start">
                                        <div class="order-detail-item bisect" v-for="item in (state.currentOrder.pcbACostList || [])" :key="item.key">
                                            {{ item.name }}: {{ useCurrencyInfo().value?.value }}{{ priceFormat(item?.cost||0) }}
                                        </div>
                                    </div>
                                </template>
                            </el-collapse-item>
                        </el-collapse>
                    </el-card>
                </el-card>
            </div>

            <!-- <div class="progress-detail" v-if="state.dialogType == 2">
                <div class="progress-detail-item">
                    <div class="progress-text">收货地址:{{ state.currentRow.address }}</div>
                    <div class="progress-text">快递公司:{{ state.currentRow.company }}</div>
                    <div class="progress-text">物流进度:
                        <div class="progress-line">
                            <div :class="{'progress-line-status':true,'arrival':state.currentRow.progress==1}">{{ state.currentRow.progress == 0 ? '已发货' : '已到达' }}</div>
                            <div class="progress-line-address">{{ state.currentRow.progressTips }}</div>
                        </div>
                    </div>
                </div>
                <div class="progress-detail-item">
                    <div class="progress-text" v-if="state.currentRow.progress == 1">预计到货:{{ state.currentRow.arrivalTime }}</div>
                </div>
            </div>
            <div  v-if="state.dialogType == 3">快递员:xxx-15533336666</div> -->
            <div class="wip-info" v-if="state.dialogType == 4">
                <el-collapse v-model="activeNames" :accordion="false">
                    <el-collapse-item :title="$t('orderPage.orderProgress')+':'" name="1">
                        <el-steps class="wip-step" :active="state.wipInfo?.recordVoList?.length || 0" align-center>
                            <el-step icon="DocumentAdd" :title="$t('orderPage.ordered')" :description="getCurrentTime(0)"/>
                            <el-step icon="Stamp" :title="$t('orderPage.examine')" :description="getCurrentTime(1)"/>
                            <el-step icon="Wallet" :title="$t('orderPage.payment')" :description="getCurrentTime(2)"/>
                            <el-step icon="DocumentChecked" :title="$t('orderPage.confirm')" :description="getCurrentTime(3)"/>
                            <el-step icon="OfficeBuilding" :title="$t('orderPage.production')" :description="getCurrentTime(4)"/>
                            <el-step icon="Van" :title="$t('orderPage.delivery')" :description="getCurrentTime(5)"/>
                        </el-steps>
                        <el-divider />
                        <div class="order-detail-table">
                            <div class="order-detail-table-label">{{$t('orderPage.confirmTime')}}:</div>
                            <div class="order-detail-table-value unline-blue">{{getCurrentTime((state.wipInfo?.recordVoList?.length || 1) - 1)}}</div>
                            <div class="order-detail-table-label">{{$t('orderPage.estimatedEarliestDeliveryTime')}}:</div>
                            <div class="order-detail-table-value">{{state.wipInfo?.orderSale?.expectExpectTime ? state.wipInfo.orderSale.expectExpectTime.split(' ')[0] : ''}}</div>

                            <!-- <div class="order-detail-table-label one">{{$t('orderPage.shippingAddress')}}:</div>
                            <div class="order-detail-table-value one">
                                {{ `${state.wipInfo?.orderSale?.counrtyRegion||''} ${state.wipInfo?.orderSale?.state||''} ${state.wipInfo?.orderSale?.city||''} ${state.wipInfo?.orderSale?.streetAddress||''} ${state.wipInfo?.orderSale?.buildingHouseNo||''}` }}
                            </div> -->
                        </div>
                    </el-collapse-item>
                    <el-collapse-item :title="$t('orderPage.productionSchedule')+':'" name="2"
                        v-if="state.wipInfo?.orderSale?.status && !['1','9','8'].includes(state.wipInfo?.orderSale?.status)">
                        <div class="wip-schedule flex flex-start">
                            <div class="wip-schedule-left">
                                <div class="wip-schedule-file">
                                    <div class="wip-schedule-file-text">{{ $t('orderPage.makeFile') }}</div>
                                    <div class="wip-schedule-file-name overflow-omit">{{state.wipInfo.orderSale.fileName}}</div>
                                </div>
                                <div class="wip-schedule-number">{{$t('orderPage.orderNumber')}}: {{state.wipInfo.orderSale.code}}</div>
                                <el-timeline>
                                    <el-timeline-item
                                        v-for="(activity, index) in state.wipInfo.miNodeInfos"
                                        size="large"
                                        :key="index"
                                        :color="activity.completeFlag == '1' ? '#67c23a' : ''"
                                        icon="Select"
                                        :timestamp="activity.completeFlag == '1' ? activity.changTime : ''"
                                    >{{ activity.name }}</el-timeline-item>
                                        <!-- :hollow="activity.hollow" -->
                                </el-timeline>
                            </div>
                            <div class="wip-schedule-right">
                                <el-progress type="circle" :stroke-width="20" :percentage="Number(((state.wipInfo.craftCompletion * 100) * 100 / 100).toFixed(0))" />
                            </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item :title="$t('orderPage.transportationProgress')+':'" name="3"
                        v-if="state.wipInfo?.orderSale?.status && !['1','3','2','9','8'].includes(state.wipInfo?.orderSale?.status)">
                        <!-- <div class="order-detail-table">
                            <div class="order-detail-table-label one">{{$t('orderPage.expressCompany')}}:</div>
                            <div class="order-detail-table-value one unline-blue">{{$t('transportationInfo.DHL')}}</div>
                        </div> -->
                        <el-table :data="state.wipInfo?.orderSale ? [state.wipInfo?.orderSale] : []">
                            <el-table-column align="center" :label="$t('orderPage.trackingNumber1')" prop="trackingNumber"></el-table-column>
                            <el-table-column align="center" :label="$t('orderPage.shippingCountry')">{{ $t('addressPage.JiangxiChina') }}</el-table-column>
                            <el-table-column align="center" :label="$t('orderPage.destinationCountry')" prop="counrtyName"></el-table-column>
                            <el-table-column align="center" :label="$t('orderPage.expressCompany')">{{ 'DHL' }}</el-table-column>
                            <el-table-column align="center" :label="$t('orderPage.specificAddress')" prop="state">
                                <template #="{row}">{{ `${row.state||''} ${row.city||''} ${row.streetAddress||''} ${row.buildingHouseNo||''}` }}</template>
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="Order">
const { t } = useI18n()
definePageMeta({ layout: 'custom' })
useHead({ title: () => t('orderManagement') })
const { $loadingStart, $loadingEnd } = useNuxtApp()

const tableRef = ref()
const route = useRoute()
const activeNames = ref(['1', '2', '3', '4', '5', '6'])
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
        '5': 0,
        '9': 0
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

const getCurrentTime = (index: number) => {
    let res = ''
    if ((state.wipInfo?.recordVoList?.length || 0) > index) {
        res = state.wipInfo?.recordVoList[index]?.changTime
    }
    return res
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

const returnColor = (num: string): "" | "success" | "warning" | "info" | "danger" => {
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
            res = 'info'
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
const handleClick = (tab: Record<string, any>) => {
    navigateTo(`/order/${tab.paneName}`)
}

const tableBorder = (({columnIndex}: any) => {
    let res = {}
    if (columnIndex == 0) {
        res = {
            'border-left': '1px solid #ebeef5',
            'border-right': '1px solid #ebeef5'
        }
    } else {
        res = {
            'border-right': '1px solid #ebeef5'
        }
    }
    return res
})

// 获取订单详情
const getOrderDetial = (row: Record<string, any>) => {
    // console.log(body)
    $http(`/purchase/sale/orderInfo/${row.id}`, {
        method: 'get',
        loading: true,
    }).then((res: any) => {
        state.currentOrder = res.data 
    })
}

// 获取进度跟踪
const getProgressTracking = (row: Record<string, any>) => {
    // console.log(body)
    $http(`/purchase/sale/wip/${row.id}`, {
        method: 'get',
        loading: true,
    }).then((res: any) => {
        state.wipInfo = res.data
        // console.log(res)
    })
}

// 打开弹框
const openDialog = (type: number, row: Record<string, any>) => {
    if (type == 1) {
        state.dialogTitle = row.code + ' ' + t('orderPage.OrderDetails')
        state.currentOrder = undefined
        getOrderDetial(row)
    } else if (type == 2) {
        state.dialogTitle = row.code + ' ' + t('orderPage.logisticsDetails')
    } else if (type == 3) {
        state.dialogTitle = row.code + ' ' + t('orderPage.expressDeliveryPersonnel')
    } else if (type == 4) {
        state.dialogTitle = row.code + ' ' + t('orderPage.progressTracking')
        getProgressTracking(row)
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
    ElMessageBox.confirm(
        // `确定取消 ${row.code} 订单吗？`,
        t('areYouSureToCancel', { order: row.code }),
        t('systemPrompt'),
        {
        confirmButtonText: t('confirm'),
        cancelButtonText: t('cancel'),
        type: 'warning',
        }
    ).then(() => {
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
    ElMessageBox.confirm(
        // `确定删除 ${row.code} 订单吗？`,
        t('areYouSureToDelete', { order: row.code }),
        t('systemPrompt'),
        {
        confirmButtonText: t('confirm'),
        cancelButtonText: t('cancel'),
        type: 'warning',
        }
    ).then(() => {
        // console.log(body)
        const ids = [row.id]
        $http(`/purchase/sale/${ids}`, {
            method: 'delete',
            loading: true,
        }).then((res: any) => {
            getOrderList()
            ElMessage({ type: 'success', message: t('deleteSuccessful'), })
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
        nextTick(() => {
            tableRef.value.doLayout()
        })
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
const toSubmitOrder = () => {
    if (!state.selectOrder?.length) {
        ElMessage.error(t('orderPage.pleaseSelectAnOrder'))
        return
    }
    navigateTo('/pay')
    useSelectOrder().value.orders = state.selectOrder
    setLocal('useSelectOrder')
}

// 去付款
const toPay = () => {
    if (!state.selectOrder?.length) {
        ElMessage.error(t('orderPage.pleaseSelectAnOrder'))
        return
    }
    // navigateTo('/pay')
    // setLocal('useSelectOrder')
    
    useSelectOrder().value.orders = state.selectOrder
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
        ElMessageBox.confirm(
            route.query.msg as string,
            t('systemPrompt'),
            {
            confirmButtonText: t('confirm'),
            cancelButtonText: t('cancel'),
            type: 'warning',
            closeOnClickModal: false
            }
        ).then(() => {
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
.order {
    .table-pagination {
        width: 100%;
        justify-content: flex-end;
        margin-top: 20px;
    }

    // :deep(.el-table) {
    //     .el-table__body-wrapper {
    //         .cell {
    //             height: 102px !important;
    //         }
    //     }
    // }

    .table-detail {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .detail-product-img-box {
            position: relative;
            .detail-product-pcba {
                position: absolute;
                top: 0;
                right: 10px;
            }

            .detail-product-img {
                width: 100px;
                margin-right: 10px;
            }
        }

        .table-detail-info {
            flex: 1;
            .table-detail-flex {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                flex-wrap: wrap;
                margin-bottom: 5px;
                text-align: left;

                span {
                    flex: none;
                    width: 50%;
                    text-align: left;
                }

                .table-detail-code {
                    white-space: nowrap;
                }

                .table-detail-wait {
                    font-size: 12px;
                    color: #999;

                    &.red {
                        color: #f56c6c;
                    }
                }
            }
        }
    }
    
    .make-box {
        flex-wrap: wrap;
        .el-button {
            margin: 0 10px 10px 0;
        }
    }

    .progress-detail {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        text-align: left;
        overflow: hidden;

        .progress-detail-item {
            flex: 1;
            &:first-child { flex: 2; }

            .progress-text {
                margin-bottom: 5px;

                .progress-line {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    margin-top: -3px;

                    .progress-line-status {
                        color: var(--el-color-danger);
                        margin-right: 5px;

                        &.arrival {
                            color: var(--el-color-success);
                        }
                    }
                }
            }
        }
    }
    
    .shop-car {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 100px;
        margin: 30px 0 15px;

        .shop-car-item {
            font-size: 14px;
            margin-right: 20px;

            .red-line {
                text-decoration: line-through;
            }
            .red-amount {
                font-size: 16px;
                color: red;
            }
        }

        .shop-grow {
            flex-grow: 1;
        }
    }

    .shop-tip {
        margin-bottom: 5px;
        font-size: 14px;
    }
}
</style>
<style lang="scss">
.order-dialog-more {
    .el-dialog__body {
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .order-detail {
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
            .order-detail-item {
                margin-right: 10px;
                font-size: 12px;
                &.bisect {
                    flex: none;
                    width: 20%;
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
    }

    .wip-info {
        .wip-step {
            // .is-flex {
            //     .el-step__head {
            //         &::after {
            //             display: none;
            //         }
            //     }
            // }
            .el-step {
                &:last-child {
                    .el-step__head::after {
                        display: none;
                    }
                }
            }
            .el-step__head {
                &::after {
                    content: "";
                    position: absolute;
                    top: 50%;
                    right: 0;
                    transform: translate(-50%, -50%) rotate(45deg);
                    width: 12px;
                    height: 12px;
                    border: 3px solid #a8abb2;
                    border-left: none;
                    border-bottom: none;
                    border-radius: 3px;
                }
            }
            .is-process {
                color: #67c23a;
            }
            .el-step__line {
                display: none;
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
}

.tab-overflow {
    flex: none !important;
    width: 100%;
    height: 50px;
    // margin-bottom: 15px;
    overflow-x: scroll;
    overflow-y: hidden;
    &::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
}

.table-tag {
    max-width: 104px !important;
    min-height: 27px !important;
    word-break: normal;
    white-space: wrap;

    &.min40 {
        min-height: 40px !important;
    }
}

.tab-boxs {
    // width: 605px !important;
    .el-tabs__nav-wrap {
        overflow-x: auto;
        padding: 0 !important;

        .el-tabs__nav-prev,
        .el-tabs__nav-next {
            display: none;
        }

        .el-tabs__nav-scroll {
            overflow-x: auto;
            &::-webkit-scrollbar {
                width: 0;
                height: 0;
            }

            .el-tabs__nav {
                transform: translate(0,0) !important;
            }
        }

    }
}
</style>