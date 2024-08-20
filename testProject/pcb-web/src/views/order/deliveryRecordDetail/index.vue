<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs class="xtable-tab" type="border-card" @tab-click="tabChange" v-model="tabValue">
        <el-tab-pane label="销售订单" name="销售订单">
          <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
                      :leave-active-class="proxy?.animate.searchAnimate.leave">
            <div class="search" >
              <el-form :model="queryParams" ref="queryFormRef" size="small" label-width="80px"
                       class="demo-form-inline">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="送货时间" prop="cusId">
                      <el-date-picker style="width: calc((100% - 15px)/2)" size="small"
                                      v-model="queryParams.deliveryTimeStart"
                                      type="datetime"
                                      placeholder="选择开始时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>
                      <span style="width: 10px;margin-left: 5px">-</span>
                      <el-date-picker style="width: calc((100% - 15px)/2)" size="small"
                                      v-model="queryParams.deliveryTimeEnd"
                                      type="datetime"
                                      placeholder="选择结束时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="送货单号">
                      <el-input v-model="queryParams.code" clearable @keyup.enter="handleQuery"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="物流单号">
                      <el-input v-model="queryParams.logisticsNo" clearable @keyup.enter="handleQuery"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="产品名称" prop="commodityName">
                      <el-input v-model="queryParams.commodityName" clearable @keyup.enter="handleQuery"/>
                    </el-form-item>
                  </el-col>
                  <div class="pl-10">
                    <el-button type="primary" @click="handleQuery">搜索</el-button>
                    <el-button @click="resetQuery">重置</el-button>
                  </div>
                  <el-col :span="6">
                    <el-form-item label="产品编码" prop="commodityCode">
                      <el-input v-model="queryParams.commodityCode" clearable @keyup.enter="handleQuery"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="客户编码" prop="customerCode">
                      <!-- <el-input v-model="queryParams.customerCode" clearable @keyup.enter="handleQuery"/> -->

                      <el-select v-model="queryParams.customerCodeIdList" multiple collapse-tags  @keyup.enter="handleQuery"
                         style="width: 100%" filterable>
                        <el-option v-for="item in customerCodeList" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>

                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="销售单号" prop="saleOrderNo">
                      <el-input v-model="queryParams.saleOrderNo" clearable @keyup.enter="handleQuery"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="客户PO" prop="customerPo">
                      <el-input v-model="queryParams.customerPo" clearable @keyup.enter="handleQuery"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" style="text-align: right">
                    <el-button @click="exportExcelBefore">导出</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </transition>
          <el-row :gutter="10" class="mb8" style="width:100%;margin:0;display:flex;justify-content: end;">
            <el-col :span="20">
              <p class="totalTitle">面积汇总：{{totalArea}} （m²）&nbsp;&nbsp;|&nbsp;&nbsp; 数量汇总：{{totalQuantity}}</p>
            </el-col>
          </el-row>
          <XTable :toolId="mainTableToolId" v-model:page-size="queryParams.pageSize" :loading="loading"
            v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content" :showRefresh="true"
            :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: total }" :show-footer="true" :footer-method="footerMethod"
            :data="deliveryRecordList" :columnList="columnList" ref="XTableRef" border @searchChange="searchChange"
            :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
            <template #default-accountDate="scope">
              <span>{{ parseTime(scope.row.accountDate, '{y}-{m}-{d}') }}</span>
            </template>
            <!-- <template #default-deliveryTime="scope">
              <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
            </template> -->
            <template #default-code="scope">
              <el-link type="primary" @click="doDeliverPrint(scope.row.id)">{{ scope.row.code }} </el-link>
            </template>
            <template #default-isCallback="scope">
              <el-tag :type="scope.row.isCallback == '1' ? 'success' : 'info'">{{ '0' === scope.row.isCallback ? '未回签' : "已回签" }}</el-tag>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="退货订单" name="退货订单">
          <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
                      :leave-active-class="proxy?.animate.searchAnimate.leave">
            <div class="search" >
              <el-form :model="orderBackQueryParams" ref="orderBackQueryFormRef" size="small" label-width="80px"
                       class="demo-form-inline">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="送货时间" prop="cusId">
                      <el-date-picker style="width: calc((100% - 15px)/2)" size="small"
                                      v-model="orderBackQueryParams.deliveryTimeStart"
                                      type="datetime"
                                      placeholder="选择开始时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>
                      <span style="width: 10px;margin-left: 5px">-</span>
                      <el-date-picker style="width: calc((100% - 15px)/2)" size="small"
                                      v-model="orderBackQueryParams.deliveryTimeEnd"
                                      type="datetime"
                                      placeholder="选择结束时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="送货单号">
                      <el-input v-model="orderBackQueryParams.code" clearable @keyup.enter="handleQuery"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="物流单号">
                      <el-input v-model="orderBackQueryParams.logisticsNo" clearable @keyup.enter="handleQuery"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="产品名称" prop="commodityName">
                      <el-input v-model="orderBackQueryParams.commodityName" clearable @keyup.enter="handleQuery"/>
                    </el-form-item>
                  </el-col>
                  <div class="pl-10">
                    <el-button type="primary" @click="orderBackHandleQuery">搜索</el-button>
                    <el-button @click="orderBackResetQuery">重置</el-button>
                  </div>
                  <el-col :span="6">
                    <el-form-item label="产品编码" prop="commodityCode">
                      <el-input v-model="orderBackQueryParams.commodityCode" clearable @keyup.enter="handleQuery"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="客户编码" prop="customerCode">
                      <!-- <el-input v-model="orderBackQueryParams.customerCode" clearable @keyup.enter="handleQuery"/> -->

                      <el-select v-model="orderBackQueryParams.customerCodeIdList" multiple collapse-tags  @keyup.enter="handleQuery"
                         style="width: 100%" filterable>
                        <el-option v-for="item in customerCodeList" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>

                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="销售单号" prop="saleOrderNo">
                      <el-input v-model="orderBackQueryParams.saleOrderNo" clearable @keyup.enter="handleQuery"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="客户PO" prop="customerPo">
                      <el-input v-model="orderBackQueryParams.customerPo" clearable @keyup.enter="handleQuery"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" style="text-align: right">
                    <el-button @click="orderBackExportExcel">导出</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </transition>
          <el-row :gutter="10" class="mb8" style="width:100%;margin:0;display:flex;justify-content: end;">
            <el-col :span="20">
              <p class="totalTitle">面积汇总：{{totalBackArea}} （m²）</p>
            </el-col>
          </el-row>
          <XTable :toolId="mainTableOrderBackToolId" v-model:page-size="orderBackQueryParams.pageSize" :loading="orderBackLoading"
                  v-model:current-page="orderBackQueryParams.pageNum" height="100%" class="xtable-content" :show-footer="true" :footer-method="footerMethodRetrun"
                  :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: orderBacktotal }"
                  :data="deliveryRecordOrderBackList" :columnList="columnOrderBackList" ref="XTableRef" border @searchChange="orderBackSearchChange"
                  :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
            <template #default-accountDate="scope">
              <span>{{ parseTime(scope.row.accountDate, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-code="scope">
              <el-link type="primary" @click="doDeliverPrint(scope.row.id)">{{ scope.row.code }} </el-link>
            </template>
            <template #default-isCallback="scope">
              <el-tag :type="scope.row.isCallback == '1' ? 'success' : 'info'">{{ '0' === scope.row.isCallback ? '未回签' : "已回签" }}</el-tag>
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
          <el-button type="primary" @click="exportExcel" v-if="tabValue === '销售订单'">
            确认
          </el-button>
          <el-button type="primary" @click="orderBackExportExcelBefore" v-else>
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    
    <DeliveryPrint ref="deliverCardRef" />
  </div>
</template>

<script setup name="DeliveryRecordDetail" lang="ts">
import { postListSignDeliveryRecord, postQueryOrderBackSignPageList,getSignDeliveryRecordSum,queryBackSignListSum } from "@/api/order/deliveryRecord";
import { DeliveryRecordForm, DeliveryRecordQuery, DeliveryRecordVO } from "@/api/order/deliveryRecord/types";
import { VxeTableEvents } from "vxe-table";
import { ref } from "vue";
import { parseTime } from "@/utils/ruoyi";
import { getListCustomer} from "@/api/basedata/customer";

const deliverCardRef = ref();
const totalArea = ref(0);
const totalQuantity = ref(0);

const totalBackArea = ref(0);
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const deliveryRecordList = ref<DeliveryRecordVO[]>([]);
const deliveryRecordOrderBackList = ref<DeliveryRecordVO[]>([]);
const loading = ref(true);
const orderBackLoading = ref(true);
const ids = ref<Array<string | number>>([]);
const total = ref(0);
const orderBacktotal = ref(0);

const queryFormRef = ref<ElFormInstance>();
const orderBackQueryFormRef = ref<ElFormInstance>();
const deliveryRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});


const beforeAMonthDate = (date: Date) => {
  let startDate = new Date();
  startDate.setMonth(date.getMonth() - 1)
  return startDate;
}

const initFormData: DeliveryRecordForm = {
  id: undefined,
  deliveryTimeStart: parseTime(beforeAMonthDate(new Date())),
  deliveryTimeEnd: parseTime(new Date()),
  createDeptName: undefined,
  createByName: undefined,
  updateByName: undefined,
  type: undefined,
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
    deliveryTimeStart: parseTime(beforeAMonthDate(new Date())),
    deliveryTimeEnd: parseTime(new Date()),
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    type: undefined,
    quantity: undefined,
    bizid: undefined,
    code: undefined,
    logisticsNo: undefined,
    commodityName: undefined,
    commodityCode: undefined,
    customerCode: undefined,
    saleOrderNo: undefined,
    customerPo: undefined,
    pageNum: 1,
    pageSize: 20,
    type: '0',
    params: {
    }
  },
  orderBackQueryParams: {
    deliveryTimeStart: parseTime(beforeAMonthDate(new Date())),
    deliveryTimeEnd: parseTime(new Date()),
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    type: undefined,
    quantity: undefined,
    bizid: undefined,
    code: undefined,
    logisticsNo: undefined,
    commodityName: undefined,
    commodityCode: undefined,
    customerCode: undefined,
    saleOrderNo: undefined,
    customerPo: undefined,
    pageNum: 1,
    pageSize: 20,
    type: '1',
    params: {
    }
  },
});
const { queryParams, orderBackQueryParams, form: tabForm, rules } = toRefs(data);

const radioTable = ref('待发货列表');
const intervalCondition = ['accountMonth', 'endTime','placeOrderTime','deliveryTime','createTime'];
const checkedOrderList = ref<DeliveryRecordVO[]>([]);
const drawer = reactive<DialogOption>({ visible: false, title: '' });
const XTableRef = ref<ElFormInstance>();
const checkCustomer = ref("");

//状态: 是否完结 1完结 2未完结
const callBackData = ref([
  { label: '已回签', value: "1" },
  { label: '未回签', value: "0" },
])
const resDictData = reactive({
  //批量/样品
  order_model: [{
    value: '1',
    label: '批量',
  },{
    value: '2',
    label: '样品',
  }],
  //订单类型
  order_type: [{
    value: '1',
    label: '新单',
  },{
    value: '2',
    label: '返单',
  },{
    value: '3',
    label: '返单有改',
  },{
    value: '4',
    label: '样转批',
  }],
})

const customerCodeList = ref();
/** 表格列 */
const columnList = ref([
  { title: '序号', width: '45', field: 'index', type: 'seq', visible: true, align: 'center', fixed: 'left' },
  { title: '回签', width: '60', field: 'isCallback', visible: true, align: 'center' ,
    filterType: 'radio',  filterData: () => callBackData.value},
  { title: '客户编码', field: 'customerCode', width: '60', align: 'center', },
  { title: '单据日期', field: 'deliveryTime', width: '120', align: 'center' },
  { title: '客户PO', field: 'customerPo', width: '80', align: 'center', },
  { title: '产品编码', field: 'commodityCode', width: '120', align: 'center' },
  { title: '客户物料编码', field: 'customerMaterialCode', width: '120', align: 'center' , filterType: 'input'},
  { title: '产品名称', field: 'commodityName', width: '100', align: 'center' },
  { title: '下单数量', width: '60', field: 'orderQuantity', align: 'center', },
  { title: '送货数量（pcs）', width: '60', field: 'quantity', align: 'center', },
  { title: '备品数量（pcs）', width: '40', field: 'reserveQuantity', align: 'center', },
  { title: '面积（m²）', width: '60', field: 'area', align: 'center' },
  { title: '物流单号', width: '120', field: 'logisticsNo', align: 'center' },
  { title: '物流公司', width: '60', field: 'logisticsCompany', align: 'center', filterType: 'input', },
  { title: '送货地址', width: '180', field: 'cusAddress', align: 'center', filterType: 'input' },
  { title: '箱数', width: '45', field: 'caseNum', align: 'center' },
  { title: '备注', field: 'remark', width: '100', align: 'center' },
  //{ title: '对账日期', field: 'accountDate', width: '100', align: 'center' },
  { title: '送货单号', field: 'code', width: '100', align: 'center' },
  { title: '销售单号', field: 'saleOrderNo', width: '100', align: 'center' },
  { title: '下单日期', field: 'placeOrderTime', width: '100', align: 'center',filterType: 'intervalDate', filterParam: { placeholder: '', startParams: { type: 'day' }, endParams: { type: 'day' }, valueFormat: 'YYYY-MM-DD 00:00:00'  }  },
  { title: '客户交期', field: 'cusDeliveryTime', width: '100', align: 'center'},
  { title: '新/返', field: 'orderType', width: '60', align: 'center' , filterType: "radioButton",  filterData: () => resDictData.order_type, filterCustom: { label: "label", value: "value" }},
  // { title: '批/样', field: 'model', width: '100', align: 'center' },
  { title: '加急', field: 'urgent', width: '60', align: 'center' , filterType: 'input'},
  // { title: '版本号', field: 'version', width: '100', align: 'center' },
  // { title: '币种', field: 'currency', width: '100', align: 'center' },
  // { title: '汇率', field: 'cusExchangeRate', width: '100', align: 'center' },
  // { title: '业务员id', field: 'cusSaleUserId', width: '100', align: 'center' },
  // { title: '业务员', field: 'cusSaleUserName', width: '100', align: 'center' },
  { title: '操作人', field: 'createByName', width: '60', align: 'center' },
]);
const columnOrderBackList = ref([
  { title: '序号', width: '45', field: 'index', type: 'seq', visible: true, align: 'center', fixed: 'left' },
  { title: '回签', width: '60', field: 'isCallback', visible: true, align: 'center',
    filterType: 'radio',  filterData: () => callBackData.value },
  { title: '客户编码', field: 'customerCode', width: '60', align: 'center', },
  { title: '单据日期', field: 'deliveryTime', width: '120', align: 'center' },
  { title: '客户PO', field: 'customerPo', width: '80', align: 'center', },
  { title: '产品编码', field: 'commodityCode', width: '120', align: 'center' },
  { title: '客户物料编码', field: 'customerMaterialCode', width: '120', align: 'center' , filterType: 'input' },
  { title: '产品名称', field: 'commodityName', width: '100', align: 'center' },
  { title: '退货数量', width: '60', field: 'returnQuantity', align: 'center', },
  { title: '送货数量（pcs）', width: '60', field: 'quantity', align: 'center', },
  { title: '备品数量（pcs）', width: '40', field: 'reserveQuantity', align: 'center', },
  { title: '面积（m²）', width: '60', field: 'area', align: 'center' },
  { title: '物流单号', width: '120', field: 'logisticsNo', align: 'center' },
  { title: '物流公司', width: '60', field: 'logisticsCompany', align: 'center', filterType: 'input' },
  { title: '送货地址', width: '180', field: 'cusAddress', align: 'center' , filterType: 'input' },
  { title: '箱数', width: '45', field: 'caseNum', align: 'center' },
  { title: '备注', field: 'remark', width: '100', align: 'center' },
  //{ title: '对账日期', field: 'accountDate', width: '100', align: 'center' },
  { title: '送货单号', field: 'code', width: '100', align: 'center' },
  { title: '销售单号', field: 'saleOrderNo', width: '100', align: 'center' },
  { title: '退货单号', field: 'saleOrderBackNo', width: '100', align: 'center' },
  { title: '下单日期', field: 'placeOrderTime', width: '100', align: 'center',filterType: 'intervalDate', filterParam: { placeholder: '', startParams: { type: 'day' }, endParams: { type: 'day' }, valueFormat: 'YYYY-MM-DD 00:00:00'  }   },
  { title: '客户交期', field: 'cusDeliveryTime', width: '100', align: 'center' },
  { title: '新/返', field: 'orderType', width: '60', align: 'center', filterType: "radioButton",  filterData: () => resDictData.order_type, filterCustom: { label: "label", value: "value" }},
  // { title: '批/样', field: 'model', width: '100', align: 'center' },
  { title: '加急', field: 'urgent', width: '60', align: 'center' , filterType: 'input'},
  // { title: '版本号', field: 'version', width: '100', align: 'center' },
  // { title: '币种', field: 'currency', width: '100', align: 'center' },
  // { title: '汇率', field: 'cusExchangeRate', width: '100', align: 'center' },
  // { title: '业务员id', field: 'cusSaleUserId', width: '100', align: 'center' },
  // { title: '业务员', field: 'cusSaleUserName', width: '100', align: 'center' },
  { title: '操作人', field: 'createByName', width: '60', align: 'center' },
]);
const exportVisible = ref(false);
const mainTableToolId = ref('DeliveryRecordDetailList');
const mainTableOrderBackToolId = ref('DeliveryRecordDetailOrderBackList');
const tabValue = ref('销售订单');


const tabChange = (val) => {
  if (val.props.name === "销售订单") {
    getList();
  }else if (val.props.name === "退货订单") {
    getOrderBackList()
  }
}
/** 是否禁选 */
const selectableFun = (scope: any) => {
  if (checkCustomer.value && scope.row.customerCode != checkCustomer.value) {
    return false;
  }
  return true;
}
const selectChangeEvent: VxeTableEvents.CheckboxAll<DeliveryRecordVO> = () => {
  const tableRef = XTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxRecords();
    checkedOrderList.value = selectRecords.map((item: any) => item);
  }
  console.log("checkedOrderList.value", checkedOrderList.value);
  if (checkedOrderList.value && checkedOrderList.value.length > 0) {
    checkCustomer.value = checkedOrderList.value[0].customerCode;
  } else {
    checkCustomer.value = "";
  }
}

const queryParamsCopy = ref();
const searchChange = (params: any) => {
  console.log("searchChange params",params,queryParams.value)
  //删除原本不属于queryParams的属性
  for (const key in queryParams.value) {
    if (queryParamsCopy && queryParamsCopy.value && typeof queryParamsCopy.value === 'object' 
      && !queryParamsCopy.value.hasOwnProperty(key)) {
      delete queryParams.value[key];
    }
  }
  queryParamsCopy.value = queryParams.value;
  queryParams.value={...params,...queryParams.value}
  console.log("searchChange queryParams2",queryParams.value)
  queryParams.value.type = '0';
  getList();
}
const orderBackQueryParamsCopy = ref();
const orderBackSearchChange = (params: any) => {

  //删除原本不属于orderBackQueryParams的属性
  for (const key in orderBackQueryParams.value) {
    if (orderBackQueryParamsCopy && orderBackQueryParamsCopy.value && typeof orderBackQueryParamsCopy.value === 'object' 
      && !orderBackQueryParamsCopy.value.hasOwnProperty(key)) {
      delete orderBackQueryParams.value[key];
    }
  }
  orderBackQueryParamsCopy.value = orderBackQueryParams.value;
  orderBackQueryParams.value={...params,...orderBackQueryParams.value}
  orderBackQueryParams.value.type = '1';
  getOrderBackList();
}
/** 查询发货记录列表 */
const getList = async () => {

  loading.value = true;
  const res = await postListSignDeliveryRecord({...queryParams.value});
  deliveryRecordList.value = res.rows;
  total.value = res.total;
  loading.value = false;
  //获取汇总信息
  const sumRes = await getSignDeliveryRecordSum({...queryParams.value});
  totalArea.value =sumRes.data.area
  totalQuantity.value=sumRes.data.quantity?sumRes.data.quantity:0;
}

/** 查询退货单发货记录列表 */
const getOrderBackList = async () => {
  orderBackLoading.value = true;
  const res = await postQueryOrderBackSignPageList({...orderBackQueryParams.value});
  deliveryRecordOrderBackList.value = res.rows;
  orderBacktotal.value = res.total;
  orderBackLoading.value = false;

  //汇总
  const sumRes = await queryBackSignListSum({...orderBackQueryParams.value});
  totalBackArea.value =sumRes.data.area

}

/** 导出操作 */
const exportExcel = async () => {
  exportVisible.value = false;
  proxy?.download('order/deliveryRecord/exportSignList', {
    ...queryParams.value, tableName: mainTableToolId.value
  }, `送货明细_${parseTime(new Date())}.xlsx`);
}

/** 导出操作 */
const orderBackExportExcel = async () => {
  exportVisible.value = false;
  proxy?.download('order/deliveryRecord/exportOrderBackSignList', {
    ...orderBackQueryParams.value, tableName: mainTableOrderBackToolId.value
  }, `退货单送货明细_${parseTime(new Date())}.xlsx`);
}

/** 导出前操作 */
const exportExcelBefore = async () => {
  //先看看有没有给起始时间，没有要给出提示
  if (!queryParams.value.deliveryTimeStart) {
    exportVisible.value = true;
  } else {
    proxy?.download('order/deliveryRecord/exportSignList', {
      ...queryParams.value, tableName: mainTableToolId.value
    }, `送货明细_${parseTime(new Date())}.xlsx`);
  }
}

/** 导出前操作 */
const orderBackExportExcelBefore = async () => {
  //先看看有没有给起始时间，没有要给出提示
  if (!orderBackQueryParams.value.deliveryTimeStart) {
    exportVisible.value = true;
  } else {
    proxy?.download('order/deliveryRecord/exportOrderBackSignList', {
      ...orderBackQueryParams.value, tableName: mainTableOrderBackToolId.value
    }, `退货单送货明细_${parseTime(new Date())}.xlsx`);
  }
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

  const $table = XTableRef.value.xTableRef;
  $table.setAllCheckboxRow(false);
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}
/** 搜索按钮操作 */
const orderBackHandleQuery = () => {
  queryParams.value.pageNum = 1;
  getOrderBackList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  queryParams.value.customerCodeIdList = undefined;
  queryParams.value.logisticsNo= undefined;
  queryParams.value.code= undefined;
  queryParams.value.deliveryTimeStart= parseTime(beforeAMonthDate(new Date())),
  queryParams.value.deliveryTimeEnd=parseTime(new Date()),
  handleQuery();
}
/** 重置按钮操作 */
const orderBackResetQuery = () => {
  orderBackQueryFormRef.value?.resetFields();
  orderBackQueryParams.value.customerCodeIdList = undefined;
  orderBackQueryParams.value.logisticsNo= undefined;
  orderBackQueryParams.value.code= undefined;
  orderBackQueryParams.value.deliveryTimeStart= parseTime(beforeAMonthDate(new Date())),
  orderBackQueryParams.value.deliveryTimeEnd=parseTime(new Date()),
  getOrderBackList();
}


const doDeliverPrint = (ids:any) => {
  deliverCardRef.value?.doPrint(ids);
}
/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('order/deliveryRecord/export', {
    ...queryParams.value
  }, `deliveryRecord_${new Date().getTime()}.xlsx`)
}
const sumNum = (list: OrderVO[], field: string) => {
  let count = 0;
  list.forEach(item => {
    // console.log(field + ': --' + item[field])
    count += Number(item[field] || 0);
  });
  return Number(count.toFixed(4));
};
const footerMethod: VxeTablePropTypes.FooterMethod<OrderVO> = ({columns, data}) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return "合计";
      }
      if (column.field == "area") {
        return `${sumNum(data, "area")} `;
      }
      if (column.field == "quantity") {
        return `${sumNum(data, "quantity")} `;
      }
      return "";
    })
  ];
};
const footerMethodRetrun: VxeTablePropTypes.FooterMethod<OrderVO> = ({columns, data}) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return "合计";
      }
      if (column.field == "area") {
        return `${sumNum(data, "area")} `;
      }
      if (column.field == "quantity") {
        return `${sumNum(data, "quantity")} `;
      }
      return "";
    })
  ];
};

const getListCust = async() => {
    const custRes = await getListCustomer();
    const resCust = custRes.data;
    if(resCust){
      customerCodeList.value = resCust.map(item=>{ return { value:item.id, label:item.customerCode } });
    }
    
}

onMounted(() => {
  getListCust();
  getList();
});
</script>
<style lang="scss" scoped>
:deep(.totalTitle)
{
  padding: 0px !important;
  margin: 0px !important;
  line-height: 24px !important;
  display: flex !important;
  justify-content: end !important;
  font-size: 14px !important;
  color: #0892c7 !important;
  font-weight: bold;
  margin-right: 10px;
}
</style>