<template>
  <!-- 编辑成本调整单 -->
  <el-drawer size="70%" v-model="open" :title="props.title" destroy-on-close @close="closeHandle">

    <el-collapse v-model="activeNames" v-loading="dialogLoading" style="margin-top: -10px">
      <el-alert v-if="form.reason && form.status == '4'" :title="buildReason()" type="error" show-icon :closable="false" />
      <el-collapse-item title="基本信息" name="1">
        <el-form :model="form" ref="costAdjustDetailRef" label-width="100px" :rules="rules" v-loading="dialogLoading" :disabled="canEdit()">
          <el-row>
            <el-col :span="7">
              <el-form-item v-if="props.type == '2' || props.title != '新增成本调整单'" label="选择对账单：" label-width="110px" prop="accountOrderCode">
                <el-input :readonly="true" :disabled="true"
                          v-model="form.accountOrderCode"/>
              </el-form-item>
              <el-form-item v-else label="选择对账单：" label-width="110px" prop="accountOrderCode" >
                <el-input :readonly="true" @click="relatedAccount"
                          v-model="form.accountOrderCode"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商：" label-width="140px" prop="supplierName">
                <el-input :disabled="true" v-model="form.supplierName"/>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="调整方式：" label-width="140px" prop="type">
                <template #label>
                    <span>
                      <el-tooltip placement="top">
                        <template #content>按物料调整：针对个别物料的单价进行精确的调整<br/>整单调整：针对整个单据的账单金额进行调整，调整金额将<br/>
                          会均摊到该单据的所有送货单中（没有送货单时会均摊到所<br/>有退货单中）</template>
                        <el-icon> <question-filled/> </el-icon>
                      </el-tooltip>
                      调整方式：
                    </span>
                </template>
                <el-radio-group v-model="form.type">
                  <el-radio :disabled="!props.title?.includes('新增')" label="1">按物料调整</el-radio>
                  <el-radio :disabled="!props.title?.includes('新增')" label="2">整单调整</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="form.type == 2" :span="7">
              <el-form-item label="账单金额：" label-width="110px" prop="accountPrice">
                <el-input type="number" :disabled="true" v-model="form.accountPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="form.type == 2" :span="8">
              <el-form-item label="调整后金额：" label-width="140px" prop="adjustPrice">
                <el-input type="number" v-model="form.adjustPrice" placeholder="请输入调整后金额" precision="2" min="0"
                          @change="calculateALLPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="form.type == 2" :span="7">
              <el-form-item label="差额：" label-width="140px" prop="price">
                <el-input type="number" :disabled="true" v-model="form.price">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注：" label-width="110px" prop="remark">
                <el-input type="textarea" :rows="1" placeholder="请输入备注" v-model="form.remark" maxlength="200"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>

      <el-collapse-item v-if="form.type == '1'" title="调整明细" name="2">
        <el-row>
          <el-radio-group v-model="form.queryType" size="small" @change="customizedQuery">
            <el-radio-button label='1'>采购收货</el-radio-button>
            <el-radio-button label='2'>采购退货</el-radio-button>
          </el-radio-group>
          <el-checkbox style="margin-left: 20px" v-model="form.isAdjust" false-label="0" true-label="1"
                       @change="customizedQuery">仅查看已调整数据
          </el-checkbox>
        </el-row>

        <!-- 收货单明细Table -->
        <XTable v-show="form.type == '1' && form.queryType == 1" toolId="adjustReceiveToolId"
                :pageShow="true" v-model:page-size="receiveQueryParams.pageSize"
                v-model:current-page="receiveQueryParams.pageNum"
                :page-params="{ perfect: true, total: receiveTotal }"
                :data="receiveList"
                height="360"
                :loading="detailLoading"
                :columnList="receiveColumnList"
                ref="xTableRef" border
                :intervalCondition="intervalConditionDetail"
                @searchChange="receiveSearchChange"
                :column-config="{ resizable: true }"
                :showRefresh="true"
        >

          <template #default-deliveryTime="scope">
            <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
          </template>
          <template #default-price="scope">
            <span v-if="scope.row.price > 0">+</span>{{ scope.row.price }}
          </template>
          <template #default-adjustPrice="scope">
            <XInputNumber
              maxLength="11"
              :precision="2"
              style="width: 99%;"
              :controls="false"
              @change="calculatePrice(scope.row)"
              v-model="scope.row.adjustPrice"
            />
          </template>
        </XTable>

        <!-- 退货单明细Table -->
        <XTable v-show="form.type == '1' && form.queryType == 2" toolId="adjustBackToolId"
                :pageShow="true" v-model:page-size="backQueryParams.pageSize"
                v-model:current-page="backQueryParams.pageNum"
                :page-params="{ perfect: true, total: backTotal }"
                :data="backList"
                height="360"
                :loading="detailLoading"
                :columnList="backColumnList"
                ref="xTableRef" border
                @searchChange="backSearchChange"
                :intervalCondition="intervalConditionDetail"
                :column-config="{ resizable: true }"
                :showRefresh="true"
        >

          <template #default-backTime="scope">
            <span>{{ parseTime(scope.row.backTime, '{y}-{m}-{d}') }}</span>
          </template>
          <template #default-price="scope">
            <span v-if="scope.row.price > 0">+</span>{{ scope.row.price }}
          </template>
          <template #default-adjustPrice="scope">
            <XInputNumber
              maxLength="11"
              :precision="2"
              style="width: 99%;"
              :controls="false"
              @change="calculatePrice(scope.row)"
              v-model="scope.row.adjustPrice"
            />
          </template>
        </XTable>
        <el-form border label-width="120px" class="drawer-order-form">
          <el-row>
            <el-col :span="6">
              <el-form-item size="small" label="采购收货调整(元)：" prop="receiveTotalPrice">{{
                  receiveTotalPrice
                }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small" label="采购退货调整(元)：" prop="backTotalPrice">{{
                  backTotalPrice
                }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small" label="合计调整(元)：" prop="totalPrice">{{ totalPrice }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </el-collapse-item>
    </el-collapse>

    <template #footer>
      <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button  :loading="buttonLoading" @click="closeHandle">
              取消
            </el-button>
            <el-button type="primary" v-if="props.title == '新增成本调整单'" :loading="buttonLoading"  @click="saveDraftForm('1')">
              保存草稿
            </el-button>
            <el-button type="primary" v-if="['1', '4'].includes(form.status)" :loading="buttonLoading"  @click="saveDraftForm(undefined)">
              保存草稿
            </el-button>
            <el-button type="primary" v-if="(props.title == '新增成本调整单' || ['1', '4'].includes(form.status))" :loading="buttonLoading"  @click="saveDraftForm('2')">
              提交申请
            </el-button>
            <el-button type="primary" v-if="checkPermi(['inventory:checkPlan:audit']) && form.status == '2'" :loading="buttonLoading"  @click="handleRejectAudit">
              审核驳回
            </el-button>
            <el-button type="primary" v-if="checkPermi(['inventory:checkPlan:audit']) && form.status == '2'" :loading="buttonLoading"  @click="auditPass">
              审核通过
            </el-button>
          </span>
      </div>
    </template>
    <template #title>
      <div style="width: 100%;">
        {{ props.title }}
        <span v-for="item in statusList">
            <el-tag size="large" :type="item.type" v-if="item.value == form.status">{{item.label}}</el-tag>
          </span>
      </div>
    </template>
  </el-drawer>

  <!-- 选择对账单对话框 -->
  <el-dialog v-model="accountDialog.visible" :title="accountDialog.title" width="60%" draggable destroy-on-close>
    <el-row>
      <el-col :span="24">
        <div class="p-2">
          <span style="color: #436399">注意：只能选择未处于成本调整申请中的对账单</span>
        </div>
        <XTable :pageShow="true" :loading="accountLoading" :columnList="accountColumnList"
                v-model:page-size="accountQueryParams.pageSize" v-model:current-page="accountQueryParams.pageNum"
                :page-params="{ perfect: true, total: accountTotal }" border ref="accountTableRef" height="400" size="mini"
                :row-config="{ isCurrent: true, isHover: true, keyField: 'id' }" :data="accountList"
                :intervalCondition="['accountMonth']" :column-config="{ resizable: true }"
                :radio-config="{ trigger: 'row' }" @searchChange="accountSearchChange" @radio-change="selectChangeEvent">

          <template #default-type="scope">
            {{ accountTypeList.find(item => item.value == scope.row.type)?.label }}
          </template>

        </XTable>
      </el-col>
    </el-row>
    <template #footer>
      <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="accountCancel">取消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="submitAccount">确定选择</el-button>
          </span>
      </div>
    </template>
  </el-dialog>

  <!-- 提示信息对话框 -->
  <el-dialog v-model="hintDialog.visible" :title="hintDialog.title" width="30%" align-center destroy-on-close>
    <el-form ref="dialogFormRef" :model="form" :rules="hintRules" label-position="top">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="reason" label="请填写驳回理由">
            <el-input type="textarea" :rows="4" maxlength="200" v-model="form.reason"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div style="display: flex; justify-content: center;">
          <span class="dialog-footer" >
            <el-button @click="hintDialog.visible = false">我再想想</el-button>
            <el-button type="primary" @click="auditReject">确认驳回</el-button>
          </span>
      </div>
    </template>
  </el-dialog>

</template>

<script setup lang="ts" name="SelectMaterial">
import {ref} from "vue";

import {VXETable, VxeTableEvents, VxeTablePropTypes} from "vxe-table";
import {checkPermi} from "@/utils/permission";
import {parseTime} from "@/utils/ruoyi";
import {AdjustOrderForm, AdjustOrderQuery, AdjustOrderVO} from "@/api/financial/adjustOrder/types";
import {AccountOrderVO} from "@/api/financial/accountOrder/types";
import {constAdjustList, listSupplierBackRecord, listSupplierDeliveryRecord} from "@/api/financial/accountOrder";
import {AdjustOrderDetailVO} from "@/api/financial/adjustOrderDetail/types";
import {deepClone} from "@/utils";
import {listAdjustOrderDetail, updateAdjustOrderDetail} from "@/api/financial/adjustOrderDetail";
import {addAdjustOrder, auditAdjustOrder, getAdjustOrder, updateAdjustOrder} from "@/api/financial/adjustOrder";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const attrs = useAttrs()
const emits = defineEmits(['update:show', 'getList', 'close'])
const props = withDefaults(defineProps<{
  show: boolean
  title?: string
  type?: string
  status?: string
  id?: number,
  adjustAllData?:Object
}>(), {
  show: false,
  type: '1',
})

const activeNames = ref(['1', '2'])

const open = computed({
  get() {
    return props.show
  },
  set(val: boolean) {
    emits('update:show', val)
  }
})

// 查询列表事件
const getList = () => {
  emits('getList')
  console.log('查询列表事件')
}

// 取消事件
const closeHandle = () => {
  emits('close')
  console.log('取消事件')
}

const accountDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const hintDialog = reactive<DialogOption>({
  visible: false,
  title: '',
});

/** 驳回理由校验 */
const reasonHandle = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请填写驳回理由'))
  } else {
    callback()
  }
}

const hintRules = reactive<ElFormRules>({
  reason: [
    { required: true, validator: reasonHandle, trigger: 'blur' }
  ],
});

/** 调整金额校验 */
const adjustPriceHandle = (rule: any, value: any, callback: any) => {
  if (form.value.type == '2') {
    if (!value) {
      callback(new Error('请输入调整后金额'))
    } else if (value && (!/^([1-9]\d*|0)(\.\d{1,2})?$/.test(value) || Number(value) == 0)) {
      return new Error('请输入大于0的数字，最多2位小数')
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const initFormData: AdjustOrderForm = {
  id: undefined,
  code: undefined,
  type: undefined,
  status: undefined,
  accountOrderId: undefined,
  accountOrderCode: undefined,
  accountOrderType: undefined,
  price: undefined,
  createTime: undefined,
  auditUserId: undefined,
  auditUserName: undefined,
  auditTime: undefined,
  createByName: undefined,
  reason: undefined,
  remark: undefined,
  queryType: '1',
  isAdjust: '0',
}

const formData = reactive<PageData<AdjustOrderForm, AdjustOrderQuery>>({
  form: {...initFormData},
  queryParams: {
  },
  rules: {
    accountOrderCode: [
      { required: true, message: "对账单不能为空", trigger: "change" }
    ],
    type: [
      { required: true, message: "调整方式不能为空", trigger: "blur" }
    ],
    adjustPrice: [
      { required: true, validator: adjustPriceHandle, trigger: 'blur' }
    ],
  }
});

const { form, rules } = toRefs(formData);

const receiveQueryParams = ref({
  pageNum: 1,
  pageSize: 20,
  onlyAccountOrder: '1',
  params: {}
});
const backQueryParams = ref({
  pageNum: 1,
  pageSize: 20,
  onlyAccountOrder: '1',
  params: {}
});

const statusList = ref([
  {label: '待提交', value: '1', type: 'info' },
  {label: '待审核', value: '2', type: 'warning' },
  {label: '审核通过', value: '3', type: 'success' },
  {label: '审核驳回', value: '4', type: 'danger' },
]);

// TODO: 暂时只做采购对账
const accountTypeList = ref([
  {label: '采购对账', value: '2' },
]);

const accountColumnList = ref([
  {type: 'radio', width: '60', align: "center"},
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
  { title: '供应商名称', field: 'supplierName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入供应商名称'}},
  {width: '110', title: '对账单号', field: 'code', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入对账单号'}},
  {width: '90', title: '账单类型', field: 'type', align: 'center', filterType: 'radio', filterData: () => accountTypeList.value},
  {width: '90', title: '对账月份', field: 'accountMonth', align: 'center', filterType: 'intervalDate',
    filterParam: { placeholder: '请选择对账月份', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  {title: '对账周期', field: 'accountPeriod', align: 'center'},
  {title: '备注', field: 'remark', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入备注'}},
]);

const intervalConditionDetail = ['deliveryTime', 'backTime', 'detailQuantity', 'inOutQuantity'];

const receiveColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '40', fixed: 'left',},
  {title: '送货单号', minWidth: '130', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单号' }},
  {title: '关联采购单号', minWidth: '130', field: 'purchaseCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单号' }},
  {title: '收货日期', field: 'deliveryTime', minWidth: '110',  align: 'center', filterType: 'intervalDate', filterParam: {
      startParams: { placeholder: '请选择开始时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD 00:00:00' },
      endParams: { placeholder: '请选择结束时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD 23:59:59' },
    }},
  {title: '物料编码', field: 'materialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  {title: '物料名称', field: 'name', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  {title: '规格参数', field: 'specificationAll', width: '100', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入规格参数' } },
  {title: '采购总数', field: 'detailQuantity', width: '80', align: 'center', filterType: "intervalNumber" },
  {title: '本次收货', field: 'inOutQuantity', width: '80', align: 'center', filterType: "intervalNumber" },
  {title: '申请备注', field: 'remark', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入备注' } },

  {width: '100', title: '单价(元)', field: 'accountPrice', align: 'center', fixed: 'right'},
  {width: '100', title: '调整后金额(元)', field: 'adjustPrice', align: 'center', fixed: 'right'},
  {width: '100', title: '调整差额(元)', field: 'price', align: 'center', fixed: 'right'},
]);

const backColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '40', fixed: 'left',},
  {title: '退货单号', minWidth: '130', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单号' }},
  {title: '关联采购单号', minWidth: '130', field: 'purchaseCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单号' }},
  {title: '退货日期', field: 'backTime', width: '110', align: 'center', filterType: 'intervalDate', filterParam: {
      startParams: { placeholder: '请选择开始时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD 00:00:00' },
      endParams: { placeholder: '请选择结束时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD 23:59:59' },
    }},
  {title: '物料编码', field: 'materialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  {title: '物料名称', field: 'name', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  {title: '规格参数', field: 'specificationAll', width: '100', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入规格参数' } },
  {title: '本次退货', field: 'inOutQuantity', width: '80', align: 'center', filterType: "intervalNumber" },
  {title: '申请备注', field: 'remark', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入备注' } },

  {width: '100', title: '单价(元)', field: 'accountPrice', align: 'center', fixed: 'right'},
  {width: '100', title: '调整后金额(元)', field: 'adjustPrice', align: 'center', fixed: 'right'},
  {width: '100', title: '调整差额(元)', field: 'price', align: 'center', fixed: 'right'},
]);

const adjustOrderList = ref<AdjustOrderVO[]>([]);
const receiveList = ref<AdjustOrderDetailVO[]>([]);
const receiveCopyList = ref<AdjustOrderDetailVO[]>([]);
const backList = ref<AdjustOrderDetailVO[]>([]);
const backCopyList = ref<AdjustOrderDetailVO[]>([]);

const accountList = ref<any[]>([]);
//选中的对账单
const selectAccount = ref();

const loading = ref(true);
const dialogLoading = ref(false);
const buttonLoading = ref(false);
const detailLoading = ref(false);
const accountLoading = ref(false);

const total = ref(0);
const receiveTotal = ref(0);
const backTotal = ref(0);
const accountTotal = ref(0);

const accountTableRef = ref();
const costAdjustDetailRef = ref<ElFormInstance>();
const dialogFormRef = ref<ElFormInstance>();

const initAccountQuery = {
  pageNum: 1,
  pageSize: 20,
  type: '2',
  params: {}
}

const accountQueryParams = ref(deepClone(initAccountQuery));

/** 选择对账单按钮 */
const relatedAccount = async () => {
  accountDialog.visible = true;
  accountDialog.title = "选择对账单";
  accountQueryParams.value = deepClone(initAccountQuery);
  await getConstAdjustList();
  setTableSelect();
}

/** 设置表格列表选中 */
const setTableSelect = () => {
  const $table = accountTableRef.value.xTableRef
  if ($table) {
    if (selectAccount.value) {
      $table.setRadioRow(selectAccount.value);
    }
  }
}


/** 获取对账单列表 */
const getConstAdjustList = async () => {
  accountLoading.value = true;
  const res = await constAdjustList(accountQueryParams.value);
  accountList.value = res.rows;
  accountTotal.value = res.total;
  accountLoading.value = false;
}

/** 对账单列表查询 */
const accountSearchChange = (params: any) => {
  // TODO: 暂时只做采购对账
  params.statusList = undefined;
  params.type = '2';
  accountQueryParams.value = params
  getConstAdjustList();
}

/** 单选事件 */
const selectChangeEvent: VxeTableEvents.RadioChange<AccountOrderVO> = ({ checked, row }) => {
  selectAccount.value = row;
}

const receiveTotalPrice = ref(0);
const backTotalPrice = ref(0);
const totalPrice = ref(0);

const resetTotal = () => {
  receiveTotalPrice.value = 0;
  backTotalPrice.value = 0;
  totalPrice.value = 0;
  form.value.price = undefined;
  form.value.adjustPrice = undefined;
}

//选择对账单的成本调整单方法
const accountOpenAccount = (params:any) => {
  console.log("props",params);
  if(!params){
    console.log("未选择对账单打开成本调整单");
    return;
  }
  form.value = { ...initFormData };
  selectAccount.value = {};
  receiveList.value = [];
  backList.value = [];
  selectAccount.value =  deepClone(params);
  submitAccount();
}

/** 确认选择对账单 */
const submitAccount = () => {
  // 清空统计数据
  resetTotal();

  form.value.accountOrderId = selectAccount.value?.id;
  form.value.accountOrderCode = selectAccount.value?.code;
  form.value.supplierName = selectAccount.value?.supplierName;
  form.value.accountPrice = selectAccount.value?.payPayablePrice;
  console.log("selectAccount.value",deepClone(selectAccount.value))
  console.log("form.value",deepClone(form.value))
  accountDialog.visible = false;
  // 异步查询对账单下的对账详情
  nextTick(async () => {
    // 分页查询送货单
    getAccountReceiveList();
    // 获取所有数据
    getAccountAllReceiveList();

    // 分页查询退货单
    getAccountBackList();
    // 获取所有数据
    getAccountAllBackList();
  });
}

/** 获取对账单收货列表 */
const getAccountReceiveList = async () => {
  // 增加对账单id
  receiveQueryParams.value.accountOrderId = form.value.accountOrderId;
  receiveQueryParams.value.onlyAccountOrder = '1';
  detailLoading.value = true;
  const res = await listSupplierDeliveryRecord(receiveQueryParams.value).finally(() => detailLoading.value = false);
  receiveList.value = res.rows?.map(item => {
    item.accountPrice = item.price;
    item.price = undefined;
    item.type = '1';
    return item;
  });
  receiveTotal.value = res.total;
}

/** 获取对账单下所有收货列表 */
const getAccountAllReceiveList = async () => {
  // 增加对账单id
  let query = {
    pageNum: 1,
    pageSize: 999999,
    accountOrderId: form.value.accountOrderId,
    onlyAccountOrder: '1'
  }

  const res = await listSupplierDeliveryRecord(query);
  receiveCopyList.value = res.rows?.map(item => {
    item.accountPrice = item.price;
    item.price = undefined;
    item.type = '1';
    return item;
  });
}

/** 获取对账单退货列表 */
const getAccountBackList = async () => {
  // 增加对账单id
  backQueryParams.value.accountOrderId = form.value.accountOrderId;
  backQueryParams.value.onlyAccountOrder = '1';
  detailLoading.value = true;
  const res = await listSupplierBackRecord(backQueryParams.value).finally(() => detailLoading.value = false);
  backList.value = res.rows?.map(item => {
    item.accountPrice = item.price;
    item.price = undefined;
    item.type = '2';
    return item;
  });
  backTotal.value = res.total;
}

/** 获取对账单下所有退货单 */
const getAccountAllBackList = async () => {
  // 增加对账单id
  let query = {
    pageNum: 1,
    pageSize: 999999,
    accountOrderId: form.value.accountOrderId,
    onlyAccountOrder: '1'
  }

  const res = await listSupplierBackRecord(query);
  backCopyList.value = res.rows?.map(item => {
    item.accountPrice = item.price;
    item.price = undefined;
    item.type = '2';
    return item;
  });
}


/** 收货明细列表查询 */
const receiveSearchChange = async (params: any) => {
  receiveQueryParams.value = params;
  if(props.title == '新增成本调整单') {
    await getAccountReceiveList();
    // 缓存中的数据回填
    receiveList.value.map(item => {
      receiveCopyList.value.map(copy => {
        if(copy.accountDetailId == item.accountDetailId) {
          item.adjustPrice = copy.adjustPrice;
          item.price = copy.price;
        }
        return;
      })
    })
  } else {
    searchChangeDetail(receiveQueryParams.value);
    console.log(receiveQueryParams.value)
  }
}

/** 退货明细列表查询 */
const backSearchChange = async (params: any) => {
  backQueryParams.value = params
  if(props.title == '新增成本调整单') {
    await getAccountBackList();
    // 缓存中的数据回填
    backList.value.map(item => {
      backCopyList.value.map(copy => {
        if(copy.accountDetailId == item.accountDetailId) {
          item.adjustPrice = copy.adjustPrice;
          item.price = copy.price;
        }
        return;
      })
    })
  } else {
    searchChangeDetail(receiveQueryParams.value);
  }
}

/** 明细分页查询 */
const searchChangeDetail = async (params: any) => {
  params.type = form.value.queryType;
  params.isAdjust = form.value.isAdjust;
  params.accountOrderId = form.value.accountOrderId;
  params.costAdjustOrderId = form.value.id;
  detailLoading.value = true;
  // 查询明细
  await listAdjustOrderDetail(params).then(detailRes => {
    if(params.type == '1') {
      receiveList.value = detailRes.rows;
      receiveTotal.value = detailRes.total;
    } else {
      backList.value = detailRes.rows;
      backTotal.value = detailRes.total;
    }
  }).finally(() => {detailLoading.value = false});
}

/** 对账单取消 */
const accountCancel = () => {
  accountList.value = [];
  accountDialog.visible = false;
}

/** 计算整单调整价格 */
const calculateALLPrice = () => {
  form.value.price = Number(Number(form.value.adjustPrice) - Number(form.value.accountPrice)).toFixed(2);
}

/** 计算调整后的价格 */
const calculatePrice = (row: any) => {
  console.log('----------', !row.adjustPrice || row.adjustPrice <= 0)
  if (!row.adjustPrice || row.adjustPrice <= 0) {
    proxy?.$modal.msgError('请输入大于0的数字');
    row.price = undefined;
    row.adjustPrice = undefined;
    if(props.title === '新增成本调整单') {
      temporaryData(row);
    }
    return;
  }
  row.price = Number(Number(row.adjustPrice) - Number(row.accountPrice)).toFixed(2);
  // 新增时为缓存数据赋值
  if(props.title === '新增成本调整单') {
    temporaryData(row);
    // 计算总金额
    calculateDetailPrice();
  } else {
    // 计算总金额
    calculateDetailPrice();
    // 暂存数据
    temporaryDetail(row);
  }

}

/** 缓存数据 */
const temporaryData = (row: any) => {
  if(row.type == 1) {
    receiveCopyList.value.map(item => {
      if(item.accountDetailId == row.accountDetailId) {
        item.price = row.price;
        item.adjustPrice = row.adjustPrice;
        return;
      }
    });
  } else {
    backCopyList.value.map(item => {
      if(item.accountDetailId == row.accountDetailId) {
        item.price = row.price;
        item.adjustPrice = row.adjustPrice;
        return;
      }
    });
  }
}

/** 计算整单调整价格 */
const calculateDetailPrice = () => {
  // 新增时统计缓存数据
  if(props.title === '新增成本调整单') {
    receiveTotalPrice.value = receiveCopyList.value ? Number(receiveCopyList.value.reduce((total, item) =>{
      if(item.adjustPrice) {
        return total + (item.adjustPrice * item.quantity);
      } else {
        return total;
      }
    }, 0)).toFixed(2) : 0;
    backTotalPrice.value = backCopyList.value ? Number(backCopyList.value.reduce((total, item) =>{
      if(item.adjustPrice) {
        return total + (item.adjustPrice * item.quantity);
      } else {
        return total;
      }
    }, 0)).toFixed(2) : 0;
  } else {
    receiveTotalPrice.value = receiveList.value ? Number(receiveList.value.reduce((total, item) =>{
      if(item.adjustPrice) {
        return total + (item.adjustPrice * item.quantity);
      } else {
        return total;
      }
    }, 0)).toFixed(2) : 0;
    backTotalPrice.value = backList.value ? Number(backList.value.reduce((total, item) =>{
      if(item.adjustPrice) {
        return total + (item.adjustPrice * item.quantity);
      } else {
        return total;
      }
    }, 0)).toFixed(2) : 0;
  }

  totalPrice.value = Number(Number(receiveTotalPrice.value) - Number(backTotalPrice.value)).toFixed(2);
  form.value.adjustPrice = totalPrice.value;
  form.value.price = Number(form.value.adjustPrice) - Number(form.value.accountPrice);
}

/** 暂存明细修改 */
const temporaryDetail = async (row: any) => {
  // 修改明细
  await updateAdjustOrderDetail(row).finally(() =>{
    // 修改整单金额
    updateAdjustOrder({id: form.value.id, price: form.value.price});
  });
}

/** 单选自定义查询 */
const customizedQuery = async () => {
  detailLoading.value = true;
  if(props.title == '新增成本调整单') {
    if(form.value.isAdjust == '1') {
      receiveList.value = receiveList.value?.filter(item => Number(item.adjustPrice) > 0);
      receiveTotal.value = receiveList.value?.length;
      backList.value = backList.value?.filter(item => Number(item.adjustPrice) > 0);
      backTotal.value = backList.value?.length;
    } else {
      if(form.value.queryType == '1') {
        if(receiveCopyList.value && receiveCopyList.value.length > 0) {
          receiveList.value = deepClone(receiveCopyList.value);
          receiveTotal.value = receiveList.value.length;
        }
      } else {
        if(backCopyList.value && backCopyList.value.length > 0) {
          backList.value = deepClone(backCopyList.value);
          backTotal.value = backList.value.length;
        }
      }
    }
    detailLoading.value = false;
  } else {
    // 查询明细
    searchChangeDetail(form.value.queryType == '1' ? receiveQueryParams.value : backQueryParams.value)
  }
}

/** 保存按钮 */
const saveDraftForm = (status: any) => {
  costAdjustDetailRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      // 修改
      if (form.value.id) {
        let oldStatus = form.value.status;
        if(status) {
          form.value.status = status
        }
        await updateAdjustOrder(form.value).then(()=> proxy?.$modal.msgSuccess("操作成功")).catch(() => form.value.status = oldStatus).finally(() => buttonLoading.value = false);
        open.value = false;
        getList();
      } else {
        // 新增时校验
        // 按物料调整
        if(form.value.type == '1') {
          // 判断是否有调整记录
          let hasAdjustPrice = receiveCopyList.value?.some(item => item.adjustPrice > 0);
          let hasBackAdjustPrice = backCopyList.value?.some(item => item.adjustPrice > 0);
          if (!hasAdjustPrice && !hasBackAdjustPrice) {
            proxy?.$modal.msgError("请至少对一项进行调整");
            buttonLoading.value = false;
            return;
          }
          // 合并receiveList和backList
          if(receiveCopyList.value && receiveCopyList.value.length > 0) {
            form.value.detailList = backCopyList.value ? receiveCopyList.value?.concat(backCopyList.value) : receiveCopyList.value;
          } else if(backCopyList.value && backCopyList.value.length > 0) {
            form.value.detailList = receiveCopyList.value ? backCopyList.value?.concat(receiveCopyList.value) : backCopyList.value;
          }
        } else {
          // 整单调整，只保存送货单，如果送货单为空，则保存退货单
          if (receiveCopyList.value && receiveCopyList.value.length > 0) {
            form.value.detailList = receiveCopyList.value;
          } else {
            form.value.detailList = backCopyList.value;
          }
        }
        // 新增待提交状态
        form.value.status = status;
        await addAdjustOrder(form.value).then(()=> {
          proxy?.$modal.msgSuccess("操作成功");
          open.value = false;
          getList();
        }).catch(() => form.value.status = undefined).finally(() => buttonLoading.value = false);
      }
    }
  });
}

/** 审核驳回按钮 */
const handleRejectAudit = async () => {
  form.value.reason = undefined;
  hintDialog.title = "驳回提示";
  hintDialog.visible = true;
}

/** 审核通过 */
const auditPass = async () => {
  proxy?.$modal.loading("加载中...");
  form.value.status = '3';
  await auditAdjustOrder(form.value).then(()=> proxy?.$modal.msgSuccess("操作成功")).catch(() => form.value.status = '2').finally(() => proxy?.$modal.closeLoading());
  //proxy?.$modal.msgSuccess("操作成功");
  open.value = false;
  hintDialog.visible = false;
  await getList();
}

/** 审核驳回 */
const auditReject = async () => {
  dialogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      proxy?.$modal.loading("加载中...");
      form.value.status = '4';
      await auditAdjustOrder(form.value).then(()=> proxy?.$modal.msgSuccess("操作成功")).catch(() => form.value.status = '2').finally(() => proxy?.$modal.closeLoading());
      //proxy?.$modal.msgSuccess("操作成功");
      open.value = false;
      hintDialog.visible = false;
      await getList();
    }
  });
}

/** 驳回作废原因 */
const buildReason = (): string => {
  return '驳回原因：' + form.value.reason;
}

/** 查询成品调整单详情 */
const getDetail = async (id: number, isAdjust: string) => {
  dialogLoading.value = true;
  detailLoading.value = true;
  const res = await getAdjustOrder(id).finally(() => {dialogLoading.value = false});
  console.log('------------res.data', deepClone(res.data))
  form.value = res.data;
  form.value.queryType = '1';

  console.log('------------getDetail', form.value)
  form.value.isAdjust = isAdjust;

  // 按物料调整需查询明细
  if(form.value.type == '1') {
    // 分页查询送货明细数据
    let query = {
      pageNum: 1,
      pageSize: 20,
      accountOrderId: res.data.accountOrderId,
      costAdjustOrderId: res.data.id,
      isAdjust: isAdjust,
      type: '1'
    }
    await listAdjustOrderDetail(query).then(detailRes => {
      receiveList.value = detailRes.rows;
      receiveTotal.value = detailRes.total;
    }).finally(() => {detailLoading.value = false});
    // 查询退货明细数据
    query.type = '2';
    await listAdjustOrderDetail(query).then(detailRes => {
      backList.value = detailRes.rows;
      backTotal.value = detailRes.total;
    });
    // 计算总价
    calculateDetailPrice();
  }
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  selectAccount.value = {};
  receiveList.value = [];
  backList.value = [];
  resetTotal();
}

/** 是否可以编辑 */
const canEdit = (): boolean => {
  return !(['1','4'].includes(form.value.status) || props.title == '新增成本调整单');
}

watch(() => open.value, (value) => {
  if (value) {
    if(props.type == '2'){
      console.log("==============对账单打开调整单不需要重置");
      return;
    }
    reset();
    if (props.status == '1') {
      getDetail(props.id, '0')
    } else if (props.status == '2') {
      getDetail(props.id, '1')
    }
  }
})
defineExpose({ accountOpenAccount,submitAccount });
</script>

<style lang="scss" scoped>
:deep(.el-collapse-item__content) {
  padding-bottom: 1px !important;
}
</style>
