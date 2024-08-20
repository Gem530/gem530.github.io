<template>
  <el-dialog v-model="openFlag" :title="writeOffDialog.title" width="90%" draggable @close="closeDialog"
    custom-class="ptable-dialog">

    <el-card   v-if="hasPayInfo|| !defaultRepay || (payWriteOffRecordList && payWriteOffRecordList.length > 0)"
      :class="hasRepayInfo||defaultRepay || (repayWriteOffRecordList && repayWriteOffRecordList.length > 0) ? '' : 'ptable-card'">
      <el-row>
        <span style="color:#5d7db3">付款单</span>
        <el-radio-group v-model="writerOffRadioTable" style="margin-left: 10px;">
          <el-radio-button label="冲销记录" @change="handleWriterOffRadioTable" />
          <el-radio-button label="历史记录" @change="handleWriterOffRadioTable" />
        </el-radio-group>
      </el-row>
        <XTable v-if="props.type == '1'" border :loading="loading" :data="payWriteOffRecordList"
          :columnList="props.payRecordColumnList ? props.payRecordColumnList : columnList" :pageShow="false"
          height="225px" :scroll-y="{ enabled: true, gt: 10 }" :column-config="{ resizable: true }"
          :class="hasRepayInfo||defaultRepay || (repayWriteOffRecordList && repayWriteOffRecordList.length > 0) ? '' : 'ptable-content'">
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
<!--          <template #default-make="scope">-->
<!--            <el-button link type="primary" @click="cancelWriteOffRecord(scope.row)">取消冲销</el-button>-->
<!--          </template>-->
          <template #default-status="scope">
            <span :class="scope.row.status == '1'||scope.row.status == '3'?'offSuccess':'offCancel'">
              {{ scope.row.status == '1'||scope.row.status == '3'?'冲销':'取消冲销' }}
            </span>
            <!-- <el-tag class="ml-2" v-if="scope.row.status == '1'" type="success">冲销</el-tag>
            <el-tag class="ml-2" v-if="scope.row.status == '3'" type="success">冲销</el-tag>
            <el-tag class="ml-2" v-if="scope.row.status == '0'" type="danger">取消冲销</el-tag> -->
          </template>
        </XTable>
        <XTable v-if="props.type == '2'" border :loading="loading" :data="payWriteOffRecordList"
          :columnList="props.payRecordColumnList ? props.payRecordColumnList : custColumnList" :pageShow="false"
          :column-config="{ resizable: true }" height="225px" :scroll-y="{ enabled: true, gt: 10 }"
          :class="hasRepayInfo||defaultRepay || (repayWriteOffRecordList && repayWriteOffRecordList.length > 0) ? '' : 'ptable-content'">
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
<!--          <template #default-make="scope">-->
<!--            <el-button link type="primary" @click="cancelWriteOffRecord(scope.row)">取消冲销</el-button>-->
<!--          </template>-->
          <template #default-status="scope">
            <span :class="scope.row.status == '1'||scope.row.status == '3'?'offSuccess':'offCancel'">
              {{ scope.row.status == '1'||scope.row.status == '3'?'冲销':'取消冲销' }}
            </span>
            <!-- <el-tag class="ml-2" v-if="scope.row.status == '1'" type="success">冲销</el-tag>
            <el-tag class="ml-2" v-if="scope.row.status == '3'" type="success">冲销</el-tag>
            <el-tag class="ml-2" v-if="scope.row.status == '0'" type="danger">取消冲销</el-tag> -->
          </template>
        </XTable>

    </el-card>

    <el-card type="border-card" v-if="hasRepayInfo||defaultRepay || (repayWriteOffRecordList && repayWriteOffRecordList.length > 0)"
      :class="hasPayInfo|| !defaultRepay || (payWriteOffRecordList && payWriteOffRecordList.length > 0) ? '' : 'ptable-card'">
      <el-row>
        <span style="color:#5d7db3">收款单</span>
        <el-radio-group v-model="writerOffRadioTable2" style="margin-left: 10px;">
            <el-radio-button label="冲销记录" @change="handleWriterOffRadioTable2" />
            <el-radio-button label="历史记录" @change="handleWriterOffRadioTable2" />
        </el-radio-group>
      </el-row>
        <XTable v-if="props.type == '1'" border :loading="loading2" :data="repayWriteOffRecordList"
          :columnList="props.repayRecordColumnList ? props.repayRecordColumnList : supColumnList" :pageShow="false"
          height="225px" :scroll-y="{ enabled: true, gt: 10 }" :column-config="{ resizable: true }"
          :class="hasPayInfo|| !defaultRepay || (payWriteOffRecordList && payWriteOffRecordList.length > 0) ? '' : 'ptable-content'">
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
          <template #default-make="scope">
<!--            <el-button link type="primary" @click="cancelWriteOffRecord(scope.row)">取消冲销</el-button>-->
          </template>
          <template #default-status="scope">
            <span :class="scope.row.status == '1'||scope.row.status == '3'?'offSuccess':'offCancel'">
              {{ scope.row.status == '1'||scope.row.status == '3'?'冲销':'取消冲销' }}
            </span>
          </template>
        </XTable>
        <XTable v-if="props.type == '2'" border :loading="loading2" :data="repayWriteOffRecordList"
          :columnList="props.repayRecordColumnList ? props.repayRecordColumnList : custColumnList" :pageShow="false"
          :column-config="{ resizable: true }" height="225px" :scroll-y="{ enabled: true, gt: 10 }"
          :class="hasPayInfo|| !defaultRepay || (payWriteOffRecordList && payWriteOffRecordList.length > 0) ? '' : 'ptable-content'">
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
<!--          <template #default-make="scope">-->
<!--            <el-button link type="primary" @click="cancelWriteOffRecord(scope.row)">取消冲销</el-button>-->
<!--          </template>-->
          <template #default-status="scope">
            <span :class="scope.row.status == '1'||scope.row.status == '3'?'offSuccess':'offCancel'">
              {{ scope.row.status == '1'||scope.row.status == '3'?'冲销':'取消冲销' }}
            </span>
            <!-- <el-tag class="ml-2" v-if="scope.row.status == '1'" type="success">冲销</el-tag>
            <el-tag class="ml-2" v-if="scope.row.status == '3'" type="success">冲销</el-tag>
            <el-tag class="ml-2" v-if="scope.row.status == '0'" type="danger">取消冲销</el-tag> -->
          </template>
        </XTable>
    </el-card>

  </el-dialog>
</template>

<script setup name="commonWriteOffRecordDialog" lang="ts">
import { ref } from "vue";
import { OrderWriteOffRecordVO } from '@/api/financial/orderWriteOffRecord/types';
import { AccountOrderVO } from '@/api/financial/accountOrder/types';
import {
  getWriteOffListByAccountOrderId,
  cancelWriteOffRecordById,
  getWriteOffAllListByAccountOrderId,
  validateCancelWriteOffRecordById
} from '@/api/financial/accountOrder';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const emits = defineEmits(['update:open', 'getList', 'close'])
const props = withDefaults(defineProps<{
  open: boolean
  type: string
  height: string
  accountOrderWriteOff: any,
  payRecordColumnList: any,
  repayRecordColumnList: any,
  //是否默认展示收款单冲销记录
  defaultRepay: boolean
}>(), {
  open: false,
  height: '500',
  type: '1',
  accountOrderWriteOff: undefined,
  payRecordColumnList: undefined,
  repayRecordColumnList: undefined,
  defaultRepay: false
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
  { width: '160', title: '供应商编码', field: 'supplierCode', align: 'center', },
  { width: '160', title: '供应商名称', field: 'supplierName', align: 'center', },
  { width: '120', title: '对账月份', field: 'accountMonth', align: 'center', },
  { width: '120', title: '对账日期', field: 'accountTime', align: 'center', },
  { width: '100', title: '应付金额', field: 'payablePrice', align: 'center', },
  { width: '100', title: '对账金额', field: 'accountPrice', align: 'center', },
  { width: '140', title: '对账单折扣金额', field: 'accountDiscountPrice', align: 'center', },
  { width: '100', title: '已收金额', field: 'writeOffPrice', align: 'center', },
  { width: '100', title: '收款单号', field: 'code', align: 'center', },
  { width: '100', title: '付款日期', field: 'payDate', align: 'center', },
  { title: '备注', field: 'remark', align: 'center', },
  { width: '100', title: '操作', field: 'make', visible: true, align: 'center', },
  { width: '100', title: '状态', field: 'status', visible: false, align: 'center', },
]);

const supColumnList = ref([
  { width: '50', title: '序号', type: 'seq', align: 'center', },
  { width: '120', title: '对账单号', field: 'accountOrderCode', align: 'center', },
  { width: '80', title: '供应商编码', field: 'supplierCode', align: 'center', },
  { width: '120', title: '供应商名称', field: 'supplierName', align: 'center', },
  { width: '120', title: '对账月份', field: 'accountMonth', align: 'center', },
  { width: '100', title: '对账日期', field: 'accountTime', align: 'center', },
  { width: '100', title: '应收金额', field: 'payablePrice', align: 'center', },
  { width: '100', title: '对账金额', field: 'accountPrice', align: 'center', },
  { width: '100', title: '退货金额', field: 'backPrice', align: 'center', },
  { width: '140', title: '对账单扣款金额', field: 'accountDiscountPrice', align: 'center', },
  { width: '100', title: '已收金额', field: 'writeOffPrice', align: 'center', },
  { width: '100', title: '收款单号', field: 'code', align: 'center', },
  { width: '100', title: '收款日期', field: 'payDate', align: 'center', },
  { title: '备注', field: 'remark', align: 'center', },
  { width: '100', title: '操作', field: 'make', visible: true, align: 'center', },
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
  { width: '100', title: '收款单号', field: 'code', align: 'center', },
  { width: '100', title: '收款日期', field: 'payDate', align: 'center', },
  { title: '备注', field: 'remark', align: 'center', },
  { width: '100', title: '操作', field: 'make', visible: true, align: 'center', },
  { width: '100', title: '状态', field: 'status', visible: false, align: 'center', },
]);
const writerOffRadioTable = ref('冲销记录');
const writerOffRadioTable2 = ref('冲销记录');

const accountOrderWriteOff = ref<AccountOrderVO>();

const loading = ref(true);
const loading2 = ref(true);
const payColLength = ref(0);
const repayColLength = ref(0);

const hasPayInfo = ref(false);
const hasRepayInfo = ref(false);
//冲销记录集合
const writeOffRecordList = ref<OrderWriteOffRecordVO[]>([]);
const payWriteOffRecordList = ref<OrderWriteOffRecordVO[]>([]);
const repayWriteOffRecordList = ref<OrderWriteOffRecordVO[]>([]);

/**取消冲销 */
const cancelWriteOffRecord = async (row: OrderWriteOffRecordVO) => {
  const res = await validateCancelWriteOffRecordById(row.id);
  if (res.data && res.data != '') {
    await proxy?.$modal.confirm('是否确认取消冲销,此操作会批量取消冲销：' + res.data)
  } else {
    await proxy?.$modal.confirm('是否确认取消冲销');
  }
  await cancelWriteOffRecordById(row.id);
  await handleWriterOffRadioTable();
  await handleWriterOffRadioTable2();
  emits('getList');
}


/**冲销记录 RadioTable 点击事件*/
const handleWriterOffRadioTable = async () => {

  if (writerOffRadioTable.value == "冲销记录") {
    loading.value = true;
    const _columnList = columnList.value;
    if (_columnList && _columnList.length > 0) {
      const _length = _columnList.length;
      _columnList[_length - 1].visible = false
      _columnList[_length - 2].visible = true
    }

    const _custColumnList = custColumnList.value;
    if (_custColumnList && _custColumnList.length > 0) {
      const _length = _custColumnList.length;
      _custColumnList[_length - 1].visible = false
      _custColumnList[_length - 2].visible = true
    }

    const _supColumnList = supColumnList.value;
    if (_supColumnList && _supColumnList.length > 0) {
      const _length = _supColumnList.length;
      _supColumnList[_length - 1].visible = false
      _supColumnList[_length - 2].visible = true
    }

    if (props.payRecordColumnList && props.payRecordColumnList.length > 0) {
      const _length = props.payRecordColumnList.length;
      props.payRecordColumnList[_length - 1].visible = false
      props.payRecordColumnList[_length - 2].visible = true
    }

    if (accountOrderWriteOff.value) {
      const res = await getWriteOffListByAccountOrderId(accountOrderWriteOff.value.id);
      payWriteOffRecordList.value = res.data.filter(item => item.payType == '1');
      loading.value = false;
      writeOffRecordList.value = res.data;
    }
  } else {
    loading.value = true;

    const _columnList = columnList.value;
    if (_columnList && _columnList.length > 0) {
      const _length = _columnList.length;
      _columnList[_length - 1].visible = true
      _columnList[_length - 2].visible = false
    }

    const _supColumnList = supColumnList.value;
    if (_supColumnList && _supColumnList.length > 0) {
      const _length = _supColumnList.length;
      _supColumnList[_length - 1].visible = true
      _supColumnList[_length - 2].visible = false
    }

    const _custColumnList = custColumnList.value;
    if (_custColumnList && _custColumnList.length > 0) {
      const _length = _custColumnList.length;
      _custColumnList[_length - 1].visible = true
      _custColumnList[_length - 2].visible = false
    }

    if (props.payRecordColumnList && props.payRecordColumnList.length > 0) {
      const _length = props.payRecordColumnList.length;
      props.payRecordColumnList[_length - 1].visible = true
      props.payRecordColumnList[_length - 2].visible = false
    }

    if (accountOrderWriteOff.value) {
      const res = await getWriteOffAllListByAccountOrderId(accountOrderWriteOff.value.id);
      //1付款2收款
      payWriteOffRecordList.value = res.data.filter(item => item.payType == '1');
      loading.value = false;
      writeOffRecordList.value = res.data;
    }
  }
  console.log("payWriteOffRecordList", props.payRecordColumnList)
  console.log("supColumnList", supColumnList)
  console.log("custColumnList", custColumnList)
}
const handleWriterOffRadioTable2 = async () => {

  if (writerOffRadioTable2.value == "冲销记录") {
    loading2.value = true;

    const _columnList = columnList.value;
    if (_columnList && _columnList.length > 0) {
      const _length = _columnList.length;
      _columnList[_length - 1].visible = false
      _columnList[_length - 2].visible = true
    }

    const _supColumnList = supColumnList.value;
    if (_supColumnList && _supColumnList.length > 0) {
      const _length = _supColumnList.length;
      _supColumnList[_length - 1].visible = false
      _supColumnList[_length - 2].visible = true
    }

    const _custColumnList = custColumnList.value;
    if (_custColumnList && _custColumnList.length > 0) {
      const _length = _custColumnList.length;
      _custColumnList[_length - 1].visible = false
      _custColumnList[_length - 2].visible = true
    }

    if (props.repayRecordColumnList && props.repayRecordColumnList.length > 0) {
      const _length = props.repayRecordColumnList.length;
      props.repayRecordColumnList[_length - 1].visible = false
      props.repayRecordColumnList[_length - 2].visible = true
    }

    if (accountOrderWriteOff.value) {
      const res = await getWriteOffListByAccountOrderId(accountOrderWriteOff.value.id);
      repayWriteOffRecordList.value = res.data.filter(item => item.payType == '2');
      loading2.value = false;
      writeOffRecordList.value = res.data;
    }
  } else {
    loading2.value = true;

    const _columnList = columnList.value;
    if (_columnList && _columnList.length > 0) {
      const _length = _columnList.length;
      _columnList[_length - 1].visible = true
      _columnList[_length - 2].visible = false
    }

    const _supColumnList = supColumnList.value;
    if (_supColumnList && _supColumnList.length > 0) {
      const _length = _supColumnList.length;
      _supColumnList[_length - 1].visible = true
      _supColumnList[_length - 2].visible = false
    }

    const _custColumnList = custColumnList.value;
    if (_custColumnList && _custColumnList.length > 0) {
      const _length = _custColumnList.length;
      _custColumnList[_length - 1].visible = true
      _custColumnList[_length - 2].visible = false
    }

    if (props.repayRecordColumnList && props.repayRecordColumnList.length > 0) {
      const _length = props.repayRecordColumnList.length;
      props.repayRecordColumnList[_length - 1].visible = true
      props.repayRecordColumnList[_length - 2].visible = false
    }

    if (accountOrderWriteOff.value) {
      const res = await getWriteOffAllListByAccountOrderId(accountOrderWriteOff.value.id);
      //1付款2收款
      repayWriteOffRecordList.value = res.data.filter(item => item.payType == '2');
      loading2.value = false;
      writeOffRecordList.value = res.data;
    }
  }
  console.log("repayWriteOffRecordList", repayWriteOffRecordList.value)
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
    columnList.value[2].title = '客户';
  } else {
    typeTitle.value = '付';
    columnList.value[2].title = '供应商';
  }
  columnList.value[6].title = '应' + typeTitle.value + '金额';
  columnList.value[9].title = '已' + typeTitle.value + '金额';
  columnList.value[10].title = typeTitle.value + '款单号';
  writeOffDialog.title = '冲销记录';
  writerOffRadioTable.value='冲销记录';
  writerOffRadioTable2.value='冲销记录';
}

const setPayCard = async() => {
  console.log(accountOrderWriteOff.value.id)
  getWriteOffAllListByAccountOrderId(accountOrderWriteOff.value.id).then(res => {
    //1付款2收款
    const payRecordList = res.data.filter(item => item.payType == '1');
    const repayRecordList = res.data.filter(item => item.payType == '2');
    if (payRecordList && payRecordList.length > 0) {
      hasPayInfo.value = true;
    }
    if (repayRecordList && repayRecordList.length > 0) {
      hasRepayInfo.value = true;
    }
  });
}
onMounted(() => {
  watch(() => openFlag.value, (v) => {
    if (v) {
      if (props.accountOrderWriteOff) {
        accountOrderWriteOff.value = props.accountOrderWriteOff;
      }
      setTypeTitle();
      setPayCard();
      handleWriterOffRadioTable();
      handleWriterOffRadioTable2();
    }
  })

});
</script>
<style  lang="scss" scoped>
.offSuccess {
  color:rgb(88, 177, 93)
}
.offCancel {
  color:red
}
:deep(.XTable-tool){
  height: 0px !important;
}
</style>
