<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <h1>IQC检测管理</h1>
        </el-row>
      </template>
      <el-tabs type="border-card" class="xtable-tab" v-model="editableTabsValue" @tab-change="getVoidedList()">
        <el-tab-pane label="待IQC检测列表" :name="1" >
          <XTable toolId="purchaseMaterialIqcWait" v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum"
            :page-params="{ perfect: true, total: total }" height="100%" class="xtable-content"  :data="materialReceiveList" :columnList="columnList" ref="tableRef"
            @toggle-row-expand="toggleExpandChangeEvent"
            border @searchChange="searchChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
            <template #default-level="scope">
                <dict-tag :options="order_material_level" :value="scope.row.level"/>
            </template>
          <template #default-unit="scope">
            <dict-tag :options="units_type" :value="scope.row.unit"/>
        </template>
            <template #default-make="scope">
                <el-button link type="primary" @click="handleDelivery(scope.row)" >IQC检测</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="IQC检测列表" width="100%" :name="2">
          <XTable toolId="purchaseMaterialIqc" v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum"
            :page-params="{ perfect: true, total: mtotal }" :data="materialOrderList" :columnList="materalOrdercolumnList" ref="xTable"
            size="mini" height="100%" class="xtable-content"
            border @searchChange="searchMaterialChange" :column-config="{ resizable: true }" >
            <template #default-handleType="scope">
              <dict-tag :options="material_iqc_handle_type" :value="scope.row.handleType"/>
            </template>
<!--            <template #default-boardThickness="scope">
                <dict-tag :options="finish_plate_thickness" :value="scope.row.boardThickness"/>
            </template>-->
            <template #default-level="scope">
                <dict-tag :options="order_material_level" :value="scope.row.level"/>
            </template>
<!--            <template #default-color="scope">
              <dict-tag :options="order_commodity_solder" :value="scope.row.color"/>
          </template>-->
<!--            <template #default-make="scope">
                <el-button link type="primary" @click="handleDelivery(scope.row)" >IQC检测</el-button>
            </template>-->
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 收货 -->
    <el-dialog v-model="dialogExamine.visible" title="IQC检测" center width="80%"  draggable>
      <!-- 主体 -->
      <el-form :label-position="labelPosition" border label-width="100px" :model="formInline">
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="检测日期：">
              <el-input v-model="formInline.checkTime" placeholder="updateTime" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="检测人：">
              <!--当前登录用户-->
              <el-input v-model="formInline.userName" placeholder="username" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <XTable
          border
          keep-source
          size="mini"
          align="center"
          height="545px"
          :row-config="{height: 50}"
          show-footer="true"
        :edit-rules="validRules"
        show-overflow
        :loading="loading"
        ref="xTable"
        :pageShow="false"
        :column-config="{resizable: true}"
        :data="otherReceiptList"
        :columnList="columnListIqcDialog"
        :edit-config="{trigger: 'manual', mode: 'row', autoClear: false, showStatus: true}"
      >
        <!-- <vxe-column type="seq" title="序号"></vxe-column>
        <vxe-column field="code" title="检测单号"> -->
          <template #edit-code="{ row }">
            <el-input v-model="row.code"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="baseRawMaterialCode" title="物料编码"> -->
          <template #edit-baseRawMaterialCode="{ row }">
            <el-input v-model="row.rawMaterialCode"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="name" title="物料名称"> -->
            <template #edit-name="{ row }">
              <el-input v-model="row.name"></el-input>
            </template>
        <!-- </vxe-column>
        <vxe-column field="materialQuality" title="材质牌号"> -->
          <template #edit-materialQuality="{ row }">
            <el-input v-model="row.materialQuality"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="unit" title="库存单位"> -->
          <template #edit-unit="{ row }">
            <el-input v-model="row.unit"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="productionDate" title="生产日期"> -->
          <template #edit-productionDate="{ row }">
            <el-input v-model="row.productionDate"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="storageName" title="入库仓"> -->
          <template #edit-storageName="{ row }">
            <el-input v-model="row.storageName"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="waitInspectionNumber" title="待检数量" sort-type="string"> -->
          <template #edit-waitInspectionNumber="{ row }">
            <el-input v-model="row.waitInspectionNumber"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="quantity" title="检测数量" sort-type="string" :edit-render="{}"> -->
          <template #edit-quantity="{ row }">
            <el-input v-model="row.quantity" type="number" :min="0"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="inventoryQuantity" title="直接入库数" sort-type="string" :edit-render="{}"> -->
          <template #edit-inventoryQuantity="{ row }">
            <el-input v-model="row.inventoryQuantity" type="number" :min="0"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="handleType" title="处理方式" :edit-render="{}"> -->
          <template #edit-handleType="{ row }" #default="row">
            <el-select v-model="row.handleType" placeholder="处理方式" clearable>
              <el-option v-for="dict in material_iqc_handle_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </template>
          <template #default-handleType="{row}">
            <div v-for="dict in material_iqc_handle_type">
              <span v-if="dict.value==row.handleType">{{dict.label}}</span>
            </div>
          </template>
        <!-- </vxe-column>
        <vxe-column field="remark" title="备注" sort-type="string" :edit-render="{}"> -->
          <template #edit-remark="{ row }">
            <el-input v-model="row.remark"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column title="操作" width="200"> -->
          <template #default-make="{ row,rowIndex}">
            <template v-if="isActiveStatus(row)">
              <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
              <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
            </template>
            <template v-else>
              <el-button size="small" text="plain" @click="copyRowEvent(row)">复制</el-button>
              <el-button size="small" text="plain" @click="editRowEvent(row)">编辑</el-button>
              <el-button size="small" text="plain" @click="deleteRowEvent(row,rowIndex)">删除</el-button>
            </template>
          </template>
        <!-- </vxe-column> -->
      </XTable>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="dialogExamine.visible = false">关闭</el-button>
            <el-button type="primary" @click="onSubmitCheckBtnClick()">保存</el-button>
          </span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="MaterialIqc" lang="ts">
import {
  addMaterialOrder,
  delMaterialOrder,
  getMaterialOrder,
  getMaterialOrderDetilList,
  updateDetailStatusClose,
  updateDetailStatusOpen,
  updateMaterialOrder
} from '@/api/purchase/materialOrder';
import {MaterialOrderForm, MaterialOrderQuery, MaterialOrderVO} from '@/api/purchase/materialOrder/types';
import {ref} from 'vue'
import {VxeColumnPropTypes, VXETable, VxeTableEvents, VxeTableInstance} from 'vxe-table'
import {MaterialOrderDetailVO} from "@/api/purchase/materialOrderDetail/types";
import dayjs from "dayjs";
import useUserStore from "@/store/modules/user";
import {deepClone} from "@/utils";
import {addMaterialIqc, listMaterialIqc} from "@/api/purchase/materialIqc";
import {MaterialIqcPurchase, MaterialIqcVO} from "@/api/purchase/materialIqc/types";
import {getMaterialReceiveList} from "@/api/purchase/materialReceive";
import {MaterialReceiveVO} from "@/api/purchase/materialReceive/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;


const materialOrderList = ref<MaterialIqcVO[]>([]);
const materialReceiveList = ref();
const otherReceiptList = ref<MaterialIqcVO[]>([]);
const otherList = ref<MaterialOrderVO[]>([]);
const xTable = ref<VxeTableInstance<MaterialOrderDetailVO>>();

const { material_order_detail_status } = toRefs<any>(proxy?.useDict("material_order_detail_status"));

const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const mtotal = ref(0);

const queryFormRef = ref<ElFormInstance>();
const materialOrderFormRef = ref<ElFormInstance>();
//处理方式
const {material_iqc_handle_type} = toRefs<any>(proxy?.useDict("material_iqc_handle_type"));
//板材级别
const {order_material_level} = toRefs<any>(proxy?.useDict("order_material_level"));
//板厚
const {finish_plate_thickness} = toRefs<any>(proxy?.useDict("finish_plate_thickness"));
//颜色
const {order_commodity_solder} = toRefs<any>(proxy?.useDict("order_commodity_solder"));
//单位
const {units_type} = toRefs<any>(proxy?.useDict("units_type"));


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
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "采购单号不能为空", trigger: "blur" }
    ],
    supplierId: [
      { required: true, message: "供应商ID不能为空", trigger: "blur" }
    ],
    addressId: [
      { required: true, message: "收货地址ID不能为空", trigger: "blur" }
    ],
    auditUserId: [
      { required: true, message: "审核人ID不能为空", trigger: "blur" }
    ],
    auditUserName: [
      { required: true, message: "审核人名称不能为空", trigger: "blur" }
    ],
    submitUserId: [
      { required: true, message: "提交人ID不能为空", trigger: "blur" }
    ],
    submitUserName: [
      { required: true, message: "提交人名称不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60', showOverflow: false },
  { title: '物料编码', field: 'baseRawMaterialCode', align: 'center'},
  { title: '物料名称', field: 'name', align: 'center'},
  { title: '材质牌号', field: 'materialQuality', align: 'center'},
  { title: '板厚', field: 'boardThickness', align: 'center' },
  { title: '铜厚', field: 'copperThickness', align: 'center'},
  { title: '级别', field: 'level', align: 'center'},
  { title: '颜色', field: 'color', align: 'center'},
  { title: '长（mm）', field: 'length', align: 'center' },
  { title: '宽（mm）', field: 'width', align: 'center' },
  { title: '品牌', field: 'manufacturer', align: 'center' },
  { title: '库存单位', field: 'unit', align: 'center' },
  { title: '待检数量', field: 'waitInspectionNumber', align: 'center' },
  { title: '已检数量', field: 'alreadyInspectionNumber', align: 'center' },
  { title: '退货重发数', field: 'backResendQuantity', align: 'center' },
  { title: '退货数', field: 'backQuantity', align: 'center' },
  { title: '通过数', field: 'passNumber', align: 'center' },
  { title: '直接入库数', field: 'inventoryQuantity', align: 'center' },
  { title: '收货数量', field: 'quantity', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '140', fixed: 'right', showOverflow: false },
]);
const materalOrdercolumnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60', showOverflow: false },
  { title: '检测单号', field: 'code', align: 'center'},
  { title: '检测日期',width: '120',  field: 'checkTime', align: 'center'},
  { title: '备注', field: 'remark', align: 'center'},
  { title: '处理方式', field: 'handleType', align: 'center' },
  { title: '待检数量', field: 'waitInspectionNumber', align: 'center'},
  { title: '已检数量', field: 'alreadyInspectionNumber', align: 'center' },
  { title: '退货重发数', field: 'backResendQuantity', align: 'center' },
  { title: '退货数', field: 'backQuantity', align: 'center' },
  { title: '通过数', field: 'passNumber', align: 'center' },
  { title: '直接入库数', field: 'inventoryQuantity', align: 'center' },
  { title: '收货数量', field: 'quantity', align: 'center' },
  { title: '物料编码', field: 'baseRawMaterialCode', align: 'center'},
  { title: '物料名称', field: 'name', align: 'center'},
  { title: '材质牌号', field: 'materialQuality', align: 'center'},
  { title: '板厚', field: 'boardThickness', align: 'center' },
  { title: '铜厚', field: 'copperThickness', align: 'center'},
  { title: '级别', field: 'level', align: 'center' },
  { title: '颜色', field: 'color', align: 'center' },
  { title: '长（mm）', field: 'length', align: 'center' },
  { title: '宽（mm）', field: 'width', align: 'center' },
  { title: '品牌', field: 'manufacturer', align: 'center' },
  { title: '库存单位', field: 'unit', align: 'center' },
]);

//IQC检测弹框
const columnListIqcDialog = ref([
{ type: 'seq',title: '序号',align: 'center',  },
{ title: '检测单号',field: 'code',align: 'center',  },
{ title: '物料编码',field: 'baseRawMaterialCode',align: 'center',  },
{ title: '物料名称',field: 'name',align: 'center',  },
{ title: '材质牌号',field: 'materialQuality',align: 'center',  },
{ title: '库存单位',field: 'unit',align: 'center',  },
{ title: '生产日期',field: 'productionDate',align: 'center',  },
{ title: '入库仓',field: 'storageName',align: 'center',  },
{ type: 'string',title: '待检数量',field: 'waitInspectionNumber',align: 'center',  },
{ type: 'string',title: '检测数量',field: 'quantity',editRender: '{}',align: 'center',  },
{ type: 'string',title: '直接入库数',field: 'inventoryQuantity',editRender: '{}',align: 'center',  },
{ title: '处理方式',field: 'handleType',editRender: '{}',align: 'center',  },
{ type: 'string',title: '备注',field: 'remark',editRender: '{}',align: 'center',  },
{ width: '200',title: '操作',align: 'center', field: 'make' },
]);
// 新增属性
const editableTabsValue = ref(1);

// 获取 搜索条件
const searchMaterialChange = (params: any) => {
  queryParams.value = params
  getList();
}
const searchChange = (params: any) => {
  queryParams.value = params
  getMaterialReceive();
}
/**
 * 查询收货列表
 * */
const getVoidedList = async () => {
  if (1 == editableTabsValue.value) {
     getMaterialReceive();
  }else{
    getList();
  }
}

/**
 * 查询待IQC检测管理列表
 * */
const getMaterialReceive = async () => {
  loading.value = true;
  const res = await getMaterialReceiveList(queryParams.value);
  materialReceiveList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 提交保存 */
const onSubmitCheckBtnClick = async () => {
  if (otherReceiptList.value.length <= 0) {
    ElMessage.error("请选择待IQC检测列表");
    return;
  }
  const flag = otherReceiptList.value.some(v => (Number(v.quantity)+Number(v.inventoryQuantity)) > formInline.waitInspectionNumber);
  if (flag) {
    proxy?.$modal.msgError("检测数总量不能大于待检数");
    return;
  }
  buttonLoading.value = true;
  const materialIqc: MaterialIqcPurchase = {
    otherReceiptList: [],
    id:undefined,
    waitInspectionNumber:undefined,
    rawMaterialId:undefined,
    supplierId:undefined,
    storageId:undefined,
    productionDate:undefined,
    expirationDays:undefined,
  };
  materialIqc.otherReceiptList = otherReceiptList.value;
  materialIqc.id = formInline.id;
  materialIqc.waitInspectionNumber = formInline.waitInspectionNumber;
  materialIqc.rawMaterialId = formInline.rawMaterialId;
  materialIqc.supplierId = formInline.supplierId;
  materialIqc.storageId = formInline.storageId;
  materialIqc.productionDate = formInline.productionDate;
  materialIqc.expirationDays = formInline.expirationDays;
  await addMaterialIqc(materialIqc).finally(() => dialogExamine.visible = false);
  proxy?.$modal.msgSuccess("保存成功");
  await getMaterialReceive();
};



/**
 * 查询IQC检测管理列表
 * */
const getList = async () => {
  loading.value = true;
  const res = await listMaterialIqc(queryParams.value);
  materialOrderList.value = res.rows;
  mtotal.value = res.total;
  loading.value = false;
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
const toggleExpandChangeEvent: VxeTableEvents.ToggleRowExpand<RowVO> = ({ row, rowIndex }) => {
  otherList.value= [{
    categoryId:undefined,
    materialCode:undefined,
    name:undefined,
    specification:undefined,
    materialQuality:undefined,
    boardThickness:undefined,
    copperThickness:undefined,
    color:undefined,
    level:undefined,
    length:undefined,
    width:undefined,
    manufacturer:undefined,
    units:undefined,
    deliverTime:undefined,
    quantity:undefined,
    inventoryQuantity:undefined,
    returnsQuantityIqc:undefined
  }];
  const _id = row.id;
  getMaterialOrderDetilList(_id).then(res=>{
    otherList.value= res.data.orderDetailVoList;
  })
  loading.value = false;
  console.log('行展开事件' + row)
}

let formInline = reactive({
  id:undefined,
  code: undefined,
  updateTime: undefined,
  supplierName: undefined,
  userName: undefined,
  waitInspectionNumber:undefined,
  checkTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  address: undefined,
  rawMaterialId:undefined,
  supplierId:undefined,
  storageId:undefined,
  productionDate:undefined,
  expirationDays:undefined,
});
const userStore = useUserStore().nickname;

/**
 * 查看IQC检测信息
 * @param row
 */
const handleDelivery = async (row?: MaterialReceiveVO) => {
  reset();
  //检测日期
  formInline.checkTime=dayjs(new Date()).format("YYYY-MM-DD");
  //检测人
  formInline.userName= userStore;
  formInline.id=row?.id;
  formInline.waitInspectionNumber=row?.waitInspectionNumber;
  formInline.rawMaterialId=row?.rawMaterialId;
  formInline.supplierId=row?.supplierId;
  formInline.storageId=row?.storageId;
  formInline.productionDate=row?.productionDate;
  formInline.expirationDays=row?.expirationDays;
  otherReceiptList.value=[];
  const info: MaterialIqcVO = {
    id:row?.id,
    code:row?.code,
    baseRawMaterialCode:row?.baseRawMaterialCode,
    name : row?.name,
    materialQuality:row?.materialQuality,
    unit:row?.unit,
    productionDate : row?.productionDate,
    waitInspectionNumber:row?.waitInspectionNumber,
    quantity:undefined,
    inventoryQuantity:undefined,
    handleType:row?.handleType,
    remark:undefined,
    storageName:row?.storageName,
    materialOrderDetailId:row?.materialOrderDetailId,
    storageId:row?.storageId,
    expirationDays:row?.expirationDays,
    expirationDate:row?.expirationDate,
    rawMaterialId:row?.rawMaterialId,
    supplierId:row?.supplierId,
    price:row?.price,
    materialReceiveId:row?.id,
  }
  otherReceiptList.value.push(info);
  dialogExamine.visible = true;
  dialogExamine.title = "IQC检测单";
}

const isActiveStatus = (row: MaterialOrderDetailVO) => {
  const $table = xTable.value.xTableRef;
  if ($table) {
    return $table.isEditByRow(row);
  }
};

const saveRowEvent = (row: MaterialOrderDetailVO) => {
  console.log(row)
  const $table = xTable.value.xTableRef;
  if ($table) {
    $table.clearEdit().then(() => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        VXETable.modal.message({content: `保存成功！name=${row.name}`, status: "success"});
      }, 300);
    });
  }
};

const cancelRowEvent = (row: MaterialOrderDetailVO) => {
  const $table = xTable.value.xTableRef;
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
    $table.id = null;
    otherReceiptList.value.push($table);
    console.log(xTable.value.xTableRef)
  }
  console.log(otherReceiptList.value)
};

/**
 * 编辑
 * @param row
 */
const editRowEvent = (row: MaterialOrderDetailVO) => {
  const $table = xTable.value.xTableRef;
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
  ElMessageBox.confirm(
      "您确定要删除该记录吗?",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
  )
      .then(() => {
        ElMessage({
          type: "success",
          message: "删除成功"
        });
        otherReceiptList.value.splice(index, 1);//删除该行记录
      })
      .catch(() => {
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
        await updateMaterialOrder(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addMaterialOrder(form.value).finally(() =>  buttonLoading.value = false);
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




onMounted(() => {
  //等于1代表查询待IQC检测列表
  queryParams.value.status = "1";
  getMaterialReceive();
});
</script>
