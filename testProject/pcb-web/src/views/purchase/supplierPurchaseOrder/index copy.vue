<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs v-model="editableTabsValue" @tab-change="getVoidedList()" type="border-card" class="xtable-tab">
        <el-tab-pane label="待确认列表" :name="1">
          <div class="p-2" style="text-align: right;width: 100%">
            <el-button :loading="buttonLoading" type="primary" @click="exportExcelBefore">导出</el-button>
          </div>
          <XTable toolId="waitConfirmDetails" v-model:page-size="queryParams.pageSize"
                  v-model:current-page="queryParams.pageNum" :intervalCondition="['deliverTime']" height="100%"
                  class="xtable-content" :page-params="{ perfect: true, total: total }" :data="waitConfirmList"
                  :columnList="columnList" border :showRefresh="true" :loading="loading"
                  @searchChange="searchChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">

            <template #default-confirmStatus="scope">
              <dict-tag :options="confirmStatusList" :value="scope.row.confirmStatus" />
            </template>

            <template #default-make="scope">
              <el-button link type="primary" @click="handleFile(scope.row)">上传附件</el-button>
              <el-button link type="primary" @click="handleRecord(scope.row)">确认记录</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="已确认列表" :name="2">
          <div class="p-2" style="text-align: right;width: 100%">
            <el-button :loading="buttonLoading" type="primary" @click="exportExcelBefore">导出</el-button>
          </div>
          <XTable toolId="confirmDetails" v-model:page-size="confirmQueryParams.pageSize"
                  v-model:current-page="confirmQueryParams.pageNum" :intervalCondition="['deliverTime']" height="100%"
                  class="xtable-content" :page-params="{ perfect: true, total: confirmTotal }" :data="confirmList"
                  :columnList="columnList" border :showRefresh="true" :loading="loading"
                  @searchChange="searchConfirmChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">

            <template #default-confirmStatus="scope">
              <dict-tag :options="confirmStatusList" :value="scope.row.confirmStatus" />
            </template>

            <template #default-make="scope">
              <el-button link type="primary" @click="handleFile(scope.row)">上传附件</el-button>
              <el-button link type="primary" @click="handleRecord(scope.row)">确认记录</el-button>
            </template>
          </XTable>

        </el-tab-pane>
        <el-tab-pane label="待对方确认列表" :name="3">
          <div class="p-2" style="text-align: right;width: 100%">
            <el-button :loading="buttonLoading" type="primary" @click="exportExcelBefore">导出</el-button>
          </div>
          <XTable toolId="waitOtherConfirmDetails" v-model:page-size="waitQueryParams.pageSize"
            v-model:current-page="waitQueryParams.pageNum" :intervalCondition="['deliverTime']" height="100%"
            class="xtable-content" :page-params="{ perfect: true, total: waitTotal }" :data="waitOtherConfirmList"
            :columnList="columnList" border :showRefresh="true" :loading="loading"
            @searchChange="searchWaitChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">

            <template #default-confirmStatus="scope">
              <dict-tag :options="confirmStatusList" :value="scope.row.confirmStatus" />
            </template>

            <template #default-make="scope">
              <el-button link type="primary" @click="handleFile(scope.row)">上传附件</el-button>
              <el-button link type="primary" @click="handleRecord(scope.row)">确认记录</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--上传附件对话框-->
    <el-dialog v-model="uploadVisible" title="附件下载" width="50%" align-center destroy-on-close>
      <el-form ref="ossFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文件名">
          <XUpload v-model:model-value="ossForm.file" :fileType="fileType" model="download" :limit="1" @fileChange="craftFileChange" @delFile="(val, files) => delFile(val, files, 1)"></XUpload>
        </el-form-item>
      </el-form>
      <div class="expand-wrapper">
        <vxe-table border :data="fileList" :loading="loading">
          <vxe-column width="80" field="index" title="序号" type="seq"></vxe-column>
          <vxe-column width="120" field="bizType" title="类型">
            <template #default="scope">
              <div v-for="item in fileTypeList">
                <span v-if="item.value == scope.row.bizType">{{ item.label }}</span>
              </div>
            </template>
          </vxe-column>
          <vxe-column width="120" field="createByName" title="上传人"></vxe-column>
          <vxe-column width="160" field="createTime" title="上传时间"></vxe-column>
          <vxe-column width="300" field="name" title="附件">
            <template #default="scope">
              <el-button type="primary" link @click="downLoadHandle(scope.row.key)">{{scope.row.name}}</el-button>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitOSSForm">确 定</el-button>
          <el-button @click="cancelOSS">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <!--操作记录对话框-->
    <el-dialog v-model="recordVisible" title="操作记录" width="60%" align-center destroy-on-close>
      <div class="expand-wrapper">
        <vxe-table border :data="fileList" :loading="loading">
          <vxe-column width="80" field="index" title="序号" type="seq"></vxe-column>
          <vxe-column width="140" field="bizType" title="所属单位"></vxe-column>
          <vxe-column width="120" field="createByName" title="操作人"></vxe-column>
          <vxe-column width="160" field="createTime" title="操作时间"></vxe-column>
          <vxe-column width="200" field="operateContent" title="操作内容"></vxe-column>
          <vxe-column width="160" field="remark" title="确认备注"></vxe-column>
        </vxe-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelRecord">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="exportVisible" title="导出提示" width="20%" align-center destroy-on-close>
      <span>
        没有设置起始时间，将默认导出30天内的数据
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportVisible = false">取消</el-button>
          <el-button type="primary" @click="exportExcel">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="PurchaseOrder" lang="ts">
import fileSaver from "file-saver";
import { MaterialOrderForm, MaterialOrderQuery } from '@/api/purchase/materialOrder/types';
import { ref } from 'vue'
import { MaterialOrderDetailVO } from "@/api/purchase/materialOrderDetail/types";
import {
  listSupplierOrderDetail, listFile, uploadFile, queryOperateRecordList
} from "@/api/purchase/materialOrderDetail";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

/**采购单预览 */
import {OssForm, OssQuery} from "@/api/system/oss/types";
import {FileItemVO} from "@/api/upload/types";
import {downloadUrl} from "@/api/upload";
import {RecordVO} from "@/api/purchase/record/types";
/** 对账单按钮操作 */
let reportUrl = ref("");


const waitConfirmList = ref<MaterialOrderDetailVO[]>([]);
const confirmList = ref<MaterialOrderDetailVO[]>([]);
const waitOtherConfirmList = ref<MaterialOrderDetailVO[]>([]);

const confirmStatusList = ref([
  { label: '待确认', value: "2" },
  { label: '待对方确认', value: "1" },
  { label: '已确认', value: "3" }
]);

const buttonLoading = ref(false);
const loading = ref(false);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const confirmTotal = ref(0);
const waitTotal = ref(0);

const queryFormRef = ref<ElFormInstance>();
const materialOrderFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const exportVisible = ref(false);
const uploadVisible = ref(false);
const recordVisible = ref(false);
const recordList = ref<RecordVO[]>([]);

const ossFormRef = ref<ElFormInstance>();
const fileList = ref<FileItemVO[]>([]);

const fileTypeList = ref([
  { label: '采购合同附件', value: "15" },
  { label: '采购合同附件', value: "16" },
  { label: '签名附件', value: "17" }
]);
const orderId = ref<number|string>("");
/**运行文件上传的类型 */
const fileType: string[] = ["pdf", "jpg", "png"];
const initOSSFormData = {
  file: undefined,
}
const ossData = reactive<PageData<OssForm, OssQuery>>({
  form: { ...initOSSFormData },
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    fileName: '',
    originalName: '',
    fileSuffix: '',
    createTime: '',
    service: ''
  },
  rules: {
    file: [
      { required: true, message: "文件不能为空", trigger: "blur" }
    ]
  }
});
const { queryParams:ossQueryParams, form:ossForm, rules:ossRules } = toRefs(ossData);

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

const data = reactive<PageData<MaterialOrderForm, MaterialOrderQuery>>({
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
  confirmQueryParams: {
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
  waitQueryParams: {
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
const { queryParams, confirmQueryParams, waitQueryParams, form, rules } = toRefs(data);

const columnList = ref([
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '60', },
  { title: '状态', field: 'confirmStatus', width: '90', align: 'center'},
  { title: '采购订单号', field: 'orderCode', width: '110', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  /*{ title: '客户代码', field: 'supplierName', width: '140', align: 'center' },*/
  { title: '客户名称', field: 'actualSupplierName', width: '140', align: 'center' },
  { title: '要求交期', field: 'deliverTime', width: '80', align: 'center'
    , filterType: 'intervalDate',
    filterParam: {
      startParams: { placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  {
    title: '收货地址', field: 'addressName', width: '300', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '物料编码', field: 'rawMaterialCode', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '物料名称', field: 'name', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '材质牌号', field: 'materialQuality', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '规格型号', field: 'specification', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '直径', field: 'diameter', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '厚度', field: 'thickness', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '板厚', field: 'boardThickness', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '铜厚', field: 'copperThickness', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '颜色', field: 'color', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '级别', field: 'level', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '长(mm)', field: 'length', width: '80', align: 'center',
    filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '宽(mm)', field: 'width', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '品牌', field: 'manufacturer', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  { title: '采购数量', field: 'quantity', width: '80', align: 'center' },
  { title: '采购单价', field: 'price', width: '80', align: 'center' },
  { title: '采购金额', field: 'totalPrice', width: '80', align: 'center' },
  { title: '单位', field: 'units', width: '80', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', }
]);

// 获取 搜索条件
const searchChange = (params: any) => {
  params.ConfirmStatus = '2';
  queryParams.value = params
  getSupplierOrderDetailList();
}

// 获取 搜索条件
const searchConfirmChange = (params: any) => {
  params.ConfirmStatus = '3';
  confirmQueryParams.value = params
  getConfirmOrderDetailList();
}

// 获取 搜索条件
const searchWaitChange = (params: any) => {
  params.ConfirmStatus = '1';
  waitQueryParams.value = params
  getWaitOrderDetailList();
}

// 新增属性
const editableTabsValue = ref(1);
/**
 * 查询tab页
 */
const getVoidedList = async () => {
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
  loading.value = true;
  const res = await listSupplierOrderDetail(queryParams.value);
  waitConfirmList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/**
 * 查询已确认按采购订单列表
 * */
const getConfirmOrderDetailList = async () => {
  loading.value = true;
  const res = await listSupplierOrderDetail(confirmQueryParams.value);
  confirmList.value = res.rows;
  confirmTotal.value = res.total;
  loading.value = false;
}

/**
 * 查询待对方按采购订单列表
 * */
const getWaitOrderDetailList = async () => {
  loading.value = true;
  const res = await listSupplierOrderDetail(waitQueryParams.value);
  waitOtherConfirmList.value = res.rows;
  waitTotal.value = res.total;
  loading.value = false;
}

/** 查询操作记录 */
const handleRecord = async (row: MaterialOrderDetailVO) => {
  recordVisible.value = true;
  loading.value = true;
  const res = await queryOperateRecordList(row.orderId);
  recordList.value = res.data;
  loading.value = false;
}

/** 取消按钮 */
function cancelRecord() {
  recordVisible.value = false;
}

// 上传文件
const craftFileChange = (val:any) => {
  console.log("craftFileChange",val)
  form.value.fileList = val
}

// 删除文件
const delFile = (val: any, files: any, type?: number) => {
  form.value.fileList =undefined;
}

/** 文件按钮操作 */
const handleFile = async (row: MaterialOrderDetailVO) => {
  resetOSS();
  uploadVisible.value = true;
  loading.value = true;
  orderId.value = row.orderId;
  // 查询已上传的附件
  const res = await listFile(row.orderId);
  fileList.value = res.data;
  loading.value = false;
}

// 文件下载
const downLoadHandle = (key: string) => {
  let loadingBox: any = undefined;
  loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
  downloadUrl(key).then(res => {
    loadingBox.close()
    if (res.code == 200) {
      const { data } = res
      // window.open(data[key])
      fileSaver.saveAs(data[key])
    }
  }).catch((err) => {
    loadingBox.close()
  })
}

/** 文件上传提交按钮 */
const submitOSSForm = () => {

  if (!form.value.fileList) {
    proxy?.$modal.msgError("请选择文件");
    return;
  }
  //根据,分割ossForm.value.file得到一个数组
  if (form.value.fileList.length > 1) {
    proxy?.$modal.msgError("只能上传一个文件");
    return;
  }
  buttonLoading.value = true;

  uploadFile({id: orderId.value, fileList: form.value.fileList}).then(res => {
    proxy?.$modal.msgSuccess("操作成功");

    listFile(orderId.value);
  }).finally(() => {
    buttonLoading.value = false;
  });
}

/** 取消按钮 */
function cancelOSS() {
  uploadVisible.value = false;
  resetOSS();
}
/** 表单重置 */
function resetOSS() {
  ossForm.value = { ...initOSSFormData };
  ossFormRef.value?.resetFields();
}

const mainTableToolId = ref('purchasePurchaseOrderDetails');
/** 导出前操作 */
const exportExcelBefore = async () => {
  if(1 == editableTabsValue.value){
    //先看看有没有给起始时间，没有要给出提示
    if (!queryParams.value.deliverTimeStart) {
      exportVisible.value = true;
    } else {
      proxy?.download('purchase/materialHandleDetail/supExport', {
        ...queryParams.value, tableName: mainTableToolId.value
      }, `采购订单_${new Date().getTime()}.xlsx`);
    }
  }else if(2 == editableTabsValue.value){
    //先看看有没有给起始时间，没有要给出提示
    if (!confirmQueryParams.value.deliverTimeStart) {
      exportVisible.value = true;
    } else {
      proxy?.download('purchase/materialHandleDetail/supExport', {
        ...confirmQueryParams.value, tableName: mainTableToolId.value
      }, `采购订单_${new Date().getTime()}.xlsx`);
    }
  }else{
    //先看看有没有给起始时间，没有要给出提示
    if (!waitQueryParams.value.deliverTimeStart) {
      exportVisible.value = true;
    } else {
      proxy?.download('purchase/materialHandleDetail/supExport', {
        ...waitQueryParams.value, tableName: mainTableToolId.value
      }, `采购订单_${new Date().getTime()}.xlsx`);
    }
  }
}

/** 导出按钮操作 */
const exportExcel = () => {
  if(1 == editableTabsValue.value) {
    proxy?.download('purchase/materialHandleDetail/supExport', {
      ...queryParams.value
    }, `materialOrder_${new Date().getTime()}.xlsx`)
  }else if(2 == editableTabsValue.value){
    proxy?.download('purchase/materialHandleDetail/supExport', {
      ...confirmQueryParams.value, tableName: mainTableToolId.value
    },`采购订单_${new Date().getTime()}.xlsx`);
  }else{
    proxy?.download('purchase/materialHandleDetail/supExport', {
      ...waitQueryParams.value, tableName: mainTableToolId.value
    }, `采购订单_${new Date().getTime()}.xlsx`);
  }
  exportVisible.value = false;
}

onMounted(() => {
  getSupplierOrderDetailList();
});
</script>
<style scoped lang="scss">
.expand-wrapper {
  padding-left: 39px;
}
</style>
