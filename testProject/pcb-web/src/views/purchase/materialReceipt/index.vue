<template>
  <div class="p-2 xtable-page">
      <el-tabs v-if="checkPermi(['purchase:receipt:listView'])" v-model="editableTabsValue" @tab-change="getVoidedList()" class="xtable-tab">
        <el-tab-pane label="待收货列表" :name="1">
          <div class="head-btn-flex" v-if="checkPermi(['purchase:receipt:receive'])">
            <el-button :loading="buttonLoading" v-if="checkPermi(['purchase:receipt:receive'])" type="primary" @click="handleGenerate()">收货</el-button>
          </div>
          <!-- 展开行 -->
          <XTable toolId="purchaseMaterialReceipt" v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum"
          :checkbox-config="{  highlight: true }" :showRefresh="true"
          :page-params="{ perfect: true, total: total }" :data="rawMaterialDeliveryList" :columnList="columnList"

                  ref="xTableHandle"
          :scroll-x="{enabled: true}" height="100%" class="xtable-content"
          :scroll-y="{enabled: true}" :loading="loading"
          border @searchChange="searchChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
          <template #default-make="scope">
            <el-button link type="primary" v-if="checkPermi(['purchase:receipt:receive'])" @click="handleDelivery(scope.row)">收货</el-button>
          </template>
          </XTable>

        </el-tab-pane>
        <el-tab-pane label="收货列表" width="100%" :name="2">
          <div class="head-btn-flex" v-if="checkPermi(['purchase:receipt:adjust'])">
            <el-button :loading="buttonLoading" v-if="checkPermi(['purchase:receipt:adjust'])" type="primary" @click="handleAdjustList()">批量收货调整</el-button>
          </div>
          <XTable toolId="purchaseMaterialReceiptReceive" v-model:page-size="queryParamsTwo.pageSize" v-model:current-page="queryParamsTwo.pageNum"
          :checkbox-config="{  highlight: true }" :showRefresh="true"
          :page-params="{ perfect: true, total: total }" :data="materialOrderList2" :columnList="resColumnList" ref="xAdjustTableHandle"
          :scroll-x="{enabled: true}" height="100%" class="xtable-content"
                  :intervalCondition="['purchaseTime','createTime']"
          :scroll-y="{enabled: true}"
          :loading="loading"
          border @searchChange="searchChange2" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">

            <template #default-make="scope">
              <el-button link type="primary" v-if="checkPermi(['purchase:receipt:adjust'])" @click="handleAdjust(scope.row)">收货调整</el-button>
              <el-button link type="primary" v-if="checkPermi(['purchase:receipt:record'])" @click="handleRecord(scope.row)">修改记录</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="收货调整审核" width="100%" :name="3">
          <div class="head-btn-flex" v-if="checkPermi(['purchase:receipt:audit'])">
            <el-button :loading="buttonLoading" v-if="checkPermi(['purchase:receipt:audit'])" type="primary" @click="handleBatchAudit()">批量审核</el-button>
          </div>
          <XTable toolId="purchaseMaterialAdjustReceive" v-model:page-size="adjustQueryParams.pageSize" v-model:current-page="adjustQueryParams.pageNum"
                  :checkbox-config="{ checkMethod: tabCheckMethod, highlight: true }" :showRefresh="true"
                  :page-params="{ perfect: true, total: adjustTotal }" :data="adjustList" :columnList="adjustColumnList" ref="xAuditTableHandle"
                  :scroll-x="{enabled: true}" height="100%" class="xtable-content"
                  :intervalCondition="['purchaseTime','createTime','auditTime', 'beforeQuantity', 'quantity']"
                  :scroll-y="{enabled: true}"
                  :loading="loading"
                  border @searchChange="searchChangeAdjust" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
            <template #default-status="scope">
              {{ statusList.find(item => item.value == scope.row.status)?.label }}
            </template>
            <template #default-make="scope">
              <el-button v-if="scope.row.status == '1' && checkPermi(['purchase:receipt:audit'])" link type="primary" @click="handleAudit(scope.row)">审核</el-button>
            </template>
          </XTable>
        </el-tab-pane>

      </el-tabs>

    <!-- 收货 -->
    <el-drawer v-model="dialogExamine.visible" title="物料收货" center size="95%" draggable destroy-on-close>
      <!-- 主体 -->
      <div class="ptable-card">
      <el-form :label-position="labelPosition" border label-width="100px" :model="formInline">
        <el-row>

          <el-col :span="12">
            <el-form-item size="small" label="收货人：">
              <!--当前登录用户-->
              <el-input v-model="formInline.userName" placeholder="username" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="收货日期">
              <el-input v-model="formInline.receiptDate" placeholder="receiptDate" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>


      <XTable
          :page-show="false"
          border toolId="purchaseMaterialReceiptReceiveTab"
          keep-source
          align="center"
          height="100%"
          class="ptable-content"

          show-overflow
          ref="xTable"
          :loading="loading"
          :columnList="tabResColumnList"
          :column-config="{ resizable: true }"
          :data="otherReceiptList"
          :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
          >
          <!-- :column-config="{resizable: true}" -->
          <!-- :edit-rules="validRules" -->
          <template #edit-expirationDays="{ row }">
            <el-input v-model="row.expirationDays"></el-input>
          </template>
          <template #edit-recQuantity="{ row }">
            <el-input-number v-model="row.recQuantity" :min="0.01" :precision="2" :controls="false" style="width: 100%;"></el-input-number>
          </template>
          <template #edit-productionDate="{ row }">
            <el-date-picker style="width: 100%" size="small" v-model="row.productionDate" type="date"
                            placeholder="选择日期" value-format="YYYY-MM-DD" format="YYYY-MM-DD"
                            clearable @change="dispatchTimeChange(row)"/>
          </template>
          <template #edit-storageId="{ row }">
            <vxe-select v-model="row.storageId" placeholder="请选择转入仓">
              <vxe-option v-for="item in storageOptions" :key="item.id" :label="item.name" :value="item.id" />
            </vxe-select>
          </template>
          <template #default-storageId="{ row }">
            <vxe-select v-model="row.storageId" readOnly>
              <vxe-option v-for="item in storageOptions" :key="item.id" :label="item.name" :value="item.id" />
            </vxe-select>
          </template>
          <template #edit-remark="{ row }">
            <el-input v-model="row.remark"></el-input>
          </template>
          <template #edit-make="{ row }">
               <el-button size="small" link type="primary"   @click="saveRowEvent(row)">保存</el-button>
               <el-button  size="small" link type="primary"    @click="cancelRowEvent(row)">取消</el-button>
          </template>
          <template #default-make="{ row }">
              <el-button size="small" type="primary"   link @click="copyRowEvent(row)">复制</el-button>
              <el-button size="small" type="primary"   link @click="deleteRowEvent(row,rowIndex)">删除</el-button>
          </template>

      </XTable>
      </div>

      <template #footer>
        <el-button :loading="buttonLoading" type="primary" @click="savaReceive">保存</el-button>
        <el-button :loading="buttonLoading" @click="dialogExamine.visible = false">关闭</el-button>
      </template>
    </el-drawer>

    <!-- 库存锁定提示框 -->
    <InventoryLock title="物料盘点提示" inventoryType="2" v-model:show="inventoryCheck" :data="inventoryRes" @close="inventoryCheck = false"/>

    <!-- 收货调整审核 -->
    <AdjustMaterial v-if="isAudit" :isAudit="isAudit"
                    :tableToolId="auditToolId"
                    :total="auditTotal"
                    :data="auditAdjustList"
                    :title="drawer.title"
                    :type="'1'"
                    :queryParams="receiveQueryParams"
                    v-model:loading="receiveLoading"
                    v-model:show="drawer.visible"
                    :columnList="adjustAuditColumnList"
                    :buttonLoading="adjustLoading"
                    @confirm="submitAdjust"
                    @remove="removeRow"
                    @audit="auditAdjust('2')"
                    @reject="auditAdjust('3')"
                    @close="drawer.visible = false">
    </AdjustMaterial>

    <!-- 收货调整 -->
    <AdjustMaterial v-else :isAudit="isAudit"
                    :tableToolId="receiveToolId"
                    :total="receiveTotal"
                    :data="receiptAdjustList"
                    :title="drawer.title"
                    :type="'1'"
                    :queryParams="receiveQueryParams"
                    v-model:loading="receiveLoading"
                    v-model:show="drawer.visible"
                    :columnList="adjustAddColumnList"
                    :buttonLoading="adjustLoading"
                    @confirm="submitAdjust"
                    @remove="removeRow"
                    @close="drawer.visible = false">
    </AdjustMaterial>

    <!-- 校验提示信息 -->
    <el-dialog v-model="dialogVerify.visible" :title="dialogVerify.title" width="40%" draggable destroy-on-clos>
      <div class="p-2" style="font-weight: 600;">
        以下单据中物料的上一个调整申请正在审核中，请等待调整结束后再进行操作：
      </div>
      <XTable :pageShow="false" :showHead="false" max-height="500px" :data="verifyList" :columnList="verifyColumnList">
        <template #default-errorDetail="{ row }">
          <template v-if="row.errorDetail?.length">
            <div v-for="item in row.errorDetail">{{ item }}</div>
          </template>
        </template>
      </XTable>

      <template #footer>
        <el-button @click="dialogVerify.visible = false">我知道了</el-button>
      </template>
    </el-dialog>

    <!-- 校验库存提示信息 -->
    <el-dialog v-model="dialogQuantity.visible" :title="dialogQuantity.title" width="40%" draggable destroy-on-clos>
      <div class="p-2" style="font-weight: 600;">
        <span style="color: rgba(93, 125, 179, 1);">*以下物料的当前库存不足扣减，请手动还料后再进行操作</span>
      </div>
      <XTable :pageShow="false" :showHead="false" max-height="500px" :data="quantityList" :columnList="quantityColumnList" />

      <template #footer>
        <el-button @click="dialogQuantity.visible = false">我知道了</el-button>
      </template>
    </el-dialog>

    <!-- 物料调整记录 -->
    <AdjustMaterialRecord
      :title="dialogRecord.title"
      :type="'1'"
      :selectMaterial="selectRawMaterial"
      v-model:show="dialogRecord.visible"
      @close="dialogRecord.visible = false">
    </AdjustMaterialRecord>
  </div>
</template>

<script setup name="MaterialReceipt" lang="ts">
import {
  addMaterialOrder,
  delMaterialOrder,
  getMaterialOrder,
  getMaterialOrderDetilList,
  updateDetailStatusClose,
  updateDetailStatusOpen,
  updateMaterialOrder
} from '@/api/purchase/materialOrder';
import {
  DirectMaterialOrderDetail,
  MaterialOrderForm,
  MaterialOrderQuery,
  MaterialOrderVO
} from '@/api/purchase/materialOrder/types';
import {ref} from 'vue'
import {VxeColumnPropTypes, VXETable, VxeTableEvents, VxeTableInstance, VxeTablePropTypes} from 'vxe-table'
import {MaterialOrderDetailVO} from "@/api/purchase/materialOrderDetail/types";
import dayjs from "dayjs";
import useUserStore from "@/store/modules/user";
import {OrderVO} from "@/api/order/directOrder/types";
import {deepClone} from "@/utils";
import {listQueryMaterialReceive, saveMaterialOrderDetailInout} from "@/api/purchase/materialReceive";
import {MaterialReceiveVO} from "@/api/purchase/materialReceive/types";
import {MaterialStorageVO} from "@/api/purchase/materialStorage/types";
import {listRawMaterialDelivery} from "@/api/purchase/rawMaterialDelivery";
import {RawMaterialDeliveryVO} from "@/api/purchase/rawMaterialDelivery/types";
import {listMaterialStorage} from "@/api/purchase/materialStorage";
import {ElMessage} from "element-plus";
import {
  listMaterialOrderDetail,
  listPurchaseMaterialOrderDetail,
  listPurchaseMaterialReceiptOrderDetail
} from "@/api/purchase/materialOrderDetail";
import {UserVO} from "@/api/system/user/types";
import {listUserByRoleKey} from "@/api/system/user";
import {listMaterialInventoryInfo} from "@/api/purchase/materialApply";
import {MaterialQuantityAdjustVO} from "@/api/purchase/materialQuantityAdjust/types";
import {
  addQuantityAdjustList, auditQuantityAdjust, listMaterialQuantityAdjust,
  listQuantityAdjust, listReceiveQuantityAdjust
} from "@/api/purchase/materialQuantityAdjust";
import {checkPermi} from "@/utils/permission";
import { decryptBase64ByStr } from '@/utils/crypto'

const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const materialOrderList = ref<MaterialOrderVO[]>([]);
const materialOrderList2 = ref<MaterialReceiveVO[]>([]);
const otherReceiptList = ref<MaterialOrderDetailVO[]>([]);
const otherList = ref<MaterialOrderVO[]>([]);
const xTable = ref<VxeTableInstance<MaterialOrderDetailVO>>();
const xTableHandle = ref<VxeTableInstance<MaterialOrderDetailVO>>();

const adjustList = ref<MaterialQuantityAdjustVO[]>([]);
const receiptAdjustList = ref<MaterialQuantityAdjustVO[]>([]);
const auditAdjustList = ref<MaterialQuantityAdjustVO[]>([]);
const verifyList = ref<MaterialQuantityAdjustVO[]>([]);
const quantityList = ref<MaterialQuantityAdjustVO[]>([]);

const xAdjustTableHandle = ref();
const xAuditTableHandle = ref();
const isAudit = ref(false);

const {material_order_detail_status} = toRefs<any>(proxy?.useDict("material_order_detail_status"));

const {material_order_status} = toRefs<any>(proxy?.useDict("material_order_status"));

const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

//仓库
let storageOptions: MaterialStorageVO[] = [];

//领用人 收货
const wllyjsOptions = ref<UserVO[]>([]);

const queryFormRef = ref<ElFormInstance>();
const materialOrderFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const dialogExamine = reactive<DialogOption>({
  visible: false,
  title: '物料收货'
});

const dialogMaterial = reactive<DialogOption>({
  visible: false,
  title: '审核'
});

const dialogVerify = reactive<DialogOption>({
  visible: false,
  title: '提示'
});

const dialogQuantity = reactive<DialogOption>({
  visible: false,
  title: '库存不足提醒'
});

const dialogRecord = reactive<DialogOption>({
  visible: false,
  title: '修改记录'
});

const drawer = reactive<DialogOption>({
  visible: false,
  title: '物料收货调整'
});

const receiveQueryParams = ref({
  pageNum: 1,
  pageSize: 99999,
  type: '1',
  params: {}
});

const adjustQueryParams = ref({
  pageNum: 1,
  pageSize: 20,
  type: '1',
  params: {}
});

const receiveToolId = ref('purchaseMaterialReceiptAdjustTab');
const auditToolId = ref('purchaseMaterialAuditAdjustTab');
const receiveTotal = ref(0);
const auditTotal = ref(0);
const receiveLoading = ref(false);
const adjustLoading = ref(false);

const adjustTotal = ref(0);

const seqFixed = ref<VxeColumnPropTypes.Fixed>()
const expandFixed = ref<VxeColumnPropTypes.Fixed>()
const ageFixed = ref<VxeColumnPropTypes.Fixed>()
//const rawMaterialDeliveryList = ref<RawMaterialDeliveryVO[]>([]);
const rawMaterialDeliveryList = ref<MaterialOrderDetailVO[]>([]);
const checkTempList = ref([])

const toggleExpandFixed = () => {
  expandFixed.value = expandFixed.value ? null : 'left'
}

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
  status: undefined
}
const data = reactive<PageData<MaterialOrderForm, MaterialOrderQuery>>({
  form: {...initFormData},
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
    params: {}
  },
  queryParamsTwo: {
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
    params: {}
  },
  rules: {
    id: [
      {required: true, message: "$comment不能为空", trigger: "blur"}
    ],
    code: [
      {required: true, message: "采购单号不能为空", trigger: "blur"}
    ],
    supplierId: [
      {required: true, message: "供应商ID不能为空", trigger: "blur"}
    ],
    addressId: [
      {required: true, message: "收货地址ID不能为空", trigger: "blur"}
    ],
    auditUserId: [
      {required: true, message: "审核人ID不能为空", trigger: "blur"}
    ],
    auditUserName: [
      {required: true, message: "审核人名称不能为空", trigger: "blur"}
    ],
    submitUserId: [
      {required: true, message: "提交人ID不能为空", trigger: "blur"}
    ],
    submitUserName: [
      {required: true, message: "提交人名称不能为空", trigger: "blur"}
    ],
    remark: [
      {required: true, message: "备注不能为空", trigger: "blur"}
    ],
    status: [
      {required: true, message: "状态不能为空", trigger: "change"}
    ]
  }
});

const {queryParams, queryParamsTwo, form, rules} = toRefs(data);

const columnList = ref([
  { type: 'checkbox', align: 'center', field: "checkbox",fixed: 'left', width: '40', },
  { title: "序号", type: 'seq', align: 'center', width: '60',  },
/*  { title: '送货单号', field: 'code',  width: '120',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入送货单号' } },
  { title: '送货人', field: 'sendUserName', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入送货人' } },
  { title: '送货时间', field: 'deliveryTime', width: '120', align: 'center'},
  { title: '送货备注', field: 'remark',  width: '150',align: 'center' },*/
 /* { title: '采购单号', field: 'orderCode',  width: '120',align: 'center' },*/
  { title: '采购单号', field: 'code',  width: '120',align: 'center',filterType: 'input', filterParam: {placeholder: ''},   },
  { title: '供应商编码', field: 'supplierCode', width: '120', align: 'center',filterType: 'input', filterParam: {placeholder: ''},   },
  { title: '供应商名称', field: 'supplierName',  width: '180',align: 'center',filterType: 'input', filterParam: {placeholder: ''},  },
  { title: '送货地址', field: 'addressName', width: '280', align: 'center',filterType: 'input', filterParam: {placeholder: ''},   },
  { title: '物料编码', field: 'materialCode', width: '80', align: 'center',filterType: 'input', filterParam: {placeholder: ''},   },
  { title: '物料名称', field: 'materialName',  width: '80',align: 'center',filterType: 'input', filterParam: {placeholder: ''},   },
  { title: '物料类别', field: 'categoryName',  width: '80',align: 'center',filterType: 'input', filterParam: {placeholder: ''},   },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center',filterType: 'input', filterParam: {placeholder: ''},   },
  { title: '板厚', field: 'boardThickness', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},   },
  { title: '铜厚', field: 'copperThickness',  width: '60',align: 'center',filterType: 'input', filterParam: {placeholder: ''},   },
  { title: '颜色', field: 'color',  width: '60',align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  { title: '级别', field: 'level', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  { title: '长', field: 'length', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  { title: '宽', field: 'width',  width: '60',align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  { title: '厚度', field: 'thickness',width: '80', align: 'center' },
  { title: '规格型号', field: 'specification',width: '120', align: 'center',filterType: 'input', filterParam: {placeholder: ''} },
  { title: '直径', field: 'diameter',width: '80', align: 'center' },
  { title: '品牌', field: 'manufacturer',  width: '60',align: 'center',filterType: 'input', filterParam: {placeholder: ''},   },
  { title: '要求交期', field: 'deliverTime', width: '120', align: 'center',},
  { title: '单位', field: 'units', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},   },
  { title: '采购总数', field: 'quantity', width: '60', align: 'center',fixed: 'right', },
  { title: '待收数量', field: 'waitQuantity',  width: '60',align: 'center', fixed: 'right', },
  { title: '已收数量', field: 'receiveQuantity', width: '60', align: 'center', fixed: 'right', },
  { title: '退货数', field: 'backQuantity', width: '60', align: 'center', fixed: 'right', },
  { title: '退货重收', field: 'backResendQuantity',  width: '60',align: 'center', fixed: 'right', },
  { title: '操作', field: 'make', align: 'center', width: '140', fixed: 'right', },
]);

const resColumnList = ref([
  { type: 'checkbox', align: 'center', field: "checkbox",fixed: 'left', width: '40', },
  { title: "序号", type: 'seq', align: 'center', width: '60',  },
  { title: '采购单号', field: 'orderCode',  width: '120',align: 'center', filterType: 'input', filterParam: { placeholder: '' },  },
 /* { title: '收货单号', field: 'code', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入收货单号' } },*/
  { title: '供应商名称', field: 'supplierName', width: '180', align: 'center', filterType: 'input', filterParam: { placeholder: '' },  },
  { title: '收货地址', field: 'addressName',  width: '280',align: 'center',  filterType: 'input', filterParam: { placeholder: '' }},
  { title: '采购时间', field: 'purchaseTime',  width: '120',
    align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }
  }, { title: '收货时间', field: 'createTime',  width: '130',
    align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }
  },
  { title: '备注', field: 'remark', width: '120', align: 'center', filterType: 'input', },
  { title: '物料类别', field: 'categoryName',  width: '120',align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '物料编码', field: 'baseRawMaterialCode', width: '80', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '物料名称', field: 'name',  width: '80',align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '板厚', field: 'boardThickness', width: '60', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '铜厚', field: 'copperThickness',  width: '60',align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '颜色', field: 'color',  width: '60',align: 'center',  filterType: 'input', filterParam: { placeholder: '' }},
  { title: '级别', field: 'level', width: '60', align: 'center',  filterType: 'input', filterParam: { placeholder: '' }},
  { title: '长', field: 'length', width: '60', align: 'center',  filterType: 'input', filterParam: { placeholder: '' },},
  { title: '宽', field: 'width',  width: '60',align: 'center',  filterType: 'input', filterParam: { placeholder: '' },},
  { title: '厚度', field: 'thickness',width: '80', align: 'center' },
  { title: '规格型号', field: 'specification',width: '120', align: 'center',filterType: 'input', filterParam: { placeholder: '' },},
  { title: '直径', field: 'diameter',width: '80', align: 'center' },
  { title: '品牌', field: 'manufacturer',  width: '60',align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '采购单位', field: 'unit', width: '80', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '采购总数', field: 'materialQuantity', width: '80', align: 'center',fixed: 'right', },
  { title: '本次收货', field: 'quantity',  width: '80',align: 'center',fixed: 'right', },
  { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);

const tabResColumnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60',  },
  { title: '采购单号', field: 'code',  width: '120',align: 'center' },
  { title: '采购日期', field: 'purchaseTime', width: '180', align: 'center'  },
  { title: '收货地址', field: 'addressName',  width: '280',align: 'center' },
  { title: '供应商编码', field: 'supplierCode',  width: '120', align: 'center',},
  { title: '供应商名称', field: 'supplierName', width: '120', align: 'center',  },
  { title: '物料编码', field: 'materialCode', width: '80', align: 'center' },
  { title: '物料名称', field: 'materialName',  width: '80',align: 'center'  },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center' },
  { title: '板厚', field: 'boardThickness', width: '60', align: 'center' },
  { title: '铜厚', field: 'copperThickness',  width: '60',align: 'center' },
  { title: '颜色', field: 'color',  width: '60',align: 'center' },
  { title: '级别', field: 'level', width: '60', align: 'center' },
  { title: '长', field: 'length', width: '60', align: 'center' },
  { title: '宽', field: 'width',  width: '60',align: 'center' },
  { title: '厚度', field: 'thickness',width: '80', align: 'center' },
  { title: '规格型号', field: 'specification',width: '120', align: 'center', },
  { title: '直径', field: 'diameter',width: '80', align: 'center' },
  { title: '品牌', field: 'manufacturer',  width: '160',align: 'center',    },
  { title: '库存单位', field: 'units', width: '90', align: 'center',  },
  { title: '保质期（天）', field: 'expirationDays', width: '160', align: 'center',editRender:{}  },
  { title: '采购数量', field: 'quantity',  width: '80',align: 'center',  },
  { title: '已收数量', field: 'receiveQuantity',  width: '80',align: 'center',  },
  { title: '待收数', field: 'waitQuantity',  width: '80',align: 'center',  },
  { title: '收货数量', field: 'recQuantity',  width: '80',align: 'center', editRender:{} },
  { title: '生产日期', field: 'productionDate',  width: '160',align: 'center', editRender:{} },
  { title: '入库仓', field: 'storageId',  width: '120',align: 'center',editRender:{}  },
  { title: '备注', field: 'remark',  width: '160',align: 'center',editRender:{}  },
  { title: '操作', field: 'make',  width: '160',align: 'center', editRender:{} },
]);

const adjustAddColumnList = ref([
  { title: '采购单号', field: 'orderCode',  width: '120',align: 'center' ,},
  { title: '供应商名称', field: 'supplierName', width: '120', align: 'center',  },
  { title: '收货地址', field: 'addressName',  width: '280',align: 'center' },
  { title: '采购时间', field: 'purchaseTime', width: '140', align: 'center'  },
  { title: '要求交期', field: 'deliverTime', width: '120', align: 'center',},
  { title: '申请备注', field: 'applyRemark',  width: '160',align: 'center', },
  { title: '物料类别', field: 'categoryName',  width: '120',align: 'center', },
  { title: '物料编码', field: 'baseRawMaterialCode', width: '80', align: 'center' },
  { title: '物料名称', field: 'name',  width: '80',align: 'center' },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center' },
  { title: '板厚(㎜)', field: 'boardThickness', width: '60', align: 'center' },
  { title: '铜厚(OZ)', field: 'copperThickness',  width: '60',align: 'center' },
  { title: '颜色', field: 'color',  width: '60',align: 'center' },
  { title: '级别', field: 'level', width: '60', align: 'center' },
  { title: '长(㎜)', field: 'length', width: '60', align: 'center' },
  { title: '宽(㎜)', field: 'width',  width: '60',align: 'center' },
  { title: '厚度', field: 'thickness',width: '80', align: 'center' },
  { title: '品牌', field: 'manufacturer',  width: '160',align: 'center',    },
  { title: '规格型号', field: 'specification',width: '120', align: 'center', },
  { title: '采购单位', field: 'unit', width: '80', align: 'center',  },
  { title: '直径', field: 'diameter',width: '80', align: 'center' },
  { title: '生产日期', field: 'productionDate',  width: '160',align: 'center',  },
  { title: '入库仓', field: 'storageId',  width: '120',align: 'center', },
  { title: '采购总数', field: 'materialQuantity',  width: '80',align: 'center',fixed: 'right',  },
  { title: '本次收货', field: 'receiveQuantity',  width: '80',align: 'center', fixed: 'right', },
  { title: '重新收货数量', field: 'quantity',  width: '100',align: 'center',editRender:{}, fixed: 'right', },
  { title: '备注', field: 'remark',  width: '120',align: 'center',fixed: 'right', editRender:{}  },
  { title: '操作', field: 'make',  width: '80',align: 'center',fixed: 'right', },
]);

const statusList = ref([
  { label: '待审核', value: "1" },
  { label: '审核通过', value: "2" },
  { label: '审核驳回', value: "3" },
]);

const adjustColumnList = ref([
  { type: 'checkbox', align: 'center', field: "checkbox", fixed: 'left', width: '40', },
  { title: "序号", type: 'seq', align: 'center', width: '60', fixed: 'left',  },
  { title: '状态', field: 'status', align: 'center', width: '80', filterType: 'radio', filterParam: { placeholder: '请选择状态' }, filterData: () => statusList.value },
  { title: '采购单号', field: 'orderCode',  width: '120',align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '供应商名称', field: 'supplierName', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '' },  },
  { title: '收货地址', field: 'addressName',  width: '280',align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '采购时间', field: 'purchaseTime', width: '140', align: 'center' ,
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'date', valueFormat: 'YYYY-MM-DD'},
      endParams: {placeholder: '请输入结束时间', type: 'date', valueFormat: 'YYYY-MM-DD'},
    } },
  { title: '申请备注', field: 'remark',  width: '160',align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '物料类别', field: 'categoryName',  width: '120',align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '物料编码', field: 'baseRawMaterialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '物料名称', field: 'name',  width: '80',align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '板厚(㎜)', field: 'boardThickness', width: '60', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '铜厚(OZ)', field: 'copperThickness',  width: '60',align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '颜色', field: 'color',  width: '60',align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '级别', field: 'level', width: '60', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '长(㎜)', field: 'length', width: '60', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '宽(㎜)', field: 'width',  width: '60',align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '厚度', field: 'thickness',width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '品牌', field: 'manufacturer',  width: '160',align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '规格型号', field: 'specification',width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '采购单位', field: 'unit', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' },  },
  { title: '直径', field: 'diameter',width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '申请人', field: 'createByName',  width: '80',align: 'center', filterType: 'input', filterParam: { placeholder: '' },  },
  { title: '申请时间', field: 'createTime',  width: '160',align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
  { title: '审核人', field: 'auditUserName',  width: '80',align: 'center', filterType: 'input', filterParam: { placeholder: '' },  },
  { title: '审核时间', field: 'auditTime',  width: '160',align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
  { title: '本次收货', field: 'beforeQuantity',  width: '80',align: 'center', fixed: 'right', filterType: "intervalNumber" },
  { title: '重新收货数量', field: 'quantity',  width: '100',align: 'center', fixed: 'right', filterType: "intervalNumber" },
  { title: '操作', field: 'make',  width: '80',align: 'center',fixed: 'right', },
]);

const adjustAuditColumnList = ref([
  { title: '采购单号', field: 'orderCode',  width: '120',align: 'center',  },
  { title: '供应商名称', field: 'supplierName', width: '120', align: 'center', },
  { title: '收货地址', field: 'addressName',  width: '280',align: 'center', },
  { title: '采购时间', field: 'purchaseTime', width: '140', align: 'center' , },
  { title: '备注', field: 'applyRemark',  width: '160',align: 'center',},
  { title: '物料类别', field: 'categoryName',  width: '120',align: 'center',  },
  { title: '物料编码', field: 'baseRawMaterialCode', width: '80', align: 'center',  },
  { title: '物料名称', field: 'name',  width: '80',align: 'center',  },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center',  },
  { title: '板厚(㎜)', field: 'boardThickness', width: '60', align: 'center',  },
  { title: '铜厚(OZ)', field: 'copperThickness',  width: '60',align: 'center', },
  { title: '颜色', field: 'color',  width: '60',align: 'center',  },
  { title: '级别', field: 'level', width: '60', align: 'center',  },
  { title: '长(㎜)', field: 'length', width: '60', align: 'center', },
  { title: '宽(㎜)', field: 'width',  width: '60',align: 'center',  },
  { title: '厚度', field: 'thickness',width: '80', align: 'center', },
  { title: '品牌', field: 'manufacturer',  width: '160',align: 'center', },
  { title: '规格型号', field: 'specification',width: '120', align: 'center', },
  { title: '采购单位', field: 'unit', width: '80', align: 'center',  },
  { title: '直径', field: 'diameter',width: '80', align: 'center', },
  { title: '备注信息', field: 'remark',  width: '120',align: 'center',},
  { title: '本次收货', field: 'beforeQuantity',  width: '80',align: 'center', fixed: 'right', },
  { title: '重新收货数量', field: 'quantity',  width: '100',align: 'center', fixed: 'right', },
]);

const verifyColumnList = ref([
  { title: '采购单号', field: 'orderCode',  minWidth: '160',align: 'center' },
  { title: '物料编码', field: 'baseRawMaterialCode', minWidth: '100', align: 'center' },
  { title: '本次收货', field: 'receiveQuantity',  minWidth: '80',align: 'center', fixed: 'right', },
]);

const quantityColumnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60', fixed: 'left',  },
  { title: '物料名称', field: 'name',  minWidth: '160',align: 'center' },
  { title: '物料编码', field: 'materialCode', minWidth: '100', align: 'center' },
  { title: '当前库存', field: 'quantity',  minWidth: '80',align: 'center', },
  { title: '所属仓库', field: 'storageName',  minWidth: '80',align: 'center', },
  { title: '仍需还料/退料', field: 'beforeQuantity',  minWidth: '80',align: 'center', },
]);

const route = useRoute();
/**
 * 进入页面次数
 */
const isFirst = ref(0)
/**
 * 待办跳转参数
 */
const pendingParams = ref()

// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  getList()
}
// 获取 搜索条件
const searchChange2 = (params: any) => {
  queryParamsTwo.value = params
  getMaterialReceiveList()
}
// 新增属性
const editableTabsValue = ref(1);
/**
 * 查询收货列表
 * */
const getVoidedList = async () => {
  if (1 == editableTabsValue.value) {
    //查询待收货列表
    getList();
  } else if (2 == editableTabsValue.value) {
    getMaterialReceiveList();
  } else {
    getAdjustList();
  }
}

/**
 * 收货按钮
 */
const handleGenerate = async () => {
  const $table = xTableHandle.value.xTableRef;
  //收货人
  formInline.userName = userStore;
  if ($table) {
    const selectRecords = $table.getCheckboxRecords();
    if (selectRecords.length<1){
      proxy?.$modal.msgError("请先选择待收货列表");
      return;
    }
    selectRecords.values().remark=undefined;
    otherReceiptList.value = selectRecords;
    otherReceiptList.value.map((row: any) => {
      row.materialCode = row?.materialCode;
      row.materialName = row?.materialName;
      row.materialQuality = row?.materialQuality;
      row.productionDate = dayjs(new Date()).format("YYYY-MM-DD");
      row.units = row?.units;
      row.code = row?.code;
      row.supplierCode = row?.supplierCode;
      row.supplierName = row?.supplierName;
      row.purchaseQuantity = row?.quantity;
      row.receiveQuantity = row?.receiveQuantity;
      row.waitQuantity = row?.waitQuantity;
      row.purchaseTime =row?.purchaseTime;
      row.addressName =row?.addressName;
      row.expirationDays =row?.defaultExpirationDays;
      row.id = row?.id;
      row.remark = "";
      row.quantity = row?.quantity;
      row.materialOrderDetailId = row?.materialOrderDetailId;
      row.orderCode = row?.orderCode;
      row.inventoryQuantity = row.inventoryQuantity;
      row.price = row?.price;
      row.isIqc = row?.isIqc;
      row.rawMaterialId = row?.rawMaterialId;
      row.supplierId = row?.supplierId;
      row.storageId =row?.storageId;
    })
  }
  console.log("---------------",otherReceiptList.value)
  dialogExamine.visible = true;
  dialogExamine.title = "物料收货";
  loading.value = true
  const storageResponse: any = await listMaterialStorage();
  storageOptions = storageResponse.rows;
  loading.value = false
  checkTempList.value = deepClone(otherReceiptList.value)
}

const inventoryCheck = ref(false);
const inventoryRes = ref<any[]>([]);
/**
 * 收货保存按钮
 */
const savaReceive = async () => {
  // 查询是否存在盘点中物料
  let ids = otherReceiptList.value.map(item => item.rawMaterialId);
  let query = {
    pageNum: 1,
    pageSize: 20,
    idList: ids,
    isCheck: '1'
  }
  const res = await listMaterialInventoryInfo(query);
  if (res.rows && res.rows.length > 0) {
    inventoryRes.value = res.rows;
    inventoryCheck.value = true;
    return;
  }
  if (otherReceiptList.value.some(item => Number(item.recQuantity) > Number(item.waitQuantity))) {
    proxy?.$modal.msgError("收货数不能大于待收数");
    return;
  }
  //otherReceiptList 里面有字段为空
/*  if (otherReceiptList.value.some(item => item.expirationDays == null)) {
    proxy?.$modal.msgError("保质期天数不能为空");
    return;
  }*/
  if (otherReceiptList.value.some(item => item.recQuantity == null)) {
    proxy?.$modal.msgError("收货数量不能为空");
    return;
  }
/*  if (otherReceiptList.value.some(item => item.productionDate == null)) {
    proxy?.$modal.msgError("生产日期不能为空");
    return;
  }*/
  if (otherReceiptList.value.some(item => item.storageId == null)) {
    proxy?.$modal.msgError("入库仓不能为空");
    return;
  }
  const directMaterialOrderDetail: DirectMaterialOrderDetail = {
    orderDetailList: [],
    supplierId: "",
  };
  if (otherReceiptList.value.length <= 0) {
    ElMessage.error("请选择待收货列表");
    return;
  }
  directMaterialOrderDetail.orderDetailList = otherReceiptList.value;
  buttonLoading.value = true;
  await saveMaterialOrderDetailInout(directMaterialOrderDetail).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("修改成功");
  dialogExamine.visible = false
  await getList();
  if (xTableHandle.value) {
    xTableHandle.value.xTableRef.clearCheckboxRow()
  }
}


/**
 * 查询收货列表
 * */
const getMaterialReceiveList = async () => {
  loading.value = true;
  const res = await listQueryMaterialReceive(queryParamsTwo.value);
  materialOrderList2.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/**
 * 查询待收货列表
 * */
const getList = async () => {
  loading.value = true;
 // const res = await listRawMaterialDelivery(queryParams.value);
  const res = await listPurchaseMaterialReceiptOrderDetail(queryParams.value);
  rawMaterialDeliveryList.value = res.rows;
  total.value = res.total;
  loading.value = false;
  nextTick(() => {
    if (xTableHandle.value) {
      console.log(checkTempList.value)
      if (checkTempList.value?.length) {
        rawMaterialDeliveryList.value.forEach((item: any) => {
          checkTempList.value.forEach((f: any) => {
            if (f.id == item.id) {
              xTableHandle.value.xTableRef.setCheckboxRow(item, true)
            }
          })
        })
      }
    }
  })
}

interface RowVO {
  id: number
  name: string
  role: string
  sex: string
  age: number
  num: string
  num2: string
  address: string
}

/**
 * 点击箭头下拉
 * @param row
 * @param rowIndex
 */
const toggleExpandChangeEvent: VxeTableEvents.ToggleRowExpand<RowVO> = ({row, rowIndex}) => {
  otherList.value = [{
    categoryId: undefined,
    materialCode: undefined,
    name: undefined,
    specification: undefined,
    materialQuality: undefined,
    boardThickness: undefined,
    copperThickness: undefined,
    color: undefined,
    level: undefined,
    length: undefined,
    width: undefined,
    manufacturer: undefined,
    units: undefined,
    deliverTime: undefined,
    quantity: undefined,
    inventoryQuantity: undefined,
    returnsQuantityIqc: undefined
  }];
  const _id = row.id;
  getMaterialOrderDetilList(_id).then(res => {
    otherList.value = res.data.orderDetailVoList;
  })
  loading.value = false;
  console.log('行展开事件' + row)
}

let formInline = reactive({
  userName: undefined,
  receiptDate: dayjs(new Date()).format("YYYY-MM-DD"),

});
const userStore = useUserStore().nickname;

/**
 * 查看收货信息 单条
 * @param row
 */
const handleDelivery = async (row?: MaterialOrderDetailVO) => {
  reset();
  otherReceiptList.value = [];
  //收货人
  formInline.userName = userStore;
  const info: MaterialOrderDetailVO = {
    materialCode: row?.materialCode,
    materialName: row?.materialName,
    materialQuality: row?.materialQuality,
    productionDate:dayjs(new Date()).format("YYYY-MM-DD"),
    units: row?.units,
    code: row?.code,
    supplierCode: row?.supplierCode,
    supplierName: row?.supplierName,
    purchaseQuantity: row?.quantity,
    receiveQuantity: row?.receiveQuantity,
    waitQuantity: row?.waitQuantity,
    purchaseTime:row?.purchaseTime,
    addressName:row?.addressName,
    expirationDays:row?.defaultExpirationDays,
    id: row?.id,
    remark: "",
    quantity: row?.quantity,
    materialOrderDetailId: row?.materialOrderDetailId,
    orderCode: row?.orderCode,
    inventoryQuantity: row.inventoryQuantity,
    price: row?.price,
    isIqc: row?.isIqc,
    rawMaterialId: row?.rawMaterialId,
    supplierId: row?.supplierId,
    storageId:row?.storageId,
    materialQuality: row?.materialQuality,
    boardThickness: row?.boardThickness,
    copperThickness: row?.copperThickness,
    color: row?.color,
    level: row?.level,
    length: row?.length,
    width: row?.width,
    thickness: row?.thickness,
    specification: row?.specification,
    diameter: row?.diameter,
    manufacturer: row?.manufacturer,
    orderId: row?.orderId,
  };
  dialogExamine.visible = true;
  dialogExamine.title = "物料收货";
  loading.value = true
  const storageResponse: any = await listMaterialStorage();
  storageOptions = storageResponse.rows;
  otherReceiptList.value.push(info);
  /*const res = await getMaterialOrderDetilList(_id);
   otherReceiptList.value = res.data.orderDetailVoList;*/
  loading.value = false
}

const isActiveStatus = (row: MaterialOrderDetailVO) => {
  const $table = xTable.value;
  if ($table) {
    return $table.isEditByRow(row);
  }
};

const saveRowEvent = (row: MaterialOrderDetailVO) => {
  // row.unitedNumber = row.unitedWayLength * row.unitedWayWidth;
  console.log(row)
  const $table = xTable.value.xTableRef;
  if (Number(row.recQuantity) > Number(row.waitQuantity)){
    ElMessage.error("收货数量大于待收数量");
    return;
  }
  if ($table) {
    $table.clearEdit().then(() => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        VXETable.modal.message({content: `保存成功！`, status: "success"});
      }, 300);
    });
  }
};

const cancelRowEvent = (row: MaterialOrderDetailVO) => {
  const $table = xTable.value;
  if ($table) {
    $table.clearEdit().then(() => {
      // 还原行数据
      $table.revertData(row);
    });
  }
};

/**
 * 复制
 * @param row
 */
const copyRowEvent = (row: MaterialOrderDetailVO) => {
  const $table = deepClone(row);
  if ($table) {
    $table._X_ROW_KEY = otherReceiptList.value.length + 1;
   // $table.id = null;
    otherReceiptList.value.push($table);
    console.log(xTable.value)
  }
  console.log(otherReceiptList.value)
};

/**
 * 编辑
 * @param row
 */
const editRowEvent = (row: MaterialOrderDetailVO) => {
  const $table = xTable.value;
  if ($table) {
    $table.setEditRow(row);
  }
};

/**
 * 删除
 * @param row
 * @param index
 */
const deleteRowEvent = (row: MaterialOrderDetailVO, index: number) => {
 if (otherReceiptList.value.length == 1){
    ElMessage.error("至少保留一条收货记录1");
    return;
  }

  ElMessageBox.confirm(
      "您确定要删除该记录吗?",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
  ).then(() => {
      ElMessage({
        type: "success",
        message: "删除成功"
      });
      otherReceiptList.value.splice(index, 1);//删除该行记录
  }).catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除"
      });
    });
};


/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  materialOrderFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: MaterialOrderVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加采购订单";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MaterialOrderVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMaterialOrder(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改采购订单";
}

/**
 *结单按钮
 * @param row
 */
const statementOfAccount = async (row?: MaterialOrderDetailVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  await proxy?.$modal.confirm('是否确认采购订单编号为"' + _id + '"的数据项结单？').finally(() => loading.value = false);
  const res = await updateDetailStatusOpen(_id);
  Object.assign(form.value, res.data);
  proxy?.$modal.msgSuccess("结单成功");
  await getList();
}

/**
 *取消结单按钮
 * @param row
 */
const closeStatementOfAccount = async (row?: MaterialOrderDetailVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  await proxy?.$modal.confirm('是否确认取消采购订单编号为"' + _id + '"的结单数据项？').finally(() => loading.value = false);
  const res = await updateDetailStatusClose(_id);
  Object.assign(form.value, res.data);
  proxy?.$modal.msgSuccess("取消结单成功");
  await getList();
}


/** 提交按钮 */
const submitForm = () => {
  materialOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMaterialOrder(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addMaterialOrder(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MaterialOrderVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除采购订单编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delMaterialOrder(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('purchase/materialOrder/export', {
    ...queryParams.value
  }, `materialOrder_${new Date().getTime()}.xlsx`)
}

const dispatchTimeChange = (row: OrderVO) => {
  if (row.preDeliveryHour != 0) {
    const dayjs1 = dayjs(row.deliveryTime);
    const dayjs2 = dayjs1.subtract(row.preDeliveryHour, 'hour');
    row.dispatchTime = dayjs2.format("YYYY-MM-DD");
  }
}

/** 批量调整收货单 */
const handleAdjustList = async () => {
  const $table = xAdjustTableHandle?.value.xTableRef;
  if ($table) {
    const selectRecords = $table.getCheckboxRecords();
    if (selectRecords.length < 1) {
      proxy?.$modal.msgError("请选择收货列表");
      return;
    }
    loading.value = true;
    selectRecords.values().remark = undefined;
    receiptAdjustList.value = deepClone(selectRecords);
    receiptAdjustList.value.map((row: any) => {
      row.receiveQuantity = row.quantity;
      row.quantity = undefined;
    })
  }
  // 校验是否存在待审核的调整单
  let ids = receiptAdjustList.value.map(item => item.rawMaterialId);
  let bizIds = receiptAdjustList.value.map(item => item.id);
  let query = {
    rawMaterialIdList: ids,
    bizIdList: bizIds,
    status: '1',
    type: '1'
  }
  // 如果存在数据则提示校验成功
  const res = await listQuantityAdjust(query).finally(() => loading.value = false);
  if (res.data.length > 0) {
    let ids = res.data.map(item => item.bizId);
    verifyList.value = receiptAdjustList.value.filter(item => ids.includes(item.id))
    dialogVerify.visible = true;
    return;
  }
  isAudit.value = false;
  receiveTotal.value = receiptAdjustList.value.length;
  drawer.visible = true;
  drawer.title = "物料收货调整";
}

/** 收货调整 */
const handleAdjust = async(row: any) => {
  let adjust = deepClone(row);
  adjust.remark = undefined;
  adjust.receiveQuantity = row.quantity;
  adjust.quantity = undefined;
  receiptAdjustList.value = [];
  receiptAdjustList.value.push(adjust)
  // 校验
  let query = {
    rawMaterialId: row.rawMaterialId,
    bizId: row.id,
    status: '1',
    type: '1'
  }
  loading.value = true;
  // 如果存在数据则提示校验成功
  const res = await listQuantityAdjust(query).finally(() => loading.value = false);
  if (res.data.length > 0) {
    await proxy?.$modal.msgError('当前单据中物料的上一个调整申请正在审核中，请等待调整结束后再进行操作');
    return;
  }
  isAudit.value = false;
  receiveTotal.value = receiptAdjustList.value.length;
  drawer.visible = true;
  drawer.title = "物料收货调整";
}

/** 移除选项 */
const removeRow = async(rowIndex: number) => {
  if (receiptAdjustList.value.length == 1) {
    proxy?.$modal.msgError("至少保留一条收货记录");
    return;
  }
  receiptAdjustList.value.splice(rowIndex, 1);
}

/** 提交调整单 */
const submitAdjust = async() => {
  // 校验数量是否填写
  let flag = false;
  receiptAdjustList.value.forEach((item: any) => {
    if (!item.quantity || item.quantity <= 0) {
      flag = true;
      return;
    }
  });
  if(flag) {
    proxy?.$modal.msgError("部分明细未填写数量，请填写数量后再提交");
    return;
  }

  loading.value = true;
  adjustLoading.value = true;
  let adjustList = deepClone(receiptAdjustList.value);
  adjustList.map(item => {
    item.bizId = item.id;
    item.status = '1';
    item.type = '1';
    item.beforeQuantity = item.receiveQuantity;
    item.id = undefined;
  })
  await addQuantityAdjustList(adjustList).finally(() => {
    loading.value = false;
    adjustLoading.value = false;
  });
  proxy?.$modal.msgSuccess("提交成功");
  drawer.visible = false;
  receiptAdjustList.value = [];
  // 清空多选
  if (xAdjustTableHandle.value) {
    xAdjustTableHandle.value.xTableRef.clearCheckboxRow()
  }
  await getMaterialReceiveList();
}

/**
 * 查询收货调整单列表
 * */
const getAdjustList = async () => {
  loading.value = true;
  const res = await listReceiveQuantityAdjust(adjustQueryParams.value).finally(() => loading.value = false);
  adjustList.value = res.rows;
  adjustTotal.value = res.total;
}

// 获取 搜索条件
const searchChangeAdjust = (params: any) => {
  params.type = '1';
  adjustQueryParams.value = params;
  getAdjustList();
}

// 获取 审核搜索条件
const searchChangeAudit = (params: any) => {
  params.type = '1';
  receiveQueryParams.value = params;
  getAdjustList();
}

/** 审核调整单 */
const auditAdjust = async (status: string) => {
  adjustLoading.value = true;
  auditAdjustList.value.map(item => item.status = status);
  const res = await auditQuantityAdjust(auditAdjustList.value).finally(() => adjustLoading.value = false);
  // 如果有数据返回则库存不足提示
  if(res.data && res.data.length > 0) {
    auditAdjustList.value.map(item => item.status = '1');
    quantityList.value = res.data;
    dialogQuantity.visible = true;
    return;
  }
  proxy?.$modal.msgSuccess("操作成功");
  drawer.visible = false;
  auditAdjustList.value = [];
  // 清空多选
  if (xAuditTableHandle.value) {
    xAuditTableHandle.value.xTableRef.clearCheckboxRow()
  }
  await getAdjustList();
}

/** 审核按钮 */
const handleAudit = async(row: any) => {
  isAudit.value = true;
  auditAdjustList.value = [];
  auditAdjustList.value.push(row);
  auditTotal.value = auditAdjustList.value.length;
  drawer.visible = true;
  drawer.title = "重新收货审核";
}

/** 批量审核按钮 */
const handleBatchAudit = async() => {
  const $table = xAuditTableHandle?.value.xTableRef;
  if ($table) {
    const selectRecords = $table.getCheckboxRecords();
    if (selectRecords.length < 1) {
      proxy?.$modal.msgError("请选择收货调整列表");
      return;
    }
    isAudit.value = true;
    auditAdjustList.value = selectRecords;
    auditTotal.value = auditAdjustList.value.length;
    drawer.visible = true;
    drawer.title = "重新收货审核";
  }
}

/** 是否允许勾选 */
const tabCheckMethod = (scope: any) => {
  // 待审核状态可以勾选
  if (scope.row.status == '1') {
    return true;
  } else {
    return false;
  }
}

const selectRawMaterial = ref();

/** 修改记录按钮 */
const handleRecord = (row: any) => {
  dialogRecord.visible = true;
  dialogRecord.title = '修改记录';
  selectRawMaterial.value = row;
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
      let tab = !isNaN(Number(params.tab)) ? Number(params.tab) : 1;
      editableTabsValue.value = tab
      if (tab === 1) {
        let tempColumnList = [{field: 'code', defaultValue: params.bizNo}]
        queryParams.value.code = params.bizNo
        setTimeout(() => {
          xTableHandle.value.filterFieldEvent(tempColumnList)
        }, 100)
      }
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
});
</script>
