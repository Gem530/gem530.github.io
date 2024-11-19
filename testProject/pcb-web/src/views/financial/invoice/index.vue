<template>
  <div class="p-2 xtable-page">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
                :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="发票代码" prop="amount">
            <el-input v-model="queryParams.code" placeholder="请输入发票代码" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="发票号码" prop="tax">
            <el-input v-model="queryParams.number" placeholder="请输入发票号码" clearable @keyup.enter="handleQuery" />
          </el-form-item>
<!--          <el-form-item label="导入时间" prop="importTime">
            <el-date-picker clearable
                            v-model="queryParams.importTime"
                            type="date"
                            value-format="YYYY-MM-DD"
                            placeholder="请选择导入时间"
            />
          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-end">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="importTemplate" >
              下载模板
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Top" @click="handleImport" >
              导入数据
            </el-button>
          </el-col>

          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
                       >导出
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-tabs type="card" v-model="editableTabsValue" @tab-change="handlerClick">
        <el-tab-pane label="应付发票" :name="0"></el-tab-pane>
        <el-tab-pane label="应收发票" :name="1"></el-tab-pane>
      </el-tabs>

      <XTable v-loading="loading" :columnList="columnList" :data="invoiceList" class="xtable-content" height="100%"
      v-model:page-size="queryParams.pageSize"
      v-model:current-page="queryParams.pageNum"
      :page-params="{ perfect: true, total: total }"
      @search-change="getList"
      @checkbox-change="handleSelectionChange" ref="xtableRef"
        @checkbox-all="handleSelectionChange">
        <template #default-make="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                         ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                         ></el-button>
            </el-tooltip>
          </template>
      </XTable>
    </el-card>

    <!-- 添加或修改发票记录对话框 -->
    <el-drawer :title="drawerEdit.title" v-model="drawerEdit.visible" width="500px" size="60%">
      <el-form ref="invoiceFormRef" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="发票代码" prop="code">
              <el-input v-model="form.code" placeholder="发票代码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票号码" prop="number">
              <el-input v-model="form.number" placeholder="发票号码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数电票号码" prop="digitalNumber">
              <el-input v-model="form.digitalNumber" placeholder="数电票号码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销方识别号" prop="sellerIdentifier">
              <el-input v-model="form.sellerIdentifier" placeholder="销方识别号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销方名称" prop="sellerName">
              <el-input v-model="form.sellerName" placeholder="销方名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="购方识别号" prop="buyerIdentifier">
              <el-input v-model="form.buyerIdentifier" placeholder="购方识别号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="购买方名称" prop="buyerName">
              <el-input v-model="form.buyerName" placeholder="购买方名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票日期" prop="invoiceTime">
              <el-input v-model="form.invoiceTime" placeholder="开票日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金额" prop="amount">
              <el-input v-model="form.amount" placeholder="请输入金额" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税额" prop="tax">
              <el-input v-model="form.tax" placeholder="请输入税额" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价税合计" prop="amountTax">
              <el-input v-model="form.amountTax" placeholder="请输入价税合计" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票来源" prop="source">
              <el-input v-model="form.source" placeholder="发票来源" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票票种" prop="type">
              <el-input v-model="form.type" placeholder="发票票种" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票状态" prop="status">
              <el-input v-model="form.status" placeholder="发票状态" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票风险等级" prop="riskLevel">
              <el-input v-model="form.riskLevel" placeholder="发票风险等级" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票人" prop="issuerName">
              <el-input v-model="form.issuerName" placeholder="开票人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="备注" />
            </el-form-item>
          </el-col>
        </el-row>
        <!--        <el-form-item label="导入时间" prop="importTime">
                  <el-date-picker clearable
                    v-model="form.importTime"
                    type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择导入时间">
                  </el-date-picker>
                </el-form-item>-->
      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-drawer>


    <!-- 发票导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px">
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload">
          <i-ep-upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="text-center el-upload__tip">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport" />
              是否更新已经存在的发票数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                     @click="importTemplate">下载模板
            </el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script setup name="Invoice" lang="ts">
import { listInvoice, getInvoice, delInvoice, addInvoice, updateInvoice } from "@/api/financial/invoice";
import { InvoiceVO, InvoiceQuery, InvoiceForm } from "@/api/financial/invoice/types";
import { globalHeaders } from "@/utils/request";
import { ref } from "vue";


const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const xtableRef = ref()
const invoiceList = ref<InvoiceVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const editableTabsValue = ref(0);

/*** 发票导入参数 */
const upload = reactive<ImportOption>({
  // 是否显示弹出层（发票导入）
  open: false,
  // 弹出层标题（发票导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: globalHeaders(),
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/financial/invoice/importData"
});


const uploadRef = ref<ElUploadInstance>();
const queryFormRef = ref<ElFormInstance>();
const invoiceFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ""
});

const drawerEdit = reactive<DrawerOption>({
  visible: false,
  title: ""
});


const initFormData: InvoiceForm = {
  id: undefined,
  createDeptName: undefined,
  createByName: undefined,
  updateByName: undefined,
  code: undefined,
  number: undefined,
  digitalNumber: undefined,
  sellerIdentifier: undefined,
  sellerName: undefined,
  buyerIdentifier: undefined,
  buyerName: undefined,
  invoiceTime: undefined,
  amount: undefined,
  tax: undefined,
  amountTax: undefined,
  source: undefined,
  type: undefined,
  status: undefined,
  riskLevel: undefined,
  issuerName: undefined,
  remark: undefined,
  isRed: undefined,
  redCode: undefined,
  redNumber: undefined,
  redDigitalNumber: undefined,
  importTime: undefined,
  invoiceType: undefined,
};
const data = reactive<PageData<InvoiceForm, InvoiceQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    code: undefined,
    number: undefined,
    digitalNumber: undefined,
    sellerIdentifier: undefined,
    sellerName: undefined,
    buyerIdentifier: undefined,
    buyerName: undefined,
    invoiceTime: undefined,
    amount: undefined,
    tax: undefined,
    amountTax: undefined,
    source: undefined,
    type: undefined,
    status: undefined,
    riskLevel: undefined,
    issuerName: undefined,
    isRed: undefined,
    redCode: undefined,
    redNumber: undefined,
    redDigitalNumber: undefined,
    importTime: undefined,
    invoiceType: undefined,
    params: {}
  },
  rules: {
    code: [
      { required: true, message: "发票代码不能为空", trigger: "blur" }
    ],
    number: [
      { required: true, message: "发票号码不能为空", trigger: "blur" }
    ],
    digitalNumber: [
      { required: true, message: "数电票号码不能为空", trigger: "blur" }
    ],
    sellerIdentifier: [
      { required: true, message: "销方识别号不能为空", trigger: "blur" }
    ],
    sellerName: [
      { required: true, message: "销方名称不能为空", trigger: "blur" }
    ],
    buyerIdentifier: [
      { required: true, message: "购方识别号不能为空", trigger: "blur" }
    ],
    buyerName: [
      { required: true, message: "购买方名称不能为空", trigger: "blur" }
    ],
    invoiceTime: [
      { required: true, message: "开票日期不能为空", trigger: "blur" }
    ],
    amount: [
      { required: true, message: "金额不能为空", trigger: "blur" }
    ],
    tax: [
      { required: true, message: "税额不能为空", trigger: "blur" }
    ],
    amountTax: [
      { required: true, message: "价税合计不能为空", trigger: "blur" }
    ],
    source: [
      { required: true, message: "发票来源不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "发票票种不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "发票状态不能为空", trigger: "change" }
    ],
    riskLevel: [
      { required: true, message: "发票风险等级不能为空", trigger: "blur" }
    ],
    issuerName: [
      { required: true, message: "开票人不能为空", trigger: "blur" }
    ]

  }
});

const { queryParams, form, rules } = toRefs(data);

const columnList = ref([
{ width: '55',type: 'checkbox',align: 'center',  },
{ title: '发票代码',field: 'code',align: 'center',  },
{ title: '发票号码',field: 'number',align: 'center',  },
{ title: '数电票号码',field: 'digitalNumber',align: 'center',  },
{ title: '销方识别号',field: 'sellerIdentifier',align: 'center',  },
{ title: '销方名称',field: 'sellerName',align: 'center',  },
{ title: '购方识别号',field: 'buyerIdentifier',align: 'center',  },
{ title: '购买方名称',field: 'buyerName',align: 'center',  },
{ title: '开票日期',field: 'invoiceTime',align: 'center',  },
{ title: '金额',field: 'amount',align: 'center',  },
{ title: '税额',field: 'tax',align: 'center',  },
{ title: '价税合计',field: 'amountTax',align: 'center',  },
{ title: '发票来源',field: 'source',align: 'center',  },
{ title: '发票票种',field: 'type',align: 'center',  },
{ title: '发票状态',field: 'status',align: 'center',  },
{ title: '发票风险等级',field: 'riskLevel',align: 'center',  },
{ title: '开票人',field: 'issuerName',align: 'center',  },
{ title: '备注',field: 'remark',align: 'center',  },
{ title: '操作',field: 'make',align: 'center',  },
]);


/** 查询应付发票按钮传值处理 */
const handlerClick = () => {
  console.log(editableTabsValue.value);
  queryParams.value. invoiceType = editableTabsValue.value;

  getList();
};



/** 查询发票记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listInvoice(queryParams.value);
  invoiceList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  invoiceFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: InvoiceVO[]) => {
  // ids.value = selection.map(item => item.id);
  // single.value = selection.length != 1;
  // multiple.value = !selection.length;
  const $table = xtableRef.value.xTableRef
  if ($table) {
    const selection = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords()) // 获取选择的行数据列表
    ids.value = selection.map((item: any) => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加发票记录";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: InvoiceVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getInvoice(_id);
  Object.assign(form.value, res.data);
  drawerEdit.visible = true;
  drawerEdit.title = "修改发票记录";
};

/** 提交按钮 */
const submitForm = () => {
  invoiceFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateInvoice(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addInvoice(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      drawerEdit.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: InvoiceVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm("是否确认删除发票记录编号为\"" + _ids + "\"的数据项？").finally(() => loading.value = false);
  await delInvoice(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download("financial/invoice/export", {
    ...queryParams.value
  }, `invoice_${new Date().getTime()}.xlsx`);
};

/** 发票下载模板操作 */
const importTemplate = () => {
  proxy?.download("financial/invoice/importTemplate", {}, `invoice_template_${new Date().getTime()}.xlsx`);
};

/** 导入按钮操作 */
const handleImport = () => {
  upload.title = "发票导入";
  upload.open = true;
};

/**文件上传中处理 */
const handleFileUploadProgress = () => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response: any, file: UploadFile) => {
  upload.open = false;
  upload.isUploading = false;
  uploadRef.value?.handleRemove(file);
  ElMessageBox.alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  uploadRef.value?.submit();
}

onMounted(() => {
  // getList();
  handlerClick();
});
</script>
