<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs class="xtable-tab" type="border-card" @tab-click="radioTableHandle" v-model="radioTable">
        <el-tab-pane label="待发货列表" name="待发货列表">
          <div style="width: 100%; text-align: right; margin-bottom: 10px">
            <el-button type="primary" plain @click="handleAdd">生成送货单</el-button>
          </div>
          <XTable
            toolId="sourceFullProcessOrderDeliveryList"
            v-model:page-size="queryParams.pageSize"
            :loading="loading"
            v-model:current-page="queryParams.pageNum"
            height="100%"
            class="xtable-content"
            :showRefresh="true"
            :span-method="mergeCells"
            :intervalCondition="intervalCondition"
            :page-params="{ perfect: true, total: total }"
            :data="deliveryRecordList"
            :columnList="columnList"
            ref="XTableRef"
            border
            @searchChange="searchChange"
            @checkbox-all="selectChangeEvent"
            @checkbox-change="selectChangeEvent"
            :checkbox-config="{ checkMethod: selectableFun, showHeader: false, reserve: true }"
            :column-config="{ resizable: true }"
            :row-config="{ keyField: 'saleId' }"
          >
            <template #default-status="scope">
              <span v-if="scope.row.payablePrice != 0">{{ scope.row.status }}</span>
              <span v-else>冲销完成</span>
            </template>
            <template #default-unit="{ row }">
              <span>PCS</span>
            </template>
            <template #default-deliveryTime="scope">
              <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="待回签列表" name="待回签列表">
          <XTable
            toolId="sourceFullProcessOrderDeliveryWait"
            v-model:page-size="waitSignQueryParams.pageSize"
            :loading="loading"
            v-model:current-page="waitSignQueryParams.pageNum"
            height="100%"
            class="xtable-content"
            :showRefresh="true"
            :span-method="mergeCells"
            :intervalCondition="intervalCondition"
            :page-params="{ perfect: true, total: waitTotal }"
            :data="orderFilinOutWaitList"
            :columnList="columnList2"
            ref="custTableRef"
            border
            @searchChange="unSignSearchChange"
            :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }"
          >
            <template #default-deliveryTime="scope">
              <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-unit="{ row }">
              <span>PCS</span>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="headleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
              <el-button link type="primary" @click="doPrint(scope.row.id)">打印送货单</el-button>
              <el-button link type="primary" @click="handleSign(scope.row)" v-show="scope.row.isCallback == '0'">回签</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="已回签列表" name="已回签列表">
          <XTable
            toolId="sourceFullProcessOrderDelivery"
            v-model:page-size="signQueryParams.pageSize"
            :loading="loading"
            v-model:current-page="signQueryParams.pageNum"
            height="100%"
            class="xtable-content"
            :showRefresh="true"
            :span-method="mergeCells"
            :intervalCondition="intervalCondition"
            :page-params="{ perfect: true, total: aduitTotal }"
            :data="orderFilinOutAduitList"
            :columnList="columnList2"
            ref="aduitTableRef"
            border
            @searchChange="signSearchChange"
            :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }"
          >
            <template #default-unit="{ row }">
              <span>PCS</span>
            </template>
            <template #default-deliveryTime="scope">
              <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="headleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
              <el-button link type="primary" @click="doPrint(scope.row.id)">打印送货单</el-button>
              <el-button link type="primary" @click="handleUnSign(scope.row)" v-show="scope.row.isCallback == '1'">取消回签</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-drawer :title="drawer.title" v-model="drawer.visible" size="80%" @close="drawerCancel">
      <div class="ptable-card">
        <el-form
          style="width: 100%;"
          :model="tabForm"
          ref="orderFormRef"
          :rules="rules"
          label-width="100px"
          label-position="right"
          :disabled="drawer.title?.includes('详情') || drawer.title?.includes('审核')"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="客户编码:">
                <el-input v-model="tabForm.customerCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户名称:">
                <el-input v-model="tabForm.customerName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="送货时间:" prop="deliveryTime">
                <el-date-picker
                  style="width: 100%;"
                  v-model="tabForm.deliveryTime"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  format="YYYY-MM-DD HH:mm:ss"
                  clearable
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="送货地址:">
                <el-input v-model="tabForm.cusAddress" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="送货车辆:" prop="deliveryVehicle">
                <el-input v-model="tabForm.deliveryVehicle" maxLength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="装运人员:" prop="deliveryPersonnel">
                <el-input v-model="tabForm.deliveryPersonnel" maxLength="100" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="物流公司:" prop="logisticsCompany">
                <el-input v-model="tabForm.logisticsCompany" maxLength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物流单号:" prop="logisticsNo">
                <el-input v-model="tabForm.logisticsNo" maxLength="100" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <XTable
          :pageShow="false"
          ref="tabTable"
          :data="tabOrderList"
          border
          :columnList="orderColumnList"
          keep-source
          height="100%"
          class="ptable-content"
          :loading="dialogTableLoading"
          :edit-rules="validRules"
          size="mini"
          :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
        >
          <template #default-unit="{ row }">
            <span>PCS</span>
          </template>
          <template #default-deliveryTime="scope">
            <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
          </template>
          <template #default-make="scope">
            <el-button
              v-if="tabOrderList.length > 1"
              link
              type="primary"
              :disabled="drawer.title?.includes('详情') || drawer.title?.includes('审核')"
              @click="handleTabDelete(scope.row)"
              >删除</el-button
            >
          </template>
          <template #edit-shipQuantity="scope">
            <el-input-number
              maxLength="11"
              :precision="0"
              :controls="false"
              :disabled="drawer.title?.includes('详情') || drawer.title?.includes('审核')"
              v-model="scope.row.shipQuantity"
            />
          </template>
          <template #edit-reserveQuantity="scope">
            <el-input-number
              maxLength="11"
              :precision="0"
              :controls="false"
              :max="scope.row.orderQuantity"
              :disabled="drawer.title?.includes('详情') || drawer.title?.includes('审核')"
              v-model="scope.row.reserveQuantity"
            />
          </template>
          <template #edit-caseNum="scope">
            <el-input-number
              maxLength="11"
              :precision="0"
              :controls="false"
              :disabled="drawer.title?.includes('详情') || drawer.title?.includes('审核')"
              v-model="scope.row.caseNum"
            />
          </template>
          <template #edit-remark="scope">
            <el-input
              type="text"
              maxLength="254"
              :disabled="drawer.title?.includes('详情') || drawer.title?.includes('审核')"
              v-model="scope.row.remark"
            />
          </template>
        </XTable>
      </div>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="drawerCancel">取消</el-button>
            <el-button
              v-if="!(drawer.title?.includes('详情') || drawer.title?.includes('审核'))"
              :loading="buttonLoading"
              type="primary"
              @click="submitAddForm"
              >确 定</el-button
            >
          </span>
        </div>
      </template>
    </el-drawer>

    <el-drawer v-model="ppppdrawer.visible" size="80%"> </el-drawer>
    <DeliveryPrint ref="deliverCardRef" />
  </div>
</template>

<script setup name="DeliveryRecord" lang="ts">
import { listDeliveryRecord, listSignDeliveryRecord,getPrintDeliveryRecord, getDeliveryRecord, delDeliveryRecord,getRefreshDeliveryInfoList,
  addDeliveryRecord, signDeliveryRecord, unSignDeliveryRecord ,getDeliveryRecordByCode} from '@/api/order/deliveryRecord';
import { DeliveryRecordVO, DeliveryRecordQuery, DeliveryRecordForm, DeliveryRecordTypeEnum } from '@/api/order/deliveryRecord/types';
import { VxeTableEvents, VxeTablePropTypes } from 'vxe-table';
import dayjs from "dayjs";
import { deepClone } from '@/utils'

const deliverCardRef = ref();

const deliverInfo = ref<any>();
const cardRef = ref();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { delivery_record_type } = toRefs<any>(proxy?.useDict('delivery_record_type'));

const deliveryRecordList = ref<DeliveryRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const ids = ref<Array<string | number>>([]);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const deliveryRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DeliveryRecordForm = {
  id: undefined,
  createDeptName: undefined,
  createByName: undefined,
  updateByName: undefined,
  //订单发货类型
  type: '0',
  quantity: undefined,
  code: undefined,
  customerCode: undefined,
  customerName: undefined,
  cusAddress: undefined,
  tableOrderList: [],
  deliveryRecordBoList: [],
}
const data = reactive<PageData<DeliveryRecordForm, DeliveryRecordQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    //订单发货类型
    type: '0',
    quantity: undefined,
    bizid: undefined,
    code: undefined,
    isCallback: undefined,
    params: {
    }
  },
  rules: {
    deliveryTime: [
      { required: true, message: "送货时间不能为空", trigger: "change" }
    ],
  }
});

const signData = reactive<PageData<DeliveryRecordForm, DeliveryRecordQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: '0',
    isCallback: undefined,
    params: {
    }
  },
  rules: {
  }
});
const waitSignData = reactive<PageData<DeliveryRecordForm, DeliveryRecordQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: '0',
    isCallback: undefined,
    params: {
    }
  },
  rules: {
  }
});
//=列表校验
const validRules = ref<VxeTablePropTypes.EditRules<DeliveryRecordVO>>({
  shipQuantity: [
    { required: true, message: "发货数量不能为空", trigger: "blur" }
  ],
  // reserveQuantity: [
  //   { required: true, message: "备品数量不能为空", trigger: "blur" }
  // ]
})
const { queryParams, form: tabForm, rules } = toRefs(data);
const { queryParams:waitSignQueryParams } = toRefs(waitSignData);
const { queryParams:signQueryParams } = toRefs(signData);

const radioTable = ref('待发货列表');
const intervalCondition = ['accountMonth', 'endTime', 'deliveryTime'];
const orderFilinOutList = ref<DeliveryRecordVO[]>([]);
const orderFilinOutWaitList = ref<DeliveryRecordVO[]>([]);
const orderFilinOutAduitList = ref<DeliveryRecordVO[]>([]);
const tabOrderList = ref<DeliveryRecordVO[]>([]);
const checkedOrderList = ref<DeliveryRecordVO[]>([]);
const waitTotal = ref(0);
const aduitTotal = ref(0);
const drawer = reactive<DialogOption>({ visible: false, title: '' });
const ppppdrawer = reactive<DialogOption>({ visible: false, title: '' });
const XTableRef = ref<ElFormInstance>();
const checkCustomer = ref("");
const orderFormRef = ref<ElFormInstance>();
const tabTable = ref<ElFormInstance>();
const dialogTableLoading = ref(false)

const columnList = ref([
  { type: 'checkbox', align: 'center', field: "checkbox", width: '50', fixed: 'left', },
  { title: '序号', width: '50', type: 'seq', visible: true, align: 'center', fixed: 'left' },
  { title: '外协单号', field: 'orderCode', width: '160', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '供应商名称', field: 'supplierName', width: '160', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '客户名称', field: 'deptName', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '要求交期', width: '110', field: 'deliveryTime', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '', startParams: { type: 'day' }, endParams: { type: 'day' }, valueFormat: 'YYYY-MM-DD 00:00:00'  }   },
  { title: '产品编码', width: '110', field: 'materialQuality', align: 'center', filterType: 'input', filterParam: { placeholder: '' }  },
  { title: '产品名称', width: '120', field: 'commodityName', align: 'center' },
  { title: '单位', width: '80', field: 'unit', align: 'center', },
  { title: '订货数量', width: '80', field: 'inventoryQuantity', align: 'center', },
  { title: '已发数量', width: '80', field: 'deliveryQuantity', align: 'center' },
  { title: '待发数量', width: '80', field: 'waitDeliveryQuantity', align: 'center' },
  { title: '送货地址',  field: 'cusAddress', align: 'center', filterType: 'input', filterParam: { placeholder: '' }   },
]);
const columnList2 = ref([
  { title: '序号', width: '50', type: 'seq', visible: true, align: 'center', fixed: 'left' },
  { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false },
  { title: '送货单号', field: 'code', width: '80', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '开单人', field: 'createByName', width: '60', align: 'center', },
  { title: '客户编码', field: 'customerCode', width: '60', align: 'center',filterType: 'input', filterParam: { placeholder: '' } },
  { title: '销售单号', field: 'saleOrderNo', width: '100', align: 'center',filterType: 'input', filterParam: { placeholder: '' } },
  { title: '产品编码', field: 'commodityCode', width: '120', align: 'center',filterType: 'input', filterParam: { placeholder: '' } },
  { title: '产品名称', field: 'commodityName', width: '180', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '板材', width: '80', field: 'materialQuality', align: 'center' ,filterType: 'input'},
  { title: '单位', width: '80', field: 'unit', align: 'center' },
  { title: '订货数量', width: '100', field: 'orderQuantity', align: 'center', },
  { title: '送货数量', width: '100', field: 'deliveryQuantity', align: 'center' },
  { title: '备品数量', width: '100', field: 'reserveQuantity', align: 'center' },
  // { title: '退货数量', width: '100', field: 'returnQuantity', align: 'center', },
  { title: '待发数量', width: '100', field: 'waitDeliveryQuantity', align: 'center' },
  { title: '库存数量', width: '100', field: 'inventoryQuantity', align: 'center', },
  { title: '要求交期', width: '100', field: 'deliveryTime', align: 'center',filterType: 'intervalDate', filterParam: { placeholder: '', startParams: { type: 'day' }, endParams: { type: 'day' }, valueFormat: 'YYYY-MM-DD 00:00:00'  }   },
  { title: '送货地址',  width: '240', field: 'cusAddress', align: 'center', filterType: 'input', filterParam: { placeholder: '' }  },
  { title: '开单时间', width: '130', field: 'createTime', align: 'center' },
  { title: '备注', width: '180', field: 'remark', align: 'center' },
]);

const orderColumnList = ref([
  { title: '序号', width: '50', type: 'seq', visible: true, align: 'center', fixed: 'left' },
  { title: '操作', field: 'make', align: 'center', width: '80', fixed: 'right', showOverflow: false },
  { title: '销售单号', field: 'saleOrderNo', width: '100', align: 'center' },
  { title: '产品编码', field: 'commodityCode', width: '120', align: 'center' },
  { title: '产品名称', field: 'commodityName', width: '100', align: 'center' },
  { title: '板材', width: '80', field: 'materialQuality', align: 'center' },
  { title: '单位', width: '80', field: 'unit', align: 'center' },
  { title: '订单数量', width: '80', field: 'orderQuantity', align: 'center', },
  { title: '已发数量', width: '80', field: 'deliveryQuantity', align: 'center' },
  // { title: '退货数量', width: '80', field: 'returnQuantity', align: 'center', },
  { title: '库存数量', width: '80', field: 'inventoryQuantity', align: 'center', },
  { title: '尾数库存', width: '80', field: 'mantissaQuantity', align: 'center', },
  { title: '发货数量', width: '140', field: 'shipQuantity', align: 'center', editRender: {} },
  { title: '备品数量', width: '140', field: 'reserveQuantity', align: 'center', editRender: {} },
  { title: '差欠数量', width: '80', field: 'waitDeliveryQuantity', align: 'center', },
  { title: '箱数', width: '140', field: 'caseNum', align: 'center', editRender: {} },
  { title: '要求交期', width: '140', field: 'deliveryTime', align: 'center' },
  { title: '备注', width: '180', field: 'remark', align: 'center', editRender: {} },
]);
/** 是否禁选 */
const selectableFun = (scope: any) => {
  //当前选择客户与已选择客户不一致时，禁选
  if (checkCustomer.value && scope.row.customerCode != checkCustomer.value) {
    return false;
  }
  return true;
}

/**
 * 单选时间
 */
const selectChangeEvent: VxeTableEvents.CheckboxAll<DeliveryRecordVO> = async () => {
  const tableRef = XTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxRecords();
    const reserveSelect = tableRef.getCheckboxReserveRecords();
    checkedOrderList.value = selectRecords.map((item: any) => item);
    // console.log(selectRecords, reserveSelect)
    if (reserveSelect?.length) {
      checkedOrderList.value = checkedOrderList.value.concat(reserveSelect)
    }
  }

  //假设勾选的值不同
  let isDiff = true;
  //如果勾选的值不为空
  if (checkedOrderList.value && checkedOrderList.value.length > 0) {
    //如果勾选的值和当前客户一样
    const custCode = checkedOrderList.value[0].customerCode;
    if (checkCustomer.value == custCode) {
      isDiff = false
    }
    checkCustomer.value = checkedOrderList.value[0].customerCode;
    // queryParams.value.customerCode = checkCustomer.value;
    let searchTempList = [{field: 'customerCode', defaultValue: checkCustomer.value}]
    let tempAddress = checkedOrderList.value[0].cusAddress && checkedOrderList.value[0].cusAddress.trim()
    if (tempAddress) {
      searchTempList.push({field: 'cusAddress', defaultValue: checkedOrderList.value[0].cusAddress})
    }
    if (!queryParams.value?.customerCode) {
      queryParams.value.pageNum = 1
    }
    XTableRef.value.filterFieldEvent(searchTempList)
  } else {
    if (checkCustomer.value == "") {
      isDiff = false
    }
    checkCustomer.value = "";
    // queryParams.value.customerCode = undefined;
    queryParams.value.pageNum = 1
    XTableRef.value.delFilterField(['customerCode','cusAddress'])
    checkedOrderList.value=[];
  }
  //切换客户时，刷新列表
  if (isDiff) {
    //tableRef.setFilter("customerCode", [queryParams.value.customerCode]);
    // tableRef.updateData();
    // console.log("tableRef.setFilter",tableRef.getCheckedFilters());
    //await getList();
    //tableRef.setCheckboxRow(checkedOrderList.value, true);
  }
}
const drawerCancel = () => {
  console.log("drawerCancel")
  // checkedOrderList.value = [];
  drawer.visible = false;
}

const headleDetail = async (row?: DeliveryRecordVO) => {
  reset();
  let checkCust = row;
  console.log("checkCust ", checkCust);
  Object.assign(tabForm.value, row);
  drawer.visible = true;
  drawer.title = "送货单详情";
  dialogTableLoading.value = true
  let mainDeliverInfo=await getDeliveryRecordByCode(row.code);
  console.log("mainDeliver ", mainDeliverInfo);
  let mainDeliver = mainDeliverInfo.data
  mainDeliver.detailList.forEach((item: any) => {
    const qry = item.quantity;
    item.quantity = item.orderQuantity;
    item.remainQuantity = item.waitDeliveryQuantity;
    item.shipQuantity = qry;
  });

  tabForm.value = mainDeliver;
  tabOrderList.value = mainDeliver.detailList;
  dialogTableLoading.value = false
}

const handleAdd = async() => {
  if (!checkedOrderList.value || checkedOrderList.value.length == 0) {
    proxy?.$modal.msgSuccess("请选择单据");
    return;
  }
  checkedOrderList.value;
  reset();
  //如果列表中客户id和地址不一样则报错
  let chcc=true;
  checkedOrderList.value.forEach((item: any) => {
    if (item.customerCode != checkedOrderList.value[0].customerCode||item.cusAddress != checkedOrderList.value[0].cusAddress) {
      chcc=false;
      return;
    }
  });
  if(!chcc){
    proxy?.$modal.msgError("请选择同一客户、地址的单据");
    return;
  }
  tabOrderList.value = []
  tabOrderList.value = deepClone(checkedOrderList.value);
  let checkCust = tabOrderList.value[0];
  //checkedOrderList.value
  console.log("checkCust ", checkCust);
  tabForm.value.customerCode = checkCust.customerCode;
  tabForm.value.customerName = checkCust.customerName;
  tabForm.value.cusAddress = checkCust.cusAddress;
  tabForm.value.deliveryTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  let refreshList:any=[];
  refreshList = await getRefreshDeliveryInfoList({saleIds: checkedOrderList.value.map((item: any) => item.saleId)});
  tabOrderList.value.forEach((item: any) => {
    item.type = DeliveryRecordTypeEnum.ORDER;
    item.remark = "";
    item.id=undefined;
    if(refreshList&&refreshList.length>0){
      refreshList.forEach((refreshObj:any)=>{
        if(item.saleId==refreshObj.id){
          item.deliveryQuantity=refreshObj.deliveryQuantity;
          item.waitDeliveryQuantity=refreshObj.waitDeliveryQuantity;
          item.inventoryQuantity=refreshObj.inventoryQuantity;
        }
      });
    }
  });
  console.log("tabOrderList",tabOrderList.value);
  drawer.visible = true;
  drawer.title = "生成送货单";
}

/** 删除按钮操作 */
const handleTabDelete = async (row?: DeliveryRecordVO) => {
  const _ids = row?.saleId || ids.value;
  await proxy?.$modal.confirm('是否确认删除销售单号为"' + row.saleOrderNo + '"的数据项？').finally(() => loading.value = false);
  tabOrderList.value = tabOrderList.value.filter((item: any) => item.saleId != _ids);
  proxy?.$modal.msgSuccess("删除成功");
}

// 切换菜单栏 ***********
const radioTableHandle = async (tab: any, event: any) => {
  console.log("tab.", tab.props.label);
  radioTable.value = tab.props.label;
  queryParams.value.customerCode = undefined;
  // queryParams.value.pageNum=1;
  // queryParams.value.pageSize=20;
  // console.log("queryParams.value",queryParams.value);
  

  if (radioTable.value == "待发货列表") {
    queryParams.value.isCallback = undefined;
    await getList();
  } else if (radioTable.value == "已回签列表") {
    queryParams.value.isCallback = "1";
    await getSignList();
  } else if (radioTable.value == "待回签列表") {
    queryParams.value.isCallback = "0";
    await getWaitList();
  }

}
const searchChange = async(params: any) => {
  // const tempOldParams = deepClone(params)
  // const tempOldQuery = deepClone(queryParams.value)
  // console.log("searchChange", params, tempOldQuery);
  // if ((!tempOldParams?.customerCode && tempOldQuery?.customerCode) && (!tempOldParams?.cusAddress && tempOldQuery?.cusAddress)) {
  //   XTableRef.value.xTableRef.clearCheckboxRow()
  //   XTableRef.value.xTableRef.clearCheckboxReserve()
  //   // return
  // }
  queryParams.value = {...params, type: '0'}
  if (!queryParams.value?.customerCode && !queryParams.value?.cusAddress) {
    if (XTableRef.value) {
      checkCustomer.value = undefined
      checkedOrderList.value = []
      XTableRef.value.xTableRef.clearCheckboxRow()
      XTableRef.value.xTableRef.clearCheckboxReserve()
    }
  }

  if (radioTable.value == "待发货列表") {
    await getList();
  } else if (radioTable.value == "已回签列表") {
    await getSignList();
  } else if (radioTable.value == "待回签列表") {
    await getWaitList();
  }

}

const unSignSearchChange = async(params: any) => {
    waitSignQueryParams.value = {...params, type: '0'}
    await getWaitList();
}

const signSearchChange = async(params: any) => {
    signQueryParams.value = {...params, type: '0'}
    await getSignList();
}
/** 查询发货记录列表 */
const getWaitList = async () => {
  loading.value = true;
  waitSignQueryParams.value.isCallback = "0";
  const res = await listSignDeliveryRecord(waitSignQueryParams.value);
  orderFilinOutWaitList.value = res.rows;
  waitTotal.value = res.total;
  loading.value = false;
}
/** 查询发货记录列表 */
const getSignList = async () => {
  loading.value = true;
  signQueryParams.value.isCallback = "1";
  const res = await listSignDeliveryRecord(signQueryParams.value);
  orderFilinOutAduitList.value = res.rows;
  aduitTotal.value = res.total;
  loading.value = false;
}
/** 查询发货记录列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.isCallback = undefined;
  const res = await listDeliveryRecord(queryParams.value);
  deliveryRecordList.value = res.rows;
  total.value = res.total;
  if (XTableRef.value) {
    // await XTableRef.value.xTableRef.reloadData(deliveryRecordList.value)
    await XTableRef.value.xTableRef.updateData()
  }
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  tabForm.value = { ...initFormData };
  deliveryRecordFormRef.value?.resetFields();

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

/** 修改按钮操作 */
const handleUpdate = async (row?: DeliveryRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getDeliveryRecord(_id);
  Object.assign(tabForm.value, res.data);
  dialog.visible = true;
  dialog.title = "修改发货记录";
}

const validateShipOver = (tabData:any) => {
  let flag = true;
  tabData.forEach((item: any) => {
    if (item.shipQuantity > item.waitDeliveryQuantity) {
      flag = false;
      return;
    }
  });
  return flag;
}
/** 提交按钮 */
const submitAddForm = async () => {

  const $table = tabTable.value.xTableRef;
  orderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if ($table) {
        let errMap = await $table.validate(true);
        if (errMap) {
          console.log("errMap", errMap);
          return;
        }
      }
      if (!validateShipOver(tabOrderList.value)) {
        await proxy?.$modal.confirm("发货数量大于订单数量，是否仍然发货？")
      }
      buttonLoading.value = true;
      tabForm.value.deliveryRecordBoList = tabOrderList.value;
      console.log("tabForm.value", tabForm.value);
      let res = await addDeliveryRecord(tabForm.value).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("操作成功");
      const $table1 = XTableRef.value.xTableRef;
      if ($table1) {
        $table1.clearCheckboxRow()
        $table1.clearCheckboxReserve()
      }

      await proxy?.$modal.confirm("是否立即打印送货单？").finally(() => {
        drawer.visible = false;
        checkedOrderList.value = [];
        checkCustomer.value = "";
        queryParams.value.customerCode = undefined;
        //getList();
        XTableRef.value.delFilterField(['customerCode','cusAddress'])
      });
      deliverCardRef.value.doPrint(res.data.deliveryRecordList[0].id);

      drawer.visible = false;

      checkedOrderList.value = [];
      checkCustomer.value = "";
      queryParams.value.customerCode = undefined;
      //await getList();
      //成功清空
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DeliveryRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除发货记录编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  await delDeliveryRecord(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getSignList();
  await getWaitList();
}

const handleSign = async (row?: DeliveryRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认回签编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  await signDeliveryRecord(_ids);
  proxy?.$modal.msgSuccess("回签成功");
  await getSignList();
  await getWaitList();
}
const handleUnSign = async (row?: DeliveryRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认取消回签编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  await unSignDeliveryRecord(_ids);
  proxy?.$modal.msgSuccess("取消回签成功");
  await getSignList();
  await getWaitList();
}

const doPrint = async (_ids?: any) => {

  proxy?.$modal.loading("加载中");
  deliverCardRef.value.doPrint(_ids).finally(() => proxy?.$modal.closeLoading());
}

const getContent = (detail: any, deliverTemplate: any) => {
  let content = deliverTemplate.content;
  let reg = /\$\{[^\}]+\}/g;
  let arr = content.match(reg);
  if (arr) {
    arr.forEach((item: any) => {
      let key = item.substring(2, item.length - 1);
      let value = detail[key];
      content = content.replace(item, value);
    });
  }
  return content;
}

const printHtmlV2 = (Id: any) => {
  let printNode = cardRef.value;
  console.log(printNode);
  const newDoc = document.implementation.createHTMLDocument('Print Document');
  const pageStyle = newDoc.createElement("style");
  pageStyle.innerHTML = "@page { margin: 0.5cm; }"; // 0.5厘米边距
  newDoc.head.appendChild(pageStyle);
  newDoc.body.style.margin = "0px";
  let newContent = printNode.cloneNode(true);
  newContent.style.display = 'block';
  newDoc.body.appendChild(newContent);
  newDoc.documentElement.innerHTML;
  // 创建一个新的 Blob 对象
  const blob = new Blob([newDoc.documentElement.innerHTML], { type: 'text/html' });
  // 创建一个 Blob URL
  const blobUrl = URL.createObjectURL(blob);
  // 创建一个 iframe 用于打印
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = blobUrl;
  // 将 iframe 添加到页面并触发打印
  document.body.appendChild(iframe);
  iframe?.contentWindow.print();
  // 清理 Blob URL 和 iframe
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
    document.body.removeChild(iframe);
  }, 3000); // 等待 1 秒后清理
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('order/deliveryRecord/export', {
    ...queryParams.value
  }, `deliveryRecord_${new Date().getTime()}.xlsx`)
}
const mergeCells = ({ row, items, seq, rowIndex, $rowIndex, _rowIndex, column, visibleData, data }: any) => {
  if (column.property === "code") {
    const referenceField = "code";
    if (rowIndex > 0) {
      if (row[referenceField] === items[rowIndex - 1][referenceField]) {
        row.seq = items[rowIndex - 1].seq;
      } else {
        row.seq = items[rowIndex - 1].seq + 1;
      }
    } else if (rowIndex === 0) {
      row.seq = seq;
    }
    let prevRow = data[$rowIndex - 1];
    let nextRow = data[$rowIndex + 1];
    if (prevRow && prevRow[referenceField] === row[referenceField]) {
      return { rowspan: 0, colspan: 0 };
    } else {
      let countRowspan = 1;
      while (nextRow && nextRow[referenceField] === row[referenceField]) {
        nextRow = data[++countRowspan + $rowIndex];
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 };
      }
    }
  }
}
onMounted(async () => {
  await getList();
});
</script>
