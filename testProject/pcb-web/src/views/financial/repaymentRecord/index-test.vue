<template>
  <div class="p-2">
    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="20">
            <el-radio-group v-model="radioTable">
              <el-radio-button label="待审核列表" @change="radioTableHandle" />
              <el-radio-button label="回款列表" @change="radioTableHandle" />
            </el-radio-group>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" >收款单录入</el-button>
          </el-col>
        </el-row>
      </template>
      <XTable
        :pageShow="true"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :intervalCondition="['payDate']"
        :page-params="{ perfect: true, total: total }"
        :data="repaymentRecordList"
        :columnList="columnList"
        border
        @searchChange="searchChange"
        :column-config="{ resizable: true }"
      >
        <template #default-payDate="scope">
          <span>{{ parseTime(scope.row.payDate, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-payExpireDate="scope">
          <span>{{ parseTime(scope.row.payExpireDate, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-payWay="scope">
          <dict-tag :options="payWayList" :value="scope.row.payWay" />
        </template>
        <template #default-createTime="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-ossName="scope">
          <el-check-tag
            class="ml-2"
            checked
            size="small"
            v-show="scope.row.ossName"
            type="success"
            @change="ossNameClick(scope.row)"
            >{{ scope.row.ossName }}</el-check-tag
          >
        </template>
        <template #default-make="scope">
          <el-button
            link
            type="primary"
            v-show="scope.row.status == '待提交' || scope.row.status == '驳回'"
            @click="handleUpdate(scope.row)"

            >编辑</el-button
          >
          <el-button
            link
            type="primary"
            v-show="scope.row.status == '待提交' || scope.row.status == '驳回'"
            @click="checkPass(scope.row)"

            >提交</el-button
          >
          <el-button
            link
            type="primary"
            v-show="scope.row.status == '待审核'"
            @click="handleToExamine(scope.row)"

            >审核</el-button
          >
          <el-button
            link
            type="primary"
            v-show="scope.row.status == '审核通过'"
            @click="handleFile(scope.row)"

            >回执上传</el-button
          >

          <el-button link type="primary" @click="handleDetail(scope.row)" >详情</el-button>
          <el-button
            link
            type="primary"
            v-show="scope.row.status == '待提交' || scope.row.status == '驳回'"
            @click="handleDelete(scope.row)"

            >删除</el-button
          >
        </template>
      </XTable>
    </el-card>

    <el-drawer v-model="paymentTable.visible" :title="paymentTable.title" size="80%" draggable>
      <el-form
        border
        label-width="120px"
        :disabled="paymentTable.title?.includes('详情') || paymentTable.title?.includes('审核')"
        :model="form"
        ref="repaymentRecordFormRef"
        :rules="rules"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="供应商:" prop="supplierId">
              <el-select :disabled="paymentTable.title?.includes('修改')" placeholder="请选择供应商" style="width: 100%;" v-model="form.supplierId">
                <el-option v-for="item in SupplierList" :key="item.id" :label="item.supplierName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="收款日期:" prop="payDate">
              <el-date-picker
                v-model="form.payDate"
                style="width: 100%;"
                type="date"
                placeholder="选择日期时间"
                value-format="YYYY-MM-DD 23:59:59"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="收据号/发票号:" prop="payCode">
              <el-input v-model="form.payCode" :rows="2" placeholder="请输入收据号/发票号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="期票到款时间:" prop="payExpireDate">
              <el-date-picker
                v-model="form.payExpireDate"
                style="width: 100%;"
                type="date"
                placeholder="选择日期时间"
                value-format="YYYY-MM-DD 23:59:59"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item size="small" label="收款金额:" prop="totalPrice">
              <el-input-number :disabled="paymentTable.title?.includes('详情')" style="width: 33%;" :controls="false" v-model="form.totalPrice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="收款方式:" prop="payWay">
              <el-select v-model="form.payWay" clearable filterable placeholder="请选择付款方式">
                <el-option v-for="item in payWayList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="收款账号:" prop="accountNumber">
              <el-input v-model="form.accountNumber" :rows="2" placeholder="请输入收据号/发票号" />
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-form-item size="small" label="备注:">
              <el-input v-model="form.remark" :rows="2" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider content-position="left">
        <el-button
          :disabled="paymentTable.title?.includes('详情') || paymentTable.title?.includes('审核')"
          link
          type="primary"
          @click="relatedInvoice()"

          >关联发票</el-button
        ></el-divider
      >
      <XTable
        :columnList="confirmInvoiceColumnList"
        border
        height="400"
        :searchShow="false"
        :row-config="{ isHover: true }"
        :data="confirmSelectList"
      >
      </XTable>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="paymentTableCancel">取消</el-button>
            <el-button
              type="success"
              v-show="paymentTable.title?.includes('修改') || paymentTable.title?.includes('添加')"
              @click="submitForm"

            >
              保存
            </el-button>
            <el-button
              type="danger"
              v-show="paymentTable.title?.includes('审核')"
              @click="reject(form.id)"

            >
              驳回
            </el-button>
            <el-button
              type="primary"
              v-show="paymentTable.title?.includes('审核')"
              @click="examinePass(form.id)"

            >
              通过
            </el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <el-dialog v-model="relatedInvoiceDialog.visible" :title="relatedInvoiceDialog.title" width="90%" draggable>
      <el-row>
        <el-col :span="6">
          <el-table size="small" :data="selectInvoiceVOList" height="440" :border="true">
            <el-table-column property="code" fixed />
            <el-table-column v-show="false" property="amount" label="已选发票" />
            <el-table-column align="center">
              <template #default="scope">
                <el-tooltip content="删除" placement="top">
                  <el-button
                    link
                    type="primary"
                    icon="CloseBold"
                    @click="handleSelectedListDelete(scope.row)"

                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="18">
          <XTable
            :pageShow="true"
            :loading="invoiceLoading"
            :columnList="invoiceColumnList"
            v-model:page-size="invoiceQueryParams.pageSize"
            v-model:current-page="invoiceQueryParams.pageNum"
            :page-params="{ perfect: true, total: invoiceTotal }"
            :intervalCondition="['invoiceTime']"
            border
            ref="tableRef"
            height="400"
            size="small"
            :row-config="{ isHover: true }"
            :data="invoiceList"
            @searchChange="invoiceSearchChange"
            @checkbox-all="selectAllChangeEvent"
            @checkbox-change="selectChangeEvent"
          >
          </XTable>
        </el-col>
      </el-row>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="invoiceCancel">取消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="submitInvoiceForm"
              >确 定</el-button
            >
          </span>
        </div>
      </template>
    </el-dialog>
    <!-- 添加或修改OSS对象存储对话框 -->
    <el-dialog :title="dialogOSS.title" v-model="dialogOSS.visible" width="500px" append-to-body>
      <el-form ref="ossFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文件名">
          <fileUpload v-model="ossForm.file" v-if="type === 0" :fileType="fileType" :limit="1" />
          <imageUpload v-model="ossForm.file" v-if="type === 1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitOSSForm">确 定</el-button>
          <el-button @click="cancelOSS">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="RepaymentRecord" lang="ts">
import { listRepaymentRecord, getRepaymentRecord, delRepaymentRecord, addRepaymentRecord, updateRepaymentRecord , updatePaymentStatus ,uploadReceipt } from '@/api/financial/repaymentRecord';
import { RepaymentRecordVO, RepaymentRecordQuery, RepaymentRecordForm , InvoiceQuery, InvoiceForm } from '@/api/financial/repaymentRecord/types';
import { InvoiceVO} from "@/api/financial/invoice/types";
import {  listSupplier } from '@/api/financial/accountOrder';
import { listInvoice } from "@/api/financial/invoice";
import { VxeTableInstance, VxeTableEvents } from 'vxe-table'
import { OssForm, OssQuery, OssVO } from "@/api/system/oss/types";
import { SupplierVO } from "@/api/basedata/supplier/types";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const repaymentRecordList = ref<RepaymentRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const invoiceTotal = ref(0);
const queryFormRef = ref<ElFormInstance>();
const repaymentRecordFormRef = ref<ElFormInstance>();
const invoiceLoading = ref(false);
//选中的发票
const selectInvoiceVOList = ref<InvoiceVO[]>([]);
//确认选中的发票
const confirmSelectList = ref<InvoiceVO[]>([]);
//发票列表,
const invoiceList = ref<InvoiceVO[]>([]);

// 默认排序
const defaultSort = ref({ prop: 'createTime', order: 'ascending' });
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const dialogOSS = reactive<DialogOption>({
  visible: false,
  title: ''
});

const relatedInvoiceDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const tableRef = ref<VxeTableInstance<InvoiceVO>>()
const radioTable = ref('待审核列表');

//供应商列表
let SupplierList: SupplierVO[] = [];

/**
 * 获取供应商列表
 */
const getSupplierList = async () => {
  const SupplierResponse: any = await listSupplier();

  SupplierList = SupplierResponse;
}
const { pay_way: payWayList } = toRefs<any>(proxy?.useDict("pay_way"));

//状态: 1待提交、2待审核、3驳回、4审核通过
const statusFilterData = ref([
  { label: '待提交', value: "1" },
  { label: '待审核', value: "2" },
  { label: '驳回', value: "3" },
  { label: '审核通过', value: "4" },
])


const columnList = ref([
  { title: '序号',  type: 'seq', width: '50', align: 'center' },
   { title: '单据状态',width:'90', field: 'status', align: 'center', filterType: undefined, filterParam: { placeholder: '请选择状态' },  filterData: () => statusFilterData.value },
  { title: '收款单号', field: 'code', width: '160', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入收款单号' } },
  { title: '收款日期', field: 'payDate', width: '140', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请输入收款日期', valueFormat: 'YYYY-MM-DD' } },
  { title: '供应商编码', field: 'supplierCode', width: '100', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商编码' } },
  { title: '供应商名称', field: 'supplierName', width: '100', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
  { title: '收据号/发票号', field: 'payCode', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入收据号/发票号' } },
  { title: '票款到期日期', field: 'payExpireDate', width: '120', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请输入票款到期日期' , valueFormat: 'YYYY-MM-DD' } },
  { title: '收款方式', field: 'payWay', width: '100', align: 'center', filterType: 'checkboxButton', filterParam: { placeholder: '请输入收款方式' }, filterData: () => payWayList.value  },
  { title: '收款账户', field: 'accountNumber', width: '100', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入收款账户' } },
  { title: '收款金额', field: 'writeOffPrice', width: '100', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入收款金额' } },
  { title: '收款余额', field: 'balance', width: '100', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入收款余额' } },
  { title: '制单日期', field: 'createTime', width: '160', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请输入制单日期',valueFormat: 'YYYY-MM-DD' } },
  { title: '申请人', field: 'createByName', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入申请人' } },
  { title: '备注', field: 'remark', align: 'center',width:'120', filterType: 'input', filterParam: { placeholder: '请输入备注' } },
  { title: '回执', field: 'ossName', width: '180', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入回执' } },
  { title: '操作', field: 'make', align: 'center', fixed: 'right', width: 160 },
]);

const confirmInvoiceColumnList = ref([

  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { field: 'code', width: '130', title: '发票代码', align: 'center' },
  { field: 'number', width: '130', title: '发票号码', align: 'center' },
  { field: 'digitalNumber', width: '130', title: '数电票号码', align: 'center' },
  { field: 'sellerIdentifier', width: '150', title: '销方识别号', align: 'center' },
  { field: 'buyerIdentifier', width: '130', title: '购方识别号', align: 'center' },
  { field: 'buyerName', width: '100', title: '购买方名称', align: 'center' },
  { field: 'invoiceTime', width: '160', title: '开票日期', align: 'center' },
  { field: 'amount', width: '80', title: '金额', align: 'center' },
  { field: 'tax', width: '80', title: '税额', align: 'center' },
  { field: 'amountTax', width: '80', title: '价税合计', align: 'center' },
  { field: 'source', width: '100', title: '发票来源', align: 'center' },
  { field: 'type', width: '100', title: '发票票种', align: 'center' },
  { field: 'status', width: '80', title: '发票状态', align: 'center' },
  { field: 'riskLevel', width: '120', title: '发票风险等级', align: 'center' },
  { field: 'issuerName', width: '80', title: '开票人', align: 'center' },
  { field: 'addressId', width: '50', title: '备注', align: 'center' },
]);

const invoiceColumnList = ref([
  { type: 'checkbox', align: 'center', width: '60' },
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { field: 'code', width: '130', title: '发票代码', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入数电票号码' } },
  { field: 'number', width: '130', title: '发票号码', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入数电票号码' } },
  { field: 'digitalNumber', width: '130', title: '数电票号码', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入数电票号码' } },
  { field: 'sellerIdentifier', width: '150', title: '销方识别号', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入销方识别号' } },
  { field: 'buyerIdentifier', width: '130', title: '购方识别号', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入购方识别号' } },
  { field: 'buyerName', width: '100', title: '购买方名称', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入购买方名称' } },
  { field: 'invoiceTime', width: '160', title: '开票日期', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入开票日期' } },
  { field: 'amount', width: '80', title: '金额', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入金额' } },
  { field: 'tax', width: '80', title: '税额', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入税额' } },
  { field: 'amountTax', width: '80', title: '价税合计', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入价税合计' } },
  { field: 'source', width: '100', title: '发票来源', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入发票来源' } },
  { field: 'type', width: '100', title: '发票票种', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入发票票种' } },
  { field: 'status', width: '80', title: '发票状态', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入发票状态' } },
  { field: 'riskLevel', width: '120', title: '发票风险等级', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入发票风险等级' } },
  { field: 'issuerName', width: '80', title: '开票人', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入开票人' } },
  { field: 'addressId', width: '50', title: '备注', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入备注' } },
]);

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
    service: '',
    orderByColumn: defaultSort.value.prop,
    isAsc: defaultSort.value.order
  },
  rules: {
    file: [
      { required: true, message: "文件不能为空", trigger: "blur" }
    ]
  }
});
const { queryParams:ossQueryParams, form:ossForm, rules:ossRules } = toRefs(ossData);

const initInvoiceFormData: InvoiceForm = {
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
}

const invoiceData = reactive<PageData<InvoiceForm, InvoiceQuery>>({
  form: { ...initInvoiceFormData },
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

  }
});


const initFormData: RepaymentRecordForm = {
  id: undefined,
  totalPrice: undefined,
  writeOffPrice: undefined,
  balance: undefined,
  type: undefined,
  supplierId: undefined,
  payDate: undefined,
  payCode: undefined,
  payExpireDate: undefined,
  payWay: undefined,
  accountNumber: undefined,
  remark: undefined,
  isUploadedReceipt: undefined,
  invoiceIdList:[]
}
const data = reactive<PageData<RepaymentRecordForm, RepaymentRecordQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    totalPrice: undefined,
    writeOffPrice: undefined,
    balance: undefined,
    type: undefined,
    supplierId: undefined,
    payDate: undefined,
    payCode: undefined,
    payExpireDate: undefined,
    payWay: undefined,
    accountNumber: undefined,
    isUploadedReceipt: undefined,
    status:undefined,
    params: {
    }
  },
  rules: {
    supplierId: [
      { required: true, message: "请选择供应商", trigger: "blur" }
    ],
    payDate: [
      { required: true, message: "收款日期不能为空", trigger: "blur" }
    ],
    payCode: [
      { required: true, message: "收据号/发票号不能为空", trigger: "blur" }
    ],
    payExpireDate: [
      { required: true, message: "票款到期日期不能为空", trigger: "blur" }
    ],
     totalPrice: [
      { required: true, message: "收款金额不能为空", trigger: "blur" }
    ],
    payWay: [
      { required: true, message: "打款方式不能为空", trigger: "blur" }
    ],
    accountNumber: [
      { required: true, message: "收款账户不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);
const { queryParams:invoiceQueryParams, form: invoiceForm } = toRefs(invoiceData);


// 发票搜索条件
const invoiceSearchChange = (params: any) => {
  invoiceQueryParams.value = params
  getInvoiceList();
}
// 切换菜单栏
const radioTableHandle = () => {
  if (radioTable.value == "回款列表") {
    queryParams.value.status = undefined;
    columnList.value[1].filterType = 'checkboxButton'
  } else {
    columnList.value[1].filterType = undefined
  }
  getList()
}
// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  getList()
}

/** 待审核 */
const listRadio = async () => {
  queryParams.value.type="2";
  queryParams.value.status = "2";
  await getList();
}

/** 待收款 */
const paymentListRadio = async () => {
   queryParams.value.type = "2";
   queryParams.value.status = undefined;
  await getList();
}

/** 回执按钮 */
const ossNameClick = (row: RepaymentRecordVO) => {
  if(row.ossId){
    proxy?.$download.oss(row.ossId)
  }
}

/** 文件上传提交按钮 */
const submitOSSForm = () => {

if(!ossForm.value.file){
  proxy?.$modal.msgError("请选择文件");
  return;
}

//根据,分割ossForm.value.file得到一个数组

  if (ossForm.value.file && ossForm.value.file.length > 1) {
    let fileArr = ossForm.value.file.split(",");
    if (fileArr.length > 1) {
      proxy?.$modal.msgError("只能上传一个文件");
      return;
    }
    uploadReceipt({ id: paymentId.value, value: ossForm.value.file }).then(res => {
      proxy?.$modal.msgSuccess("操作成功");

      getList();
      dialogOSS.visible = false;
    });
  }

  return;

}


/**运行文件上传的类型 */
const fileType: string[] = [];

const type = ref(0);
const paymentId = ref<number|string>("");
/** 文件按钮操作 */
const handleFile = (row: RepaymentRecordVO) => {
  resetOSS();
  paymentId.value = row.id;
  type.value = 0;
  dialogOSS.visible = true;
  dialogOSS.title = "上传回执";
}
const ossFormRef = ref<ElFormInstance>();
/** 取消按钮 */
function cancelOSS() {
  dialogOSS.visible = false;
  resetOSS();
}
/** 表单重置 */
function resetOSS() {
  ossForm.value = { ...initOSSFormData };
  ossFormRef.value?.resetFields();
}


/** 审核驳回 */
const reject = async (id: string | number | undefined) => {
  updateStatus(id, "3");
}
/** 审核通过 */
const examinePass = async (id: string | number | undefined) => {
  updateStatus(id, "4");
}
/** 提交*/
const checkPass = async (row: RepaymentRecordVO) => {
  await proxy?.$modal.confirm('是否确认提交对账单编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  updateStatus(row.id, "2");
}

const updateStatus = (id: any, value: string) => {
  updatePaymentStatus({ id, value }).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
    getList();
    paymentTable.visible = false;
  });
}


/** 选择关联发票确认按钮操作 */
const submitInvoiceForm = () => {
  relatedInvoiceDialog.visible = false;
  confirmSelectList.value = selectInvoiceVOList.value;
}


const selectAllChangeEvent: VxeTableEvents.CheckboxAll<InvoiceVO> = ({ checked }) => {
   const $table = tableRef.value.xTableRef
  if ($table) {
    const records = $table.getCheckboxRecords()
    if (checked) {
      //把records中的每一条数据设置selected为true
      selectInvoiceVOList.value.push(...records.filter(item => !selectInvoiceVOList.value.some(item2 => item.id == item2.id)))
    } else {
      selectInvoiceVOList.value = selectInvoiceVOList.value.filter(item => {
        return !invoiceList.value.some(item2 => item.id == item2.id);
      });
    }
  }
}

const selectChangeEvent: VxeTableEvents.CheckboxChange<InvoiceVO> = ({ checked, row }) => {
   const $table = tableRef.value.xTableRef
  if ($table) {
    const records = $table.getCheckboxRecords()
    if (checked) {
      selectInvoiceVOList.value.push(...records.filter(item => !selectInvoiceVOList.value.some(item2 => item.id == item2.id)))
    } else {
      selectInvoiceVOList.value = selectInvoiceVOList.value.filter(item => item.id != row.id)
    }
  }
}

const setSelectRow = () => {
   const $table = tableRef.value.xTableRef
  if ($table) {
    let st = invoiceList.value.filter(item => {
      return selectInvoiceVOList.value.some(item2 => item.id == item2.id);
    });
    $table.setCheckboxRow(st, true);
  }
}


/** 导入按钮操作 */
const handleImport = (row?: RepaymentRecordVO) => {
  console.log(row);


};

/** 已选发票 删除按钮操作 */
const handleSelectedListDelete = async (row?: InvoiceVO) => {
  const _ids = row?.id || ids.value;
  //删除已选物料
  selectInvoiceVOList.value = selectInvoiceVOList.value.filter(item => item.id != _ids);
   const $table = tableRef.value.xTableRef
  let invoice =invoiceList.value.find(item => item.id == _ids);
  if ($table) {
    $table.setCheckboxRow(invoice, false);
  }

}
/** 添加修改页面取消按钮 */
const paymentTableCancel = () => {
  // invoiceReset();
  reset()
  confirmSelectList.value = [];
  paymentTable.visible = false;
}
/** 关联选择发票取消按钮 */
const invoiceCancel = () => {
  invoiceReset();
  relatedInvoiceDialog.visible = false;
}
/** 已选重置 */
const invoiceReset = () => {

  selectInvoiceVOList.value = [];

}
/**关联发票按钮 */
const relatedInvoice = async() => {

  relatedInvoiceDialog.visible = true;
  relatedInvoiceDialog.title = "选择发票";
  selectInvoiceVOList.value = [...confirmSelectList.value];
  await getInvoiceList();
  setSelectRow();
}




/** 查询收款/回款记录列表 */
const getList = async () => {
  queryParams.value.type = "2";
   if (radioTable.value == "待审核列表") {
    queryParams.value.status = "2";
  }
  loading.value = true;
  if (queryParams.value.status) {
    if (Array.isArray(queryParams.value.status)) {
      //使用，拼接
      queryParams.value.status = queryParams.value.status.join(",");
    }
  }
  if (queryParams.value.payWay) {
    if (Array.isArray(queryParams.value.payWay)) {
      //使用，拼接
      queryParams.value.payWay = queryParams.value.payWay.join(",");
    }
  }

  const res = await listRepaymentRecord(queryParams.value);
  repaymentRecordList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
/** 查询发票列表 */
const getInvoiceList = async () => {
  invoiceLoading.value = true;
  //类型(0应收、1应付)
  invoiceQueryParams.value.invoiceType="1";
  const res = await listInvoice(invoiceQueryParams.value);
  invoiceList.value = res.rows;
  invoiceTotal.value = res.total;
  invoiceLoading.value = false;

}



/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  repaymentRecordFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: RepaymentRecordVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

const paymentTable = reactive<DialogOption>({
  visible: false,
  title: ''
});
/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  confirmSelectList.value = [];
  //  inOutReset();
  paymentTable.visible = true;
  paymentTable.title = "添加收款单";
  // getListInOutRecord();
}

/** 修改按钮操作 */
const handleUpdate = async (row?: RepaymentRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getRepaymentRecord(_id);
  Object.assign(form.value, res.data);
  confirmSelectList.value = res.data.invoiceVoList;
  paymentTable.visible = true;
  paymentTable.title = "修改付款/回款记录";
}
/** 详情按钮操作 */
const handleDetail = async (row?: RepaymentRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getRepaymentRecord(_id);
  Object.assign(form.value, res.data);
  confirmSelectList.value = res.data.invoiceVoList;
  paymentTable.visible = true;
  paymentTable.title = "付款/回款记录详情";
}
/**审核弹窗按钮操作 */
const handleToExamine = async (row?: RepaymentRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getRepaymentRecord(_id);
  Object.assign(form.value, res.data);
  confirmSelectList.value = res.data.invoiceVoList;
  paymentTable.visible = true;
  paymentTable.title = "付款/回款审核";
}


/** 提交按钮 */
const submitForm = () => {
  repaymentRecordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      //判断confirmSelectInventoryList.value是否为空
      if (confirmSelectList.value.length == 0) {
        proxy?.$modal.msgError("请选择关联发票");
        return;
      }
      //将confirmSelectInventoryList.value中的id赋值给inventoryIdList
      form.value.invoiceIdList = confirmSelectList.value.map(item => item.id);
      // form.value.invoiceVoList=[];
      buttonLoading.value = true;
      if (form.value.id) {
        await updateRepaymentRecord(form.value).finally(() =>  buttonLoading.value = false);
        proxy?.$modal.msgSuccess("修改成功");
      } else {
        form.value.status = "1";
        await addRepaymentRecord(form.value).finally(() =>  buttonLoading.value = false);
         proxy?.$modal.msgSuccess("添加成功");
      }
      paymentTable.visible = false;
      await getList();
    }

  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: RepaymentRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除收款/回款记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delRepaymentRecord(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('financial/repaymentRecord/export', {
    ...queryParams.value
  }, `repaymentRecord_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  listRadio();
  getSupplierList();
});
</script>
<style>
.no-selection th .el-checkbox {
  display: none;
}
</style>
