<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs v-model="editableTabsValue" @tab-change="getVoidedList()" type="border-card" class="xtable-tab">
        <el-tab-pane label="可接单列表" :name="1">
          <div class="p-2" style="text-align: right;width: 100%">
            <el-button :loading="buttonLoading" type="primary" @click="exportExcelBefore">导出</el-button>
          </div>
          <XTable
            :toolId="toolId1"
            v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum"
            :intervalCondition="['placeOrderTime']"
            height="100%"
            class="xtable-content"
            :page-params="{ perfect: true, total: total }"
            :data="dataList"
            :columnList="columnList"
            border
            :showRefresh="true"
            :loading="loading"
            @searchChange="searchChange"
            :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }"
          >
            <template #default-confirmStatus="scope">
              <div v-for="item in confirmStatusList">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.confirmStatus">{{item.label}}</el-tag>
              </div>
            </template>
            <template #default-unit="scope">
              <div>{{ unitOptions.find(v => v.value == scope.row.unit)?.label }}</div>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-show="scope.row.quantity-scope.row.sendQuantity > 0 && scope.row.detailStatus === '1'" @click="handleStatement(scope.row)">
                结单</el-button>
              <el-button link type="primary" @click="handleFile(scope.row)">上传附件</el-button>
              <el-button link type="primary" @click="handleRecord(scope.row)">确认记录</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="已接单列表" :name="2">
          <div class="p-2" style="text-align: right;width: 100%">
            <el-button :loading="buttonLoading" type="primary" @click="exportExcelBefore">导出</el-button>
          </div>
          <XTable
            :toolId="toolId2"
            v-model:page-size="confirmQueryParams.pageSize"
            v-model:current-page="confirmQueryParams.pageNum"
            :intervalCondition="['placeOrderTime']"
            height="100%"
            class="xtable-content"
            :page-params="{ perfect: true, total: total }"
            :data="dataList"
            :columnList="columnList2"
            border
            :showRefresh="true"
            :loading="loading"
            @searchChange="searchConfirmChange"
            :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }"
          >
            <template #default-confirmStatus="scope">
              <div v-for="item in confirmStatusList">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.confirmStatus">{{item.label}}</el-tag>
              </div>
            </template>
            <template #default-unit="scope">
              <div>{{ unitOptions.find(v => v.value == scope.row.unit)?.label }}</div>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-show="scope.row.confirmStatus == '3'" @click="handleCancel(scope.row)">取消</el-button>
              <el-button link type="primary" v-show="scope.row.quantity-scope.row.sendQuantity > 0 && scope.row.detailStatus === '1'" @click="handleStatement(scope.row)">
                结单</el-button>
              <el-button link type="primary" @click="handleFile(scope.row)">上传附件</el-button>
              <el-button link type="primary" @click="handleRecord(scope.row)">确认记录</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="待对方确认列表" :name="3">
          <div class="p-2" style="text-align: right;width: 100%">
            <el-button :loading="buttonLoading" type="primary" @click="exportExcelBefore">导出</el-button>
          </div>
          <XTable
            :toolId="toolId3"
            v-model:page-size="waitQueryParams.pageSize"
            v-model:current-page="waitQueryParams.pageNum"
            :intervalCondition="['placeOrderTime']"
            height="100%"
            class="xtable-content"
            :page-params="{ perfect: true, total: total }"
            :data="dataList"
            :columnList="columnList2"
            border
            :showRefresh="true"
            :loading="loading"
            @searchChange="searchWaitChange"
            :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }"
          >
            <template #default-confirmStatus="scope">
              <div v-for="item in confirmStatusList">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.confirmStatus">{{item.label}}</el-tag>
              </div>
            </template>
            <template #default-unit="scope">
              <div>{{ unitOptions.find(v => v.value == scope.row.unit)?.label }}</div>
            </template>

            <template #default-make="scope">
              <el-button link type="primary" v-show="scope.row.quantity-scope.row.sendQuantity > 0 && scope.row.detailStatus === '1'" @click="handleStatement(scope.row)">
                结单</el-button>
              <el-button link type="primary" @click="handleFile(scope.row)">上传附件</el-button>
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
        <el-button type="primary" @click="handleExportExcel"> 确认 </el-button>
      </span>
      </template>
    </el-dialog>

    <!-- 文件上传 -->
    <ContractFileDialog v-if="uploadVisible" v-model:show="uploadVisible" :moduleCode="moduleCode"
                        :bizType="bizType" :id="id" :biz-code="bizCode"/>
    <!-- 操作记录 -->
    <ConfirmRecordDialog v-if="recordVisible" v-model:show="recordVisible" :id="id"/>

    <!-- 结单对话框 -->
    <el-dialog v-model="statement.visible" :title="statement.title" width="30%" align-center destroy-on-close>
      <el-row>
        <el-col :span="24">
          <el-form ref="detailOrderFormRef" :model="detailForm" :rules="detailRules" label-width="80px">
            <el-form-item :label="statement.describe" prop="confirmRemark">
              <el-input v-model="detailForm.confirmRemark" maxLength="2000" :rows="2" type="textarea" placeholder="请输入备注" />
            </el-form-item>
            <el-form-item label="id" prop="id" v-show="false">
              <el-input v-model="detailForm.id"/>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="statement.visible = false">取消</el-button>
          <el-button v-if="statement.title === '申请结单'" type="primary" @click="statementAccount">确认</el-button>
          <el-button v-if="statement.title === '申请取消'" type="primary" @click="cancelAccount">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="PurchaseOrder" lang="ts">
import {
  listSupplierHalfOrder,
  sourceHalfCancelOrder,
  sourceHalfStatementDetail
} from "@/api/outsource/sourceHalfProcessOrder";
import {ref} from "vue";
import {MaterialOrderForm} from "@/api/purchase/materialOrder/types";
import {SourceHalfProcessOrderForm, SourceHalfProcessOrderQuery} from "@/api/outsource/sourceHalfProcessOrder/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dataList = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const editableTabsValue = ref(1);
const id = ref<string | number>();
const bizCode = ref<string>();

const toolId1 = ref("waitConfirmHalfDetails");
const toolId2 = ref("confirmBackHalfDetails");
const toolId3 = ref("waitOtherBackHalfDetails");

// 文件上传类型
const moduleCode = ref('16');
const bizType = ref('16');

const columnList = ref([
  { title: "序号",field: 'seq', type: 'seq', align: 'center', fixed: 'left', width: '60' },
  {
    title: '外协单号',
    width: '140',
    field: 'code',
    align: 'center',
    fixed: 'left',
    filterType: 'input',
    filterParam: { placeholder: '请输入外协单号' }
  },
  {
    title: '产品编码',
    field: 'commodityCode',
    align: 'center',
    fixed: 'left',
    filterType: 'input',
    filterParam: { placeholder: '请输入产品编码' }
  },
  {
    title: '下单时间', width: '140', fixed: 'left', field: 'placeOrderTime', align: 'center', filterType: 'intervalDate', filterParam: {
      startParams: { placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  {title: '客户', width: '140', field: 'ownerName', align: 'center' },
  {
    title: '加工工序', width: '100', field: 'craftName', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入加工工序' }
  },
  { title: '加工数量', width: '80', field: 'quantity', align: 'center', },
  { title: '长', width: '80', field: 'length', align: 'center', },
  { title: '宽', width: '80', field: 'width', align: 'center', },
  { title: '加工单位', width: '80', field: 'unit', align: 'center', },
  { title: '加工类型', width: '80', field: 'typeName', align: 'center', },
  { title: '加工要求', field: 'requirement', align: 'center', },
  { title: '备注', field: 'remark', align: 'center', },
  { title: '状态',width:'80', field: 'confirmStatus', align: 'center', fixed: 'right',},
  { title: '操作', field: 'make', align: 'center', width: '180', fixed: 'right', },
]);

const columnList2 = ref([
  { title: "序号",field: 'seq', type: 'seq', align: 'center', fixed: 'left', width: '60' },
  {
    title: '外协单号',
    width: '140',
    field: 'code',
    align: 'center',
    fixed: 'left',
    filterType: 'input',
    filterParam: { placeholder: '请输入外协单号' }
  },
  {
    title: '产品编码',
    field: 'commodityCode',
    align: 'center',
    fixed: 'left',
    filterType: 'input',
    filterParam: { placeholder: '请输入产品编码' }
  },
  {
    title: '下单时间', width: '140', fixed: 'left', field: 'placeOrderTime', align: 'center', filterType: 'intervalDate', filterParam: {
      startParams: { placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  {title: '客户', width: '140', field: 'ownerName', align: 'center' },
  {
    title: '加工工序', width: '100', field: 'craftName', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入加工工序' }
  },
  { title: '加工数量', width: '80', field: 'quantity', align: 'center', },
  { title: '长', width: '80', field: 'length', align: 'center', },
  { title: '宽', width: '80', field: 'width', align: 'center', },
  { title: '加工单位', width: '80', field: 'unit', align: 'center', },
  { title: '加工类型', width: '80', field: 'typeName', align: 'center', },
  { title: '加工要求', field: 'requirement', align: 'center', },
  { title: '备注', field: 'remark', align: 'center', },
  { title: '状态',width:'80', field: 'confirmStatus', align: 'center', fixed: 'right',},
  { title: '接单人', width: '70', field: 'takeOrderUserName', align: 'center', fixed: 'right',},
  { title: '接单时间', width: '100', field: 'takeOrderTime', align: 'center', fixed: 'right',},
  { title: '操作', field: 'make', align: 'center', width: '180', fixed: 'right', },
]);

const unitOptions = ref([
  { value: "1", label: "大料" },
  { value: "2", label: "PNL" },
  { value: "3", label: "SET" },
])

const confirmStatusList = ref([
  { type:"warning", label: '待接单确认', value: "2" },
  { type:"primary", label: '待对方确认', value: "1" },
  { type:"success", label: '已确认', value: "3" }
]);

const buttonLoading = ref(false);

const exportVisible = ref(false);
const uploadVisible = ref(false);
const recordVisible = ref(false);

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
  createTime: undefined
}

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

const detailData = reactive<PageData<SourceHalfProcessOrderForm, SourceHalfProcessOrderQuery>>({
  form: { ...initFormData },
  queryParams: {},
  rules: {
    confirmRemark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
  }
});
const {form : detailForm, rules: detailRules } = toRefs(detailData);

// 获取 搜索条件
const searchChange = (params: any) => {
  params.confirmStatus = '2';
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
  params.confirmStatus = '1';
  waitQueryParams.value = params
  getWaitOrderDetailList();
}
/**
 * 查询tab页
 */
const getVoidedList = async () => {
  // queryParams.value =
  if (1 == editableTabsValue.value) {
    getSupplierList(queryParams.value);
  } else if (2 == editableTabsValue.value) {
    getSupplierList(confirmQueryParams.value);
  } else {
    getSupplierList(waitQueryParams.value);
  }
}

// 获取 搜索条件
const getSupplierList = async (params: any) => {
  loading.value = true;
  const res = await listSupplierHalfOrder(params);
  dataList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 导出前操作 */
const exportExcel = async (queryParams:any,toolId :any) => {
        proxy?.download('outsource/sourceHalfProcessOrder/supExport', {
          ...queryParams, tableName: toolId
        }, `工序外协订单_${new Date().getTime()}.xlsx`);
      }
/**
 * 查询外协订单列表
 * */
const getWaitSupplierList = async () => {
  let queryParams= {
    pageNum: 1,
    pageSize: 20,
    confirmStatus: '2',
   }
  getSupplierList(queryParams);
}
/**
 * 查询按采购订单列表
 * */
const getSupplierOrderDetailList = async () => {
  getSupplierList(queryParams.value);
}

/**
 * 查询已确认按采购订单列表
 * */
const getConfirmOrderDetailList = async () => {
  getSupplierList(confirmQueryParams.value);
}

/**
 * 查询待对方按采购订单列表
 * */
const getWaitOrderDetailList = async () => {
  getSupplierList(waitQueryParams.value);
}


/** 导出前操作 */
const exportExcelBefore = async () => {
  if(1 == editableTabsValue.value){
      exportExcel(queryParams.value, toolId1.value);
  }else if(2 == editableTabsValue.value){
      exportExcel(confirmQueryParams.value, toolId2.value);
  }else{
      exportExcel(waitQueryParams.value, toolId3.value);
  }
}

/** 导出按钮操作 */
const handleExportExcel = () => {
  if(1 == editableTabsValue.value) {
    exportExcel(queryParams.value, toolId1.value);
  }else if(2 == editableTabsValue.value){
    exportExcel(confirmQueryParams.value, toolId2.value);
  }else{
    exportExcel(waitQueryParams.value, toolId3.value);
  }
  exportVisible.value = false;
}
/**
 * 上传文件
 */
/** 文件按钮操作 */
const handleFile = async (row: any) => {
  id.value = row.id;
  bizCode.value = row.code;
  uploadVisible.value = true;
}

const orderId = ref<string | number>();
/**
 * 操作记录
 */
/** 查询操作记录 */
const handleRecord = async (row: any) => {
  id.value = row.id;
  orderId.value = row.orderId;
  recordVisible.value = true;
}

const statement = reactive<any>({
  visible: false,
  title: '',
  describe: '',
});
const detailOrderFormRef = ref<ElFormInstance>();

/** 结单按钮 */
const handleStatement = async (row?: any) => {
  detailForm.value = { ...initFormData };
  detailForm.value.id = row?.id;
  detailForm.value.commodityCode = row?.commodityCode;
  statement.visible = true;
}

/** 结单 */
const statementAccount = async () => {
  detailOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      var commodityCode = detailForm.value.commodityCode;
      detailForm.value.detailStatus = '4';
      detailForm.value.idList = [detailForm.value.id];
      await proxy?.$modal.confirm('是否确认产品编号为"' + commodityCode + '"的数据项结单？').finally(() => loading.value = false);
      proxy?.$modal.loading("加载中...");
      await sourceHalfStatementDetail(detailForm.value).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("修改成功");
      statement.visible = false;
      await getVoidedList();
    }
  });
}

/** 取消按钮 */
const handleCancel = async (row?: any) => {
  detailForm.value = { ...initFormData };
  detailForm.value.id = row?.id;
  detailForm.value.code = row?.code;
  statement.title = '申请取消';
  statement.describe = '取消备注';
  statement.visible = true;
}

/** 取消单据 */
const cancelAccount = async () => {
  detailOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      detailForm.value.status = '2';
      detailForm.value.confirmStatus = '1';
      await proxy?.$modal.confirm('是否确认取消单号为"' + detailForm.value.code + '"的数据项？').finally(() => loading.value = false);
      proxy?.$modal.loading("加载中...");
      await sourceHalfCancelOrder(detailForm.value).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("修改成功");
      statement.visible = false;
      await getVoidedList();
    }
  });
}
onMounted(() => {
  getWaitSupplierList();
});
</script>
<style scoped lang="scss">
.expand-wrapper {
  padding-left: 39px;
}
</style>
