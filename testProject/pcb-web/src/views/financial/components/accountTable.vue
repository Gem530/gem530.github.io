<template>
  <el-card shadow="never" class="xtable-card">
    <el-tabs class="xtable-tab" type="border-card" @tab-change="radioTableHandle" v-model="radioTable">
      <el-tab-pane label="对账单列表" name="对账单列表">
        <div class="global-flex flex-end flex-wrap" style="width: 100%;">
        <!-- <el-row :gutter="10" class="mb8" style="width:100%;margin:0;display:flex;justify-content: end;">
          <el-col :span="20"> -->
            <p class="totalTitle">
              <template v-if="!props.titleLabel?.labelHide1">
                {{ props.titleLabel && props.titleLabel.label1 ? (' ' + props.titleLabel.label1 + ':') : ' 应收金额汇总：' }} {{
                  payablePriceTotal }}
              </template>
              <template v-if="!props.titleLabel?.labelHide2">
                &nbsp;&nbsp;|&nbsp;&nbsp;{{ props.titleLabel && props.titleLabel.label2 ? (' ' + props.titleLabel.label2 + ':') : ' 退货金额汇总：' }} {{
                  backPriceTotal }}
              </template>
              <template v-if="!props.titleLabel?.labelHide3">
                &nbsp;&nbsp;|&nbsp;&nbsp;{{ props.titleLabel && props.titleLabel.label3 ? (' ' + props.titleLabel.label3 + ':') : ' 折损金额汇总：' }} {{
                  accountDiscountPriceTotal }}
              </template>
              <template v-if="!props.titleLabel?.labelHide4">
                &nbsp;&nbsp;|&nbsp;&nbsp;{{ props.titleLabel && props.titleLabel.label4 ? (' ' + props.titleLabel.label4 + ':') : ' 其他金额汇总：' }} {{
                  otherPriceTotal }}
              </template>
              <template v-if="!props.titleLabel?.labelHide5">
                &nbsp;&nbsp;|&nbsp;&nbsp;{{ props.titleLabel && props.titleLabel.label5 ? (' ' + props.titleLabel.label5 + ':') : ' 对账金额汇总：' }}{{
                  accountPriceTotal }}
              </template>
              <template v-if="!props.titleLabel?.labelHide6">
                &nbsp;&nbsp;|&nbsp;&nbsp;{{ props.titleLabel && props.titleLabel.label6 ? (' ' + props.titleLabel.label6 + ':') : ' 回款金额汇总：' }}{{
                  writeOffPriceTotal }}
              </template>
              <template v-if="!props.titleLabel?.labelHide7">
                &nbsp;&nbsp;|&nbsp;&nbsp;{{ props.titleLabel && props.titleLabel.label7 ? (' ' + props.titleLabel.label7 + ':') : ' 剩余金额汇总：' }}{{
                  remainPayablePriceTotal }}
              </template>

            </p>
          <!-- </el-col>
          <el-col :span="1.5"> -->
            <div style="margin-left: 12px;">
              <el-button plain @click="handleExport">导出</el-button>
              <el-button type="primary" plain @click="handle(HandleEnum.ADD)">对账登记</el-button>
              <el-button v-if="radioTable == '对账单列表'" type="primary" plain @click="handleSubmitAduit">提交审核</el-button>
            </div>
          <!-- </el-col>
        </el-row> -->
        </div>
        <XTable v-model:page-size="accQueryParams.pageSize" v-model:current-page="accQueryParams.pageNum" height="100%"
          class="xtable-content" :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: total }"
          :data="orderFilinOutList" :columnList="columnList" ref="XTableRef" border @searchChange="searchChange"
          :showRefresh="true" :sort-orders="sortCondition" :toolId="props.toolId1?props.toolId1:'toolId1'"
          :checkbox-config="{ checkMethod: submitSelectableFun, reserve: true }" :column-config="{ resizable: true }"
          :row-config="{ keyField: 'id' }" :loading="loading">

          <template #default-accountPrice="scope">
            <span>{{ Number(scope.row.accountPrice?scope.row.accountPrice:0).toFixed(2) }}</span>
          </template>
          <template #default-otherPrice="scope">
            <span>{{ Number(scope.row.otherPrice?scope.row.otherPrice:0).toFixed(2) }}</span>
          </template>
          <template #default-payablePrice="scope">
            <span>{{ Number(scope.row.payablePrice?scope.row.payablePrice:0).toFixed(2) }}</span>
          </template>
          <template #default-remainPayablePrice="scope">
            <span>{{ Number(scope.row.remainPayablePrice?scope.row.remainPayablePrice:0).toFixed(2) }}</span>
          </template>
          <template #default-accountDiscountPrice="scope">
            <span>{{ Number(scope.row.accountDiscountPrice?scope.row.accountDiscountPrice:0).toFixed(2) }}</span>
          </template>
          <template #default-backPrice="scope">
            <span>{{ Number(scope.row.backPrice?scope.row.backPrice:0).toFixed(2) }}</span>
          </template>


          <template #default-writeOffPrice="scope">
            <span v-if="scope.row.type == '3' || scope.row.type == '4'">
              {{ Number(scope.row.payablePrice) < 0 && Number(scope.row.writeOffPrice) > 0 ? ('-' + Number(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toFixed(2)) :
              Number(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toFixed(2) }}
            </span>
            <span v-else>{{  Number(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toFixed(2) }}</span>
          </template>

          <template #default-code="scope">
            <span>{{ scope.row.code }}</span>
            <el-button v-if="props.isReport" link @click="accountUReportHandle(scope.row)">
              <el-icon>
                <Document />
              </el-icon>
            </el-button>
          </template>
          <template #default-status="scope">
            <span v-if="scope.row.status != '4' || scope.row.remainPayablePrice != 0">
              {{ statusStrings[scope.row.status as keyof typeof StatusEnum] }}
            </span>
            <span v-else>冲销完成</span>
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
            <el-button link type="primary" v-show="scope.row.status == '1' || scope.row.status == '3'"
              @click="handle(HandleEnum.EDIT, scope.row)">编辑</el-button>
            <el-button link type="primary" v-show="scope.row.status == '1' || scope.row.status == '3'"
              @click="checkPass(scope.row)">提交</el-button>
            <el-button link type="primary" v-show="scope.row.status == '2'"
              @click="handle(HandleEnum.EXAMINE, scope.row)">审核</el-button>
            <el-button link type="primary" v-show="scope.row.status == '4'"
              @click="handleWriteOffRecord(scope.row)">冲销记录</el-button>
            <el-button link type="primary" @click="handle(HandleEnum.INFO, scope.row)">详情</el-button>
            <el-button link type="primary" v-show="scope.row.status == '1' || scope.row.status == '3'"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </XTable>
      </el-tab-pane>
      <el-tab-pane label="待审核列表" name="待审核列表">
        <XTable v-model:page-size="accQueryParams2.pageSize" v-model:current-page="accQueryParams2.pageNum" height="100%"
          class="xtable-content" :intervalCondition="intervalCondition" :showRefresh="true" :sort-orders="sortCondition"
          :page-params="{ perfect: true, total: waitTotal }" :data="orderFilinOutWaitList" :columnList="columnList"
          ref="custTableRef" border @searchChange="searchChangeWait" :column-config="{ resizable: true }"
          :toolId="props.toolId2?props.toolId2:'toolId2'"
          :loading="loadingWait" :row-config="{ keyField: 'id' }">

          <template #default-accountPrice="scope">
            <span>{{ Number(scope.row.accountPrice?scope.row.accountPrice:0).toFixed(2) }}</span>
          </template>
          <template #default-otherPrice="scope">
            <span>{{ Number(scope.row.otherPrice?scope.row.otherPrice:0).toFixed(2) }}</span>
          </template>
          <template #default-payablePrice="scope">
            <span>{{ Number(scope.row.payablePrice?scope.row.payablePrice:0).toFixed(2) }}</span>
          </template>
          <template #default-remainPayablePrice="scope">
            <span>{{ Number(scope.row.remainPayablePrice?scope.row.remainPayablePrice:0).toFixed(2) }}</span>
          </template>
          <template #default-accountDiscountPrice="scope">
            <span>{{ Number(scope.row.accountDiscountPrice?scope.row.accountDiscountPrice:0).toFixed(2) }}</span>
          </template>
          <template #default-backPrice="scope">
            <span>{{ Number(scope.row.backPrice?scope.row.backPrice:0).toFixed(2) }}</span>
          </template>


          <template #default-writeOffPrice="scope">
            <span v-if="scope.row.type == '3' || scope.row.type == '4'">
              {{ Number(scope.row.payablePrice) < 0 && Number(scope.row.writeOffPrice) > 0 ? ('-' + Number(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toFixed(2)) :
              Number(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toFixed(2) }}
            </span>
            <span v-else>{{  Number(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toFixed(2) }}</span>
          </template>

          <template #default-code="scope">
            <span>{{ scope.row.code }}</span>
            <el-button v-if="props.isReport" link @click="accountUReportHandle(scope.row)">
              <el-icon>
                <Document />
              </el-icon>
            </el-button>
          </template>
          <template #default-status="scope">
            <span v-if="scope.row.status != '4' || scope.row.remainPayablePrice != 0">{{ statusStrings[scope.row.status as
              keyof typeof StatusEnum]
            }}</span>
            <span v-else>冲销完成</span>
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
          <template #default-isTax="scope">
            <span v-if="scope.row.isTax == 0">否</span>
            <span v-if="scope.row.isTax == 1">是</span>
          </template>
          <template #default-tax="scope">
            <span>{{ taxRate }}</span>
          </template>
          <template #default-createTime="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
          <template #default-make="scope">
            <el-button link type="primary" v-show="scope.row.status == '2'"
              @click="handle(HandleEnum.EXAMINE, scope.row)">审核</el-button>
            <el-button link type="primary" @click="handle(HandleEnum.INFO, scope.row)">详情</el-button>
          </template>
        </XTable>
      </el-tab-pane>
      <el-tab-pane label="已审核列表" name="已审核列表">
        <el-row :gutter="10" class="mb8" style="width:100%;margin:0;display:flex;justify-content: end;">

          <div style="display:flex;;line-height: 24px;font-size: 14px;text-align: center;">
            <div style="width: 90px;background-color: #F5FFFA">已冲销完成</div>
            <div style="width: 90px;background-color: #FAECD8">待冲销记录</div>
          </div>
          <el-col :span="1.5" v-show="radioTable.includes('已审核')">
<!--            <el-button :disabled="writeOffList.length == 0" type="primary" plain icon="Plus"-->
<!--              @click="handleWriteOff">账单冲销</el-button>-->
          </el-col>
        </el-row>

        <XTable v-model:page-size="accQueryParams3.pageSize" v-model:current-page="accQueryParams3.pageNum" height="100%"
          class="xtable-content" :intervalCondition="intervalCondition" :showRefresh="true" :sort-orders="sortCondition"
          :page-params="{ perfect: true, total: aduitTotal }" :data="orderFilinOutAduitList" :columnList="columnList2"
          ref="aduitTableRef" border @searchChange="searchChangeAduit" :column-config="{ resizable: true }"
          :loading="loadingFinsih" @checkbox-all="handleSelectionChange" @checkbox-change="handleSelectionChange"
          :checkbox-config="{ trigger: 'row', checkMethod: selectableFun }" :row-style="tableRowClassName"
          :toolId="props.toolId3?props.toolId3:'toolId3'" :row-config="{ keyField: 'id' }">
          <template #default-accountPrice="scope">
            <span>{{ Number(scope.row.accountPrice?scope.row.accountPrice:0).toFixed(2) }}</span>
          </template>
          <template #default-otherPrice="scope">
            <span>{{ Number(scope.row.otherPrice?scope.row.otherPrice:0).toFixed(2) }}</span>
          </template>
          <template #default-payablePrice="scope">
            <span>{{ Number(scope.row.payablePrice?scope.row.payablePrice:0).toFixed(2) }}</span>
          </template>
          <template #default-remainPayablePrice="scope">
            <span>{{ Number(scope.row.remainPayablePrice?scope.row.remainPayablePrice:0).toFixed(2) }}</span>
          </template>
          <template #default-accountDiscountPrice="scope">
            <span>{{ Number(scope.row.accountDiscountPrice?scope.row.accountDiscountPrice:0).toFixed(2) }}</span>
          </template>
          <template #default-backPrice="scope">
            <span>{{ Number(scope.row.backPrice?scope.row.backPrice:0).toFixed(2) }}</span>
          </template>


          <template #default-writeOffPrice="scope">
            <span v-if="scope.row.type == '3' || scope.row.type == '4'">
              {{ Number(scope.row.payablePrice) < 0 && Number(scope.row.writeOffPrice) > 0 ? ('-' + Number(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toFixed(2)) :
              Number(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toFixed(2) }}
            </span>
            <span v-else>{{  Number(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toFixed(2) }}</span>
          </template>

          <template #default-code="scope">
            <span>{{ scope.row.code }}</span>
            <el-button v-if="props.isReport" link @click="accountUReportHandle(scope.row)">
              <el-icon>
                <Document />
              </el-icon>
            </el-button>
          </template>
          <template #default-status="scope">
            <span v-if="scope.row.remainPayablePrice != 0">{{ statusStrings[scope.row.status as keyof typeof StatusEnum]
            }}</span>
            <span v-else>冲销完成</span>
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
            <template #default-isInvoice="scope">
              <span>{{ scope.row.isInvoice == '1' ? '是' : '否' }}</span>
            </template>
          <template #default-make="scope">
            <el-button link type="primary" v-show="scope.row.status == '4'"
              @click="handleWriteOffRecord(scope.row)">冲销记录</el-button>
            <el-button link type="primary" @click="handle(HandleEnum.INFO, scope.row)">详情</el-button>
          </template>
        </XTable>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  <writeOffDialog v-model:open="writerOffDialogOpen" :writeOffList="writeOffList" :type="writeOffType"
    :titleColumnList="_writeOffTitleColumnList" :isSupplier="writeOffIsSupplier" @getList="getAllList"
    @close="cancelOrderSelect"></writeOffDialog>
  <commonWriteOffRecordDialog v-model:open="writerOffRecordDialogOpen" :accountOrderWriteOff="accountOrderWriteOff"
    :payRecordColumnList="payRecordColumnList" :repayRecordColumnList="repayRecordColumnList" :defaultRepay="defaultRepay"
    :type="writeOffType" @getList="getAllList" @close="cancelOrderSelect"></commonWriteOffRecordDialog>

  <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false"
    draggable>
    <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
  </el-drawer>
</template>

<script setup name="OrderSaleDetail" lang="ts">
import writeOffDialog from '../components/writeOffDialog.vue';
import writeOffsRecordDialog from '../components/writeOffRecordDialog.vue';
import { OrderFilinOutDetailQuery, OrderFilinOutDetailForm } from '@/api/financial/orderFilinOutDetail/types';
import {
  postListAccountOrder,
  delAccountOrderNew,
  listAccountOrderCount,
  updateAccountOrderStatus,
  submitAuditOrderSale
} from '@/api/financial/accountOrder';
import { AccountOrderVO, TypeEnum, StatusEnum, HandleEnum, statusStrings } from '@/api/financial/accountOrder/types';

import { parseTime } from "@/utils/ruoyi";
/**对账预览 */
import { getReportUrl } from '@/utils/report';
/** 对账单按钮操作 */
let reportUrl = ref("");
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '对账单'
});
const accountUReportHandle = async (row: any) => {
  reportDrawer.title = "对账单报表预览";
  reportDrawer.visible = true;
  reportUrl.value = getReportUrl() + `&_n=${props.accountName}&_u=file:saleAccount.ureport.xml&url=financial/accountOrder/review/${row.id}&listUrl=financial/orderSaleDetail/report/${row.id}&listUrl1=financial/accountOrder/reviewRecord/${row.id}`;
  reportUrl.value = reportUrl.value.replace("1,4,6", "2,4,6");
}
const changeOrderList = ref([]) // 用于保存送货单数据.修改了数据之后,切换页码时,需要保留已经修改的值

/**========汇总数据 ========= */
const accountPriceTotal = ref(0);
const backPriceTotal = ref(0);
const payablePriceTotal = ref(0);
const remainPayablePriceTotal = ref(0);
const writeOffPriceTotal = ref(0);
const accountDiscountPriceTotal = ref(0);
const otherPriceTotal = ref(0);

/**销售对账预览 */
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const taxRate = ref(0);
const orderFilinOutList = ref<AccountOrderVO[]>([]);
const orderFilinOutWaitList = ref<AccountOrderVO[]>([]);
const orderFilinOutAduitList = ref<AccountOrderVO[]>([]);

const loading = ref(true);
const loadingWait = ref(true);
const loadingFinsih = ref(true);
const total = ref(0);
const waitTotal = ref(0);
const aduitTotal = ref(0);



//冲销defin start
const aduitTableRef = ref();
const writerOffDialogOpen = ref(false);
const writerOffRecordDialogOpen = ref(false);
const writeOffList = ref<AccountOrderVO[]>([]);
const accountOrderWriteOff = ref<AccountOrderVO>();
//编辑和查看详情选择的对账单
const currentAccountOrderId = ref(undefined);
/**
* 冲销类型
* 1:付款
* 2:收款
*/
const writeOffType = ref("2");
const writeOffIsSupplier = ref(false);
//冲销弹窗上部tab列
const _writeOffTitleColumnList = ref();
//冲销记录显示的列名
const payRecordColumnList = ref();
const repayRecordColumnList = ref();
const defaultRepay = ref(false);
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
const XTableRef = ref();
const { queryParams: accQueryParams, form } = toRefs(data);
const { queryParams: accQueryParams2 } = toRefs(data2);
const { queryParams: accQueryParams3 } = toRefs(data3);
const drawerBorrow = reactive<DialogOption>({
  visible: false,
  title: '订单审核'
});
//头部按钮组
const radioTable = ref('对账单列表');
const intervalCondition = ['accountMonth', 'endTime', 'accountTime', 'createTime'];
const sortCondition = ['endTime'];


const emits = defineEmits(['handle'])
const props = withDefaults(defineProps<{
  open: boolean
  type: string
  tableColumnList: any
  tableColumnList2: any
  accountName: string
  writeOffIsSupplier: boolean,
  writeOffType: string,
  writeOffReverseAutoType: boolean,
  autoType: boolean,
  isReport: boolean,
  titleLabel: Object,
  writeOffTitleColumnList: any,
  payRecordColumnList: any,
  repayRecordColumnList: any,
  defaultRepay: boolean,
  toolId1:string,
  toolId2:string,
  toolId3:string,
  exportName:string
}>(), {
  open: false,
  type: TypeEnum.SALE,
  tableColumnList: () => [],
  tableColumnList2: () => [],
  accountName: '',
  writeOffIsSupplier: false,
  writeOffType: '2',
  writeOffReverseAutoType: false,
  autoType: false,
  isReport: false,
  titleLabel: undefined,
  writeOffTitleColumnList: undefined,
  payRecordColumnList: undefined,
  repayRecordColumnList: undefined,
  defaultRepay: false,
  toolId1:'toolId1',
  toolId2:'toolId2',
  toolId3:'toolId3',
  exportName:''
})

// 取消已审核列表勾选
const cancelOrderSelect = () => {
  changeOrderList.value.length = 0
  const $table = aduitTableRef.value.xTableRef;
  if ($table) {
    $table.clearCheckboxRow()
    writeOffList.value = []
  }
}
// 切换菜单栏 ***********
const radioTableHandle = async () => {


  columnList.value[0].visible = false
  if (radioTable.value == "对账单列表") {
    accQueryParams.value.status = undefined;
    columnList.value[0].visible = true
    await getList();
  } else if (radioTable.value == "已审核列表") {
    accQueryParams3.value.status = StatusEnum.AUDITED;
    columnList.value[0].visible = true;
    await getAduitList();
  } else if (radioTable.value == "待审核列表") {
    accQueryParams2.value.status = StatusEnum.BE_AUDITED;
    await getWaitList();
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
  await getList();
}
const searchChangeWait = async (params: any) => {
  accQueryParams2.value = params
  if (params.sorts && params.sorts.length > 0) {
    params.sorts.forEach((item: any) => {
      accQueryParams2.value.orderByColumn = item.prop;
      accQueryParams2.value.isAsc = item.order;
    })
  }
  await getWaitList();
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
const getAllList = async () => {
  await getList();
  await getWaitList();
  await getAduitList();
}
const getListCount = async (queryAny: any) => {
  const countRes = await listAccountOrderCount(queryAny);
  accountPriceTotal.value = countRes.accountPriceTotal ? countRes.accountPriceTotal : 0;
  backPriceTotal.value = countRes.backPriceTotal ? countRes.backPriceTotal : 0;
  payablePriceTotal.value = countRes.payablePriceTotal ? countRes.payablePriceTotal : 0;
  remainPayablePriceTotal.value = countRes.remainPayablePriceTotal ? countRes.remainPayablePriceTotal : 0;
  writeOffPriceTotal.value = countRes.writeOffPriceTotal ? countRes.writeOffPriceTotal : 0;
  accountDiscountPriceTotal.value = countRes.accountDiscountPriceTotal ? countRes.accountDiscountPriceTotal : 0;
  otherPriceTotal.value = countRes.otherPriceTotal ? countRes.otherPriceTotal : 0;

  accountPriceTotal.value = toFixTwoPrice(accountPriceTotal.value);
  backPriceTotal.value = toFixTwoPrice(backPriceTotal.value);
  payablePriceTotal.value = toFixTwoPrice(payablePriceTotal.value);
  remainPayablePriceTotal.value = toFixTwoPrice(remainPayablePriceTotal.value);
  writeOffPriceTotal.value = toFixTwoPrice(writeOffPriceTotal.value);
  accountDiscountPriceTotal.value = toFixTwoPrice(accountDiscountPriceTotal.value);
  otherPriceTotal.value = toFixTwoPrice(otherPriceTotal.value);
}

const toFixTwoPrice = (queryAny: any) => {
  return queryAny ? Number(queryAny).toFixed(2) : 0;
}


const getWaitList = async () => {
  loadingWait.value = true
  accQueryParams2.value.status = StatusEnum.BE_AUDITED;
  accQueryParams2.value.type = props.type;
  const res = await postListAccountOrder(accQueryParams2.value);
  orderFilinOutWaitList.value = res.rows;
  waitTotal.value = res.total;
  loadingWait.value = false
}
const getAduitList = async () => {
  loadingFinsih.value = true
  accQueryParams3.value.status = StatusEnum.AUDITED;
  accQueryParams3.value.type = props.type;
  const res = await postListAccountOrder(accQueryParams3.value);
  orderFilinOutAduitList.value = res.rows;
  aduitTotal.value = res.total;
  loadingFinsih.value = false
}
/** 查询退货单/收货对账单明细列表 */
const getList = async () => {
  loading.value = true;
  accQueryParams.value.status = undefined;
  accQueryParams.value.type = props.type;
  const res = await postListAccountOrder(accQueryParams.value);
  orderFilinOutList.value = res.rows;
  total.value = res.total;
  loading.value = false;
  getListCount(accQueryParams.value);
}
// 搜索 **************end



/** 按钮操作 */
const handle = async (handleType: HandleEnum, row?: AccountOrderVO) => {
  emits('handle', handleType, row);
}

/************aduit 审核操作 start ***********/


/** 提交*/
const checkPass = async (row: AccountOrderVO) => {
  await proxy?.$modal.confirm('是否确认提交对账单编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  updateStatus(row.id, StatusEnum.BE_AUDITED);
}
const updateStatus = (id: any, status: string) => {
  proxy?.$modal.loading('加载中...');
  updateAccountOrderStatus({ id, status }).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
    getAllList();
    drawerBorrow.visible = false;
    currentAccountOrderId.value = undefined;
  }).finally(() => proxy?.$modal.closeLoading());
}
/************aduit 审核操作 end ***********/

/************ 冲销操作 start ***********/
const handleWriteOff = async () => {
  //判断writeOffList是不是同一个供应商
  if (writeOffList.value.some(item => item.customerId != writeOffList.value[0].customerId)) {
    proxy?.$modal.msgError("不同客户不能一起进行账单冲销");
    return;
  }
  if (writeOffList.value.some(item => item.supplierId != writeOffList.value[0].supplierId)) {
    proxy?.$modal.msgError("不同供应商不能一起进行账单冲销");
    return;
  }
  if (writeOffList.value.some(item => item.payablePrice === "0.0000")) {
    proxy?.$modal.msgError("已核销的账单不能进行冲销");
    return;
  }

  // 自动类型情况下  合计 借入正数为收，借出相反,金额大于0是收款,否则是付款   1付2收
  if (props.autoType) {
    let total = 0;
    writeOffList.value.forEach(item => {
      total += parseFloat(item.remainPayablePrice as string);
    });
    //是否执行反向，用于借入借出
    if (!props.writeOffReverseAutoType) {
      //小于0付款
      if (total < 0) {
        writeOffType.value = "1";
        writeOffIsSupplier.value = false;
      }
      //大于0还是收款
      else {
        writeOffType.value = "2";
        writeOffIsSupplier.value = true;
      }
    } else {
      //小于0收款
      if (total < 0) {
        writeOffType.value = "2";
        writeOffIsSupplier.value = true;
      }
      //大于0付款款
      else {
        writeOffType.value = "1";
        writeOffIsSupplier.value = false;
      }
    }
    console.log("writeOffType.value 1:付款* 2:收款", writeOffType.value);
  }
  writerOffDialogOpen.value = true;
}
const handleSelectionChange = () => {
  const $table = aduitTableRef.value.xTableRef
  if ($table) {
    const records = $table.getCheckboxRecords();
    const sortRecords = records.sort((a: any, b: any) => new Date(a.accountTime).getTime() - new Date(b.accountTime).getTime());
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

const getTaxRate = async () => {
  const res = await proxy?.getConfigKey("taxRate");
  if (res != undefined) {
    taxRate.value = Number(res.data);
  }
}

const handleSubmitAduit = async () => {
  const _tableRef = XTableRef.value.xTableRef;
  const checkList = _tableRef.getCheckboxReserveRecords().concat(_tableRef.getCheckboxRecords());
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
  }).finally(() => proxy?.$modal.closeLoading());
  _tableRef.clearCheckboxRow();
  _tableRef.clearCheckboxReserve();
}

const submitSelectableFun = (scope: any) => {
  //当前选择状态为已审核或者待，禁选
  if (scope.row.status == '4' || scope.row.status == '2') {
    return false;
  }
  return true;
}
/** 删除按钮操作 */
const handleDelete = async (row?: any) => {
  const _ids = row?.id;
  await proxy?.$modal.confirm('是否确认删除对账单编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delAccountOrderNew(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}
/** 导出按钮操作 */
const handleExport = () => {
  let queryInfo = {};
      queryInfo = { ...accQueryParams.value, tableName: props.toolId1 }
  proxy?.download('financial/accountOrder/export', queryInfo, `${props.exportName}_${new Date().getTime()}.xlsx`)
}
const columnList = ref([]);
const columnList2 = ref([]);
onMounted(() => {
  getList();
  getTaxRate();
  columnList.value = props.tableColumnList;
  columnList2.value = props.tableColumnList2;
  writeOffIsSupplier.value = props.writeOffIsSupplier;
  writeOffType.value = props.writeOffType;
  _writeOffTitleColumnList.value = props.writeOffTitleColumnList;
  payRecordColumnList.value = props.payRecordColumnList;
  repayRecordColumnList.value = props.repayRecordColumnList;
  defaultRepay.value = props.defaultRepay

  console.log("props.writeOffTitleColumnList", props.writeOffTitleColumnList);
});

defineExpose({ radioTableHandle, cancelOrderSelect })
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
  //background:rgb(250, 236, 216)
}</style>
