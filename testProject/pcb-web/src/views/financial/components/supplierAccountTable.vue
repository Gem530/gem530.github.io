<template>
  <el-card shadow="never" class="xtable-card">
    <el-tabs class="xtable-tab" type="border-card" @tab-change="radioTableHandle" v-model="radioTable">
      <el-tab-pane label="对账单列表" name="对账单列表">
        <div class="global-flex flex-end flex-wrap" style="width: 100%;">
          <!-- <el-row :gutter="10" class="mb8" style="width:100%;margin:0;display:flex;justify-content: end;">
          <el-col :span="20"> -->
          <p class="totalTitle">
            <template v-if="!props.titleLabel?.labelHide1">
              {{ props.titleLabel && props.titleLabel.label1 ? (' ' + props.titleLabel.label1 + ':') : ' 应收金额汇总：' }}
              {{ Number(parseFloat(payablePriceTotal).toString()) }}
            </template>
            <template v-if="!props.titleLabel?.labelHide2">
              &nbsp;&nbsp;|&nbsp;&nbsp;{{ props.titleLabel && props.titleLabel.label2 ? (' ' + props.titleLabel.label2 + ':') : ' 退货金额汇总：' }}
              {{ Number(parseFloat(backPriceTotal).toString()) }}
            </template>
            <template v-if="!props.titleLabel?.labelHide3">
              &nbsp;&nbsp;|&nbsp;&nbsp;{{ props.titleLabel && props.titleLabel.label3 ? (' ' + props.titleLabel.label3 + ':') : ' 折损金额汇总：' }}
              {{ Number(parseFloat(accountDiscountPriceTotal).toString()) }}
            </template>
            <template v-if="!props.titleLabel?.labelHide4">
              &nbsp;&nbsp;|&nbsp;&nbsp;{{ props.titleLabel && props.titleLabel.label4 ? (' ' + props.titleLabel.label4 + ':') : ' 其他金额汇总：' }}
              {{ Number(parseFloat(otherPriceTotal).toString()) }}
            </template>
            <template v-if="!props.titleLabel?.labelHide5">
              &nbsp;&nbsp;|&nbsp;&nbsp;{{ props.titleLabel && props.titleLabel.label5 ? (' ' + props.titleLabel.label5 + ':') : ' 对账金额汇总：' }}
              {{ Number(parseFloat(accountPriceTotal).toString()) }}
            </template>
            <template v-if="!props.titleLabel?.labelHide6">
              &nbsp;&nbsp;|&nbsp;&nbsp;{{ props.titleLabel && props.titleLabel.label6 ? (' ' + props.titleLabel.label6 + ':') : ' 回款金额汇总：' }}
              {{ Number(parseFloat(writeOffPriceTotal).toString()) }}
            </template>
            <template v-if="!props.titleLabel?.labelHide7">
              &nbsp;&nbsp;|&nbsp;&nbsp;{{ props.titleLabel && props.titleLabel.label7 ? (' ' + props.titleLabel.label7 + ':') : ' 剩余金额汇总：' }}
              {{ Number(parseFloat(remainPayablePriceTotal).toString()) }}
            </template>
          </p>
          <!-- </el-col>
          <el-col :span="1.5"> -->
          <div style="margin-left: 12px;">
            <el-button plain @click="handleExport">导出</el-button>
            <el-button type="primary" plain @click="handle(HandleEnum.ADD)">合同对账</el-button>
          </div>
          <!-- <el-button v-if="radioTable == '对账单列表'" type="primary" plain @click="handleSubmitAduit">提交审核</el-button> -->
          <!-- </el-col>
        </el-row> -->
        </div>
        <XTable
          v-model:page-size="accQueryParams.pageSize"
          v-model:current-page="accQueryParams.pageNum"
          height="100%"
          class="xtable-content"
          :intervalCondition="intervalCondition"
          :page-params="{ perfect: true, total: total }"
          :data="orderFilinOutList"
          :columnList="columnList1"
          ref="XTableRef"
          border
          @searchChange="searchChange"
          :showRefresh="true"
          :sort-orders="sortCondition"
          :toolId="props.toolId1?props.toolId1:'toolId1'"
          :checkbox-config="{ checkMethod: submitSelectableFun, reserve: true }"
          :column-config="{ resizable: true }"
          :row-config="{ keyField: 'id' }"
          :loading="loading"
        >
          <template #default-accountPrice="scope">
            <span>{{ Number(parseFloat(scope.row.accountPrice?scope.row.accountPrice:0).toString()) }}</span>
          </template>
          <template #default-otherPrice="scope">
            <span>{{ Number(parseFloat(scope.row.otherPrice?scope.row.otherPrice:0).toString()) }}</span>
          </template>
          <template #default-payablePrice="scope">
            <span>{{ Number(parseFloat(scope.row.payablePrice?scope.row.payablePrice:0).toString()) }}</span>
          </template>
          <template #default-remainPayablePrice="scope">
            <span>{{ Number(parseFloat(scope.row.remainPayablePrice?scope.row.remainPayablePrice:0).toString()) }}</span>
          </template>
          <template #default-accountDiscountPrice="scope">
            <span>{{ Number(parseFloat(scope.row.accountDiscountPrice?scope.row.accountDiscountPrice:0).toString()) }}</span>
          </template>
          <template #default-backPrice="scope">
            <span>{{ Number(parseFloat(scope.row.backPrice?scope.row.backPrice:0).toString()) }}</span>
          </template>

          <template #default-writeOffPrice="scope">
            <span v-if="scope.row.type == '3' || scope.row.type == '4'">
              {{ Number(scope.row.payablePrice) < 0 && Number(scope.row.writeOffPrice) > 0 ? ('-' + Number(parseFloat(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toString())) :
              Number(parseFloat(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toString()) }}
            </span>
            <span v-else>{{  Number(parseFloat(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toString()) }}</span>
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
            <span>{{ statusStrings[scope.row.status as keyof typeof StatusEnum] }}</span>
            <!--            <span v-else>冲销完成</span>-->
          </template>
          <template #default-confirmStatus="scope">
            <div v-if="scope.row.status == '4' || scope.row.status == '5'" v-for="item in confirmStatusList">
              <el-tag :type="item.type" size="small" v-if="item.value === scope.row.confirmStatus">{{item.label}}</el-tag>
            </div>
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
            <el-button
              v-if="props.supplierQuery && (scope.row.supplierSwitch == '1' && scope.row.confirmStatus == '3' && scope.row.status!='5' && ((Number(scope.row.repayWriteOffPrice) == 0 &&
              Number(scope.row.payWriteOffPrice) == 0 && Number(scope.row.payablePrice) > 0)|| Number(scope.row.payablePrice) < 0))"
              link
              type="primary"
              @click="handleCancel(scope.row)"
              >取消</el-button
            >
            <el-button
              v-if="props.supplierQuery && scope.row.status == '4' && scope.row.confirmStatus == '2'"
              link
              type="primary"
              @click="handle(HandleEnum.CONFIRM, scope.row)"
              >确认</el-button
            >
            <el-button link type="primary" v-if="scope.row.confirmCancelFlag" @click="handle(HandleEnum.CONFIRM_CANCEL, scope.row)"
              >确认取消</el-button
            >
            <el-button v-if="props.supplierQuery && scope.row.status == '4'" link type="primary" @click="handleFile(scope.row)"
              >上传附件</el-button
            >
            <el-button
              v-if="props.supplierQuery && (scope.row.status == '4' || scope.row.status == '5'|| scope.row.confirmStatus)"
              link
              type="primary"
              @click="handleRecord(scope.row)"
              >确认记录</el-button
            >
            <el-button link type="primary" v-if="scope.row.status != '5'" @click="accountUReportHandle(scope.row)">打印</el-button>
            <el-button link type="primary" v-if="scope.row.status == '1' || scope.row.status == '3'" @click="handle(HandleEnum.EDIT, scope.row)"
              >编辑</el-button
            >
            <el-button link type="primary" v-if="scope.row.status == '1' || scope.row.status == '3'" @click="checkPass(scope.row)">提交</el-button>
            <el-button link type="primary" v-if="scope.row.status == '2'" @click="handle(HandleEnum.EXAMINE, scope.row)">审核</el-button>
            <el-button v-if="props.supplierQuery && scope.row.rejectFlag" link type="primary" @click="handleReject(scope.row)">驳回</el-button>
            <el-button link type="primary" @click="handle(HandleEnum.INFO, scope.row)">详情</el-button>
            <el-button
              v-if="props.supplierQuery && (scope.row.status !== '1' && scope.row.status !== '2' && scope.row.status !== '3')"
              link
              type="primary"
              @click="generateUrlLink(scope.row)"
              >分享链接</el-button
            >

            <el-button link type="primary" v-if="scope.row.status == '1' || scope.row.status == '3'" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </XTable>
      </el-tab-pane>
      <el-tab-pane label="待审核列表" name="待审核列表">
        <XTable
          v-model:page-size="accQueryParams2.pageSize"
          v-model:current-page="accQueryParams2.pageNum"
          height="100%"
          class="xtable-content"
          :intervalCondition="intervalCondition"
          :showRefresh="true"
          :sort-orders="sortCondition"
          :page-params="{ perfect: true, total: waitTotal }"
          :data="orderFilinOutWaitList"
          :columnList="columnList"
          ref="custTableRef"
          border
          @searchChange="searchChangeWait"
          :column-config="{ resizable: true }"
          :toolId="props.toolId2?props.toolId2:'toolId2'"
          :loading="loadingWait"
          :row-config="{ keyField: 'id' }"
        >
          <template #default-accountPrice="scope">
            <span>{{ Number(parseFloat(scope.row.accountPrice?scope.row.accountPrice:0).toString()) }}</span>
          </template>
          <template #default-otherPrice="scope">
            <span>{{ Number(parseFloat(scope.row.otherPrice?scope.row.otherPrice:0).toString()) }}</span>
          </template>
          <template #default-payablePrice="scope">
            <span>{{ Number(parseFloat(scope.row.payablePrice?scope.row.payablePrice:0).toString()) }}</span>
          </template>
          <template #default-remainPayablePrice="scope">
            <span>{{ Number(parseFloat(scope.row.remainPayablePrice?scope.row.remainPayablePrice:0).toString()) }}</span>
          </template>
          <template #default-accountDiscountPrice="scope">
            <span>{{ Number(parseFloat(scope.row.accountDiscountPrice?scope.row.accountDiscountPrice:0).toString()) }}</span>
          </template>
          <template #default-backPrice="scope">
            <span>{{ Number(parseFloat(scope.row.backPrice?scope.row.backPrice:0).toString()) }}</span>
          </template>

          <template #default-writeOffPrice="scope">
            <span v-if="scope.row.type == '3' || scope.row.type == '4'">
              {{ Number(scope.row.payablePrice) < 0 && Number(scope.row.writeOffPrice) > 0 ? ('-' + Number(parseFloat(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toString())) :
              Number(parseFloat(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toString()) }}
            </span>
            <span v-else>{{  Number(parseFloat(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toString()) }}</span>
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
            <span>{{ statusStrings[scope.row.status as keyof typeof StatusEnum]
            }}</span>
            <!--            <span v-else>冲销完成</span>-->
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
            <el-button link type="primary" v-show="scope.row.status == '2' && scope.row.confirmStatus" @click="handleFile(scope.row)">上传附件</el-button>
            <el-button link type="primary" v-show="scope.row.status == '2'" @click="handle(HandleEnum.EXAMINE, scope.row)">审核</el-button>
            <el-button link type="primary" @click="handle(HandleEnum.INFO, scope.row)">详情</el-button>
          </template>
        </XTable>
      </el-tab-pane>
      <el-tab-pane label="已审核列表" name="已审核列表">
        <el-row :gutter="10" class="mb8" style="width:100%;margin:0;display:flex;justify-content: end;">
          <!-- <div style="display:flex;;line-height: 24px;font-size: 14px;text-align: center;">

          </div>  -->
          <el-col :span="1.5" v-show="radioTable.includes('已审核')">
            <el-button plain @click="handleExport">导出</el-button>
          </el-col>
        </el-row>
        <XTable
          v-model:page-size="accQueryParams3.pageSize"
          v-model:current-page="accQueryParams3.pageNum"
          height="100%"
          class="xtable-content"
          :intervalCondition="intervalCondition"
          :showRefresh="true"
          :sort-orders="sortCondition"
          :page-params="{ perfect: true, total: aduitTotal }"
          :data="orderFilinOutAduitList"
          :columnList="columnList2"
          ref="aduitTableRef"
          border
          @searchChange="searchChangeAduit"
          :column-config="{ resizable: true }"
          :loading="loadingFinsih"
          @checkbox-all="handleSelectionChange"
          @checkbox-change="handleSelectionChange"
          :checkbox-config="{ trigger: 'row', checkMethod: selectableFun }"
          :toolId="props.toolId3?props.toolId3:'toolId3'"
          :row-config="{ keyField: 'id' }"
        >
          <template #default-accountPrice="scope">
            <span>{{ Number(parseFloat(scope.row.accountPrice?scope.row.accountPrice:0).toString()) }}</span>
          </template>
          <template #default-otherPrice="scope">
            <span>{{ Number(parseFloat(scope.row.otherPrice?scope.row.otherPrice:0).toString()) }}</span>
          </template>
          <template #default-payablePrice="scope">
            <span>{{ Number(parseFloat(scope.row.payablePrice?scope.row.payablePrice:0).toString()) }}</span>
          </template>
          <template #default-remainPayablePrice="scope">
            <span>{{ Number(parseFloat(scope.row.remainPayablePrice?scope.row.remainPayablePrice:0).toString()) }}</span>
          </template>
          <template #default-accountDiscountPrice="scope">
            <span>{{ Number(parseFloat(scope.row.accountDiscountPrice?scope.row.accountDiscountPrice:0).toString()) }}</span>
          </template>
          <template #default-backPrice="scope">
            <span>{{ Number(parseFloat(scope.row.backPrice?scope.row.backPrice:0).toString()) }}</span>
          </template>
          <template #default-isInvoice="scope">
            <span>{{ scope.row.isInvoice == '1' ? '是' : '否' }}</span>
          </template>

          <template #default-writeOffPrice="scope">
            <span v-if="scope.row.type == '3' || scope.row.type == '4'">
              {{ Number(scope.row.payablePrice) < 0 && Number(scope.row.writeOffPrice) > 0 ? ('-' + Number(parseFloat(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toString())) :
              Number(parseFloat(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toString()) }}
            </span>
            <span v-else>{{  Number(parseFloat(scope.row.writeOffPrice?scope.row.writeOffPrice:0).toString()) }}</span>
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
            <div v-if="props.supplierQuery" v-for="item in confirmStatusList">
              <el-tag :type="item.type" size="small" v-if="item.value === scope.row.confirmStatus">{{item.label}}</el-tag>
            </div>
            <div v-else>{{ statusStrings[scope.row.status as keyof typeof StatusEnum] }}</div>
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
            <el-button
              v-if="props.supplierQuery && scope.row.status == '4' && scope.row.confirmStatus == '2'"
              link
              type="primary"
              @click="handle(HandleEnum.CONFIRM, scope.row)"
              >确认</el-button
            >
            <el-button
              v-if="props.supplierQuery && (scope.row.supplierSwitch == '1' && scope.row.confirmStatus == '3' && ((Number(scope.row.repayWriteOffPrice) == 0 &&
              Number(scope.row.payWriteOffPrice) == 0 && Number(scope.row.payablePrice) > 0)|| Number(scope.row.payablePrice) < 0))"
              link
              type="primary"
              @click="handleCancel(scope.row)"
              >取消</el-button
            >
            <el-button v-if="props.supplierQuery && scope.row.confirmCancelFlag" link type="primary" @click="handleConfirmCancel(scope.row)"
              >确认取消</el-button
            >
            <el-button v-if="props.supplierQuery" link type="primary" @click="handleFile(scope.row)">上传附件</el-button>
            <el-button v-if="props.supplierQuery" link type="primary" @click="generateUrlLink(scope.row)">分享链接</el-button>
            <el-button v-if="props.supplierQuery" link type="primary" @click="handleRecord(scope.row)">确认记录</el-button>
            <el-button link type="primary" @click="handle(HandleEnum.INFO, scope.row)">详情</el-button>
            <el-button v-if="props.supplierQuery" link type="primary" v-show="scope.row.rejectFlag" @click="handleReject(scope.row)">驳回</el-button>
          </template>
        </XTable>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  <writeOffDialog
    v-model:open="writerOffDialogOpen"
    :writeOffList="writeOffList"
    :type="writeOffType"
    :titleColumnList="_writeOffTitleColumnList"
    :isSupplier="writeOffIsSupplier"
    @getList="getAllList"
    @close="cancelOrderSelect"
  ></writeOffDialog>
  <commonWriteOffRecordDialog
    v-model:open="writerOffRecordDialogOpen"
    :accountOrderWriteOff="accountOrderWriteOff"
    :payRecordColumnList="payRecordColumnList"
    :repayRecordColumnList="repayRecordColumnList"
    :defaultRepay="defaultRepay"
    :type="writeOffType"
    @getList="getAllList"
    @close="cancelOrderSelect"
  ></commonWriteOffRecordDialog>

  <!-- 文件上传 -->
  <ContractFileDialog
    v-if="uploadVisible"
    v-model:show="uploadVisible"
    :moduleCode="props.moduleCode"
    :bizType="props.bizType"
    :id="id"
    :biz-code="bizCode"
    :findType="2"
  />
  <!-- 操作记录 -->
  <ConfirmRecordDialog v-if="recordVisible" v-model:show="recordVisible" :id="id" :orderId="orderId" />
</template>

<script setup name="OrderSaleDetail" lang="ts">
import writeOffDialog from '../components/writeOffDialog.vue';
import writeOffsRecordDialog from '../components/writeOffRecordDialog.vue';
import { OrderFilinOutDetailQuery, OrderFilinOutDetailForm } from '@/api/financial/orderFilinOutDetail/types';
import {
  postListSupAccountOrder,
  delAccountOrderSupplier,
  listSupAccountOrderCount,
  updateAccountOrderStatus,
  submitAuditOrderSale, cancelAccount,verifyStatus
} from '@/api/financial/accountOrder';
import { AccountOrderVO, TypeEnum, StatusEnum, HandleEnum, statusStrings } from '@/api/financial/accountOrder/types';

import { parseTime } from "@/utils/ruoyi";
import clipboard3 from "vue-clipboard3";
import { getUrlLink } from "@/api/purchase/materialOrder";
import useUserStore from "@/store/modules/user";
import {ref} from "vue";

const accountUReportHandle = async (row: any) => {
  emits('accountUReportHandle',row)
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

const confirmStatusList = ref([
  { type:"warning",  label: '待确认', value: "2" },
  {type:"primary", label: '待对方确认', value: "1" },
  {type:"success", label: '已确认', value: "3" }
]);

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


const emits = defineEmits(['handle','accountUReportHandle'])
const props = withDefaults(defineProps<{
  open: boolean
  type: string
  tableColumnList: any
  tableColumnList1: any
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
  exportName:string,
  moduleCode:string,
  bizType:string,
  supplierQuery: boolean,
  isSupplier: boolean,

}>(), {
  open: false,
  type: TypeEnum.SALE,
  tableColumnList: () => [],
  tableColumnList1: () => [],
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
  exportName:'',
  moduleCode:'',
  bizType:'',
  supplierQuery: true,
  isSupplier: false,
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
    //accQueryParams.value.status = undefined;
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
  queryAny.isAllData = props.isSupplier;
  const countRes = await listSupAccountOrderCount(queryAny);
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
  return queryAny ? Number(parseFloat(queryAny).toString()) : 0;
}


const getWaitList = async () => {
  loadingWait.value = true
  accQueryParams2.value.status = StatusEnum.BE_AUDITED;
  accQueryParams2.value.type = props.type;
  const res = await postListSupAccountOrder(accQueryParams2.value);
  orderFilinOutWaitList.value = res.rows;
  waitTotal.value = res.total;
  loadingWait.value = false
}
const getAduitList = async () => {
  loadingFinsih.value = true
  accQueryParams3.value.status = StatusEnum.AUDITED;
  accQueryParams3.value.type = props.type;
  accQueryParams3.value.isAllData = props.isSupplier;
  const res = await postListSupAccountOrder(accQueryParams3.value);
  orderFilinOutAduitList.value = res.rows;
  aduitTotal.value = res.total;
  console.log('orderFilinOutAduitList------', res)
  loadingFinsih.value = false
}
/** 查询退货单/收货对账单明细列表 */
const getList = async () => {
  loading.value = true;
  //accQueryParams.value.status = undefined;
  accQueryParams.value.type = props.type;
  accQueryParams.value.isAllData = props.isSupplier;
  console.log('----------', accQueryParams.value);
  const res = await postListSupAccountOrder(accQueryParams.value);
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

    drawerBorrow.visible = false;
    currentAccountOrderId.value = undefined;
  }).finally(() => {
     getAllList();
    proxy?.$modal.closeLoading();
  });

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
  await delAccountOrderSupplier(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}
/** 驳回按钮操作 */
const handleReject = async (row?: any) => {
   //验证订单是否能确认
    let hasUpdate = await verifyStatus({id:row.id,handleType:HandleEnum.REJECT});
    if (!hasUpdate.data) {
      ElMessage.error("数据状态已变更，请刷新页面后重试");
      //刷新列表
      await getAduitList();
      getList();
      return;
    }
  const _ids = row?.id;
  await proxy?.$modal.confirm('是否确认驳回对账单编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);

  updateStatus(_ids, StatusEnum.REJECTED);


}
/** 导出按钮操作 */
const handleExport = () => {

  let queryInfo = {};
      // queryInfo = { ...accQueryParams.value, tableName: props.toolId1 }
  if (radioTable.value == "对账单列表") {
    queryInfo = { ...accQueryParams.value }
    queryInfo.status = undefined;
  } else if (radioTable.value == "已审核列表") {
    queryInfo = { ...accQueryParams3.value }
    queryInfo.status = StatusEnum.AUDITED;
  } else if (radioTable.value == "待审核列表") {
    queryInfo.status = StatusEnum.BE_AUDITED;
  }
  queryInfo.tableName = props.toolId3;
  proxy?.download('financial/accountOrder/supExport', queryInfo, `${props.exportName}_${new Date().getTime()}.xlsx`)
}

const id = ref<string | number>();
const bizCode = ref<string>();

const uploadVisible = ref(false);
const recordVisible = ref(false);
/**
 * 上传文件
 */
/** 文件按钮操作 */
const handleFile = async (row: MaterialOrderDetailVO) => {
  if(props.moduleCode == '5') {
    // 采购单号
    id.value = row.orderId;
    bizCode.value = row.orderCode;
  }else {
    id.value = row.id;
    bizCode.value = row.code;
  }
  uploadVisible.value=true;
}


const orderId = ref<string | number>();
/**
 * 操作记录
 */
/** 查询操作记录 */
const handleRecord = async (row: MaterialOrderDetailVO) => {
  id.value = row.id;
  orderId.value = row.orderId;
  recordVisible.value = true;
}

/** 取消单据 */
const handleCancel = async (row: any) => {
   //验证订单是否能确认
    let hasUpdate = await verifyStatus({id:row.id,handleType:HandleEnum.CANCEL});
    if (!hasUpdate.data) {
      ElMessage.error("数据状态已变更，请刷新页面后重试");
      getList();
      //刷新列表
      await getAduitList();

      return;
    }
  const id = row.id;
  const confirmStatus = '1';
  const status = '5';
  await proxy?.$modal.confirm('是否申请取消单号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading("加载中...");
  await cancelAccount({id, confirmStatus, status}).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("操作成功");
  getList();
  await getAduitList();

}
/** 确认取消单据 */
const handleConfirmCancel = async (row: any) => {
   //验证订单是否能确认
    let hasUpdate = await verifyStatus({id:row.id,handleType:HandleEnum.CONFIRM_CANCEL});
    if (!hasUpdate.data) {
      ElMessage.error("数据状态已变更，请刷新页面后重试");
      //刷新列表
      await getAduitList();
      return;
    }
  const id = row.id;
  const confirmStatus = '1';
  const status = '5';
  // await proxy?.$modal.confirm('是否确认取消单号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
 let unInitEditPrice = false;
 let isClose=false;
  await  ElMessageBox.confirm(
      '是否确认取消单号为"' + row.code + '"的数据项？',
      '提示',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: '驳回',
        cancelButtonText: '确认',
        dangerouslyUseHTMLString: true,
        confirmButtonClass: 'el-button--danger',
        cancelButtonClass: 'el-button--primary',
        type: 'warning',
      }
    ).then( async () => {
      console.log('驳回');
    }).catch((action: any) => {
      if(action === 'cancel'){
        console.log('cancel');

      }else if(action === 'close'){
        console.log('close');
      }
    });


  proxy?.$modal.loading("加载中...");
  await cancelAccount({id, confirmStatus, status}).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("修改成功");
  await getAduitList();
}

//解构出复制方法
const { toClipboard } = clipboard3();
const { userId } = useUserStore();
/** 生成分享链接并复制 */
const generateUrlLink = async (row : any) => {
  let path = 'pages/reviewPdf/index';
  let query = 'companyId=' + row.companyId +'&shareUserId=' + userId +'&id='+row.id+'&type=4&isReview=2&code=' + '' ;
  const res = await getUrlLink({path: path,query: query});
  console.log(res)
  try {
    await toClipboard(res.data);
    proxy?.$modal.msgSuccess("复制成功!");
  } catch (error) {
    alert("复制失败!请重试!")
  }
  return res.data || '' ;
}



const columnList = ref([]);
const columnList2 = ref([]);
const columnList1 = ref([]);
onMounted(() => {
  getList();
  getTaxRate();
  columnList.value = props.tableColumnList;
  console.log('props.tableColumnList2',props.tableColumnList2)
  columnList2.value = props.tableColumnList2 && props.tableColumnList2.length !== 0 ? props.tableColumnList2 : props.tableColumnList;
  console.log('columnList2.value',columnList2.value)
  columnList1.value = props.tableColumnList1 ? props.tableColumnList1 : props.tableColumnList;
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
}
</style>
