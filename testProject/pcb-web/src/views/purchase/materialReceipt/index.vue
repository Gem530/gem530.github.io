<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs type="border-card" v-model="editableTabsValue" @tab-change="getVoidedList()" class="xtable-tab">
        <el-tab-pane label="待收货列表" :name="1">
          <div class="p-2" style="text-align: right;width: 100%">
            <el-button :loading="buttonLoading" type="primary" @click="handleGenerate()">收货</el-button>
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
            <el-button link type="primary" @click="handleDelivery(scope.row)">收货</el-button>
          </template>
          </XTable>

        </el-tab-pane>
        <el-tab-pane label="收货列表" width="100%" :name="2">
          <XTable toolId="purchaseMaterialReceiptReceive" v-model:page-size="queryParamsTwo.pageSize" v-model:current-page="queryParamsTwo.pageNum"
          :checkbox-config="{  highlight: true }" :showRefresh="true"
          :page-params="{ perfect: true, total: total }" :data="materialOrderList2" :columnList="resColumnList" ref="xTable222"
          :scroll-x="{enabled: true}" height="100%" class="xtable-content"
                  :intervalCondition="['purchaseTime']"
          :scroll-y="{enabled: true}"
          :loading="loading"
          border @searchChange="searchChange2" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 收货 -->
    <el-dialog v-model="dialogExamine.visible" title="物料收货" center width="95%" draggable destroy-on-close>
      <!-- 主体 -->
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
          height="545px"

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

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="dialogExamine.visible = false">关闭</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="savaReceive">保存</el-button>
          </span>
        </div>
      </template>
    </el-dialog>
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
import {VxeColumnPropTypes, VXETable, VxeTableEvents, VxeTableInstance} from 'vxe-table'
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

const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const materialOrderList = ref<MaterialOrderVO[]>([]);
const materialOrderList2 = ref<MaterialReceiveVO[]>([]);
const otherReceiptList = ref<MaterialOrderDetailVO[]>([]);
const otherList = ref<MaterialOrderVO[]>([]);
const xTable = ref<VxeTableInstance<MaterialOrderDetailVO>>();
const xTableHandle = ref<VxeTableInstance<MaterialOrderDetailVO>>();


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
  { title: '要求交期', field: 'deliverTime', width: '120', align: 'center',
  },
  { title: '单位', field: 'units', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},   },
  { title: '采购数量', field: 'quantity', width: '60', align: 'center',   },
  { title: '待收数量', field: 'waitQuantity',  width: '60',align: 'center',   },
  { title: '已收数量', field: 'receiveQuantity', width: '60', align: 'center',   },
  { title: '退货数', field: 'backQuantity', width: '60', align: 'center',   },
  { title: '退货重收数', field: 'backResendQuantity',  width: '60',align: 'center',   },
  { title: '操作', field: 'make', align: 'center', width: '140', fixed: 'right',  },
]);

const resColumnList = ref([
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
  { title: '采购单位', field: 'unit', width: '60', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '采购数量', field: 'materialQuantity', width: '60', align: 'center',  },
  { title: '已收数', field: 'quantity',  width: '60',align: 'center',  },
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
  } else {
    getMaterialReceiveList();
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

/**
 * 收货保存按钮
 */
const savaReceive = async () => {
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


onMounted(() => {
  getList();
});
</script>
