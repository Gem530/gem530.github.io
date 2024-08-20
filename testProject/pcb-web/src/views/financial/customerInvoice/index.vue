<template>
  <div class="p-2 xtable-page" >
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
                :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" label-width="115px" class="demo-form-inline">
<!--          <el-form-item label="发票代码" prop="amount">-->
<!--            <el-input v-model="queryParams.code" placeholder="请输入发票代码" clearable @keyup.enter="handleQuery" />-->
<!--          </el-form-item>-->
          <el-row>
            <el-col :span="6">
              <el-form-item label="发票/数电票号码" prop="tax">
                <el-input v-model="queryParams.number" placeholder="请输入发票/数电票号码" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="对账单号" prop="tax">
                <el-input v-model="queryParams.accountCode" placeholder="请填写对账单号" clearable  @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="购方名称" >
                <el-input v-model="queryParams.buyerName" placeholder="请填写购方名称" clearable  @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发票类型" prop="tax">
                <el-select
                  v-model="queryParams.type"
                  placeholder="请选择发票类型"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="item in invoiceTypeEnum"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="关联账单月份" prop="tax">
                <el-date-picker
                  v-model="queryParams.accountMonthArray"
                  type="monthrange"
                  range-separator="-"
                  start-placeholder="起始月"
                  end-placeholder="结束月"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开票日期" prop="tax">
                <el-date-picker
                  v-model="queryParams.invoiceTimeArray"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                <el-button type="primary" icon="Search" @click="handleQuery">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>




        </el-form>
      </div>
    </transition>

    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-end">
          <el-col :span="1.5">
            <el-button type="primary" plain @click="importTemplate" >
              下载模板
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain @click="handleImport" >
              导入数据
            </el-button>
          </el-col>

          <el-col :span="1.5">
            <el-button type="primary" plain @click="handleExport"
            >导出
            </el-button>
          </el-col>

          <el-col :span="1.5">
            <el-button type="primary" plain @click="viewRelevancyMsg"
            >历史导入记录
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="customerSearchChange"></right-toolbar>
        </el-row>
      </template>

      <XTable toolId="customerInvoiceList" height="100%" class="xtable-content"
              v-model:page-size="customerQueryParams.pageSize"
              v-model:current-page="customerQueryParams.pageNum"
              :intervalCondition="intervalCondition"
              :page-params="{ perfect: true, total: customerTableTotal }"
              :data="invoiceList"
              :columnList="customerColumnList"
              ref="XTableRef"
              border
              :showRefresh="true"
              @searchChange="customerSearchChange"
              :column-config="{ resizable: true }"
              :row-config="{ keyField:'id' }"
              :sort-orders="sortCondition"
              :loading="loading"
              :enterFresh = "true"
              :scroll-x="{enabled: true}"
              :scroll-y="{enabled: true}" size="small"
      >

        <template #default-make="scope">
          <el-button link type="primary" @click="handleUpdate(scope.row)" >修改</el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)" >删除</el-button>
        </template>

        <template #default-accountType="scope">
          <div v-for="item in accountTypeEnum">
            <div size="small" v-if="item.value === scope.row.accountType">{{item.label}}</div>
          </div>
        </template>

        <template #default-type="scope">
          <div v-for="item in invoiceTypeEnum">
            <el-tag size="small" :type="item.type" v-if="item.value === scope.row.type">{{item.label}}</el-tag>
          </div>
        </template>

        <template #default-status="scope">
          <div v-if="scope.row.accountId">
            <el-tag size="small" type="success">已匹配</el-tag>
          </div>
          <div v-if="!scope.row.accountId">
            <el-tag size="small" type="danger">未匹配</el-tag>
          </div>
        </template>

      </XTable>


    </el-card>

    <!-- 添加或修改发票记录抽屉 -->
    <el-drawer :title="drawerEdit.title" v-model="drawerEdit.visible" size="70%">
      <template #title >
        <div style="width: 100%">
          {{ drawerEdit.title }}
          <span v-if="form.accountId">
            <el-tag size="default" type="success">已匹配</el-tag>
          </span>
          <span v-if="!form.accountId">
            <el-tag size="default" type="danger">未匹配</el-tag>
          </span>
        </div>
      </template>
      <el-form ref="invoiceFormRef" :model="form" :rules="rules" label-width="120px">
        <el-collapse v-model="activeName">
          <el-collapse-item title="基本信息" name="1">
        <el-row>
          <el-col :span="8">
            <el-form-item label="发票/数电票" prop="number">
              <el-input v-model="form.number" placeholder="发票/数电票" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票类型" prop="type">
              <el-select
                v-model="form.type"
                placeholder="请选择发票类型"
                class="absolutely-width"
              >
                <el-option
                  v-for="item in invoiceTypeEnum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="销方名称" prop="sellerName">
              <el-input disabled v-model="form.sellerName" placeholder="销方名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销方识别号" prop="sellerIdentifier">
              <el-input disabled v-model="form.sellerIdentifier" placeholder="销方识别号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="购方识别号" prop="buyerIdentifier">
              <el-input disabled v-model="form.buyerIdentifier" placeholder="购方识别号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="购方名称" prop="buyerName">
              <el-input disabled v-model="form.buyerName" placeholder="购买方名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  label="开票日期" prop="invoiceTime">
<!--              <el-input v-model="form.invoiceTime" placeholder="开票日期" />-->
              <el-date-picker
                v-model="form.invoiceTime"
                type="datetime"
                value-format="YYYY-MM-DD hh:mm:ss"
                placeholder="选择开票日期"
                class="absolutely-width"
              />

            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联对账月份" prop="accountMonth">
              <el-input v-model="form.accountMonthStr" disabled placeholder="关联对账月份" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人" prop="createByName">
              <el-input v-model="form.createByName" disabled placeholder="创建人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金额" prop="amount">
              <el-input-number
                v-model="form.amount"
                :precision="4" :min="0.0001"
                :max="999999999.9999"
                class="absolutely-width"
                @change="handleChange" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税额" prop="tax">
              <el-input-number class="absolutely-width" v-model="form.tax" :precision="4" :min="0.0001" :max="999999999.9999" @change="handleChange" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价税合计" prop="amountTax">
<!--              <el-input disabled v-model="form.amountTax" />-->
              <el-input-number class="absolutely-width" disabled v-model="form.amountTax" :precision="4" :min="0.0001" :max="2999999999.9999" @change="handleChange" />
            </el-form-item>
          </el-col>


<!--          <el-col :span="8">-->
<!--            <el-form-item label="关联账单类型" prop="accountType">-->
<!--              <el-select-->
<!--              v-model="form.accountType"-->
<!--              placeholder="请选择发票类型"-->
<!--              style="width: 160px"-->
<!--            >-->
<!--              <el-option-->
<!--                v-for="item in accountTypeEnum"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value"-->
<!--              />-->
<!--            </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->

          <el-col :span="8">
            <el-form-item label="创建时间" prop="createTime">
              <el-input v-model="form.createTime" disabled placeholder="创建时间" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" :rows="2" type="textarea" placeholder="备注" />
            </el-form-item>
          </el-col>
        </el-row>
          </el-collapse-item>


          <el-collapse-item title="凭证信息" name="2">
            <el-form ref="ossFormRef" :model="fileForm" :rules="ossRules" label-width="80px">
              <el-row>
                <el-col :span="24">
                 <XUpload
                   v-model:model-value="ossForm.file"
                   :fileType="fileType"
                   model="download"
                   multiple
                   :show-file-list="false"
                   @fileChange="craftFileChange"
                   style="margin-bottom: 26px;"
                 >
                   <div>
                     <el-button  type="primary"  >上传附件</el-button> <span class="light-color-text">格式要求pdf/jpg/png,每个文件大小在20MB以内</span>
<!--                     <div class="light-color-text">格式不限,每个文件大小在20mb以内</div>-->
                   </div>
                 </XUpload>
                </el-col>
              </el-row>
            </el-form>


            <div class="expand-wrapper">
              <vxe-table border show-overflow :row-config="{height: 45}" :column-config="{ resizable: true }" height="330"
                         :data="fileList" :loading="loading">
                <vxe-column align="center" width="50" field="index" title="序号" type="seq"></vxe-column>
                <vxe-column align="center" width="90" field="createByName" title="上传人"></vxe-column>
                <vxe-column align="center" width="150" field="createTime" title="上传时间"></vxe-column>
                <vxe-column field="name" title="附件名称" align="center"></vxe-column>
                <vxe-column field="make" title="操作" align="center" width="120">
                  <template #default="scope">
                    <el-button type="primary" link @click="downLoadHandle(scope.row.key)">下载</el-button>
                    <el-button type="primary" link @click="delFile(scope.row.id)">删除</el-button>
                  </template>
                </vxe-column>
              </vxe-table>
            </div>
          </el-collapse-item>
        </el-collapse>

      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="updateDelete" >删 除</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确认修改</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 历史导入记录对话框 -->
    <el-dialog
      v-model="viewRelevancyMsgVisible"
      :title= "drillerRelevancyTitle"
      direction="rtl"
      destroy-on-close
      width="55%"
      @close="resetRelevancyForm()"
      draggable
    >
      <XTable toolId="invoiceImport"
              :pageShow="true"
              v-model:page-size="drillerAbradeQueryParams.pageSize"
              v-model:current-page="drillerAbradeQueryParams.pageNum"
              :data="viewProductionRelevancyList"
              border
              :intervalCondition="intervalCondition"
              :columnList="viewRelevancyMsgColumnList"
              height="450px"
              :loading="viewRelevancyLoading"
              @searchChange="drillerAbradeSearchChange"
              :enterFresh = "true"
              :page-params="{ perfect: true, total: viewTotal }"
              :scroll-x="{enabled: true}"
              :scroll-y="{enabled: true}" size="small"
              :showRefresh="true"
      >

        <template #default-importFileName="scope">
          <el-button link type="primary" @click="downLoadHandle(scope.row.importKey)" >{{scope.row.importFileName}}</el-button>
        </template>
        <template #default-failedFileName="scope">
          <el-button link type="primary" @click="downLoadHandle(scope.row.failedKey)" >{{scope.row.failedFileName}}</el-button>
        </template>

      </XTable>


      <template #footer >
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="resetRelevancyForm">关闭</el-button>
          </span>
        </div>
      </template>

    </el-dialog>

    <!-- 发票导入对话框 -->
    <GExportInvoice
      width="500px"
      :title="upload.title"
      :loading="buttonLoading"
      v-model:open="upload.open"
      :close-on-click-modal="false"
      @confirm="startProcess"
      @close ="customerSearchChange"
    ></GExportInvoice>


  </div>
</template>

<script setup name="CustomerInvoice" lang="ts">
import {
  listInvoice,
  getInvoice,
  delInvoice,
  addInvoice,
  updateInvoice,
  importData,
  listByUser,
  importDataCustomer
} from "@/api/financial/invoice";
import { globalHeaders } from "@/utils/request";
import { ref } from "vue";
import { ConfirmEnum } from "@/api/financial/accountOrder/types";
import { MaterialOrderForm } from "@/api/purchase/materialOrder/types";
import { any } from "vue-types";
import { OssForm, OssQuery } from "@/api/system/oss/types";
import { FileItemVO } from "@/api/upload/types";
import { addBatchFile, addFile, deleteFile, downloadUrl } from "@/api/upload";



const handleChange = () => {
  if (form.value.amount !== undefined && form.value.tax !== undefined){
    form.value.amountTax = Number(form.value.amount) + Number(form.value.tax);
  }
}

/**
 * 导入列表搜索条件更新
 */
const drillerAbradeSearchChange = (param : any) => {
  drillerAbradeQueryParams.value = {...param}
  if (param.sorts && param.sorts.length > 0) {
    param.sorts.forEach((item : any) => {
      drillerAbradeQueryParams.value.orderByColumn = item.prop;
      drillerAbradeQueryParams.value.isAsc = item.order;
    })
  }
  drillerAbradeQueryParams.value.type = '1'
  viewRelevancyMsg();
}

const activeName = ref(['1','2'])

const sortCondition = ['createTime','accountMonthStr'];
/**
 * 查看导入历史记录信息
 */
const viewRelevancyMsg = async () => {
  viewRelevancyMsgVisible.value = true;
  viewRelevancyLoading.value = true;
  const res = await listByUser(drillerAbradeQueryParams.value).finally(()=>{
    viewRelevancyLoading.value = false;
  });
  viewProductionRelevancyList.value = res.rows;
  viewTotal.value = res.total;
  viewRelevancyLoading.value = false;
}
const { drillerAbradeQueryParams } = toRefs(reactive({
  drillerAbradeQueryParams: {
    pageNum: 1,
    pageSize: 20,
    orderStatus: undefined,
    type: '1',
    createTimeStart: undefined,
    createTimeEnd: undefined,
  }
}));
// 导入单信息列表总记录数
const viewTotal = ref(0);
// 导入单信息加载
const viewRelevancyLoading = ref(false);
// 导入信息展示的单行
const viewProductionRelevancyList = ref([]);
// 导入历史记录对话框可视性
const viewRelevancyMsgVisible =ref(false);
const drillerRelevancyTitle = ref("历史导入记录");
// 初始化导入查询参数
const viewQueryParams  = ref({
  isAsc: "desc",
  orderByColumn: "create_time",
  ownerId: undefined,
  planStartTime: undefined,
  planCompleteTime: undefined,
  startTime: undefined,
  completeTime: undefined,
  completeQuantity: undefined,
  confirmUserId: undefined,
  confirmUserName: undefined,
  productionStatus: undefined,
  planId: undefined,
  isPause: undefined,
  code: undefined,
  isComplete: undefined,
  area: undefined,
  isRemediation: undefined,
  remediationProductionId: undefined,
  isMerge: undefined,
  params: {},
  idList: []
});
/**
 * 初始化导入信息抽屉数据
 */
const resetRelevancyForm = () => {
  viewRelevancyMsgVisible.value = false;
  viewQueryParams.value =  {
    isAsc: "desc",
    orderByColumn: "create_time",
    ownerId: undefined,
    planStartTime: undefined,
    planCompleteTime: undefined,
    startTime: undefined,
    completeTime: undefined,
    completeQuantity: undefined,
    confirmUserId: undefined,
    confirmUserName: undefined,
    productionStatus: undefined,
    planId: undefined,
    isPause: undefined,
    code: undefined,
    isComplete: undefined,
    area: undefined,
    isRemediation: undefined,
    remediationProductionId: undefined,
    isMerge: undefined,
    params: {},
    idList: []
  };
  viewProductionRelevancyList.value = []
};

//导入单表
const viewRelevancyMsgColumnList = ref([
  {title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '60'},
  {
    // width: "140",
    minWidth: '100',
    title: '导入时间',
    sortable: true,
    field: 'createTime',
    align: 'center', filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  {
    width: "343",
    title: '导入文件',
    field: 'importFileName',
    align: 'center'
  },
  {
    width: "345",
    title: '导入失败文件',
    field: 'failedFileName',
    align: 'center'
  },
]);


const initFileFormData: MaterialOrderForm = {
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

const fileData = reactive<PageData<any, any>>({
  form: { ...initFileFormData },
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
const fileForm = ref(fileData);

/**运行文件上传的类型 */
const fileType: string[] = ["pdf", "jpg", "png"];
const initOSSFormData = {
  file: undefined,
}
const ossData = reactive<PageData<OssForm, OssQuery>>({
  form: { ...initOSSFormData },
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

const fileList = ref<FileItemVO[]>([]);

let timeout;

// 防抖函数的定义
function debounce(fn, delay) {
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn();
    }, delay);
  };
}

// 上传文件
const craftFileChange = async (val:any) => {
  const debouncedFunction = debounce(async ()=>{
  if (val?.length) {
    const id = form.value.id;
    form.value.fileList =undefined;
    val?.forEach((item: any) => {
      item.bizId = id;
      // 8 财务模块
      item.moduleCode = '8';
      // INVOICE("30", "发票附件"),
      item.bizType = '30';
    });
    const res = await addBatchFile(val).finally(() => val = []);
    val = [];
    if (res.code === 200){
      reset();
      const res = await getInvoice(id);
      Object.assign(form.value, res.data);
      fileList.value = res.data.sysFileVos;
    }else{
      // 上传失败提示
      proxy?.$modal.msgError("上传失败!");
    }
    console.log("craftFileChange",val)
  }
  },200)
  debouncedFunction();
}

// 删除文件
const delFile = async (id: any) => {
  await proxy?.$modal.confirm("是否确认删除?").finally(() => loading.value = false);
  const res = await deleteFile(id);
  const invoiceId = form.value.id;
  if (res.code === 200){
    reset();
    const res = await getInvoice(invoiceId);
    Object.assign(form.value, res.data);
    fileList.value = res.data.sysFileVos;
  }else{
    // 删除失败提示
    proxy?.$modal.msgError("删除失败!");
  }
}

// 文件下载
const downLoadHandle = (key: string) => {
  let loadingBox: any = undefined;
  loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
  downloadUrl(key).then(res => {
    loadingBox.close()
    if (res.code == 200) {
      const { data } = res
      window.open(data[key])
    }
  }).catch((err) => {
    loadingBox.close()
  })
}

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const invoiceList = ref<any>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const editableTabsValue = ref(0);

const accountTypeEnum = [
  {
    value: '1',
    label: '订单外协',
  },
  {
    value: '2',
    label: '采购',
  },
  {
    value: '3',
    label: '借入',
  },
  {
    value: '4',
    label: '借出',
  },
  {
    value: '5',
    label: '工序外协',
  },
  {
    value: '6',
    label: '外协模具',
  },
  {
    value: '7',
    label: '外协菲林',
  },
  {
    value: '8',
    label: '销售',
  },
]
const invoiceTypeEnum = [
  {
    value: '0',
    label: '增值税专用发票',
    type: 'primary',
  },
  {
    value: '1',
    label: '增值税普通发票',
    type: 'success',
  }
]

// 初始化查询参数
const { customerQueryParams } = toRefs(reactive({
  customerQueryParams: {
    pageNum: 1,
    pageSize: 20,
    status: undefined,
    createTimeStart: undefined,
    sorts: [],
    createTimeEnd: undefined
  }
}));


// 声名需要处理的时间查询条件字段
const intervalCondition = ['updateTime','createTime','deliverTime','deliveryTime'];
const customerTableTotal = ref(0);

const customerColumnList = ref([
  { title: "序号", width: "40", type: "seq", align: "center" },
  // { title: "关联账单类型", field: "accountType", width: "110", align: "center" },
  { title: '关联账单月份',sortable: true, field: 'accountMonthStr', width: '110', align: 'center'},
  { title: '发票/数电票号码', field: 'number', width: '150', align: 'center'},
  { title: "销方识别号", width: "150", field: "sellerIdentifier", align: "center"},
  { title: '销方名称', field: 'sellerName', width: '170', align: 'center' },
  { title: '购方识别号', field: 'buyerIdentifier', width: '150', align: 'center' },
  { title: "购方名称"  , width: "170", field: "buyerName", align: "center"},
  { title: '开票日期', field: 'invoiceTime', width: '130', align: 'center' },
  { title: '金额', field: 'amount', width: '80', align: 'center' },
  { title: '税额', field: 'tax', width: '80', align: 'center'},
  { title: '价税合计', field: 'amountTax', width: '80', align: 'center' },
  { title: '发票类型', field: 'type', width: '110', align: 'center' },
  { title: '发票状态', field: 'status', width: '80', align: 'center' },
  { title: '关联对账单', field: 'accountCode', width: '110', align: 'center' },
  { title: '备注', field: 'remark', width: '150', align: 'center'},
  { title: '创建人', field: 'createByName', width: '80', align: 'center'},
  { title: '创建时间', field: 'createTime', width: '130', align: 'center'},
  { title: '操作',  align: "center", field: "make" ,fixed: 'right' , width: '100', showOverflow: false  }
]);


/**
 * 列表条件更新
 */
const customerSearchChange = (param : any) => {
  customerQueryParams.value = {...param}
  queryParams.value.pageNum = customerQueryParams.value.pageNum  || 1
  queryParams.value.pageSize = customerQueryParams.value.pageSize || 20
  if (param?.sorts && param?.sorts.length > 0) {
    param.sorts.forEach((item : any) => {
      queryParams.value.orderByColumn = "accountMonth";
      queryParams.value.isAsc = item.order;
    })
  }else {
    queryParams.value.orderByColumn = undefined;
    queryParams.value.isAsc = undefined;
  }
  refreshWaitConfirmTableData();
}



/**
 * 刷新页面数据
 */
const refreshWaitConfirmTableData = async () => {

  loading.value = true;
  const res = await listInvoice(queryParams.value);
  invoiceList.value = res.rows;
  customerTableTotal.value = res.total;
  loading.value = false;
}

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


const initFormData= {
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
  amount: 0,
  tax: 0,
  amountTax: 0,
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
  accountType: undefined,
  accountMonth: undefined,
  accountMonthStr: undefined,
};
const data = reactive({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    accountTypeList: undefined,
    accountMonthArray: undefined,
    accountCode: undefined,
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
    invoiceTimeArray: undefined,
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
    number: [
      { max:40, required: true, message: "发票/数电票不能为空,长度需小于40", trigger: "blur" }
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
    // buyerName: [
    //   { required: true, message: "购买方名称不能为空", trigger: "blur" }
    // ],
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
    ],
    remark: [
      { max:600, message: "纳税人识别号输入不能超过600个字符", trigger: "change" }
    ],

  }
});

const { queryParams, form, rules } = toRefs(data);



/** 查询应付发票按钮传值处理 */
const handlerClick = () => {
  console.log(editableTabsValue.value);
  queryParams.value. invoiceType = editableTabsValue.value;

  customerSearchChange();
};



// /** 查询发票记录列表 */
// const customerSearchChange = async () => {
//   loading.value = true;
//   const res = await listInvoice(queryParams.value);
//   invoiceList.value = res.rows;
//   customerTableTotal.value = res.total;
//   loading.value = false;
// };

/** 取消按钮 */
const cancel = () => {
  reset();
  drawerEdit.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  invoiceFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  customerSearchChange();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  queryParams.value.accountTypeList = undefined;
  queryParams.value.accountMonthArray = undefined;
  queryParams.value.accountCode = undefined;
  queryParams.value.number = undefined;
  queryParams.value.invoiceTimeArray = undefined;
  queryParams.value.buyerName = undefined;
  queryParams.value.type = undefined;
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection : any) => {
  ids.value = selection.map((item: { id: any; }) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加发票记录";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: any) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getInvoice(_id);
  Object.assign(form.value, res.data);
  fileList.value = res.data.sysFileVos;
  drawerEdit.visible = true;
  drawerEdit.title = "编辑发票";
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
      await customerSearchChange();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: any) => {
  const _ids = row?.id || ids.value;
  // await proxy?.$modal.confirm("是否确认删除发票记录编号为\"" + _ids + "\"的数据项？").finally(() => loading.value = false);
  await proxy?.$modal.confirm("删除后关联账单中的发票金额会减少，是否确认删除？").finally(() => loading.value = false);
  await delInvoice(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  drawerEdit.visible = false;
  await customerSearchChange();
};
/** 修改时删除按钮操作 */
const updateDelete = async () => {
  const _ids = form.value.id;
  // await proxy?.$modal.confirm("是否确认删除发票记录编号为\"" + _ids + "\"的数据项？").finally(() => loading.value = false);
  await proxy?.$modal.confirm("删除后关联账单中的发票金额会减少，是否确认删除？").finally(() => loading.value = false);
  await delInvoice(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  drawerEdit.visible = false;
  await customerSearchChange();
};


/** 导出按钮操作 */
const handleExport = () => {
  if (
    (queryParams.value.accountTypeList === undefined || queryParams.value.accountTypeList.length === 0) &&
    queryParams.value.accountMonthArray === undefined &&
    queryParams.value.accountCode === undefined &&
    queryParams.value.number === undefined &&
    queryParams.value.invoiceTimeArray === undefined &&
    queryParams.value.buyerName === undefined &&
    queryParams.value.type   === undefined
  ){
    ElMessageBox.confirm(
      '没有设置筛选条件，将默认导出30天内的数据',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(
      handleExportRequest
    )
  }else{
    handleExportRequest();
  }

};

/** 导出 */
const handleExportRequest = () => {
  console.log(queryParams);
  proxy?.download("financial/invoice/exportByCustomer", {
    ...queryParams.value
  }, `发票记录_${new Date().getTime()}.xlsx`);
}


/** 发票下载模板操作 */
const importTemplate = () => {
  proxy?.download("financial/invoice/importTemplateCustomer", {}, `客户发票导入模版_${new Date().getTime()}.xlsx`);
};

/** 导入按钮操作 */
const handleImport = () => {
  upload.title = "发票导入";
  upload.open = true;
};

// 导入
const startProcess = async (fileList: any, fn: Function) => {
  let key = fileList[0].key;
  let name = fileList[0].name;
  let size = fileList[0].size;
  let type = fileList[0].type;
  buttonLoading.value = true
  const res = await importDataCustomer({key: key,fileName: name,fileSize: size,fileType: type,updateSupport:false}).finally(()=>{
    buttonLoading.value = false
  });
  fn && fn({
    resMsg: res.msg,
    fileKey: res.data,
    isSuccess: !res.data,
  })
}

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
  customerSearchChange();
};

/** 提交上传文件 */
function submitFileForm() {
  uploadRef.value?.submit();
}

onMounted(() => {
  // customerSearchChange();
  handlerClick();
});
</script>


<style scoped lang="scss">
.light-color-text {
  color: #afafaf; /* 淡灰色 */
}
:deep(.absolutely-width) {
  width: 100%;
  .el-input__wrapper {
    width: 100%;
  }
}
</style>



