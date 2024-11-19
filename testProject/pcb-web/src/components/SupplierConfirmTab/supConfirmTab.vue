<template>
  <el-card shadow="never" class="xtable-card">
    <el-tabs v-model="editableTabsValue" @tab-change="getVoidedList()" type="border-card" class="xtable-tab">
      <el-tab-pane label="待确认列表" :name="1">
        <div class="p-2" style="text-align: right;width: 100%">
          <el-row :gutter="10" class="mb8" style="line-height: 32px;width:100%;margin:0;display:flex;justify-content: end;">
            <div style="display:flex;font-size: 14px">
              <div v-if="cancelModule.includes(props.moduleCode)" style="text-align: center;width: 55px;background-color: #ecb1b1">已取消</div>
            </div>
            <el-col :span="1.5">
              <el-button :loading="buttonLoading" type="primary" @click="exportExcel">导出</el-button>
            </el-col>
          </el-row>
        </div>
        <XTable
          :toolId="props.toolId1"
          v-model:page-size="queryParams.pageSize"
          v-model:current-page="queryParams.pageNum"
          :intervalCondition="props.intervalCondition"
          height="100%"
          class="xtable-content"
          :page-params="{ perfect: true, total: props.total }"
          :data="props.dataList"
          :columnList="props.columnList"
          border
          :showRefresh="true"
          :loading="props.loading"
          @searchChange="searchChange"
          :column-config="{ resizable: true }"
          :row-config="{ keyField: 'id' }"
          :row-style="tableRowClassName"
          ref="waitConfirmTableRef"
        >
          <template #default-confirmStatus="scope">
            <div v-for="item in confirmStatusList">
              <el-tag :type="item.type" size="small" v-if="item.value === scope.row.confirmStatus">{{item.label}}</el-tag>
            </div>
          </template>
          <template #default-status="scope">
            <div v-if="props.moduleCode == '5'">
              <el-tag size="small" v-if="'1' === scope.row.status">否</el-tag>
              <el-tag size="small" v-else>是</el-tag>
            </div>
          </template>
          <template #default-model="scope">
            <div>{{ props.dictData?.order_model.find(v => v.dictValue == scope.row.model)?.dictLabel }}</div>
          </template>
          <template #default-orderType="scope">
            <div>{{ props.dictData?.order_type.find(v => v.dictValue == scope.row.orderType)?.dictLabel }}</div>
          </template>
          <template #default-isTax="{ row }">
            <span>{{ row.isTax == '1' ? '是' : '否' }}</span>
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
          <template #default-backTotalPrice="scope">
            <div>{{ (Number(scope.row.price)*Number(scope.row.quantity)).toFixed(2) }}</div>
          </template>

          <template #default-make="scope">
            <el-button link v-if="props.moduleCode == '5' && scope.row.status == '3'" type="primary" @click="statementConfirm(scope.row)"
              >结单确认</el-button
            >
            <el-button
              link
              v-if="confirmModule.includes(props.moduleCode) || (props.moduleCode == 8 && scope.row.status=='4')"
              type="primary"
              @click="handleConfirm(scope.row)"
              >确认</el-button
            >
            <el-button link type="primary" v-show="scope.row.confirmCancelFlag" @click="handleConfirm(scope.row)">确认取消</el-button>
            <el-button link type="primary" @click="accountPrint(scope.row)">打印</el-button>
            <el-button link type="primary" v-show="props.moduleCode == '8'" @click="accountInfo(scope.row)">详情</el-button>
            <!-- <el-button link type="primary" v-show="props.moduleCode == '8'" @click="relatedDeduction(scope.row)">关联扣款记录</el-button> -->
            <!--            <el-button link v-if="((props.moduleCode == '5' && scope.row.status == '1') || scope.row.detailStatus == '1')
                && scope.row.quantity != scope.row.receiveQuantity" type="primary" @click="handleStatement(scope.row)">结单</el-button>-->
            <el-button link type="primary" @click="handleFile(scope.row)">上传附件</el-button>
            <el-button
              link
              v-if="props.moduleCode == '5' || props.moduleCode == '10'|| props.moduleCode == '8'"
              type="primary"
              @click="generateUrlLink(scope.row)"
              >分享链接</el-button
            >
            <el-button link type="primary" @click="handleRecord(scope.row)">确认记录</el-button>
          </template>
        </XTable>
      </el-tab-pane>
      <el-tab-pane label="已确认列表" :name="2">
        <div class="p-2" style="text-align: right;width: 100%">
          <el-row :gutter="10" class="mb8" style="line-height: 32px;width:100%;margin:0;display:flex;justify-content: end;">
            <div style="display:flex;font-size: 14px">
              <div v-if="cancelModule.includes(props.moduleCode)" style="text-align: center;width: 55px;background-color: #ecb1b1">已取消</div>
            </div>
            <el-col :span="1.5">
              <el-button :loading="buttonLoading" type="primary" @click="exportExcel">导出</el-button>
            </el-col>
          </el-row>
        </div>
        <XTable
          :toolId="props.toolId2"
          v-model:page-size="confirmQueryParams.pageSize"
          v-model:current-page="confirmQueryParams.pageNum"
          :intervalCondition="props.intervalCondition"
          height="100%"
          class="xtable-content"
          :page-params="{ perfect: true, total: props.total }"
          :data="props.dataList"
          :columnList="props.columnList2"
          border
          :showRefresh="true"
          :loading="props.loading"
          @searchChange="searchConfirmChange"
          :column-config="{ resizable: true }"
          :row-config="{ keyField: 'id' }"
          :row-style="tableRowClassName"
          ref="confirmedTableRef"
        >
          <template #default-status="scope">
            <div v-if="props.moduleCode == '5'">
              <el-tag size="small" v-if="'1' === scope.row.status">否</el-tag>
              <el-tag size="small" v-else>是</el-tag>
            </div>
          </template>
          <template #default-confirmStatus="scope">
            <div v-for="item in confirmStatusList">
              <el-tag :type="item.type" size="small" v-if="item.value === scope.row.confirmStatus">{{item.label}}</el-tag>
            </div>
          </template>
          <template #default-model="scope">
            <div>{{ props.dictData?.order_model.find(v => v.dictValue == scope.row.model)?.dictLabel }}</div>
          </template>
          <template #default-orderType="scope">
            <div>{{ props.dictData?.order_type.find(v => v.dictValue == scope.row.orderType)?.dictLabel }}</div>
          </template>
          <template #default-isTax="{ row }">
            <span>{{ row.isTax == '1' ? '是' : '否' }}</span>
          </template>
          <template #default-backTotalPrice="scope">
            <div>{{ (Number(scope.row.price)*Number(scope.row.quantity)).toFixed(2) }}</div>
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
          <template #default-isInvoice="scope">
            <span>{{ scope.row.isInvoice == '1' ? '是' : '否' }}</span>
          </template>
          <template #default-make="scope">
            <el-button link v-if="props.moduleCode == '5' && scope.row.status == '3'" type="primary" @click="statementConfirm(scope.row)"
              >结单确认</el-button
            >
            <el-button link type="primary" @click="accountPrint(scope.row)">打印</el-button>
            <el-button link type="primary" v-show="props.moduleCode == '8'" @click="accountInfo(scope.row)">详情</el-button>
            <el-button link type="primary" v-show="isCanCancel(scope.row)" @click="handleCancel(scope.row)">取消 </el-button>
            <el-button
              link
              v-if="scope.row.supplierSwitch == '1' && ((props.moduleCode == '5' && scope.row.status == '1' && scope.row.orderStatus == '3')
              || scope.row.detailStatus == '1') && scope.row.quantity != scope.row.receiveQuantity"
              type="primary"
              @click="handleStatement(scope.row)"
            >
              结单</el-button
            >
            <el-button link type="primary" @click="handleFile(scope.row)">上传附件</el-button>
            <el-button
              link
              type="primary"
              v-if="props.moduleCode == '5' || props.moduleCode == '10' || props.moduleCode == '8'"
              @click="generateUrlLink(scope.row)"
              >分享链接</el-button
            >
            <el-button link type="primary" @click="handleRecord(scope.row)">确认记录</el-button>
          </template>
        </XTable>
      </el-tab-pane>
      <el-tab-pane :label="lableValue" :name="3">
        <div class="p-2" style="text-align: right;width: 100%">
          <el-row :gutter="10" class="mb8" style="line-height: 32px;width:100%;margin:0;display:flex;justify-content: end;">
            <div style="display:flex;font-size: 14px">
              <div v-if="cancelModule.includes(props.moduleCode)" style="text-align: center;width: 55px;background-color: #ecb1b1">已取消</div>
            </div>
            <el-col :span="1.5">
              <el-button :loading="buttonLoading" type="primary" @click="exportExcel">导出</el-button>
            </el-col>
          </el-row>
        </div>
        <XTable
          :toolId="props.toolId3"
          v-model:page-size="waitQueryParams.pageSize"
          v-model:current-page="waitQueryParams.pageNum"
          :intervalCondition="props.intervalCondition"
          height="100%"
          class="xtable-content"
          :page-params="{ perfect: true, total: props.total }"
          :data="props.dataList"
          :columnList="props.columnList3"
          border
          :showRefresh="true"
          :loading="props.loading"
          @searchChange="searchWaitChange"
          :column-config="{ resizable: true }"
          :row-config="{ keyField: 'id' }"
          :row-style="tableRowClassName"
          ref="waitOtherConfirmTableRef"
        >
          <template #default-status="scope">
            <div v-if="props.moduleCode == '5'">
              <el-tag size="small" v-if="'1' === scope.row.status">否</el-tag>
              <el-tag size="small" v-else>是</el-tag>
            </div>
          </template>
          <template #default-confirmStatus="scope">
            <div v-for="item in confirmStatusList">
              <el-tag :type="item.type" size="small" v-if="item.value === scope.row.confirmStatus">{{item.label}}</el-tag>
            </div>
          </template>
          <template #default-model="scope">
            <div>{{ props.dictData?.order_model.find(v => v.dictValue == scope.row.model)?.dictLabel }}</div>
          </template>
          <template #default-orderType="scope">
            <div>{{ props.dictData?.order_type.find(v => v.dictValue == scope.row.orderType)?.dictLabel }}</div>
          </template>
          <template #default-isTax="{ row }">
            <span>{{ row.isTax == '1' ? '是' : '否' }}</span>
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
          <template #default-backTotalPrice="scope">
            <div>{{ (Number(scope.row.price)*Number(scope.row.quantity)).toFixed(2) }}</div>
          </template>

          <template #default-make="scope">
            <el-button link v-if="props.moduleCode == '5' && scope.row.status == '3'" type="primary" @click="statementConfirm(scope.row)"
              >结单确认</el-button
            >
            <el-button link type="primary" @click="accountPrint(scope.row)">打印</el-button>
            <!--            <el-button link v-if="((props.moduleCode == '5' && scope.row.status == '1') || scope.row.detailStatus == '1')
                && scope.row.quantity != scope.row.receiveQuantity" type="primary" @click="handleStatement(scope.row)">结单</el-button>-->
            <el-button link type="primary" v-show="props.moduleCode == '8'" @click="accountInfo(scope.row)">详情</el-button>
            <el-button link type="primary" @click="handleFile(scope.row)">上传附件</el-button>
            <el-button
              link
              type="primary"
              v-if="props.moduleCode == '5' || props.moduleCode == '10' || props.moduleCode == '8'"
              @click="generateUrlLink(scope.row)"
              >分享链接</el-button
            >
            <el-button link type="primary" @click="handleRecord(scope.row)">确认记录</el-button>
          </template>
        </XTable>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  <el-dialog v-model="exportVisible" title="导出提示" width="20%" align-center destroy-on-close>
    <span> 没有设置起始时间，将默认导出30天内的数据 </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="exportVisible = false">取消</el-button>
        <el-button type="primary" @click="exportExcel"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 文件上传 -->
  <ContractFileDialog
    v-if="uploadVisible"
    v-model:show="uploadVisible"
    :moduleCode="props.moduleCode"
    :bizType="props.bizType"
    :id="id"
    :biz-code="bizCode"
    :findType="props.findType"
  />
  <!-- 操作记录 -->
  <ConfirmRecordDialog v-if="recordVisible" v-model:show="recordVisible" :id="id" :orderId="orderId" />

  <!-- 结单对话框 -->
  <el-dialog v-model="statement.visible" :title="statement.title" width="30%" align-center destroy-on-close>
    <el-row>
      <el-col :span="24">
        <el-form ref="detailFormRef" :model="detailForm" :rules="detailRules" label-width="80px">
          <el-form-item :label="statement.describe" prop="confirmRemark">
            <el-input v-model="detailForm.confirmRemark" maxLength="2000" :rows="2" type="textarea" placeholder="请输入备注" />
          </el-form-item>
          <el-form-item label="id" prop="id" v-show="false">
            <el-input v-model="detailForm.id" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="statement.visible = false">取消</el-button>
        <el-button v-if="statement.title === '结单确认'" type="danger" @click="statementAccount('1')">驳回</el-button>
        <el-button v-if="statement.title === '申请结单'" type="primary" @click="statementAccount('4')">确认</el-button>
        <el-button v-if="statement.title === '申请取消'" type="primary" @click="cancelAccount">确认</el-button>
        <el-button v-if="statement.title === '结单确认'" type="primary" @click="statementConfirmOrder">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup name="SupConfirmTab" lang="ts">
import {MaterialOrderForm} from '@/api/purchase/materialOrder/types';
import { MaterialOrderDetailVO } from "@/api/purchase/materialOrderDetail/types";
import {ref} from "vue";
import { parseTime } from "@/utils/ruoyi";
import {getMaterialOrderDetail, getStatementInfo, statementDetail} from "@/api/purchase/materialHandleDetail";
import {outSourceStatementDetail} from "@/api/outsource/sourceFullProcessOrder";
import { getUrlLink } from "@/api/purchase/materialOrder";
const emits = defineEmits(['searchChange','exportExcel','cancelAccount','accountPrint','handleConfirm','relatedDeduction','accountInfo'])
import clipboard3 from "vue-clipboard3";
import useUserStore from "@/store/modules/user";
import { decryptBase64ByStr } from '@/utils/crypto'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const props = withDefaults(defineProps<{
  dataList: any[],
  columnList: any[],
  columnList2: any[],
  columnList3: any[],
  intervalCondition: any[],
  toolId1: string,
  toolId2: string,
  toolId3: string,
  loading: boolean,
  total: number,
  moduleCode: string,
  bizType: string,
  dictData: any,
  statusSwitch: boolean,
  findType: number,
}>(), {
 dataList: ()=>[],
columnList: ()=>[],
columnList2: ()=>[],
columnList3: ()=>[],
intervalCondition: ()=>[],
toolId1: '',
toolId2: '',
toolId3: '',
loading: false,
total: 0,
moduleCode: '',
bizType: '',
dictData: undefined,
isOutHalf: false,
statusSwitch: false,
findType: 1
})

const confirmStatusList = ref([
  { type:"warning", label: '待确认', value: (props.statusSwitch?"1":"2") },
  { type:"primary", label: '待对方确认', value: (props.statusSwitch?"2":"1") },
  { type:"success", label: '已确认', value: "3" }
]);


const unitOptions = ref([
  { value: "1", label: "大料" },
  { value: "2", label: "PNL" },
  { value: "3", label: "SET" },
])

const cancelModule = ref(['5', '8']);
const confirmModule = ref(['5', '10']);

let lableValue = confirmModule.value.includes(props.moduleCode) ? '待买方确认' : '待对方确认列表';

const buttonLoading = ref(false);

const exportVisible = ref(false);
const uploadVisible = ref(false);
const recordVisible = ref(false);
const statement = reactive<any>({
  visible: false,
  title: '',
  describe: '',
});
const detailFormRef = ref<ElFormInstance>();

const initFormData: MaterialOrderForm = {
  id: undefined,
  code: undefined,
  supplierId: undefined,
  addressId: undefined,
  auditUserId: undefined,
  auditUserName: undefined,
  submitUserId: undefined,
  submitUserName: undefined,
  remark: undefined,
  status: undefined,
  createTime: undefined,
  confirmRemark: undefined
}

const detailData = reactive<PageData<any, any>>({
  form: { ...initFormData },
  queryParams: {},
  rules: {
    confirmRemark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
  }
});

const {form : detailForm, rules: detailRules } = toRefs(detailData);

const data = reactive<PageData<any, any>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    supplierId: undefined,
    addressId: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    submitUserId: undefined,
    submitUserName: undefined,
    status: undefined,
    confirmStatus: '2',
    params: {
    }
  },
  rules : {}
});
const data2 = reactive<PageData<any, any>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    supplierId: undefined,
    addressId: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    submitUserId: undefined,
    submitUserName: undefined,
    status: undefined,
    confirmStatus: '3',
    params: {
    }
  },
  rules : {}
});
const data3 = reactive<PageData<any, any>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    supplierId: undefined,
    addressId: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    submitUserId: undefined,
    submitUserName: undefined,
    status: undefined,
    confirmStatus: '1',
    params: {
    }
  },
  rules : {}
});
const { queryParams} = toRefs(data);
const { queryParams: confirmQueryParams, } = toRefs(data2);
const { queryParams: waitQueryParams } = toRefs(data3);

const route = useRoute();
/**
 * 进入页面次数
 */
const isFirst = ref(0)
/**
 * 待办跳转参数
 */
const pendingParams = ref()
const waitConfirmTableRef = ref()
const confirmedTableRef = ref()
const waitOtherConfirmTableRef = ref()

// 获取 搜索条件
const searchChange = (params: any) => {
  if(props.statusSwitch) {
    params.confirmStatus = '1';
  }else {
    params.confirmStatus = '2';
  }
  queryParams.value = params
  getSupplierOrderDetailList();
}

// 获取 搜索条件
const searchConfirmChange = (params: any) => {
  params.confirmStatus = '3';
  confirmQueryParams.value = params
  getConfirmOrderDetailList();
}

// 获取 搜索条件
const searchWaitChange = (params: any) => {
  if(props.statusSwitch) {
    params.confirmStatus = '2';}
  else {
  params.confirmStatus = '1';
  }
  waitQueryParams.value = params
  getWaitOrderDetailList();
}

// 新增属性
const editableTabsValue = ref(1);
/**
 * 查询tab页
 */
const getVoidedList = async () => {
  // queryParams.value =
  if (1 == editableTabsValue.value) {

    getSupplierOrderDetailList();
  } else if (2 == editableTabsValue.value) {

    getConfirmOrderDetailList();
  } else {

    getWaitOrderDetailList();
  }
}

/**
 * 查询按采购订单列表
 * */
const getSupplierOrderDetailList = async () => {
   if(props.statusSwitch) {
    queryParams.value.confirmStatus = '1';
  }else {
    queryParams.value.confirmStatus = '2';
  }
  if(queryParams.value.sorts&&queryParams.value.sorts.length>0){
    queryParams.value.sorts.forEach((item:any)=>{
      queryParams.value.orderByColumn=item.prop;
      queryParams.value.isAsc=item.order;
    })
  }
   emits('searchChange',queryParams.value);
}

/**
 * 查询已确认按采购订单列表
 * */
const getConfirmOrderDetailList = async () => {
  confirmQueryParams.value.confirmStatus = '3';
  if(confirmQueryParams.value.sorts&&confirmQueryParams.value.sorts.length>0){
    confirmQueryParams.value.sorts.forEach((item:any)=>{
      confirmQueryParams.value.orderByColumn=item.prop;
      confirmQueryParams.value.isAsc=item.order;
    })
  }
  emits('searchChange',confirmQueryParams.value);
}

/**
 * 查询待对方按采购订单列表
 * */
const getWaitOrderDetailList = async () => {
    if(props.statusSwitch) {
    waitQueryParams.value.confirmStatus = '2';
  }else {
    waitQueryParams.value.confirmStatus = '1';
  }
  if(waitQueryParams.value.sorts&&waitQueryParams.value.sorts.length>0){
    waitQueryParams.value.sorts.forEach((item:any)=>{
      waitQueryParams.value.orderByColumn=item.prop;
      waitQueryParams.value.isAsc=item.order;
    })
  }
  await emits('searchChange',waitQueryParams.value);
}


/** 导出前操作 */
const exportExcelBefore = async () => {
  if(1 == editableTabsValue.value){
    //先看看有没有给起始时间，没有要给出提示
    if (!queryParams.value.deliverTimeStart) {
      exportVisible.value = true;
    } else {
      emits('exportExcel',queryParams.value, props.toolId1);
    }
  }else if(2 == editableTabsValue.value){

    //先看看有没有给起始时间，没有要给出提示
    if (!confirmQueryParams.value.deliverTimeStart) {
      exportVisible.value = true;
    } else {
      emits('exportExcel',confirmQueryParams.value, props.toolId2);
    }
  }else{
    //先看看有没有给起始时间，没有要给出提示
    if (!waitQueryParams.value.deliverTimeStart) {
      exportVisible.value = true;
    } else {
      emits('exportExcel',waitQueryParams.value, props.toolId3);
    }
  }
}

/** 导出按钮操作 */
const exportExcel = () => {
  if(1 == editableTabsValue.value) {
   if(props.statusSwitch) {
    queryParams.value.confirmStatus = '1';
  }else {
    queryParams.value.confirmStatus = '2';
  }
  emits('exportExcel',queryParams.value, props.toolId1);
  }else if(2 == editableTabsValue.value){
 confirmQueryParams.value.confirmStatus = '3';
   emits('exportExcel',confirmQueryParams.value, props.toolId2);
  }else{
      if(props.statusSwitch) {
    waitQueryParams.value.confirmStatus = '2';
  }else {
    waitQueryParams.value.confirmStatus = '1';
  }
    emits('exportExcel',waitQueryParams.value, props.toolId3);
  }
  exportVisible.value = false;
}

const id = ref<string | number>();
const bizCode = ref<string>();

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
    id.value = row.bizId || row.id;
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

/** 结单按钮 */
const handleStatement = async (row?: any) => {
  detailForm.value = { ...initFormData };
  detailForm.value.id = row?.id;
  detailForm.value.materialCode = row?.rawMaterialCode;
  detailForm.value.commodityCode = row?.commodityCode
  statement.visible = true;
  statement.title = '申请结单';
  statement.describe = '结单备注';
}

/** 结单 */
const statementAccount = async (status: string) => {
  detailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (props.moduleCode == '5') {
        var materialCode = detailForm.value.materialCode;
        detailForm.value.status = status;
        detailForm.value.idList = [detailForm.value.id];
        if(status == '1') {
          await proxy?.$modal.confirm('是否确认驳回物料编码编号为"' + materialCode + '"的数据项结单申请？');
        }else{
          await proxy?.$modal.confirm('是否确认物料编码编号为"' + materialCode + '"的数据项结单？');
        }
        proxy?.$modal.loading("加载中...");
        await statementDetail(detailForm.value).finally(() => proxy?.$modal.closeLoading());
      } else {
        var commodityCode = detailForm.value.commodityCode;
        detailForm.value.detailStatus = status;
        if(status == '1') {
          await proxy?.$modal.confirm('是否确认驳回产品编号为"' + commodityCode + '"的数据项结单申请？');
        } else {
          await proxy?.$modal.confirm('是否确认产品编号为"' + commodityCode + '"的数据项结单？');
        }
        proxy?.$modal.loading("加载中...");
        await outSourceStatementDetail(detailForm.value).finally(() => proxy?.$modal.closeLoading());
      }

      proxy?.$modal.msgSuccess("修改成功");
      statement.visible = false;
      await getVoidedList();
    }
  });
}

/** 取消按钮 */
const handleCancel = async (row?: any) => {
  detailForm.value = { ...initFormData };
  if(props.moduleCode == '5'){
    detailForm.value.id = row?.orderId;
    detailForm.value.code = row?.orderCode;
  } else {
    detailForm.value.id = row?.id;
    detailForm.value.code = row?.code;
  }
  if (props.moduleCode == '8') {
    await proxy?.$modal.confirm('是否确认取消单号为"' + detailForm.value.code + '"的数据项？');
    await emits('cancelAccount', detailForm.value);
    await getVoidedList();
    return;
  }
  statement.title = '申请取消';
  statement.describe = '取消备注';
  statement.visible = true;
}

/** 取消单据 */
const cancelAccount = async () => {
  detailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      await proxy?.$modal.confirm('是否确认取消单号为"' + detailForm.value.code + '"的数据项？');
      await emits('cancelAccount', detailForm.value);
      statement.visible = false;
      await getVoidedList();
    }
  });
}

/** 取消数据底色修改 */
const tableRowClassName = (row: any) => {
  if (props.moduleCode == '5' && row.row.orderStatus === "8") {
    return {
      backgroundColor: '#ecb1b1'
    }
  } else if (props.moduleCode == '8' && row.row.status === "5") {
    return {
      backgroundColor: '#ecb1b1'
    }
  }
  return ''
}

const accountPrint = async (row: any) => {
  emits('accountPrint', row);
}
const accountInfo = async (row: any) => {
  emits('accountInfo', row);
}
const relatedDeduction = async (row: any) => {
  emits('relatedDeduction', row);
}


//解构出复制方法
const { toClipboard } = clipboard3();
const { userId } = useUserStore();
/** 生成分享链接并复制 */
const generateUrlLink = async (row : any) => {
  if(props.moduleCode == '5') {
    // 采购单号
    let path = 'pages/subOne/procurementSignature/contract/detail/index';
    let query = 'id='+row.orderId+'&companyId=' + row.supplierCompanyId+'&shareUserId=' + userId;
    const res = await getUrlLink({path: path,query: query});
    console.log(res)
    try {
      await toClipboard(res.data);
      proxy?.$modal.msgSuccess("复制成功!");
    } catch (error) {
      alert("复制失败!请重试!")
    }
    return res.data || '' ;
  }else if(props.moduleCode == '10'){
    // 退货单号
    let path = 'pages/subOne/procurementSignature/returnOrder/detail/index';
    let query = 'id='+row.code+'&status=' + row.confirmStatus+'&companyId=' + row.supplierCompanyId+'&shareUserId=' + userId;
    const res = await getUrlLink({path: path,query: query});
    console.log(res)
    try {
      await toClipboard(res.data);
      proxy?.$modal.msgSuccess("复制成功!");
    } catch (error) {
      alert("复制失败!请重试!")
    }
    return res.data || '' ;
  }else if(props.moduleCode == '8'){
    // 对账单
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
}

/** 是否可以取消 */
const isCanCancel = (row: any) => {
  if (props.moduleCode == '5') {
    // 采购单
    return row.supplierSwitch == '1' && row.orderStatus == '3' && !row.cancelCode.includes(row.orderCode);
  } else if (props.moduleCode == '8') {
    // 采购对账单(应付金额为正数时且冲销金额为0或者应付为负数)
    return row.status == '4' && ((Number(row.repayWriteOffPrice) == 0 && Number(row.payWriteOffPrice) == 0 && Number(row.payablePrice) > 0)
      || Number(row.payablePrice) < 0);
  }
  return false;
}

/** 确认操作 */
const handleConfirm = async (row: any) => {
  emits('handleConfirm', row);
}

/** 结单确认按钮 */
const statementConfirm = async (row?: any) => {
  detailForm.value = { ...initFormData };
  detailForm.value.id = row?.id;
  detailForm.value.materialCode = row?.rawMaterialCode;
  detailForm.value.commodityCode = row?.commodityCode
  const res = await getStatementInfo(row?.id);
  detailForm.value.confirmRemark = res.data.confirmRemark;
  statement.visible = true;
  statement.title = '结单确认';
  statement.describe = '结单备注';
}

/** 结单 */
const statementConfirmOrder = async () => {
  detailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      var materialCode = detailForm.value.materialCode;
      detailForm.value.status = '2';
      detailForm.value.idList = [detailForm.value.id];
      await proxy?.$modal.confirm('是否确认物料编码编号为"' + materialCode + '"的数据项结单？');
      proxy?.$modal.loading("加载中...");
      await statementDetail(detailForm.value).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("修改成功");
      statement.visible = false;
      await getVoidedList();
    }
  });
}
/**
 * 监听路由变化
 */
watch(() => route.query?.pendingParams, (newVal) => {
  if (newVal) {
    let decryptStr = route.query?.pendingParams ? decryptBase64ByStr(route.query.pendingParams) : '{}'
    if (decryptStr && decryptStr != '{}' && (decryptStr == pendingParams.value)) return;
    // 再次进入页面确认用
    pendingParams.value = decryptStr
    if (decryptStr && decryptStr != '{}') {
      const params = JSON.parse(decryptStr);
      let tab = !isNaN(Number(params.tab)) ? Number(params.tab) : 1;
      editableTabsValue.value = tab
      confirmQueryParams.value.code = params.bizNo
      let tempColumnList = [{field: 'orderCode', defaultValue: params.bizNo}]
      if (tab === 1) {
        setTimeout(() => {
          waitConfirmTableRef.value.filterFieldEvent(tempColumnList)
        }, 100)
      } else if (tab === 2) {
        setTimeout(() => {
          confirmedTableRef.value.filterFieldEvent(tempColumnList)
        }, 100)
      } else if (tab === 3) {
        setTimeout(() => {
          waitOtherConfirmTableRef.value.filterFieldEvent(tempColumnList)
        }, 100)
      }
    }
  }
}, {deep: true, immediate: true})
/**
 * 重新进入页面时
 */
onActivated(() => {
})
onMounted(() => {
});
</script>
