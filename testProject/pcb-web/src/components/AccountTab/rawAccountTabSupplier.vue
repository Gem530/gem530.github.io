<template>
  <el-tabs v-model="tabRadioTable" @tab-click="tabRadioTableHandle" type="border-card" class="ptable-tab">
    <el-tab-pane
      v-if="props.tabName1"
      :label="props.tabName1 + '(' + (props.allData?.tabTotal1 ?props.allData?.tabTotal1:0) + ')'"
      :name="props.tabName1"
    >
      <XTable
        :pageShow="true"
        v-model:page-size="tabQueryParams.pageSize"
        :toolId="props.tabToolId1?props.tabToolId1:'tabToolId1'"
        v-model:current-page="tabQueryParams.pageNum"
        :intervalCondition="intervalCondition"
        :page-params="{ perfect: true, total: props.allData?.tabTotal1 }"
        size="mini"
        :data="props.allData?.tabList1"
        :columnList="props.tabColumnList"
        ref="tabRef1"
        @checkbox-all="selectTabAllChangeEvent"
        height="100%"
        class="ptable-content"
        @checkbox-change="selectTabChangeEvent"
        border
        @searchChange="tabSearchChange1"
        :loading="props.allData?.inOrOutLoading"
        :checkbox-config="{ checkMethod: tabCheckMethod, reserve: true }"
        :disabled="props.allData?.disabled"
        :row-class-name="rowClassName"
        :edit-config="{ trigger: 'click', mode: 'row', autoClear: false, showStatus: true }"
        :edit-rules="editRules"
        :column-config="{ resizable: true }"
        @finishSort="setSelectRow"
      >
        <template #default-isCompression="scope">
          <div>{{ CompressionStrings[scope.row.isCompression as keyof typeof CompressionEnum] }}</div>
        </template>
        <template #default-type="scope">
          <div>{{ typeStrings[scope.row.type as keyof typeof InOutTypeEnum] }}</div>
        </template>
        <template #default-unit="{ row }">
          <span>PCS</span>
        </template>
        <template #default-totalPrice="{ row }">
          <span>{{ row.totalPrice ? Number(row.totalPrice).toFixed(2) : 0.00 }}</span>
        </template>
        <template #default-createTime="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-isTax="{ row }">
          <span>{{ row.isTax == '1' ? '是' : '否' }}</span>
        </template>
        <template #default-supplierIsTax="{ row }">
          <span>{{ row.supplierIsTax == '1' ? '是' : '否' }}</span>
        </template>
        <template #default-hasTax="{ row }">
          <span>是</span>
        </template>
        <template #default-noTax="{ row }">
          <span>否</span>
        </template>
        <template #edit-quantity="{ row }">
          <el-input-number
            :disabled="props.drawerBorrow?.title?.includes('详情') || props.drawerBorrow?.title?.includes('审核') || (props.drawerBorrow?.title?.includes('确认')&& props.deduction)"
            maxLength="11"
            :min="0"
            :max="(row.inOutQuantity||row.inOutQuantity==0) ? row.inOutQuantity : row.outQuantity"
            :precision="props.tabQuantity1?props.tabQuantity1:0"
            style="width: 99%;"
            @change="calculatePrice(row)"
            :controls="false"
            v-model="row.quantity"
            placeholder="请输入数量"
          />
        </template>
        <template #default-quantity="{ row }">
          {{ row.quantity }}
        </template>
        <template #edit-price="{ row }">
          <el-input-number
            :disabled="props.drawerBorrow?.title?.includes('详情') || props.drawerBorrow?.title?.includes('审核')|| (props.drawerBorrow?.title?.includes('确认')&& props.deduction)"
            :min="0"
            maxLength="11"
            :precision="4"
            style="width: 99%;"
            @change="calculatePrice(row)"
            :controls="false"
            v-model="row.price"
            placeholder="请输入单价"
          />
        </template>
        <template #default-price="{ row }">
          {{ row.price }}
        </template>
        <template #default-discountPrice="{ row }">
          {{ row.discountPrice }}
        </template>
        <template #edit-discountPrice="{ row }">
          <el-input-number
            :disabled="props.drawerBorrow?.title?.includes('详情') || props.drawerBorrow?.title?.includes('审核')|| (props.drawerBorrow?.title?.includes('确认')&& props.deduction)"
            :min="0"
            maxLength="11"
            :precision="2"
            style="width: 99%;"
            @change="calculatePrice(row)"
            :controls="false"
            v-model="row.discountPrice"
            placeholder="请输入金额"
          />
        </template>
        <template #default-remark="{ row }">
          {{ row.remark }}
        </template>
        <template #edit-remark="{ row }">
          <el-input
            :disabled="props.drawerBorrow?.title?.includes('详情') || props.drawerBorrow?.title?.includes('审核')|| (props.drawerBorrow?.title?.includes('确认')&& props.deduction)"
            maxLength="100"
            style="width: 99%;"
            v-model="row.remark"
            @change="changeOrderListHandle(row)"
          />
        </template>
      </XTable>
    </el-tab-pane>

    <el-tab-pane
      v-if="props.tabName2"
      :label="props.tabName2 + '(' + (props.allData?.tabTotal2?props.allData?.tabTotal2:0) + ')'"
      :name="props.tabName2"
    >
      <XTable
        :pageShow="true"
        v-model:page-size="tabQueryParams2.pageSize"
        :toolId="props.tabToolId2?props.tabToolId2:'tabToolId2'"
        v-model:current-page="tabQueryParams2.pageNum"
        :intervalCondition="intervalCondition"
        :page-params="{ perfect: true, total: props.allData?.tabTotal2 }"
        size="mini"
        :data="props.allData?.tabList2"
        height="100%"
        class="ptable-content"
        :columnList="props.tabColumnList2"
        ref="tabRef2"
        @checkbox-all="selectTabAllChangeEvent"
        @checkbox-change="selectTabChangeEvent"
        border
        @searchChange="tabSearchChange2"
        :loading="props.allData?.inOrOutLoading"
        :row-class-name="rowClassName"
        :checkbox-config="{ checkMethod: tabCheckMethod, reserve: true }"
        :disabled="props.allData?.disabled"
        :edit-config="{ trigger: 'click', mode: 'row', autoClear: false, showStatus: true }"
        :edit-rules="editRules"
        :column-config="{ resizable: true }"
        @finishSort="setSelectRow"
      >
        <template #default-isCompression="scope">
          <div>{{ CompressionStrings[scope.row.type as keyof typeof CompressionEnum] }}</div>
        </template>
        <template #default-type="scope">
          <div>{{ typeStrings[scope.row.type as keyof typeof InOutTypeEnum] }}</div>
        </template>
        <template #default-unit="{ row }">
          <span>PCS</span>
        </template>
        <template #default-scrapUnit="{ row }">
          {{scrapUnitOption.find(v => v.value == row.scrapUnit)?.label}}
        </template>
        <template #default-totalPrice="{ row }">
          <span>{{ row.totalPrice ? Number(row.totalPrice).toFixed(2) : 0.00 }}</span>
        </template>
        <template #default-createTime="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-isTax="{ row }">
          <span>{{ row.isTax == '1' ? '是' : '否' }}</span>
        </template>
        <template #default-hasTax="{ row }">
          <span>是</span>
        </template>
        <template #default-noTax="{ row }">
          <span>否</span>
        </template>
        <template #default-supplierIsTax="{ row }">
          <span>{{ row.supplierIsTax == '1' ? '是' : '否' }}</span>
        </template>
        <template #edit-quantity="{ row }">
          <el-input-number
            :disabled="props.drawerBorrow?.title?.includes('详情') || props.drawerBorrow?.title?.includes('审核')|| (props.drawerBorrow?.title?.includes('确认')&& props.deduction)"
            :min="0"
            maxLength="11"
            :max="(row.inOutQuantity||row.inOutQuantity==0) ? row.inOutQuantity : row.outQuantity"
            :precision="props.tabQuantity2?props.tabQuantity2:0"
            placeholder="请输入数量"
            style="width: 99%;"
            @change="calculatePrice(row)"
            :controls="false"
            v-model="row.quantity"
          />
        </template>
        <template #default-quantity="{ row }">
          {{ row.quantity }}
        </template>
        <template #edit-price="{ row }">
          <el-input-number
            :disabled="props.drawerBorrow?.title?.includes('详情') || props.drawerBorrow?.title?.includes('审核')|| (props.drawerBorrow?.title?.includes('确认')&& props.deduction)"
            :min="0"
            maxLength="11"
            :precision="4"
            style="width: 99%;"
            @change="calculatePrice(row)"
            :controls="false"
            v-model="row.price"
            placeholder="请输入单价"
          />
        </template>
        <template #default-price="{ row }">
          {{ row.price }}
        </template>
        <template #default-discountPrice="{ row }">
          {{ row.discountPrice }}
        </template>
        <template #edit-discountPrice="{ row }">
          <el-input-number
            :disabled="props.drawerBorrow?.title?.includes('详情') || props.drawerBorrow?.title?.includes('审核')|| (props.drawerBorrow?.title?.includes('确认')&& props.deduction)"
            :min="0"
            maxLength="11"
            :precision="2"
            style="width: 99%;"
            @change="calculatePrice(row)"
            :controls="false"
            v-model="row.discountPrice"
            placeholder="请输入金额"
          />
        </template>
        <template #default-remark="{ row }">
          {{ row.remark }}
        </template>
        <template #edit-remark="{ row }">
          <el-input
            :disabled="props.drawerBorrow?.title?.includes('详情') || props.drawerBorrow?.title?.includes('审核')|| (props.drawerBorrow?.title?.includes('确认')&& props.deduction)"
            maxLength="100"
            style="width: 99%;"
            v-model="row.remark"
            @change="changeOrderListHandle(row)"
          />
        </template>
      </XTable>
    </el-tab-pane>
    <el-tab-pane v-if="props.tabName3" label="其他金额" name="其他金额">
      <el-row>
        <el-button v-if="otherAmountBtn" type="primary" @click="otherMoneyHandle"> 新增金额 </el-button>
        <el-button
          v-if="props.deduction && (!props.drawerBorrow?.title?.includes('详情') && !props.drawerBorrow?.title?.includes('审核'))"
          type="primary"
          @click="relatedDeduction"
          >关联扣款记录</el-button
        >
      </el-row>
      <XTable
        :pageShow="true"
        v-model:page-size="tabQueryParams2.pageSize"
        :intervalCondition="intervalCondition"
        size="mini"
        :data="accountOrderOtherList"
        :row-config="{ keyField: 'id' }"
        :checkbox-config="{ checkMethod: tabCheckMethodOther }"
        :columnList="otherColumnList"
        ref="otherPriceTableRef"
        @checkbox-all="selectOtherAllChangeEvent"
        height="100%"
        class="ptable-content"
        @checkbox-change="selectOtherChangeEvent"
        border
        :disabled="props.allData?.disabled"
      >
        <template #default-createTime="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-recordTime="scope">
          <span>{{ parseTime(scope.row.recordTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-type="scope">
          <span>{{ scope.row.accountOrderDeductionId?"品质扣款" : scope.row.type == 1 ? '入金' : '出金' }}</span>
        </template>
        <template #default-price="scope">
          <span>{{ scope.row.price ? Number(scope.row.price).toFixed(2) : 0.00 }}</span>
        </template>
        <template #default-operate="scope">
          <el-button
            v-if="!props.drawerBorrow?.title?.includes('详情') && !props.drawerBorrow?.title?.includes('审核') && ((scope.row.accountOrderDeductionId )||(!scope.row.accountOrderDeductionId && !props.deduction)||props.otherAmountBtn)"
            link
            type="primary"
            @click="handleUpdateOther(scope.row)"
            >修改</el-button
          >
          <el-button
            v-if="(!props.drawerBorrow?.title?.includes('详情') && !props.drawerBorrow?.title?.includes('审核')) && ((scope.row.accountOrderDeductionId && props.deduction)||(!scope.row.accountOrderDeductionId && !props.deduction)||props.otherAmountBtn)"
            link
            type="primary"
            @click="handleDeleteOther(scope.row)"
            >删除</el-button
          >
        </template>
      </XTable>
    </el-tab-pane>
  </el-tabs>

  <el-form border label-width="120px" class="drawer-order-form">
    <el-row>
      <el-col :span="4">
        <el-form-item
          size="small"
          :label="props.footLabel && props.footLabel?.label1 ? props.footLabel?.label1 + ':' : '对账总金额：'"
          prop="borrowTotalPrice"
          >{{ borrowTotalPrice }}</el-form-item
        >
      </el-col>
      <el-col :span="4" v-if="!props.footAdd">
        <el-form-item
          size="small"
          :label="props.footLabel && props.footLabel?.label2 ? props.footLabel?.label2 + ':' : '退货总金额：'"
          prop="backTotalPrice"
          >{{ -backTotalPrice }}</el-form-item
        >
      </el-col>
      <el-col :span="4">
        <el-form-item
          size="small"
          :label="props.footLabel && props.footLabel?.label3 ? props.footLabel?.label3 + ':' : '入金总金额：'"
          prop="backDiscountTotalPrice"
          >{{ otherRecoverTotalPrice
          }}</el-form-item
        >
      </el-col>
      <el-col :span="4">
        <el-form-item
          size="small"
          :label="props.footLabel && props.footLabel?.label4 ? props.footLabel?.label4 + ':' : '出金总金额：'"
          prop="backDiscountTotalPrice"
          >{{ -otherOutTotalPrice
          }}</el-form-item
        >
      </el-col>
      <el-col :span="6">
        <el-form-item
          size="small"
          :label="props.footLabel && props.footLabel?.label5 ? props.footLabel?.label5 + ':' : '应收总金额：'"
          prop="accountPrice"
          >{{
            BigNumber(borrowTotalPrice).minus(BigNumber(backTotalPrice)).minus(BigNumber(otherOutTotalPrice)).plus(BigNumber(otherRecoverTotalPrice)).toNumber()
          }}</el-form-item
        >
      </el-col>
    </el-row>
  </el-form>

  <el-dialog v-model="otherMoneyDialog.visible" :title="otherMoneyDialog.title" width="30%" draggable style="min-width: 450px;">
    <el-form ref="accountOrderOtherFormRef" :model="otherForm" :rules="otherRules" label-width="100px" label-position="right">
      <el-row>
        <el-col :span="24">
          <el-form-item v-if="!otherForm.accountOrderDeductionId" label="金额类型:" prop="type">
            <el-radio-group v-model="otherForm.type">
              <el-radio label="1">入金</el-radio>
              <el-radio label="2">出金</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="对账日期:" prop="recordTime" style="width: 100%">
            <el-date-picker
              :disabled="otherMoneyDialog.title?.includes('品质')"
              v-model="otherForm.recordTime"
              style="width: 100%"
              type="date"
              value-format="YYYY-MM-DD 23:59:59"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="金额:" prop="price">
            <el-input-number style="width: 100%; text-align: left;" :precision="2" min="0.01" :controls="false" v-model="otherForm.price" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input :disabled="otherMoneyDialog.title?.includes('品质')" v-model="otherForm.remark" maxLength="100" :rows="2" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div style="display: flex; justify-content: center;">
        <span class="dialog-footer">
          <el-button @click="otherMoneyDialog.visible = false">取消</el-button>
          <el-button
            type="primary"
            v-show="props.drawerBorrow?.title?.includes('修改') || props.drawerBorrow?.title?.includes('添加') || props.drawerBorrow?.title?.includes('确认')"
            @click="otherSubmitForm"
          >
            保存
          </el-button>
        </span>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogChangeAddressAll.visible" :title="dialogChangeAddressAll.title" width="60%" destroy-on-close draggable>
    <XTable
      ref="waitHandleTableRef"
      :pageShow="false"
      height="250"
      :column-config="{resizable: true}"
      size="mini"
      :data="accountOrderDeductionList"
      :border="true"
      :columnList="deductionColumnList"
      @checkbox-change="selectAllChangeEvent"
      @checkbox-all="selectAllChangeEvent"
      border
    >
      <template #default-type="scope">
        {{ scope.row.type=='2'?'供应商扣款':'客户扣款'}}
      </template>
    </XTable>
    <template #footer>
      <div style="display: flex; justify-content: center;">
        <span class="dialog-footer">
          <el-button @click="dialogChangeAddressAll.visible = false">取消</el-button>
          <el-button type="primary" @click="relatedDeductionConfirm" :disabled="multiple"> 确定 </el-button>
        </span>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="RawAccountTab" lang="ts">
import { ref } from "vue";
import { BigNumber } from 'bignumber.js';
import { parseTime } from "@/utils/ruoyi";
import { VXETable, VxeTableEvents, VxeTableInstance, VxeTablePropTypes } from "vxe-table";
import { InOutTypeEnum, typeStrings, CompressionEnum, CompressionStrings } from '@/api/basedata/rawMaterial/types';
import { AccountOrderOtherVO, AccountOrderOtherForm, AccountOrderOtherQuery } from '@/api/financial/accountOrderOther/types';
import {accountRelatedDeduction} from '@/api/financial/accountOrder';
import {listAccountOrderSupplierDeduction } from '@/api/financial/AccountOrderDeduction';
import useUserStore from '@/store/modules/user';
import dayjs from "dayjs";
import { deepClone } from '@/utils';
import { Decimal } from 'decimal.js';

const tabRef1 = ref();
const tabRef2 = ref();
const checkedTabList1 = ref([]);
const otherPriceTableRef = ref();
const intervalCondition = ['accountMonth', 'endTime', 'accountTime', 'createTime'];
// 解决切换分页时，重置取消的勾选
const delPageChangeCheckList = ref([])
//初始化编辑金额
const firstInitEditPrice = ref(true);
// 用于保存数据.修改了数据之后,切换页码时,需要保留已经修改的值
const changeOrderList = ref([]);
const checkedTabList1BgHeight = ref([]);

const checkedTabList2 = ref([]);
//选中的其他金额
const selectedOrderOtherList = ref([]);
//其他金额
const accountOrderOtherList = ref<AccountOrderOtherVO[]>([]);
//其他金额form
const accountOrderOtherFormRef = ref<ElFormInstance>();

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { nickname } = useUserStore();
const tabQueryParams2 = ref({
  pageNum: 1,
  pageSize: 20,
});
const tabQueryParams = ref({
  pageNum: 1,
  pageSize: 20,
});

  const scrapUnitOption = ref([
    {label: "pcs", value: "1"},
    {label: "set", value: "2"},
    {label: "pnl", value: "3"},
  ])

//注入刷新方法.保存方法
const emits = defineEmits(['refreshFunction', 'doSaveBack']);

const props = defineProps({
  allData: {
    type: Object,
    default: {
      tabTotal1: 0,
      tabTotal2: 0,
    }
  },
  editOtherList: {
    type: Array,
    default: () => []
  },
  tabName1: {
    type: String,
    default: '加载中...'
  },
  tabName2: {
    type: String,
    default: '加载中...'
  },
  tabName3: {
    type: Boolean,
    default: false
  },
  tabColumnList2: {
    type: Array,
    default: () => []
  },
  tabColumnList: {
    type: Array,
    default: () => []
  },
  drawerBorrow: {
    type: Object,
    default: undefined
  },
  disabled: {
    type: Object,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  //底部是否合计，默认tab1-tab2 true则tab1+tab2
  footAdd: {
    type: Boolean,
    default: false
  },
  tabToolId1: {
    type: String,
    default: undefined
  },
  tabToolId2: {
    type: String,
    default: undefined
  },
  footLabel: {
    type: Object,
    default: undefined
  },
  checkedTabList1: {
    type: Array,
    default: () => []
  },
  checkedTabList2: {
    type: Array,
    default: () => []
  },
  tabQuantity1: {
    type: Number,
    default: 0
  },
  tabQuantity2: {
    type: Number,
    default: 0
  },
  deduction: {
    type: Boolean,
    default: false
  },
  otherAmountBtn: {
    type: Boolean,
    default: false
  },
  supplierQuery: {
    type: Boolean,
    default: true
  },
  row: {
    type: Object,
    default: {}
  },
  tabFormRef: {
    type: Object,
      default: () => {}
  }
});

const tabRadioTable = ref("");
const otherAmountBtn = ref(false);
const otherColumnList = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '60' },
  { title: '创建时间', width: '180', field: 'createTime', align: 'center' },
  { title: '创建人', width: '180', field: 'createByName', align: 'center' },
  { title: '对账日期', width: '180', field: 'recordTime', align: 'center' },
  { title: '金额类型', width: '180', field: 'type', align: 'center' },
  { title: '金额', width: '180', field: 'price', align: 'center' },
  { title: '备注', width: '180', fixed: 'right', field: 'remark', align: 'center' },
  { title: '操作', width: '180', fixed: 'right', field: 'operate', align: 'center' },
]);
const deductionColumnList = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: '序号',field: "index", width: '40', type: 'seq', visible: true, align: 'center' },
  { title: '扣款单号', width: '100', field: 'no', align: 'center', },
  { title: '扣款类型', width: '80', field: 'type', align: 'center', },
  { title: '创建人', width: '60', field: 'createByName', align: 'center', },
  { title: '创建时间', width: '120', field: 'createTime', align: 'center', },
  { title: '扣款日期', width: '120', field: 'deductionTime', align: 'center', },
  { title: '扣款金额', width: '120', field: 'price', align: 'center', },
  { title: '备注',  field: 'remark', align: 'center', },
]);
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
const otherForm = ref({ ...initOtherFormData });
const otherMoneyDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const otherRules = {
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

//Tab正整数校验
const positiveIntValid = (cellValue: any) => {
  if (!/^[1-9]\d*$/.test(cellValue)) {
    return new Error('请输入正整数')
  }
}
VXETable.validators.add('positiveIntValid', {
  cellValidatorMethod({ cellValue }) {
    return positiveIntValid(cellValue)
  }
})
// 0+正数且小数点后最多4位校验
const positiveNumberWithTwoDecimals = (cellValue: any) => {
  //0|[1-9]\d*)(\.\d{1,2}
  if (cellValue && !/^([1-9]\d*)(\.\d{1,2})?$/.test(cellValue)) {
    return new Error('请输入数字、最多2位小数点')
  }
}
const nullOrPositiveNumberWithTwoDecimals = (cellValue: any) => {
  //0|[1-9]\d*)(\.\d{1,2}
  //!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(cellValue)
  if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(cellValue)) {
    return new Error('请输入数字、最多2位小数点')
  }
}
const nullOrPositiveNumberWithFourDecimals = (cellValue: any) => {
  if (!/^(0|[1-9]\d*)(\.\d{1,4})?$/.test(cellValue)) {
    return new Error('请输入数字、最多4位小数点')
  }
}
VXETable.validators.add('nullOrPositiveNumberWithFourDecimals', {
  cellValidatorMethod({ cellValue }) {
    return nullOrPositiveNumberWithFourDecimals(cellValue)
  }
})
VXETable.validators.add('nullOrPositiveNumberWithTwoDecimals', {
  cellValidatorMethod({ cellValue }) {
    return nullOrPositiveNumberWithTwoDecimals(cellValue)
  }
})
VXETable.validators.add('positiveNumberWithTwoDecimals', {
  cellValidatorMethod({ cellValue }) {
    return positiveNumberWithTwoDecimals(cellValue)
  }
})
const editRules = ref<VxeTablePropTypes.EditRules>({
  price: [
    { required: true , validator: 'nullOrPositiveNumberWithFourDecimals'}
  ],
  quantity: [
    { required: true, validator: 'nullOrPositiveNumberWithTwoDecimals' }
  ],

})

// 搜索 **************start
const tabSearchChange1 = (params: any) => {
  console.log("tabSearchChange1...",params)
  tabQueryParams.value = params;
  if (params.sorts && params.sorts.length > 0) {
    params.sorts.forEach((item: any) => {
      tabQueryParams.value.orderByColumn = item.prop;
      tabQueryParams.value.isAsc = item.order;
    })
  }
  emits('refreshFunction');
}

const tabSearchChange2 = (params: any) => {
  console.log("tabSearchChange2...",params)
  tabQueryParams2.value = params;
  if (params.sorts && params.sorts.length > 0) {
    params.sorts.forEach((item: any) => {
      tabQueryParams2.value.orderByColumn = item.prop;
      tabQueryParams2.value.isAsc = item.order;
    })
  }
  emits('refreshFunction');
}
// 编辑借料单高亮
const rowClassName = ({ row, rowIndex, $rowIndex }: any) => {
  const num = checkedTabList1BgHeight.value.findIndex((item: any) => item.id == row.id)
  if (num != -1) {
    return 'table-height-rows'
  }
}

const otherMoneyHandle = async () => {
  otherForm.value = { ...initOtherFormData };

  otherForm.value.recordTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  otherMoneyDialog.title = "其他金额";
  otherMoneyDialog.visible = true;
  //tab切换回其他金额
  tabRadioTable.value = "其他金额";
}


// 切换菜单栏 *********** end
const tabCheckMethod = (row: any) => {
  return !(props.drawerBorrow?.title?.includes('详情') || props.drawerBorrow?.title?.includes('审核') || (props.deduction && !props.otherAmountBtn) ) ;
}
// 切换菜单栏 *********** end
const tabCheckMethodOther = (row: any) => {

  return (!(props.drawerBorrow?.title?.includes('详情') || props.drawerBorrow?.title?.includes('审核') )) && ((row.row.accountOrderDeductionId && props.deduction)||((!row.row.accountOrderDeductionId && !props.deduction))|| props.otherAmountBtn) ;
}
const tabRadioTableHandle = (tab: any, event: any) => {
  console.log("tab.props.name", tab.props.label);
  tabRadioTable.value = tab.props.name;
  otherAmountBtn.value = tabRadioTable.value == '其他金额' && !(props.drawerBorrow?.title?.includes('详情') || props.drawerBorrow?.title?.includes('审核')) && (!props.deduction||props.otherAmountBtn);
}
//添加对账单表单 全选
const selectTabAllChangeEvent: VxeTableEvents.CheckboxAll<any> = ({ checked }) => {
  console.log("selectTabAllChangeEvent", checked)
  drawTabDataSet();
}
//单选
const selectTabChangeEvent: VxeTableEvents.CheckboxAll<any> = (item: any) => {
  console.log("selectTabChangeEvent", item)
  drawTabDataSet();
}

//其他金额表单 全选
const selectOtherAllChangeEvent: VxeTableEvents.CheckboxAll<AccountOrderOtherVO> = ({ checked }) => {
  refreshListCheck();
}
//其他金额表单 单选
const selectOtherChangeEvent: VxeTableEvents.CheckboxChange<AccountOrderOtherVO> = ({ checked, row }) => {
  console.log(checked, row);
  refreshListCheck();
}
//重新设置使得响应式生效
const refreshListCheck = () => {

  const checkInfo3 = otherPriceTableRef.value.xTableRef.getCheckboxReserveRecords().concat(otherPriceTableRef.value.xTableRef.getCheckboxRecords());
  selectedOrderOtherList.value = checkInfo3;
  console.log(" refreshListCheck selectedOrderOtherList", selectedOrderOtherList);
}
/** 其他金额 *************start**********/
const handleUpdateOther = async (row: AccountOrderOtherVO) => {

  otherMoneyDialog.title = "修改其他金额";
  if(row.accountOrderDeductionId){
    otherMoneyDialog.title = "修改品质扣款";
  }
  otherMoneyDialog.visible = true;
  Object.assign(otherForm.value, row);
}
/** 删除其他金额按钮操作 */
const handleDeleteOther = async (row: AccountOrderOtherVO) => {
  await proxy?.$modal.confirm('是否确认删除？');
  if (row.id != undefined) {
    accountOrderOtherList.value = accountOrderOtherList.value.filter(item => item.id != row.id);
    selectedOrderOtherList.value = selectedOrderOtherList.value.filter(item => item.id != row.id);
  } else {
    accountOrderOtherList.value = accountOrderOtherList.value.filter(item => item.index != row.index);
    selectedOrderOtherList.value = selectedOrderOtherList.value.filter(item => item.index != row.index);
  }
   HandleDetailList.value = HandleDetailList?.value.filter(item => item.id != row.accountOrderDeductionId);
  proxy?.$modal.msgSuccess("删除成功");
}

/** 其他金额确认按钮 */
const otherSubmitForm = () => {
  accountOrderOtherFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      let accountOrderOtherVO: AccountOrderOtherVO = {
        id: otherForm.value.id,
        type: otherForm.value.type,
        createByName: nickname,
        price: otherForm.value.price,
        remark: otherForm.value.remark,
        accountOrderId: otherForm.value.accountOrderId,
        recordTime: otherForm.value.recordTime,
        index: otherForm.value.index,
        supplierId: otherForm.value.supplierId,
        accountOrderDeductionId: otherForm.value.accountOrderDeductionId,
        createTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
      }
      //修改
      if (otherForm.value.id) {
        accountOrderOtherList.value = accountOrderOtherList.value.map(item => {
          if (item.id == otherForm.value.id) {
            return accountOrderOtherVO;
          }
          return item;
        });
      } else {
        if (otherForm.value.index) {
          accountOrderOtherList.value = accountOrderOtherList.value.map(item => {
            if (item.index == otherForm.value.index) {
              item.price = otherForm.value.price;
              item.remark = otherForm.value.remark;
              item.type = otherForm.value.type;
              item.recordTime = otherForm.value.recordTime;
              item.supplierId=otherForm.value.supplierId;
              return item;
            }
            return item;
          });
        } else {
          accountOrderOtherVO.createTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
          accountOrderOtherVO.index = Math.random();
          accountOrderOtherList.value.push(accountOrderOtherVO);
        }
      }
      if (selectedOrderOtherList.value && selectedOrderOtherList.value.length > 0) {
        selectedOrderOtherList.value = selectedOrderOtherList.value.map(item => {
          accountOrderOtherList.value.find(item2 => {
            if (item2.id == item.id) {
              item = item2;
            }
          })
          return item;
        });

      }
      let otherTabProxy = otherPriceTableRef.value.xTableRef.getCheckboxRecords();
      otherTabProxy.map(tabItem => {
        accountOrderOtherList.value.find(item2 => {
          if (item2.id == tabItem.id) {
            tabItem.price = item2.price;
            tabItem.remark = item2.remark;
            tabItem.type = item2.type;
            tabItem.recordTime = item2.recordTime;
            tabItem.supplierId = item2.supplierId;
          }
        })
        return tabItem;
      });

      console.log(" addd  selectedOrderOtherList.....", selectedOrderOtherList.value)
      otherMoneyDialog.visible = false;
    }
  });
}

//扣款单明细列表
const HandleDetailList = ref<any[]>([]);
const selectAllChangeEvent: VxeTableEvents.CheckboxAll<any> = () => {
  const $table = waitHandleTableRef.value.xTableRef
  if ($table) {
    const selectRecords = $table.getCheckboxRecords();
    HandleDetailList.value = selectRecords.map(item => item);
  }
   multiple.value = !HandleDetailList.value.length && selectRecords.value;
  // disableWaitHandleCheck();
}

/**
 * 关联扣款确认，把从扣款单明细列表的数据，放到其他金额中
 */
const relatedDeductionConfirm = () => {
  console.log("HandleDetailList", HandleDetailList.value);
  console.log("accountOrderOtherList", accountOrderOtherList.value);

  if (HandleDetailList.value.length > 0) {
  //遍历选中的扣款单明细HandleDetailList ，判断accountOrderOtherList中是否已有accountOrderDeductionId的数据，如果有则不添加如果没有则添加
  HandleDetailList.value.forEach(item => {
    let isExist = accountOrderOtherList.value.find(item2 => item2.accountOrderDeductionId == item.id);
    if (!isExist) {
      let accountOrderOtherVO: AccountOrderOtherVO = {
        id: undefined,
        type: "2",
        createByName: nickname,
        price: item.price,
        remark: item.remark,
        accountOrderId: item.accountOrderId,
        recordTime: item.deductionTime,
        index:  Math.random(),
        supplierId: item.supplierId,
        accountOrderDeductionId: item.id,
        createTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
      }
      accountOrderOtherList.value.push(accountOrderOtherVO);
    }
  });
  //把accountOrderOtherList中accountOrderDeductionId在HandleDetailList中不存在的数据删除
  accountOrderOtherList.value = accountOrderOtherList.value.filter(item => {
    return HandleDetailList.value.find(item2 => (item2.id == item.accountOrderDeductionId||!item.accountOrderDeductionId));
  });
  console.log("accountOrderOtherList1", accountOrderOtherList.value);


 }else{
//把accountOrderOtherList中accountOrderDeductionId不为空的数据删除
  accountOrderOtherList.value = accountOrderOtherList.value.filter(item => !item.accountOrderDeductionId);
    console.log("accountOrderOtherList2", accountOrderOtherList.value);
 }
  selectedOrderOtherList.value = selectedOrderOtherList.value.filter(item => {
    return HandleDetailList.value.find(item2 => (item2.id == item.accountOrderDeductionId)) ||!item.accountOrderDeductionId;
  });
  console.log("selectedOrderOtherList====", selectedOrderOtherList.value);
   nextTick(() => {
    setTimeout(() => {
      if (accountOrderOtherList.value.length > 0) {
        accountOrderOtherList.value.forEach(item => {
          if (item.accountOrderDeductionId) {
          otherPriceTableRef.value.xTableRef.setCheckboxRow(item, true);
      }
    })
    refreshListCheck();
  }
    }, 0);
  })
  HandleDetailList.value = [];
  multiple.value = true;
  dialogChangeAddressAll.visible = false

}
//勾选按钮
const multiple = ref(true);
  //是否有勾选
const selectRecords = ref(false);
const dialogChangeAddressAll = reactive<DialogOption>({
  visible: false,
  title: '关联扣款金额'
});
const waitHandleTableRef = ref()
//扣款金额记录
const accountOrderDeductionList = ref<any[]>([]);
const accountOrderDeductionId = ref<any>();

/** 关联扣款记录 */
const relatedDeduction = async (row: any) => {
  // console.log("row", props.row);
let supplier =  useUserStore().supplier;
  //验证是否有供应商
  if (!useUserStore().supplier.supplierId) {
    proxy?.$modal.msgError("请选择供应商");
    return;
  }

  let accountOrderId = undefined;
  if(props.isEdit){
    console.log("props.tabFormRef",props.allData);

    accountOrderId = props.allData.accountOrderId;
  }

  multiple.value = true;
  //是否有勾选
  let selectRecords = false;
    dialogChangeAddressAll.visible = true;
  let queryParams= {
    supplierId: supplier.supplierId,
    id: accountOrderId,
  }
  console.log("queryParams",queryParams);

  let res =await listAccountOrderSupplierDeduction(queryParams);
  console.log(res);
  accountOrderDeductionList.value = res.data;

    accountOrderOtherList?.value.forEach(item => {
    if (item.accountOrderDeductionId) {
      accountOrderDeductionList?.value.forEach(item2 => {
        if (item2.id == item.accountOrderDeductionId) {
          item2.checked = true;
          //添加到HandleDetailList
          HandleDetailList.value.push(item2);
        }
      })
    }
  });

  //设置勾选状态
  accountOrderDeductionList.value.forEach(item => {
    if (item.checked) {
      selectRecords = true;
      nextTick(() => {
      waitHandleTableRef.value.xTableRef.setCheckboxRow(item, true);
      });
    }
  });

  accountOrderDeductionId.value = row.id;
  if (selectRecords) {
    multiple.value = false;
  }

}





//添加删除
const drawTabDataSet = () => {
  console.log("添加删除...")
  if (props.tabName1) {
    const _tabRef1 = tabRef1.value.xTableRef;
    //获取当前页选中的数据
    const deliverCurCheck = _tabRef1.getData().filter((item: any) => _tabRef1.isCheckedByCheckboxRow(item));
    const r_deliverCurCheck = _tabRef1.getData().filter((item: any) => !_tabRef1.isCheckedByCheckboxRow(item));

    addTabStore(deliverCurCheck, checkedTabList1.value, "id");
    removeTabStore(r_deliverCurCheck, checkedTabList1.value, "id");
  }
  if (props.tabName2) {
    const _tabRef2 = tabRef2.value.xTableRef;
    const backCurCheck = _tabRef2.getData().filter((item: any) => _tabRef2.isCheckedByCheckboxRow(item));
    const r_backCurCheck = _tabRef2.getData().filter((item: any) => !_tabRef2.isCheckedByCheckboxRow(item));

    addTabStore(backCurCheck, checkedTabList2.value, "id");
    removeTabStore(r_backCurCheck, checkedTabList2.value, "id");
  }
  console.log("checkedTabList1",checkedTabList1.value)
  console.log("checkedTabList2",checkedTabList2.value)
}

const addTabStore = (sourceList: any, storeList: any, key: any) => {
  sourceList.forEach((item: any) => {
    let itemAlready = storeList.find((itemAlready: any) => {
      return itemAlready[key] == item[key]
    });
    item.selected = true;
    if (itemAlready) {
      // 更新已存在的元素
      itemAlready = item;
    } else {
      // 添加新元素
      storeList.push(item);
    }
  })
}
const removeTabStore = (sourceList: any, storeList: any, key: any) => {
  sourceList.forEach((item: any) => {
    let itemAlready = storeList.find((itemAlready: any) => itemAlready[key] == item[key]);

    item.selected = false;
    if (itemAlready) {
      delPageChangeCheckList.value.push(itemAlready)
      // 删除元素
      const _inx = storeList.indexOf(itemAlready);
      storeList.splice(_inx, 1);
    }
  })
}
/**
 * 计算价格
 * @param data
 */
const calculatePrice = async (row: any) => {
  let price = row.price ? row.price : 0;
  let quantity = row.quantity ? row.quantity : 0;
  let discountPrice = row.discountPrice ? row.discountPrice : 0;
  console.log("000000calculatePrice00000000000", row);
  if (!quantity) {
    row.quantity = 0;
  }
  if (!price) {
    row.price = 0;
  }
  if (!discountPrice) {
    row.discountPrice = 0;
  }
  //非首次加载，触发一次计算后，不在设置默认值
  console.log("firstInitEditPrice.value", firstInitEditPrice.value);
  if (!firstInitEditPrice.value) {
    row.unInitEditPrice = true;
  }
  let _otherCost: number = Number(row.mouldCost ? row.mouldCost : 0) + Number(row.testFrameCost ? row.testFrameCost : 0)
    + Number(row.engineeringCost ? row.engineeringCost : 0)
    + Number(row.flyProbeCost ? row.flyProbeCost : 0) + Number(row.sampleCost ? row.sampleCost : 0)
    + Number(row.expeditedCost ? row.expeditedCost : 0) + Number(row.otherCost ? row.otherCost : 0);

  // price = (price * 10000).toFixed(2);
  // quantity = (quantity * 10000).toFixed(2);
  // let amount = price * quantity / 100000000;

  let amount = Decimal.mul(Number(price),Number(quantity)).toDecimalPlaces(2).toNumber();
  //计算总价
  if(_otherCost){
    console.log("_otherCost",_otherCost);
    //row.totalPrice = Number(amount) - Number(discountPrice) + Number(_otherCost);
    let _price = Decimal.sub(Number(amount),Number(discountPrice)).toDecimalPlaces(2).toNumber();
    row.totalPrice =  Decimal.add(_price, Number(_otherCost)).toDecimalPlaces(2).toNumber();
  }else{
    //row.totalPrice = Number(amount) - Number(discountPrice) ;
    //row.totalPrice = BigNumber(amount).minus(BigNumber(discountPrice)).toNumber();
    row.totalPrice = Decimal.sub(Number(amount),Number(discountPrice)).toDecimalPlaces(2).toNumber();
  }
  console.log("amount", amount, "discountPrice", discountPrice, "discountPrice", _otherCost);
  console.log("row.totalPrice", row.totalPrice);

  console.log("amountrow", row)
  //重新设置当前页选中数据使得响应式生效
  doCurRefreshCheck();

  // 在修改了数据后,保留修改的数据,以便在切换页码后,用修改的数据去替换
  changeOrderListHandle(row)
};
// 存储修改的数据
const changeOrderListHandle = (row: any) => {

  const index = changeOrderList.value.findIndex((item: any) => item.id == row.id)
  if (index == -1) {
    changeOrderList.value.push(row)
  } else {
    changeOrderList.value.splice(index, 1, row)
  }
}
const doCurRefreshCheck = () => {
  console.log("doCurRefreshCheck....", checkedTabList1.value);
  if (checkedTabList1.value) {
    const tempList2 = tabRef1.value.xTableRef.getCheckboxRecords();
    checkedTabList1.value = checkedTabList1.value.map(item => {
      tempList2.find((item2: any) => {
        if (item2.id == item.id) {
          item = item2;
        }
      })
      return item;
    })
  }
  if (checkedTabList2.value) {
    const tempList1 = tabRef2.value.xTableRef.getCheckboxRecords();
    checkedTabList2.value = checkedTabList2.value.map(item => {
      tempList1.find((item2: any) => {
        if (item2.id == item.id) {
          item = item2;
        }
      })
      return item;
    })
  }

};

//foot金额计算
//外付 总金额
const borrowTotalPrice = computed(() => {
  console.log('2222-------- props.footAdd', props.footAdd)
  if (props.footAdd) {
    const footTotalPrice = calculateTotalPriceByType(checkedTabList1.value, undefined, "totalPrice")
      + calculateTotalPriceByType(checkedTabList2.value, undefined, "totalPrice");
    console.log('2222-------- props.footAdd2', footTotalPrice)
    return footTotalPrice.toFixed(2);
  }
  return calculateTotalPriceByType(checkedTabList1.value, undefined, "totalPrice").toFixed(2);
});
//外付 总退货金额
const backTotalPrice = computed(() => {
  if (props.footAdd) {
    return 0;
  }
  return calculateTotalPriceByType(checkedTabList2.value, undefined, "totalPrice").toFixed(2);
});

//外付 总折扣金额
const borrowDiscountTotalPrice = computed(() => {
  //tab2如果是退货可能要对冲。目前仅菲林有折扣汇总，暂为合计
  if (checkedTabList2.value && checkedTabList2.value.length > 0) {
    const _discountPrice = calculateTotalPriceByType(checkedTabList1.value, undefined, "discountPrice")
      + calculateTotalPriceByType(checkedTabList2.value, undefined, "discountPrice");
    return _discountPrice.toFixed(2);
  }
  return calculateTotalPriceByType(checkedTabList1.value, undefined, "discountPrice").toFixed(2);
});

//入金总金额
const otherRecoverTotalPrice = computed(() => {
  return calculateTotalPriceByType(selectedOrderOtherList.value, "1", "price").toFixed(2);
});
//出金总金额
const otherOutTotalPrice = computed(() => {
  return calculateTotalPriceByType(selectedOrderOtherList.value, "2", "price").toFixed(2);
});

const calculateTotalPriceByType = (list: any, _type: any, fieldName: string) => {
  if (!list) {
    return 0;
  }
  const resNum = list
    .filter((item: any) => {
      let validType = true;
      if (_type) {
        validType = item.type == _type
      }
      return item[fieldName] && validType
    })
    .reduce((total: any, item: any) => {
      let totalTmp = Number(total.toFixed(2)) * 100000000;
      let itemTotal=Number(item[fieldName]);
      let _tmp = Number(itemTotal.toFixed(2)) * 100000000;
      return (totalTmp + _tmp) / 100000000
    }, 0);
  return resNum;
};


//设置选中
const setSelectRow = (queryType?: string) => {
  //setPriceInfo();
  setCheckedListInfo();
  nextTick(() => {
    if (props.isEdit) {
      //setCheckedListInfo();
    }
    setTimeout(() => {
      checkedTabList1BgHeight.value = [];
      //设置选中
      if (props.allData?.tabList2 && props.allData?.tabList2.length > 0) {

        let f_checkedList = props.allData?.tabList2.filter(item => {
          return item.selected || checkedTabList2.value.some((item2: any) => item.id == item2.id);
        });

        //设置去勾选的选中
        if (delPageChangeCheckList.value?.length) {
          f_checkedList = f_checkedList.filter((item: any) => delPageChangeCheckList.value.findIndex((fi: any) => fi.id == item.id) == -1)
        }
        tabRef2.value.xTableRef.setCheckboxRow(f_checkedList, true);
        //高亮
        if (props.isEdit) {
          if (checkedTabList1BgHeight.value && checkedTabList1BgHeight.value.length > 0) {
            const _tab1 = deepClone(f_checkedList);
            checkedTabList1BgHeight.value = checkedTabList1BgHeight.value.concat(_tab1)
          } else {
            checkedTabList1BgHeight.value = deepClone(f_checkedList)
          }
        }
      }
      if (props.allData?.tabList1 && props.allData?.tabList1.length > 0) {

        let w_checkedList = props.allData?.tabList1.filter(item => {
          return item.selected || checkedTabList1.value.some((item2: any) => item.id == item2.id);
        });

         //设置去勾选的选中
        if (delPageChangeCheckList.value?.length) {
          w_checkedList = w_checkedList.filter((item: any) => delPageChangeCheckList.value.findIndex((fi: any) => fi.id == item.id) == -1)
        }

        tabRef1.value.xTableRef.setCheckboxRow(w_checkedList, true);

        //高亮
        if (props.isEdit) {
          if (checkedTabList1BgHeight.value && checkedTabList1BgHeight.value.length > 0) {
            const _tab2 = deepClone(w_checkedList);
            checkedTabList1BgHeight.value = checkedTabList1BgHeight.value.concat(_tab2);
          } else {
            checkedTabList1BgHeight.value = deepClone(w_checkedList)
          }
        }
      }

      //设置相应变量使得底部响应式生效
      drawTabDataSet();
    }, 20);
  })
}

const setPriceInfo = () => {
  if (props.allData?.tabList2) {
    props.allData?.tabList2.forEach((item) => {
      item.price = item.price ? item.price : 0;
      item.quantity = item.quantity ? item.quantity : 0;
      item.discountPrice = item?.discountPrice ? item.discountPrice : 0;
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id);
      if (crtM) {
        item.quantity = crtM?.quantity ? crtM.quantity : 0;
        item.discountPrice = crtM?.discountPrice ? crtM.discountPrice : 0;
        item.remark = crtM?.remark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
      }
      const discountPrice2 = (item.discountPrice * 10000).toFixed(2);
      const itemPrice: any = (item.price * 10000).toFixed(2);
      const itemQuantity: any = (item.quantity * 10000).toFixed(2);
      let sum1 = (itemPrice * itemQuantity) / 10000;
      sum1 = Number(sum1) - Number(discountPrice2);
      item.totalPrice = Number(sum1) / 10000;
    });
  }
  if (props.allData?.tabList1) {
    props.allData?.tabList1.forEach((item, inx) => {
      item.price = item.price ? item.price : 0;
      item.quantity = item.quantity ? item.quantity : 0;
      item.discountPrice = item?.discountPrice ? item.discountPrice : 0;
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id)
      if (crtM) {
        item.quantity = crtM?.quantity ? crtM.quantity : 0;
        item.discountPrice = crtM?.discountPrice ? crtM.discountPrice : 0;
        item.remark = crtM?.remark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
      }
      const discountPrice2 = (item.discountPrice * 10000).toFixed(2);
      const itemPrice = (item.price * 10000).toFixed(2);
      const itemQuantity = (item.quantity * 10000).toFixed(2);
      let amount: number = (itemPrice * itemQuantity) / 10000;
      amount = Number(amount) - Number(discountPrice2);
      item.totalPrice = amount / 10000;
    });
  }
}

const setCheckedListInfo = () => {
  //记住修改数值后重新计算一次总金额
  if (checkedTabList1.value && checkedTabList1.value.length > 0) {
    checkedTabList1.value.forEach((item, inx) => {
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id)
      if (crtM) {
        item.quantity = crtM?.quantity ? crtM.quantity : 0;
        item.discountPrice = crtM?.discountPrice ? crtM.discountPrice : 0;
        item.totalPrice = crtM?.totalPrice ? crtM.totalPrice : 0;
        item.remark = crtM?.remark;
        item.price = crtM?.price ? crtM.price : 0;
      }
    });

    props.allData?.tabList1.forEach((item, inx) => {
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id)
      if (crtM) {
        item.quantity = crtM?.quantity ? crtM.quantity : 0;
        item.discountPrice = crtM?.discountPrice ? crtM.discountPrice : 0;
        item.totalPrice = crtM?.totalPrice ? crtM.totalPrice : 0;
        item.remark = crtM?.remark;
        item.price = crtM?.price ? crtM.price : 0;
      }
    });

  }
  if (checkedTabList2.value && checkedTabList2.value.length > 0) {
    checkedTabList2.value.forEach((item, inx) => {
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id)
      if (crtM) {
        item.quantity = crtM?.quantity ? crtM.quantity : 0;
        item.totalPrice = crtM?.totalPrice ? crtM.totalPrice : 0;
        item.remark = crtM?.remark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
        item.price = crtM?.price ? crtM.price : 0;
      }
    });

    props.allData?.tabList2.forEach((item, inx) => {
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id)
      if (crtM) {
        item.quantity = crtM?.quantity ? crtM.quantity : 0;
        item.discountPrice = crtM?.discountPrice ? crtM.discountPrice : 0;
        item.totalPrice = crtM?.totalPrice ? crtM.totalPrice : 0;
        item.remark = crtM?.remark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
        item.price = crtM?.price ? crtM.price : 0;
      }
    });
  }

}

//保存前取值
const setListInfo = (_form: any) => {
  console.log("setListInfo22", checkedTabList1.value);
  //退货单参数set
  if (checkedTabList2) {
    const _tabList2: any = [];
    Object.assign(_tabList2, checkedTabList2.value);
    buildtabList2(_tabList2, _form);
    _form.detailList = _tabList2;
  }
  //收货单参数set
  if (checkedTabList1) {
    const _tabList1: any = [];
    Object.assign(_tabList1, checkedTabList1.value);
    buildtabList1(_tabList1, _form);
    _form.detailList = _form.detailList?.concat(_tabList1);
    console.log("=======setListInfo========_tabList1", _tabList1)
  }
  //设置其他金额
  if (selectedOrderOtherList.value) {
    accountOrderOtherList.value = selectedOrderOtherList.value;
    _form.otherOrderBoList = deepClone(accountOrderOtherList.value);
  }
}

const buildtabList2 = (tabList2: any, _form: any) => {
  tabList2.forEach((item: any) => {
    item.currency = _form.currency ? _form.currency : '';
    item.isTax = item.isTax ? item.isTax : _form.isTax;
    item.status = _form.status;
    item.discountPrice = item.discountPrice ? item.discountPrice : 0;
  });
}

const buildtabList1 = (_tabList1: any, _form: any) => {
  console.log("buildtabList1", _tabList1);
  _tabList1.forEach((item: any) => {
    item.currency = _form.currency ? _form.currency : '';
    item.isTax = item.isTax ? item.isTax : _form.isTax;
    item.status = _form.status;
    item.discountPrice = item.discountPrice ? item.discountPrice : 0;
  });
}

//保存获取tab数据方法
const doSave = async (_form: any) => {
  const vad = await validateForm(_form);
  if (!vad) {
    console.log("校验失败=====rawAccountTab", _form)
    return;
  }
  //得到供应商id
  //Object.assign(outForm.value, inOrOutQuery.value);
  //类型
  //outForm.value.type = TypeEnum.SALE;
  console.log(" tab处理开始======", _form);
  _form.accountPrice = borrowTotalPrice.value;
  _form.accountDiscountPrice = borrowDiscountTotalPrice.value;
  //_form.accountMonth = inOrOutQuery.value.accountMonth;
  _form.otherPrice = BigNumber(otherRecoverTotalPrice.value).minus(BigNumber(otherOutTotalPrice.value)).toNumber();
  let payableAmount = BigNumber(borrowTotalPrice.value).minus(BigNumber(backTotalPrice.value)).minus(BigNumber(otherOutTotalPrice.value)).plus(BigNumber(otherRecoverTotalPrice.value)).toNumber();
  _form.payablePrice = payableAmount;
  _form.remainPayablePrice = payableAmount;
  _form.backPrice = backTotalPrice.value;

  setListInfo(_form);

  console.log(" tab处理完成======", _form);

  emits('doSaveBack', _form);
}

/*********** save验证 ******start*/
const validateForm = async (_form: any) => {
  if (checkedTabList2.value.length == 0
    && checkedTabList1.value.length == 0) {
    //&& accountOrderOtherList.value.length == 0
    proxy?.$modal.msgError("请选择单据");
    return false;
  }


  let res: any = true;
  if (tabRef1) {
    const _table = tabRef1.value.xTableRef;
    const _tableData = _table.getData().filter((item: any) => _table.isCheckedByCheckboxRow(item));
    if (_tableData.length > 0) {
      let errMap = await _table.validate(_tableData);
      if (errMap) {
        res = false;
      }
    }
  }
  if (tabRef2) {
    const _table = tabRef2.value.xTableRef;
    const _tableData = _table.getData().filter((item: any) => _table.isCheckedByCheckboxRow(item));
    if (_tableData.length > 0) {
      let errMap = await _table.validate(_tableData);
      if (errMap) {
        res = false;
      }
    }
  }

  // if (!res) {
  //   return res;
  // }

  const listTab = await validateList(_form);
  res = res && listTab;
  return res;
}
const validateList = async (_form: any) => {
  let finLinValid = true;
  let wangbanValid = true;
  let supplierValid = true;
  let supplierValid2 = true;
  let supplierValid3 = true;

  let taxValid = true;
  let res = true;
  let errMsg = "请填写正确的核对数量、单价、扣款/折扣金额到勾选的单据";
  let wbErrMsg = "请填写正确的核对数量、单价、扣款/折扣金额到勾选的单据";
  let noList = "";
  let wbnoList = "";
  let feiLinSupplier: any;
  let wangbanSupplier: any;

  let formSupplierId = _form.companyId;

  if(!props.supplierQuery){
    formSupplierId=_form.supplierId;
  }
  const formIsTax = _form.isTax;
  if (checkedTabList2.value.length > 0) {
    if(!props.supplierQuery){
      feiLinSupplier = checkedTabList2.value[0]?.supplierId;
    }else{
      feiLinSupplier = checkedTabList2.value[0]?.ownerId;
    }
    supplierValid2 = !checkedTabList2.value.some((item: any) => {
        if(!props.supplierQuery){
          return item.supplierId !== feiLinSupplier;
        }else{
          return item.ownerId !== feiLinSupplier;
        }
    });
    checkedTabList2.value.forEach((item: any) => {
      if (!item.quantity) {
        if (finLinValid) {
          finLinValid = false;
        }
        let code = item.code;
        if (!item.code) {
          code = item.no;
        }
        noList += code + "、";
      }
    });
  }
  if (checkedTabList1.value.length > 0) {
    if(!props.supplierQuery){
      wangbanSupplier = checkedTabList1.value[0]?.supplierId;
    }else{
      wangbanSupplier = checkedTabList1.value[0]?.companyId;
    }

    supplierValid = !checkedTabList1.value.some((item: any) => {
       if(!props.supplierQuery){
              return item.supplierId !== wangbanSupplier;
     }else{
      return item.companyId !== wangbanSupplier;
            }

    });
    checkedTabList1.value.forEach((item: any) => {
      if (!item.quantity) {
        if (wangbanValid) {
          wangbanValid = false;
        }
        let code = item.code;
        if (!item.code) {
          code = item.no;
        }
        wbnoList += code + "、";
      }
    });
  }

if(!props.supplierQuery){

    if (selectedOrderOtherList.value.length > 0) {
      console.log("selectedOrderOtherList",formSupplierId);
      console.log("selectedOrderOtherList",selectedOrderOtherList.value);
    supplierValid2 = !selectedOrderOtherList.value.some((item: any) => {
      return (item.accountOrderDeductionId && item.supplierId !== formSupplierId);
    });
  }
}
  console.log("feiLinSupplier",feiLinSupplier)
  console.log("wangbanSupplier",wangbanSupplier)
  console.log("formSupplierId",formSupplierId)
  if (feiLinSupplier && wangbanSupplier && (feiLinSupplier != wangbanSupplier)) {
    supplierValid = false;
  }
  if (supplierValid) {
    let listSup = feiLinSupplier ? feiLinSupplier : wangbanSupplier;
    if (formSupplierId != listSup ||!formSupplierId) {
      proxy?.$modal.msgError("对账单客户与明细客户不一致，请重新选择");
      supplierValid = false;
      return false;
    }
  }

  if (!supplierValid ||!supplierValid2||!supplierValid3) {
    console.log("supplierValid",supplierValid)
    console.log("supplierValid2",supplierValid2)
    proxy?.$modal.msgError("单据客户不一致，请重新选择");
    return false;
  }
  if (!finLinValid) {
    errMsg += noList;
    proxy?.$modal.msgError(errMsg);
    res = false;
  }
  if (!wangbanValid) {
    wbErrMsg += wbnoList;
    proxy?.$modal.msgError(wbErrMsg);
    res = false;
  }




  return res;
}
/*********** save验证 ******end*/
/************confirm********/
const deductionList = ref<any>([]);
const doConfirm =  () => {
  //设置其他金额
  if (selectedOrderOtherList.value) {
    //遍历selectedOrderOtherList.value中accountOrderDeductionId不为空的
    selectedOrderOtherList.value = selectedOrderOtherList.value.filter(item => item.accountOrderDeductionId);
    deductionList.value = deepClone(selectedOrderOtherList.value);
  }
  console.log("选中的扣款单：",deductionList.value);

}


//监听数据变化
watch(() => props.allData.tabList1, (val: any) => {
  console.log("tabList1 数据变化了");
  if(props.allData.checkedTabList1){
    checkedTabList1.value=props.allData.checkedTabList1;
  }

  setSelectRow();
}, { deep: true, immediate: true })
watch(() => props.allData.tabList2, (val: any) => {
  console.log("tabList2 数据变化了");
  if(props.allData.checkedTabList2){
    checkedTabList2.value=props.allData.checkedTabList2;
  }
  setSelectRow();
}, { deep: true, immediate: true })

//监听其他金额
watch(() => props.editOtherList, (val: any) => {
  accountOrderOtherList.value = props.editOtherList;
  selectedOrderOtherList.value = props.editOtherList;
  nextTick(() => {
    setTimeout(() => {
      if (props.tabName3) {
        otherPriceTableRef.value.xTableRef.setCheckboxRow(selectedOrderOtherList.value, true);
      }
    }, 0);
  })
}, { deep: true, immediate: true })

/**
 * 挂载重置数据，防止上次记录影响
 */
const resetInfo = () => {
  firstInitEditPrice.value = true;
  props.allData.checkedTabList1=[];
  props.allData.checkedTabList2=[];
  props.allData.tabList2 = [];
  props.allData.tabList1 = [];
  checkedTabList2.value = [];
  checkedTabList1.value = [];
  accountOrderOtherList.value = [];
  selectedOrderOtherList.value = [];
  changeOrderList.value = [];
  delPageChangeCheckList.value = [];
  checkedTabList1BgHeight.value = [];

  let _backTabCache = tabRef1.value;
  let _deTabCache = tabRef2.value;
  if (_backTabCache) {
    _backTabCache.xTableRef.clearCheckboxReserve();
    _backTabCache.deleteAll();
    _backTabCache.xTableRef.clearCheckboxRow();
  }
  if (_deTabCache) {
    _deTabCache.xTableRef.clearCheckboxReserve();
    _deTabCache.deleteAll();
    _deTabCache.xTableRef.clearCheckboxRow();
  }
  tabQueryParams2.value = {
    pageNum: 1,
    pageSize: 20
  }
  tabQueryParams.value = {
    pageNum: 1,
    pageSize: 20
  }
}


onMounted(() => {
  tabRadioTable.value = props.tabName1;
  console.log("tab组件挂载完成...");
  resetInfo();
});

defineExpose({ tabQueryParams, tabQueryParams2, doSave, resetInfo, deductionList,doConfirm });
</script>

<style>
.flex_column_display {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
