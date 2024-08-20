<template>
  <el-tabs v-model="tabRadioTable" @tab-change="tabRadioTableHandle" type="border-card" class="ptable-tab">
    <el-tab-pane :label="props.tabPaneName1+'(' + deliveryTotal + ')'" :name="props.tabPaneName1">
      <XTable
        :pageShow="true"
        v-model:page-size="rQueryParams.pageSize"
        v-model:current-page="rQueryParams.pageNum"
        :intervalCondition="props.intervalCondition1"
        :page-params="{ perfect: true, total: deliveryTotal }"
        size="mini"
        :data="receiveList"
        :columnList="tabColumnList"
        ref="deliverTableRef"
        @checkbox-all="selectTabAllChangeEvent"
        height="100%"
        class="ptable-content"
        @checkbox-change="selectTabChangeEvent"
        border
        @searchChange="deliverSearchChange"
        :loading="inOrOutLoading"
        :checkbox-config="{ checkMethod: tabCheckMethod, reserve: true }"
        :disabled="inOrOutQuery.queryType == '1'"
        :row-class-name="rowClassName"
        :column-config="{ resizable: true }"
      >
       
        <template #default-checkQuantity="{ row }">
          <el-input-number
            :disabled="props.type==HandleEnum.INFO || props.type==HandleEnum.EXAMINE"
            maxLength="11"
            :min="0"
            :max="row.quantity"
            :precision="0"
            style="width: 99%;"
            @change="calculatePrice(row)"
            :controls="false"
            v-model="row.checkQuantity"
          />
        </template>

        <template #default-discountPrice="{ row }">
          <el-input-number
             :disabled="props.type==HandleEnum.INFO || props.type==HandleEnum.EXAMINE"
            :min="0"
            maxLength="11"
            :precision="2"
            style="width: 99%;"
            @change="calculatePrice(row)"
            :controls="false"
            v-model="row.discountPrice"
          />
        </template>
        <template #default-checkRemark="{ row }">
          <el-input
             :disabled="props.type==HandleEnum.INFO || props.type==HandleEnum.EXAMINE"
            maxLength="1000"
            style="width: 99%;"
            v-model="row.checkRemark"
            @change="changeOrderListHandle(row)"
          />
        </template>
      </XTable>
    </el-tab-pane>
    <el-tab-pane :label="props.tabPaneName1+'(' + backTotal + ')'" :name="props.tabPaneName2">
      <XTable
        :pageShow="true"
        v-model:page-size="backQueryParams.pageSize"
        v-model:current-page="backQueryParams.pageNum"
        :intervalCondition="props.intervalCondition2"
        :page-params="{ perfect: true, total: backTotal }"
        size="mini"
        :data="backList"
        height="100%"
        class="ptable-content"
        :columnList="backColumnList"
        ref="backTableRef"
        @checkbox-all="selectTabAllChangeEvent"
        @checkbox-change="selectTabChangeEvent"
        border
        @searchChange="backSearchChange"
        :loading="inOrOutLoading"
        :checkbox-config="{ checkMethod: tabCheckMethod, reserve: true }"
        :disabled="inOrOutQuery.queryType == '1'"
        :column-config="{ resizable: true }"
      >
        <slot name="pane2"></slot>
        <template #default-checkQuantity="{ row }">
          <el-input-number
            :disabled="props.type==HandleEnum.INFO || props.type==HandleEnum.EXAMINE"
            maxLength="11"
            :min="0"
            :max="row.quantity"
            :precision="2"
            style="width: 99%;"
            @change="calculatePrice(row)"
            :controls="false"
            v-model="row.checkQuantity"
          />
        </template>
        <template #default-checkRemark="{ row }">
          <el-input
             :disabled="props.type==HandleEnum.INFO || props.type==HandleEnum.EXAMINE"
            maxLength="1000"
            style="width: 99%;"
            v-model="row.checkRemark"
            @change="changeOrderListHandle(row)"
          />
        </template>
      </XTable>
    </el-tab-pane>
    <el-tab-pane label="其他金额" name="其他金额">
      <el-button v-if="otherAmountBtn" type="primary" @click="otherMoneyHandle"> 新增金额 </el-button>
      <XTable
        :pageShow="true"
        v-model:page-size="backQueryParams.pageSize"
        :intervalCondition="props.intervalCondition2"
        size="mini"
        :data="accountOrderOtherList"
        :row-config="{ keyField: 'id' }"
        :checkbox-config="{ checkMethod: tabCheckMethod }"
        :columnList="otherColumnList"
        ref="otherPriceTableRef"
        @checkbox-all="selectOtherAllChangeEvent"
        height="100%"
        class="ptable-content"
        @checkbox-change="selectOtherChangeEvent"
        border
        :disabled="inOrOutQuery.queryType == '1'"
      >
        <template #default-createTime="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-recordTime="scope">
          <span>{{ parseTime(scope.row.recordTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-type="scope">
          <span>{{ scope.row.type == 1 ? '入金' : '出金' }}</span>
        </template>
        <template #default-price="scope">
          <span>{{ scope.row.price ? Number(scope.row.price).toFixed(2) : 0.00 }}</span>
        </template>
        <template #default-operate="scope">
          <el-button link type="primary" @click="handleUpdateOther(scope.row)">修改</el-button>
          <el-button link type="primary" @click="handleDeleteOther(scope.row)">删除</el-button>
        </template>
      </XTable>
      <vxe-table
        align="center"
        border
        ref="otherTableRef"
        height="400"
        size="small"
        :row-config="{ isHover: true }"
        :data="accountOrderOtherList"
        @checkbox-all="selectOtherAllChangeEvent"
        @checkbox-change="selectOtherChangeEvent"
        v-if="false"
      >
        <vxe-column width="40" type="checkbox" v-if="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"> </vxe-column>
        <vxe-column type="seq" width="50" title="序号" field="code"> </vxe-column>
        <vxe-column width="180" title="创建时间" field="createTime">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </vxe-column>
        <vxe-column field="createByName" title="创建人" width="120"></vxe-column>
        <vxe-column field="recordTime" width="140" title="对账日期">
          <template #default="scope">
            <span>{{ parseTime(scope.row.recordTime, '{y}-{m}-{d}') }}</span>
          </template>
        </vxe-column>
        <vxe-column field="type" width="80" title="金额类型">
          <template #default="scope">
            <span>{{ scope.row.type == 1 ? '入金' : '出金' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="price" width="80" title="金额">
          <template #default="scope">
            <span>{{ scope.row.price ? scope.row.price.toFixed(2) : 0.00 }}</span>
          </template>
        </vxe-column>
        <vxe-column field="remark" fixed="right" title="备注"> </vxe-column>
        <vxe-column fixed="right" width="120" title="操作" v-if="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')">
          <template #default="scope">
            <el-button link type="primary" @click="handleUpdateOther(scope.row)">修改</el-button>
            <el-button link type="primary" @click="handleDeleteOther(scope.row)">删除</el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </el-tab-pane>
  </el-tabs>

  <el-form border label-width="120px" :model="outForm" class="drawer-order-form">
    <el-row>
      <el-col :span="4">
        <el-form-item size="small" label="对账总金额：" prop="borrowTotalPrice">{{ borrowTotalPrice }}</el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item size="small" label="退货总金额：" prop="backTotalPrice">{{ -backTotalPrice }}</el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item size="small" label="入金总金额：" prop="backDiscountTotalPrice">{{ otherRecoverTotalPrice
        }}</el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item size="small" label="出金总金额：" prop="backDiscountTotalPrice">{{ -otherOutTotalPrice
        }}</el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item size="small" label="应收总金额：" prop="accountPrice">{{
      BigNumber(borrowTotalPrice).minus(BigNumber(backTotalPrice)).minus(BigNumber(otherOutTotalPrice)).plus(BigNumber(otherRecoverTotalPrice)).toNumber()
        }}</el-form-item>
      </el-col>
    </el-row>
  </el-form>


</template>

<script setup name="AccountDrawer" lang="ts">
import {   HandleEnum, } from '@/api/financial/accountOrder/types';

const emits = defineEmits(['tabSearchChange1','tabSearchChange2','cancel'])
const props = withDefaults(defineProps<{
  tabPaneName1?: string
  tabPaneName2?: string
  tabPaneColumnList1?: any
  tabPaneColumnList2?: any
  intervalCondition1?: any
  intervalCondition2?: any
  dataList1?: any
  dataList2?: any
  accountName?: string
  isOther?: boolean
  title:string
  type:HandleEnum
}>(), {
  isOther: false,
  tabPaneColumnList1: ()=>[],
  tabPaneColumnList2: ()=>[],
  intervalCondition1: [],
  intervalCondition2: [],
  dataList1: ()=>[],
  dataList2: ()=>[],
  tabPaneName1: '送货单',
  tabPaneName2: '退货单',
  title: '对账单',
  type:HandleEnum.ADD
})
watch(() => props.dataList1, (val) => {
  receiveList.value = val
})
watch(() => props.dataList2, (val) => {
  backList.value = val
})





/****************************抽屉开始 */

import { OrderFilinOutDetailVO, OrderFilinOutDetailQuery, OrderFilinOutDetailForm } from '@/api/financial/orderFilinOutDetail/types';
import { VxeTableEvents } from 'vxe-table';
import { AccountOrderOtherVO, AccountOrderOtherForm, AccountOrderOtherQuery } from '@/api/financial/accountOrderOther/types';
import { SourceHalfProcessCalcRuleVO, SourceHalfProcessCalcRuleTypeEnum } from "@/api/outsource/sourceHalfProcessCalcRule/types";
import { listSourceHalfProcessCalcRule } from "@/api/outsource/sourceHalfProcessCalcRule";



import { listOrderSaleDetail, getOrderSaleDetail, delOrderSaleDetail, addOrderSaleDetail, updateOrderSaleDetail } from '@/api/financial/orderSaleDetail';
import { OrderSaleDetailVO, OrderSaleDetailQuery, OrderSaleDetailForm, SALETYPEENUM } from '@/api/financial/orderSaleDetail/types';

import { listAccountOrderOther } from '@/api/financial/accountOrderOther';
import {
  listAccountOrder,
  listAccountOrderCount,
  getAccountOrder,
  delAccountOrderNew,
  addAccountOrder,
  updateAccountOrder,
  updateAccountOrderStatus,
  submitAuditOrderSale
} from '@/api/financial/accountOrder';

import { listCustomer } from '@/api/basedata/customer';
import useUserStore from '@/store/modules/user';
import { BigNumber } from 'bignumber.js';
import { parseTime } from "@/utils/ruoyi";
import dayjs from "dayjs";
import { deepClone } from '@/utils';
/**销售对账预览 */
import { getReportUrl } from '@/utils/report';
/** 对账单按钮操作 */
let reportUrl = ref("");
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '对账单'
});

const changeOrderList = ref([]) // 用于保存采购单数据.修改了数据之后,切换页码时,需要保留已经修改的值

/**========汇总数据 ========= */
const accountPriceTotal = ref(0);
const backPriceTotal = ref(0);
const payablePriceTotal = ref(0);
const remainPayablePriceTotal = ref(0);
const writeOffPriceTotal = ref(0);
const accountDiscountPriceTotal = ref(0);
/**销售对账预览 */

//初始化编辑金额
const firstInitEditPrice = ref(true);


const { nickname } = useUserStore();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const taxRate = ref(0);
const orderFilinOutList = ref<AccountOrderVO[]>([]);
const orderFilinOutWaitList = ref<AccountOrderVO[]>([]);
const orderFilinOutAduitList = ref<AccountOrderVO[]>([]);
//首次查询，或者重置查询条件
const firstSearch = ref(true);
//编辑前对账日期
const updateAccDate = ref();
const updateAccMonth = ref();
const updateAccRemark = ref();
//已选择记录
const saleDetailList = ref<OrderSaleDetailVO[]>([]);
const backList = ref<InOutRecordVO[]>([]);
const receiveList = ref<InOutRecordVO[]>([]);
const checkedOrderBackOutDetailList = ref<OrderSaleDetailVO[]>([]);
const checkedOrderBackOutDetailListTab = ref<OrderSaleDetailVO[]>([]);
const checkedDeliverList = ref<OrderSaleDetailVO[]>([]);
const checkedDeliverListTab = ref<OrderSaleDetailVO[]>([]);
const checkedDeliverListBgHeight = ref<OrderSaleDetailVO[]>([]);
//其他金额
const accountOrderOtherList = ref<AccountOrderOtherVO[]>([]);
//选中的其他金额
const selectedOrderOtherList = ref<AccountOrderOtherVO[]>([]);
const loading = ref(true);
const loadingWait = ref(true);
const loadingFinsih = ref(true);
const ids = ref<Array<string | number>>([]);
const total = ref(0);
const waitTotal = ref(0);
const aduitTotal = ref(0);
const backTotal = ref(0);
const deliveryTotal = ref(0);
const inOrOutLoading = ref(true);
const backTableRef = ref();
const deliverTableRef = ref();
const otherTableRef = ref();
const otherPriceTableRef = ref();
const addTabFormRef = ref<ElFormInstance>();
const orderFilinOutDetailFormRef = ref<ElFormInstance>();
const supplierFilnPriceList = ref<SourceHalfProcessCalcRuleVO[]>([]);
//其他金额form
const accountOrderOtherFormRef = ref<ElFormInstance>();
const otherMoneyDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

//冲销defin start
const aduitTableRef = ref();
const writerOffDialogOpen = ref(false);
const writerOffRecordDialogOpen = ref(false);
const writeOffList = ref<AccountOrderVO[]>([]);
const accountOrderWriteOff = ref<AccountOrderVO>();
//编辑和查看详情选择的对账单
const currentAccountOrderId = ref(undefined);

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
const data2 = reactive<PageData<OrderFilinOutDetailForm, OrderFilinOutDetailQuery>>({
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
const delPageChangeCheckList = ref([]) // 解决切换分页时，重置取消的勾选


const isCompressionList = ref([
  { label: '是', value: "1" },
  { label: '否', value: "2" },
]);
const orderTypeList = ref([
  { label: '菲林', value: "1" },
  { label: '网板', value: "2" },
]);
const tabColumnList = ref([]);
const backColumnList = ref([]);
const otherColumnList = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '60' },
  { title: '创建时间', width: '180', field: 'createTime', align: 'center' },
  { title: '创建人', width: '180', field: 'createByName', align: 'center' },
  { title: '对账日期', width: '180', field: 'recordTime', align: 'center' },
  { title: '金额类型', width: '180', field: 'type', align: 'center' },
  { title: '金额', width: '180', field: 'price', align: 'center' },
  { title: '备注', width: '180', fixed: 'right', field: 'remark', align: 'center' },
  { title: '操作', width: '180', fixed: 'right', field: 'operate', align: 'center' },
]);
const { queryParams: accQueryParams, form, rules } = toRefs(data);
const { queryParams: accQueryParams2 } = toRefs(data2);
const { queryParams: accQueryParams3 } = toRefs(data3);
// const drawerBorrow = reactive<DialogOption>({
//   visible: false,
//   title: '订单审核'
// });
//头部按钮组
const radioTable = ref('对账单列表');
const tabRadioTable = ref(props.tabPaneName1);
const otherAmountBtn = ref(false);
//tab明细结构
const initOutFormData: OrderSaleDetailForm = {
  id: undefined,
  code: undefined,
  type: undefined,
  status: undefined,
  isTax: "0",
  accountUserId: undefined,
  accountUserName: undefined,
  remark: undefined,
  currency: undefined,
  quantity: undefined,
  price: undefined,
  discountPrice: undefined,
  totalPrice: undefined,
  accountOrderId: undefined,
  commodityInOutRecordId: undefined,
  ownerId: undefined,
  saleOrderBackId: undefined
}
const initOutFormDataB = {
  id: undefined,
  quantity: undefined,
  reason: undefined,
}
const backData = reactive<PageData<InOutRecordForm, InOutRecordQuery>>({
  form: { ...initOutFormDataB },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  },
  rules: {
  }
});
const rData = reactive<PageData<InOutRecordForm, InOutRecordQuery>>({
  form: { ...initOutFormDataB },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  },
  rules: {
  }
});
const insertFormData = reactive<PageData<AccountOrderForm, AccountOrderQuery>>({
  form: { ...initOutFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: undefined,
    endTime: undefined,
    accountTime: undefined,
    supplierId: undefined,
    accountMonth: undefined,
    currency: undefined,
    code: undefined,
    remark: undefined,
    status: undefined,
    id: undefined,
    isTax: undefined,
  },
  rules: {
    customerId: [
      { required: true, message: "客户不能为空", trigger: "blur" }
    ],
    accountTime: [
      { required: true, message: "对账日期不能为空", trigger: "blur" }
    ],
    accountMonth: [
      { required: true, message: "对账月份不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "菲林单价不能为空", trigger: "blur" }
    ],
    isTax: [
      { required: true, message: "请选择对账单含税类型", trigger: "blur" }
    ],
    checkQuantity: [
      { required: true, message: "核对数量不能为空", trigger: "blur" }
    ],
    checkPrice: [
      { required: true, message: "核对单价不能为空", trigger: "blur" }
    ],
    discountPrice: [
      { required: true, message: "折扣金额不能为空", trigger: "blur" }
    ],
    totalPrice: [
      { required: true, message: "总金额不能为空", trigger: "blur" }
    ],

  }
});
//其他金额
const initOtherFormData: AccountOrderOtherForm = {
  index: undefined,
  id: undefined,
  type: "1",
  createByName: undefined,
  price: undefined,
  remark: undefined,
  accountOrderId: undefined,
  recordTime: undefined
}
const otherData = reactive<PageData<AccountOrderOtherForm, AccountOrderOtherQuery>>({
  form: { ...initOtherFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: undefined,
    price: undefined,
    accountOrderId: undefined,
    recordTime: undefined,
    params: {
    }
  },
  rules: {
    type: [
      { required: true, message: "金额类型不能为空", trigger: "change" }
    ],
    recordTime: [
      { required: true, message: "对账时间不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "金额不能为空", trigger: "blur" }
    ]
  }
});
const intervalCondition1 = [];
const intervalCondition2 = [];
const sortCondition = ['endTime'];

const { queryParams: inOrOutQuery, form: outForm, rules: tabRules } = toRefs(insertFormData);
const { queryParams: otherQueryParams, form: otherForm, rules: otherRules } = toRefs(otherData);
const { queryParams: backQueryParams } = toRefs(backData);
const { queryParams: rQueryParams } = toRefs(rData);



//供应商列表
const customerList = ref([]);

const tabRadioTableHandle = () => {

  otherAmountBtn.value = tabRadioTable.value == '其他金额' && !(drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核'));
  if (tabRadioTable.value != '其他金额') {
    //getAddListRecord();
  }
}

// 切换菜单栏 *********** end
const tabCheckMethod = (row: any) => {
  return !(drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核'));
}
// 编辑采购单高亮
const rowClassName = ({ row, rowIndex, $rowIndex }: any) => {
  const num = checkedDeliverListBgHeight.value.findIndex((item: any) => item.id == row.id)
  if (num != -1) {
    return 'table-height-rows'
  }
}
// 搜索 **************start
const deliverSearchChange = async(params: any) => {
  
  emits('tabSearchChange1',  params);
  
  await getAddListRecord();
}
const backSearchChange = async(params: any) => {
  emits('tabSearchChange2',  params);
  await getAddListRecord();
}


const addCancel = () => {
   emits('cancel');
}

const resetTab = async () => {
  firstInitEditPrice.value = true;

  outForm.value = { ...initOutFormData };
  backList.value = [];
  receiveList.value = [];
  checkedOrderBackOutDetailList.value = [];
  checkedDeliverList.value = [];
  accountOrderOtherList.value = [];
  selectedOrderOtherList.value = [];
  changeOrderList.value = [];
  delPageChangeCheckList.value = [];
  checkedDeliverListBgHeight.value = [];

  inOrOutQuery.value = new Object();
  inOrOutQuery.value.isTax = undefined;
  inOrOutQuery.value.accountTime = parseTime(new Date(), '{y}-{m}-{d} 23:59:59');
  addTabFormRef.value?.resetFields();
  tabRadioTable.value = props.tabPaneName1;
  inOrOutLoading.value = false;

  let _backTabCache = backTableRef.value;
  let _deTabCache = deliverTableRef.value;
  if (_backTabCache) {
    _backTabCache.xTableRef.clearCheckboxReserve();
    _backTabCache.xTableRef.clearCheckboxRow();
  }
  if (_deTabCache) {
    _deTabCache.xTableRef.clearCheckboxReserve();
    _deTabCache.xTableRef.clearCheckboxRow();
  }

  backQueryParams.value = {
    pageNum: 1,
    pageSize: 10
  }
  rQueryParams.value = {
    pageNum: 1,
    pageSize: 10
  }
  otherQueryParams.value = {
    pageNum: 1,
    pageSize: 10
  }
}
//添加对账单表单 全选
const selectTabAllChangeEvent: VxeTableEvents.CheckboxAll<any> = ({ checked }) => {
  drawTabDataSet();
}
//单选
const selectTabChangeEvent: VxeTableEvents.CheckboxAll<OrderFilinOutDetailVO> = (item: any) => {
  drawTabDataSet();
}

const drawTabDataSet = () => {
  const _backTableRef = backTableRef.value.xTableRef;
  const _deliverTableRef = deliverTableRef.value.xTableRef;

  //获取当前页选中的数据
  const deliverCurCheck = _deliverTableRef.getData().filter((item: any) => _deliverTableRef.isCheckedByCheckboxRow(item));
  const r_deliverCurCheck = _deliverTableRef.getData().filter((item: any) => !_deliverTableRef.isCheckedByCheckboxRow(item));
  const backCurCheck = _backTableRef.getData().filter((item: any) => _backTableRef.isCheckedByCheckboxRow(item));
  const r_backCurCheck = _backTableRef.getData().filter((item: any) => !_backTableRef.isCheckedByCheckboxRow(item));

  addTabStore(backCurCheck, checkedOrderBackOutDetailList.value, "id");
  removeTabStore(r_backCurCheck, checkedOrderBackOutDetailList.value, "id");
  addTabStore(deliverCurCheck, checkedDeliverList.value, "deliveryId");
  removeTabStore(r_deliverCurCheck, checkedDeliverList.value, "deliveryId");
}
const addTabStore = (sourceList: any, storeList: any, key: any) => {
  sourceList.forEach((item: any) => {
    let itemAlready2 = storeList.some((item2: any) => item2[key] == item[key]);
    let itemAlready = storeList.find((itemAlready: any) => {
      return itemAlready[key] == item[key]
    });
  
    if (itemAlready) {
      // 更新已存在的元素
      itemAlready = item;
    } else {
      // 添加新元素
      storeList.push(item);
    }
  })
}
const removeTabStore = (sourceList: any, storeList: any, key: any) => {
  sourceList.forEach((item: any) => {
    let itemAlready = storeList.find((itemAlready: any) => itemAlready[key] == item[key]);
    if (itemAlready) {
      delPageChangeCheckList.value.push(itemAlready)
      // 删除元素
      const _inx = storeList.indexOf(itemAlready);
      storeList.splice(_inx, 1);
    }
  })
}

//重新设置使得响应式生效
const refreshListCheck = () => {

  const checkInfo3 = otherPriceTableRef.value.xTableRef.getCheckboxReserveRecords().concat(otherPriceTableRef.value.xTableRef.getCheckboxRecords());
  selectedOrderOtherList.value = checkInfo3;
  console.log(" refreshListCheck selectedOrderOtherList", selectedOrderOtherList);
}
/** 新增按钮操作 */
const handleAdd = async () => {
  tabRadioTable.value = "采购单";
  drawerBorrow.title = "添加对账单";
  drawerBorrow.visible = true;
  await resetTab();
  await getAddListRecord();
}

const handleUpdate = async (row?: AccountOrderVO) => {
  await resetTab();
  drawerBorrow.visible = true;
  const _id = row?.id || ids.value[0]
  drawerBorrow.title = "修改对账单";
  tabRadioTable.value = "采购单";
  currentAccountOrderId.value = _id;
  const res = await getAccountOrder(_id);
  Object.assign(outForm.value, res.data);
  setQueryParams(res.data.id);
  updateAccDate.value = res.data.accountTime;
  updateAccMonth.value = res.data.accountMonth;
  updateAccRemark.value = res.data.remark;
  inOrOutQuery.value.queryType = "1";
  await getAddListRecord();
  checkedDeliverListBgHeight.value = deepClone(checkedDeliverList.value)
  // console.log("---------------handleUpdate-checkedDeliverList.value",checkedDeliverList.value)

}
/**详情按钮操作 */
const handleDetail = async (row?: AccountOrderVO) => {
  await resetTab();
  tabRadioTable.value = "采购单";
  drawerBorrow.title = "对账单详情";
  drawerBorrow.visible = true;
  const _id = row?.id || ids.value[0]
  currentAccountOrderId.value = _id;
  const res = await getAccountOrder(_id);
  Object.assign(outForm.value, res.data);
  setQueryParams(res.data.id);
  inOrOutQuery.value.queryType = "1";
  rQueryParams.value.onlyAccountOrder = "1";
  backQueryParams.value.onlyAccountOrder = "1";
  await getAddListRecord();
  checkedDeliverListBgHeight.value = deepClone(checkedDeliverList.value)
}
const setQueryParams = (_id: any) => {
  inOrOutQuery.value.accountTime = outForm.value.accountTime;
  inOrOutQuery.value.endTime = outForm.value.endTime;
  inOrOutQuery.value.accountMonth = outForm.value.accountMonth;
  inOrOutQuery.value.customerId = outForm.value.customerId;
  inOrOutQuery.value.remark = outForm.value.remark;
  inOrOutQuery.value.currency = outForm.value.currency;
  inOrOutQuery.value.isTax = outForm.value.isTax;
  inOrOutQuery.value.id = _id;
}
/** 查询tab记录 */
const getAddListRecord = async () => {


    otherQueryParams.value.accountOrderId = inOrOutQuery.value.id;
    listAccountOrderOther(otherQueryParams.value).then(res => {

      //编辑翻页，暂存其他金额
      if (!accountOrderOtherList.value || accountOrderOtherList.value.length == 0) {
        accountOrderOtherList.value = res.data;
      }
      if (!selectedOrderOtherList.value || selectedOrderOtherList.value.length == 0) {
        selectedOrderOtherList.value = JSON.parse(JSON.stringify(res.data));
      }
    });


  setSelectRow(inOrOutQuery.value.queryType);
  //编辑状态下，判断不是首次初始化金额
  if (inOrOutQuery.value.queryType == "1") {
    firstInitEditPrice.value = false;
  }
  inOrOutLoading.value = false
}

const setSelectRow = (queryType?: string) => {
  backList.value.forEach(item => {
    item.customerId = item.cusId;
    item.saleOrderBackId = item.rawOrderBackVoList[0].saleOrderBackId;
  })
  receiveList.value.map(item => {
    item.code = item.deliveryCode;
    item.saleOrderId = item.bizId;
    item.deliveryId = item.id;
  })
  setPriceInfo();
  nextTick(() => {
    if (queryType == "1") {
      setCheckedListInfo();
    }
    setTimeout(() => {
      let f_checkedList = backList.value.filter(item => {
        return checkedOrderBackOutDetailList.value.some((item2: any) => item.saleOrderBackId == item2.saleOrderBackId);
      });
      backTableRef.value.xTableRef.setCheckboxRow(f_checkedList, true);
      let w_checkedList = receiveList.value.filter(item => {
        return checkedDeliverList.value.some((item2: any) => item.deliveryId == item2.deliveryId);
      });
      deliverTableRef.value.xTableRef.setCheckboxRow(w_checkedList, true);
      otherPriceTableRef.value.xTableRef.setCheckboxRow(selectedOrderOtherList.value, true);
    }, 500);

  })
}
const setPriceInfo = () => {

  if (backList) {
    backList.value = backList.value.map((item) => {
      item.orderPrice = item.price ? item.price : 0;
      item.checkQuantity = item.quantity ? item.quantity : 0;
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id);
      if (crtM) {
        item.checkQuantity = crtM?.checkQuantity ? crtM.checkQuantity : 0;
        item.discountPrice = crtM?.discountPrice ? crtM.discountPrice : 0;
        item.checkRemark = crtM?.checkRemark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
      }
      const itemPrice: any = (item.orderPrice * 10000).toFixed(2);
      const itemQuantity: any = (item.checkQuantity * 10000).toFixed(2);
      let sum1 = (itemPrice * itemQuantity) / 10000;
      item.totalPrice = Number(sum1) / 10000;
      return item
    });
  }
  if (receiveList) {
    receiveList.value.forEach((item, inx) => {
      item.checkPrice = item.orderPrice ? item.orderPrice : 0;
      item.checkQuantity = item.quantity ? item.quantity : 0;
      item.discountPrice = item?.discountPrice ? item.discountPrice : 0;
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id)
      if (crtM) {
        item.checkQuantity = crtM?.checkQuantity ? crtM.checkQuantity : 0;
        item.discountPrice = crtM?.discountPrice ? crtM.discountPrice : 0;
        item.checkRemark = crtM?.checkRemark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
      }
      const discountPrice2 = (item.discountPrice * 10000).toFixed(2);
      const itemPrice = (item.checkPrice * 10000).toFixed(2);
      const itemQuantity = (item.checkQuantity * 10000).toFixed(2);
      let _otherCost: number = Number(item.mouldCost) + Number(item.testFrameCost) + Number(item.engineeringCost)
        + Number(item.flyProbeCost) + Number(item.sampleCost) + Number(item.expeditedCost) + Number(item.otherCost);
      _otherCost = (_otherCost * 10000).toFixed(2);
      let amount: number = (itemPrice * itemQuantity) / 10000;
      amount = Number(amount) - Number(discountPrice2);
      if (_otherCost) {
        amount = Number(amount) + Number(_otherCost);
      }
      item.totalPrice = amount / 10000;
    });
  }
}
const setSaleDetailCheckedList = () => {
  if (saleDetailList.value && saleDetailList.value.length > 0) {
    let _backCheckList = saleDetailList.value.filter(item => item.type == SALETYPEENUM.SALE_BACK);
    _backCheckList = _backCheckList.map(cd => {
      cd.saleDetailId = cd.id;
      cd.id = cd.saleOrderBackId;
      cd.checkPrice = cd.orderPrice;
      cd.checkQuantity = cd.quantity;
      return cd;
    })
    if (!checkedOrderBackOutDetailList.value || checkedOrderBackOutDetailList.value.length == 0) {
      checkedOrderBackOutDetailList.value = JSON.parse(JSON.stringify(_backCheckList));
    }
    //编辑状态下的缓存数据的price重新赋值，兼容新增单价逻辑
    let _checkedDeliverList = saleDetailList.value.filter(item => item.type == SALETYPEENUM.SALE_DELIVER);
    _checkedDeliverList = _checkedDeliverList.map(cd => {
      cd.saleDetailId = cd.id;
      cd.id = cd.deliveryId;
      cd.checkPrice = cd.orderPrice;
      cd.checkQuantity = cd.quantity;
      return cd;
    })
    if (!checkedDeliverList.value || checkedDeliverList.value.length == 0) {
      checkedDeliverList.value = JSON.parse(JSON.stringify(_checkedDeliverList));
    }
  }
}

const setCheckedListInfo = () => {
  backList.value.map((item, inx) => {
    const detail: any = checkedOrderBackOutDetailList.value.find(itemA => itemA.saleOrderBackId == item.saleOrderBackId);
    if (detail) {
      backList.value[inx] = setListPriceInfo(item, detail);
    }
  });
  receiveList.value.map((item, inx) => {
    const detail: any = checkedDeliverList.value.find(itemA => itemA.deliveryId == item.deliveryId);
    if (detail) {
      receiveList.value[inx] = setListPriceInfo(item, detail);
    }
  });
  console.log("receiveList ....", receiveList.value)
  console.log("backList ....", backList.value);
  console.log("changeList ....", changeOrderList.value);
  //记住修改数值后重新计算一次总金额
  if (checkedDeliverList.value && checkedDeliverList.value.length > 0) {
    checkedDeliverList.value.forEach((item, inx) => {
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id)
      if (crtM) {
        item.checkQuantity = crtM?.checkQuantity ? crtM.checkQuantity : 0;
        item.discountPrice = crtM?.discountPrice ? crtM.discountPrice : 0;
        item.totalPrice = crtM?.totalPrice ? crtM.totalPrice : 0;
        item.checkRemark = crtM?.checkRemark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
      }
    });
  }
  console.log("checkedDeliverList======== ....", checkedDeliverList.value);
  if (checkedOrderBackOutDetailList.value && checkedOrderBackOutDetailList.value.length > 0) {
    checkedOrderBackOutDetailList.value.forEach((item, inx) => {
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id)
      if (crtM) {
        item.checkQuantity = crtM?.checkQuantity ? crtM.checkQuantity : 0;
        item.totalPrice = crtM?.totalPrice ? crtM.totalPrice : 0;
        item.checkRemark = crtM?.checkRemark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
      }
    });
  }

}
const setListPriceInfo = (item: any, obj: any) => {
  if (!obj) {
    return;
  }
  console.log("setListPriceInfo", obj?.price);
  console.log("setListPriceInfo orderPrice", item.orderPrice);
  //编辑状态下的缓存数据的price重新赋值，兼容新增单价逻辑

  item.orderPrice = item.orderPrice ? item.orderPrice : obj?.price;
  //非编辑、或者第一次加载需要赋值
  if (inOrOutQuery.value.queryType != "1" || !item?.unInitEditPrice) {
    item.checkQuantity = obj?.quantity;
    item.discountPrice = obj?.discountPrice;
    item.checkRemark = obj?.remark;
    item.totalPrice = obj?.totalPrice ? obj?.totalPrice : 0;
  }
  return item;
}
const handleInOrOutQuery = async () => {
  resetChecked();
  inOrOutQuery.value.pageNum = 1;
  firstSearch.value = false;
  //removeUnCust();
  await getAddListRecord();
}
const resetChecked = () => {

  backList.value = [];
  receiveList.value = [];
  checkedOrderBackOutDetailList.value = [];
  checkedDeliverList.value = [];
  changeOrderList.value = [];
  //accountOrderOtherList.value = [];
  //selectedOrderOtherList.value = [];
}
//设置表单信息
const setSupplierInfo = async (value: string) => {

  if (!value) {
    inOrOutQuery.value.currency = undefined;
    return;
  }
  let customer = customerList.value.find(item => item.id === value);
  if (customer) {
    inOrOutQuery.value.currency = customer.currency;
    if (customer.dayNumberLimit && inOrOutQuery.value.accountTime) {
      inOrOutQuery.value.endTime = dayjs(inOrOutQuery.value.accountTime).add(customer.dayNumberLimit, 'day').format('YYYY-MM-DD');
    }
  }
  console.log("setSupplierInfo", customer);
};

const handlePriceBlur = (row: any) => {
  console.log("handlePriceBlur row.checkQuantity", row);
};
// 存储修改的数据
const changeOrderListHandle = (row: any) => {
  const index = changeOrderList.value.findIndex((item: any) => item.id == row.id)
  if (index == -1) {
    changeOrderList.value.push(row)
  } else {
    changeOrderList.value.splice(index, 1, row)
  }
  // console.log('changeOrderList.value', changeOrderList.value)
}
/**
 * 计算价格
 * @param data
 */
const calculatePrice = async (row: any) => {
  let price = row.orderPrice ? row.orderPrice : 0;
  let quantity = row.checkQuantity ? row.checkQuantity : 0;
  let discountPrice = row.discountPrice ? row.discountPrice : 0;
  console.log("000000calculatePrice00000000000", row);
  if (!quantity) {
    row.checkQuantity = 0;
  }
  if (!price || !quantity) {
    row.totalPrice = 0;
    return;
  }
  //非首次加载，触发一次计算后，不在设置默认值
  console.log("firstInitEditPrice.value", firstInitEditPrice.value);
  if (!firstInitEditPrice.value) {
    row.unInitEditPrice = true;
  }

  let _otherCost: number = Number(row.mouldCost) + Number(row.testFrameCost) + Number(row.engineeringCost)
    + Number(row.flyProbeCost) + Number(row.sampleCost) + Number(row.expeditedCost) + Number(row.otherCost);
  price = (price * 10000).toFixed(2);
  quantity = (quantity * 10000).toFixed(2);
  let amount = price * quantity / 100000000;
  if (_otherCost) {
    console.log("_otherCost", _otherCost);
    row.totalPrice = Number(amount) - Number(discountPrice) + Number(_otherCost);
  } else {
    row.totalPrice = Number(amount) - Number(discountPrice);
  }
  //重新设置当前页选中数据使得响应式生效
  doCurRefreshCheck();

  console.log('checkedOrderBackOutDetailList', checkedOrderBackOutDetailList.value, row)
  // console.log('tempChoose', tempChoose)
  // 在修改了数据后,保留修改的数据,以便在切换页码后,用修改的数据去替换
  changeOrderListHandle(row)
};
const doCurRefreshCheck = () => {
  if (checkedOrderBackOutDetailList.value) {
    const tempList1 = backTableRef.value.xTableRef.getCheckboxRecords();
    checkedOrderBackOutDetailList.value = checkedOrderBackOutDetailList.value.map(item => {
      tempList1.find((item2: any) => {
        if (item2.id == item.id) {
          item = item2;
        }
      })
      return item;
    })
  }
  if (checkedDeliverList.value) {
    const tempList2 = deliverTableRef.value.xTableRef.getCheckboxRecords();
    checkedDeliverList.value = checkedDeliverList.value.map(item => {
      tempList2.find((item2: any) => {
        if (item2.id == item.id) {
          item = item2;
        }
      })
      return item;
    })
  }
};


const calculateTotalPriceByType = (list: any, _type: any, fieldName: string) => {
  console.log('111111-----------------', list)
  if (!list) {
    return 0;
  }
  const resNum = list
    .filter((item: any) => {
      let validType = true;
      if (_type) {
        validType = item.type == _type
      }
      return item[fieldName] && validType
    })
    .reduce((total: any, item: any) => {
      let totalTmp = total * 100000000;
      let _tmp = item[fieldName] * 100000000;
      return (totalTmp + _tmp) / 100000000
    }, 0);
  return resNum;
};

//外付 总金额
const borrowTotalPrice = computed(() => {
  console.log('2222--------', checkedDeliverList.value)
  return calculateTotalPriceByType(checkedDeliverList.value, undefined, "totalPrice").toFixed(2);
});
//外付 总退货金额
const backTotalPrice = computed(() => {
  return calculateTotalPriceByType(checkedOrderBackOutDetailList.value, undefined, "totalPrice").toFixed(2);
});

//外付 总折扣金额
const borrowDiscountTotalPrice = computed(() => {
  return calculateTotalPriceByType(checkedDeliverList.value, undefined, "discountPrice").toFixed(2);
});

//入金总金额
const otherRecoverTotalPrice = computed(() => {
  return calculateTotalPriceByType(selectedOrderOtherList.value, "1", "price").toFixed(2);
});
//出金总金额
const otherOutTotalPrice = computed(() => {
  return calculateTotalPriceByType(selectedOrderOtherList.value, "2", "price").toFixed(2);
});

const handleSubmit = () => {
  outForm.value.status = StatusEnum.BE_AUDITED;
  doSave();
}

const handleSave = () => {
  if (!outForm.value.status || outForm.value.status != StatusEnum.REJECTED) {
    outForm.value.status = StatusEnum.BE_SUBMITTED;
  }
  doSave();
}

const doSave = async () => {
  setListInfoBefore();
  const vad = await validateForm();
  if (!vad) {
    return;
  }
  //得到供应商id
  console.log(" doSave inOutForm.value======", outForm.value);
  console.log(" doSave inOrOutQuery.value======", inOrOutQuery.value);
  Object.assign(outForm.value, inOrOutQuery.value);
  //类型
  outForm.value.type = TypeEnum.SALE;
  outForm.value.accountPrice = borrowTotalPrice.value;
  outForm.value.accountDiscountPrice = borrowDiscountTotalPrice.value;
  outForm.value.accountMonth = inOrOutQuery.value.accountMonth;
  outForm.value.otherPrice = BigNumber(otherRecoverTotalPrice.value).minus(BigNumber(otherOutTotalPrice.value));
  let payableAmount = BigNumber(borrowTotalPrice.value).minus(BigNumber(backTotalPrice.value)).minus(BigNumber(otherOutTotalPrice.value)).plus(BigNumber(otherRecoverTotalPrice.value)).toNumber();
  outForm.value.payablePrice = payableAmount;
  outForm.value.backPrice = backTotalPrice.value;
  setListInfo();
  console.log(" doSave inOutForm.value", outForm.value);

  if (outForm.value.id == undefined) {
    addAccountOrder(outForm.value).then(res => {
      proxy?.$modal.msgSuccess("修改成功");
      drawerBorrow.visible = false;
      currentAccountOrderId.value = undefined;
      getAllList();
    }).catch(err => {
      //由于id是前端生成，传到后端会导致新增id不对，所以保存前会清空，此处报错需要重新赋值回来
      outForm.value.otherOrderBoList = outForm.value.otherOrderBoList.map(item => {
        item.id = item.oldId;
        return item;
      })
    })
  } else {
    updateAccountOrder(outForm.value).then(res => {
      proxy?.$modal.msgSuccess("修改成功");
      drawerBorrow.visible = false;
      currentAccountOrderId.value = undefined;
      getAllList();
    }).catch(err => {
      //由于id是前端生成，传到后端会导致新增id不对，所以保存前会清空，此处报错需要重新赋值回来
      outForm.value.otherOrderBoList = outForm.value.otherOrderBoList.map(item => {
        item.id = item.oldId;
        return item;
      })
    })
  }
}

const setListInfoBefore = () => {
  if (checkedDeliverList.value) {
    checkedDeliverList.value = checkedDeliverList.value.map(item1 => {
      let item2 = receiveList.value.find(item2 => item2.id === item1.deliveryId);
      if (item2) {
        // 通过 id 赋值
        console.log("item1", item1);
        console.log("item2", item2);
        item1.orderPrice = item2?.orderPrice;
        item1.checkQuantity = item2?.checkQuantity;
        item1.checkRemark = item2?.checkRemark;
        item1.discountPrice = item2?.discountPrice;
        item1.totalPrice = item2?.totalPrice;
        item1.saleOrderId = item2?.bizId;
      }
      return item1
    });
    console.log("deliverDetail", checkedDeliverList.value)
  }
}

const setListInfo = () => {
  console.log("setListInfo1", receiveList);
  console.log("setListInfo22", checkedDeliverList.value);
  //退货单参数set
  if (checkedOrderBackOutDetailList) {
    const _backList: any = [];
    Object.assign(_backList, checkedOrderBackOutDetailList.value);
    buildBackList(_backList);
    outForm.value.orderSaleDetailBoList = _backList;

  }
  //收货单参数set
  if (checkedDeliverList) {
    const _receiveList: any = [];
    const deliverDetail = receiveList.value.filter((item: any) => {
      return checkedDeliverList.value.some((item2: any) => item.id == item2.deliveryId);
    });
    console.log("deliverDetail", deliverDetail)
    Object.assign(_receiveList, checkedDeliverList.value);
    buildReceiveList(_receiveList);
    outForm.value.orderSaleDetailBoList = outForm.value.orderSaleDetailBoList?.concat(_receiveList);
    console.log("=======setListInfo========_receiveList", _receiveList)
  }
  //设置其他金额
  if (accountOrderOtherList.value) {
    outForm.value.otherOrderBoList = accountOrderOtherList.value;
    if (outForm.value.id == undefined) {
      outForm.value.otherOrderBoList = outForm.value.otherOrderBoList.map(item => {
        item.oldId = item.id;
        item.id = undefined;
        return item;
      })
    } else {
      outForm.value.otherOrderBoList = outForm.value.otherOrderBoList.map(item => {
        if (item.id.indexOf("row") > -1) {
          item.oldId = item.id;
          item.id = undefined;
        }
        return item;
      })
    }
  }
}

const buildReceiveList = (_receiveList: any) => {
  console.log("buildReceiveList", _receiveList);
  _receiveList.forEach((item: any) => {
    item.currency = outForm.value.currency ? outForm.value.currency : '';
    item.type = SALETYPEENUM.SALE_DELIVER;
    item.isTax = item.isTax ? item.isTax : outForm.value.isTax;

    item.commodityInOutRecordId = item.commodityInOutRecordId ? item.commodityInOutRecordId : item.id;
    if (outForm.value.id == undefined) {
      item.deliveryId = item.commodityInOutRecordId;
      item.saleOrderId = item.saleOrderId ? item.saleOrderId : item.bizId;
      item.id = undefined;
    } else {
      item.deliveryId = item.id;
      item.id = undefined;
    }
    item.status = outForm.value.status;
    item.price = item.orderPrice;
    item.remark = item.checkRemark;
    item.quantity = item.checkQuantity;
    item.discountPrice = item.discountPrice ? item.discountPrice : 0;
  });
}
const buildBackList = (backList: any) => {
  backList.forEach((item: any) => {
    item.currency = outForm.value.currency ? outForm.value.currency : '';
    item.type = SALETYPEENUM.SALE_BACK;
    item.isTax = item.isTax ? item.isTax : outForm.value.isTax;

    if (outForm.value.id == undefined) {
      item.saleOrderBackId = item.saleOrderBackId ? item.saleOrderBackId : item.id;
      item.id = undefined;
    }
    item.price = item.price;
    item.remark = item.checkRemark;
    item.quantity = item.checkQuantity;
    item.discountPrice = 0;
    item.status = outForm.value.status;
  });
}
/*********** 新增验证 ******start*/
const validateForm = async () => {
  let res: any = false;
  await addTabFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      res = true;
    }
  });
  if (!res) {
    return res;
  }
  if (checkedOrderBackOutDetailList.value.length == 0
    && checkedDeliverList.value.length == 0
    && accountOrderOtherList.value.length == 0) {
    proxy?.$modal.msgError("请选择退货单/收货单、或填写其他金额");
    return false;
  }
  const listTab = await validateList();
  res = res && listTab;
  return res;
}
const validateList = async () => {
  let finLinValid = true;
  let wangbanValid = true;
  let supplierValid = true;
  let taxValid = true;
  let res = true;
  let errMsg = "请填写核对数量、扣款金额到勾选的退货单";
  let wbErrMsg = "请填写核对数量、扣款金额到勾选的采购单";
  let noList = "";
  let wbnoList = "";
  let feiLinSupplier: any;
  let wangbanSupplier: any;
  const formSupplierId = inOrOutQuery.value.customerId;
  const formIsTax = inOrOutQuery.value.isTax;
  if (checkedOrderBackOutDetailList.value.length > 0) {
    console.log("formIsTax", formIsTax)
    console.log("checkedOrderBackOutDetailList", checkedOrderBackOutDetailList.value)
    taxValid = checkedOrderBackOutDetailList.value.some((item: any) => {
      let itemTax = item.isTax ? item.isTax : item.rawOrderBackVoList[0].isTax;
      return itemTax !== formIsTax;
    });
    console.log("taxValid", taxValid)
    if (taxValid) {
      proxy?.$modal.msgError("主单含税类型与所选单据含税类型不一致");
      return false;
    }

    feiLinSupplier = checkedOrderBackOutDetailList.value[0]?.customerId;
    supplierValid = !checkedOrderBackOutDetailList.value.some((item: any) => {
      return item.customerId !== feiLinSupplier;
    });
    checkedOrderBackOutDetailList.value.forEach((item: any) => {
      if (!item.checkQuantity) {
        if (finLinValid) {
          finLinValid = false;
        }
        noList += item.code + "、";
      }
    });
  }
  if (checkedDeliverList.value.length > 0) {
    console.log("formIsTax2", formIsTax)
    taxValid = checkedDeliverList.value.some((item: any) => {
      return item.isTax !== formIsTax;
    });
    console.log("taxValid2", taxValid)
    if (taxValid) {
      proxy?.$modal.msgError("主单含税类型与所选单据含税类型不一致");
      return false;
    }


    wangbanSupplier = checkedDeliverList.value[0]?.customerId;
    supplierValid = !checkedDeliverList.value.some((item: any) => {
      return item.customerId !== wangbanSupplier;
    });
    checkedDeliverList.value.forEach((item: any) => {
      if (!item.checkQuantity || (item.discountPrice != 0 && (item.discountPrice == undefined || item.discountPrice == '' || item.discountPrice == null))) {
        if (wangbanValid) {
          wangbanValid = false;
        }
        wbnoList += item.code + "、";
      }
    });
  }
  console.log("formSupplierId", formSupplierId, "feiLinSupplier", feiLinSupplier, "wangbanSupplier", wangbanSupplier)
  console.log("feiLinSupplier", checkedOrderBackOutDetailList.value, "wangbanSupplier", checkedDeliverList.value)
  console.log("supplierValid", supplierValid)
  if (feiLinSupplier && wangbanSupplier && (feiLinSupplier != wangbanSupplier)) {
    supplierValid = false;
  }
  if (supplierValid) {
    let listSup = feiLinSupplier ? feiLinSupplier : wangbanSupplier;
    if (formSupplierId != listSup) {
      supplierValid = false;
    }
  }
  if (!supplierValid) {
    proxy?.$modal.msgError("客户不一致，请重新选择");
    return false;
  }
  if (!finLinValid) {
    errMsg += noList;
    proxy?.$modal.msgError(errMsg);
    res = false;
  }
  if (!wangbanValid) {
    wbErrMsg += wbnoList;
    proxy?.$modal.msgError(wbErrMsg);
    res = false;
  }
  return res;
}
/*********** 新增验证 ******end*/


/** 审核驳回 */
const reject = async (id: string | number | undefined) => {
  updateStatus(id, StatusEnum.REJECTED);
}
/** 审核通过 */
const examinePass = async (id: string | number | undefined) => {
  updateStatus(id, StatusEnum.AUDITED);
}

const updateStatus = (id: any, status: string) => {
  updateAccountOrderStatus({ id, status }).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
    getAllList();
    drawerBorrow.visible = false;
    currentAccountOrderId.value = undefined;
  });
}
/************aduit 审核操作 end ***********/


const handleSelectionChange = () => {
  const $table = aduitTableRef.value.xTableRef
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
      backgroundColor: '#FFB6C1'
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

/** 其他金额 *************start**********/
const handleUpdateOther = async (row: AccountOrderOtherVO) => {
  otherMoneyDialog.title = "修改其他金额";
  otherMoneyDialog.visible = true;
  Object.assign(otherForm.value, row);
}
/** 删除其他金额按钮操作 */
const handleDeleteOther = async (row: AccountOrderOtherVO) => {
  await proxy?.$modal.confirm('是否确认删除？').finally(() => loading.value = false);
  if (row.id != undefined) {
    accountOrderOtherList.value = accountOrderOtherList.value.filter(item => item.id != row.id);
    selectedOrderOtherList.value = selectedOrderOtherList.value.filter(item => item.id != row.id);
  } else {
    accountOrderOtherList.value = accountOrderOtherList.value.filter(item => item.index != row.index);
    selectedOrderOtherList.value = selectedOrderOtherList.value.filter(item => item.index != row.index);
  }
  proxy?.$modal.msgSuccess("删除成功");
}

const otherCancel = async () => {
  otherMoneyDialog.visible = false;
}
const otherMoneyHandle = async () => {
  otherForm.value = { ...initOtherFormData };
  otherForm.value.recordTime = inOrOutQuery.value.accountTime;
  otherMoneyDialog.title = "其他金额";
  otherMoneyDialog.visible = true;
  //tab切换回其他金额
  tabRadioTable.value = "其他金额";
}
//其他金额表单 全选
const selectOtherAllChangeEvent: VxeTableEvents.CheckboxAll<AccountOrderOtherVO> = ({ checked }) => {
  refreshListCheck();
}
//其他金额表单 单选
const selectOtherChangeEvent: VxeTableEvents.CheckboxChange<AccountOrderOtherVO> = ({ checked, row }) => {
  console.log(checked, row);
  refreshListCheck();
}
/** 其他金额确认按钮 */
const otherSubmitForm = () => {
  accountOrderOtherFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      let accountOrderOtherVO: AccountOrderOtherVO = {
        id: otherForm.value.id,
        type: otherForm.value.type,
        createByName: nickname,
        price: otherForm.value.price,
        remark: otherForm.value.remark,
        accountOrderId: otherForm.value.accountOrderId,
        recordTime: otherForm.value.recordTime,
        index: otherForm.value.index,
        createTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
      }
      //修改
      if (otherForm.value.id) {
        accountOrderOtherList.value = accountOrderOtherList.value.map(item => {
          if (item.id == otherForm.value.id) {
            return accountOrderOtherVO;
          }
          return item;
        });
      } else {
        if (otherForm.value.index) {
          accountOrderOtherList.value = accountOrderOtherList.value.map(item => {
            if (item.index == otherForm.value.index) {
              item.price = otherForm.value.price;
              item.remark = otherForm.value.remark;
              item.type = otherForm.value.type;
              item.recordTime = otherForm.value.recordTime;
              return item;
            }
            return item;
          });
        } else {
          accountOrderOtherVO.createTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
          accountOrderOtherVO.index = Math.random();
          accountOrderOtherList.value.push(accountOrderOtherVO);
        }
      }
      if (selectedOrderOtherList.value && selectedOrderOtherList.value.length > 0) {
        selectedOrderOtherList.value.map(item => {
          accountOrderOtherList.value.find(item2 => {
            if (item2.id == item.id) {
              item = item2;
            }
          })
          return item;
        });

      }
      let otherTabProxy = otherPriceTableRef.value.xTableRef.getCheckboxRecords();
      otherTabProxy.map(tabItem => {
        accountOrderOtherList.value.find(item2 => {
          if (item2.id == tabItem.id) {
            tabItem.price = item2.price;
            tabItem.remark = item2.remark;
            tabItem.type = item2.type;
            tabItem.recordTime = item2.recordTime;
          }
        })
        return tabItem;
      });

      console.log(" addd  selectedOrderOtherList.....", selectedOrderOtherList.value)
      otherMoneyDialog.visible = false;
    }
  });
}
/** 其他金额 ********END**********/

/** 删除按钮操作 */
const handleDelete = async (row?: OrderFilinOutDetailVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除对账单编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
  await delAccountOrderNew(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getAllList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('financial/orderFilinOutDetail/export', {
    ...queryParams.value
  }, `orderFilinOutDetail_${new Date().getTime()}.xlsx`)
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

const handleSubmitAduit = async () => {
  const _tableRef = XTableRef.value.xTableRef;
  const checkList = _tableRef.getCheckboxReserveRecords().concat(_tableRef.getCheckboxRecords());
  console.log("checkList", checkList);
  if (checkList.length == 0) {
    await proxy?.$modal.msgError("请选择需要提交审核的数据");
    return;
  }
  //如果存在状态不是未提交和已审核则不能提交
  let _statusList = checkList.map((item: any) => item.status);
  if (_statusList.includes('4') || _statusList.includes('2')) {
    await proxy?.$modal.msgError("存在已审核或待审核的数据，不能提交");
    return;
  }
  await proxy?.$modal.confirm('是否确认提交审核所选对账单');
  let _idList = checkList.map((item: any) => item.id);
  let detailQuery = {
    accountOrderIds: _idList,
  };

  await proxy?.$modal.loading("提交审核...");
  submitAuditOrderSale(detailQuery).then(res => {
    proxy?.$modal.msgSuccess("提交审核成功");
    getList();
  });
  _tableRef.clearCheckboxRow();
  _tableRef.clearCheckboxReserve();
  await proxy?.$modal.closeLoading();
}

const submitSelectableFun = (scope: any) => {
  //当前选择状态为已审核或者待，禁选
  if (scope.row.status == '4' || scope.row.status == '2') {
    return false;
  }
  return true;
}


onMounted(() => {
  tabColumnList.value = props.tabPaneColumnList1;
  backColumnList.value = props.tabPaneColumnList2;
  receiveList.value = props.dataList1;
  backColumnList.value = props.dataList2;
  drawerBorrow = props.drawer;
  emits('tabSearchChange1');
});

defineExpose({ handleDetail ,handleSave,handleSubmit,examinePass,reject,handleAdd})

/****************************抽屉结束 */
</script>
```
