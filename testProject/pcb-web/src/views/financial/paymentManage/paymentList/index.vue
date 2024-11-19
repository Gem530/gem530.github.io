<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="24">
            <el-form :model="queryParams" ref="queryFormRef" size="small" label-width="80px"
                     class="demo-form-inline">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="付款单号" prop="code">
                    <el-input v-model="queryParams.code"  clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="单据状态" prop="status">
                    <el-select v-model="queryParams.status" style="width:100%"  clearable :collapse-tags="true" filterable>
                      <el-option
                        v-for="item in statusFilterData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="供应商名称" prop="supplierName">
<!--                    <el-input v-model="queryParams.supplierName"  clearable />-->
                    <el-select v-model="queryParams.supplierName" style="width:100%"  clearable :collapse-tags="true" filterable>
                      <el-option
                        v-for="item in SupplierList"
                        :key="item.id"
                        :label="item.supplierName"
                        :value="item.supplierName"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="供应商代码" prop="supplierCode">
                    <el-input v-model="queryParams.supplierCode"  clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="付款方式" prop="payWay">
                    <el-select v-model="queryParams.payWay" style="width:100%"  clearable :collapse-tags="true" filterable>
                      <el-option
                        v-for="item in optionPayWayList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="付款日期" prop="cusId">
                    <el-date-picker style="width: calc((100% - 15px)/2)" size="small"
                                    v-model="queryParams.payDateStart"
                                    :disabled-date="(time) => {
                                      return queryParams.payDateEnd ? time.getTime() > new Date(queryParams.payDateEnd).getTime() : false
                                    }"
                                    type="date"
                                    placeholder="选择开始时间" value-format="YYYY-MM-DD 00:00:00" format="YYYY-MM-DD"/>
                    <span style="width: 10px;margin-left: 5px">-</span>
                    <el-date-picker style="width: calc((100% - 15px)/2)" size="small"
                                    v-model="queryParams.payDateEnd"
                                    :disabled-date="(time) => {
                                      return queryParams.payDateStart ? time.getTime() < new Date(queryParams.payDateStart).getTime() : false
                                    }"
                                    type="date"
                                    placeholder="选择结束时间" value-format="YYYY-MM-DD 23:59:59" format="YYYY-MM-DD"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <div style="float: right">
                    <el-button @click="resetQuery">重置</el-button>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="mb8">
          <el-col :span="24" style="display:flex;justify-content: flex-end;">
            <el-button type="primary" style="float: right" @click="handleAdd" >新增付款单</el-button>
            <el-button v-if="checkPermi(['financial:paymentManage:importPayData'])"  @click="handleImport">导入历史数据</el-button>
          </el-col>
        </el-row>
      </template>
      <XTable
        toolId="paymentRecord"
        height="100%"
        :loading="loading"
        class="xtable-content"
        :pageShow="true"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :intervalCondition="['payDate','payExpireDate','createTime']"
        :page-params="{ perfect: true, total: total }"
        :data="repaymentRecordList"
        :columnList="columnList"
        border :showRefresh="true"
        @searchChange="searchChange"
        :column-config="{ resizable: true }"
        ref="XTableRef"
      >
        <template #default-payCode="scope">
          <span>{{ scope.row.payCode?scope.row.payCode:'--' }}</span>
        </template>
        <template #default-transferredAmount="scope">
          <span>{{ scope.row.transferredAmount==='0.0000'?'':Number(parseFloat(scope.row.transferredAmount).toString()) }}</span>
        </template>
        <template #default-totalPrice="scope">
          <span>{{ scope.row.totalPrice?Number(parseFloat(scope.row.totalPrice).toString()):'0' }}</span>
        </template>

        <template #default-status="scope">
          <div v-for="(item,index) in statusFilterData">
            <el-tag :key="index" :type="item.type" size="small" v-if="item.value == scope.row.status">{{item.label}}</el-tag>
          </div>
        </template>
        <template #default-payDate="scope">
          <span>{{ scope.row.payDate?parseTime(scope.row.payDate, '{y}-{m}-{d}'):'--' }}</span>
        </template>
        <template #default-payExpireDate="scope">
          <span>{{ scope.row.payExpireDate?parseTime(scope.row.payExpireDate, '{y}-{m}-{d}'):'--' }}</span>
        </template>
        <template #default-payWay="scope">
          <dict-tag :options="optionPayWayList" :value="scope.row.payWay" />
        </template>
        <template #default-payAccount="scope">
          <span v-if="['1','2'].includes(scope.row.payWay)">--</span>
          <dict-tag
            v-if="!['1','2'].includes(scope.row.payWay)&&payAccountList&&payAccountList.length>0&&payAccountList.find((vo:any) => vo.id == scope.row.payAccount)"
            :options="payAccountList" :value="scope.row.payAccount"
          />
        </template>
        <template #default-createTime="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-ossName="scope">
          <XUpload v-model:model-value="scope.row.fileList" model="download" :limit="1" readOnly></XUpload>
        </template>

        <template #default-make="scope">
          <el-button
            link
            type="primary"
            v-show="scope.row.status == '1' || scope.row.status == '3'"
            @click="handleUpdate(scope.row)"

            >编辑</el-button
          >
          <el-button
            link
            type="primary"
            v-show="scope.row.status == '1' || scope.row.status == '3'"
            @click="checkPass(scope.row)"

            >提交</el-button
          >
          <el-button
            link
            type="primary"
            v-show="scope.row.status == '1' || scope.row.status == '3'"
            @click="handleDelete(scope.row)"

          >删除</el-button
          >
          <el-button
            link
            type="primary"
            v-show="scope.row.status == '2'"
            @click="handleToExamine(scope.row)"
            v-if="checkPermi(['financial:paymentManage:auditPayment'])"
            >审核</el-button
          >
          <el-button
            link
            type="primary"
            v-show="scope.row.status == '4'"
            @click="reloadUpdate(scope.row)"

          >重新修改</el-button
          >

          <el-button link type="primary" @click="handleDetail(scope.row)" >查看详情</el-button>
        </template>
      </XTable>
    </el-card>


    <el-drawer v-model="paymentTable.visible" :title="paymentTable.title" destroy-on-close  size="80%" draggable>
      <template #header="{ close, titleId, titleClass }">
        <div>
          <span>{{paymentTable.title}}</span>
          <span style="margin-left: 2px" v-for="(item,index) in statusFilterData">
            <el-tag :key="index" :type="item.type" size="small" v-if="item.value == form.status">{{item.label}}</el-tag>
          </span>
        </div>
      </template>
      <Payment @getDetail="getDetail" @saveDraft="()=>{paymentTable.visible=false;getList();}" @submitDelete="handleDelete" :loading="buttonLoading" :isUpdate="isUpdate" :readOnly="isReadOnly" :form="form" type="1" @row-click="handleRowClick" @submitPass = "submitPass" @submitReject="submitReject" @submit="submit"></Payment>
    </el-drawer>

    <el-drawer v-model="paymentTableDetail.visible" :title="paymentTableDetail.title" destroy-on-close  size="80%" draggable>
      <template #header="{ close, titleId, titleClass }">
        <div>
          <span>{{paymentTableDetail.title}}</span>
          <span style="margin-left: 2px" v-for="(item,index) in statusFilterData">
            <el-tag :key="index" :type="item.type" size="small" v-if="item.value == detailInfo.status">{{item.label}}</el-tag>
          </span>
          <el-tag style="margin-left: 2px" type="success" size="small" v-if="detailInfo?.businessType=='1'">手动新增</el-tag>
          <el-tag style="margin-left: 2px" type="success" size="small" v-if="detailInfo?.businessType=='2'">付款转存</el-tag>
          <el-tag style="margin-left: 2px" type="success" size="small" v-if="detailInfo?.businessType=='3'">账单转存</el-tag>
        </div>
      </template>
      <Payment :isOpen="true" :loading="buttonLoading" :form="detailInfo" :isUpdate="true" :readOnly="true" type="1" ></Payment>
    </el-drawer>



    <el-dialog :title="upload.title" v-model="upload.open" width="550px">
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?yearMonth=' + upload.yearMonth"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false" drag>
        <el-icon class="el-icon--upload">
          <i-ep-upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="text-center el-upload__tip">
            <span>仅允许导入xls、xlsx格式文件。</span>
          </div>
        </template>
      </el-upload>
      <XTable :pageShow="false" :showHead="false" :columnList="columnListPaymentHistory" :data="tableData" style="width: 100%">
        <template #default-remark="scope">
          <span style="color:red">【必填项】</span> {{ scope.row.remark }}
        </template>
      </XTable>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script setup name="PaymentList" lang="ts">
  import { checkPermi } from "@/utils/permission";
  import {
    listRepaymentRecord,
    getRepaymentRecord,
    delRepaymentRecord,
    addPaymentRecord,
    queryPayRecordListByCustSup,
    updateRepaymentRecord,
    submitPaymentAccount,
    getPaymentAccountList,
    reUpdatePaymentAccount,
    addSubmitPaymentWriteOff,
    deletePaymentAccount,
    validatePaymentAccountDetail, rejectPaymentCheckPer, approvePaymentCheckPer
  } from '@/api/financial/repaymentRecord';
import { RepaymentRecordVO, RepaymentRecordForm , InvoiceForm } from '@/api/financial/repaymentRecord/types';
import { InvoiceVO} from "@/api/financial/invoice/types";
import { listOwnerSupplier } from '@/api/basedata/supplier';
import { OrderWriteOffRecordVO } from '@/api/financial/orderWriteOffRecord/types';
import { listCompany } from '@/api/basedata/customer';
import { deepClone } from '@/utils';
import {ref} from "vue";
import {AccountOrderForm, AccountOrderQuery, AccountOrderVO} from "@/api/financial/accountOrder/types";
import {getAccountOrder} from "@/api/financial/accountOrder";
import {parseTime} from "@/utils/ruoyi";
import { listOrderBack } from '@/api/order/orderBack/index';
import {
  OrderSaleDetailForm,
  OrderSaleDetailQuery,
  OrderSaleDetailVO,
  SALETYPEENUM
} from "@/api/financial/orderSaleDetail/types";
import {InOutRecordForm, InOutRecordQuery, InOutRecordVO} from "@/api/inventory/inOutRecord/types";
import {
  AccountOrderOtherForm,
  AccountOrderOtherQuery,
  AccountOrderOtherVO
} from "@/api/financial/accountOrderOther/types";
import {listOrderSaleDetail} from "@/api/financial/orderSaleDetail";
import {listAccountOrderOther} from "@/api/financial/accountOrderOther";
import {accountList} from "@/api/order/deliveryRecord";
import {OrderFilinOutDetailForm, OrderFilinOutDetailQuery} from "@/api/financial/orderFilinOutDetail/types";

import { globalHeaders } from "@/utils/request";
import dayjs from "dayjs";
import { decryptBase64ByStr } from '@/utils/crypto'
import { listDeptBank } from "@/api/system/dept"

let customerList:any = [];
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const isCust =ref(false);
const repaymentRecordList = ref<RepaymentRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const backTotal = ref(0);
const deliveryTotal = ref(0);
const invoiceTotal = ref(0);
const queryFormRef = ref<ElFormInstance>();
const repaymentRecordFormRef = ref<ElFormInstance>();
const invoiceLoading = ref(false);
//确认选中的发票
const confirmSelectList = ref<InvoiceVO[]>([]);
//发票列表,
const invoiceList = ref<InvoiceVO[]>([]);
// 默认排序
const defaultSort = ref({ prop: 'createTime', order: 'ascending' });
const dialogTableLoading = ref(false)
// 新增/编辑
let isUpdate = ref(false);

let isReadOnly = ref(false);

const dialogOSS = reactive<DialogOption>({
  visible: false,
  title: ''
});

const relatedInvoiceDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const tableRef = ref()
const radioTable = ref('待审核列表');

//const { pay_way:payWayList } = toRefs<any>(proxy?.useDict("pay_way"));

  const optionPayWayList = ref([
    {label: '现金', value: '3', elTagType: 'default', elTagClass: ''},
    {label: '转账', value: '5', elTagType: 'default', elTagClass: ''},
// {label: '赊账', value: '4', elTagType: 'default', elTagClass: ''}
    {label: '企业支付宝', value: '1', elTagType: 'default', elTagClass: ''},
    {label: '企业微信', value: '2', elTagType: 'default', elTagClass: ''},
    {label: '电子银承', value: '6', elTagType: 'default', elTagClass: ''},
    {label: '电子商承', value: '7', elTagType: 'default', elTagClass: ''},
    {label: '纸质银承', value: '8', elTagType: 'default', elTagClass: ''},
    {label: '支票', value: '9', elTagType: 'default', elTagClass: ''},
    {label: '委托书', value: '10', elTagType: 'default', elTagClass: ''},
  ]);

const payWayList = ref([
// {label: '支付宝', value: '1', elTagType: 'default', elTagClass: ''},
// {label: '微信', value: '2', elTagType: 'default', elTagClass: ''},
{label: '现金', value: '3', elTagType: 'default', elTagClass: ''},
// {label: '赊账', value: '4', elTagType: 'default', elTagClass: ''}
{label: '转账', value: '5', elTagType: 'default', elTagClass: ''},
{label: '电子银承', value: '6', elTagType: 'default', elTagClass: ''},
{label: '电子商承', value: '7', elTagType: 'default', elTagClass: ''},
{label: '纸质银承', value: '8', elTagType: 'default', elTagClass: ''},
{label: '支票', value: '9', elTagType: 'default', elTagClass: ''},
{label: '委托书', value: '10', elTagType: 'default', elTagClass: ''},
]);

// const payAccountList = ref([
//   {label: '中国工商银行信丰县支行', value: '1',bankNo:'1510201009000106395',account:'，行号：102428410247',type:'基本户，'},
//   {label: '江西信丰农村商业银行股份有限公司', value: '2',bankNo:'134649700000002476',account:'，行号：402428499993',type:'一般户，'},
//   {label: '赣州银行信丰支行', value: '3',bankNo:'2863000103000000896',account:'，行号：313428428636',type:'一般户，'},
//   {label: 'The Hongkong and Shanghai Banking Corporation Limited', value: '4',bankNo:'053-484846-838',account:'，编号：004,代码：HSBCHKHHHKH',type:'香港公司美金账户，'},
//   // {label: '企业微信', value: '5',account:'',bankNo:'1647640640',type:''},
//   // {label: '企业支付宝', value: '6',account:'',bankNo:'jx13316990051@sina.com',type:''},
// ]);

// 文件 列表
const fileList = ref([
 ]);

//供应商列表
let SupplierList = ref([]);
//状态: 1待提交、2待审核、3驳回、4审核通过
const statusFilterData =ref( [
  { label: '待提交', value: "1",type:"info"},
  { label: '待审核', value: "2",type:"warning" },
  { label: '审批驳回', value: "3" ,type:"danger"},
  { label: '审核通过', value: "4" ,type:"success"},
])

const columnList = ref([
  { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
  { title: '付款单号', field: 'code', width: '160', align: 'center', filterType: undefined, filterParam: { placeholder: '请输入付款单号' } },
  { title: '单据状态', field: 'status', width: '90', align: 'center', filterType: undefined, filterParam: { placeholder: '请选择状态' }, filterData: () => statusFilterData.value },
  { title: '付款日期', field: 'payDate', width: '140', align: 'center', filterType: undefined, filterParam: { placeholder: '请选择付款日期', valueFormat: 'YYYY-MM-DD'  } },
  { title: '供应商名称', field: 'supplierName', width: '100', align: 'center' , filterType: undefined},
  { title: '供应商代码', field: 'supplierCode', width: '100', align: 'center', filterType: undefined},
  { title: '付款方式', field: 'payWay', width: '100', align: 'center' , filterType: undefined, filterParam: { placeholder: '请选择付款方式' } ,filterData: () => payWayList.value },
  { title: '付款金额', field: 'totalPrice', width: '100', align: 'center'},
  { title: '付款账户', field: 'payAccount', width: '100', align: 'center' , filterType: 'checkboxButton', filterParam: { placeholder: '请选择付款账户' } ,filterData: () => payAccountList.value },
  { title: '银行/付款账号', field: 'accountNumber', width: '100', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入银行/付款账号' } },
  { title: '票据号码', field: 'payCode', width: '120', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入票据号码' } },
  { title: '票据到期日', field: 'payExpireDate', width: '120', align: 'center' , filterType: 'intervalDate', filterParam: {  placeholder: '请选择票据到期日' , valueFormat:'YYYY-MM-DD' } },
  { title: '备注', field: 'remark', width:'120', align: 'center' },
  { title: '转存金额', field: 'transferredAmount', width:'120', align: 'center' },
  { title: '关联预付款单', field: 'businessCode', width: '120', align: 'center' , filterType: 'input'},
  { title: '创建时间', field: 'createTime', width: '160', align: 'center' , filterType: 'intervalDate', filterParam: { placeholder: '请选择创建时间' ,valueFormat: 'YYYY-MM-DD' } },
  { title: '申请人', field: 'createByName', width: '120', align: 'center' },
  { title: '驳回原因', field: 'rejectRemark', width: '120', align: 'center' },

  { title: '操作', field: 'make',  align: 'center', fixed: 'right', width: '220' },
])

const columnListPaymentHistory = ref([
{ width: '50',title: '序号',field: 'seq',align: 'center',  },
{ width: '120',title: '重要列名',field: 'name',align: 'center',  },
{ maxWidth: '350',title: '说明',field: 'remark',align: 'center',  },
]);
const XTableRef = ref();
const route = useRoute();
/**
 * 进入页面次数
 */
const isFirst = ref(0)
/**
 * 待办跳转参数
 */
const pendingParams = ref()

const recordList = ref<OrderWriteOffRecordVO[]>([]);
  // 获取 搜索条件
  const searchChange = (params: any) => {
    initTableSearch();
    // queryParams.value = params
    Object.keys(params).forEach(key => {
      if (key == 'payAccount') {
        queryParams.value['payAccountList'] = params[key];
      } else if (params[key] !== null && params[key] !== undefined) {
        queryParams.value[key] = params[key];
      }
    })
    getList()
  }

  const initQueryParams: any = {
    pageNum: 1,
    pageSize: 20,
    isAsc: "desc",
    orderByColumn: "create_time",
    type: '1',
  }

  // 初始化表格组件的搜索条件
  const initTableSearch = () => {
    const tempParam = Object.keys(initQueryParams)
    Object.keys(queryParams.value).forEach(key => {
      if (!tempParam.includes(key)) {
        queryParams.value[key] = undefined
      }
    })
  }

/**
 * 获取供应商列表
 */
const getSupplierList = async () => {
  const SupplierResponse: any = await listOwnerSupplier();
  SupplierList.value = SupplierResponse.data;
}

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
const data = reactive<PageData<any, any>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    isAsc: "desc",
    businessType: "",
    orderByColumn: "create_time",
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

  }
});

const addRules = ref<ElFormRules>(
  {
    supplierId: [
      { required: true, message: "请选择供应商", trigger: "blur" }
    ],
    payDate: [
      { required: true, message: "付款日期不能为空", trigger: "blur" }
    ],
    payCode: [
      { required: true, message: "票据号码不能为空", trigger: "blur" },
      {
        validator: (rule, value, callback) => {
          const reg = /^[a-zA-Z0-9]*$/;
          if (!reg.test(value)) {
            callback(new Error('只能输入数字或字母'));
          } else {
            callback();
          }
        },
        trigger: 'change'
      }
    ],
    payExpireDate: [
      { required: true, message: "票据到期日不能为空", trigger: "blur" }
    ],
     totalPrice: [
      { required: true, message: "付款金额不能为空", trigger: "blur" }
    ],
    payWay: [
      { required: true, message: "付款方式不能为空", trigger: "blur" }
    ],
    accountNumber: [
      { required: true, message: "付款账号不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ]
});

const { queryParams, form, rules } = toRefs(data);


/**运行文件上传的类型 */
const fileType: string[] = [];

const type = ref(0);
const paymentId = ref<number|string>("");

  /** 重置按钮操作 */
  const resetQuery = () => {
    queryFormRef.value?.resetFields();
    queryParams.value.payDateStart='';
    queryParams.value.payDateEnd='';
    handleQuery();
  };

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.value.pageNum = 1;
    getList();
  };

  /** 提交*/
  const checkPass = async (row: RepaymentRecordVO) => {
    await proxy?.$modal.confirm('是否确认提交付款单号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
    const data = {
      id: row.id,
    }
    const res = await validatePaymentAccountDetail(data)
    if (res.msg) {
      ElMessageBox.confirm(
        res.msg + " 是否确认进入编辑页面",
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
        }
      ).then(() => {
        handleUpdate(row);
      }).catch(()=>{
        getList();
      })
    } else {
      submitPaymentAccount({id: row.id, isSup: false}).then(res => {
        proxy?.$modal.msgSuccess("操作成功");
        getList();
        paymentTable.visible = false;
      }).finally(() => {
        buttonLoading.value = false;
      });
    }
  }

const submit = (row: any) => {
  buttonLoading.value = true;
  row.type = '1';
  addSubmitPaymentWriteOff(row).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
    paymentTable.visible = false;
    getList();
  }).finally(() => {
    buttonLoading.value = false;
  });
}

  /*审核通过*/
  const submitPass = (id: any, isSup: boolean) => {
    buttonLoading.value = true;
    approvePaymentCheckPer({id: id, isSup: isSup}).then(res => {
      proxy?.$modal.msgSuccess("操作成功");
      paymentTable.visible = false;
      getList();
    }).finally(() => {
      buttonLoading.value = false;
    });
  }

  /*审核驳回*/
  const submitReject = (id: any) => {
    buttonLoading.value = true;
    rejectPaymentCheckPer(id).then(res => {
      proxy?.$modal.msgSuccess("操作成功");
      paymentTable.visible = false;
      getList();
    }).finally(() => {
      buttonLoading.value = false;
    });
  }

  /*删除*/
  const submitDelete = (id: any) => {
    buttonLoading.value = true;
    deletePaymentAccount({id: id}).then(res => {
      proxy?.$modal.msgSuccess("操作成功");
      paymentTable.visible = false;
      getList();
    }).finally(() => {
      buttonLoading.value = false;
    });
  }

/** 查询付款/回款记录列表 */
const getList = async () => {
  queryParams.value.type = "1";
  loading.value = true;
if(queryParams.value.status ){
  if(Array.isArray(queryParams.value.status)){
      //使用，拼接
      queryParams.value.status = queryParams.value.status.join(",");
  }
}
if(queryParams.value.payWay){
  if(Array.isArray(queryParams.value.payWay)){
      //使用，拼接
      queryParams.value.payWay = queryParams.value.payWay.join(",");
  }
}
  const res = await listRepaymentRecord(queryParams.value);
  repaymentRecordList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  isReadOnly.value = false;
  isUpdate.value = false;
  repaymentRecordFormRef.value?.resetFields();
}

const reset2 = () => {
  detailInfo.value = {};
  // isReadOnly.value = false;
  // isUpdate.value = false;
  repaymentRecordFormRef.value?.resetFields();
}

const paymentTable = reactive<DialogOption>({
  visible: false,
  title: ''
});

const paymentTableDetail = reactive<DialogOption>({
  visible: false,
  title: ''
});

const detailInfo = ref({});

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  confirmSelectList.value = [];
  recordList.value = [];
  //  inOutReset();
  isCust.value = false;
  paymentTable.visible = true;
  paymentTable.title = "添加付款单";
  // getListInOutRecord();
}

/** 修改按钮操作 */
const handleUpdate = async (row?: RepaymentRecordVO) => {
  reset();
  if(row.customerId){
    isCust.value = true;
  }else{
    isCust.value = false;
  }

  const _id = row?.id;
  dialogTableLoading.value = true
  const res = await getRepaymentRecord(_id);
  Object.assign(form.value, res.data);
  isUpdate.value = true;
  console.log(form.value);
  const res2 = await getPaymentAccountList({payAllWriteOff : '0',supplierId: form.value.supplierId, paymentId: _id})
  form.value.confirmSelectList = res2.rows;
  console.log(form.value)
  // await nextTick();
  paymentTable.visible = true;
  paymentTable.title = "编辑付款单";
  dialogTableLoading.value = false
}

//子组件调用
const handleRowClick = (rowData: any) => {
  console.log('Row clicked:', rowData);
  // 在这里调用父组件的方法
  handleAccountDetail(rowData);
};

const drawerBorrow = reactive<DialogOption>({
  visible: false,
  title: '订单审核'
});

//tab明细结构
const initOutFormData: OrderSaleDetailForm = {
  id: undefined,
  code: undefined,
  type: undefined,
  status: undefined,
  isTax: "0",
  accountUserId: undefined,
  accountUserName: undefined,
  remark: undefined,
  currency: undefined,
  quantity: undefined,
  price: undefined,
  discountPrice: undefined,
  totalPrice: undefined,
  accountOrderId: undefined,
  commodityInOutRecordId: undefined,
  ownerId: undefined,
  saleOrderBackId: undefined
}

const insertFormData = reactive<PageData<AccountOrderForm, AccountOrderQuery>>({
  form: { ...initOutFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: undefined,
    endTime: undefined,
    accountTime: undefined,
    supplierId: undefined,
    accountMonth: undefined,
    currency: undefined,
    code: undefined,
    remark: undefined,
    status: undefined,
    id: undefined,
    isTax: undefined,
  },
  rules: {
    customerId: [
      { required: true, message: "客户不能为空", trigger: "blur" }
    ],
    accountTime: [
      { required: true, message: "对账日期不能为空", trigger: "blur" }
    ],
    accountMonth: [
      { required: true, message: "对账月份不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "菲林单价不能为空", trigger: "blur" }
    ],
    isTax: [
      { required: true, message: "请选择对账单含税类型", trigger: "blur" }
    ],
    checkQuantity: [
      { required: true, message: "核对数量不能为空", trigger: "blur" }
    ],
    checkPrice: [
      { required: true, message: "核对单价不能为空", trigger: "blur" }
    ],
    discountPrice: [
      { required: true, message: "折扣金额不能为空", trigger: "blur" }
    ],
    totalPrice: [
      { required: true, message: "总金额不能为空", trigger: "blur" }
    ],

  }
});
//其他金额
const initOtherFormData: AccountOrderOtherForm = {
  index: undefined,
  id: undefined,
  type: "1",
  createByName: undefined,
  price: undefined,
  remark: undefined,
  accountOrderId: undefined,
  recordTime: undefined
}
const otherData = reactive<PageData<AccountOrderOtherForm, AccountOrderOtherQuery>>({
  form: { ...initOtherFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: undefined,
    price: undefined,
    accountOrderId: undefined,
    recordTime: undefined,
    params: {
    }
  },
  rules: {
    type: [
      { required: true, message: "金额类型不能为空", trigger: "change" }
    ],
    recordTime: [
      { required: true, message: "对账时间不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "金额不能为空", trigger: "blur" }
    ]
  }
});
const initOutFormDataB = {
  id: undefined,
  quantity: undefined,
  reason: undefined,
}
const backData = reactive<PageData<InOutRecordForm, InOutRecordQuery>>({
  form: { ...initOutFormDataB },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  },
  rules: {
  }
});
const rData = reactive<PageData<InOutRecordForm, InOutRecordQuery>>({
  form: { ...initOutFormDataB },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  },
  rules: {
  }
});

const accData = reactive<PageData<OrderFilinOutDetailForm, OrderFilinOutDetailQuery>>({
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
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "编码不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
    isTax: [
      { required: true, message: "是否含税不能为空", trigger: "change" }
    ],
    accountUserId: [
      { required: true, message: "对账人id不能为空", trigger: "blur" }
    ],
    accountUserName: [
      { required: true, message: "对账人名称不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    currency: [
      { required: true, message: "币种不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "单价不能为空", trigger: "blur" }
    ],
    discountPrice: [
      { required: true, message: "折扣金额不能为空", trigger: "blur" }
    ],
    totalPrice: [
      { required: true, message: "总金额不能为空", trigger: "blur" }
    ],
    accountOrderId: [
      { required: true, message: "对账单id不能为空", trigger: "blur" }
    ],
    feilinOrderId: [
      { required: true, message: "退货单、付货记录ID不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "单位ID不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams:accQueryParams, form:accForm, rules:accRules } = toRefs(accData);

const inOrOutLoading = ref(true);

const backTableRef = ref();
const deliverTableRef = ref();
const addTabFormRef = ref<ElFormInstance>();

const otherPriceTableRef = ref();
//头部按钮组
const tabRadioTable = ref('退货单');
const otherAmountBtn = ref(false);

//已选择记录
const saleDetailList = ref<OrderSaleDetailVO[]>([]);
//初始化编辑金额
const firstInitEditPrice = ref(true);
//编辑和查看详情选择的对账单
const currentAccountOrderId = ref(undefined);
const backList = ref<InOutRecordVO[]>([]);
const receiveList = ref<InOutRecordVO[]>([]);
const checkedOrderBackOutDetailList = ref<OrderSaleDetailVO[]>([]);
const checkedDeliverList = ref<OrderSaleDetailVO[]>([]);
//其他金额
const accountOrderOtherList = ref<AccountOrderOtherVO[]>([]);
//选中的其他金额
const selectedOrderOtherList = ref<AccountOrderOtherVO[]>([]);
const changeOrderList = ref([]) // 用于保存送货单数据.修改了数据之后,切换页码时,需要保留已经修改的值
const delPageChangeCheckList = ref([]) // 解决切换分页时，重置取消的勾选
const checkedDeliverListBgHeight = ref<OrderSaleDetailVO[]>([]);

const { queryParams: inOrOutQuery, form: outForm, rules: tabRules } = toRefs(insertFormData);
const { queryParams: otherQueryParams, form: otherForm, rules: otherRules } = toRefs(otherData);
const { queryParams: backQueryParams } = toRefs(backData);
const { queryParams: rQueryParams } = toRefs(rData);

const resetTab = async () => {
  firstInitEditPrice.value = true;

  outForm.value = { ...initOutFormData };
  backList.value = [];
  receiveList.value = [];
  checkedOrderBackOutDetailList.value = [];
  checkedDeliverList.value = [];
  accountOrderOtherList.value = [];
  selectedOrderOtherList.value = [];
  changeOrderList.value = [];
  delPageChangeCheckList.value = [];
  checkedDeliverListBgHeight.value = [];

  inOrOutQuery.value = new Object();
  inOrOutQuery.value.isTax = undefined;
  inOrOutQuery.value.accountTime = parseTime(new Date(), '{y}-{m}-{d} 23:59:59');
  addTabFormRef.value?.resetFields();
  tabRadioTable.value = "送货单";
  inOrOutLoading.value = false;

  let _backTabCache=backTableRef.value;
  let _deTabCache=deliverTableRef.value;
  if(_backTabCache){
    _backTabCache.xTableRef.clearCheckboxReserve();
    _backTabCache.xTableRef.clearCheckboxRow();
  }
  if(_deTabCache){
    _deTabCache.xTableRef.clearCheckboxReserve();
    _deTabCache.xTableRef.clearCheckboxRow();
  }

  backQueryParams.value = {
    pageNum: 1,
    pageSize: 10
  }
  rQueryParams.value = {
    pageNum: 1,
    pageSize: 10
  }
  otherQueryParams.value = {
    pageNum: 1,
    pageSize: 10
  }
}

/*对账单详情*/
const handleAccountDetail = async (row?: AccountOrderVO) => {
  await resetTab();
  tabRadioTable.value = "送货单";
  drawerBorrow.title = "对账单详情";
  drawerBorrow.visible = true;
  const _id = row?.id
  currentAccountOrderId.value = _id;
  const res = await getAccountOrder(_id);
  Object.assign(outForm.value, res.data);
  setQueryParams(res.data.id);
  inOrOutQuery.value.queryType = "1";
  rQueryParams.value.onlyAccountOrder = "1";
  backQueryParams.value.onlyAccountOrder = "1";
  await getAddListRecord();
  checkedDeliverListBgHeight.value = deepClone(checkedDeliverList.value)
  if(checkedDeliverListBgHeight.value&&checkedDeliverListBgHeight.value.length>0){
    checkedDeliverListBgHeight.value = checkedDeliverListBgHeight.value.concat(deepClone(checkedOrderBackOutDetailList.value))
  }else{
    checkedDeliverListBgHeight.value = deepClone(checkedOrderBackOutDetailList.value)
  }
}

const setQueryParams = (_id: any) => {
  inOrOutQuery.value.accountTime = outForm.value.accountTime;
  inOrOutQuery.value.endTime = outForm.value.endTime;
  inOrOutQuery.value.accountMonth = outForm.value.accountMonth;
  inOrOutQuery.value.customerId = outForm.value.customerId;
  inOrOutQuery.value.remark = outForm.value.remark;
  inOrOutQuery.value.currency = outForm.value.currency;
  inOrOutQuery.value.isTax = outForm.value.isTax;
  inOrOutQuery.value.id = _id;
}

/** 查询tab记录 */
const getAddListRecord = async () => {
  inOrOutLoading.value = true;
  console.log("inOrOutQuery.value", inOrOutQuery.value);
  console.log("rQueryParams.value", rQueryParams.value);
  console.log("backQueryParams.value", backQueryParams.value);
  backQueryParams.value = { ...inOrOutQuery.value,...backQueryParams.value }
  rQueryParams.value = {  ...inOrOutQuery.value,...rQueryParams.value }
  rQueryParams.value.customerId = inOrOutQuery.value.customerId;
  backQueryParams.value.customerId = inOrOutQuery.value.customerId;
  //查询类型为view
  if (inOrOutQuery.value.queryType == "1") {
    //清空queryParams,查询记录
    let detailQuery:OrderSaleDetailQuery={};
    //防止覆盖accountOrderId
    accQueryParams.value.accountOrderId = inOrOutQuery.value.id;
    rQueryParams.value.accountOrderId = inOrOutQuery.value.id;
    backQueryParams.value.accountOrderId = inOrOutQuery.value.id;
    currentAccountOrderId.value = inOrOutQuery.value.id;
    detailQuery = {
      // pageNum: 1,
      // pageSize: 10,
      accountOrderId: inOrOutQuery.value.id,
    };
    const saleDetail=await listOrderSaleDetail(detailQuery);

    saleDetailList.value = saleDetail.rows;
    console.log(" saleDetailList.value....", saleDetailList.value)
    setSaleDetailCheckedList();
    if (delPageChangeCheckList.value?.length) {
      checkedDeliverList.value = checkedDeliverList.value.filter((item: any) => delPageChangeCheckList.value.findIndex((fi: any) => fi.id == item.id) == -1)
    }
    console.log(" setSaleDetailCheckedList.value....", checkedDeliverList.value)
    otherQueryParams.value.accountOrderId = inOrOutQuery.value.id;
    listAccountOrderOther(otherQueryParams.value).then(res => {

      //编辑翻页，暂存其他金额
      if(!accountOrderOtherList.value||accountOrderOtherList.value.length==0){
        accountOrderOtherList.value = res.data;
      }
      if(!selectedOrderOtherList.value||selectedOrderOtherList.value.length==0){
        selectedOrderOtherList.value = JSON.parse(JSON.stringify(res.data));
      }
    });
    //审核不需要未对账数据
    if(drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')){
      backQueryParams.value.hasAccountOrder = "1";
      rQueryParams.value.hasAccountOrder = "1";
      rQueryParams.value.onlyAccountOrder = "1";
      backQueryParams.value.onlyAccountOrder = "1";
    }
  } else {
    backQueryParams.value.hasAccountOrder = "0";
    rQueryParams.value.hasAccountOrder = "0";
  }
  rQueryParams.value.deliveryTime = inOrOutQuery.value.accountTime ? inOrOutQuery.value.accountTime : undefined;
  backQueryParams.value.backTime = inOrOutQuery.value.accountTime ? inOrOutQuery.value.accountTime : undefined;
  console.log("do inOrOutQuery.value.isTax",inOrOutQuery.value.isTax);
  rQueryParams.value.isTax = inOrOutQuery.value.isTax ? inOrOutQuery.value.isTax : undefined;
  backQueryParams.value.isTax = inOrOutQuery.value.isTax ? inOrOutQuery.value.isTax : undefined;
  console.log("do select rQueryParams.value",rQueryParams.value);
  backQueryParams.value.remark=undefined;
  rQueryParams.value.remark=undefined;
  await Promise.all([
    //退货
    listOrderBack({...backQueryParams.value, accountOrderId: currentAccountOrderId.value})
      .then(res => {
        backList.value = res.rows;
        backTotal.value = res.total;
      }),
    //送货单
    accountList({...rQueryParams.value, accountOrderId: currentAccountOrderId.value})
      .then(res2 => {
        receiveList.value = res2.rows;
        deliveryTotal.value = res2.total;
      })
  ]);

  setSelectRowAccount(inOrOutQuery.value.queryType);
  //编辑状态下，判断不是首次初始化金额
  if(inOrOutQuery.value.queryType=="1"){
    firstInitEditPrice.value = false;
  }
  inOrOutLoading.value = false
}

const setSelectRowAccount = (queryType?: string) => {
  backList.value.forEach(item => {
    item.customerId = item.cusId;
    item.saleOrderBackId = item.rawOrderBackVoList[0].saleOrderBackId;
  })
  receiveList.value.map(item => {
    item.code = item.deliveryCode;
    item.saleOrderId = item.bizId;
    item.deliveryId = item.id;
  })
  console.log("checked", checkedOrderBackOutDetailList.value, checkedDeliverList.value)
  console.log("checked2", backList, receiveList)
  setPriceInfo();
  nextTick(() => {
    if (queryType == "1") {
      setCheckedListInfo();
    }
    setTimeout(() => {
      let f_checkedList = backList.value.filter(item => {
        return checkedOrderBackOutDetailList.value.some((item2: any) => item.saleOrderBackId == item2.saleOrderBackId);
      });
      backTableRef.value.xTableRef.setCheckboxRow(f_checkedList, true);
      let w_checkedList = receiveList.value.filter(item => {
        return checkedDeliverList.value.some((item2: any) => item.deliveryId == item2.deliveryId);
      });
      deliverTableRef.value.xTableRef.setCheckboxRow(w_checkedList, true);

      otherPriceTableRef.value.xTableRef.setCheckboxRow(selectedOrderOtherList.value, true);
      //refreshTabDataSet();
    }, 500);

  })
}

const setPriceInfo = () => {
  console.log("changeOrderList",changeOrderList.value)
  if (backList) {
    backList.value= backList.value.map((item) => {
      item.orderPrice = item.price ? item.price : 0;
      item.checkQuantity = item.quantity ? item.quantity : 0;
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id);
      if (crtM) {
        item.checkQuantity = crtM?.checkQuantity ? crtM.checkQuantity : 0;
        item.discountPrice = crtM?.discountPrice ? crtM.discountPrice : 0;
        item.checkRemark = crtM?.checkRemark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
      }
      const itemPrice: any = (item.orderPrice * 10000).toFixed(2);
      const itemQuantity: any = (item.checkQuantity * 10000).toFixed(2);
      let sum1 = (itemPrice * itemQuantity)/10000;
      item.totalPrice = Number(sum1) / 10000;
      return item
    });
  }
  if (receiveList) {
    receiveList.value.forEach((item, inx) => {
      item.checkPrice = item.orderPrice ? item.orderPrice : 0;
      item.checkQuantity = item.quantity ? item.quantity : 0;
      item.discountPrice = item?.discountPrice ? item.discountPrice : 0;
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id)
      if (crtM) {
        item.checkQuantity = crtM?.checkQuantity ? crtM.checkQuantity : 0;
        item.discountPrice = crtM?.discountPrice ? crtM.discountPrice : 0;
        item.checkRemark = crtM?.checkRemark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
      }
      const discountPrice2 =  (item.discountPrice * 10000).toFixed(2);
      const itemPrice = (item.checkPrice * 10000).toFixed(2);
      const itemQuantity = (item.checkQuantity * 10000).toFixed(2);
      let _otherCost:number =Number(item.mouldCost)+Number(item.testFrameCost)+Number(item.engineeringCost)
        +Number(item.flyProbeCost)+Number(item.sampleCost)+Number(item.expeditedCost)+Number(item.otherCost);
      _otherCost = (_otherCost*10000).toFixed(2);
      let amount:number = (itemPrice * itemQuantity) / 10000;
      amount=Number(amount)-Number(discountPrice2);
      if(_otherCost){
        amount=Number(amount)+Number(_otherCost);
      }
      item.totalPrice = amount/10000;
    });
  }
}

const setCheckedListInfo = () => {
  backList.value.map((item, inx) => {
    const detail: any = checkedOrderBackOutDetailList.value.find(itemA => itemA.saleOrderBackId == item.saleOrderBackId);
    if (detail) {
      backList.value[inx] = setListPriceInfo(item, detail);
    }
  });
  receiveList.value.map((item, inx) => {
    const detail: any = checkedDeliverList.value.find(itemA => itemA.deliveryId == item.deliveryId);
    if (detail) {
      receiveList.value[inx] = setListPriceInfo(item, detail);
    }
  });
  console.log("receiveList ....",receiveList.value)
  console.log("backList ....",backList.value);
  console.log("changeList ....",changeOrderList.value);
  //记住修改数值后重新计算一次总金额
  if(checkedDeliverList.value&&checkedDeliverList.value.length>0){
    checkedDeliverList.value.forEach((item, inx) => {
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id)
      if (crtM) {
        item.checkQuantity = crtM?.checkQuantity ? crtM.checkQuantity : 0;
        item.discountPrice = crtM?.discountPrice ? crtM.discountPrice : 0;
        item.totalPrice = crtM?.totalPrice ? crtM.totalPrice : 0;
        item.checkRemark = crtM?.checkRemark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
      }
    });
  }
  console.log("checkedDeliverList======== ....",checkedDeliverList.value);
  if(checkedOrderBackOutDetailList.value&&checkedOrderBackOutDetailList.value.length>0){
    checkedOrderBackOutDetailList.value.forEach((item, inx) => {
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id)
      if (crtM) {
        item.checkQuantity = crtM?.checkQuantity ? crtM.checkQuantity : 0;
        item.totalPrice = crtM?.totalPrice ? crtM.totalPrice : 0;
        item.checkRemark = crtM?.checkRemark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
      }
    });
  }

}

const setSaleDetailCheckedList = () => {
  if (saleDetailList.value&&saleDetailList.value.length>0) {
    let _backCheckList=saleDetailList.value.filter(item => item.type == SALETYPEENUM.SALE_BACK);
    _backCheckList=_backCheckList.map(cd=>{
      cd.saleDetailId=cd.id;
      cd.id=cd.saleOrderBackId;
      cd.checkPrice = cd.orderPrice;
      cd.checkQuantity = cd.quantity;
      return cd;
    })
    if(!checkedOrderBackOutDetailList.value||checkedOrderBackOutDetailList.value.length==0){
      checkedOrderBackOutDetailList.value =JSON.parse(JSON.stringify(_backCheckList));
    }
    //编辑状态下的缓存数据的price重新赋值，兼容新增单价逻辑
    let  _checkedDeliverList= saleDetailList.value.filter(item => item.type == SALETYPEENUM.SALE_DELIVER);
    _checkedDeliverList=_checkedDeliverList.map(cd=>{
      cd.saleDetailId=cd.id;
      cd.id=cd.deliveryId;
      cd.checkPrice = cd.orderPrice;
      cd.checkQuantity = cd.quantity;
      return cd;
    })
    if(!checkedDeliverList.value||checkedDeliverList.value.length==0){
      checkedDeliverList.value =JSON.parse(JSON.stringify(_checkedDeliverList));
    }
  }
}

const setListPriceInfo = (item: any, obj: any) => {
  if (!obj) {
    return;
  }
  console.log("setListPriceInfo", obj?.price);
  console.log("setListPriceInfo orderPrice", item.orderPrice);
  //编辑状态下的缓存数据的price重新赋值，兼容新增单价逻辑

  //item.orderPrice = item.orderPrice?item.orderPrice:obj?.price;
  item.orderPrice = obj?.price?obj?.price:item.orderPrice;
  //非编辑、或者第一次加载需要赋值
  if (inOrOutQuery.value.queryType  != "1" || !item?.unInitEditPrice ) {
    item.checkQuantity = obj?.quantity;
    item.discountPrice = obj?.discountPrice;
    item.checkRemark = obj?.remark;
    item.totalPrice = obj?.totalPrice?obj?.totalPrice:0;
  }
  return item;
}

/** 详情按钮操作 */
const handleDetail = async (row?: RepaymentRecordVO) => {
  reset();
  if(row.customerId){
    isCust.value = true;
  }else{
    isCust.value = false;
  }
  const _id = row?.id ;
  dialogTableLoading.value = true
  const res = await getRepaymentRecord(_id);
  Object.assign(form.value, res.data);
  isUpdate.value = true;
  isReadOnly.value = true;
  // confirmSelectList.value = res.data.invoiceVoList;
  const res2 = await getPaymentAccountList({paymentId: _id, onlyPayment:'1',});
  form.value.confirmSelectList = res2.rows;
  console.log(form.value)
  paymentTable.visible = true;
  paymentTable.title = "付款单详情";
  dialogTableLoading.value = false

}

/**审核弹窗按钮操作 */
const handleToExamine = async (row?: RepaymentRecordVO) => {
  reset();
  if(row.customerId){
    isCust.value = true;
  }else{
    isCust.value = false;
  }
  const _id = row?.id ;
  dialogTableLoading.value = true
  const res = await getRepaymentRecord(_id);
  Object.assign(form.value, res.data);
  isUpdate.value = true;
  // confirmSelectList.value = res.data.invoiceVoList;
  const res2 = await getPaymentAccountList({paymentId: _id, onlyPayment:'1',});
  form.value.confirmSelectList = res2.rows;
  paymentTable.visible = true;
  paymentTable.title = "付款审核";
  dialogTableLoading.value = false
}

/*重新修改*/
const reloadUpdate = async (row?: RepaymentRecordVO) => {
  ElMessageBox.confirm(
    '确认重新修改后，该付款单在对应账单中的核销金额将回退，并进入待提交状态，是否继续?',
    '提示',
    {
      confirmButtonText: '继续',
      cancelButtonText: '我再想想',
      type: 'warning',
    }
  )
    .then(() => {
      reUpdatePaymentAccount({id:row?.id}).then(res=>{
        if (res.code == 200) {
          ElMessage({
            type: 'success',
            message: '操作成功',
          })
        }
        getList()
      });

    })
}

/*详情*/
  const getDetail = async (id:any) =>{
    reset2();
    const _id = id ;
    dialogTableLoading.value = true
    const res = await getRepaymentRecord(_id);
    Object.assign(detailInfo.value, res.data);
    // isUpdate.value = true;
    // isReadOnly.value = true;
    // confirmSelectList.value = res.data.invoiceVoList;
    const res2 = await getPaymentAccountList({paymentId: _id, onlyPayment:'1',});
    detailInfo.value.confirmSelectList = res2.rows;
    paymentTableDetail.visible = true;
    paymentTableDetail.title = "预付款单详情";
    dialogTableLoading.value = false
  }

/** 提交按钮 */
const submitForm = () => {
  repaymentRecordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      //判断confirmSelectInventoryList.value是否为空
      // if (confirmSelectList.value.length == 0) {
      //   proxy?.$modal.msgError("请选择关联发票");
      //   return;
      // }
      //将confirmSelectInventoryList.value中的id赋值给inventoryIdList
      // form.value.invoiceIdList = confirmSelectList.value.map(item => item.id);
      // form.value.invoiceVoList=[];
      if(isCust.value){
        form.value.supplierId = undefined;
      }else{
        form.value.customerId = undefined;
      }
      buttonLoading.value = true;
      if (form.value.id) {
        await updateRepaymentRecord(form.value).finally(() =>  buttonLoading.value = false);
        proxy?.$modal.msgSuccess("修改成功");
      } else {
        form.value.status = "1";
        await addPaymentRecord(form.value).finally(() =>  buttonLoading.value = false);
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
  await proxy?.$modal.confirm('是否确认删除付款单号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delRepaymentRecord(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  paymentTable.visible = false;
  await getList();
}
const changeSup = async () => {
  const _recordList = await queryPayRecordListByCustSup({type:'1',supplierId:form.value.supplierId})
    recordList.value = _recordList.rows;
}
const changeCust = async () => {
  const _recordList = await queryPayRecordListByCustSup({type:'2',customerId:form.value.customerId})
    recordList.value = _recordList.rows;
}
//获取本厂作为客户
const getCustomerList = async () => {

  // const SupplierResponse: any = await listDept({deptName:'江西诺思特'});
  // customerList = SupplierResponse.data;
  // console.log(customerList)
  const SupplierResponse: any = await listCompany();
  customerList = SupplierResponse.data;
  console.log(customerList)


}


  /*** 导入参数 */
const upload = reactive<ImportOption>({
  // 是否显示弹出层
  open: false,
  // 弹出层标题
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  yearMonth:dayjs(new Date()).add(-1, 'month').format("YYYY-MM"),
  // 设置上传的请求头部
  headers: globalHeaders(),
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/financial/repaymentRecord/importPayData"
});
const uploadRef = ref<ElUploadInstance>();
  const tableData = [
  {
    seq: 1,
    name: '对账月份',
    remark: '不能为空，且符合格式yyyy/MM/dd。',
  },
  {
    seq: 2,
    name: '供应商代码',
    remark: '不能为空，且必须在ERP系统中已有。',
  },
]


/** 导入按钮操作 */
const handleImport = () => {
  upload.title = "导入付款历史数据";
  upload.open = true;
  uploadRef.value?.clearFiles();
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
  proxy?.$modal.closeLoading();
  getList();
};
/** 时间禁选*/
const disabledDate = (date:any) => {
  let today = new Date(dayjs(new Date()).add(-1, 'month').format("YYYY-MM"));
  today.setHours(0, 0, 0, 0);
  return new Date(date).getTime() > new Date(today).getTime();
}
/** 提交上传文件 */
function submitFileForm() {
  proxy?.$modal.loading("正在上传");
  uploadRef.value?.submit();
}
/**
 * 监听路由变化
 */
watch(() => route.query?.pendingParams, (newVal) => {
  if (newVal) {
    let decryptStr = decryptBase64ByStr(newVal)
    if (decryptStr && decryptStr != '{}' && (decryptStr == pendingParams.value)) return;
    pendingParams.value = decryptStr
    if (decryptStr && decryptStr != '{}') {
      const params = JSON.parse(decryptStr);
      queryParams.value.code = params.bizNo
    }
  }
}, {deep: true, immediate: true})
/**
 * 重新进入页面时
 */
onActivated(() => {
})

const payAccountList = ref();
const getAccountTableData = async () => {
  const bank = await listDeptBank();
  payAccountList.value =  deepClone( bank.data);
  if(payAccountList.value&&payAccountList.value.length>0){
    payAccountList.value.forEach(item=>{
      item.value=item.id;
    })
  }
  console.log("...............payAccountList.value",payAccountList.value);
}

onMounted(() => {
  getList();
  getSupplierList();
  getCustomerList();
  getAccountTableData();
});
</script>

<style lang="scss" scoped>
.no-selection th .el-checkbox {
  display: none;
}

:deep(.el-input__wrapper) {
  width: 100%;
}
</style>
