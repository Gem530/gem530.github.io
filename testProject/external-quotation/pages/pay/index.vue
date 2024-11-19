<template>
    <div class="pay main-width">
        <el-card class="pay-card">
            <template #header>
                <div class="pay-header">
                    <div class="pay-header-title">{{$t('payPage.placeOrder')}}</div>
                </div>
            </template>
            <el-form ref="formRef" label-width="180px" :model="state.form" :rules="state.rules">
                <div class="form-header">{{$t('payPage.orderInformation')}}</div>
                
                <el-table
                    border
                    ref="tableRef"
                    key="orderTable"
                    :data="useSelectOrder().value?.orders || []"
                    style="width: 100%;height: 100%;margin-bottom: 20px;">
                    <el-table-column key="index" type="index" :label="$t('orderPage.number')" align="center" width="78"/>
                    <el-table-column key="detail" prop="detail" :label="$t('orderPage.OrderDetails')" align="center" min-width="365">
                        <template #="{ row }">
                            <div class="table-detail">
                                <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/test.jpg" alt="" class="detail-product-img">
                                <div class="table-detail-info">
                                    <div class="table-detail-flex">
                                        <div class="table-detail-code">{{$t('orderPage.orderNumber')}}: {{ row.code }}</div>
                                        <template v-if="row.status == 1">
                                            <div class="table-detail-wait text-right" v-if="row.reviewFlag == 1">{{$t('orderPage.ourCompanyWillContact')}}</div>
                                        </template>
                                        <template v-else>
                                            <div class="table-detail-wait text-right" v-if="['1'].includes(row.payStatus)">{{$t(orderPayStatusText[row.payStatus])}}</div>
                                            <div class="table-detail-wait text-right red" v-if="['3'].includes(row.payStatus)">{{$t(orderPayStatusText[row.payStatus])}}</div>
                                        </template>
                                    </div>
                                    <template v-if="row.singleSmt == '1'">
                                        <div class="table-detail-flex">{{$t('orderPage.framework')}}: {{ row.framework }}</div>
                                        <div class="table-detail-flex">{{$t('orderPage.stencilSide')}}: {{ row.stencilSide }}</div>
                                    </template>
                                    <template v-else>
                                        <div class="table-detail-flex">{{$t('orderPage.ProductionTime')}}: {{ row.delivery }}</div>
                                        <div class="table-detail-flex">
                                            <span>{{$t('orderPage.NumberOfLayers')}}: {{ row.boardLayers }}</span>
                                            <span>{{$t('orderPage.PlateThickness')}}: {{ row.boardThickness }}</span>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column key="boardCategory" prop="boardCategory" :label="$t('payPage.productCategory')" align="center">
                        <template #="{ row }">
                            {{ row.boardCategory }}
                        </template>
                    </el-table-column>
                    <el-table-column key="fileName" prop="fileName" :label="$t('payPage.pCBProductionFiles')" align="center" min-width="90px">
                        <template #="{ row }">
                            <span class="unline-blue" @click="downloadFile((row.fileKey as string))">{{ row.fileName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column key="boardQuantity" prop="boardQuantity" :label="$t('orderPage.OrderQuantity')" align="center">
                        <template #="{ row }">
                            <!-- <span>{{ row?.boardQuantity || 0 }}PCS</span> -->
                            <template v-if="row.singleSmt == '1'">
                                <span>{{ row?.stencilQty || 0 }}</span>
                            </template>
                            <template v-else>
                                <span>{{ row?.boardQuantity || 0 }}PCS</span>
                            </template>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column key="delivery" prop="delivery" :label="$t('orderPage.deliveryTime')" align="center" v-if="useSelectOrder().value?.orders[0]?.singleSmt != '1'">
                        <template #="{ row }">
                            <span v-if="row?.delivery">{{ row.delivery }}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column key="total" prop="total" :label="$t('payPage.boardMakingOriginalPrice')" align="center" min-width="90px">
                        <template #="{ row }">
                            <span>{{useCurrencyInfo().value?.value}}{{ priceFormat(row.total) }}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column key="expectExpectTime" prop="expectExpectTime" :label="$t('orderPage.estimatedEarliestDeliveryTime')" align="center">
                    </el-table-column> -->
                </el-table>
                <el-form-item :label="$t('orderPage.orderRemarks')+':'" prop="orderRemark" label-width="110px">
                    <el-input class="input-width" type="textarea" v-model="state.form.orderRemark" :placeholder="$t('payPage.theDefaultCopperLaying')" show-word-limit maxlength="200"></el-input>
                    <div class="form-input-fill"></div>
                    <div class="orange-tips">* {{$t('payPage.pleaseDoNotFill')}}</div>
                </el-form-item>
                <el-form-item :label="$t('orderPage.labelRemarks')+':'" prop="tagRemark" label-width="110px">
                    <el-input class="input-width" type="text" v-model="state.form.tagRemark" :placeholder="$t('payPage.dueToTagContent')"></el-input>
                    <div class="form-input-fill"></div>
                    <div class="orange-tips">* {{$t('payPage.notFillInTheBoard')}}</div>
                </el-form-item>

                <div class="form-header">
                    <div>{{$t('orderPage.consigneeInformation')}}</div>
                    <div class="flex-grow"></div>
                    <div class="small-font pointer hover-blue" @click="addressDialogRef.openDiaLog(1)">+ {{$t('addressPage.addShippingAddress')}}</div>
                </div>
                <el-table scrollbar-always-on :data="state.receiverTable" border ref="receiverRef" style="height: 100%;">
                    <el-table-column align="center" width="60px">
                        <template #="{row}">
                            <el-checkbox class="transform-radio" v-model="row.isChecked" @change="changeRadio(row, 'receiver')"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="$t('addressPage.customerType')" prop="customerType" width="130">
                        <template #="{row}">{{ (row.customerType+'') && $t(customerTypeEnum[row.customerType as '0'|'1']) }}</template>
                    </el-table-column>
                    <el-table-column align="center" :label="$t('addressPage.firstName')" prop="firstName" width="100"></el-table-column>
                    <el-table-column align="center" :label="$t('addressPage.lastName')" prop="lastName" width="100"></el-table-column>
                    <el-table-column align="center" :label="$t('addressPage.counrtyRegion')" prop="counrtyName" width="130"></el-table-column>
                    <el-table-column align="center" :label="$t('addressPage.state')" prop="state" width="95"></el-table-column>
                    <el-table-column align="center" :label="$t('addressPage.city')" prop="city" width="95"></el-table-column>
                    <el-table-column align="center" :label="$t('addressPage.streetAddress')" prop="streetAddress" width="130"></el-table-column>
                    <el-table-column align="center" :label="$t('addressPage.buildingHouseNo')" prop="buildingHouseNo" width="155"></el-table-column>
                    <el-table-column align="center" :label="$t('addressPage.postalCode')" prop="postalCode" width="110"></el-table-column>
                    <el-table-column align="center" :label="$t('addressPage.cellMobileNumber')" prop="userPhone" width="155"></el-table-column>
                    <el-table-column align="center" :label="$t('addressPage.isDefault')" prop="isDefault" width="90">
                        <template #="{row}">{{ row.isDefault && $t(yesOrNo[row.isDefault as '0'|'1']) }}</template>
                    </el-table-column>
                </el-table>
                <!-- <el-button icon="Plus" @click="openDiaLog(1)">新增收货地址</el-button> -->

                <!-- <div class="form-header">
                    <div>下单人信息</div>
                    <div class="flex-grow"></div>
                    <div class="small-font" @click="openDiaLog(2)">+新增下单人</div>
                </div>
                <el-table scrollbar-always-on :data="state.orderingInfoTable" border ref="orderingInfoRef">
                    <el-table-column align="center" width="60px">
                        <template #="{row}">
                            <el-checkbox class="transform-radio" v-model="row.isChecked" @change="changeRadio(row, 'orderingInfo')"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="下单人" prop="orderName"></el-table-column>
                    <el-table-column align="center" label="下单人电话" prop="orderPhone"></el-table-column>
                </el-table>
                <el-button icon="Plus" @click="openDiaLog(2)">新增下单人</el-button> -->

                <div class="form-header">
                    <div>{{$t('payPage.engineeringEQ')}}</div>
                    <el-tooltip :content="$t('payPage.engineeringEQ')">
                        <el-icon style="margin: 0 20px 0 10px;" color="#999999"><QuestionFilled /></el-icon>
                    </el-tooltip>
                    <el-radio-group v-model="state.form.eqConfirm" style="margin-left: 15px;">
                        <!-- <el-radio label="2">平台推送</el-radio> -->
                        <el-radio label="1">{{$t('payPage.sendingEmails')}}</el-radio>
                    </el-radio-group>
                    <!-- <el-checkbox class="transform-radio" :model-value="true">发送邮件</el-checkbox> -->
                </div>

                <div class="form-header">{{$t('payPage.chooseExpressDelivery')}}</div>
                <el-table scrollbar-always-on :data="state.fastMailTable" border ref="fastMailRef">
                    <!-- <el-table-column align="center" width="60px">
                        <template #="{row}">
                            <el-checkbox class="transform-radio" v-model="row.isChecked" @change="changeRadio(row, 'fastMail')"></el-checkbox>
                        </template>
                    </el-table-column> -->
                    <el-table-column align="center" :label="$t('payPage.paymentByExpressDelivery')" prop="send"></el-table-column>
                    <el-table-column align="center" :label="$t('orderPage.expressName')" prop="name"></el-table-column>
                    <el-table-column align="center" :label="$t('orderPage.expressDeliveryFee')" prop="price">
                        <template #="{row}">{{ row.price() }}</template>
                    </el-table-column>
                    <!-- <el-table-column align="center" label="预计送货时间" prop="time"></el-table-column> -->
                </el-table>
                <!-- <el-table scrollbar-always-on :data="state.fastMailTable" border ref="fastMail1Ref">
                    <el-table-column align="center" width="60px">
                        <template #="{row}">
                            <el-checkbox class="transform-radio" v-model="row.isChecked" @change="changeRadio(row, 'fastMail')"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="到付快递" prop="send"></el-table-column>
                    <el-table-column align="center" label="快递名称" prop="name"></el-table-column>
                    <el-table-column align="center" label="快递费" prop="price"></el-table-column>
                    <el-table-column align="center" label="预计送货时间" prop="time"></el-table-column>
                </el-table> -->

                <!-- <div class="form-header">
                    <div>发票信息</div>
                    <el-alert show-icon title="每张订单只能申请一次发票，请仔细核对发票信息" type="warning" :closable="false" class="form-header-tips"/>
                    <div class="flex-grow"></div>
                    <div class="small-font" @click="openDiaLog(3)">+新增发票信息</div>
                </div>
                <el-form-item label-width="0px">
                    <el-radio-group v-model="state.form.openBill" class="ml-4">
                        <el-radio label="1" border>不开发票</el-radio>
                        <el-radio label="2" border class="info-tips">
                            普票
                            <el-tooltip placement="top">
                                <template #content>
                                    <p>电子普通发票温馨提示：</p>
                                    <p>·填写的开票信息需与贵司税务信息一致，避免因开票信息错误给贵司带来损失</p>
                                    <p>·普通(电子)发票需按实际订单支付金额开具(含补差价金额);优惠券减免、积分抵扣、活动折扣、赠送等金额不开具发票 </p>
                                    <p>·普通(电子)发票在签收7天后或确认订单后系统自动开票，不随着电路板订单一起发货</p>
                                    <p>·订单开票金额最低10元，低于10元无法开票可联系您的专属客户经理</p>
                                </template>
                                <el-icon class="rigth-top" style="margin: 0 20px 0 10px;" color="#999999"><QuestionFilled /></el-icon>
                            </el-tooltip>
                        </el-radio>
                        <el-radio label="3" border class="info-tips">
                            增票
                            <el-tooltip placement="top">
                                <template #content>
                                    <p>增值税发票温馨提示</p>
                                    <p>·填写的开票信息需与贵司税务信息一致，避免因开票信息错误给贵司带来损失</p>
                                    <p>·增值税专用发票需按实际订单支付金额开具(含补差价金额);优惠券减免、积分抵扣、活动折扣、赠送等金额不开具发票</p>
                                    <p>·增值税专用发票是单独寄出，不随着电路板订单一起发货</p>
                                    <p>·订单开票金额累计在2000元及以上，发票快递费由本司承担--顺丰寄付</p>
                                </template>
                                <el-icon class="rigth-top" style="margin: 0 20px 0 10px;" color="#999999"><QuestionFilled /></el-icon>
                            </el-tooltip>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-table scrollbar-always-on :data="state.invoiceTable" border ref="invoiceRef"
                    v-if="state.form.openBill && state.form.openBill != 1">
                    <el-table-column align="center" width="60px">
                        <template #="{row}">
                            <el-checkbox class="transform-radio" v-model="row.isChecked" @change="changeRadio(row, 'invoice')"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="发票类型" prop="invoiceType"></el-table-column>
                    <el-table-column align="center" label="抬头类型" prop="headType"></el-table-column>
                    <el-table-column align="center" label="发票抬头" prop="invoiceHead"></el-table-column>
                    <el-table-column align="center" label="纳税人识别号" prop="invoiceCode"></el-table-column>
                    <el-table-column align="center" label="地址" prop="invoiceAddress"></el-table-column>
                    <el-table-column align="center" label="电话" prop="invoicePhone"></el-table-column>
                    <el-table-column align="center" label="开户行" prop="invoiceBank"></el-table-column>
                    <el-table-column align="center" label="银行账号" prop="invoiceAccount"></el-table-column>
                </el-table>
                <el-button icon="Plus" @click="openDiaLog(3)" v-if="state.form.openBill && state.form.openBill != 1">新增发票信息</el-button> -->

                <div class="form-header">{{$t('orderPage.personalizeDInforMation')}}</div>
                <el-form-item :label="$t('orderPage.packagingRequireMents')+':'" prop="packAsk">
                    <el-radio-group v-model="state.form.packAsk" class="ml-4">
                        <el-radio label="1" border>{{$t(packAskEnum['1'])}}</el-radio>
                        <el-radio label="2" border>{{$t(packAskEnum['2'])}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('orderPage.deliveryNote')+':'" prop="deliverOrder">
                    <el-radio-group v-model="state.form.deliverOrder" class="ml-4">
                        <el-radio label="1" border>{{$t(deliverOrderEnum['1'])}}</el-radio>
                        <el-radio label="2" border>{{$t(deliverOrderEnum['2'])}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('orderPage.manufacturingCycle')+':'" prop="manufacturingCycle">
                    <el-radio-group v-model="state.form.manufacturingCycle" class="ml-4">
                        <el-radio label="1" border>{{$t(manufacturingCycleEnum['1'])}}</el-radio>
                        <el-radio label="2" border>{{$t(manufacturingCycleEnum['2'])}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <el-form-item label="审核通知：" prop="auditNotification">
                    <el-radio-group v-model="state.form.auditNotification" class="ml-4">
                        <el-radio label="1" border>无需</el-radio>
                        <el-radio label="2" border>需要</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <el-form-item :label="$t('orderPage.shippingNotice')+':'" prop="deliveryCycle">
                    <el-radio-group v-model="state.form.deliveryCycle" class="ml-4">
                        <el-radio label="1" border>{{$t(deliveryCycleEnum['1'])}}</el-radio>
                        <el-radio label="2" border>{{$t(deliveryCycleEnum['2'])}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <div class="flex-end">
                    <div class="flex-end-item">{{$t('payPage.PCBprice')}}</div>
                    <div class="flex-end-value">{{ useCurrencyInfo().value?.value }}{{ priceFormat(state.form.price) }}</div>
                </div>

                <!-- <div class="flex-end">
                    <div class="flex-end-item">{{$t('orderPage.expressDeliveryFee')}}</div>
                    <div class="flex-end-value">{{ useCurrencyInfo().value?.value }}{{ priceFormat(state.form.freight) }}</div>
                </div> -->

                <!-- <div class="flex-end">
                    <div class="flex-end-item">活动折扣</div>
                    <div class="flex-end-value">$5.00</div>
                </div> -->

                <div class="flex-end large">
                    <div class="flex-end-item">{{$t('payPage.totalPrice')}}</div>
                    <div class="flex-end-value">{{ useCurrencyInfo().value?.value }}{{ priceFormat(state.form.totalPrice) }}</div>
                </div>

                <div class="flex-end">
                    <el-button type="primary" class="order-btn" @click="submitHandle">{{$t('payPage.placeOrder')}}</el-button>
                </div>
            </el-form>
        </el-card>

        <address-dialog ref="addressDialogRef" :isDefault="!state.receiverTable?.length" @confirm="getAddressList"></address-dialog>
        <!-- <el-dialog
            width="50%"
            :title="state.dialogTitle"
            v-model="state.dialogVisible"
        >
            <el-form ref="dialogFormRef" label-width="120px" :model="state.dialogForm" :rules="state.dialogRules">

                <template v-if="state.dialogType == 2">
                    <el-form-item label="下单人：" prop="orderName">
                        <el-input type="text" v-model="state.dialogForm.orderName" placeholder="请输入下单人名称"></el-input>
                    </el-form-item>
                    <el-form-item label="下单人电话：" prop="orderPhone">
                        <el-input type="text" v-model="state.dialogForm.orderPhone" placeholder="请输入下单人电话"></el-input>
                    </el-form-item>
                </template>

                <template v-if="state.dialogType == 3">
                    <el-form-item label="发票类型：" prop="invoiceType">
                        <el-radio-group v-model="state.dialogForm.invoiceType" class="ml-4">
                            <el-radio label="1" border>增值税发票</el-radio>
                            <el-radio label="2" border>电子普通发票</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="抬头类型：" prop="headType" v-if="state.dialogForm.invoiceType == 2">
                        <el-radio-group v-model="state.dialogForm.headType" class="ml-4">
                            <el-radio label="1" border>公司</el-radio>
                            <el-radio label="2" border>个人/政府</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="发票抬头：" prop="invoiceHead">
                        <el-input type="text" v-model="state.dialogForm.invoiceHead" placeholder="请输入发票抬头"></el-input>
                    </el-form-item>
                    <el-form-item label="纳税人识别号：" prop="invoiceCode">
                        <el-input type="text" v-model="state.dialogForm.invoiceCode" placeholder="请输入纳税人识别号"></el-input>
                    </el-form-item>
                    <el-form-item label="地址：" prop="invoiceAddress">
                        <el-input type="text" v-model="state.dialogForm.invoiceAddress" placeholder="请输入地址"></el-input>
                    </el-form-item>
                    <el-form-item label="电话：" prop="invoicePhone">
                        <el-input type="text" v-model="state.dialogForm.invoicePhone" placeholder="请输入电话"></el-input>
                    </el-form-item>
                    <el-form-item label="开户行：" prop="invoiceBank">
                        <el-input type="text" v-model="state.dialogForm.invoiceBank" placeholder="请输入开户行"></el-input>
                    </el-form-item>
                    <el-form-item label="银行账号：" prop="invoiceAccount">
                        <el-input type="text" v-model="state.dialogForm.invoiceAccount" placeholder="请输入银行账号"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancelHandle">取消</el-button>
                    <el-button type="primary" @click="confirmHandle">确认</el-button>
                </span>
            </template>
        </el-dialog> -->
    </div>
</template>

<script setup lang="ts" name="Pay">
const { t } = useI18n()
definePageMeta({ layout: 'empty' })
useHead({ title: () => t('payPage.placeOrder') })

const validateText = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback()
  } else {
    if (validNumber(value) && value.toString().length > 15) {
        callback(new Error(t('payPage.theNumber')))
    } else if (!validNumber(value) && value.toString().length > 10) {
        callback(new Error(t('payPage.theText')))
    }
    callback()
  }
}


const formRef = ref()
const invoiceRef = ref()
const receiverRef = ref()
const fastMailRef = ref()
const fastMail1Ref = ref()
const dialogFormRef = ref()
const orderingInfoRef = ref()
const addressDialogRef = ref()
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
        // getName: [{ required: true, message: '请输入收货人名称', trigger: 'blur' }],
        // getPhone: [{ required: true, message: '请输入收货人电话', trigger: 'blur' }],
        // address: [{ required: true, message: '请选择省市区', trigger: 'change' }],
        // addressDetail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        
        // orderName: [{ required: true, message: '请输入下单人名称', trigger: 'blur' }],
        // orderPhone: [{ required: true, message: '请输入下单人电话', trigger: 'blur' }],

        // headType: [{ required: true, message: '请选择抬头类型', trigger: 'change' }],
        // invoiceHead: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }],
        // invoiceCode: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],
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
    rules: {
        packAsk: [{ required: true, message: () => t('orderPage.packagingRequireMents'), trigger: 'change' }],
        manufacturingCycle: [{ required: true, message: () => t('orderPage.manufacturingCycle'), trigger: 'change' }],
        tagRemark: [{ validator: validateText, tirgger: 'blur' }],
    },
    fastMailTable: [
        { send: 'DHL', name: 'DHL', price: () => t('payPage.basicExpressDelivery') }
    ],
    currentFastMail: undefined,
    receiverTable: [],
    currentReceiver: undefined,
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
            v.isChecked = v.isDefault == '1'
            if (v.isChecked) {
                state.currentReceiver = v
            }
        })
        const num = state.receiverTable.findIndex((v: any) => v.isChecked)
        if (state.receiverTable?.length && num == -1) {
            state.receiverTable[0].isChecked = true
            state.currentReceiver = state.receiverTable[0]
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
        addressId: state.currentReceiver.id || undefined,
        // proveList: state.form.proveList || []
    }
    $http(`/purchase/sale/submitOrder`, {
        method: 'post',
        loading: true,
        body
    }).then((res: any) => {
        // useSelectOrder()
        // for (let key in state.form) {
        //     useSelectOrder().value[key] = state.form[key]
        // }
        // useSelectOrder().value.addressId = state.currentReceiver.id

        // // 接口返回
        // useSelectOrder().value.orderId = res.data.orderId
        // useSelectOrder().value.price = res.data.price
        // useSelectOrder().value.totalPrice = res.data.totalPrice
        // useSelectOrder().value.freight = res.data.freight
        // useSelectOrder().value.freightTax = res.data.freightTax

        // setLocal('useSelectOrder')
        navigateTo('/order/1')
    })
}

const submitHandle = () => {
    // console.log(state.currentReceiver?.id)
    if (state.currentReceiver?.id == undefined || state.currentReceiver?.id == null || state.currentReceiver?.id == '') {
        ElMessage.error(t('payPage.pleaseSelectAnAddress'))
        return
    }
    state.currentReceiver.id = state.currentReceiver.id + ''
    formRef.value.validate((val: boolean) => {
        // console.log('val', val)
        if (val) {
            // for (let key in state.form) {
            //     useSelectOrder().value[key] = state.form[key]
            // }
            // useSelectOrder().value.addressId = state.currentReceiver.id
            // console.log('提交订单', state.form, useSelectOrder().value, state.currentReceiver)
            submitOrder()
        }
    })
}

onMounted(() => {
    if (useSelectOrder().value.orders) {
        const ids = useSelectOrder().value?.orders.map((v: any) => v.id) || []
        getOrderByIds(ids)
    }
    getAddressList()
    console.log(useSelectOrder().value)
})
</script>

<style lang="scss" scoped>
.pay {
    padding: 20px 0;

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

                .el-icon {
                    margin-right: 5px;
                }
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
                top: 50%;
                left: 0;
                width: 5px;
                height: 18px;
                background: var(--el-color-primary);
                transform: translate(0, -50%);
                border-radius: 3px;
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
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 5px;
            font-size: 14px;

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
                width: 280px;
                height: 40px;
                font-size: 16px;
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