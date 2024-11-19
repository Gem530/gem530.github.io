<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card" v-if="checkPermi(['quality:AccountOrderSupDeduction:list'])">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-end">
          <el-col :span="1.5">
            <el-button v-hasPermi="['quality:AccountOrderSupDeduction:add']" type="primary" @click="handleAdd">新增供应商扣款</el-button>
            <el-button v-hasPermi="['quality:AccountOrderSupDeduction:export']" type="primary" @click="handleExport">导出</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              >导出</el-button>
          </el-col> -->
        </el-row>
      </template>
      <XTable
        border
        height="100%"
        ref="XTableRef"
        :loading="loading"
        :showRefresh="true"
        class="xtable-content"
        :columnList="columnList"
        :row-config="{ keyField: 'id' }"
        :sort-orders="sortCondition"
        :data="AccountOrderDeductionList"
        :checkbox-config="{ reserve: true }"
        :column-config="{ resizable: true }"
        :intervalCondition="intervalCondition"
        toolId="financialAccountOrderSupDeduction"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :page-params="{ perfect: true, total: total }"
        @searchChange="searchChange"
        @checkbox-all="selectChangeEvent"
        @checkbox-change="selectChangeEvent"
      >
        <template #default-type="scope">
          <div v-for="item in typeList">
            <span>{{ item.value == scope.row.type ? item.label : "" }}</span>
          </div>
        </template>
        <template #default-status="{ row }">
          <el-tag :type="row.status == '1' ? 'info' :
                row.status == '2' ? 'primary' :
                  row.status == '3' ? 'success' :
                    row.status == '4' ? 'danger' : 'success'">{{ statusList.find(v => v.value ==
            row.status)?.label }}</el-tag>
        </template>
        <template #default-make="scope">
          <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
          <el-button v-hasPermi="['quality:AccountOrderSupDeduction:edit']" link v-if="!scope.row.hasAccountOrder && ['1','4'].includes(String(scope.row.status))" type="primary" @click="handleUpdate(scope.row)">{{'编辑'}}</el-button>
          <el-button v-hasPermi="['quality:AccountOrderSupDeduction:audit']" link v-if="!scope.row.hasAccountOrder && scope.row.status == '2' " type="primary" @click="handleUpdate(scope.row)">{{'审核'}}</el-button>
          <el-button v-hasPermi="['quality:AccountOrderSupDeduction:reAudit']" link v-if="!scope.row.hasAccountOrder && scope.row.status == '3'" type="primary" @click="handleUpdate(scope.row)">{{'反审核'}}</el-button>
          <el-button v-hasPermi="['quality:AccountOrderSupDeduction:delete']" link v-if="!scope.row.hasAccountOrder && ['1','4'].includes(String(scope.row.status))" type="primary" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </XTable>
    </el-card>

    <el-dialog
      title="驳回提示"
      v-model="dialogSubmit.visible"
      width="30%"
      destroy-on-close
    >
      <el-form :model="form"  ref="AccountOrderDeductionFormRef" label-width="100px"  :rules="rules">
        <el-form-item label-width="0" prop="checkRemark">
        <el-input v-model="form.checkRemark" type="textarea" :rows="4" show-word-limit maxlength="200"
                  placeholder="请填写驳回理由"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center;margin-top: 10px">
        <el-button :loading="buttonLoading" @click="submitForm('6')" type="danger">我再想想</el-button>
        <el-button :loading="buttonLoading" @click="submitForm('3')" type="primary">确认驳回</el-button>
      </div>
    </el-dialog>


    <!-- 添加或修改财务扣款记录对话框 -->
    <el-drawer :title="dialog.title" @closed="cancel" v-model="dialog.visible" size="45%">
      <template #header="" v-if="form.status">
        <div>
          <span>{{dialog.title}}</span>
          <span style="margin-left: 4px">
            <el-tag :type="form.status == '1' ? 'info' :
                form.status == '2' ? 'primary' :
                  form.status == '3' ? 'success' :
                    form.status == '4' ? 'danger ' : 'success'">{{ statusList.find(v => v.value ==
              form.status)?.label }}</el-tag>
                   </span><br>

          <el-alert :closable="false" v-if="(form.checkRemark && form.checkRemark !== '' && form.status == '4')" type="error" style="margin-top: 4px" >
            <template #default>
              <div class="global-flex flex-start">
                <el-icon :size="20" style="margin-right: 4px">
                  <WarningFilled  />
                </el-icon>
                <span>{{ form.checkRemark}}</span>
              </div>
            </template>
          </el-alert>
        </div>
      </template>
      <el-collapse v-model="activeNames" v-loading="dialogLoading">
        <el-collapse-item title="基本信息" name="1">
          <el-form class="account-date-width" ref="AccountOrderDeductionFormRef" :model="form" :rules="rules" label-width="120px" :disabled="dialog.title?.includes('详情')">
            <el-row>

              <el-col :span="12" >
                <el-form-item label="选择供应商：" prop="supplierId">
                  <el-select
                    v-model="form.supplierId"
                    :disabled="dialog.title?.includes('编辑')"
                    placeholder="请选择供应商"
                    @change="setSupplierName"
                    clearable
                    filterable
                    transfer
                    style="width: 100%"
                    popup-class-name="pop-select"
                  >
                    <el-option v-for="item in dialog.title?.includes('新增') ? supplierList.filter((v)=> v.status=='1') : supplierList" :key="item.value" :label="item.label" :value="item.value">
                      <div style="display:flex;justify-content:flex-start;">
                        <span>{{ item.supplierCode }}</span>-
                        <span>{{ item.label }}</span>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="扣款时间：" prop="deductionTime">
                  <el-date-picker
                    clearable
                    type="datetime"
                    style="width: 100%"
                    placeholder="请选择扣款时间"
                    v-model="form.deductionTime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发出金额：" prop="price">
                  <el-input v-model="form.price" maxlength="13" :disabled="form.closedPrice">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="form.haveReturn == '1'" >
                <el-form-item label="结案金额："  prop="closedPrice">
                  <el-input v-model="form.closedPrice" maxlength="13">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关联订单：" prop="order">
                  <el-input v-model="form.saleOrderCode" readonly placeholder="请选择关联订单" @click="openOrder"
                            :disabled="!(form.type && (form.type == 1 ? form.customerId : form.supplierId))"
                  >
                    <template #suffix><img src="../../../assets/images/dialog-open-icon.svg"/></template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model="form.remark" :rows="3" maxlength="200" type="textarea" placeholder="备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

        </el-collapse-item>

        <el-collapse-item title="凭证信息" name="2">
          <div class="global-flex">
            <XUpload multiple v-model:model-value="form.preFileList" model="download" v-if="!dialog.title?.includes('详情')">
              <el-button type="primary" :disabled="dialog.title == '成本费用详情'">上传附件</el-button>
              <span style="color: #909399;margin-left:10px">支持批量上传，格式不限，每个文件大小在10mb以内</span>
            </XUpload>
          </div>
          <FileTable :data="form.sysFileList" makeWidth="160">
            <template #makeBtn="{row}">
              <el-button v-if="dialog.title != '供应商扣款详情'" link type="primary" @click="delFile(row)">删除</el-button>
            </template>
          </FileTable>
        </el-collapse-item>

      </el-collapse>
      <template #footer>
        <div class="global-flex flex-center" v-loading="dialogLoading">
          <template v-if="!viewStatus && (dialog.title == '新增供应商扣款' || ['2','3'].includes(String(form.status)))">
            <el-button style="width: 150px;" :loading="buttonLoading" @click="cancel">取消</el-button>
          </template>

<!--          <template v-if="!viewStatus && ['1','4'].includes(String(form.status))">-->
<!--            <el-button style="width: 150px;" type="danger" plain :loading="buttonLoading" @click="handleDelete(form)">删除</el-button>-->
<!--          </template>-->

          <template v-if="!viewStatus && ( dialog.title == '新增供应商扣款' || ['1','4'].includes(String(form.status)))">
            <el-button style="width: 150px;" :loading="buttonLoading" type="primary" @click="submitForm('1')">保存草稿</el-button>
            <el-button style="width: 150px;" :loading="buttonLoading" type="primary" @click="submitForm('2')">提交审核</el-button>
          </template>

          <template v-if="!viewStatus && form.status == '2'">
            <el-button style="width: 150px;" :loading="buttonLoading" type="primary" @click="submitForm('7')">审核驳回</el-button>
            <el-button style="width: 150px;" :loading="buttonLoading" type="primary" @click="submitForm('4')">审核通过</el-button>
          </template>
          <template v-if="!viewStatus && form.status == '3'">
            <el-button style="width: 150px; color: red !important;" :loading="buttonLoading" @click="submitForm('8')">反审核</el-button>
          </template>
          <template v-if="viewStatus">
            <el-button style="width: 150px;" :loading="buttonLoading" @click="cancel">关闭</el-button>
          </template>

        </div>
      </template>
    </el-drawer>

    <!-- 选择关联订单数据 -->
    <el-dialog :title="recordDialog.title" v-model="recordDialog.visible" width="60%" destroy-on-close>
      <el-row>
        <el-col :span="24" class="primary-color">
          *仅展示当前供应商近2个月的订单数据
        </el-col>
        <el-col :span="24">
          <XTable
            border
            height="400"
            :data="recordList"
            :loading="recordLoading"
            ref="customOrderTableRef"
            :columnList="recordColumnList"
            :column-config="{ resizable: true }"
            :checkbox-config="{checkStrictly: true}"
            v-model:page-size="queryOrderParams.pageSize"
            v-model:current-page="queryOrderParams.pageNum"
            :row-config="{ isCurrent: true, isHover: true }"
            :page-params="{ perfect: true, total: recordTotal }"
            @searchChange="recordSearchChange"
            @checkbox-change="selectRecordChange"
          >
          </XTable>
        </el-col>
      </el-row>
      <template #footer>
        <div class="global-flex flex-center">
          <el-button style="width: 150px;" @click="cancelOrder">取消</el-button>
          <el-button style="width: 150px;" type="primary" @click="confirmOrder">确认选择</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="AccountOrderSupDeduction" lang="ts">
import dayjs from 'dayjs'
import { Decimal } from 'decimal.js'
import { deepClone } from '@/utils'
import { getUserList, getQueryOrder, postListAccountOrderDeduction, getAccountOrderDeduction, delAccountOrderDeduction, addAccountOrderDeduction, updateAccountOrderDeduction,verifyStatus } from '@/api/financial/AccountOrderDeduction';
import { AccountOrderDeductionVO, AccountOrderDeductionQuery, AccountOrderDeductionForm } from '@/api/financial/AccountOrderDeduction/types';
import { VxeTableEvents, VxeTableInstance } from 'vxe-table'
import { listCustomer,getListCustomer } from '@/api/basedata/customer';
import { CustomerVO } from '@/api/basedata/customer/types';
import { listSupplier } from '@/api/basedata/supplier';
import { SupplierVO } from '@/api/basedata/supplier/types';
import { listUser } from '@/api/system/user';
import { BigNumber } from 'bignumber.js';
import {ElMessageBox} from "element-plus";
import {checkPermi} from "@/utils/permission";
import {ref} from "vue";
import { decryptBase64ByStr } from '@/utils/crypto'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const activeNames = ref(['1','2'])
const AccountOrderDeductionList = ref<AccountOrderDeductionVO[]>([]);
const recordList = ref<any[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const dialogLoading = ref(false)
const viewStatus = ref(false)
const recordLoading = ref(false)
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const recordTotal = ref(0);
const assignPrice = ref(0);
const customOrderTableRef = ref()
const queryFormRef = ref<ElFormInstance>();
const AccountOrderDeductionFormRef = ref<ElFormInstance>();
const tableRef = ref<VxeTableInstance<any>>();
const checkedOrderDeductionId = ref<any>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const recordDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const recordInfo = ref()


// 删除文件
const delFile = (row: any) => {
  // console.log(row)
  form.value.sysFileList = form.value.sysFileList.filter((f: any) => f.key != row.key)
}

const initFormData: AccountOrderDeductionForm = {
  id: undefined,
  price: undefined,
  remark: undefined,
  deductionTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
  assignedPrice: undefined,
  customerId: undefined,
  customerName: undefined,
  supplierId: undefined,
  ownerId: undefined,
  supplierName: undefined,
  isAssignFinish: undefined,
  code: undefined,
  haveReturn: undefined,
  closedPrice: undefined,
  customerCode: undefined,
  supplierCode: undefined,
  sysFileList: [],
  preFileList: [],
  type: "1"
}
const route = useRoute();
/**
 * 进入页面次数
 */
const isFirst = ref(0)
/**
 * 待办跳转参数
 */
const pendingParams = ref()

// 0+正数且小数点后最多2位校验
const closedPriceDecimalsHandle = (rule: any, value: any, callback: any) => {
  // callback(twoPositiveNumberWithTwoDecimals(value))
  if (!value) {
    callback(new Error('请输入结案金额'))
  } else if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)) {
    callback(new Error('金额大于0，保留两位小数'))
  } else if (value == 0  || value == '') {
    callback(new Error('金额大于0，保留两位小数'))
  } else {
    callback()
  }

}

// 0+正数且小数点后最多2位校验
const twoPositiveNumberWithTwoDecimalsHandle = (rule: any, value: any, callback: any) => {
  // callback(twoPositiveNumberWithTwoDecimals(value))
  if (!value) {
    callback(new Error('请输入发出金额'))
  } else if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)) {
    callback(new Error('金额大于0，保留两位小数'))
  } else if (value == 0) {
    callback(new Error('金额大于0，保留两位小数'))
  } else {
    callback()
  }
}
const data = reactive<PageData<any, any>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    price: undefined,
    deductionTime: undefined,
    assignedPrice: undefined,
    customerId: undefined,
    customerName: undefined,
    supplierId: undefined,
    ownerId: undefined,
    supplierName: undefined,
    isAssignFinish: undefined,
    type: undefined,
    code: undefined,
    customerCode: undefined,
    supplierCode: undefined,
    params: {
    }
  },
  rules: {
    type: [
      { required: true, message: "请选择扣款类型", trigger: "change" }
    ],
    price: [
      { required: true, validator: twoPositiveNumberWithTwoDecimalsHandle, trigger: 'blur' }
    ],
    checkRemark: [
      { required: true, message: "驳回理由不能为空", trigger: "blur" }
    ],
    closedPrice: [
      { required: true, validator: closedPriceDecimalsHandle, trigger: 'blur' }
    ],
    deductionTime: [
      { required: true, message: "扣款时间不能为空", trigger: "change" }
    ],
    supplierId: [
      { required: true, message: "供应商名称不能为空", trigger: "blur" }
    ]
  }
});

const initQueryOrder = {
  pageNum: 1,
  pageSize: 20,
  supplierId: undefined, // 供应商ID type为2是必填
  type: "1", // 类型（2：供应商、1：客户）
  // saleOrderCode: undefined, // 销售订单编码
  // commodityName: undefined, // 产品名称
  // commodityCode: undefined, // 产品编码
  customerId: undefined, // 客户ID type为1是必填
}
const queryOrderParams = ref(deepClone(initQueryOrder));

const XTableRef = ref()
const validXTableRef = ref()
const typeList = ref([
  { label: '客户扣款', value: "1" },
  { label: '供应商扣款', value: "2" },
]);
const statusList = ref([
  { label: '待提交', value: "1" },
  { label: '待审核', value: "2" },
  { label: '已通过', value: "3" },
  { label: '已驳回', value: "4" },
]);
const assignTypeList = ref([
  { label: '责任在供应商', value: "2" },
  { label: '责任在本厂', value: "3" },
]);
// 责任人列表
const sysUserList = ref<any[]>([])

const customerCodeList = ref();
const customerNameList = ref();

const responsibilityData = ref<any[]>([])
const responsibilityColumnList = ref([
  { title: '责任人', field: 'userId', align: 'center' },
  { title: '责任金额(元)', field: 'price', align: 'center' },
  { title: '操作', width: '80', field: 'make', align: 'center' },
])
const validRules = ref({
  userId: [{ required: true, message: '请选择责任人' }],
  price: [{
    validator ({ cellValue }: any) {
      if (!cellValue) {
        return new Error('请输入责任金额')
      } if (Number(cellValue) <= 0) {
        return new Error('责任金额不可小于0')
      }
    }
  }],
})

const sortCondition = ['price', 'closedPrice',];
const intervalCondition = ['price', 'closedPrice','deductionTime', 'createTime', 'auditTime']
const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  {
    title: '单据状态', width: '80', field: 'status', align: 'center', filterType: 'checkboxButton',
    filterParam: {placeholder: '请输入合同状态'}, filterData: () => statusList.value
  },
  { title: '扣款单号', width: '160', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入扣款单号' } },
  // { title: '扣款类型', width: '80', field: 'type', align: 'center', filterType: 'radio', filterParam: { placeholder: '请选择扣款类型' }, filterData: () => typeList.value },
  { title: '供应商名称', width: '160', field: 'ownerName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
  { title: '发出金额(元)', width: '130', field: 'price', align: 'center', sortable: true ,filterType: 'intervalNumber'},
  { title: '结案金额(元)', width: '130', field: 'closedPrice', align: 'center', sortable: true ,filterType: 'intervalNumber'},
  { title: '扣款时间', width: '130', field: 'deductionTime', align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      endParams: { type: 'datetime', placeholder: '请选择结束时间', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      startParams: { type: 'datetime', placeholder: '请选择开始时间', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  { title: '关联订单', width: '160', field: 'saleOrderCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入关联订单' } },
  { title: '关联对账单', width: '160', field: 'accountOrderCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入关联对账单' } },
  { title: '备注', field: 'remark', minWidth: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入备注' } },
  { title: '创建人', width: '80', field: 'createByName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入创建人' } },
  { title: '创建时间', field: 'createTime', width:'130', align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      endParams: { type: 'datetime', placeholder: '请选择结束时间', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      startParams: { type: 'datetime', placeholder: '请选择开始时间', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  { title: '审核人', width: '80', field: 'auditUserName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入审核人' } },
  { title: '审核时间', field: 'auditTime', width:'130', align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      endParams: { type: 'datetime', placeholder: '请选择结束时间', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      startParams: { type: 'datetime', placeholder: '请选择开始时间', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', showOverflow: false },
]);

const recordColumnList = ref([
  { title: "", type: 'checkbox', align: 'center', width: '60' },
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '订单号', width: '150', field: 'saleOrderCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入订单号' } },
  { title: '产品编码', width: '150', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品编码' } },
  { title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品名称' } },
]);
const customerList = ref<any[]>([]);
const supplierList = ref<any[]>([]);
const userList = ref<any[]>([]);

const checkedAccountOrderDeductionList = ref<AccountOrderDeductionVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

const selectChangeEvent: VxeTableEvents.CheckboxAll<AccountOrderDeductionVO> = () => {
  const tableRef = XTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    checkedAccountOrderDeductionList.value = selectRecords.map((item: any) => item);
  }
}
const setCustomerName = (val: any) => {
  const customer = customerList.value.find(item => item.value == val);
  form.value.customerName = customer?.label;
}
const setSupplierName = (val: any) => {
  const supplier = supplierList.value.find(item => item.value == val);
  form.value.supplierName = supplier?.label;
}
// 获取责任人列表
const getUserListList = () => {
  getUserList().then((res) => {
    if (res.code == 200) {
      sysUserList.value = res.data || []
    }
  })
}
// 获取 搜索条件
const searchChange = (param: any) => {
  queryParams.value = param
  if (param.sorts && param.sorts.length > 0) {
    param.sorts.forEach((item : any) => {
      queryParams.value.orderByColumn = item.prop;
      queryParams.value.isAsc = item.order;
    })
  }
  getList()
}
// 清除初始化已有的搜索条件
const initSearch = (params: any) => {
  // const newKeyArr = Object.keys(params)
  const initKeyArr = Object.keys(initQueryOrder)
  for (let key in queryOrderParams.value) {
    if (!initKeyArr.includes(key)) {
      queryOrderParams.value[key] = undefined
    }
  }
  Object.assign(queryOrderParams.value, params)
  // console.log(initKeyArr)
}
const recordSearchChange = async (params: any) => {
  initSearch(params)
  // queryOrderParams.value = params
  // queryOrderParams.value.accountOrderDeductionId = checkedOrderDeductionId.value;
  console.log(queryOrderParams.value);
  await getRecordList();
  if (recordInfo.value?.id) {
    nextTick(() => {
      const crtRecord = recordList.value.find((f: any) => f.id == recordInfo.value.id)
      selectRecordChange({ row: crtRecord, checked: true })
    })
  }
}
/** 查询财务扣款记录列表 */
const getList = async () => {
  loading.value = true;
  if (queryParams.value.status) {
    queryParams.value.statusList = queryParams.value.status;
  }
  queryParams.value.status = undefined;
  queryParams.value.type = '2';
  const res = await postListAccountOrderDeduction(queryParams.value);
  AccountOrderDeductionList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
// 获取 客户/供应商 关联订单
const getRecordList = async () => {
  recordLoading.value = true
  const res = await getQueryOrder(queryOrderParams.value).finally(() => recordLoading.value = false);
  recordList.value = res.rows || [];
  recordTotal.value = res.total;
}
/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
  viewStatus.value = false;
}
/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  recordInfo.value = undefined
  responsibilityData.value = []
  AccountOrderDeductionFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: AccountOrderDeductionVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "新增供应商扣款";
  form.value.type = '2';
}
// 查看按钮操作
const handleDetail = async (row?: any) => {
  reset();
  const _id = row?.id || ids.value[0]
  dialog.visible = true;
  dialog.title = "供应商扣款详情";
  dialogLoading.value = true
  viewStatus.value = true
  const res = await getAccountOrderDeduction(_id).finally(() => dialogLoading.value = false);
  form.value = res.data
  responsibilityData.value = form.value?.deductionDutyList || []
}
/** 修改按钮操作 */
const handleUpdate = async (row?: any) => {
  //校验是否有分配记录
  //验证订单是否能确认
  let hasUpdate = await verifyStatus({id:row.id});
  if (!hasUpdate.data) {
    ElMessage.error("数据状态已变更，请刷新页面后重试");
    //刷新列表
    getList();
    return;
  }


  reset();
  const _id = row?.id || ids.value[0]
  dialog.visible = true;
  if(row.status == '1' || row.status == '4'){
    dialog.title = "编辑品质扣款";
  }else{
    dialog.title = "供应商扣款详情";
  }
  dialogLoading.value = true
  const res = await getAccountOrderDeduction(_id).finally(() => dialogLoading.value = false);
  form.value = res.data
  responsibilityData.value = form.value?.deductionDutyList || []
}

const dialogSubmit = reactive<DialogOption>({
  visible: false,
  title: ''
});

/** 提交按钮 */
const submitForm = (opType : any) => {
  if (opType == '7'){
    form.value.checkRemark = ''
    dialogSubmit.visible = true;
  }else if (opType == '6'){
    dialogSubmit.visible = false;
  } else if (opType == '8'){
    ElMessageBox.confirm(
      '启动反审核后，该单据会重新进入“待提交”状态，相关的扣款金额也将撤回，是否继续？',
      '提示:',
      {
        confirmButtonText: '确认继续',
        cancelButtonText: '我再想想',
        type: 'warning',
      }
    ).then(()=>{
      submitForm('5')
    });
  } else {
    if (opType == '3'){
      AccountOrderDeductionFormRef.value?.validate(async (valid: boolean) => {
          if (valid) {
            dialogSubmit.visible = false;
          }else{
            return;
          }
        }
      );
    }
    AccountOrderDeductionFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        dialogSubmit.visible = false;
        let params = deepClone(form.value)
        params.opType = opType
        if (params?.preFileList?.length) {
          params.sysFileList = [...params.sysFileList, ...params.preFileList]
          delete params.preFileList
        }
        // responsibilityData
        if (params.type == 1) {
          // 客户扣款，不需要传供应商id
          params.supplierId = undefined
          // 只有客户时，才有责任人表格
          const errMap = await validXTableRef.value.xTableRef.fullValidate(true)
          if (errMap) return;
          if (responsibilityData.value?.length) {
            params.deductionDutyList = responsibilityData.value.map((m: any) => {
              return {
                id: m?.id || undefined,
                price: m.price,
                userId: m.userId,
              }
            })
            // let tempDutyPrice = 0
            // if (params.deductionDutyList.length > 1) {
            //   // tempDutyPrice = params.deductionDutyList.reduce((prev: any, next: any) => Number(prev.price) + Number(next.price))
            //   tempDutyPrice = params.deductionDutyList.reduce((prev: any, next: any) => new Decimal(Number(prev.price || 0)).add(new Decimal(Number(next.price || 0))))
            // } else {
            //   tempDutyPrice = params.deductionDutyList[0].price
            // }
            // // console.log(tempDutyPrice, params.price)
            // if (tempDutyPrice > params.price) {
            //   proxy?.$modal.msgError('责任金额之和不能大于扣款金额')
            //   return
            // }
          }
        } else {
          // 供应商扣款，不需要传客户id
          params.customerId = undefined
        }

        buttonLoading.value = true;
        if (params.id) {
          await updateAccountOrderDeduction(params).finally(() => buttonLoading.value = false);
        } else {
          // // 新增时，已分配金额默认为0
          // params.assignedPrice = 0;
          // // 新增时，是否分配完成默认为未完成 1否2是
          // params.isAssignFinish = '1';
          await addAccountOrderDeduction(params).finally(() => buttonLoading.value = false);
        }
        proxy?.$modal.msgSuccess("操作成功");
        dialog.visible = false;
        await getList();

        viewStatus.value = false;
      }
    });
  }
}

/** 删除按钮操作 */
const handleDelete = async (row?: any) => {
  //验证订单是否能确认
  let hasUpdate = await verifyStatus({id:row.id});
  if (!hasUpdate.data) {
    ElMessage.error("数据状态已变更，请刷新页面后重试");
    //刷新列表
    getList();
    return;
  }
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除财务扣款记录编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delAccountOrderDeduction(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  dialog.visible = false;
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  if (
    queryParams.value.statusList === undefined &&
    queryParams.value.code === undefined &&
    queryParams.value.ownerName === undefined &&
    queryParams.value.priceStart === undefined &&
    queryParams.value.priceEnd === undefined &&
    queryParams.value.closedPriceStart === undefined &&
    queryParams.value.closedPriceEnd   === undefined &&
    queryParams.value.deductionTimeStart === undefined &&
    queryParams.value.deductionTimeEnd   === undefined &&
    queryParams.value.saleOrderCode   === undefined &&
    queryParams.value.accountOrderCode === undefined &&
    queryParams.value.remark   === undefined &&
    queryParams.value.createByName === undefined &&
    queryParams.value.auditUserName === undefined &&
    queryParams.value.auditTimeStart === undefined &&
    queryParams.value.auditTimeEnd   === undefined &&
    queryParams.value.createTimeStart === undefined &&
    queryParams.value.createTimeEnd   === undefined
  ){
    ElMessageBox.confirm(
      '未选择任何筛选条件，系统将按照创建时间导出近30天的数据',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(
      // 设置createTimeStart为上个月和今天同日的时间00:00:00
      () => {
        queryParams.value.isThirty = true;
        exportList();
      })
  }else{
    exportList();
  }
}


// 辅助函数：将 Date 对象格式化为 "yyyyMMdd" 格式
function formatDate(date : any) {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份是从 0 开始的，所以需要 +1
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}${month}${day}`;
}

const exportList = () =>{
  proxy?.download('financial/AccountOrderDeduction/export', {
    ...queryParams.value, tableName: 'financialAccountOrderSupDeduction'
  }, `供应商扣款记录_${formatDate(new Date())}.xlsx`);
}

const setSupplierList = async () => {
  // queryParams.value.pageSize=1000;
  const res: any = await listSupplier();
  supplierList.value = res.rows.map((item: SupplierVO) => {
    return {
      label: item.supplierName,
      value: item.id,
      ...item
    }
  })
}


const getListCust = async() => {
  const custRes = await getListCustomer();
  const resCust = custRes.data;
  if(resCust){
    customerCodeList.value = resCust.map(item=>{
      return {
        value:item.id,
        label:item.customerCode
      }
    });
    customerNameList.value = resCust.map(item=>{
      return {
        value:item.id,
        label:item.customerName
      }
    });
  }

}

// 打开关联订单
const openOrder = async () => {
  // console.log(form.value)
  recordDialog.visible = true
  recordDialog.title = '关联订单'
  queryOrderParams.value = deepClone(initQueryOrder)
  queryOrderParams.value.type = form.value.type
  if (queryOrderParams.value.type == 1) {
    queryOrderParams.value.customerId = form.value.customerId
  } else {
    queryOrderParams.value.supplierId = form.value.supplierId
  }
  await getRecordList()
  if (form.value?.saleOrderId) {
    nextTick(() => {
      const crtRecord = recordList.value.find((f: any) => f.id == form.value.saleOrderId)
      selectRecordChange({ row: crtRecord, checked: true })
    })
  }
}
const cancelOrder = () => {
  recordDialog.visible = false
}
const confirmOrder = () => {
  console.log(recordInfo.value)
  form.value.saleOrderId = recordInfo.value?.id || undefined
  form.value.saleOrderCode = recordInfo.value?.saleOrderCode || undefined
  recordDialog.visible = false
}
const selectRecordChange = ({row,checked}: any) => {
  const $table = customOrderTableRef.value.xTableRef
  if ($table) {
    $table.clearCheckboxRow()
    $table.setCheckboxRow(row,checked)
    if (checked) {
      recordInfo.value = row
    } else {
      recordInfo.value = undefined
    }
  }
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
      let tempColumnList = [{field: 'code', defaultValue: params.bizNo}]
      queryParams.value.code = params.bizNo
      setTimeout(() => {
        XTableRef.value.filterFieldEvent(tempColumnList)
      }, 100)
    }
  }
}, {deep: true, immediate: true})
/**
 * 重新进入页面时
 */
onActivated(() => {
})
onMounted(() => {
    getList();
    getListCust();
    setSupplierList();
    getUserListList();
});
</script>
<style lang="scss" scoped>
.labelTip {
  color: #adb2b7;
  font-size: 12px;
  width: 100%;
}
</style>
