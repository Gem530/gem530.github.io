<template>
  <el-dialog v-model="openFlag" title="对账单冲销" width="60%" draggable @close="closeDialog">
    <el-divider content-position="center"> 已选账单信息</el-divider>
    <XTable v-if="!isRepayment" :data="writeOffList" :pageShow="false"
      :columnList="props.titleColumnList ? props.titleColumnList : writeOffSelectedColumnList" width border
      :column-config="{ resizable: true }" max-height="300">
      <template #default-endTime="scope">
        <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #default-accountTime="scope">
        <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #default-accountMonth="scope">
        <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
      </template>
    </XTable>

    <XTable v-else-if="isRepayment && props.isSupplier" :data="writeOffList" :pageShow="false"
      :columnList="props.titleColumnList ? props.titleColumnList : writeOffSelectedColumnList" width border
      :column-config="{ resizable: true }" max-height="300">
      <template #default-endTime="scope">
        <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #default-accountTime="scope">
        <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #default-accountMonth="scope">
        <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
      </template>
    </XTable>


    <XTable v-else :data="writeOffList" :pageShow="false"
      :columnList="props.titleColumnList ? props.titleColumnList : custWriteOffSelectedColumnList" width border
      :column-config="{ resizable: true }" max-height="300">
      <template #default-endTime="scope">
        <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #default-accountTime="scope">
        <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #default-accountMonth="scope">
        <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
      </template>
    </XTable>
    <el-divider content-position="center"> 待选{{ typeTitle }}款单信息</el-divider>

    <XTable v-if="!isRepayment" :pageShow="false" :intervalCondition="intervalCondition" :data="repaymentRecordList"
      :columnList="paymentColumnList" ref="paymentTableRef" @checkbox-all="selectPaymentAllChangeEvent"
      @checkbox-change="selectPaymentChangeEvent" border @searchChange="searchChange" max-height="300"
      :column-config="{ resizable: true }">
      <template #default-payDate="scope">
        <span>{{ parseTime(scope.row.payDate, '{y}-{m}-{d}') }}</span>
      </template>
      <template #default-payWay="scope">
        <dict-tag :options="payWayList" :value="scope.row.payWay" />
      </template>
      <template #default-payExpireDate="scope">
        <span>{{ parseTime(scope.row.payExpireDate, '{y}-{m}-{d}') }}</span>
      </template>
    </XTable>


    <XTable v-if="isRepayment && props.isSupplier" :pageShow="false" :intervalCondition="intervalCondition"
      :data="repaymentRecordList" :columnList="supplierPaymentColumnList" ref="paymentTableRef"
      @checkbox-all="selectPaymentAllChangeEvent" @checkbox-change="selectPaymentChangeEvent" border
      @searchChange="searchChange" max-height="300" :column-config="{ resizable: true }">
      <template #default-payDate="scope">
        <span>{{ parseTime(scope.row.payDate, '{y}-{m}-{d}') }}</span>
      </template>
      <template #default-payWay="scope">
        <dict-tag :options="payWayList" :value="scope.row.payWay" />
      </template>
      <template #default-payExpireDate="scope">
        <span>{{ parseTime(scope.row.payExpireDate, '{y}-{m}-{d}') }}</span>
      </template>
    </XTable>

    <XTable v-else-if="isRepayment" :pageShow="false" :intervalCondition="intervalCondition" :data="repaymentRecordList"
      :columnList="custPaymentColumnList" ref="paymentTableRef" @checkbox-all="selectPaymentAllChangeEvent"
      @checkbox-change="selectPaymentChangeEvent" border @searchChange="searchChange" max-height="300"
      :column-config="{ resizable: true }">
      <template #default-payDate="scope">
        <span>{{ parseTime(scope.row.payDate, '{y}-{m}-{d}') }}</span>
      </template>
      <template #default-payWay="scope">
        <dict-tag :options="payWayList" :value="scope.row.payWay" />
      </template>
      <template #default-payExpireDate="scope">
        <span>{{ parseTime(scope.row.payExpireDate, '{y}-{m}-{d}') }}</span>
      </template>
    </XTable>


    <template #footer>
      <div style="display: flex; justify-content: center;">
        <span class="dialog-footer">
          <el-button :loading="buttonLoading" @click="writeOffCancel">取消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="handleWriteOffSave">保存</el-button>
        </span>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="writeOffDialog" lang="ts">
import { VxeTableEvents } from "vxe-table";
import { AccountOrderVO, AccountMaterialInOutVo } from '@/api/financial/accountOrder/types';
import { ref } from "vue";
import { RepaymentRecordVO, RepaymentRecordQuery } from '@/api/financial/repaymentRecord/types';
import { payWriteOffAccountOrder, repayWriteOffAccountOrder, writeOffAccountOrder, getPaymentList } from '@/api/financial/accountOrder';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const payWayList = ref([
  // {label: '支付宝', value: '1', elTagType: 'default', elTagClass: ''},
  // {label: '微信', value: '2', elTagType: 'default', elTagClass: ''},
  { label: '现金', value: '3', elTagType: 'default', elTagClass: '' },
  // {label: '赊账', value: '4', elTagType: 'default', elTagClass: ''}
  { label: '转账', value: '5', elTagType: 'default', elTagClass: '' },
  { label: '电子银承', value: '6', elTagType: 'default', elTagClass: '' },
  { label: '电子商承', value: '7', elTagType: 'default', elTagClass: '' },
  { label: '纸质银承', value: '8', elTagType: 'default', elTagClass: '' },
  { label: '支票', value: '9', elTagType: 'default', elTagClass: '' },
  { label: '委托书', value: '10', elTagType: 'default', elTagClass: '' },
]);


const isRepayment = ref(false);
const emits = defineEmits(['update:open', 'getList', 'close'])
const props = withDefaults(defineProps<{
  open: boolean
  type: string
  writeOffList: any,
  //是否为客户类型
  isSupplier?: boolean,
  titleColumnList?: Array<any>
}>(), {
  open: false,
  type: '1',
  writeOffList: [],
  isSupplier: false,
  titleColumnList: undefined
})
const closeDialog = () => {
  emits('close')
}
const openFlag = computed({
  get() {
    return props.open
  },
  set(val) {
    emits('update:open', val)
  }
})

const typeTitle = ref('收');
const buttonLoading = ref(false);

//选中的付款单列表
const selectedRepaymentRecordList = ref<RepaymentRecordVO[]>([]);

//已选中的对账单
const writeOffList = ref<AccountOrderVO[]>([]);
//付款单列表
const repaymentRecordList = ref<RepaymentRecordVO[]>([]);
const paymentTableRef = ref()
const intervalCondition = ['accountMonth', 'accountTime'];

//冲销页面 已选对账单列表
const writeOffSelectedColumnList = ref([
  { width: '40', title: '序号', type: 'seq', align: 'center', },
  { width: '100', title: '对账单号', field: 'code', align: 'center', },
  { width: '140', title: '供应商编码', field: 'supplierCode', align: 'center', },
  { width: '140', title: '供应商', field: 'supplierName', align: 'center', },
  { width: '100', title: '对账日期', field: 'accountTime', align: 'center', },
  { width: '100', title: '对账月份', field: 'accountMonth', align: 'center', },
  { width: '100', title: '对账金额', field: 'accountPrice', align: 'center', },
  { width: '100', title: '退货金额', field: 'backPrice', align: 'center', },
  { width: '100', title: '折扣金额', field: 'accountDiscountPrice', align: 'center', },
  { width: '100', title: '应付金额', field: 'payablePrice', align: 'center', },
  { width: '100', title: '已付款金额', field: 'writeOffPrice', align: 'center', },
  { width: '120', title: '剩余应付金额', field: 'remainPayablePrice', align: 'center', },
]);

const custWriteOffSelectedColumnList = ref([
  { width: '40', title: '序号', type: 'seq', align: 'center', },
  { width: '100', title: '对账单号', field: 'code', align: 'center', },
  { width: '140', title: '客户编码', field: 'customerCode', align: 'center', },
  { width: '140', title: '客户', field: 'customerName', align: 'center', },
  { width: '100', title: '对账日期', field: 'accountTime', align: 'center', },
  { width: '100', title: '对账月份', field: 'accountMonth', align: 'center', },
  { width: '100', title: '对账金额', field: 'accountPrice', align: 'center', },
  { width: '100', title: '退货金额', field: 'backPrice', align: 'center', },
  { width: '100', title: '扣款金额', field: 'accountDiscountPrice', align: 'center', },
  { width: '100', title: '应收金额', field: 'payablePrice', align: 'center', },
  { width: '100', title: '已收款金额', field: 'writeOffPrice', align: 'center', },
  { width: '120', title: '剩余应收金额', field: 'remainPayablePrice', align: 'center', },
]);

const paymentColumnList = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '40', },
  { width: '40', title: '序号', type: 'seq', align: 'center', },
  { width: '100', title: '付款单号', field: 'code', align: 'center', filterType: 'input' },
  { width: '140', title: '供应商', field: 'supplierName', align: 'center', },
  { width: '140', title: '供应商编号', field: 'supplierCode', align: 'center', },
  { width: '100', title: '付款日期', field: 'payDate', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD' } },
  { title: '付款方式', field: 'payWay', width: '100', align: 'center', filterType: 'checkboxButton', filterParam: { placeholder: '请选择付款方式' }, filterData: () => payWayList.value },
  { title: '票据号码', width: '140', field: 'payCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入票据号码' } },
  { width: '140', title: '票据到期日', field: 'payExpireDate', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请输入票据到期日', valueFormat: 'YYYY-MM-DD' } },
  { width: '100', title: '付款金额', field: 'totalPrice', align: 'center', },
  { width: '100', title: '付款余额', field: 'balance', align: 'center', },
]);
const supplierPaymentColumnList = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '40', },
  { width: '40', title: '序号', type: 'seq', align: 'center', },
  { width: '100', title: '收款单号', field: 'code', align: 'center', filterType: 'input' },
  { width: '140', title: '供应商', field: 'supplierName', align: 'center', },
  { width: '140', title: '供应商编号', field: 'supplierCode', align: 'center', },
  { width: '100', title: '收款日期', field: 'payDate', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD' } },
  { title: '付款方式', field: 'payWay', width: '100', align: 'center', filterType: 'checkboxButton', filterData: () => payWayList.value },
  { title: '票据号码', width: '140', field: 'payCode', align: 'center', filterType: 'input', },
  { width: '140', title: '票据到期日', field: 'payExpireDate', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD' } },
  { width: '100', title: '收款金额', field: 'totalPrice', align: 'center', },
  { width: '100', title: '收款余额', field: 'balance', align: 'center', },
]);
const custPaymentColumnList = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '40', },
  { width: '40', title: '序号', type: 'seq', align: 'center', },
  { width: '100', title: '收款单号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入收款单号' } },
  { width: '140', title: '客户编码', field: 'customerCode', align: 'center' },
  { width: '140', title: '客户', field: 'customerName', align: 'center' },
  { width: '100', title: '收款日期', field: 'payDate', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请输入收款日期', valueFormat: 'YYYY-MM-DD' } },
  { title: '付款方式', field: 'payWay', width: '100', align: 'center', filterType: 'checkboxButton', filterParam: { placeholder: '请选择付款方式' }, filterData: () => payWayList.value },
  { title: '票据号码', width: '140', field: 'payCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入票据号码' } },
  { width: '140', title: '票据到期日', field: 'payExpireDate', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请输入票据到期日', valueFormat: 'YYYY-MM-DD' } },
  { width: '100', title: '收款金额', field: 'totalPrice', align: 'center', },
  { width: '100', title: '收款余额', field: 'balance', align: 'center', },
]);

const queryParams = ref<RepaymentRecordQuery>({
  totalPrice: undefined,
  writeOffPrice: undefined,
  balance: undefined,
  type: undefined,
  supplierId: undefined,
  payDate: undefined,
  payCode: undefined,
  payExpireDate: undefined,
  payWay: undefined,
  accountNumber: undefined,
  isUploadedReceipt: undefined,
  status: undefined,
});

// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  getPaymentRecordList();
}

/** 获取收付款记录*/
const getPaymentRecordList = async () => {
  console.log("writeOffList?.value[0]?.supplierId", writeOffList?.value[0]?.supplierId);
  console.log("writeOffList?.value[0]?.customerId", writeOffList?.value[0]?.customerId);
  //付
  if (props.type == '1') {
    if (writeOffList?.value[0]?.supplierId) {
      queryParams.value.supplierId = writeOffList?.value[0]?.supplierId;
      queryParams.value.type = props.type;
      console.log("queryParams", queryParams.value);
      const res = await getPaymentList(queryParams.value);
      repaymentRecordList.value = res.data;
    }
  } else {
    if (writeOffList?.value[0]?.customerId) {
    queryParams.value.customerId = writeOffList?.value[0]?.customerId;
    queryParams.value.type = props.type;
    console.log("queryParams", queryParams.value);
    const res = await getPaymentList(queryParams.value);
    repaymentRecordList.value = res.data;
  }
  }


  // if (writeOffList?.value[0]?.supplierId) {
  //   queryParams.value.supplierId = writeOffList?.value[0]?.supplierId;
  //   queryParams.value.type = props.type;
  //   console.log("queryParams", queryParams.value);
  //   const res = await getPaymentList(queryParams.value);
  //   repaymentRecordList.value = res.data;
  // } else 

}

/** 取消按钮 */
const writeOffCancel = () => {
  openFlag.value = false;
  repaymentRecordList.value = [];
}

//冲销确认
const handleWriteOffSave = () => {

  if (writeOffList.value.length == 0) {
    proxy?.$modal.msgSuccess("请选择对账单");
    return;
  }
  if (selectedRepaymentRecordList.value.length == 0) {
    proxy?.$modal.msgSuccess("请选择" + typeTitle.value + "款单");
    return;
  }
  if (selectedRepaymentRecordList.value.some(item => item.supplierId != selectedRepaymentRecordList.value[0].supplierId)) {
    proxy?.$modal.msgSuccess("所选的" + typeTitle.value + "款单不是同一个供应商");
    return;
  }
  //得到所有对账单id
  let accountOrderIds = writeOffList.value.map(item => item.id);
  //得到付款单id
  let paymentIds = selectedRepaymentRecordList.value.map(item => item.id);
  buttonLoading.value = true;
  if (props.type == '1') {
    let payQuery={ accountOrderIds, paymentIds }
    payQuery.isPayType='1';
    payWriteOffAccountOrder(payQuery).then(res => {
      proxy?.$modal.msgSuccess("冲销成功");
      emits('getList');
      openFlag.value = false;
    }).finally(() => { buttonLoading.value = false; });
  } else {
    repayWriteOffAccountOrder({ accountOrderIds, paymentIds }).then(res => {
      proxy?.$modal.msgSuccess("冲销成功");
      emits('getList');
      openFlag.value = false;
    }).finally(() => { buttonLoading.value = false; });
  }
}
//冲销表单 选择付款单
const selectPaymentChangeEvent: VxeTableEvents.CheckboxChange<AccountMaterialInOutVo> = () => {
  const $table = paymentTableRef.value.xTableRef
  if ($table) {
    const records = $table.getCheckboxRecords()
    selectedRepaymentRecordList.value = records;
  }
}
//冲销表单 选择付款单,
const selectPaymentAllChangeEvent: VxeTableEvents.CheckboxAll<RepaymentRecordVO> = () => {
  const $table = paymentTableRef.value.xTableRef
  if ($table) {
    const records = $table.getCheckboxRecords()
    selectedRepaymentRecordList.value = records;
  }
}

const setTypeTitle = () => {
  if (props.type == '1') {
    typeTitle.value = '付';
    isRepayment.value = false;
  } else {
    typeTitle.value = '收';
    isRepayment.value = true;
  }
  console.log("props.type,isRepayment.value", isRepayment.value);
  console.log("isSupplier", props.isSupplier);
}

onMounted(() => {
  console.log("冲销自定义列", props.titleColumnList)
  watch(() => openFlag.value, (v) => {
    if (v) {
      if (props.writeOffList) {
        writeOffList.value = props.writeOffList
      }
      setTypeTitle();
      getPaymentRecordList();
    }
  })
});
</script>
