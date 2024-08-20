<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs type="border-card" v-model="editableTabsValue" @tab-change="getVoidedList()" class="xtable-tab">
        <el-tab-pane label="物料盘点" :name="1">
          <div class="p-2" style="text-align: right;width: 100%">
            <el-button :loading="buttonLoading" type="primary" @click="materialInventoryReview">物料盘点</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="exportExcelBefore">导出</el-button>
          </div>
        <XTable toolId="purchaseMaterialCheckDetail" v-model:page-size="queryParams.pageSize" height="100%" class="xtable-content"
                v-model:current-page="queryParams.pageNum"
                :page-params="{ perfect: true, total: total }"
                :data="materialCheckDetailList"
                :columnList="columnList"
                :intervalCondition="['checkTime']"
                ref="XTableRef" :loading="loading"
                border :showRefresh="true"
                @searchChange="searchChange"
                :column-config="{ resizable: true }"
                @checkbox-all="selectChangeEvent"
                @checkbox-change="selectChangeEvent"
                :checkbox-config="{reserve: true }"
                :row-config="{ keyField:'id' }"
        >
          <template #default-type="scope">
            <dict-tag :options="check_detail_type" :value="scope.row.type" />
          </template>
            <template #default-make="scope">
                    <el-button link type="primary" @click="handleDelete(scope.row)" >删除</el-button>
                    <el-button link type="primary" @click="handleCheckMaterial(scope.row)" >盘点记录</el-button>
            </template>
        </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
        v-model="exportVisible"
        title="导出提示"
        width="20%"
        align-center
        destroy-on-close
    >
      <span>
        没有设置起始时间，将默认导出30天内的数据
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportVisible = false">取消</el-button>
          <el-button type="primary" @click="exportExcel">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>


    <!-- 添加或修改物料盘点明细对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="80%" append-to-body modal-class="material-check-drawer" destroy-on-close>
      <el-divider content-position="left">已选物料</el-divider>

      <XTable  toolId="purchaseCheckDetailChecked" :pageShow="false" :data="tableDataBorrowMaterial" :columnList="checkColumnlList"
                ref="xTableBorrowMaterial" border keep-source :column-config="{ resizable: true }"
                :checkbox-config="{ reserve: true }" :edit-rules="validRules"
                :edit-config="{ trigger: 'click', mode: 'row', autoClear: true, showStatus: true }" height="350px"
                :scroll-y="{ enabled: true, gt: 10 }" :row-config="{ keyField: 'id' }" >
      
        <template #edit-storageName="{ row }">
          <vxe-select v-model="row.storageId">
            <vxe-option v-for="item in storageOptions" :key="item.id" :label="item.name"
                        :value="item.id"/>
          </vxe-select>
        </template>
        <template #default-storageName="{row}">
          <div v-for="item in storageOptions">
            <span v-if="item.id==row.storageId">{{item.name}}</span>
          </div>
        </template>

        <template #edit-inventoryQuantity="{ row }">
          <el-input-number v-model="row.inventoryQuantity" 
          :precision="2" style="width: 99%;"  
          :controls="false" :min="0" maxlength="11" />
        </template>
        <template #default-inventoryQuantity="{ row }">
            {{ row.inventoryQuantity }}
        </template>
        <template #edit-producedQuantity="{ row }">
          <el-input-number v-model="row.producedQuantity" 
          :precision="2" style="width: 99%;"  
          :controls="false" :min="0" maxlength="11" />
        </template>
        <template #default-producedQuantity="{ row }">
            {{ row.producedQuantity }}
        </template>

        <template #edit-remark="{ row }">
          <el-input  maxLength="1000"    style="width: 99%;" 
                    v-model="row.remark" />
        </template>
        <template #default-remark="{ row }">
          {{row.remark}}
        </template>

      <template #default-make="{ row,rowIndex}">
        <el-button size="small" type="primary" link @click="deleteRowEventBorrow(row,rowIndex)">删除</el-button>
      </template>
    </XTable>
      <el-divider content-position="left">待选物料</el-divider>
      <div style="text-align: right">
        <el-button :loading="buttonLoading" type="primary" @click="submitPurchase">确定</el-button>
      </div>
      <el-container>
        <el-main style="padding:0px;overflow-x:hidden;">
          <XTable toolId="purchaseCheckDetailWaitCheck" :pageShow="true" class="xtable-content"
                  v-model:current-page="queryParamsCommodity.pageNum"
                  v-model:page-size="queryParamsCommodity.pageSize"
                  :page-params="{ perfect: true, total: total }"
                  :data="materialInventoryList"
                  :columnList="columnMaterialList"
                  ref="purchaseTable" border
                  @pagination="choosePurchase"
                  height="400px"
                  @searchChange="searchChangeOrder"
                  :column-config="{ resizable: true }"
                  :checkbox-config="{ reserve: true }"
                  @checkbox-all="handleSelectionChangePurchase"
                  @checkbox-change="handleSelectionChangePurchase"
                  :row-config="{ keyField: 'id'}">
          </XTable>
        </el-main>
      </el-container>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="dialog.visible = false">取消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="savaMaterialCheckDetail">确定</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <!-- 物料盘库记录 -->
    <el-dialog :title="dialogExamine.title" v-model="dialogExamine.visible" width="90%" append-to-body center>
      <vxe-table
          border
          keep-source
          size="mini"
          align="center"
          height="345px"
          :row-config="{height: 50}"
          show-footer="true"
          :edit-rules="validRules"
          show-overflow
          :loading="loading"
          ref="xTableBorrowMaterial"
          :column-config="{resizable: true}"
          :data="materialCheckList"
      >
        <vxe-column type="seq" title="序号"></vxe-column>
        <vxe-column field="type" title="盘点类型">
          <template #default="scope">
            <dict-tag :options="check_detail_type" :value="scope.row.type"/>
          </template>
        </vxe-column>
        <vxe-column field="checkTime" title="盘库日期">
          <template #edit="{ row }">
            <el-input v-model="row.checkTime"></el-input>
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

        <vxe-column field="supplierName" title="供应商">
          <template #edit="{ row }">
            <el-input v-model="row.supplierName"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="productionDate" title="生产日期">
          <template #edit="{ row }">
            <el-input v-model="row.productionDate"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="expirationDays" title="保质期(天)">
          <template #edit="{ row }">
            <el-input v-model="row.expirationDays"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="expirationDate" title="过期日期">
          <template #edit="{ row }">
            <el-input v-model="row.expirationDate"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="storageName" title="库位">
          <template #edit="{ row }">
            <el-input v-model="row.storageName"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="inventoryQuantity" title="库存数">
          <template #edit="{ row }">
            <el-input v-model="row.inventoryQuantity"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="quantity" title="盘点数量">
          <template #edit="{ row }">
            <el-input v-model="row.quantity"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="price" title="盘点单价">
          <template #edit="{ row }">
            <el-input v-model="row.price"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="totalAmount" title="盘点金额">
          <template #edit="{ row }">
            <el-input v-model="row.totalAmount"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注">
          <template #edit="{ row }">
            <el-input v-model="row.remark"></el-input>
          </template>
        </vxe-column>
      </vxe-table>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="dialogExamine.visible = false">关闭</el-button>
          </span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="MaterialCheckDetail" lang="ts">
import {
  addMaterialCheckDetail,
  delMaterialCheckDetail,
  getMaterialCheckDetail,
  listMaterialCheckDetail,
  savaRawMaterialCheckDetail,
  updateMaterialCheckDetail
} from '@/api/purchase/materialCheckDetail';
import {
  MaterialCheckDetailForm,
  MaterialCheckDetailQuery,
  MaterialCheckDetailVO
} from '@/api/purchase/materialCheckDetail/types';
import {VxeTableEvents, VxeTableInstance} from 'vxe-table'
import {MaterialInventoryVO} from "@/api/purchase/materialInventory/types";
import {ref} from "vue";
import {listMaterialInventory, listRawMaterialInventory} from "@/api/purchase/materialInventory";
import {listSupplierNoPage} from "@/api/basedata/supplier";
import {MaterialStorageVO} from "@/api/purchase/materialStorage/types";
import {listMaterialStorage} from "@/api/purchase/materialStorage";
import {OrderVO} from "@/api/order/directOrder/types";
import dayjs from "dayjs";
import {DirectMaterialBorrow} from "@/api/purchase/materialBorrow/types";
import { deepClone } from '@/utils'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const materialCheckDetailList = ref<MaterialCheckDetailVO[]>([]);
const materialCheckList = ref<MaterialCheckDetailVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const materialCheckDetailFormRef = ref<ElFormInstance>();
const materialInventoryList = ref<MaterialInventoryVO[]>([]);
const xTableBorrowMaterial = ref<VxeTableInstance<MaterialInventoryVO>>();
const purchaseTable = ref();
const dialog = reactive<DialogOption>({
  visible: false,
  title: '物料盘点'
});

const dialogExamine = reactive<DialogOption>({
  visible: false,
  title: '物料盘库记录'
});

const queryParamsCommodity = ref({
  checked:false,
  pageNum: 1,
  pageSize: 10,
  params: {}
});

//仓库
let storageOptions: MaterialStorageVO[] = [];

/**
 * 物料盘点 选择物料
 */
const choosePurchase = async() => {
  const res = await listRawMaterialInventory(queryParamsCommodity.value);
  materialInventoryList.value = res.rows;
  console.log(materialInventoryList.value);
  total.value = res.total;
}

const initFormData: MaterialCheckDetailForm = {
  id: undefined,
  rawMaterialId: undefined,
  quantity: undefined,
  price: undefined,
  expirationDays: undefined,
  supplierId: undefined,
  remark: undefined,
  rawMaterialInvontoryId: undefined,
  code: undefined,
  type: undefined,
  checkTime: undefined,
  checkUser: undefined,
  checkUserName: undefined,
  expirationDate: undefined,
  storageId: undefined,
  ownerId: undefined
}

const data = reactive<PageData<MaterialCheckDetailForm, MaterialCheckDetailQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    rawMaterialId: undefined,
    quantity: undefined,
    price: undefined,
    expirationDays: undefined,
    supplierId: undefined,
    rawMaterialInvontoryId: undefined,
    code: undefined,
    type: undefined,
    createTime:undefined,
    checkTimeStart:undefined,
    checkTime: undefined,
    checkUser: undefined,
    checkUserName: undefined,
    expirationDate: undefined,
    storageId: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    rawMaterialId: [
      { required: true, message: "物料ID不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "单价不能为空", trigger: "blur" }
    ],
    expirationDays: [
      { required: true, message: "保质期天数不能为空", trigger: "blur" }
    ],
    supplierId: [
      { required: true, message: "供应商ID不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    rawMaterialInvontoryId: [
      { required: true, message: "物料库存表ID不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "盘点单号不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型 不能为空", trigger: "change" }
    ],
    checkTime: [
      { required: true, message: "盘点时间不能为空", trigger: "blur" }
    ],
    checkUser: [
      { required: true, message: "盘点人不能为空", trigger: "blur" }
    ],
    checkUserName: [
      { required: true, message: "盘点人名称不能为空", trigger: "blur" }
    ],
    expirationDate: [
      { required: true, message: "到期日期不能为空", trigger: "blur" }
    ],
    storageId: [
      { required: true, message: "仓库ID不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "所属单位ID不能为空", trigger: "blur" }
    ]
  }
});
// 获取 搜索条件
const searchChangeOrder = (params: any) => {
  queryParamsCommodity.value = params;
  queryParamsCommodity.value.checked = false;
  choosePurchase();
}

const {check_detail_type} = toRefs<any>(proxy?.useDict("check_detail_type"));
const XTableRef = ref()
let resDictData = ref({
  //盘点类型
  checkDetail_type: [],
})

const statusFilterData =ref( [
  { label: '盘入', value: "1" },
  { label: '盘出', value: "2" },
])

const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', field: 'index', width: '60' },
  {title: '盘点单号', field: 'code', align: 'center',width: '120', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  {title: '盘点日期', field: 'checkTime', align: 'center',width: '100',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'date', valueFormat: 'YYYY-MM-DD'},
      endParams: {placeholder: '请输入结束时间', type: 'date', valueFormat: 'YYYY-MM-DD'},
    }},
  {title: '盘点类型 ', field: 'type', align: 'center',width: '80',
    filterType: 'radio',
    filterParam: { placeholder: '请输入状态' },
    filterData: () => statusFilterData.value},
  {title: '盘点人名称', field: 'checkUserName', align: 'center',width: '80'},
  { title: '物料编码', field: 'materialCode', align: 'center',width: '80', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  { title: '物料名称', field: 'materialName', align: 'center',width: '80', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''} },
  { title: '材质牌号', field: 'materialQuality', align: 'center',width: '80', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  { title: '板厚', field: 'boardThickness', width: '80', align: 'center', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  { title: '铜厚', field: 'copperThickness', width: '50', align: 'center', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  { title: '颜色', field: 'color', width: '50', align: 'center', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''} },
  { title: '级别', field: 'level', width: '50', align: 'center', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''} },
  { title: '长', field: 'length', width: '60', align: 'center', showOverflow: false,filterType: 'input', filterParam: {placeholder: ''}},
  { title: '宽', field: 'width', width: '60', align: 'center', showOverflow: false,filterType: 'input', filterParam: {placeholder: ''}},
  { title: '厚度', field: 'thickness',width: '80', align: 'center', showOverflow: false },
  { title: '规格型号', field: 'specification',width: '120', align: 'center' },
  { title: '直径', field: 'diameter',width: '80', align: 'center' },
  { title: '品牌', field: 'manufacturer', align: 'center', width: '80', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}, },
 /* { title: '供应商', field: 'supplierName', width: '200', align: 'center', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  { title: '生产日期', field: 'productionDate', width: '100', align: 'center', showOverflow: false, },
  {title: '保质期天数', field: 'expirationDays',width: '120', align: 'center', showOverflow: false},
  {title: '过期日期', field: 'expirationDate', align: 'center',width: '120', showOverflow: false,},*/
  {title: '库位', field: 'storageName', align: 'center',width: '80', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  {title: '库存数', field: 'inventoryQuantity', align: 'center',width: '80', showOverflow: false},
  {title: '盘点数量', field: 'quantity', align: 'center',width: '80', showOverflow: false},
  {title: '盘点单价', field: 'price', align: 'center', width: '80', showOverflow: false},
  {title: '盘点金额', field: 'totalAmount', align: 'center',width: '80', showOverflow: false},
  {title: '备注', field: 'remark', align: 'center',width: '80', showOverflow: false},
  {title: '操作', field: 'make', align: 'center', width: '140', fixed: 'right',showOverflow:false},
]);

const columnMaterialList = ref([
   {type: 'checkbox', width: '60', align: "center", fixed: 'left'},
  { title: '物料编码', field: 'code', align: 'center',width: '80', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}, fixed: 'left'},
  { title: '物料名称', field: 'name', align: 'center',width: '120', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}, fixed: 'left' },
  { title: '材质牌号', field: 'materialQuality', align: 'center',width: '80', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}, fixed: 'left'},
  { title: '板厚', field: 'boardThickness', width: '80', align: 'center', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}, fixed: 'left'},
  { title: '铜厚', field: 'copperThickness', width: '80', align: 'center', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  { title: '颜色', field: 'color', width: '80', align: 'center', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''} },
  { title: '级别', field: 'level', width: '80', align: 'center', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''} },
  { title: '长', field: 'length', width: '60', align: 'center', showOverflow: false,filterType: 'input', filterParam: {placeholder: ''}, fixed: 'left'},
  { title: '宽', field: 'width', width: '60', align: 'center', showOverflow: false,filterType: 'input', filterParam: {placeholder: ''}, fixed: 'left'},
  { title: '品牌', field: 'manufacturer', align: 'center', width: '80', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''},},
  { title: '单位', field: 'units', width: '80', align: 'center',},
  { title: '厚度', field: 'thickness',width: '80', align: 'center', showOverflow: false },
  { title: '规格型号', field: 'specification',width: '120', align: 'center', filterType: 'input', filterParam: {placeholder: ''}, },
  { title: '直径', field: 'diameter',width: '80', align: 'center' },
 /* { title: '生产日期', field: 'productionDate', width: '80', align: 'center', showOverflow: false,},
  { title: '保质期', field: 'expirationDays', width: '80', align: 'center'},
  { title: '过期日期', field: 'expirationDate', align: 'center', width: '120', },*/
  { title: '实际库存', field: 'quantity', width: '60', align: 'center', showOverflow: false, fixed: 'right',},
  { title: '可用库存', field: 'quantity', align: 'center', width: '60', fixed: 'right',},
  { title: '在途数', field: 'inTransitNumber', align: 'center', width: '60', fixed: 'right' },
]);

const checkColumnlList = ref([
  { title: '序号',type: 'seq', width: '40', align: "center", fixed: 'left'},
  { title: '物料编码', field: 'code', align: 'center',width: '80', showOverflow: false, },
  { title: '物料名称', field: 'name', align: 'center',width: '120', showOverflow: false, },
  { title: '材质牌号', field: 'materialQuality', align: 'center',width: '80', showOverflow: false, },
  { title: '板厚', field: 'boardThickness', width: '80', align: 'center', showOverflow: false, },
  { title: '铜厚', field: 'copperThickness', width: '80', align: 'center', showOverflow: false, },
  { title: '级别', field: 'level', width: '80', align: 'center', showOverflow: false, },
  { title: '颜色', field: 'color', width: '80', align: 'center', showOverflow: false, },
  { title: '长', field: 'length', width: '60', align: 'center', showOverflow: false, },
  { title: '宽', field: 'width', width: '60', align: 'center', showOverflow: false, },
  { title: '品牌', field: 'manufacturer', align: 'center', width: '80', showOverflow: false, },
  { title: '规格型号', field: 'specification', align: 'center', width: '80', showOverflow: false, },
  { title: '存货仓', field: 'storageName', width: '80', align: 'center',editRender:{}},
  { title: '总可用库存', field: 'quantity', align: 'center', width: '60', },
  { title: '盘入数量', field: 'inventoryQuantity',width: '80', align: 'center', showOverflow: false,editRender:{} },
  { title: '盘出数量', field: 'producedQuantity',width: '120', align: 'center',editRender:{}  },
  { title: '备注', field: 'remark',width: '220', align: 'center',editRender:{} },
  { title: '操作', field: 'make', width: '60', align: 'center', showOverflow: false, fixed: 'right',},
]);

const checkedMaterialCheckDetailList = ref<MaterialCheckDetailVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

const selectChangeEvent: VxeTableEvents.CheckboxAll<MaterialCheckDetailVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
        const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
        checkedMaterialCheckDetailList.value = selectRecords.map(item => item);
    }
}
const tableDataBorrowMaterial = ref<MaterialInventoryVO[]>([]);
//选择物料确认
let alreadySelectPurchase = ref<MaterialInventoryVO[]>([]);

const tabCheckedList = ref<MaterialCheckDetailVO[]>([]);
//选择订单
const handleSelectionChangePurchase = (val: MaterialInventoryVO[]) => {
  console.log("handleSelectionChangePurchase",val.records);
  const   purchaseTableRef=purchaseTable.value.xTableRef;
  //当前选中数据
  const   curCheck= purchaseTableRef.getData().filter((item:any)=>purchaseTableRef.isCheckedByCheckboxRow(item));
  //当前未选中数据
  const   dCurCheck= purchaseTableRef.getData().filter((item:any)=>!purchaseTableRef.isCheckedByCheckboxRow(item));

  console.log("deliverCurCheck",curCheck);
  console.log("r_deliverCurCheck",dCurCheck);
  val.records.forEach((item:any) => {
    let hasval=tabCheckedList.value.some(v => v.id == item.id);
    if(!hasval){
      tabCheckedList.value.push(item);
    }
  })
  //tabCheckedList删除未选中数据删除

  const filteredList = tabCheckedList.value.filter(tabItem => !dCurCheck.some((del:any) => del.id === tabItem.id));
  tabCheckedList.value=filteredList;

  console.log("tabCheckedList",tabCheckedList.value);
  const $table = purchaseTable.value.xTableRef
  if ($table) {
    // 获取翻页保留的列表数据和选择的行数据列表
    const selectRecords = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords())
    alreadySelectPurchase.value = selectRecords.map(item => item);
  }
}
const submitPurchase = () => {
  let tempList = []
  const tempOldList = deepClone(tableDataBorrowMaterial.value || [])
  const list = tabCheckedList.value.map((item) => {
    const materialInventoryVO: MaterialInventoryVO = {
      id: "",
      materialCode: "",
      code:"",
      name: "",
      boardThickness: "",
      copperThickness: "",
      level: "",
      color: "",
      length: "",
      width: "",
      inventoryId:"",
      manufacturer: "",
      materialQuality: 0,
      supplierName: "",
      quantity: "",
      expirationDate: "",
      expirationDays: 0,
      productionDate: "",
      price: "",
      storageName:"",
      rawMaterialId:"",
      storageId:"",
      supplierId:"",
      specification:"",
    };
    Object.keys(materialInventoryVO).forEach((info) => {
      materialInventoryVO[info] = item[info] ? item[info] : materialInventoryVO[info];
    })
    tempList.push(materialInventoryVO);
  })
  tableDataBorrowMaterial.value = tempList
  tableDataBorrowMaterial.value.map((item) => {
    const crtObj = tempOldList.find((v: any) => v.id == item.id)
    if (crtObj) {
      for (let key in crtObj) {
        item[key] = crtObj[key]
      }
    }
  })

}

const suppliers = ref<any>([]);
const getSupplierLists = async () => {
  const res = await listSupplierNoPage();
  console.log(res);
  suppliers.value = res;
  suppliers.value.forEach(item => {
    item.supplierName = String(item.supplierName)
  })
  console.log(suppliers);
}

/**
 * 删除 盘点删除
 * @param row
 * @param index
 */
const deleteRowEventBorrow = (row: MaterialInventoryVO, index: number) => {
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
        tableDataBorrowMaterial.value.splice(index, 1);//删除该行记录
        //删除选中的记录
        //tabCheckedList.value = tabCheckedList.value.filter(item => item.id != row.id);
        console.log("tabCheckedList.value",tabCheckedList.value)
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除"
        });
      });
};


// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}


/**
 * 物料盘点弹窗
 */
const materialInventoryReview= async () => {
  tabCheckedList.value = [];

  //queryParamsCommodity.pageNum = 1;
  queryParamsCommodity.value = {
    checked:false,
    pageNum: 1,
    pageSize: 10,
    params: {}
  };
  choosePurchase();
  getSupplierLists();
  const storageResponse: any = await listMaterialStorage();
  storageOptions = storageResponse.rows;
  tableDataBorrowMaterial.value.length = 0;
  dialog.visible=true;

}

/** 查询物料盘点明细列表 */
const getList = async () => {
  loading.value = true;
  const res = await listMaterialCheckDetail(queryParams.value);
  materialCheckDetailList.value = res.rows;
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
  materialCheckDetailFormRef.value?.resetFields();
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

/**
 *
 * @param row
 */
const dispatchTimeChange = (row: MaterialInventoryVO) => {
  if (row.expirationDays != 0) {
    const dayjs1 = dayjs(row.productionDate);
    const dayjs2 = dayjs1.add(row.expirationDays, 'day');
    row.expirationDate = dayjs2.format("YYYY-MM-DD");
  }else {
    row.expirationDate = row.productionDate;
  }
}
/**
 *
 * @param row
 */
const dispatchTimeChangeExpiration = (row: MaterialInventoryVO) => {
  if (row.expirationDays != undefined || row.expirationDays!="") {
    const dayjs1 = dayjs(row.productionDate);
    const dayjs2 = dayjs1.add(row.expirationDays, 'day');
    row.expirationDate = dayjs2.format("YYYY-MM-DD");
  }else {
    row.expirationDate = row.productionDate;
  }
}



/** 多选框选中数据 */
const handleSelectionChange = (selection: MaterialCheckDetailVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加物料盘点明细";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MaterialCheckDetailVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMaterialCheckDetail(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改物料盘点明细";
}

/** 提交按钮 */
const submitForm = () => {
  materialCheckDetailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMaterialCheckDetail(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addMaterialCheckDetail(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/**
 * 物料借入报存按钮
 */
const savaMaterialCheckDetail = async () => {
  if (tableDataBorrowMaterial.value.length < 1){
    proxy?.$modal.msgError("请先选择物料");
    return;
  }
  let flagRes = false
  //盘入数量不为空
  tableDataBorrowMaterial.value.forEach(v => {
    // return v.producedQuantity && !v.inventoryQuantity
    const crtFlag = !(v.producedQuantity && (v.inventoryQuantity != undefined || v.inventoryQuantity != null || v.inventoryQuantity != ''))
    // console.log(crtFlag, v.producedQuantity, !v.inventoryQuantity)
    if (crtFlag) {
      // if (!flag10){
      // const flag = tableDataBorrowMaterial.value.some(v => !v.supplierId);
       /* const flag = !v.supplierId;
        if (flag) {
          proxy?.$modal.msgError("供应商不能为空");
          flagRes = true
          return;
        }
        const flag1 = !v.productionDate;
        // const flag1 = tableDataBorrowMaterial.value.some(v => !v.productionDate);
        if (flag1) {
          proxy?.$modal.msgError("生产日期不能为空");
          flagRes = true
          return;
        }
        const flag2 = !v.expirationDays;
        // const flag2 = tableDataBorrowMaterial.value.some(v => !v.expirationDays);
        if (flag2) {
          proxy?.$modal.msgError("保质期不能为空");
          flagRes = true
          return;
        }*/
       /* const flag8 = Number(v.expirationDays) <= 0;
        // const flag8 = tableDataBorrowMaterial.value.some(v => Number(v.expirationDays) <= 0);
        if (flag8) {
          proxy?.$modal.msgError("保质期天数必须大于0");
          flagRes = true
          return;
        }*/
        const flag3 = !v.storageId;
        // const flag3 = tableDataBorrowMaterial.value.some(v => !v.storageId);
        if (flag3) {
          proxy?.$modal.msgError("存货仓不能为空");
          flagRes = true
          return;
        }
      // }
    }
  });
  if (flagRes) {
    return
  }
  // console.log(flag10)
  const flag4 = tableDataBorrowMaterial.value.some(v => !v.inventoryQuantity && !v.producedQuantity);
  if (flag4) {
    proxy?.$modal.msgError("盘入和盘出不能都为空");
    return;
  }
  const flag5 = tableDataBorrowMaterial.value.some(v => Number(v.producedQuantity) > Number(v.quantity));
  if (flag5) {
    proxy?.$modal.msgError("盘出数量不能大于可用库存数");
    return;
  }
  const flag6 = tableDataBorrowMaterial.value.some(v => {
    // 输入数字，再删除，值会变为''，再经过Number转换，值为0，会进入判断，导致弹出提示"盘出数量必须大于0"。所以把''转换为undefined
    v.producedQuantity = v.producedQuantity == '' ? undefined : v.producedQuantity
    return Number(v.producedQuantity) <= 0
  });
  if (flag6) {
    proxy?.$modal.msgError("盘出数量必须大于0");
    return;
  }
  const flag7 = tableDataBorrowMaterial.value.some(v => {
    // 与上同理
    v.inventoryQuantity = v.inventoryQuantity == '' ? undefined : v.inventoryQuantity
    return Number(v.inventoryQuantity) <= 0
  });
  if (flag7) {
    proxy?.$modal.msgError("盘入数量必须大于0");
    return;
  }
/*  const $table = purchaseTable.value;
  if ($table) {
    $table.clearCheckboxRow();
  }*!/*/
  const directMaterialBorrow: DirectMaterialBorrow = {
    tableDataBorrowMaterialList: [],
  };
  directMaterialBorrow.tableDataBorrowMaterialList=tableDataBorrowMaterial.value;
  buttonLoading.value = true;
  await savaRawMaterialCheckDetail(directMaterialBorrow).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("保存成功");
  dialog.visible = false;
  await getList();
}

const exportVisible = ref(false);
const mainTableToolId = ref('purchaseMaterialCheckDetail');
/** 物料盘点导出*/
const exportExcelBefore = async () => {
  //先看看有没有给起始时间，没有要给出提示
  if (!queryParams.value.checkTimeStart) {
    exportVisible.value = true;
  } else {
    proxy?.download('purchase/materialCheckDetail/export', {
      ...queryParams.value, tableName: mainTableToolId.value
    }, `物料盘点_${new Date().getTime()}.xlsx`);
  }
}

const exportExcel = async () => {
  exportVisible.value = false;
  proxy?.download('purchase/materialCheckDetail/export', {
    ...queryParams.value, tableName: mainTableToolId.value
  }, `物料盘点_${new Date().getTime()}.xlsx`);
}


/**
 * 物料盘点记录按钮
 */
const handleCheckMaterial  = async (row?: MaterialCheckDetailVO) => {
  const ids = row?.rawMaterialId;
  dialogExamine.visible = true;
  loading.value = true
  const res =await getMaterialCheckDetail(ids);
  materialCheckList.value =res.rows;
  loading.value = false
}

/** 删除按钮操作 */
const handleDelete = async (row?: MaterialCheckDetailVO) => {
  const id = row?.id || ids.value;
  var code = row?.code;
  await proxy?.$modal.confirm('是否确认删除物料盘点编号为"' + code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delMaterialCheckDetail(id).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('purchase/materialCheckDetail/export', {
    ...queryParams.value
  }, `materialCheckDetail_${new Date().getTime()}.xlsx`)
}
// 新增属性
const editableTabsValue = ref(1);
const getVoidedList = async () => {
  queryParams.value.statusType = editableTabsValue.value
  getList();
}

onMounted(() => {
  getList();
  getSupplierLists();
});
</script>

<style lang="scss">
.material-check-drawer {
  .el-drawer__header {
    padding: 5px;
    margin-bottom: 10px;
  }
  .el-drawer__body {
    padding: 5px 10px;
  }
}
</style>
