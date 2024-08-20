<template>
  <div class="p-2 xtable-page customer-complaint">
    <el-card shadow="never" class="xtable-card">

      <el-tabs type="border-card"  class="xtable-tab"  @tab-change="changeTab">

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



            <template #default-unit="scope">
              <div v-for="item in unitOptions">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.unit">{{item.label}}</el-tag>
              </div>
            </template>

          </XTable>

        </el-tab-pane>

        <el-tab-pane label="已发货待确认列表" name="1" >

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
<!--              <el-button link type="primary" @click="deleteDelivery(scope.row)" >删除</el-button>-->
              <el-button link type="primary" @click="uReportHandle(scope.row)" >打印送货单</el-button>
              <el-button link type="primary" @click="handleFile(scope.row)" >附件下载</el-button>
              <el-button link type="primary" @click="handleRecord(scope.row)" >确认记录</el-button>
            </template>

            <template #default-status="scope">
              <div v-for="item in orderStatus">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.status">{{item.label}}</el-tag>
              </div>
            </template>

            <template #default-unit="scope">
              <div v-for="item in unitOptions">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.unit">{{item.label}}</el-tag>
              </div>
            </template>

            <template #default-units="scope">
              <div v-for="item in unitOptions">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.units">{{item.label}}</el-tag>
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

        <el-tab-pane label="已发货已确认列表" name="2" >

          <div class="global-flex flex-end" style="width: 100%;margin-bottom: 10px;">
            <el-button  plain icon="Download" @click="deliveryConfirmedExport">导出</el-button>
          </div>

          <XTable toolId="deliveryConfirmed" height="100%" class="xtable-content"
                  v-model:page-size="deliveryConfirmedQueryParams.pageSize"
                  v-model:current-page="deliveryConfirmedQueryParams.pageNum"
                  :intervalCondition="intervalCondition"
                  :page-params="{ perfect: true, total: deliveryConfirmedTableTotal }"
                  :data="deliveryConfirmedTableData"
                  :columnList="deliveryConfirmedColumnList"
                  :span-method="mergeCells"
                  ref="XTableRef"
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
              <el-button link type="primary" @click="uReportHandle(scope.row)" >打印送货单</el-button>
              <el-button link type="primary" @click="handleFile(scope.row)" >附件下载</el-button>
              <el-button link type="primary" @click="handleRecord(scope.row)" >确认记录</el-button>
            </template>

            <template #default-status="scope">
              <div v-for="item in orderStatus">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.status">{{item.label}}</el-tag>
              </div>
            </template>

            <template #default-unit="scope">
              <div v-for="item in unitOptions">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.unit">{{item.label}}</el-tag>
              </div>
            </template>

            <template #default-units="scope">
              <div v-for="item in unitOptions">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.units">{{item.label}}</el-tag>
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
        style="max-width: 1150px">

        <el-row >
          <el-col :span="8">
            <el-form-item label="客户名称" prop="createDeptName">
              <el-input v-model="receiveFromData.company" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8" style="margin-left: 10px">
            <el-form-item label="送货地址" prop="deliveryAddress">
              <el-input v-model="receiveFromData.deliveryAddress" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
          </el-col>
          <el-col :span="8">
            <el-form-item label="送货车辆">
              <el-input v-model="receiveFromData.deliveryVehicle" maxlength="40"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="装运人员" style="margin-left: 10px">
              <el-input v-model="receiveFromData.loadingStaff" maxlength="40"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
          </el-col>
          <el-col :span="8">
            <el-form-item label="物流公司">
              <el-input v-model="receiveFromData.logisticsCompany" maxlength="40"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物流单号" style="margin-left: 10px">
              <el-input v-model="receiveFromData.logisticsTrackingNumber" maxlength="40"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
          </el-col>

          <el-col :span="8">
            <el-form-item label="送货时间" prop="quantity">
              <el-date-picker
                v-model="receiveFromData.deliveryTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24" style="margin-top: 0px" v-if="isEdit">
            <el-form-item label="确认备注" prop="confirmRemark">
              <el-input show-word-limit :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" maxlength="100"  autosize  v-model="receiveFromData.confirmRemark" placeholder="请输入备注"  />
            </el-form-item>
          </el-col>

          <el-col :span="24" style="margin-top: 20px">
            <XTable :pageShow="false"
                    ref="confirmTable"
                    :data="confirmSelectInventoryList"
                    border
                    :columnList="confirmSelectInventoryColumnList"
                    max-height="450px"
                    :loading="deliveryLoading"
                    :span-method="mergeEditCells"
                    :edit-rules="validRules"
            >

              <template #default-deliveryQuantity="scope" >
                <el-input-number  style="width: 99%;"  :controls="false" :precision="scope.row.unit === '1' ? 2 : 0"   v-model="scope.row.deliveryQuantity" :disabled="scope.row.maxQuantity === undefined && scope.row.deliverSumQuantity === undefined" :min="scope.row.unit === '1' ? 0.01 : 1" :max="scope.row.maxQuantity ? scope.row.maxQuantity : scope.row.deliverSumQuantity ? scope.row.deliverSumQuantity :scope.row.oweQuantity"/>
              </template>

              <template #default-sparePartsQuantity="scope">
                <el-input-number :disabled="isEdit"   style="width: 99%;"  :controls="false" :precision="0"   v-model="scope.row.sparePartsQuantity" :min="1"  :max="999999999"/>
              </template>
              <template #default-boxCount="scope">
                <el-input-number :disabled="isEdit"  style="width: 99%;"  :controls="false" :precision="0"   v-model="scope.row.boxCount" :min="1"  :max="99999999"/>
              </template>
              <template #default-remark="scope">
                <el-input style="width: 99%;" :disabled="isEdit"  :controls="false"  v-model="scope.row.remark"  maxlength="100"/>
              </template>
              <template #default-make="scope">
                <el-button link type="primary" @click="handleDelete(scope.row)" >删除</el-button>
              </template>

              <template #default-units="scope">
                <div v-for="item in unitOptions">
                  <el-tag :type="item.type" size="small" v-if="item.value === scope.row.units">{{item.label}}</el-tag>
                </div>
              </template>

              <template #default-unit="scope">
                <div>
                  <el-select
                    v-model="scope.row.unit"
                    placeholder="请先选择单位"
                    size="small"
                    style="width: 110px"
                    @change="unitChange(scope.row)"
                  >
                    <el-option
                      v-for="item in scope.row.unitList"
                      :key="item.unit"
                      :label="item.unitName"
                      :value="item.unit"
                    />
                  </el-select>
                </div>
              </template>

              <template #default-type="scope">
                <div>
                  <el-select
                    v-model="scope.row.type"
                    placeholder="选择"
                    size="small"
                    style="width: 110px"
                    v-if="scope.row.typeList"
                    @change="typeChange(scope.row)"
                  >
                    <el-option
                      v-for="item in scope.row.typeList"
                      :key="item.id"
                      :label="item.typeName"
                      :value="item.id"
                    />
                  </el-select>
                </div>
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

  </div>
</template>

<script setup name="PurchaseMaterialDelivery">


import {
  insertDelivery,
  editOrConfirmDelivery,
  listPurchaseDetailDelivery,
  listWaitConfirmDelivery,
  viewDeliveryDetail,
  delDelivery
} from "@/api/outsource/sourceHalfProcessDelivery";
import {ref} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ConfirmEnum } from "@/api/financial/accountOrder/types";
import PurchaseDeliveryPrint from "@/components/PrintPdf/purchaseDeliveryPrint.vue";
/**报表预览 */
import { getReportUrl } from '@/utils/report';
import { getDeliveryUnit, getSourceHalfProcessOrder } from "@/api/outsource/sourceHalfProcessReceive";
import dayjs from "dayjs";
import { getSignPdf } from "@/api/financial/accountOrder";

/** 报表预览地址 */
let reportUrl = ref("");
const uReportHandle = async (row) => {
  reportDrawer.title = "外协送货单预览";
  reportDrawer.visible = true;
  if(row.status === "3"){
    getSignPdf({bizId:row.bizId,bizType:'19'}).then(res=>{
      let vo = res.data;
      if (vo !== null && vo.url) {
        reportUrl.value = '/web/viewer.html?file=' + encodeURIComponent(vo.url + '#' + vo.name);
      }else{
        // ElMessage.info("查询不到对应的签名文件");
        // reportDrawer.visible = false;
        reportUrl.value = getReportUrl() + `&_n=外协送货单&_u=file:outSourceHalfDelivery.ureport.xml&url=outsource/sourceHalfProcessDelivery/reportHeard/${row.id}&listUrl=outsource/sourceHalfProcessDelivery/reportExcel/${row.id}`;

      }
    });
  }else{
    reportUrl.value = getReportUrl() + `&_n=外协送货单&_u=file:outSourceHalfDelivery.ureport.xml&url=outsource/sourceHalfProcessDelivery/reportHeard/${row.id}&listUrl=outsource/sourceHalfProcessDelivery/reportExcel/${row.id}`;
    // reportUrl.value = reportUrl.value.replace("1,4,6","2,4,6");
  }
}
const reportDrawer = reactive({
  direction: 'left',
  visible: false,
  title: '外协送货单预览'
});

// 单位更改时
const unitChange = async (row) => {
  let id = row.id;
  let currentRowCopy = JSON.parse(JSON.stringify(row));  // 保存当前行的副本
  currentRowCopy._X_ROW_KEY = undefined;

  // 删除除了当前行以外，id相同的行
  confirmSelectInventoryList.value = confirmSelectInventoryList.value.filter(item => item.id !== id || item === row);

  let tempList = [];
  currentRowCopy.unitList.forEach((item) => {
    if (item.unit === row.unit) {
      row.typeList = item.typeList;
      row.type = item.typeList[0].id;
      typeChange(row);
      item.typeList.forEach((ite, iteIndex) => {
        if (iteIndex === 0) return;
        let rowCopy = JSON.parse(JSON.stringify(currentRowCopy));
        rowCopy.typeList = item.typeList;
        rowCopy.type = ite.id;
        typeChange(rowCopy);
        tempList.push(rowCopy);
      });
      // 重新找到当前操作行的正确位置
      const newI = confirmSelectInventoryList.value.findIndex((f) => f.id === currentRowCopy.id);
      confirmSelectInventoryList.value.splice(newI + 1, 0, ...tempList);
    }
  });
}


/*// 单位更改时
const unitChange = async (row) => {
  let id = row.id;
  const i = confirmSelectInventoryList.value.findIndex((f) => f.id === row.id)

  // 删除除了当前行以外，id相同的行
  confirmSelectInventoryList.value = confirmSelectInventoryList.value.filter((item, index) => {
    // 保留当前行或id不同的行
    return index === i || item.id !== id;
  });

  const newI = confirmSelectInventoryList.value.findIndex((f) => f.id === row.id)
  let tempList = []
  row.unitList.forEach((item) =>{
    if (item.unit === row.unit){
      row.typeList = item.typeList
      row.type = item.typeList[0].id
      typeChange(row)
      item.typeList.forEach((ite, iteIndex) => {
        if (iteIndex === 0) return;
        let rowCopy = JSON.parse(JSON.stringify(row));
        rowCopy.typeList = item.typeList;
        rowCopy.type = ite.id;
        typeChange(rowCopy);
        tempList.push(rowCopy);
      })
      confirmSelectInventoryList.value.splice(newI+1,0,...tempList);
    }
  })
}*/

// 单位更改时
// const unitChange = async (row) => {
//   row.unitList.forEach((item) =>{
//     if (item.unit === row.unit){
//       row.typeList = item.typeList
//       row.type = row.typeList[0].id
//       typeChange(row);
//     }
//   })
// }




// 单位更改时
const typeChange = async (row) => {
  row.deliveryQuantity = undefined;
  row.typeList.forEach((item) =>{
    if (item.id === row.type){
      row.typeStr = item.typeName
      row.typeSize = row.typeList.length
      if (row.addFlag === true){
        row.denominator = item.quantity / row.quantity
      }else{
        row.denominator = item.total / row.quantity
      }
      const com = ref(true);
      if (row.typeToOweQuantityMapList){
        row.typeToOweQuantityMapList.forEach( (typeToOweQuantity) =>{
          if (item.typeName === typeToOweQuantity.typeName){
            row.maxQuantity = typeToOweQuantity.oweCount;
            com.value = false;
          }
        })
      }
      if (com.value){
        row.maxQuantity = item.quantity
      }
    }
  })
}
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

const unitOptions = ref([
  {type:"info" ,value: "1", label: "大料" },
  {type:"primary" ,value: "2", label: "PNL" },
  {type:"success" ,value: "3", label: "SET" },
])

// 单据状态
const orderStatusParams = ref([
  {type:"primary" ,label: "待对方确认", value: "1"},
  {type:"success" ,label: "已确认", value: "3"},
])

/* 外协单明细待生成送货单 */
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


// 选择外协明细单
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
  { title: '外协单号', field: 'code', width: '110', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' } },
  { title: '供应商名称', field: 'supplierName', width: '150', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
  { title: '客户名称', field: 'company', width: '150', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户名称' } },
  { title: '产品编码', field: 'commodityCode', width: '110', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '加工工序', field: 'craftName', width: '70', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '加工要求', field: 'requirement', width: '100', align: 'center', filterParam: { placeholder: '请输入单位名称' }, },
  // { title: '已收数量', field: 'sendQuantity', width: '70', align: 'center', filterParam: { placeholder: '' }},
  // { title: '待收数量', field: 'waitQuantity', width: '70', align: 'center', filterParam: { placeholder: '' }},
  { title: '长', field: 'length', width: '60', align: 'center', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '宽', field: 'width', width: '60', align: 'center', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '加工数量' , sortable: true , field: 'quantity', width: '70', align: 'center' },
  { title: '外协单位', field: 'unit', width: '70', align: 'center', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '外协类型', field: 'typeName', width: '60', align: 'center', filterParam: { placeholder: '请输入单位名称' }, },
  // { title: '送货数量', field: 'deliverQuantity', width: '60', align: 'center', filterParam: { placeholder: '' }},
  { title: '送货数量备注', field: 'deliverQuantityRemark', width: '150', align: 'center', filterParam: { placeholder: '' }},
  // { title: '差欠数量', field: 'oweQuantity', width: '60', align: 'center', filterParam: { placeholder: '' }},
  { title: '差欠数量备注', field: 'oweQuantityRemark', width: '150', align: 'center', filterParam: { placeholder: '' }},
  { title: '送货地址', field: 'deliveryAddress', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入送货地址' } },
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
  purchaseOrderQueryParams.value.canDelivery = '1';//状态值1:可生成送货单
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
// 确认选中的外协明细单
const confirmSelectInventoryList = ref([]);
const purchaseOrderDeliveryRef = ref();
//确认选中的排产单表
const confirmSelectInventoryColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" ,fixed: 'left' , showOverflow: false},
  { title: '外协单号', field: 'outCode', width: '110', align: 'center',fixed: 'left' , showOverflow: false },
  { title: '产品编码', field: 'commodityCode', width: '110', align: 'center',fixed: 'left' , showOverflow: false },
  { title: '加工工序', field: 'craftName', width: '70', align: 'center' },
  // { title: '客户名称', field: 'company', width: '160', align: 'center'},
  { title: '长', field: 'length', width: '60', align: 'center', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '宽', field: 'width', width: '60', align: 'center', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '外协类型', field: 'typeName', width: '60', align: 'center', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '加工要求', field: 'requirement', width: '100', align: 'center', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '加工数量' , sortable: true , field: 'quantity', width: '80', align: 'center'},
  { title: '已发数量', field: 'deliverQuantity', width: '90', align: 'center'},
  { title: '外协单位', field: 'units', width: '70', align: 'center', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '箱数', field: 'boxCount', width: '90', align: 'center'},
  { title: '备品数量', field: 'sparePartsQuantity', width: '90', align: 'center'},
  { title: '最大送货数', field: 'maxQuantity', width: '90', align: 'center'},
  { title: '送货单位', field: 'unit', width: '120', align: 'center' ,fixed: 'right' , showOverflow: false },
  { title: '送货类型', field: 'type', width: '120', align: 'center' ,fixed: 'right' , showOverflow: false },
  { title: '本次送货数量', field: 'deliveryQuantity', width: '90', align: 'center',fixed: 'right' , showOverflow: false  },
  { title: '备注', field: 'remark', width: '116', align: 'center' ,fixed: 'right' , showOverflow: false },
  { title: '操作',  align: "center", field: "make" ,fixed: 'right' , width: '40', showOverflow: false  }
]);

/** 已选物料 删除按钮操作 */
const handleDelete = (row) =>
{
  if (row?.type){
    const id = row?.type;
    //删除已选物料
    confirmSelectInventoryList.value = confirmSelectInventoryList.value.filter(item => item.type !== id);
  }else {
    const id = row?.id;
    //删除已选物料
    confirmSelectInventoryList.value = confirmSelectInventoryList.value.filter(item => item.id !== id);
  }
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
    outSourceHalfProcessDeliveryList: [],
    status: '',
    remark: ''
  });
  confirmSelectInventoryList.value = []
};

const receiveFormRef = ref();
const confirmTable = ref();
const validRules = ref({
  unit: [
    { required: true, message: "送货单位不能为空" }
  ],
  deliveryQuantity: [
    { required: true, message: "发货数量不能为空" }
  ],
  deliveryTime: [
    { required: true, message: "送货时间不能为空" }
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
//
    receiveFromData.value.status = ConfirmEnum.WAIT_ONE_CONFIRM;
    if (isEdit.value === true) {
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
        receiveFromData.value.outSourceHalfProcessDeliveryList = confirmSelectInventoryList.value;
        // 确认
        receiveFromData.value.outSourceHalfProcessDeliveryList.forEach((item) => {
          item.typeName = item.typeStr
        })
        receiveFormRef.value.validate((valid, fields) => {
          if (!valid) {
            console.log('error submit!', fields)
          } else {
            editOrConfirmDelivery({
              data: receiveFromData.value
            })
              .then(() => {
                ElMessage({
                  type: 'success',
                  message: "提交成功",
                });
              }).finally(() => {
              resetReceiveForm();
              refreshWaitConfirmTableData();
            });
          }

        })
      }
    } else {
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
      // 新增
      receiveFromData.value.outSourceHalfProcessDeliveryList = confirmSelectInventoryList.value;
      receiveFromData.value.outSourceHalfProcessDeliveryList.forEach((item) => {
        item.orderTypeName = item.typeName
        item.typeName = item.typeStr
      })
      receiveFormRef.value.validate((valid, fields) => {

        if (!valid) {
          console.log('error submit!', fields)
        } else {
          insertDelivery({
            data: receiveFromData.value
          })
            .then(() => {
              ElMessage({
                type: 'success',
                message: "提交成功",
              });
            }).finally(() => {
            resetReceiveForm();
            refreshTableData();
          });
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

      let errMap = $table.fullValidate(true);
      console.log(errMap)

      if (errMap) {
        return;
      }
    }
    // 暂存
    receiveFromData.value.status = ConfirmEnum.WAIT_TWO_CONFIRM;
    receiveFromData.value.flag = true;
    receiveFromData.value.outSourceHalfProcessDeliveryList = confirmSelectInventoryList.value;
    receiveFromData.value.outSourceHalfProcessDeliveryList.forEach((item) => {
      item.orderTypeName = item.typeName
      item.typeName = item.typeStr
    })
    receiveFormRef.value.validate((valid, fields) => {
      if (!valid) {
        console.log('error submit!', fields)
      } else {
        editOrConfirmDelivery({
          data: receiveFromData.value
        })
          .then(() => {
            ElMessage({
              type: 'success',
              message: "提交成功",
            });
          }).finally(() => {
          resetReceiveForm();
          refreshWaitConfirmTableData();
        });
      }

    })
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
  deliveryTime: undefined,
  outSourceHalfProcessDeliveryList: [],
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
      '请勾选外协单数据',
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

    confirmSelectInventoryList.value.forEach( (item)=>{
      item.outCode = item.code;
      item.units = item.unit;
      item.unit = undefined;
      item.type = undefined;


    });

    purchaseOrderDeliveryRef.value.xTableRef.clearCheckboxRow();
    // setTimeout(() =>{
      confirmSelectInventoryList.value.forEach( (item)=> {
        item.orderId = item.id
        getDeliveryUnit(item.orderId,item.id).then(res => {
          item.unitList = res.data.unitList;
          console.log(res.data.addFlag);
          item.addFlag = res.data.addFlag;
        });

      })
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
// 选择外协明细单
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
  { title: "送货日期", sortable: true, width: "130", field: "deliveryTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  { title: '外协加工单号', field: 'outCode', width: '116', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' } },
  { title: '客户名称', field: 'company', width: '165', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户名称' } },
  { title: '产品编码', field: 'commodityCode', width: '130', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '外协数量' , field: 'quantity', width: '70', align: 'center' },
  { title: '外协单位', field: 'units', width: '80', align: 'center'},
  { title: '外协类型', field: 'orderTypeName', width: '116', align: 'center',filterType: 'input', filterParam: { placeholder: '请输入类型名称' }, },
  { title: '加工工序', field: 'craftName', width: '70', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工工序' } },
  { title: '加工要求', field: 'requirement', width: '100', align: 'center',filterType: 'input', filterParam: { placeholder: '请输入加工要求' }, },
  { title: '长', field: 'length', width: '60', align: 'center',filterType: 'input', filterParam: { placeholder: '请输入长' }, },
  { title: '宽', field: 'width', width: '60', align: 'center', filterType: 'input',filterParam: { placeholder: '请输入宽' }, },
  { title: '送货数量', sortable: true, field: 'deliveryQuantity', width: '90', align: 'center' },
  { title: '备品数量', field: 'sparePartsQuantity', width: '90', align: 'center'},
  { title: '送货单位', field: 'unit', width: '80', align: 'center',filterType: 'radioButton',
    filterParam: {placeholder: '请输入物料类别'},
    filterData: () => unitOptions.value,
    filterCustom: {label: 'label', value: 'value'}
  },
  { title: '送货类型', field: 'typeName', width: '116', align: 'center', filterType: 'input',filterParam: { placeholder: '请输入单位名称' }, },
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
  { title: '操作',  align: "center", field: "make" ,fixed: 'right' , width: '300', showOverflow: false  }
]);

/**
 * 单元格合并方法
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
  }
  // 对于不需要合并的单元格，可以返回null或不返回值
}


/**
 * 单元格合并方法
 */
const mergeEditCells = ({ row, items, seq, rowIndex, $rowIndex, _rowIndex, column, data }) => {
  if (column.property === "outCode") {
    // code的合并
    const referenceField = "outCode";

    if (rowIndex > 0 ) {
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
      while (nextRow  && nextRow[referenceField] === row[referenceField]) {
        nextRow = data[++countRowspan + $rowIndex];
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 };
      }
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
  listWaitConfirmDelivery(deliveryWaitConfirmQueryParams.value)
    .then((res) => {
      deliveryWaitConfirmTableData.value = res.rows;
      deliveryWaitConfirmTableTotal.value = res.total;
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
        proxy?.download("/outsource/sourceHalfProcessDelivery/export", {
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
  proxy?.download("/outsource/sourceHalfProcessDelivery/export", {
    ...deliveryWaitConfirmQueryParams.value
  }, `已发货待确认列表_${new Date().getTime()}.xlsx`);
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
  { title: "送货日期", sortable: true, width: "130", field: "deliveryTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  { title: '外协加工单号', field: 'outCode', width: '116', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' } },
  { title: '客户名称', field: 'company', width: '165', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户名称' } },
  { title: '产品编码', field: 'commodityCode', width: '130', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '外协数量' , field: 'quantity', width: '70', align: 'center' },
  { title: '外协单位', field: 'units', width: '80', align: 'center'},
  { title: '外协类型', field: 'orderTypeName', width: '116', align: 'center',filterType: 'input', filterParam: { placeholder: '请输入类型名称' }, },
  { title: '加工工序', field: 'craftName', width: '70', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工工序' } },
  { title: '加工要求', field: 'requirement', width: '100', align: 'center',filterType: 'input', filterParam: { placeholder: '请输入加工要求' }, },
  { title: '长', field: 'length', width: '60', align: 'center',filterType: 'input', filterParam: { placeholder: '请输入长' }, },
  { title: '宽', field: 'width', width: '60', align: 'center', filterType: 'input',filterParam: { placeholder: '请输入宽' }, },
  { title: '送货数量', sortable: true, field: 'deliveryQuantity', width: '90', align: 'center' },
  { title: '备品数量', field: 'sparePartsQuantity', width: '90', align: 'center'},
  { title: '送货单位', field: 'unit', width: '80', align: 'center',filterType: 'radioButton',
    filterParam: {placeholder: '请输入物料类别'},
    filterData: () => unitOptions.value,
    filterCustom: {label: 'label', value: 'value'}
  },
  { title: '送货类型', field: 'typeName', width: '116', align: 'center', filterType: 'input',filterParam: { placeholder: '请输入单位名称' }, },
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
  { title: '操作',  align: "center", field: "make" ,fixed: 'right' , width: '300', showOverflow: false  }
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
    confirmSelectInventoryList.value = res.data.outSourceHalfProcessDeliveryList;
    confirmSelectInventoryList.value.forEach( (item)=> {
      // getDeliveryUnit(item.orderId,item.id).then(res => {
      //   item.unitList = res.data.unitList;
        item.unitList.forEach((ite) =>{
          if (ite.unit === item.unit){
            item.typeList = ite.typeList
            item.typeList.forEach((it) =>{
              const com = ref(true);
              if (item.typeToOweQuantityMapList){
                item.typeToOweQuantityMapList.forEach( (typeToOweQuantity) =>{
                if (it.typeName === typeToOweQuantity.typeName){
                  item.maxQuantity = typeToOweQuantity.oweCount;
                  com.value = false;
                }
              })
              }
              if (com.value){
                item.maxQuantity = it.quantity
              }
            })
          }
        })
      // });
    })
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
    confirmSelectInventoryList.value = res.data.outSourceHalfProcessDeliveryList;
    confirmSelectInventoryList.value.forEach( (item)=> {
      // getDeliveryUnit(item.orderId,item.id).then(res => {
      //   item.unitList = res.data.unitList;
        item.unitList.forEach((ite) =>{
          if (ite.unit === item.unit){
            item.typeList = ite.typeList
            item.typeList.forEach((it) =>{
              const com = ref(true);
              if (item.typeToOweQuantityMapList){
                item.typeToOweQuantityMapList.forEach( (typeToOweQuantity) =>{
                  if (it.typeName === typeToOweQuantity.typeName){
                    item.typeStr = it.typeName;
                    item.maxQuantity = typeToOweQuantity.oweCount;
                    com.value = false;
                  }
                })
              }
              if (com.value){
                item.typeStr = it.typeName;
                item.maxQuantity = it.quantity
              }
            })
          }
        })
      // });
    })
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
  listWaitConfirmDelivery(deliveryConfirmedQueryParams.value)
    .then((res) => {
      deliveryConfirmedTableData.value = res.rows;
      deliveryConfirmedTableTotal.value = res.total;
      deliveryConfirmedTableLoading.value = false;
    })
    .finally(() => {
      deliveryConfirmedTableLoading.value = false;
    })
}


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
        proxy?.download("/outsource/sourceHalfProcessDelivery/export", {
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
  proxy?.download("/outsource/sourceHalfProcessDelivery/export", {
    ...deliveryConfirmedQueryParams.value
  }, `已发货已确认列表_${new Date().getTime()}.xlsx`);
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
    deliveryConfirmedTableData.value = [];
    // deliveryWaitConfirmQueryParams.value = {
    //   pageNum: 1,
    //   pageSize: 20,
    //   status: ConfirmEnum.WAIT_ONE_CONFIRM,
    //   createTimeStart: undefined,
    //   createTimeEnd: undefined
    // };
    refreshConfirmedTableData();
  }
}

/** 渲染完页面后刷新页面数据 */
onMounted(async () => {
  refreshTableData();

});

</script>
