<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card"  v-if="checkPermi(['administrative:Incentive:list'])">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-end">
          <el-col :span="1.5">
            <el-button v-hasPermi="['administrative:Incentive:add']" type="primary" @click="handleAdd">新增奖惩单</el-button>
            <el-button v-hasPermi="['administrative:Incentive:export']" type="primary" @click="handleExport">导出</el-button>
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
        :data="administrativeIncentiveList"
        :checkbox-config="{ reserve: true }"
        :column-config="{ resizable: true }"
        :intervalCondition="intervalCondition"
        toolId="administrativeIncentive"
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
        <template #default-confirmStatus="scope">
          <div v-for="item in confirmStatusList">
            <span>{{ item.value == scope.row.confirmStatus ? item.label : "" }}</span>
          </div>
        </template>
        <template #default-sourceType="scope">
          <div v-for="item in sourceTypeList">
            <span>{{ item.value == scope.row.sourceType ? item.label : "" }}</span>
          </div>
        </template>
        <template #default-project="scope">
          <div v-if="scope.row.type == '1' " v-for="item in resDictData.reward_project">
            <span>{{ item.dictValue == scope.row.project ? item.dictLabel : "" }}</span>
          </div>
          <div v-if="scope.row.type == '2' " v-for="item in resDictData.punish_project">
            <span>{{ item.dictValue == scope.row.project ? item.dictLabel : "" }}</span>
          </div>
        </template>
        <template #default-make="scope">
          <el-button v-hasPermi="['administrative:Incentive:confirm']" link v-if="scope.row.confirmStatus == '1'" type="primary" @click="handleConfirm(scope.row)">确认</el-button>
          <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
<!--          <el-button link v-if="!scope.row.hasAccountOrder" type="primary" @click="handleUpdate(scope.row)">{{scope.row.status == '1' || scope.row.status == '4'  ? '编辑' :scope.row.status == '2' ? '审核' : scope.row.status == '3' ? '反审核' : ''}}</el-button>-->
          <el-button v-hasPermi="['administrative:Incentive:edit']" link v-if="['1','4'].includes(String(scope.row.status))" type="primary" @click="handleUpdate(scope.row)">{{'编辑'}}</el-button>
          <el-button v-hasPermi="['administrative:Incentive:audit']" link v-if="scope.row.status == '2' " type="primary" @click="handleUpdate(scope.row)">{{'审核'}}</el-button>
          <el-button v-hasPermi="['administrative:Incentive:reAudit']" link v-if="scope.row.status == '3' && scope.row.sourceType == '1'" type="primary" @click="handleUpdate(scope.row)">{{'反审核'}}</el-button>
          <el-button v-hasPermi="['administrative:Incentive:delete']" link v-if="['1','4'].includes(String(scope.row.status))" type="primary" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </XTable>
    </el-card>

    <el-dialog
      title="驳回提示"
      v-model="dialogSubmit.visible"
      width="30%"
      destroy-on-close
    >
      <el-form :model="form" ref="AccountOrderDeductionFormRef" label-width="100px"   :rules="rules">
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

    <!-- 添加或修改奖惩单记录对话框 -->
    <el-drawer :title="dialog.title" @closed="cancel" v-model="dialog.visible" size="60%">
      <template #header="" v-if="form.status">
        <div>
          <span>{{dialog.title}}</span>
          <span style="margin-left: 4px">
            <el-tag :type="form.status == '1' ? 'info' :
                form.status == '2' ? 'primary' :
                  form.status == '3' ? 'success' :
                    form.status == '4' ? 'danger' : 'success'">{{ statusList.find(v => v.value ==
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

              <el-col :span="8">
                <el-form-item label="奖惩员工：" prop="userId">
                  <el-select
                    v-model="form.userId"
                    :disabled="dialog.title?.includes('编辑')"
                    placeholder="请选择员工"
                    @change="setDeptName"
                    clearable
                    filterable
                    transfer
                    style="width: 100%"
                    popup-class-name="pop-select"
                  >
                    <el-option v-for="item in sysUserList" :key="item.userId" :label="item.nickName" :value="item.userId">

                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="所属部门">
                  <el-input v-model="form.deptName" disabled  maxlength="200" />
                </el-form-item>
              </el-col>


              <el-col :span="8">
                <el-form-item label="奖惩类型：" prop="type">
                  <el-select
                    v-model="form.type"
                    placeholder="请选择类型"
                    clearable
                    filterable
                    transfer
                    style="width: 100%"
                    @change="changeType"
                    popup-class-name="pop-select"
                  >
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">

                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>


              <el-col :span="8">
                <el-form-item label="奖惩项目：" prop="project">
                  <el-select
                    v-model="form.project"
                    placeholder="请选择项目"
                    clearable
                    filterable
                    transfer
                    style="width: 100%"
                    popup-class-name="pop-select"
                  >
                    <el-option v-if="form.type == '1'" v-for="item in resDictData.reward_project" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                    </el-option>
                    <el-option v-if="form.type == '2' && (!form.sourceType ||  form.sourceType != '2')" v-for="item in resDictData.punish_insert_project" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                    </el-option>
                    <el-option v-if="form.type == '2' && form.sourceType && form.sourceType == '2'" v-for="item in resDictData.punish_project" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                    </el-option>
                  </el-select>
                </el-form-item>

              </el-col>
              <el-col :span="8">
                <el-form-item label="奖惩金额：" prop="price">
                  <el-input v-model="form.price" maxlength="13">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="奖惩日期：" prop="incentiveTime">
                  <el-date-picker
                    clearable
                    type="date"
                    style="width: 100%"
                    :disabled-date="(time) => {
                        // 计算两个月前的日期
                        const twoMonthsAgo = new Date();
                        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
                        // 禁用两个月前的日期
                        return time.getTime() < twoMonthsAgo.getTime() || time.getTime() > new Date();
                    }"
                    placeholder="请选择扣款时间"
                    v-model="form.incentiveTime"
                    value-format="YYYY-MM-DD"
                    :disabled="dialog.title?.includes('编辑')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="form.haveReturn" >
                <el-form-item label="结案金额：" >
                  <el-input v-model="form.closedPrice" maxlength="13" :disabled="true">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8" v-if="dialog.title?.includes('详情')">
                <el-form-item label="申请人">
                  <el-input v-model="form.createByName" disabled/>
                </el-form-item>
              </el-col>

              <el-col :span="8" v-if="dialog.title?.includes('详情')">
                <el-form-item label="申请时间">
                  <el-input v-model="form.createTime" disabled/>
                </el-form-item>
              </el-col>

              <el-col :span="8" v-if="dialog.title?.includes('详情')">
                <el-form-item label="数据来源">
                  <el-select
                    v-model="form.sourceType"
                    placeholder="请选择类型"
                    clearable
                    filterable
                    transfer
                    style="width: 100%"
                    popup-class-name="pop-select"
                  >
                    <el-option v-for="item in sourceTypeList" :key="item.value" :label="item.label" :value="item.value">

                    </el-option>
                  </el-select>
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
              <el-button v-if="dialog.title != '奖惩单详情'" link type="primary" @click="delFile(row)">删除</el-button>
            </template>
          </FileTable>
        </el-collapse-item>

      </el-collapse>
      <template #footer>
        <div class="global-flex flex-center" v-loading="dialogLoading">
          <template v-if="!viewStatus && (dialog.title == '新增奖惩单' || ['2','3'].includes(String(form.status)))">
            <el-button style="width: 150px;" :loading="buttonLoading" @click="cancel">取消</el-button>
          </template>

<!--          <template v-if="!viewStatus && ['1','4'].includes(String(form.status))">-->
<!--            <el-button style="width: 150px;" type="danger" plain :loading="buttonLoading" @click="handleDelete(form)">删除</el-button>-->
<!--          </template>-->

          <template v-if="!viewStatus &&  (dialog.title == '新增奖惩单' || ['1','4'].includes(String(form.status)))">
            <el-button style="width: 150px;" :loading="buttonLoading" type="primary" @click="submitForm('1')">保存草稿</el-button>
            <el-button style="width: 150px;" :loading="buttonLoading" type="primary" @click="submitForm('2')">提交审核</el-button>
          </template>

          <template v-if="!viewStatus && form.status == '2'">
            <el-button style="width: 150px;" :loading="buttonLoading" type="primary" @click="submitForm('7')">审核驳回</el-button>
            <el-button style="width: 150px;" :loading="buttonLoading" type="primary" @click="submitForm('4')">审核通过</el-button>
          </template>
          <template v-if="!viewStatus && form.status == '3'">
            <el-button style="width: 150px; color: red !important;"  :loading="buttonLoading" @click="submitForm('8')">反审核</el-button>
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
          *仅展示当前{{form.type === '1' ? '客户' : '供应商'}}近2个月的订单数据
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

<script setup name="Incentive" lang="ts">
import dayjs from 'dayjs'
import { Decimal } from 'decimal.js'
import { deepClone } from '@/utils'
import { getUserList, getQueryOrder,verifyStatus } from '@/api/financial/AccountOrderDeduction';
import { VxeTableEvents, VxeTableInstance } from 'vxe-table'
import { getListCustomer } from '@/api/basedata/customer';
import { CustomerVO } from '@/api/basedata/customer/types';
import {getDicts} from "@/api/system/dict/data";
import {sortBy} from "@/utils/dict";
import {addIncentive, delIncentive, getIncentive, listIncentive, updateIncentive} from "@/api/basedata/incentive";
import {ElMessageBox} from "element-plus";
import {checkPermi} from "@/utils/permission";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const activeNames = ref(['1','2','3'])
const administrativeIncentiveList = ref<any>([]);
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
const customOrderTableRef = ref()
const queryFormRef = ref<ElFormInstance>();
const AccountOrderDeductionFormRef = ref<ElFormInstance>();
const tableRef = ref<VxeTableInstance>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const dialogSubmit = reactive<DialogOption>({
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

const initFormData: any = {
  id: undefined,
  price: undefined,
  remark: undefined,
  incentiveTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
  assignedPrice: undefined,
  userId: undefined,
  deptName: undefined,
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

// 0+正数且小数点后最多2位校验
const twoPositiveNumberWithTwoDecimalsHandle = (rule: any, value: any, callback: any) => {
  // callback(twoPositiveNumberWithTwoDecimals(value))
  if (!value) {
    callback(new Error('请输入奖惩金额'))
  } else if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)) {
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
    incentiveTime: undefined,
    assignedPrice: undefined,
    userId: undefined,
    deptName: undefined,
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
      { required: true, message: "请选择奖惩类型", trigger: "change" }
    ],
    project: [
      { required: true, message: "请选择奖惩项目", trigger: "blur" }
    ],
    checkRemark: [
      { required: true, message: "驳回理由不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, validator: twoPositiveNumberWithTwoDecimalsHandle, trigger: 'blur' }
    ],
    incentiveTime: [
      { required: true, message: "奖惩日期不能为空", trigger: "change" }
    ],
    userId: [
      { required: true, message: "奖惩员工不能为空", trigger: "change" }
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
  userId: undefined, // 客户ID type为1是必填
}
const queryOrderParams = ref(deepClone(initQueryOrder));

const XTableRef = ref()
const validXTableRef = ref()
const statusList = ref([
  { label: '待提交', value: "1" },
  { label: '待审核', value: "2" },
  { label: '已通过', value: "3" },
  { label: '已驳回', value: "4" },
]);
const confirmStatusList = ref([
  { label: '未确认', value: "1" },
  { label: '已确认', value: "3" },
]);
const typeList = ref([
  { label: '奖励', value: "1" },
  { label: '惩罚', value: "2" },
]);
const sourceTypeList = ref([
  { label: '手动新增', value: "1" },
  { label: '品质扣款', value: "2" },
]);

// 责任人列表
const sysUserList = ref<any[]>([])

const customerCodeList = ref();
const deptNameList = ref();

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
const intervalCondition = ['incentiveTime', 'createTime', 'auditTime', 'price']
const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '奖惩员工', width: '160', field: 'nickName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入奖惩员工' } },
  { title: '所属部门', width: '160', field: 'deptName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入所属部门' } },
  { title: '奖惩类型', width: '160', field: 'type', align: 'center', filterType: 'radioButton',
    filterParam: {placeholder: ''}, filterData: () => typeList.value
  },
  { title: '奖惩项目', width: '160', field: 'project', align: 'center', filterType: 'checkboxButton',
    filterParam: {placeholder: '请先选择奖惩类型'}, filterData: () => resDictData.incentive_project,
    filterCustom: { label: "dictLabel", value: "dictValue" }
  },
  // { title: '扣款类型', width: '80', field: 'type', align: 'center', filterType: 'radio', filterParam: { placeholder: '请选择扣款类型' }, filterData: () => typeList.value },
  { title: '奖惩金额', width: '160', field: 'price', align: 'center',filterType: 'intervalNumber'},
  {
    title: '奖惩日期', width: '130', field: 'incentiveTime', align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      endParams: {type: 'date', placeholder: '请选择结束时间', valueFormat: 'YYYY-MM-DD'},
      startParams: {type: 'date', placeholder: '请选择开始时间', valueFormat: 'YYYY-MM-DD'},
    }
  },
  {
    title: '状态', width: '80', field: 'status', align: 'center', filterType: 'checkboxButton',
    filterParam: {placeholder: '请输入合同状态'}, filterData: () => statusList.value
  },
  {
    title: '行政确认', width: '80', field: 'confirmStatus', align: 'center', filterType: 'radioButton',
    filterParam: {placeholder: ''}, filterData: () => confirmStatusList.value
  },
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
  { title: '备注', field: 'remark', minWidth: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入备注' } },
  { title: '数据来源', field: 'sourceType', minWidth: '80', align: 'center', filterType: 'radioButton',
    filterParam: {placeholder: ''}, filterData: () => sourceTypeList.value
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

const checkedAccountOrderDeductionList = ref<any[]>([]);

const { queryParams, form, rules } = toRefs(data);

const selectChangeEvent: VxeTableEvents.CheckboxAll<any> = () => {
  const tableRef = XTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    checkedAccountOrderDeductionList.value = selectRecords.map((item: any) => item);
  }
}
const setDeptName = (val: any) => {
  console.log("setDeptName", val);
  let user = sysUserList.value.find(item => item.userId == val);
  console.log(user)
  if (user) {
    form.value.deptName = user.deptName;
    form.value.deptId = user.deptId;
  }
  console.log(form.value.deptName)
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
  if (queryParams.value.type == '2'){
    resDictData.incentive_project = resDictData.punish_project;
  }else if (queryParams.value.type == '1'){
    resDictData.incentive_project = resDictData.reward_project;
    console.log(resDictData.incentive_project);
  }else {
    resDictData.incentive_project = [
      { dictValue: '0',
      dictLabel: '请先选择奖惩类型'}];
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
/** 查询奖惩单记录列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.statusList = queryParams.value.status;
  queryParams.value.status = undefined;
  queryParams.value.projectList = queryParams.value.project;
  queryParams.value.project = undefined;
  const res = await listIncentive(queryParams.value);
  administrativeIncentiveList.value = res.rows;
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
const handleSelectionChange = (selection: any[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "新增奖惩单";
}
// 查看按钮操作
const handleDetail = async (row?: any) => {
  reset();
  const _id = row?.id || ids.value[0]
  dialog.visible = true;
  dialog.title = "奖惩单详情";
  form.value.status = row.status
  dialogLoading.value = true
  viewStatus.value = true
  const res = await getIncentive(_id).finally(() => dialogLoading.value = false);
  form.value = res.data
  responsibilityData.value = form.value?.deductionDutyList || []
}
/** 修改按钮操作 */
const handleUpdate = async (row?: any) => {

  reset();
  const _id = row?.id || ids.value[0]
  dialog.visible = true;
  if(row.status == '1' || row.status == '4'){
    dialog.title = "编辑奖惩单";
  }else{
    dialog.title = "奖惩单详情";
  }
  dialogLoading.value = true
  const res = await getIncentive(_id).finally(() => dialogLoading.value = false);
  form.value = res.data
  responsibilityData.value = form.value?.deductionDutyList || []
}

/** 提交按钮 */
const submitForm = (opType : any) => {
  if (opType == '7'){
    form.value.checkRemark = ''
    dialogSubmit.visible = true;
  }else if (opType == '6'){
    dialogSubmit.visible = false;
  } else if (opType == '8'){
    ElMessageBox.confirm(
      '开启反审核后，该单据会重新进入“待提交”状态，相关的奖惩金额也将撤回，是否继续？',
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
        buttonLoading.value = true;
        if (params.id) {
          await updateIncentive(params).finally(() => buttonLoading.value = false);
        } else {
          // // 新增时，已分配金额默认为0
          // params.assignedPrice = 0;
          // // 新增时，是否分配完成默认为未完成 1否2是
          // params.isAssignFinish = '1';
          await addIncentive(params).finally(() => buttonLoading.value = false);
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
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delIncentive(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  dialog.visible = false;
  await getList();
}

/** 确认按钮操作 */
const handleConfirm = async (row?: any) => {
  await proxy?.$modal.confirm('是否确认该数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  row.confirmStatus = '3';
  await updateIncentive(row).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("操作成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  if (
    queryParams.value.nickName === undefined &&
    queryParams.value.deptName === undefined &&
    queryParams.value.type === undefined &&
    queryParams.value.projectList === undefined &&
    queryParams.value.price === undefined &&
    queryParams.value.incentiveTimeStart === undefined &&
    queryParams.value.incentiveTimeEnd   === undefined &&
    queryParams.value.auditTimeStart === undefined &&
    queryParams.value.auditTimeEnd   === undefined &&
    queryParams.value.statusList === undefined &&
    queryParams.value.createByName === undefined &&
    queryParams.value.auditUserName === undefined &&
    queryParams.value.remark === undefined &&
    queryParams.value.sourceType === undefined &&
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
      // 设置createTimeStart为30天前的时间
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
  proxy?.download('/basedata/incentive/export', {
    ...queryParams.value, tableName: 'administrativeIncentive'
  }, `奖惩数据__${formatDate(new Date())}.xlsx`);
}

const setCustomerList = async () => {
  const res: any = await getListCustomer(queryParams.value);
  customerList.value = res.data.map((item: CustomerVO) => {
    return {
      label: item.deptName,
      value: item.id,
      ...item
    }
  })
}

const changeType = () => {
  form.value.project = undefined;
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
      deptNameList.value = resCust.map(item=>{
        return {
          value:item.id,
          label:item.deptName
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
    queryOrderParams.value.userId = form.value.userId
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


let resDictData = {
  //奖惩项目
  reward_project: [],
  punish_project: [],
  punish_insert_project: [],
  incentive_project: [
    { dictValue: '0',
      dictLabel: '请先选择奖惩类型!'}]
}
/*获取字典数据*/
const getDictData = async () => {
  const rules = [['dictSort', 'asc']];
  let string = "reward_project,punish_project";
  await getDicts(string)
    .then(res => {
      const dictData = res.data;
      string.split(",").forEach(item => {
        Object.keys(resDictData).forEach(dictItem => {
          if (item == dictItem) {
            resDictData[dictItem] = sortBy(dictData.filter(info => {
              return item == info.dictType
            }), rules);
          }
        })
      })
    });
  // 手动新增的惩罚项目需要剔除punish_project中dictValue == '88'的值
  resDictData.punish_insert_project = deepClone(resDictData.punish_project)
  resDictData.punish_insert_project = resDictData.punish_insert_project.filter(info => {
    return info.dictValue != '88'
  })
  console.log('字典punish_project',resDictData.punish_project)
  console.log('字典punish_insert_project',resDictData.punish_insert_project)
}

onMounted(() => {
  getList();

  getListCust();
  setCustomerList();
  getDictData();
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
