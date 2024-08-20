<template>
  <div class="p-2 xtable-page">
    <accountTable ref="accountTableRef" :tableColumnList="columnList" :type="TypeEnum.SALE" @handle="handle" />
      <el-drawer
    v-model="drawerBorrow.visible"
    :title="drawerBorrow.title"
    size="90%"
    draggable
    @close="cancelOrderSelect"
    destroy-on-close
    modal-class="padding-drawer"
    >
    <!-- <accountDrawer ref="accountTableDrawerRef"
     v-if="drawerBorrow.visible"
      @cancel="drawerBorrow.visible=false" 
      :tabPaneColumnList1="tabColumnList"
      :tabPaneColumnList2="backColumnList"
      :dataList1="receiveList"
      :dataList2="backList"
     
  
      >
    </accountDrawer> -->
      
    <template #footer>
    <div style="display: flex; justify-content: center;">
      <span class="dialog-footer">
        <el-button @click="drawerBorrow.visible=false">取消</el-button>
        <el-button type="danger" v-show="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')" @click="handleSave">
          保存
        </el-button>
        <el-button type="primary" v-show="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')" @click="handleSubmit">
          提交
        </el-button>
        <el-button type="danger" v-show="drawerBorrow.title?.includes('审核')" @click="reject(inOrOutQuery.id)"> 驳回 </el-button>
        <el-button type="primary" v-show="drawerBorrow.title?.includes('审核')" @click="examinePass(inOrOutQuery.id)"> 通过 </el-button>
      </span>
    </div>
  </template>
    </el-drawer>
  
  </div>
</template>

<script setup name="ProcureAccount" lang="ts">
import accountTable from '../components/accountTable.vue';
import accountDrawer from '../components/accountDrawer.vue';

import { InOutRecordVO, InOutRecordQuery, InOutRecordForm, InOutRecordTypeEnum } from '@/api/inventory/inOutRecord/types';
import { AccountOrderVO, AccountOrderQuery, AccountOrderForm, InOrOutForm, InOrOutQuery, AccountMaterialInOutVo, TypeEnum, StatusEnum, HandleEnum, statusStrings } from '@/api/financial/accountOrder/types';

const accountTableRef = ref();
const accountTableDrawerRef = ref();

const columnList = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false },
  { title: '序号', width: '50', type: 'seq', visible: true, align: 'center' },
  { title: '单据状态', width: '80', field: 'status', align: 'center', },
  { title: '对账月份', width: '100', field: 'accountMonth', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择对账月份', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  { title: '对账单号', width: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入对账单号' } },
  { title: '客户代码', width: '140', field: 'customerCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户编码' } },
  { title: '客户名称', width: '140', field: 'customerName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户名称' } },
  { title: '含税', width: '80', field: 'isTax', align: 'center' },
  { title: '税率', width: '80', field: 'tax', align: 'center' },
  { title: '月结方式', width: '90', field: 'monthlyMethod', align: 'center' },
  { title: '汇率', width: '90', field: 'cusExchangeRate', align: 'center' },
  { title: '币种', width: '90', field: 'currency', align: 'center' },
  { title: '回款截止日期', sortable: true, width: '140', field: 'endTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账日期', sortable: true, width: '140', field: 'accountTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账金额', sortable: true, width: '140', field: 'accountPrice', align: 'center', },
  { title: '其他金额', sortable: true, width: '140', field: 'otherPrice', align: 'center', },
  { title: '退货金额', sortable: true, width: '140', field: 'backPrice', align: 'center', },
  { title: '应收金额', sortable: true, width: '140', field: 'payablePrice', align: 'center', },//receivablePrice
  { title: '回款金额', sortable: true, width: '140', field: 'writeOffPrice', align: 'center', },
  { title: '剩余应收金额', sortable: true, width: '140', field: 'remainPayablePrice', align: 'center', },
  { title: '对账人', width: '140', field: 'accountUserName', align: 'center', filterType: 'input' },
  { title: '备注', width: '240', field: 'remark', align: 'center', },
]);



/**
 * 采购单
 */
const initOutFormDataProcure = {
  id: undefined,
  quantity: undefined,
  reason: undefined,
}
const procureData = reactive<PageData<InOutRecordForm, InOutRecordQuery>>({
  form: { ...initOutFormDataProcure },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  },
  rules: {
  }
});
const { queryParams: procureQueryParams } = toRefs(procureData);


const handle = (handleType: HandleEnum, row?: AccountOrderVO) => {
  if (handleType == HandleEnum.ADD) {
    handleAdd();
  }

  // accountTableRef.value.radioTableHandle();

}
/**
 * 对账登记
 */


// 取消已审核列表勾选
const cancelOrderSelect = () => {
  accountTableRef.value.cancelOrderSelect();
}


import {  OrderFilinOutDetailQuery, OrderFilinOutDetailForm } from '@/api/financial/orderFilinOutDetail/types';

import { AccountOrderOtherVO } from '@/api/financial/accountOrderOther/types';
import { SourceHalfProcessCalcRuleVO} from "@/api/outsource/sourceHalfProcessCalcRule/types";

import { OrderSaleDetailVO, OrderSaleDetailQuery, OrderSaleDetailForm, SALETYPEENUM } from '@/api/financial/orderSaleDetail/types';

import { listAccountOrderOther } from '@/api/financial/accountOrderOther';


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

const backList = ref<InOutRecordVO[]>([]);
const receiveList = ref<InOutRecordVO[]>([]);

//冲销defin start
const aduitTableRef = ref();
const writerOffDialogOpen = ref(false);
const writerOffRecordDialogOpen = ref(false);
const writeOffList = ref<AccountOrderVO[]>([]);
const accountOrderWriteOff = ref<AccountOrderVO>();
//编辑和查看详情选择的对账单
const currentAccountOrderId = ref(undefined);


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

const { queryParams: accQueryParams, form, rules } = toRefs(data);
const { queryParams: accQueryParams2 } = toRefs(data2);
const { queryParams: accQueryParams3 } = toRefs(data3);
const drawerBorrow = reactive<DialogOption>({
  visible: false,
  title: '订单审核'
});

const handleAdd = () => {
  drawerBorrow.visible=true;
  // accountTableDrawerRef.value.handleAdd;
}
const handleSave = () => {
  accountTableDrawerRef.value.handleSave
}
const handleSubmit = () => {
  accountTableDrawerRef.value.handleSubmit
}
const reject = () => {
  accountTableDrawerRef.value.reject
}
const examinePass = () => {
  accountTableDrawerRef.value.examinePass
}

</script>
```
