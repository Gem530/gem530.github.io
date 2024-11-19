<template>
  <div class="p-2 xtable-page customer-complaint">
    <el-card shadow="never" class="xtable-card">

      <el-tabs v-model="editableTabsValue" type="border-card"  class="xtable-tab"  @tab-change="changeTab">

        <el-tab-pane label="待发货列表"      name="0">

          <div class="global-flex flex-end" style="width: 100%;margin-bottom: 10px;">
            <el-button type="primary"  @click="clickReceiveDriller" >发货</el-button>
          </div>

          <XTable toolId="purchaseOrderDelivery" height="100%" class="xtable-content"
                  v-model:page-size="purchaseOrderQueryParams.pageSize"
                  v-model:current-page="purchaseOrderQueryParams.pageNum"
                  :intervalCondition="intervalCondition"
                  :page-params="{ perfect: true, total: purchaseOrderTableTotal }"
                  :data="purchaseOrderTableData"
                  :sort-orders="sortCondition"
                  :columnList="purchaseOrderColumnList"
                  :checkbox-config="{ checkMethod: selectableFun, showHeader: false, reserve: true }"
                  @checkbox-all="selectAllChangeEvent"
                  @checkbox-change="selectAllChangeEvent"
                  ref="purchaseOrderDeliveryRef"
                  border :showRefresh="true"
                  @searchChange="purchaseOrderSearchChange"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField:'id' }"
                  :loading="purchaseOrderTableLoading"
                  :scroll-x="{enabled: true}"
                  :scroll-y="{enabled: true}" size="small"
          >

          </XTable>

        </el-tab-pane>

        <el-tab-pane label="买方修改待确认" name="1" >

          <div class="global-flex flex-end" style="width: 100%;margin-bottom: 10px;">
            <el-button  plain icon="Download" @click="deliveryWaitConfirmExport">导出</el-button>
          </div>

          <XTable toolId="deliveryWaitConfirm" height="100%" class="xtable-content"
                  v-model:page-size="deliveryWaitConfirmQueryParams.pageSize"
                  v-model:current-page="deliveryWaitConfirmQueryParams.pageNum"
                  :intervalCondition="intervalCondition"
                  :page-params="{ perfect: true, total: deliveryWaitConfirmTableTotal }"
                  :data="deliveryWaitConfirmTableData"
                  :columnList="deliveryWaitConfirmColumnList"
                  ref="XTableRef"
                  border
                  :showRefresh="true"
                  @searchChange="deliveryWaitConfirmSearchChange"
                  :span-method="mergeCells"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField:'id' }"
                  :loading="deliveryWaitConfirmTableLoading"
                  :enterFresh = "true"
                  :scroll-x="{enabled: true}"
                  :scroll-y="{enabled: true}" size="small"
          >


            <template #default-make="scope">
              <el-button link type="primary" @click="viewDelivery(scope.row)" >详情</el-button>
              <el-button link type="primary" @click="editDelivery(scope.row)" >确认</el-button>
              <el-button link type="primary" @click="deleteDelivery(scope.row)" >删除</el-button>
              <el-button link type="primary" @click="uReportHandle(scope.row)">打印送货单</el-button>
              <el-button link type="primary" @click="handleFile(scope.row)" >附件下载</el-button>
              <el-button link type="primary" @click="generateUrlLink(scope.row)" >分享链接</el-button>
              <el-button link type="primary" @click="handleRecord(scope.row)" >确认记录</el-button>
            </template>

            <template #default-status="scope">
              <div v-for="item in orderStatus">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.status">{{item.label}}</el-tag>
              </div>
            </template>

<!--            <template #default-code="scope">
              <span>{{ scope.row.code }}</span>
              <el-button link @click="uReportHandle(scope.row)">
                <el-icon>
                  <Document />
                </el-icon>
              </el-button>
            </template>-->


          </XTable>

        </el-tab-pane>

        <el-tab-pane label="已发货待买方确认" name="2" >

          <div class="global-flex flex-end" style="width: 100%;margin-bottom: 10px;">
            <el-button  plain icon="Download" @click="deliveryConfirmedExport">导出</el-button>
          </div>

          <XTable toolId="deliveryConfirmed" height="100%" class="xtable-content"
                  v-model:page-size="deliveryConfirmedQueryParams.pageSize"
                  v-model:current-page="deliveryConfirmedQueryParams.pageNum"
                  :intervalCondition="intervalCondition"
                  :page-params="{  perfect: true, total: deliveryConfirmedTableTotal }"
                  :data="deliveryConfirmedTableData"
                  :columnList="deliveryConfirmedColumnList"
                  :span-method="mergeCells"
                  ref="XTableRef2"
                  border
                  :showRefresh="true"
                  @searchChange="deliveryConfirmedSearchChange"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField:'id' }"
                  :loading="deliveryConfirmedTableLoading"
                  :enterFresh = "true"
                  :scroll-x="{enabled: true}"
                  :scroll-y="{enabled: true}" size="small"
          >
            <template #default-make="scope">
              <el-button v-if="scope.row.canDel" link type="primary" @click="deleteDelivery(scope.row)" >删除</el-button>
              <el-button link type="primary" @click="viewDelivery(scope.row)" >详情</el-button>
<!--              <el-button link type="primary" @click="doPrint(scope.row.id)" >打印送货单</el-button>-->
              <el-button link type="primary" @click="uReportHandle(scope.row)" >打印送货单</el-button>
              <el-button link type="primary" @click="handleFile(scope.row)" >附件下载</el-button>
              <el-button link type="primary" @click="generateUrlLink(scope.row)" >分享链接</el-button>
              <el-button link type="primary" @click="handleRecord(scope.row)" >确认记录</el-button>
            </template>

            <template #default-status="scope">
              <div v-for="item in orderStatus">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.status">{{item.label}}</el-tag>
              </div>
            </template>

<!--            <template #default-code="scope">
              <span>{{ scope.row.code }}</span>
              <el-button link @click="uReportHandle(scope.row)">
                <el-icon>
                  <Document />
                </el-icon>
              </el-button>
            </template>-->

          </XTable>

        </el-tab-pane>


      </el-tabs>

    </el-card>

    <!-- 送货单抽屉-->
    <el-drawer
      v-model="startDeliveryVisible"
      :title= "startDeliveryTitle"
      direction="rtl"
      size="70%"
      destroy-on-close
      @close="resetReceiveForm()"
    >
      <el-form
        :model="receiveFromData"
        ref="receiveFormRef"
        :rules="receiveFormRule"
        :disabled="!editStatus"
        label-width="auto"
      >

        <el-row >
          <el-col :span="11">
            <el-form-item label="客户名称" prop="createDeptName">
              <el-input v-model="receiveFromData.company" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="width: 100%; margin-left: 25px">
            <el-form-item label="送货地址" prop="deliveryAddress">
              <el-input v-model="receiveFromData.deliveryAddress" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="送货车辆">
              <el-input v-model="receiveFromData.deliveryVehicle" maxlength="40"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="装运人员"  style="width: 100%; margin-left: 25px">
              <el-input v-model="receiveFromData.loadingStaff" maxlength="40"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="物流公司">
              <el-input v-model="receiveFromData.logisticsCompany" maxlength="40"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流单号"  style="width: 100%; margin-left: 25px">
              <el-input v-model="receiveFromData.logisticsTrackingNumber" maxlength="40"/>
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item label="送货时间" prop="quantity">
              <el-date-picker
                v-model="receiveFromData.deliveryTime"
                type="datetime"
                placeholder="不填则默认为当前时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                class="absolutely-width"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货手机号"  style="width: 100%; margin-left: 25px">
              <el-input v-model="receiveFromData.phoneNumber" maxlength="40"
              placeholder="顺丰物流请填写收货手机号" />
            </el-form-item>
          </el-col>

          <el-col :span="24" style="margin-top: 0px" v-if="isEdit">
            <el-form-item label="确认备注" prop="confirmRemark">
              <el-input show-word-limit :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" maxlength="200"  autosize  v-model="receiveFromData.confirmRemark" placeholder="请输入备注"  />
            </el-form-item>
          </el-col>

          <el-col :span="24" style="margin-top: 20px">
            <XTable :pageShow="false"
                    toolId="deliveryInsert"
                    ref="confirmTable"
                    :data="confirmSelectInventoryList"
                    border
                    :columnList="confirmSelectInventoryColumnList"
                    max-height="450px"
                    :loading="deliveryLoading"
                    :edit-rules="validRules"
            >

              <template #default-deliveryQuantity="scope">
                <el-input-number  style="width: 99%;"  :controls="false" :precision="2"  v-model="scope.row.deliveryQuantity" :min="0.01" :max="scope.row.canDeliveryQuantity ? scope.row.canDeliveryQuantity :scope.row.oweQuantity"/>
              </template>
              <template #default-sparePartsQuantity="scope">
                <el-input-number :disabled="isEdit"  style="width: 99%;"  :controls="false" :precision="0"  v-model="scope.row.sparePartsQuantity" :min="1"  :max="999999999"/>
              </template>
              <template #default-boxCount="scope">
                <el-input-number :disabled="isEdit"  style="width: 99%;"  :controls="false" :precision="0"  v-model="scope.row.boxCount" :min="1"  :max="99999999"/>
              </template>
              <template #default-remark="scope">
                <el-input style="width: 99%;" :disabled="isEdit"  :controls="false"  v-model="scope.row.remark"  maxlength="100"/>
              </template>
              <template #default-make="scope">
                <el-button link type="primary" @click="handleDelete(scope.row)" >删除</el-button>
              </template>

            </XTable>

          </el-col>



        </el-row>
      </el-form>

      <template #footer >
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="resetReceiveForm">取消</el-button>
            <el-button type="info" @click="stagingDeliveryOrder" v-if="editStatus&&isEdit">暂存</el-button>
            <el-button type="primary" @click="editDeliveryOrder" v-if="editStatus">确认</el-button>
          </span>
        </div>
      </template>

    </el-drawer>

    <!-- 打印送货单-->
    <purchaseDeliveryPrint ref="deliverCardRef" />
    <!-- 文件上传 -->
    <ContractFileDialog
      v-if="uploadVisible"
      v-model:show="uploadVisible"
      :moduleCode="props.moduleCode"
      :bizType="props.bizType"
      :id="id"
      :biz-code="bizCode"
      :findType="2"
    />
    <!-- 操作记录 -->
    <ConfirmRecordDialog
      v-if="recordVisible"
      v-model:show="recordVisible"
      :id="id"
      :orderId="orderId"
    />

    <!-- 打印单据-->
    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false"
               draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>

    <!-- 签名列表 -->
    <signDialog v-if="signVisible" v-model:show="signVisible" @submit="submitSign" @cancel="cancelSign" />
  </div>
</template>

<script setup name="PurchaseMaterialDelivery">


import {
  confirmVerifyDelivery,
  delDelivery,
  editOrConfirmDelivery,
  insertDelivery,
  listPurchaseDetailDelivery,
  listWaitConfirmDeliverySup,
  viewDeliveryDetail
} from "@/api/purchase/purchaseMaterialDelivery";
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ConfirmEnum } from "@/api/financial/accountOrder/types";
import PurchaseDeliveryPrint from "@/components/PrintPdf/purchaseDeliveryPrint.vue";
/**报表预览 */
import { getReportUrl } from "@/utils/report";
import { getSignPdf } from "@/api/financial/accountOrder";
import dayjs from "dayjs";
import { getUrlLink } from "@/api/purchase/materialOrder";
import clipboard3 from "vue-clipboard3";
import useUserStore from "@/store/modules/user";
import {queryUseModule} from "@/api/basedata/sign";
import { decryptBase64ByStr } from '@/utils/crypto'

const editableTabsValue = ref('0');
const route = useRoute();
/**
 * 进入页面次数
 */
const isFirst = ref(0)
/**
 * 待办跳转参数
 */
const pendingParams = ref()
/** 报表预览地址 */
let reportUrl = ref("");
const uReportHandle = async (row) => {
  reportUrl.value = '';
  reportDrawer.title = "采购送货单预览";
  reportDrawer.visible = true;

  getSignPdf({bizId: row.bizId, bizType: '17'}).then(res => {
    let vo = res.data;
    if (vo !== null && vo.url) {
      reportUrl.value = '/web/viewer.html?file=' + encodeURIComponent(vo.url + '#' + vo.name);
    } else {
      // ElMessage.info("查询不到对应的签名文件");
      reportUrl.value = getReportUrl() + `&_n=采购送货单&_u=file:purchaseDelivery.ureport.xml&url=purchase/materialDelivery/reportHeard/${row.id}&listUrl=purchase/materialDelivery/reportExcel/${row.id}`;
      // reportDrawer.visible = false;
    }
  });
}
const reportDrawer = reactive({
  direction: 'left',
  visible: false,
  title: '采购送货单预览'
});

// 共用组件属性值初始化
const { proxy } = getCurrentInstance();
const uploadVisible = ref(false);
const recordVisible = ref(false);
const id = ref();
const props = ref({
  dataList: [],
  columnList: [],
  intervalCondition: [],
  toolId1: '',
  toolId2: '',
  toolId3: '',
  loading: false,
  total: 0,
  moduleCode: '',
  bizType: ''
})
const bizCode = ref();
const orderId = ref();

// 单据状态
const orderStatus = ref([
  {type:"primary" ,label: "待对方确认", value: "1"},
  {type:"warning" ,label: "待确认", value: "2"},
  {type:"success" ,label: "已确认", value: "3"},
])

// 单据状态
const orderStatusParams = ref([
  {type:"primary" ,label: "待对方确认", value: "1"},
  {type:"success" ,label: "已确认", value: "3"},
])

/* 采购单明细待生成送货单 */
const purchaseOrderTableTotal = ref(0);
const purchaseOrderTableData = ref([]);
const purchaseOrderTableLoading = ref(false);

// 编辑状态
const editStatus = ref(true);
// 是否为修改
const isEdit = ref(false);
// 声名需要处理的时间查询条件字段
const intervalCondition = ['updateTime','createTime','deliverTime','deliveryTime'];
// 初始化可生成送货单页面查询参数
const { purchaseOrderQueryParams } = toRefs(reactive({
  purchaseOrderQueryParams: {
    pageNum: 1,
    pageSize: 20,
    orderStatus: undefined,
    updateTimeStart: undefined,
    updateTimeEnd: undefined
  }
}));

const sortCondition = [
  'quantity',
  'updateTime',
  'createTime',
  'deliverTime'
];

const checkCustomer = ref("");
/** 是否禁选 */
const selectableFun = (scope) => {
  //当前选择客户与已选择客户不一致时，禁选
  return !(checkCustomer.value && scope.row.company !== checkCustomer.value);
}


// 选择采购明细单
const selectAllChangeEvent = () => {
  const tableRef = purchaseOrderDeliveryRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxRecords();
    const reserveSelect = tableRef.getCheckboxReserveRecords();

    confirmSelectInventoryList.value = selectRecords.map((item) => item);
    if (reserveSelect?.length) {
      confirmSelectInventoryList.value = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    }
  }

  let isDiff = true;
  if (confirmSelectInventoryList.value && confirmSelectInventoryList.value.length > 0) {
    const company = confirmSelectInventoryList.value[0].company;
    if (checkCustomer.value === company) {
      isDiff = false
    }
    checkCustomer.value = confirmSelectInventoryList.value[0].company;
    // queryParams.value.company = checkCustomer.value;
    let searchTempList = [{field: 'company', defaultValue: checkCustomer.value}]
    let tempAddress = confirmSelectInventoryList.value[0].deliveryAddress && confirmSelectInventoryList.value[0].deliveryAddress.trim()
    if (tempAddress) {
      searchTempList.push({field: 'deliveryAddress', defaultValue: confirmSelectInventoryList.value[0].deliveryAddress})
    }
    if (!purchaseOrderQueryParams.value?.company) {
      purchaseOrderQueryParams.value.pageNum = 1
    }
    purchaseOrderDeliveryRef.value.filterFieldEvent(searchTempList)
  } else {
    if (checkCustomer.value === "") {
      isDiff = false
    }
    checkCustomer.value = "";
    // queryParams.value.company = undefined;
    purchaseOrderQueryParams.value.pageNum = 1
    purchaseOrderDeliveryRef.value.delFilterField(['company','deliveryAddress'])
    purchaseOrderDeliveryRef.value.xTableRef.clearCheckboxRow();
    confirmSelectInventoryList.value=[];
  }

}
const purchaseOrderColumnList = ref([
  { width: "50", type: "checkbox", align: "center" },
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: '采购单号', field: 'purchaseCode', width: '125', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { title: '客户名称', field: 'company', width: '125', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户名称' } },
  { title: '送货地址', field: 'deliveryAddress', width: '125', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入送货地址' } },
  { title: '物料编码', field: 'materialCode', width: '90', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '物料名称', field: 'materialName', width: '90', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { title: '单位名称', field: 'units', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入材质牌号' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入规格型号' } },
  { title: '直径', field: 'diameter', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入直径' } },
  { title: '厚度', field: 'thickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入厚度' } },
  { title: '板厚', field: 'boardThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入板厚' } },
  { title: '铜厚', field: 'copperThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入铜厚' } },
  { title: '颜色', field: 'color', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '级别', field: 'level', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '长(mm)', field: 'length', width: '80', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '宽(mm)', field: 'width', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '品牌', field: 'manufacturer', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入品牌' } },
  { title: "要求交期"  , sortable: true,  width: "140", field: "deliverTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'date', valueFormat: 'YYYY-MM-DD 00:00:00'},
      endParams: {placeholder: '请输入结束时间', type: 'date', valueFormat: 'YYYY-MM-DD 23:59:59'},
    }},
  { title: '采购数量' , sortable: true , field: 'quantity', width: '70', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '送货数量', field: 'deliverQuantity', width: '90', align: 'center', filterParam: { placeholder: '' }},
  { title: '差欠数量', field: 'oweQuantity', width: '90', align: 'center', filterParam: { placeholder: '' }},
]);


watch(() => purchaseOrderQueryParams.value, (val, old) => {
  console.log(val, old)
  if (old.company && !val.company) {
    //   清除xtable勾选
    purchaseOrderDeliveryRef.value.xTableRef.clearCheckboxRow()
    purchaseOrderDeliveryRef.value.xTableRef.clearCheckboxReserve()
  }
  if (old.deliveryAddress && !val.deliveryAddress) {
    //   清除xtable勾选
    purchaseOrderDeliveryRef.value.xTableRef.clearCheckboxRow()
    purchaseOrderDeliveryRef.value.xTableRef.clearCheckboxReserve()
  }
}, { deep: true })
/**
 * 分仓库存列表搜索条件更新
 */
const purchaseOrderSearchChange = (param) => {
  purchaseOrderQueryParams.value = {...param}
  purchaseOrderQueryParams.value.orderStatus='0';//状态值0:待提交
  if (param.sorts && param.sorts.length > 0) {
    param.sorts.forEach((item) => {
      purchaseOrderQueryParams.value.orderByColumn = item.prop;
      purchaseOrderQueryParams.value.isAsc = item.order;
    })
  }
  refreshTableData();
}

// 新增送货抽屉可视性
const startDeliveryVisible =ref(false);
const startDeliveryTitle = ref("新增送货单");
// 确认选中的采购明细单
const confirmSelectInventoryList = ref([]);
const purchaseOrderDeliveryRef = ref();
const XTableRef = ref();
const XTableRef2 = ref();

//确认选中的排产单表
const confirmSelectInventoryColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" ,fixed: 'left' , showOverflow: false},
  { title: '采购单号', field: 'purchaseCode', width: '125', align: 'center',fixed: 'left' , showOverflow: false},
  { title: '物料编码', field: 'materialCode', width: '90', align: 'center',fixed: 'left' , showOverflow: false},
  { title: '物料名称', field: 'materialName', width: '90', align: 'center'},
  { title: '单位名称', field: 'units', width: '80', align: 'center'},
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center'},
  { title: '规格型号', field: 'specification', width: '80', align: 'center'},
  { title: '直径', field: 'diameter', width: '80', align: 'center'},
  { title: '厚度', field: 'thickness', width: '80', align: 'center'},
  { title: '板厚', field: 'boardThickness', width: '80', align: 'center'},
  { title: '铜厚', field: 'copperThickness', width: '80', align: 'center'},
  { title: '颜色', field: 'color', width: '80', align: 'center'  },
  { title: '级别', field: 'level', width: '80', align: 'center'  },
  { title: '长(mm)', field: 'length', width: '80', align: 'center' },
  { title: '宽(mm)', field: 'width', width: '80', align: 'center' },
  { title: '品牌', field: 'manufacturer', width: '80', align: 'center'},
  { title: "要求交期"  ,  width: "140", field: "deliverTime", align: "center"},
  { title: '单位', field: 'units', width: '120', align: 'center' },
  { title: '采购数量' , field: 'quantity', width: '70', align: 'center' },
  { title: '已送货数量', field: 'deliverQuantity', width: '90', align: 'center' },
  { title: '差欠数量', field: 'oweQuantity', width: '90', align: 'center' },
  { title: '箱数', field: 'boxCount', width: '90', align: 'center'},
  { title: '备品数量', field: 'sparePartsQuantity', width: '90', align: 'center'},
  { title: '本次送货数量', field: 'deliveryQuantity', width: '90', align: 'center',fixed: 'right' , showOverflow: false  },
  { title: '备注', field: 'remark', width: '116', align: 'center' ,fixed: 'right' , showOverflow: false },
  { title: '操作',  align: "center", field: "make" ,fixed: 'right' , width: '120', showOverflow: false  }
]);

/** 已选物料 删除按钮操作 */
const handleDelete = (row) =>
{
  const id = row?.id;
  //删除已选物料
  confirmSelectInventoryList.value = confirmSelectInventoryList.value.filter(item => item.id !== id);
}

/**
 * 初始化领用表数据
 */
const resetReceiveForm = () => {
  startDeliveryVisible.value = false;
  isEdit.value = false;
  // 初始化提交数据
  receiveFromData = ref({
    company: undefined,
    deliveryAddress: undefined,
    deliveryVehicle: undefined,
    loadingStaff: undefined,
    logisticsCompany: undefined,
    logisticsTrackingNumber: undefined,
    deliveryTime: undefined,
    purchaseMaterialDeliveryList: [],
    status: '',
    remark: ''
  });
  confirmSelectInventoryList.value = []
};

const receiveFormRef = ref();
const confirmTable = ref();
const validRules = ref({
  deliveryQuantity: [
    { required: true, message: "发货数量不能为空" }
  ],
})
/**
 * 新建送货单
 */
const editDeliveryOrder = async () => {


    const $table = confirmTable.value.xTableRef;

    if ($table) {

      let errMap = await $table.fullValidate(true);

      if (errMap) {
        return;
      }
    }

    receiveFromData.value.status = ConfirmEnum.WAIT_ONE_CONFIRM;
    if (isEdit.value === true){
      if (confirmSelectInventoryList.value.length === 0) {
        await ElMessageBox.confirm(
          '请至少保留一条送货明细',
          '提示:',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          })
      } else {
        // 确认

        receiveFromData.value.purchaseMaterialDeliveryList = confirmSelectInventoryList.value;
        receiveFormRef.value.validate(async (valid, fields) => {
          if (!valid) {
            console.log('error submit!', fields)
          } else {
            // 先进行校验
            const res = await confirmVerifyDelivery({ data: receiveFromData.value })
            if (res.data === true){
              const confirmed = await ElMessageBox.confirm(
                '您已修改单据信息，需要对方再次确认，是否确认修改？',
                '提示:',
                {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'warning',
                })

              if (confirmed) {
                // 确认时继续发送下方请求
                editOrConfirmDelivery({
                  data: receiveFromData.value
                })
                  .then((res) => {
                    if (res.code === 200) {
                      ElMessage({
                        type: 'success',
                        message: "提交成功",
                      });
                      // 在成功的情况下重置表单和刷新表格数据
                      resetReceiveForm();
                      refreshWaitConfirmTableData();
                    }
                  })
              }

            }else{
              // 校验返回的data为false时继续发送下方请求
              editOrConfirmDelivery({
                data: receiveFromData.value
              })
                .then((res) => {
                  if (res.code === 200) {
                    ElMessage({
                      type: 'success',
                      message: "提交成功",
                    });
                    // 在成功的情况下重置表单和刷新表格数据
                    resetReceiveForm();
                    refreshWaitConfirmTableData();
                  }
                })
            }
          }

        })
      }
  }else{
      if (confirmSelectInventoryList.value.length === 0 ){
        await ElMessageBox.confirm(
          '请至少保留一条送货明细',
          '提示:',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
          return;
        })
      }else{
      // 新增
      receiveFromData.value.purchaseMaterialDeliveryList = confirmSelectInventoryList.value;

      receiveFormRef.value.validate(async (valid, fields) => {

        let check = false;
        let msg = "";
        receiveFromData.value.purchaseMaterialDeliveryList.forEach((item) => {
          //判断item.applyNum>0
          if (item.deliveryQuantity === undefined ||item.deliveryQuantity <= 0) {
            check = true;
            msg="申请数量必须大于0"
            return;
          }

        });

        if (!valid) {
          console.log('error submit!', fields)
        }else{
          // 查询是否存在默认签章
          const res = await queryUseModule({useModule: '2'});
          // 存在则自动签名
          if(res.data) {
            submitSign(res.data.key, res.data.signType);
          } else {
            // 选择签章数据
            signVisible.value = true;
          }
        }

      })
    }


  }

}

/**
 * 暂存送货单
 */
const stagingDeliveryOrder = async () => {
  if (confirmSelectInventoryList.value.length === 0) {
    await ElMessageBox.confirm(
      '请至少保留一条送货明细',
      '提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
  } else {

    const $table = confirmTable.value.xTableRef;

    if ($table) {

      let errMap = await $table.fullValidate(true);

      if (errMap) {
        return;
      }
    }
    // 暂存
    receiveFromData.value.status = ConfirmEnum.WAIT_TWO_CONFIRM;
    receiveFromData.value.flag = true;
    receiveFromData.value.purchaseMaterialDeliveryList = confirmSelectInventoryList.value;
    receiveFormRef.value.validate(async (valid, fields) => {
      if (!valid) {
        console.log('error submit!', fields)
      } else {
        // 先进行校验
        const res = await confirmVerifyDelivery({ data: receiveFromData.value })
        if (res.data === true) {
          const confirmed = await ElMessageBox.confirm(
            '您已修改单据信息，当前为暂存，后续提交时需要对方再次确认，是否确认修改？',
            '提示:',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
            })

          if (confirmed) {
            // 确认时继续发送下方请求
            editOrConfirmDelivery({
              data: receiveFromData.value
            })
              .then((res) => {
                if (res.code === 200) {
                  ElMessage({
                    type: 'success',
                    message: "提交成功",
                  });
                  // 在成功的情况下重置表单和刷新表格数据
                  resetReceiveForm();
                  refreshWaitConfirmTableData();
                }
              })
          }

        } else {

          editOrConfirmDelivery({
            data: receiveFromData.value
          })
            .then((res) => {
              if (res.code === 200) {
                ElMessage({
                  type: 'success',
                  message: "提交成功",
                });
                // 在成功的情况下重置表单和刷新表格数据
                resetReceiveForm();
                refreshWaitConfirmTableData();
              }
            })
        }
        }

      }
    )
    }
}

/**
 * 初始化新增送货单表单数据
 */
let receiveFromData = ref({
  company: undefined,
  deliveryAddress: undefined,
  deliveryVehicle: undefined,
  loadingStaff: undefined,
  logisticsCompany: undefined,
  logisticsTrackingNumber: undefined,
  deliveryTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
  purchaseMaterialDeliveryList: [],
  status: '',
  remark: ''
})

/**
 * 多选发货
 */
const clickReceiveDriller = async () => {
  editStatus.value = true;
  if (confirmSelectInventoryList.value.length === 0){
    await ElMessageBox.confirm(
      '请勾选采购单数据',
      '操作提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
  }else{
    startDeliveryVisible.value = true;
    startDeliveryTitle.value = '新建送货单';
    console.log(confirmSelectInventoryList.value);
    receiveFromData.value.company = confirmSelectInventoryList.value[0].company;
    receiveFromData.value.deliveryAddress = confirmSelectInventoryList.value[0].deliveryAddress;
    receiveFromData.value.deliveryTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');


    purchaseOrderDeliveryRef.value.xTableRef.clearCheckboxRow();
    // setTimeout(() =>{
    //   recInventoryRef.value.focus();
    // },200)
  }

}

/**
 * 领用表单填写规则
 */
const receiveFormRule = ref({
  receiveUserId: [
    { required: true, message: '领用人不能为空', trigger: 'change' }
  ],
  receivedQuantity: [
    { required: true, message: '领用数量不能为空', trigger: 'change' }
  ]
})

/**
 * 发送查询请求,刷新库存列表页面数据
 */
const refreshTableData = () => {
  purchaseOrderTableLoading.value = true;
  listPurchaseDetailDelivery(purchaseOrderQueryParams.value)
    .then((res) => {
      purchaseOrderTableData.value = res.rows;
      purchaseOrderTableTotal.value = res.total;
    })
    .finally(() => {
      purchaseOrderTableLoading.value = false;
    })
}
/*
// 选择采购明细单
const selectAllChangeEvent = () => {
  const $table = purchaseOrderDeliveryRef.value.xTableRef
  if ($table) {
    confirmSelectInventoryList.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
  }
}*/





/* 待甲方确认-送货单列表*/
// 初始化查询参数
const { deliveryWaitConfirmQueryParams } = toRefs(reactive({
  deliveryWaitConfirmQueryParams: {
    pageNum: 1,
    pageSize: 20,
    status: undefined,
    createTimeStart: undefined,
    createTimeEnd: undefined
  }
}));
const deliveryWaitConfirmTableTotal = ref(0);
const deliveryWaitConfirmTableData = ref([]);
const deliveryWaitConfirmTableLoading = ref(false);
const deliveryWaitConfirmColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: '送货单号', field: 'code', width: '116', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入送货单号' } },
  { title: '开单人', field: 'createByName', width: '70', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入开单人' } },
  { title: "送货日期", sortable: true, width: "130", field: "deliverTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  { title: '客户名称', field: 'company', width: '116', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户名称' } },
  { title: '采购单号', field: 'purchaseCode', width: '116', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { title: "要求交期"  , width: "90", field: "deliveryTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'date', valueFormat: 'YYYY-MM-DD 00:00:00'},
      endParams: {placeholder: '请输入结束时间', type: 'date', valueFormat: 'YYYY-MM-DD 23:59:59'},
    }},
  { title: '物料编码', field: 'materialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '物料名称', field: 'materialName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { title: '规格型号', field: 'specification', width: '130', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入规格型号' } },
  { title: '单位', field: 'units', width: '50', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '采购数量', field: 'quantity', width: '80', align: 'center' },
  { title: '送货数量', field: 'deliveryQuantity', width: '90', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '送货车辆', field: 'deliveryVehicle', width: '80', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '装运人员', field: 'loadingStaff', width: '80', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物流公司', field: 'logisticsCompany', width: '80', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物流单号', field: 'logisticsTrackingNumber', width: '116', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '备注', field: 'remark', width: '116', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '送货地址', field: 'deliveryAddress', width: '125', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入备注' } },
  { title: '单据状态', field: 'status', width: '125', align: 'center' },
  { title: '操作',  align: "center", field: "make" ,fixed: 'right' , width: '450', showOverflow: false  }
]);

/**
 * 单元格合并方法
 * @param row
 * @param items
 * @param seq
 * @param rowIndex
 * @param $rowIndex
 * @param _rowIndex
 * @param column
 * @param data
 * @returns {{colspan: number, rowspan: number}}
 */
const mergeCells = ({ row, items, seq, rowIndex, $rowIndex, _rowIndex, column, data }) => {
  if (column.property === "code") {
    // code的合并
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
  } else if (column.property === "createByName") {
    // createByName的合并逻辑，依赖于code的值
    const referenceField = "createByName";
    const codeField = "code";
    if (rowIndex > 0 && row[codeField] === items[rowIndex - 1][codeField]) {
      // 只有当当前行和前一行的code相同的情况下才考虑合并createByName
      if (row[referenceField] === items[rowIndex - 1][referenceField]) {
        // createByName相同且code也相同，不展示当前单元格
        return { rowspan: 0, colspan: 0 };
      }
    }
    // 对于第一行或者code不同的情况，计算createByName的合并长度
    let countRowspan = 1;
    let nextRow = data[$rowIndex + 1];
    while (nextRow && nextRow[codeField] === row[codeField] && nextRow[referenceField] === row[referenceField]) {
      countRowspan++;
      nextRow = data[$rowIndex + countRowspan];
    }
    if (countRowspan > 1) {
      return { rowspan: countRowspan, colspan: 1 };
    }
  } else if (column.property === "createTime") {
    const referenceField = "createTime";
    const codeField = "code";
    if (rowIndex > 0 && row[codeField] === items[rowIndex - 1][codeField]) {
      if (row[referenceField] === items[rowIndex - 1][referenceField]) {
        return { rowspan: 0, colspan: 0 };
      }
    }
    let countRowspan = 1;
    let nextRow = data[$rowIndex + 1];
    while (nextRow && nextRow[codeField] === row[codeField] && nextRow[referenceField] === row[referenceField]) {
      countRowspan++;
      nextRow = data[$rowIndex + countRowspan];
    }
    if (countRowspan > 1) {
      return { rowspan: countRowspan, colspan: 1 };
    }
  } else if (column.property === "deliveryTime") {
    // 修改createTime的合并逻辑，使其依赖于code的值
    const referenceField = "deliveryTime";
    const codeField = "code";
    if (rowIndex > 0 && row[codeField] === items[rowIndex - 1][codeField]) {
      if (row[referenceField] === items[rowIndex - 1][referenceField]) {
        return { rowspan: 0, colspan: 0 };
      }
    }
    let countRowspan = 1;
    let nextRow = data[$rowIndex + 1];
    while (nextRow && nextRow[codeField] === row[codeField] && nextRow[referenceField] === row[referenceField]) {
      countRowspan++;
      nextRow = data[$rowIndex + countRowspan];
    }
    if (countRowspan > 1) {
      return { rowspan: countRowspan, colspan: 1 };
    }
  } else if (column.property === "createDeptName") {
    const referenceField = "createDeptName";
    const codeField = "code";
    if (rowIndex > 0 && row[codeField] === items[rowIndex - 1][codeField]) {
      if (row[referenceField] === items[rowIndex - 1][referenceField]) {
        return { rowspan: 0, colspan: 0 };
      }
    }
    let countRowspan = 1;
    let nextRow = data[$rowIndex + 1];
    while (nextRow && nextRow[codeField] === row[codeField] && nextRow[referenceField] === row[referenceField]) {
      countRowspan++;
      nextRow = data[$rowIndex + countRowspan];
    }
    if (countRowspan > 1) {
      return { rowspan: countRowspan, colspan: 1 };
    }
  } else if (column.property === "purchaseCode") {
    const referenceField = "purchaseCode";
    const codeField = "code";
    if (rowIndex > 0 && row[codeField] === items[rowIndex - 1][codeField]) {
      if (row[referenceField] === items[rowIndex - 1][referenceField]) {
        return { rowspan: 0, colspan: 0 };
      }
    }
    let countRowspan = 1;
    let nextRow = data[$rowIndex + 1];
    while (nextRow && nextRow[codeField] === row[codeField] && nextRow[referenceField] === row[referenceField]) {
      countRowspan++;
      nextRow = data[$rowIndex + countRowspan];
    }
    if (countRowspan > 1) {
      return { rowspan: countRowspan, colspan: 1 };
    }
  }
  // 对于不需要合并的单元格，可以返回null或不返回值
}



/**
 * 已发货待确认列表条件更新
 */
const deliveryWaitConfirmSearchChange = (param) => {
  deliveryWaitConfirmQueryParams.value = {...param}
  if (param.sorts && param.sorts.length > 0) {
    param.sorts.forEach((item) => {
      deliveryWaitConfirmQueryParams.value.orderByColumn = item.prop;
      deliveryWaitConfirmQueryParams.value.isAsc = item.order;
    })
  }
  refreshWaitConfirmTableData();
}



/**
 * 刷新已发货待确认页面数据
 */
const refreshWaitConfirmTableData = () => {
  deliveryWaitConfirmTableLoading.value = true;
  deliveryWaitConfirmQueryParams.value.status = ConfirmEnum.WAIT_TWO_CONFIRM;
  listWaitConfirmDeliverySup(deliveryWaitConfirmQueryParams.value)
    .then((res) => {
      deliveryWaitConfirmTableData.value = res.rows;
      deliveryWaitConfirmTableTotal.value = res.total;

      // 格式化deliveryTime属性
      formatDeliveryTime(deliveryWaitConfirmTableData.value);
    })
    .finally(() => {
      deliveryWaitConfirmTableLoading.value = false;
    })
}


/*
 *  待确认页导出按钮操作
 */
const deliveryWaitConfirmExport = () => {

  if (deliveryWaitConfirmTableData.value === null){
    ElMessageBox.confirm(
      '所设筛选条件没有数据,请确认是否导出空文件/模版',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        proxy?.download("purchase/materialDelivery/export", {
          ...deliveryWaitConfirmQueryParams.value
        }, `送货单明细模板_${new Date().getTime()}.xlsx`);
      }
    )
  }else if (
    deliveryWaitConfirmQueryParams.value.createTimeStart === undefined &&
    deliveryWaitConfirmQueryParams.value.createTimeEnd   === undefined
  ){
    ElMessageBox.confirm(
      '没有设置时间筛选条件，将默认导出30天内的数据',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(
      exportReceiveList
    )
  }else{
    exportReceiveList();
  }
};

const exportReceiveList = () => {
  proxy?.download("purchase/materialDelivery/export", {
    ...deliveryWaitConfirmQueryParams.value
  }, `买方修改待确认_${new Date().getTime()}.xlsx`);
}


/* 待已方确认-送货单列表*/
const { deliveryConfirmedQueryParams } = toRefs(reactive({
  deliveryConfirmedQueryParams: {
    pageNum: 1,
    pageSize: 20,
    status: undefined,
    notStatus: undefined,
    createTimeStart: undefined,
    createTimeEnd: undefined
  }
}));
const deliveryConfirmedTableTotal = ref(0);
const deliveryConfirmedTableData = ref([]);
const deliveryConfirmedTableLoading = ref(false);
const deliveryLoading = ref(false);
const deliveryConfirmedColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: '送货单号', field: 'code', width: '116', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入送货单号' } },
  { title: '开单人', field: 'createByName', width: '70', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入开单人' } },
  { title: "送货日期", sortable: true, width: "130", field: "deliverTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  { title: '客户名称', field: 'company', width: '116', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户名称' } },
  { title: '采购单号', field: 'purchaseCode', width: '116', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { title: "要求交期"  ,  width: "90", field: "deliveryTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'date', valueFormat: 'YYYY-MM-DD 00:00:00'},
      endParams: {placeholder: '请输入结束时间', type: 'date', valueFormat: 'YYYY-MM-DD 23:59:59'},
    }},
  { title: '物料编码', field: 'materialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '物料名称', field: 'materialName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { title: '规格型号', field: 'specification', width: '130', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入规格型号' } },
  { title: '单位', field: 'units', width: '50', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '采购数量' , field: 'quantity', width: '80', align: 'center' },
  { title: '送货数量', field: 'deliveryQuantity', width: '90', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '送货车辆', field: 'deliveryVehicle', width: '80', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '装运人员', field: 'loadingStaff', width: '80', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物流公司', field: 'logisticsCompany', width: '80', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物流单号', field: 'logisticsTrackingNumber', width: '116', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '备注', field: 'remark', width: '116', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '送货地址', field: 'deliveryAddress', width: '125', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入送货地址' } },
  { title: '单据状态', field: 'status', width: '125', align: 'center',filterType: 'radioButton',
    filterParam: {placeholder: '请输入物料类别'},
    filterData: () => orderStatusParams.value,
    filterCustom: {label: 'label', value: 'value'}
  },
  { title: '操作',  align: "center", field: "make" ,fixed: 'right' , width: '400', showOverflow: false  }
]);


/**
 * 新增送货列表查看关联排产信息
 */
const viewDelivery = async (row) => {
  editStatus.value = false;
  startDeliveryVisible.value = true;
  deliveryLoading.value = true;
  startDeliveryTitle.value = '修改送货单';
  console.log(confirmSelectInventoryList.value);
  viewDeliveryDetail(row.id).then((res) => {
    receiveFromData.value = res.data;
    confirmSelectInventoryList.value = res.data.purchaseMaterialDeliveryList;
  }).finally(() => {
    deliveryLoading.value = false;
  })
}

/**
 * 删除送货单
 */
const deleteDelivery = (row) => {

  ElMessageBox.confirm(
    '是否确认删除发货记录编号为'+row.code+'的单据',
    '删除提示:',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    delDelivery({
      id: row.id
    })
      .then(() => {
        ElMessage({
          type: 'success',
          message: "删除成功",
        });
      }).finally(() => {
      deliveryWaitConfirmQueryParams.value = {
        pageNum: 1,
        pageSize: 20,
        status: ConfirmEnum.WAIT_TWO_CONFIRM,
        createTimeStart: undefined,
        createTimeEnd: undefined
      };
      refreshWaitConfirmTableData();
      refreshConfirmedTableData();
    })
  })
}

/**
 * 编辑送货单
 */
const editDelivery = async (row) => {
  editStatus.value = true;
  isEdit.value = true;
  startDeliveryVisible.value = true;
  deliveryLoading.value = true;
  startDeliveryTitle.value = '预览送货单';
  console.log(confirmSelectInventoryList.value);
  viewDeliveryDetail(row.id).then((res) => {
    receiveFromData.value = res.data;
    confirmSelectInventoryList.value = res.data.purchaseMaterialDeliveryList;
  }).finally(() => {
    deliveryLoading.value = false;
  })
}

/**
 * 上传文件
 */
const handleFile = async (row) => {
  id.value = row.bizId;
  // SysFileModuleCode-->DELIVERY("11", "送货模块"),
  props.value.moduleCode = '11';
  // SysFileBizType-->GYSQM("18", "供应商签名附件"),
  props.value.bizType = '16';
  bizCode.value = row.code;
  uploadVisible.value=true;
}

/**
 * 操作记录
 */
/** 查询操作记录 */
const handleRecord = async (row) => {
  id.value = row.id;
  orderId.value = row.id;
  recordVisible.value = true;
}
const { userId } = useUserStore();
//解构出复制方法
const { toClipboard } = clipboard3();
/** 生成分享链接并复制 */
const generateUrlLink = async (row) => {
  let path = 'pages/subOne/procurementSignature/deliveryOrder/detail/index';
  let query = 'id='+row.id+'&companyId=' + row.companyId+'&shareUserId=' + userId;
  const res = await getUrlLink({path: path,query: query});
  console.log(res)
  try {
    await toClipboard(res.data);
    proxy?.$modal.msgSuccess("复制成功!");
  } catch (error) {
    alert("复制失败!请重试!")
  }
  return res.data || '' ;
}

/**
 * 已发货已确认列表条件更新
 */
const deliveryConfirmedSearchChange = (param) => {
  deliveryConfirmedQueryParams.value = {...param}
  if (param.sorts && param.sorts.length > 0) {
    param.sorts.forEach((item) => {
      deliveryConfirmedQueryParams.value.orderByColumn = item.prop;
      deliveryConfirmedQueryParams.value.isAsc = item.order;
    })
  }
  refreshConfirmedTableData();
}
/**
 * 刷新已发货已确认页面数据
 */
const refreshConfirmedTableData = () => {
  deliveryConfirmedTableLoading.value = true;
  deliveryConfirmedQueryParams.value.notStatus = ConfirmEnum.WAIT_TWO_CONFIRM;
  listWaitConfirmDeliverySup(deliveryConfirmedQueryParams.value)
    .then((res) => {
      deliveryConfirmedTableData.value = res.rows;
      deliveryConfirmedTableTotal.value = res.total;

      // 格式化deliveryTime属性
      formatDeliveryTime(deliveryConfirmedTableData.value);
    })
    .finally(() => {
      deliveryConfirmedTableLoading.value = false;
    })
}

const formatDeliveryTime = (data) => {
  data.forEach(item => {
    if (item.deliveryTime) {
      const date = new Date(item.deliveryTime);
      item.deliveryTime = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
  });
};


/*
 *  已确认页导出按钮操作
 */
const deliveryConfirmedExport = () => {

  if (deliveryConfirmedTableData.value === null){
    ElMessageBox.confirm(
      '所设筛选条件没有数据,请确认是否导出空文件/模版',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        proxy?.download("purchase/materialDelivery/export", {
          ...deliveryConfirmedQueryParams.value
        }, `送货单明细模板_${new Date().getTime()}.xlsx`);
      }
    )
  }else if (
    deliveryConfirmedQueryParams.value.createTimeStart === undefined &&
    deliveryConfirmedQueryParams.value.createTimeEnd   === undefined
  ){
    ElMessageBox.confirm(
      '没有设置时间筛选条件，将默认导出30天内的数据',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(
      exportConfirmedList
    )
  }else{
    exportConfirmedList();
  }
};

const exportConfirmedList = () => {
  proxy?.download("purchase/materialDelivery/export", {
    ...deliveryConfirmedQueryParams.value
  }, `已发货待买方确认_${new Date().getTime()}.xlsx`);
}


const deliverCardRef = ref();
const doPrint = (id) => {
  console.log("点击打印")
  proxy?.$modal.loading("加载中");
  deliverCardRef.value.doPrint(id).finally(() => proxy?.$modal.closeLoading());
}


/**
 * 标签页变更时触发刷新接口
 */
const changeTab = (name) => {
  if (name === '0'){
    refreshTableData();
  }else  if (name === '1'){
    deliveryWaitConfirmTableData.value = [];
    // deliveryWaitConfirmQueryParams.value = {
    //   pageNum: 1,
    //     pageSize: 20,
    //     status: ConfirmEnum.WAIT_TWO_CONFIRM,
    //     createTimeStart: undefined,
    //     createTimeEnd: undefined
    // };
    refreshWaitConfirmTableData();
  }else  if (name === '2'){
    deliveryWaitConfirmTableData.value = [];
    // deliveryConfirmedQueryParams.value = {
    //   pageNum: 1,
    //   pageSize: 20,
    //   status: ConfirmEnum.WAIT_ONE_CONFIRM,
    //   createTimeStart: undefined,
    //   createTimeEnd: undefined
    // };
    refreshConfirmedTableData();
  }
}

const signVisible = ref(false);

const submitSign = async (key, signType) => {
  proxy?.$modal.loading("加载中...");
  receiveFromData.value.imageKey = key;
  receiveFromData.value.signType = signType;
  insertDelivery({
    data: receiveFromData.value
  })
    .then((res) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: "操作成功",
        });
        // 在成功的情况下重置表单和刷新表格数据
        resetReceiveForm();
        refreshTableData();
      }
    }).finally(() => {
    proxy?.$modal.closeLoading()
  });
}

const cancelSign = async () => {
  signVisible.value = false;
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
      let tab = !isNaN(Number(params.tab)) ? String(params.tab) : '0';
      editableTabsValue.value = tab
      if (tab === '0') {
        let tempColumnList = [{field: 'purchaseCode', defaultValue: params.bizNo}]
        purchaseOrderQueryParams.value.purchaseCode = params.bizNo
        setTimeout(() => {
          purchaseOrderDeliveryRef.value.filterFieldEvent(tempColumnList)
        }, 100)
      } else if (tab === '1') {
        let tempColumnList = [{field: 'code', defaultValue: params.bizNo}]
        deliveryWaitConfirmQueryParams.value.code = params.bizNo
        setTimeout(() => {
          XTableRef.value.filterFieldEvent(tempColumnList)
        }, 100)
      } else if (tab === '2') {
        let tempColumnList = [{field: 'code', defaultValue: params.bizNo}]
        deliveryConfirmedQueryParams.value.code = params.bizNo
        setTimeout(() => {
          XTableRef2.value.filterFieldEvent(tempColumnList)
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
/** 渲染完页面后刷新页面数据 */
onMounted(async () => {
    refreshTableData();
});

</script>


<style scoped lang="scss">
:deep(.absolutely-width) {
  width: 100%;
  .el-input__wrapper {
    width: 100%;
  }
}
</style>
