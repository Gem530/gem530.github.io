<template>
  <el-dialog v-model="openFlag" :title="writeOffDialog.title" width="90%" draggable @close="closeDialog"
    custom-class="ptable-dialog">
    <div class="ptable-card">
      <el-radio-group v-model="writerOffRadioTable">
        <el-radio-button label="冲销记录" @change="handleWriterOffRadioTable" />
        <el-radio-button label="历史记录" @change="handleWriterOffRadioTable" />
      </el-radio-group>

      <XTable v-if="props.type == '1'" border :loading="loading" :data="writeOffRecordList" :columnList="columnList"
        style="height: 80%;" :pageShow="false" height="100%" class="ptable-content" :column-config="{ resizable: true }">
        <template #default-code="scope">
          <el-button type="primary" link @click="getDetail(scope.row)">{{scope.row.code}}</el-button>
        </template>
        <template #default-accountMonth="scope">
          <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
        </template>
        <template #default-endTime="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{m}') }}</span>
        </template>
        <template #default-accountTime="scope">
          <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-payDate="scope">
          <span>{{ parseTime(scope.row.payDate, '{y}-{m}-{d} ') }}</span>
        </template>
<!--        <template #default-make="scope">-->
<!--          <el-button link type="primary" @click="cancelWriteOffRecord(scope.row)">取消冲销</el-button>-->
<!--        </template>-->
        <template #default-status="scope">
          <el-tag class="ml-2" v-show="scope.row.status == '1'" type="success">冲销</el-tag>
          <el-tag class="ml-2" v-show="scope.row.status == '3'" type="success">冲销</el-tag>
          <el-tag class="ml-2" v-show="scope.row.status == '0'" type="danger">取消冲销</el-tag>
        </template>
      </XTable>

      <XTable v-if="props.type == '2'" border :loading="loading" :data="writeOffRecordList" :columnList="custColumnList"
        :pageShow="false" :column-config="{ resizable: true }" height="100%" class="ptable-content">
        <template #default-code="scope">
          <el-button type="primary" link @click="getDetail(scope.row)">{{scope.row.code}}</el-button>
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
        <template #default-payDate="scope">
          <span>{{ parseTime(scope.row.payDate, '{y}-{m}-{d} ') }}</span>
        </template>
<!--        <template #default-make="scope">-->
<!--          <el-button link type="primary" @click="cancelWriteOffRecord(scope.row)">取消冲销</el-button>-->
<!--        </template>-->
        <template #default-status="scope">
          <el-tag class="ml-2" v-show="scope.row.status == '1'" type="success">冲销</el-tag>
          <el-tag class="ml-2" v-show="scope.row.status == '3'" type="success">冲销</el-tag>
          <el-tag class="ml-2" v-show="scope.row.status == '0'" type="danger">取消冲销</el-tag>
        </template>
      </XTable>
    </div>
  </el-dialog>

  <el-drawer v-model="paymentTableDetail.visible" :title="paymentTableDetail.title" destroy-on-close  size="80%" draggable>
    <template #header="{ close, titleId, titleClass }">
      <div>
        <span>{{typeTitle}}{{paymentTableDetail.title}}</span>
        <span style="margin-left: 2px" v-for="(item,index) in statusFilterData">
            <el-tag :key="index" :type="item.type" size="small" v-if="item.value == detailInfo.status">{{item.label}}</el-tag>
          </span>
        <el-tag style="margin-left: 2px" type="success" size="small" v-if="detailInfo?.businessType=='1'">手动新增</el-tag>
        <el-tag style="margin-left: 2px" type="success" size="small" v-if="detailInfo?.businessType=='2'">{{typeTitle}}款转存</el-tag>
        <el-tag style="margin-left: 2px" type="success" size="small" v-if="detailInfo?.businessType=='3'">账单转存</el-tag>
      </div>
    </template>
    <Payment :isOpen="true" :loading="buttonLoading" :form="detailInfo" :isUpdate="true" :readOnly="true" :type="props.type" ></Payment>
  </el-drawer>
</template>

<script setup name="writeOffRecordDialog" lang="ts">
import { ref } from "vue";
import { OrderWriteOffRecordVO } from '@/api/financial/orderWriteOffRecord/types';
import { AccountOrderVO } from '@/api/financial/accountOrder/types';
import {
  getPayWriteOffListByAccountOrderId,
  cancelPayWriteOffRecordById,
  getPayWriteOffAllListByAccountOrderId,
  validateCancelWriteOffRecordById
} from '@/api/financial/accountOrder';
import {getPaymentAccountList, getRepaymentRecord} from "@/api/financial/repaymentRecord";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const emits = defineEmits(['update:open', 'getList', 'close'])
const props = withDefaults(defineProps<{
  open: boolean
  type: string
  height: string
  accountOrderWriteOff: any
}>(), {
  open: false,
  height: '500',
  type: '1',
  accountOrderWriteOff: undefined
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

const columnList = ref([
  { width: '50', title: '序号', type: 'seq', align: 'center', },
  { width: '120', title: '对账单号', field: 'accountOrderCode', align: 'center', },
  { width: '160', title: '供应商', field: 'supplierCode', align: 'center', },
  { width: '160', title: '供应商名称', field: 'supplierName', align: 'center', },
  { width: '120', title: '对账月份', field: 'accountMonth', align: 'center', },
  { width: '120', title: '对账日期', field: 'accountTime', align: 'center', },
  { width: '100', title: '应付金额', field: 'payablePrice', align: 'center', },
  { width: '100', title: '对账金额', field: 'accountPrice', align: 'center', },
  { width: '140', title: '对账单折扣金额', field: 'accountDiscountPrice', align: 'center', },
  { width: '100', title: '已收金额', field: 'writeOffPrice', align: 'center', },
  { width: '100', title: '收款/预收款单号', field: 'code', align: 'center', },
  { width: '100', title: '付款日期', field: 'payDate', align: 'center', },
  { title: '备注', field: 'remark', align: 'center', },
  { width: '100', title: '操作', field: 'make', visible: false, align: 'center', },
  { width: '100', title: '状态', field: 'status', visible: false, align: 'center', },
]);
const custColumnList = ref([
  { width: '50', title: '序号', type: 'seq', align: 'center', },
  { width: '120', title: '对账单号', field: 'accountOrderCode', align: 'center', },
  { width: '80', title: '客户编码', field: 'customerCode', align: 'center', },
  { width: '120', title: '客户名称', field: 'customerName', align: 'center', },
  { width: '120', title: '对账月份', field: 'accountMonth', align: 'center', },
  { width: '100', title: '对账日期', field: 'accountTime', align: 'center', },
  { width: '100', title: '应收金额', field: 'payablePrice', align: 'center', },
  { width: '100', title: '对账金额', field: 'accountPrice', align: 'center', },
  { width: '100', title: '退货金额', field: 'backPrice', align: 'center', },
  { width: '140', title: '对账单扣款金额', field: 'accountDiscountPrice', align: 'center', },
  { width: '100', title: '已收金额', field: 'writeOffPrice', align: 'center', },
  { width: '100', title: '收款/预收款单号', field: 'code', align: 'center', },
  { width: '100', title: '收款日期', field: 'payDate', align: 'center', },
  { title: '备注', field: 'remark', align: 'center', },
  { width: '100', title: '操作', field: 'make', visible: false, align: 'center', },
  { width: '100', title: '状态', field: 'status', visible: false, align: 'center', },
]);
const writerOffRadioTable = ref('冲销记录');

const accountOrderWriteOff = ref<AccountOrderVO>();

const loading = ref(true);



//冲销记录集合
const writeOffRecordList = ref<OrderWriteOffRecordVO[]>([]);

/**取消冲销 */
const cancelWriteOffRecord = async (row: OrderWriteOffRecordVO) => {
  const res = await validateCancelWriteOffRecordById(row.id);
  if (res.data && res.data != '') {
    await proxy?.$modal.confirm('是否确认取消冲销,此操作会批量取消冲销：' + res.data)
  } else {
    await proxy?.$modal.confirm('是否确认取消冲销');
  }
  await cancelPayWriteOffRecordById(row.id);
  handleWriterOffRadioTable();
  emits('getList');
}

const paymentTableDetail = reactive<DialogOption>({
  visible: false,
  title: ''
});

const detailInfo = ref({});

const getDetail = async(row:any)=>{
  // reset2();
  const _id = row.paymentRepaymentRecordId ;
  const res = await getRepaymentRecord(_id);
  Object.assign(detailInfo.value, res.data);
  // isUpdate.value = true;
  // isReadOnly.value = true;
  // confirmSelectList.value = res.data.invoiceVoList;
  const res2 = await getPaymentAccountList({paymentId: _id, onlyPayment:'1',});
  detailInfo.value.confirmSelectList = res2.rows;
  paymentTableDetail.visible = true;
  paymentTableDetail.title = "款单详情";
}


/**冲销记录 RadioTable 点击事件*/
const handleWriterOffRadioTable = async () => {

  if (writerOffRadioTable.value == "冲销记录") {
    loading.value = true;
    // columnList.value[13].visible = true
    columnList.value[14].visible = false

    // custColumnList.value[14].visible = true
    custColumnList.value[15].visible = false
    if (accountOrderWriteOff.value) {
      let accQue = { accountOrderId: accountOrderWriteOff.value.id }
      if (props.type == '2') {
        accQue.writeOffSourceType = '3';
      } else {
        accQue.writeOffSourceType = '2';
      }
      const res = await getPayWriteOffListByAccountOrderId(accQue);
      loading.value = false;
      writeOffRecordList.value = res.data;

    }


  } else {
    loading.value = true;
    columnList.value[13].visible = false
    columnList.value[14].visible = true

    custColumnList.value[14].visible = false
    custColumnList.value[15].visible = true
    if (accountOrderWriteOff.value) {
      let accQue = { accountOrderId: accountOrderWriteOff.value.id }
      if (props.type == '2') {
        accQue.writeOffSourceType = '3';
      } else {
        accQue.writeOffSourceType = '2';
      }
      const res = await getPayWriteOffAllListByAccountOrderId(accQue)
      loading.value = false;
      writeOffRecordList.value = res.data;
    }
  }
}
//冲销页面,
const writeOffDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const typeTitle = ref('收');

const setTypeTitle = () => {
  console.log("props.type", props.type)
  if (props.type == '2') {
    typeTitle.value = '收';
    //columnList.value[2].title = '客户';
  } else {
    typeTitle.value = '付';
    //columnList.value[2].title = '供应商';
  }
  columnList.value[6].title = '应' + typeTitle.value + '金额';
  columnList.value[9].title = '已' + typeTitle.value + '金额';
  // columnList.value[10].title = typeTitle.value + '款单号';
  columnList.value[10].title = typeTitle.value + '款/预' + typeTitle.value + "款单号";
  writeOffDialog.title = typeTitle.value + '款单冲销记录';
}
onMounted(() => {
  watch(() => openFlag.value, (v) => {
    if (v) {
      if (props.accountOrderWriteOff) {
        accountOrderWriteOff.value = props.accountOrderWriteOff
      }
      setTypeTitle();
      handleWriterOffRadioTable();
    }
  })

});
</script>
