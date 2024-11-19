<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <div style="float:right;">
          <el-button type="primary" v-if="checkPermi(['financial:costAdjust:add'])" @click="handleAdd">新增成本调整单</el-button>
          <el-button type="primary" v-if="checkPermi(['financial:costAdjust:export'])" @click="handleExport">导出</el-button>
        </div>
      </template>

      <XTable v-if="checkPermi(['financial:costAdjust:listView'])" toolId="costAdjustTableId"
              height="100%"
              class="xtable-content"
              v-model:page-size="queryParams.pageSize"
              v-model:current-page="queryParams.pageNum"
              :page-params="{ perfect: true, total: total }"
              :data="adjustOrderList"
              :columnList="columnList" :loading="loading"
              ref="adjustTableRef"
              border :showRefresh="true"
              @searchChange="searchChange"
              :intervalCondition="intervalCondition"
      >
        <template #default-status="scope">
          {{ statusList.find(item => item.value == scope.row.status)?.label }}
        </template>
        <template #default-type="scope">
          {{ typeList.find(item => item.value == scope.row.type)?.label }}
        </template>
        <template #default-accountOrderType="scope">
          {{ accountTypeList.find(item => item.value == scope.row.accountOrderType)?.label }}
        </template>

        <template #default-make="scope">
          <el-button link type="primary" v-if="checkPermi(['financial:costAdjust:detail'])" @click="handleDetail(scope.row.id)">
            详情
          </el-button>
          <el-button link type="primary" v-if="checkPermi(['financial:costAdjust:edit']) && ['1','4'].includes(scope.row.status)" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button link type="primary" v-if="checkPermi(['financial:costAdjust:audit']) && scope.row.status == '2'"
                     @click="handleAudit(scope.row)">
            审核
          </el-button>
          <el-button link type="primary" v-if="checkPermi(['financial:costAdjust:del']) && ['1','4'].includes(scope.row.status)" @click="handleDel(scope.row)">
            删除
          </el-button>
        </template>
      </XTable>
    </el-card>

    <!-- 详情对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="70%" :before-close="closeDetail">
      <el-alert v-if="form.reason && form.status == '4'" :title="buildReason()" type="error" show-icon :closable="false" />

      <div class="el-table el-table--enable-row-hover el-table--medium">
        <table style="width: 100%">
          <tbody>
          <tr>
            <td class="el-table__cell is-leaf">
              <div class="cell">调整单号</div>
            </td>
            <td class="el-table__cell is-leaf">
              <div class="cell">{{ form.code }}</div>
            </td>
            <td class="el-table__cell is-leaf">
              <div class="cell">关联对账单</div>
            </td>
            <td class="el-table__cell is-leaf">
              <div class="cell">{{ form.accountOrderCode }}</div>
            </td>
            <td class="el-table__cell is-leaf">
              <div class="cell">供应商</div>
            </td>
            <td class="el-table__cell is-leaf">
              <div class="cell">{{ form.supplierName }}</div>
            </td>
          </tr>

          <tr>
            <td v-show="form.type == 1" class="el-table__cell is-leaf">
              <div class="cell">调整方式</div>
            </td>
            <td v-show="form.type == 1" class="el-table__cell is-leaf">
              <div class="cell">{{ typeList.find(item => item.value == form.type)?.label }}</div>
            </td>
            <td class="el-table__cell is-leaf">
              <div class="cell">备注</div>
            </td>
            <td colspan="3" class="el-table__cell is-leaf">
              <div class="cell">{{ form.remark }}</div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <el-collapse v-model="activeNames" v-loading="dialogLoading" style="margin-top: -10px">
        <el-collapse-item v-if="form.type == '1'"  title="调整明细" name="2" >
          <el-row>
              <el-radio-group  v-model="form.queryType" size="small" @change="customizedQuery">
                <el-radio-button label='1'>采购收货</el-radio-button>
                <el-radio-button label='2'>采购退货</el-radio-button>
              </el-radio-group>
              <el-checkbox style="margin-left: 20px" v-model="form.isAdjust" false-label="0" true-label="1" @change="customizedQuery">仅查看已调整数据</el-checkbox>
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
              <span v-if="scope.row.price > 0">+</span>{{scope.row.price}}
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
              <span v-if="scope.row.price > 0">+</span>{{scope.row.price}}
            </template>
          </XTable>
          <el-form border label-width="120px" class="drawer-order-form">
            <el-row>
              <el-col :span="6">
                <el-form-item size="small" label="采购收货调整(元)：" prop="receiveTotalPrice">{{ receiveTotalPrice }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item size="small" label="采购退货调整(元)：" prop="backTotalPrice">{{ backTotalPrice }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item size="small" label="合计调整(元)：" prop="totalPrice">{{ totalPrice }}</el-form-item>
              </el-col>
            </el-row>
          </el-form>

        </el-collapse-item>
        <el-collapse-item v-if="form.type == '2'" title="调整明细" name="3">
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table style="width: 60%">
              <tbody>
              <tr>
                <td class="el-table__cell is-leaf" style="width: 17%;">
                  <div class="cell">账单金额(元)</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">{{ form.accountPrice }}</div>
                </td>
                <td class="el-table__cell is-leaf" style="width: 17%;">
                  <div class="cell">调整后金额(元)</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">{{ form.adjustPrice }}</div>
                </td>
              </tr>

              <tr>
                <td class="el-table__cell is-leaf" style="width: 21%;">
                  <div class="cell">差额(元)</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">{{ form.price }}</div>
                </td>
                <td class="el-table__cell is-leaf" style="width: 21%;">
                  <div class="cell">调整方式</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">{{ typeList.find(item => item.value == form.type)?.label }}</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-collapse-item>
      </el-collapse>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="closeDetail">
              关闭
            </el-button>
          </span>
        </div>
      </template>
      <template #title>
        <div style="width: 100%;">
          {{ dialog.title }}
          <span v-for="item in statusList">
            <el-tag size="large" :type="item.type" v-if="item.value == form.status">{{item.label}}</el-tag>
          </span>
        </div>
      </template>
    </el-drawer>

    <!-- 编辑成本调整单 -->
    <EditCostAdjust :status="status"
                    :id="adjustId"
                    :title="editDialog.title"
                    :type="'1'"
                    v-model:show="editDialog.visible"
                    @getList="getList"
                    @close="cancel">
    </EditCostAdjust>
  </div>
</template>

<script setup name="CostAdjust" lang="ts">
import {ref} from "vue";

import {checkPermi} from "@/utils/permission";

import {
  addAdjustOrder,
  auditAdjustOrder, delAdjustOrder,
  getAdjustOrder,
  listAdjustOrder,
  updateAdjustOrder
} from "@/api/financial/adjustOrder";
import {AdjustOrderForm, AdjustOrderQuery, AdjustOrderVO} from "@/api/financial/adjustOrder/types";
import {constAdjustList, listSupplierBackRecord, listSupplierDeliveryRecord} from "@/api/financial/accountOrder";
import {VxeTableEvents} from "vxe-table";
import {AccountOrderVO} from "@/api/financial/accountOrder/types";
import {AdjustOrderDetailVO} from "@/api/financial/adjustOrderDetail/types";
import {parseTime} from "@/utils/ruoyi";
import {listAdjustOrderDetail, updateAdjustOrderDetail} from "@/api/financial/adjustOrderDetail";
import {deepClone} from "@/utils";
import dayjs from "dayjs";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const adjustOrderList = ref<AdjustOrderVO[]>([]);
const receiveList = ref<AdjustOrderDetailVO[]>([]);
const receiveCopyList = ref<AdjustOrderDetailVO[]>([]);
const backList = ref<AdjustOrderDetailVO[]>([]);
const backCopyList = ref<AdjustOrderDetailVO[]>([]);

const accountList = ref<any[]>([]);
//选中的对账单
const selectAccount = ref<AccountOrderVO>();

const accountTableRef = ref();

const loading = ref(true);
const dialogLoading = ref(false);
const buttonLoading = ref(false);
const detailLoading = ref(false);

const total = ref(0);
const receiveTotal = ref(0);
const backTotal = ref(0);

const receiveTotalPrice = ref(0);
const backTotalPrice = ref(0);
const totalPrice = ref(0);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const editDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const activeNames = ref(['1','2','3'])

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

/** 调整金额校验 */
const adjustPriceHandle = (rule: any, value: any, callback: any) => {
  if (form.value.type == '2' && !value) {
    callback(new Error('请输入调整后金额'))
  } else {
    callback()
  }
}

const data = reactive<PageData<AdjustOrderForm, AdjustOrderQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: undefined,
    status: undefined,
    statusList: undefined,
    accountOrderCode: undefined,
    accountOrderType: undefined,
    price: undefined,
    createTime: undefined,
    createByName: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    auditTime: undefined,
    remark: undefined,
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

const { queryParams, form, rules } = toRefs(data);

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

const adjustTableRef = ref()


const intervalCondition = ['adjustPrice', 'createTime', 'auditTime'];

const statusList = ref([
  {label: '待提交', value: '1', type: 'info' },
  {label: '待审核', value: '2', type: 'warning' },
  {label: '审核通过', value: '3', type: 'success' },
  {label: '审核驳回', value: '4', type: 'danger' },
]);

const typeList = ref([
  {label: '按物料调整', value: '1' },
  {label: '整单调整', value: '2' },
]);

// TODO: 暂时只做采购对账
const accountTypeList = ref([
  {label: '采购对账', value: '2' },
]);

const columnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
  {title: '调整单号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入调整单号' } },
  {title: '单据状态', width: '100', field: 'status', align: 'center', filterType: 'checkboxButton', filterData: () => statusList.value},
  {title: '调整方式', width: '100', field: 'type', align: 'center', filterType: 'radio', filterData: () => typeList.value},
  {title: '关联对账单', width: '140', field: 'accountOrderCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入关联对账单' }},
  {title: '关联单据类型', width: '120', field: 'accountOrderType', align: 'center', filterType: 'radio', filterData: () => accountTypeList.value},
  {title: '调整金额(元)', width: '120', field: 'adjustPrice', align: 'center', filterType: "intervalNumber"},
  {title: '申请人', width: '100', field: 'createByName', align: 'center', filterType: "input", filterParam: { placeholder: '请输入名称' }},
  {title: '申请时间', width: '150', field: 'createTime', align: 'center', filterType: 'intervalDate', filterParam: {
      startParams: { placeholder: '请选择开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请选择结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }},
  {title: '审核人', width: '100', field: 'auditUserName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入名称' }},
  {title: '审核时间', width: '150', field: 'auditTime', align: 'center', filterType: 'intervalDate', filterParam: {
      startParams: { placeholder: '请选择开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请选择结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }},
  {title: '备注', field: 'remark', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入备注' }},
  {title: '操作', width: '140', field: 'make', align: 'center', },
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

// 获取 搜索条件
const searchChange = (params: any) => {
  if (params) {
    params.statusList = params.status;
    params.status = undefined;
  }
  queryParams.value = params
  getList()
}

/** 查询成品调整单列表 */
const getList = async () => {
  loading.value = true;
  const res = await listAdjustOrder(queryParams.value).finally(() => {loading.value = false});
  adjustOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 详情按钮操作 */
const handleDetail = async (id: number) => {
  dialog.title = '成本调整单详情'
  dialog.visible = true;
  await getDetail(id, '1');
}

/** 查询成品调整单详情 */
const getDetail = async (id: number, isAdjust: string) => {
  dialogLoading.value = true;
  detailLoading.value = true;
  const res = await getAdjustOrder(id).finally(() => {dialogLoading.value = false});
  form.value = res.data;
  form.value.queryType = '1';
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

/** 新增成本调整单 */
const handleAdd = async () => {
  editDialog.title = "新增成本调整单";
  editDialog.visible = true;
  status.value = '0';
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  selectAccount.value = {};
  receiveList.value = [];
  backList.value = [];
  resetTotal();
}

const resetTotal = () => {
  receiveTotalPrice.value = 0;
  backTotalPrice.value = 0;
  totalPrice.value = 0;
  form.value.price = undefined;
  form.value.adjustPrice = undefined;
}

/** 取消 */
const cancel = () => {
  editDialog.visible = false;
  getList();
}

/** 关闭取消 */
const closeDetail = () => {
  reset();
  dialog.visible = false;
}

/** 收货明细列表查询 */
const receiveSearchChange = async (params: any) => {
  receiveQueryParams.value = params;
  searchChangeDetail(receiveQueryParams.value);
}

/** 退货明细列表查询 */
const backSearchChange = async (params: any) => {
  backQueryParams.value = params
  searchChangeDetail(receiveQueryParams.value);
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

/** 计算整单调整价格 */
const calculateDetailPrice = () => {
  receiveTotalPrice.value = receiveList.value ? Number(receiveList.value.reduce((total, item) => {
    if (item.adjustPrice) {
      return total + (item.adjustPrice * item.quantity);
    } else {
      return total;
    }
  }, 0)).toFixed(2) : 0;
  backTotalPrice.value = backList.value ? Number(backList.value.reduce((total, item) => {
    if (item.adjustPrice) {
      return total + (item.adjustPrice * item.quantity);
    } else {
      return total;
    }
  }, 0)).toFixed(2) : 0;

  totalPrice.value = Number(Number(receiveTotalPrice.value) - Number(backTotalPrice.value)).toFixed(2);
  form.value.adjustPrice = totalPrice.value;
  form.value.price = Number(form.value.adjustPrice) - Number(form.value.accountPrice);
}

/** 驳回作废原因 */
const buildReason = (): string => {
  return '驳回原因：' + form.value.reason;
}

const adjustId = ref();
const status = ref();

/** 编辑按钮操作 */
const handleEdit = async (row: any) => {
  editDialog.visible = true;
  editDialog.title = '编辑成本调整单'
  adjustId.value = row.id;
  status.value = '1';
}

/** 审核按钮操作 */
const handleAudit = async (row: any) => {
  editDialog.visible = true;
  editDialog.title = '成本调整单详情'
  adjustId.value = row.id;
  status.value = '2';
}

/** 单选自定义查询 */
const customizedQuery = async () => {
  detailLoading.value = true;
  // 查询明细
  searchChangeDetail(form.value.queryType == '1' ? receiveQueryParams.value : backQueryParams.value)
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

/** 删除按钮操作 */
const handleDel = async (row?: any) => {
  await proxy?.$modal.confirm('是否确认【删除】单号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delAdjustOrder(row.id).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = async () => {
  const $table = adjustTableRef.value.xTableRef;
  let hasSearch = false
  if ($table) {
    // 判断是否有筛选条件
    let params = deepClone(queryParams.value)
    delete params?.pageNum
    delete params?.pageSize
    for (let key in params) {
      if (Array.isArray(params[key]) && params[key]?.length) {
        params[key].map((m) => {
          if (!!m) {
            // 判断是否有值，有值则说明有筛选条件，用于判断数组
            hasSearch = true
          }
        })
      } else if (!!params[key]) {
        // 判断是否有值，有值则说明有筛选条件
        hasSearch = true
      }
    }
    if (!hasSearch) {
      // 无筛选条件，只导出1w，并提示
      await proxy?.$modal.confirm('未选择任何筛选条件，系统将默认按照接单时间导出近30天的数据', {
        confirmButtonText: '确认导出',
        cancelButtonText: '取消',
        type: ''
      })
    }
  }
  queryParams.value.hasSearch = hasSearch
  proxy?.download('financial/adjustOrder/export',  {...queryParams.value, tableName: 'costAdjustTableId'},
    `成本调整单_${dayjs(new Date()).format("YYYY-MM-DD")}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
// 去除 数字表单 上下按钮
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none !important;
}
:deep(input::-webkit-outer-spin-button) {
  -webkit-appearance: none !important;
}
:deep(input[type="number"]) {
  -moz-appearance: textfield !important;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 1px !important;
}

</style>
