<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
        <el-tabs v-model="editableTabsValue" @tab-change="getVoidedList()" class="xtable-tab">
            <el-tab-pane label="待发货" :name="1">
              <div class="p-2" style="text-align: right">
                <el-button :loading="buttonLoading" type="primary" @click="handleGenerate()" >生成送货单</el-button>
              </div>

              <XTable toolId="purchaseRawMaterialDeliveryWaitSend" v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content"
                :page-params="{ perfect: true, total: total }" :data="otherReceiptList"
                :columnList="columnList" ref="tableRef" size="mini"
                border @searchChange="searchChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
                <template #default-make="scope">
                </template>
              </XTable>

            </el-tab-pane>
            <el-tab-pane label="发货明细" width="100%" :name="2">
              <XTable toolId="purchaseRawMaterialDeliverySendDetial" v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content"
                :page-params="{ perfect: true, total: total }" :data="rawMaterialDeliveryList"
                :columnList="columnList2" ref="xTable" size="mini"
                border @searchChange="searchChange2" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
                <template #default-make="scope">
                      <el-button link type="primary" @click="handleUpdate(scope.row)">详情</el-button>
                      <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
                      <el-button link type="primary" >打印</el-button>
                </template>
              </XTable>

            </el-tab-pane>
        </el-tabs>
    </el-card>
    <!-- 添加或修改供应商物料发货记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" >
      <el-form ref="rawMaterialDeliveryFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料ID" prop="rawMaterialId">
          <el-input v-model="form.rawMaterialId" placeholder="请输入物料ID" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="采购明细id" prop="materialOrderDetailId">
          <el-input v-model="form.materialOrderDetailId" placeholder="请输入采购明细id" />
        </el-form-item>
        <el-form-item label="发货人ID" prop="sendUserId">
          <el-input v-model="form.sendUserId" placeholder="请输入发货人ID" />
        </el-form-item>
        <el-form-item label="客户ID" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户ID" />
        </el-form-item>
        <el-form-item label="客户地址id" prop="customerAddressId">
          <el-input v-model="form.customerAddressId" placeholder="请输入客户地址id" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 供应商送货单 -->
    <el-dialog v-model="dialogExamine.visible" :title="dialogExamine.title" center width="85%" draggable>
      <!-- 主体 -->
      <el-form :label-position="labelPosition" border label-width="100px" :model="formInline" :disabled="dialogExamine.title === '供应商物料发货详情'">
        <el-row>

          <el-col :span="12">
            <el-form-item size="small" label="客户编码：">
              <!--当前登录用户-->
              <el-input v-model="formInline.customerCode" placeholder="username" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="客户名称：">
              <el-input v-model="formInline.customerName" placeholder="receiptDate" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="送货时间：">
              <el-date-picker
                  style="width: 100%;"
                  v-model="formInline.deliveryTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  format="YYYY-MM-DD HH:mm:ss"
                  clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="送货地址：">
              <el-input v-model="formInline.customerAddressId" placeholder="送货地址" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="送货车辆：">
              <el-input v-model="formInline.loaderCar" placeholder="请输入送货车辆信息" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="装运人员：">
              <el-input v-model="formInline.loaderName" placeholder="请输入装运人员信息" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="物流公司：">
              <el-select v-model="formInline.logisticsCompany" clearable placeholder="请选择物流公司">
              <el-option
                  v-for="item in logistics_company"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="物流单号：">
              <el-input v-model="formInline.logisticsCode" placeholder="请输入物流单号"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <vxe-table
          border
          keep-source
          size="small"
          align="center"
          height="345px"
          :row-config="{height: 50}"
          show-footer="true"
          show-overflow
          :loading="loading"
          ref="xTableDelivery"
          :column-config="{resizable: true}"
          :data="otherDeliveryList"
          :edit-config="{trigger: 'click', mode: 'row', autoClear: true, showStatus: true}"
      >
        <vxe-column type="seq" title="序号"></vxe-column>
        <vxe-column field="code" title="采购单号" width="90px">
          <template #edit="{ row }">
            <el-input v-model="row.code"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="materialCode" title="物料编码">
          <template #edit="{ row }">
            <el-input v-model="row.materialCode"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="materialName" title="物料名称">
          <template #edit="{ row }">
            <el-input v-model="row.materialName"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="materialQuality" title="材质牌号">
          <template #edit="{ row }">
            <el-input v-model="row.materialQuality"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="boardThickness" title="板厚">
          <template #edit="{ row }">
            <el-input v-model="row.boardThickness"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="copperThickness" title="铜厚">
          <template #edit="{ row }">
            <el-input v-model="row.copperThickness"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="color" title="颜色">
          <template #edit="{ row }">
            <el-input v-model="row.color"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="level" title="级别">
          <template #edit="{ row }">
            <el-input v-model="row.level"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="length" title="长（mm）">
          <template #edit="{ row }">
            <el-input v-model="row.length"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="width" title="宽（mm）">
          <template #edit="{ row }">
            <el-input v-model="row.width"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="manufacturer" title="品牌">
          <template #edit="{ row }">
            <el-input v-model="row.manufacturer"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="deliverTime" title="要求交期">
          <template #edit="{ row }">
            <el-input v-model="row.deliverTime"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="quantity" title="采购数量">
          <template #edit="{ row }">
            <el-input v-model="row.quantity"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="units" title="库存单位">
          <template #edit="{ row }">
            <el-input v-model="row.units"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="editDeliveryQuantity" title="送货数量" type="number" :edit-render="{}">
          <template #edit="{ row }">
            <el-input v-model="row.editDeliveryQuantity"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="differenceQuantity" title="差欠数量">
          <template #edit="{ row }">
            <el-input v-model="row.differenceQuantity"></el-input>
          </template>
        </vxe-column>
<!--        <vxe-column field="productionDate" title="生产日期" sort-type="string" :edit-render="{}">
          <template #edit="{ row }">
            <el-date-picker style="width: 100%" size="small" v-model="row.productionDate" type="datetime"
                            placeholder="选择日期" value-format="YYYY-MM-DD" format="YYYY-MM-DD"
                            clearable @change="dispatchTimeChange(row)"/>
          </template>
        </vxe-column>-->
        <vxe-column field="remark" title="备注" sort-type="string" :edit-render="{}">
          <template #edit="{ row }">
            <el-input v-model="row.remark"></el-input>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="200"  v-if="dialogExamine.title != '供应商物料发货详情'">
          <template #default="{ row,rowIndex}">
            <el-button size="small" text="plain" @click="deleteRowEvent(row,rowIndex)">删除</el-button>
          </template>
        </vxe-column>
      </vxe-table>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="dialogExamine.visible = false">关闭</el-button>
            <el-button type="primary"  v-if="dialogExamine.title != '供应商物料发货详情'" @click="savaDelivery" >保存</el-button>
          </span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="RawMaterialDelivery" lang="ts">
import {
  addRawMaterialDelivery,
  delRawMaterialDelivery,
  getRawMaterialDelivery,
  listRawMaterialDelivery, saveRawMaterialDeliver,
  updateRawMaterialDelivery
} from '@/api/purchase/rawMaterialDelivery';
import {
  RawMaterialDeliveryForm,
  RawMaterialDeliveryQuery,
  RawMaterialDeliveryVO,
  DirectMaterialDeliver
} from '@/api/purchase/rawMaterialDelivery/types';
import {ref} from "vue";
import {MaterialOrderDetailVO} from "@/api/purchase/materialOrderDetail/types";
import {listPurchaseMaterialOrderDetail} from "@/api/purchase/materialOrderDetail";
import {VxeTableInstance} from "vxe-table";
import dayjs from "dayjs";
import {ElMessage, ElMessageBox} from "element-plus";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const rawMaterialDeliveryList = ref<RawMaterialDeliveryVO[]>([]);
const otherReceiptList = ref<MaterialOrderDetailVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

// 物流公司
const {logistics_company} = toRefs<any>(proxy?.useDict("logistics_company"));

const queryFormRef = ref<ElFormInstance>();
const rawMaterialDeliveryFormRef = ref<ElFormInstance>();
const otherDeliveryList = ref<MaterialOrderDetailVO[]>([]);
let formInline = reactive({
  customerCode: undefined,
  customerName: undefined,
  deliveryTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  customerAddressId: undefined,
  loaderCar: undefined,
  loaderName: undefined,
  logisticsCompany: undefined,
  logisticsCode: undefined,
  customerId:undefined,
  addressId:undefined,
});

// 新增属性
const editableTabsValue = ref(1);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: RawMaterialDeliveryForm = {
  id: undefined,
  createDeptName: undefined,
  createByName: undefined,
  updateByName: undefined,
  rawMaterialId: undefined,
  deliveryTime: undefined,
  quantity: undefined,
  unit: undefined,
  materialOrderDetailId: undefined,
  remark: undefined,
  sendUserId: undefined,
  sendUserName: undefined,
  code: undefined,
  customerName: undefined,
  customerId: undefined,
  customerAddressId: undefined,
  loaderCar: undefined,
  loaderName: undefined,
  logisticsCompany: undefined,
  logisticsCode: undefined
}
const data = reactive<PageData<RawMaterialDeliveryForm, RawMaterialDeliveryQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    rawMaterialId: undefined,
    deliveryTime: undefined,
    quantity: undefined,
    unit: undefined,
    materialOrderDetailId: undefined,
    sendUserId: undefined,
    sendUserName: undefined,
    code: undefined,
    customerName: undefined,
    customerId: undefined,
    customerAddressId: undefined,
    loaderCar: undefined,
    loaderName: undefined,
    logisticsCompany: undefined,
    logisticsCode: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    createDeptName: [
      { required: true, message: "创建部门名称不能为空", trigger: "blur" }
    ],
    createByName: [
      { required: true, message: "创建者名称不能为空", trigger: "blur" }
    ],
    updateByName: [
      { required: true, message: "更新者名称不能为空", trigger: "blur" }
    ],
    rawMaterialId: [
      { required: true, message: "物料ID不能为空", trigger: "blur" }
    ],
    deliveryTime: [
      { required: true, message: "发货时间不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    unit: [
      { required: true, message: "单位不能为空", trigger: "blur" }
    ],
    materialOrderDetailId: [
      { required: true, message: "采购明细id不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    sendUserId: [
      { required: true, message: "发货人ID不能为空", trigger: "blur" }
    ],
    sendUserName: [
      { required: true, message: "发货人名称不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "发货编号不能为空", trigger: "blur" }
    ],
    customerName: [
      { required: true, message: "客户名称不能为空", trigger: "blur" }
    ],
    customerId: [
      { required: true, message: "客户ID不能为空", trigger: "blur" }
    ],
    customerAddressId: [
      { required: true, message: "客户地址id不能为空", trigger: "blur" }
    ],
    loaderCar: [
      { required: true, message: "送货车辆不能为空", trigger: "blur" }
    ],
    loaderName: [
      { required: true, message: "装运人员不能为空", trigger: "blur" }
    ],
    logisticsCompany: [
      { required: true, message: "物流公司不能为空", trigger: "blur" }
    ],
    logisticsCode: [
      { required: true, message: "物流单号不能为空", trigger: "blur" }
    ]
  }
});

const columnList = ref([
  { type: 'checkbox',fixed: 'left', width: '60', align: 'center', showOverflow: false},
  { title: "序号", fixed: 'left',width: '60',type: 'seq', align: 'center', showOverflow: false },
  { title: '采购单号',width: '100', field: 'code', align: 'center'},
  { title: '客户名称',width: '140', field: 'customerName', align: 'center'},
  { title: '收货地址',width: '140', field: 'addressName', align: 'center'},
  { title: '物料编码', width: '80',field: 'materialCode', align: 'center'},
  { title: '物料名称',width: '80', field: 'materialName', align: 'center'},
  { title: '材质牌号',width: '80', field: 'materialQuality', align: 'center' },
  { title: '板厚', width: '60',field: 'boardThickness', align: 'center' },
  { title: '铜厚', width: '60',field: 'copperThickness', align: 'center'},
  { title: '级别', width: '60',field: 'level', align: 'center' },
  { title: '颜色',width: '60', field: 'color', align: 'center' },
  { title: '长（mm）',width: '60', field: 'length', align: 'center' },
  { title: '宽（mm）', width: '60',field: 'width', align: 'center' },
  { title: '品牌',width: '80', field: 'manufacturer', align: 'center' },
  { title: '要求交期',width: '120', field: 'deliverTime', align: 'center'},
  { title: '采购数量', width: '120',field: 'quantity', align: 'center'},
  { title: '单位',width: '120', field: 'units', align: 'center' },
  { title: '送货数量',width: '120', field: 'deliveryQuantity', align: 'center' },
  { title: '差欠数量',width: '120', field: 'differenceQuantity', align: 'center' },
]);
const columnList2 = ref([
  { title: "序号", fixed: 'left',width: '60',type: 'seq', align: 'center', showOverflow: false },
  { title: '送货单号',width: '100', field: 'code', align: 'center'},
  { title: '客户编码',width: '140', field: 'customerCode', align: 'center'},
  { title: '客户名称',width: '140', field: 'customerName', align: 'center'},
  { title: '送货地址',width: '140', field: 'addressName', align: 'center'},
  { title: '开单人',width: '140', field: 'sendUserName', align: 'center'},
  { title: '开单时间',width: '140', field: 'deliveryTime', align: 'center'},
  { title: '备注',width: '140', field: 'remark', align: 'center'},
  { title: '采购单号',width: '140', field: 'orderCode', align: 'center'},
  { title: '物料编码', width: '80',field: 'materialCode', align: 'center'},
  { title: '物料名称',width: '80', field: 'materialName', align: 'center'},
  { title: '材质牌号',width: '80', field: 'materialQuality', align: 'center' },
  { title: '板厚', width: '60',field: 'boardThickness', align: 'center' },
  { title: '铜厚', width: '60',field: 'copperThickness', align: 'center'},
  { title: '级别', width: '60',field: 'level', align: 'center' },
  { title: '颜色',width: '60', field: 'color', align: 'center' },
  { title: '长（mm）',width: '60', field: 'length', align: 'center' },
  { title: '宽（mm）', width: '60',field: 'width', align: 'center' },
  { title: '品牌',width: '80', field: 'manufacturer', align: 'center' },
  { title: '要求交期',width: '120', field: 'deliveryDate', align: 'center'},
  { title: '单位',width: '120', field: 'unit', align: 'center' },
  { title: '采购数量', width: '120',field: 'purchaseQuantity', align: 'center'},
  { title: '送货数量', width: '120',field: 'quantity', align: 'center'},
  { title: '差欠数量',width: '120', field: 'differenceQuantity', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '200', fixed: 'right', showOverflow: false },
]);

const { queryParams, form, rules } = toRefs(data);
const materialOrderList = ref<MaterialOrderDetailVO[]>([]);
// 获取 搜索条件
const searchChange2 = (params: any) => {
  queryParams.value = params
  getList()
}
const searchChange = (params: any) => {
  queryParams.value = params
  getPurchaseMaterialReceipt()
}

/** 查询供应商物料发货记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listRawMaterialDelivery(queryParams.value);
  rawMaterialDeliveryList.value = res.rows;
  total.value = res.total;
  loading.value = false;

}



/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  rawMaterialDeliveryFormRef.value?.resetFields();
}

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
        otherDeliveryList.value.splice(index, 1);//删除该行记录
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除"
        });
      });
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}
const tableRef = ref<VxeTableInstance<MaterialOrderDetailVO>>();
const dialogExamine = reactive<DialogOption>({
  visible: false,
  title: '供应商送货单'
});

/**
 * 生成送货单按钮弹窗
 */
const handleGenerate = async () => {
  const $table = tableRef.value.xTableRef;
  if ($table) {
    const selectRecords = $table.getCheckboxRecords();
    //收货人
    formInline.customerCode =selectRecords[0].customerCode;
    formInline.customerName=selectRecords[0].customerName;
    formInline.customerAddressId=selectRecords[0].addressName;
    formInline.customerId=selectRecords[0].customerId;
    formInline.addressId=selectRecords[0].addressId;
    otherDeliveryList.value = selectRecords;
  }
  dialogExamine.visible = true;
  dialogExamine.title = "供应商送货单";
}

/**
 * 生成送货单保存按钮
 * @param
 */
const savaDelivery = async () => {
  const directMaterialDeliver: DirectMaterialDeliver = {
    otherDeliveryList: [],
    loaderCar:"",
    loaderName:"",
    logisticsCompany:"",
    logisticsCode:"",
    deliveryTime:"",
    customerName:"",
    customerId:"",
    customerAddressId:"",
  };
  const flag = otherDeliveryList.value.some(v => Number(v.differenceQuantity) < Number(v.editDeliveryQuantity));
  if (flag) {
    proxy?.$modal.msgError("送货数量不能大于差欠数量");
    return;
  }
  directMaterialDeliver.otherDeliveryList = otherDeliveryList.value;
  directMaterialDeliver.loaderCar=formInline.loaderCar;
  directMaterialDeliver.loaderName=formInline.loaderName;
  directMaterialDeliver.logisticsCompany=formInline.logisticsCompany;
  directMaterialDeliver.logisticsCode=formInline.logisticsCode;
  directMaterialDeliver.deliveryTime=formInline.deliveryTime;
  directMaterialDeliver.customerId=formInline.customerId;
  directMaterialDeliver.customerName=formInline.customerName;
  directMaterialDeliver.customerAddressId=formInline.addressId;
  await saveRawMaterialDeliver(directMaterialDeliver).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("生成送货单成功");
  const $table = tableRef.value.xTableRef;
  if ($table) {
    $table.clearCheckboxRow();
  }
  dialogExamine.visible = false;
  await getPurchaseMaterialReceipt();
}


/**
 * 查询tab页
 */
const getVoidedList = async () => {
    if (1 == editableTabsValue.value) {
      getPurchaseMaterialReceipt();
    } else {
        //查询发货明细
      getList();
    }
}

/**
 * 查询待收货列表
 * */
const getPurchaseMaterialReceipt = async () => {
    loading.value = true;
    const res = await listPurchaseMaterialOrderDetail(queryParams.value);
    otherReceiptList.value = res.rows;
    total.value = res.total;
    loading.value = false;
}


/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: RawMaterialDeliveryVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加供应商物料发货记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: RawMaterialDeliveryVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getRawMaterialDelivery(_id);

  //Object.assign(otherDeliveryList.value, res.data);
  otherDeliveryList.value = [res.data];
//  formInline.customerCode =res.data.customerCode;
  formInline.customerName=res.data.customerName;
 // formInline.customerAddressId=res.data.addressName;
  formInline.customerId=res.data.customerId;
//  formInline.addressId=res.data.addressId;
  formInline.logisticsCode=res.data.logisticsCode;
  dialogExamine.visible = true;
  dialogExamine.title = "供应商物料发货详情";
}

/** 提交按钮 */
const submitForm = () => {
  rawMaterialDeliveryFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateRawMaterialDelivery(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addRawMaterialDelivery(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: RawMaterialDeliveryVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除供应商物料发货记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delRawMaterialDelivery(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('purchase/rawMaterialDelivery/export', {
    ...queryParams.value
  }, `rawMaterialDelivery_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
    /*queryParams.value.status = "1";*/
  getPurchaseMaterialReceipt();
});
</script>
