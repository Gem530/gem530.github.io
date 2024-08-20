<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs class="xtable-tab" type="border-card" @tab-click="radioTableHandle" v-model="radioTable">
        <el-tab-pane label="待冲销列表" name="待冲销列表">
<!--          <el-row :gutter="10" class="mb8" style="width:100%;margin:0;display:flex;justify-content: end;">-->
<!--            <el-col :span="1.5">-->
<!--              <el-button :disabled="writeOffList.length == 0" type="primary" plain icon="Plus"-->
<!--                @click="handleWriteOff">账单冲销</el-button>-->
<!--            </el-col>-->
<!--          </el-row>-->
          <XTable toolId="payWriteOffAccountToolId1" v-model:page-size="accQueryParams.pageSize"
            v-model:current-page="accQueryParams.pageNum" height="100%" class="xtable-content"
            :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: total }"
            :data="orderFilinOutList" :columnList="columnList" ref="XTableRef" border @searchChange="searchChange"
            :showRefresh="true" :sort-orders="sortCondition" :checkbox-config="{ reserve: true }"
            @checkbox-all="handleSelectionChange" @checkbox-change="handleSelectionChange"
            :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }" :loading="loading">
            <template #default-code="scope">
              <span>{{ scope.row.code }}</span>
            </template>
            <template #default-status="scope">
              <span v-if="scope.row.payWriteOffPrice != 0">
                部分冲销
              </span>
              <span v-else>待冲销</span>
            </template>
            <template #default-type="scope">
              <span> {{ typeStrings[scope.row.type as keyof typeof TypeEnum] }} </span>
            </template>

            <template #default-accountMonth="scope">
              <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
            </template>
            <template #default-endTime="scope">
              <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-accountTime="scope">
              <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-createTime="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>

            <template #default-isTax="scope">
              <span v-if="scope.row.isTax == 0">否</span>
              <span v-if="scope.row.isTax == 1">是</span>
            </template>
            <template #default-tax="scope">
              <span>{{ taxRate }}</span>
            </template>
            <template #default-make="scope">
<!--              <el-button link type="primary" @click="handleWriteOffOrder(scope.row)">付款冲销</el-button>-->
              <el-button link type="primary" @click="handleWriteOffRecord(scope.row)">冲销记录</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="已冲销列表" name="已冲销列表">
          <el-row :gutter="10" class="mb8" style="width:100%;margin:0;display:flex;justify-content: end;">
            <el-col :span="1.5">
              <el-button  @click="handleExport">导出</el-button>
            </el-col>
          </el-row>
          <XTable toolId="payWriteOffAccountToolId2" v-model:page-size="accQueryParams3.pageSize"
            v-model:current-page="accQueryParams3.pageNum" height="100%" class="xtable-content"
            :intervalCondition="intervalCondition" :showRefresh="true" :sort-orders="sortCondition"
            :page-params="{ perfect: true, total: aduitTotal }" :data="orderFilinOutAduitList" :columnList="columnList2"
            ref="aduitTableRef" border @searchChange="searchChangeAduit" :column-config="{ resizable: true }"
            :loading="loadingFinsih"
            :checkbox-config="{ trigger: 'row', checkMethod: selectableFun }" :row-style="tableRowClassName"
            :row-config="{ keyField: 'id' }">
            <template #default-code="scope">
              <span>{{ scope.row.code }}</span>
            </template>
            <template #default-status="scope">
              <span>冲销完成</span>
            </template>
            <template #default-type="scope">
              <span> {{ typeStrings[scope.row.type as keyof typeof TypeEnum] }} </span>
            </template>
            <template #default-accountMonth="scope">
              <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
            </template>
            <template #default-isTax="scope">
              <span v-if="scope.row.isTax == 0">否</span>
              <span v-if="scope.row.isTax == 1">是</span>
            </template>
            <template #default-endTime="scope">
              <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-accountTime="scope">
              <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-tax="scope">
              <span>{{ taxRate }}</span>
            </template>
            <template #default-createTime="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-show="scope.row.status == '4'"
                @click="handleWriteOffRecord(scope.row)">冲销记录</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <wzhWriteOffDialog v-model:open="writerOffDialogOpen" :writeOffList="writeOffList" :type="writeOffType"
      @getList="getAllList" @close="cancelOrderSelect"></wzhWriteOffDialog>
    <wzhWriteOffRecordDialog v-model:open="writerOffRecordDialogOpen" :accountOrderWriteOff="accountOrderWriteOff"
      :type="writeOffType" @getList="getAllList" @close="cancelOrderSelect"></wzhWriteOffRecordDialog>

    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false"
      draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>
  </div>
</template>

<script setup name="PayWriteOff" lang="ts">
import wzhWriteOffDialog from '../components/wzhWriteOffDialog.vue';
import wzhWriteOffRecordDialog from '../components/wzhWriteOffRecordDialog.vue';
import { OrderFilinOutDetailVO, OrderFilinOutDetailQuery, OrderFilinOutDetailForm } from '@/api/financial/orderFilinOutDetail/types';
import { SourceHalfProcessCalcRuleVO, SourceHalfProcessCalcRuleTypeEnum } from "@/api/outsource/sourceHalfProcessCalcRule/types";
import { listSourceHalfProcessCalcRule } from "@/api/outsource/sourceHalfProcessCalcRule";
import {
  waitWriteOffList,
  listAccountOrderCount,
  auditedWriteOffList,
  submitAuditOrderSale
} from '@/api/financial/accountOrder';
import { AccountOrderVO, AccountOrderQuery, AccountOrderForm, TypeEnum, StatusEnum, statusStrings,typeStrings } from '@/api/financial/accountOrder/types';
import { listCustomer, getListCustomer } from '@/api/basedata/customer';
import useUserStore from '@/store/modules/user';
import { BigNumber } from 'bignumber.js';
import { parseTime } from "@/utils/ruoyi";
import dayjs from "dayjs";
import { deepClone } from '@/utils';
/**销售对账预览 */
import { getReportUrl } from '@/utils/report';
import { Decimal } from 'decimal.js';

/** 对账单按钮操作 */
let reportUrl = ref("");
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '对账单'
});

const accountUReportHandle = async (row: any) => {
  console.log("accountUReportHandle", row)
  const _name = row.customerName;
  const formattedMonth = dayjs(row.accountMonth).format('MM');
  const nowTime = dayjs(new Date()).format("YYYY_MM_DD_HH_mm_ss")

  const reportName = _name + formattedMonth + '月销售对账单_' + nowTime
  console.log("reportName", reportName)
  reportDrawer.title = "对账单报表预览";
  reportDrawer.visible = true;
  reportUrl.value = getReportUrl() + `&_n=${reportName}&_u=file:saleAccount.ureport.xml&url=financial/accountOrder/review/${row.id}&listUrl=financial/orderSaleDetail/report/${row.id}&listUrl1=financial/accountOrder/reviewRecord/${row.id}`;
  reportUrl.value = reportUrl.value.replace("1,4,6", "2,4,6");
}
const changeOrderList = ref([]) // 用于保存送货单数据.修改了数据之后,切换页码时,需要保留已经修改的值

/**========汇总数据 ========= */
const accountPriceTotal = ref(0);
const backPriceTotal = ref(0);
const payablePriceTotal = ref(0);
const remainPayablePriceTotal = ref(0);
const writeOffPriceTotal = ref(0);
const otherPriceTotal = ref(0);
/**销售对账预览 */

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { monthly_method,currency_type } = toRefs<any>(proxy?.useDict('monthly_method','currency_type'));

const taxRate = ref(0);
const orderFilinOutList = ref<AccountOrderVO[]>([]);
const orderFilinOutWaitList = ref<AccountOrderVO[]>([]);
const orderFilinOutAduitList = ref<AccountOrderVO[]>([]);
//首次查询，或者重置查询条件
const loading = ref(true);
const loadingWait = ref(true);
const loadingFinsih = ref(true);
const ids = ref<Array<string | number>>([]);
const total = ref(0);
const waitTotal = ref(0);
const aduitTotal = ref(0);
const supplierFilnPriceList = ref<SourceHalfProcessCalcRuleVO[]>([]);

//冲销defin start
const aduitTableRef = ref();
const writerOffDialogOpen = ref(false);
const writerOffRecordDialogOpen = ref(false);
const writeOffList = ref<AccountOrderVO[]>([]);
const accountOrderWriteOff = ref<AccountOrderVO>();
/**
* 冲销类型
* 1:付款
* 2:收款
*/
const writeOffType = "1"
//其他金额form
//冲销defin end
const initFormData: OrderFilinOutDetailForm = {
  id: undefined,
  code: undefined,
  type: undefined,
  status: undefined,
  isTax: undefined,
  accountUserId: undefined,
  accountUserName: undefined,
  remark: undefined,
  currency: undefined,
  quantity: undefined,
  price: undefined,
  discountPrice: undefined,
  totalPrice: undefined,
  accountOrderId: undefined,
  feilinOrderId: undefined,
  ownerId: undefined
}
const data = reactive<PageData<OrderFilinOutDetailForm, OrderFilinOutDetailQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    type: undefined,
    status: undefined,
    isTax: undefined,
    accountUserId: undefined,
    accountUserName: undefined,
    currency: undefined,
    quantity: undefined,
    price: undefined,
    discountPrice: undefined,
    totalPrice: undefined,
    accountOrderId: undefined,
    feilinOrderId: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "编码不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
    isTax: [
      { required: true, message: "是否含税不能为空", trigger: "change" }
    ],
    accountUserId: [
      { required: true, message: "对账人id不能为空", trigger: "blur" }
    ],
    accountUserName: [
      { required: true, message: "对账人名称不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    currency: [
      { required: true, message: "币种不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "单价不能为空", trigger: "blur" }
    ],
    discountPrice: [
      { required: true, message: "折扣金额不能为空", trigger: "blur" }
    ],
    totalPrice: [
      { required: true, message: "总金额不能为空", trigger: "blur" }
    ],
    accountOrderId: [
      { required: true, message: "对账单id不能为空", trigger: "blur" }
    ],
    feilinOrderId: [
      { required: true, message: "退货单、收货记录ID不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "单位ID不能为空", trigger: "blur" }
    ]
  }
});
const data3 = reactive<PageData<OrderFilinOutDetailForm, OrderFilinOutDetailQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    params: {
    }
  },
  rules: {
  }
});
const XTableRef = ref()

const customerCodeList = ref();
const customerNameList = ref();

const statusList = ref([
{label: '待冲销', value: '1' },
{label: '部分冲销', value: '2' },
]);
const typeList = ref([
{label: '采购', value: '2' },
{label: '订单外协', value: '1' },
{label: '外协加工', value: '5' },
]);
const taxList = ref([
  { label: '否', value: '0' },
  { label: '是', value: '1' },
]);
const columnList = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: '序号', field: "index", width: '50', type: 'seq', visible: true, align: 'center' },
  { title: '单据状态', width: '80', field: 'status', align: 'center', filterType: 'checkboxButton', filterData: () => statusList.value},
  { title: '单据类型', width: '80', field: 'type', align: 'center', filterType: 'checkboxButton',  filterData: () => typeList.value},
  { title: '对账月份', width: '100', field: 'accountMonth', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择对账月份', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  { title: '对账单号', width: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入对账单号' } },
  { title: '客户代码', width: '140', align: 'center', field: 'customerCode', filterType: 'input' },
  { title: '客户名称', width: '140', align: 'center', field: 'customerName', filterType: 'input' },
  { title: '供应商代码', width: '140', align: 'center', field: 'supplierCode', filterType: 'input' },
  { title: '供应商名称', width: '140', align: 'center', field: 'supplierName', filterType: 'input' },
  { title: '含税', width: '80', field: 'isTax', align: 'center', filterType: 'radio',filterData: () => taxList.value },
  { title: '月结方式', width: '90', field: 'monthlyMethod', align: 'center' ,
  filterType: 'input',
  //filterData: () => monthly_method.value,
  },
  { title: '币种', width: '90', field: 'currency', align: 'center' ,  filterType: 'radio',filterData: () => currency_type.value},
  // { title: '含税', width: '80', field: 'isTax', align: 'center' },
  // { title: '税率', width: '80', field: 'tax', align: 'center' },
  // { title: '月结方式', width: '90', field: 'monthlyMethod', align: 'center' },
  // { title: '币种', width: '90', field: 'currency', align: 'center' },
  { title: '回款截止日期', sortable: true, width: '140', field: 'endTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账日期', sortable: true, width: '140', field: 'accountTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账金额', sortable: true, width: '140', field: 'accountPrice', align: 'center', },
  { title: '其他金额', sortable: true, width: '140', field: 'otherPrice', align: 'center', },
  { title: '退货金额', sortable: true, width: '140', field: 'backPrice', align: 'center', },
  { title: '应付金额', sortable: true, width: '140', field: 'payPayablePrice', align: 'center', },//receivablePrice
  { title: '付款金额', sortable: true, width: '140', field: 'payWriteOffPrice', align: 'center', },
  { title: '剩余应付金额', sortable: true, width: '140', field: 'payRemainPrice', align: 'center', },
  { title: '对账人', width: '140', field: 'accountUserName', align: 'center', filterType: 'input' },
  { title: '备注', width: '240', field: 'remark', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false },
]);
const columnList2 = ref([
  { title: '序号', field: "index", width: '50', type: 'seq', visible: true, align: 'center' },
  { title: '单据状态', width: '80', field: 'status', align: 'center' },
  { title: '单据类型', width: '80', field: 'type', align: 'center', filterType: 'checkboxButton',  filterData: () => typeList.value},
  { title: '对账月份', width: '100', field: 'accountMonth', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择对账月份', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  { title: '对账单号', width: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入对账单号' } },
  { title: '客户代码', width: '140', align: 'center', field: 'customerCode', filterType: 'input' },
  { title: '客户名称', width: '140', align: 'center', field: 'customerName', filterType: 'input' },
  { title: '供应商代码', width: '140', align: 'center', field: 'supplierCode', filterType: 'input' },
  { title: '供应商名称', width: '140', align: 'center', field: 'supplierName', filterType: 'input' },
  { title: '含税', width: '80', field: 'isTax', align: 'center', filterType: 'radio',filterData: () => taxList.value },
  { title: '月结方式', width: '90', field: 'monthlyMethod', align: 'center' ,
  filterType: 'input',
  //filterData: () => monthly_method.value,
  },
  { title: '币种', width: '90', field: 'currency', align: 'center' ,  filterType: 'radio',filterData: () => currency_type.value},
  { title: '回款截止日期', sortable: true, width: '140', field: 'endTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账日期', sortable: true, width: '140', field: 'accountTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账金额', sortable: true, width: '140', field: 'accountPrice', align: 'center', },
  { title: '其他金额', sortable: true, width: '140', field: 'otherPrice', align: 'center', },
  { title: '退货金额', sortable: true, width: '140', field: 'backPrice', align: 'center', },
  { title: '应付金额', sortable: true, width: '140', field: 'payPayablePrice', align: 'center', },//receivablePrice
  { title: '付款金额', sortable: true, width: '140', field: 'payWriteOffPrice', align: 'center', },
  { title: '剩余应付金额', sortable: true, width: '140', field: 'payRemainPrice', align: 'center', },
  { title: '对账人', width: '140', field: 'accountUserName', align: 'center', filterType: 'input' },
  { title: '备注', width: '240', field: 'remark', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false },
]);
const { queryParams: accQueryParams, form, rules } = toRefs(data);
const { queryParams: accQueryParams3 } = toRefs(data3);
//头部按钮组
const radioTable = ref('待冲销列表');
const intervalCondition = ['accountMonth', 'endTime', 'accountTime', 'createTime'];
const sortCondition = ['endTime'];


// 取消已冲销列表勾选
const cancelOrderSelect = () => {
  changeOrderList.value.length = 0
  const $table = XTableRef.value.xTableRef;
  if ($table) {
    $table.clearCheckboxRow()
    writeOffList.value = []
  }
}

//供应商列表
const customerList = ref([]);
// 切换菜单栏 ***********
const radioTableHandle = async (tab: any, event: any) => {
  console.log("tab.", tab.props.label);
  radioTable.value = tab.props.label;
  columnList.value[0].visible = false
  if (radioTable.value == "待冲销列表") {
    columnList.value[0].visible = true
    await getList();
  } else if (radioTable.value == "已冲销列表") {
    columnList.value[0].visible = true;
    await getAduitList();
  }
}

const searchChange = async (params: any) => {
  accQueryParams.value = JSON.parse(JSON.stringify(params));
  if (params.sorts && params.sorts.length > 0) {
    params.sorts.forEach((item: any) => {
      accQueryParams.value.orderByColumn = item.prop;
      accQueryParams.value.isAsc = item.order;
    })
  }
  console.log("accQueryParams", accQueryParams.value);
  //accQueryParams.value = params
  await getList();
}

const searchChangeAduit = async (params: any) => {
  accQueryParams3.value = params
  if (params.sorts && params.sorts.length > 0) {
    params.sorts.forEach((item: any) => {
      accQueryParams3.value.orderByColumn = item.prop;
      accQueryParams3.value.isAsc = item.order;
    })
  }
  await getAduitList();
}
const getListCount = async (queryAny: any) => {
  const countRes = await listAccountOrderCount(queryAny);
  accountPriceTotal.value = countRes.accountPriceTotal ? countRes.accountPriceTotal : 0;
  backPriceTotal.value = countRes.backPriceTotal ? countRes.backPriceTotal : 0;
  payablePriceTotal.value = countRes.payablePriceTotal ? countRes.payablePriceTotal : 0;
  remainPayablePriceTotal.value = countRes.remainPayablePriceTotal ? countRes.remainPayablePriceTotal : 0;
  writeOffPriceTotal.value = countRes.writeOffPriceTotal ? countRes.writeOffPriceTotal : 0;
  otherPriceTotal.value = countRes.otherPriceTotal ? countRes.otherPriceTotal : 0;

  accountPriceTotal.value = toFixTwoPrice(accountPriceTotal.value);
  backPriceTotal.value = toFixTwoPrice(backPriceTotal.value);
  payablePriceTotal.value = toFixTwoPrice(payablePriceTotal.value);
  remainPayablePriceTotal.value = toFixTwoPrice(remainPayablePriceTotal.value);
  writeOffPriceTotal.value = toFixTwoPrice(writeOffPriceTotal.value);
  otherPriceTotal.value = toFixTwoPrice(otherPriceTotal.value);
}

const toFixTwoPrice = (queryAny: any) => {
  console.log(Number(queryAny));
  return queryAny ? Number(queryAny).toFixed(2) : 0;
}
const getAllList = async()=>{
  getList();
  getAduitList();
}

const getAduitList = async () => {
  loadingFinsih.value = true

  accQueryParams3.value.typeList = accQueryParams3.value.type;
  accQueryParams3.value.type = undefined;
  //accQueryParams3.value.type = TypeEnum.SALE;

  accQueryParams3.value.statusList = accQueryParams3.value.status;
  accQueryParams3.value.status = undefined;


  accQueryParams3.value.supplierCurrency = accQueryParams3.value.currency;
  accQueryParams3.value.supplierMonthlyMethod = accQueryParams3.value.monthlyMethod;
  const res = await auditedWriteOffList(accQueryParams3.value);
  orderFilinOutAduitList.value = res.rows;
  aduitTotal.value = res.total;
  loadingFinsih.value = false
}
/** 查询退货单/收货对账单明细列表 */
const getList = async () => {
  loading.value = true;

  accQueryParams.value.typeList = accQueryParams.value.type;
  accQueryParams.value.type = undefined;

  accQueryParams.value.statusList = accQueryParams.value.status;
  accQueryParams.value.status = undefined;

  //accQueryParams.value.type = TypeEnum.SALE;
  //customerCurrency
  accQueryParams.value.supplierCurrency = accQueryParams.value.currency;
  accQueryParams.value.supplierMonthlyMethod = accQueryParams.value.monthlyMethod;
  const res = await waitWriteOffList(accQueryParams.value);
  orderFilinOutList.value = res.rows;
  total.value = res.total;
  loading.value = false;

  await getListCount(accQueryParams.value);
}
// 搜索 **************end


/************ 冲销操作 start ***********/

const handleWriteOffOrder = async (row:any) => {
  writeOffList.value=[];
  writeOffList.value.push(row);
  writerOffDialogOpen.value = true;
}

const handleWriteOff = async () => {
  //判断writeOffList是不是同一个供应商
  if (writeOffList.value.some(item => item.supplierId != writeOffList.value[0].supplierId)) {
    proxy?.$modal.msgError("不同供应商不能一起进行账单冲销");
    return;
  }
  if (writeOffList.value.some(item => item.payablePrice === "0.0000")) {
    proxy?.$modal.msgError("已核销的账单不能进行冲销");
    return;
  }
  writerOffDialogOpen.value = true;
}
const handleSelectionChange = () => {
  const $table = XTableRef.value.xTableRef
  if ($table) {
    const records = $table.getCheckboxRecords();
    console.log("records", records)
    const sortRecords = records.sort((a: any, b: any) => new Date(a.accountTime).getTime() - new Date(b.accountTime).getTime());
    console.log("sortRecords", sortRecords)
    writeOffList.value = sortRecords;
  }
}
const selectableFun = (scope: any) => {
  if (scope.row.remainPayablePrice === "0.0000") {
    return false;
  }
  return true;
}
const handleWriteOffRecord = async (row: AccountOrderVO) => {
  accountOrderWriteOff.value = row;
  writerOffRecordDialogOpen.value = true;

}
const tableRowClassName = (row: any) => {
  if (radioTable.value.includes("已审核") && row.row.remainPayablePrice === "0.0000") {
    return {
      backgroundColor: '#F5FFFA'
    }
  } else if (radioTable.value.includes("已审核") && row.row.remainPayablePrice != "0.0000") {
    return {
      //backgroundColor: '#FFB6C1'
      backgroundColor: 'rgb(250, 236, 216)'
    }
  }
  return ''
}
/****** 冲销操作 end******/

/**
 * 获取供应商列表
 */
const getCustomerList = async () => {
  const SupplierResponse: any = await listCustomer();
  customerList.value = SupplierResponse.rows;
  console.log(customerList.value);
}

const getSupplierPriceList = async () => {
  const SupplierResponse: any = await listSourceHalfProcessCalcRule();
  supplierFilnPriceList.value = SupplierResponse.rows;
}
const getTaxRate = async () => {
  const res = await proxy?.getConfigKey("taxRate");
  if (res != undefined) {
    taxRate.value = Number(res.data);
    console.log(taxRate.value)
  }
}

const getListCust = async () => {
  const custRes = await getListCustomer();
  const resCust = custRes.data;
  if (resCust) {
    customerCodeList.value = resCust.map(item => {
      return {
        value: item.id,
        label: item.customerCode
      }
    });
    customerNameList.value = resCust.map(item => {
      return {
        value: item.id,
        label: item.customerName
      }
    });
  }
}
/** 导出按钮操作 */
const handleExport = () => {
  let tool_tableName = 'payWriteOffAccountToolId2';
  let queryInfo = {};
      queryInfo = { ...accQueryParams3.value, tableName: tool_tableName }
  proxy?.download('financial/accountOrder/exportPayWriteOff', queryInfo, `已冲销对账单_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
  //getListCust();
  getCustomerList();
  getSupplierPriceList();
  getTaxRate();
});
</script>
<style lang="scss" scoped>
.el-drawer__header {
  margin-bottom: 0px !important;
}

.totalTitle {
  padding: 0px !important;
  margin: 0px !important;
  line-height: 24px !important;
  display: flex !important;
  justify-content: end !important;
  font-size: 14px !important;
  color: #0892c7 !important;
  font-weight: bold;
  margin-right: 10px;
}

:deep(.padding-drawer) {
  .el-drawer__header {
    margin-bottom: 5px;
  }

  .el-drawer__body {
    padding-top: 10px;
    padding-bottom: 10px;

    .drawer-order-form {
      .el-form-item {
        margin-bottom: 0;
      }
    }

    .el-card {
      .el-card__body {
        padding: 5px !important;
      }
    }
  }

  .el-drawer__footer {
    padding-bottom: 10px;
  }
}

:deep(.table-height-rows) {
  background: rgb(217, 236, 255);
}</style>
