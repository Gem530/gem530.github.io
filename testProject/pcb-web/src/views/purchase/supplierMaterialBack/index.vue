<template>
  <div class="p-2 xtable-page">
    <SupConfirmTab
      :dataList="dataList"
      :columnList="columnList"
      :columnList2="columnList"
      :columnList3="columnList"
      :intervalCondition="['backTime']"
      toolId1="waitBackDetails"
      toolId2="confirmBackDetails"
      toolId3="waitOtherBackDetails"
      :loading="loading"
      :total="total"
      :moduleCode="moduleCode"
      :bizType="bizType"
      @searchChange="searchChange"
      @exportExcel="exportExcel"
      @cancelAccount="cancelBack"
      @handleConfirm="handleConfirm"
      @accountPrint="uReportHandle"
    ></SupConfirmTab>

    <el-drawer title="物料退货确认单" v-model="dialogConfirm.visible" size="80%" draggable destroy-on-close>
      <el-form border label-width="100px" :model="formConfirm" ref="addForm">
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="退货供应商:" prop="clientSupplierName">
              <el-input v-model="formConfirm.clientSupplierName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="退货人:">
              <el-input v-model="formConfirm.backUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="退货日期:">
              <el-input v-model="formConfirm.backTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <XTable
        :pageShow="false"
        ref="xTableConfirm"
        size="mini"
        :data="waitConfirmData"
        :loading="waitLoading"
        height="500"
        :column-config="{ resizable: true }"
        :columnList="waitColumnList"
        border
        :edit-config="{ trigger: 'click', mode: 'row', autoClear: false, showStatus: true }"
        :edit-rules="editRules"
      >
        <template #default-quantity="scope">
          <el-input-number style="width: 99%;"  :step="0.1" :controls="false" :precision="0" v-model="scope.row.quantity" @change="totalPriceCountCheck(scope.row)"/>
        </template>
        <template #default-rawMaterialInvontoryQuantity="scope">
          <span>{{ Number(scope.row.rawMaterialInvontoryQuantity).toFixed(0) }}</span>
        </template>
        <template #default-price="scope">
          <el-input-number style="width: 99%;"  :step="0.1" :controls="false" :precision="4" v-model="scope.row.price" @change="totalPriceCountCheck(scope.row)"/>
        </template>
        <template #default-confirmRemark="scope">
          <el-input style="width: 99%;"   v-model="scope.row.confirmRemark" />
        </template>
      </XTable>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="dialogConfirm.visible = false">取消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="submitConfirmForm">确认</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <!-- 打印单据-->
    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false"
               draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>

    <!-- 签名列表 -->
    <signDialog v-if="signVisible" v-model:show="signVisible" @submit="submitSign" @cancel="cancelSign"></signDialog>
  </div>
</template>

<script setup name="PurchaseOrder" lang="ts">
import {listBackDetail, listSupplierBackDetail} from "@/api/purchase/materialCheckDetail";
import {
  cancelBackOrder,
  compareList,
  confirmMaterialBackApp, confirmMaterialBackFinish
} from "@/api/purchase/materialBackDetail";
import {ref} from "vue";
import {MaterialCheckDetailVO} from "@/api/purchase/materialCheckDetail/types";
import {VxeTablePropTypes} from "vxe-table";
import {DirectPurchase} from "@/api/purchase/materialBackDetail/types";
import {getSignPdf} from "@/api/financial/accountOrder";
import {getReportUrl} from "@/utils/report";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dataList = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);

// 文件上传类型
const moduleCode = ref('10');
const bizType = ref('16');

const columnList = ref([
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '60', },
  { title: '单据状态', field: 'confirmStatus', width: '90', align: 'center' },
  { title: '退货供应商', field: 'ownerName', align: 'center'},
  { title: '退货单号', field: 'code', width: '130', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '退货时间', field: 'backTime', width: '140', align: 'center'
    , filterType: 'intervalDate',
    filterParam: {
      startParams: { placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  {
    title: '退货人', field: 'backUserName', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '物料编码', field: 'materialCode', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '物料名称', field: 'name', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '规格参数', field: 'specification', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  { title: '退货数量', field: 'quantity', width: '70', align: 'center' },
  { title: '单位', field: 'unit', width: '70', align: 'center' },
  { title: '退货单价', field: 'price', width: '80', align: 'center' },
  { title: '退货价格', field: 'totalPrice', width: '80', align: 'center' },
  { title: '退货原因', field: 'remark', width: '160', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '310', fixed: 'right', }
]);

const waitColumnList = ref([
  { title:'序号',align:'center', field:'seq' , type: 'seq',  width: '60', },
  { title:'物料编码',field:'materialCode',align:'center',  width: '100', },
  { title:'物料名称',field:'name',align:'center'   },
  { title: '物料规格参数', field: 'specification', align: 'center' },
  { title: '单位', field: 'unit', width: '80', align: 'center' },
  { title: '退货数量', field: 'quantity', width: '100', align: 'center' },
  { title: '库存数量', field: 'rawMaterialInvontoryQuantity', width: '100', align: 'center' },
  { title: '退货单价', field: 'price', width: '100', align: 'center' },
  { title: '退货金额', field: 'totalPrice', width: '100', align: 'center' },
  { title: '退货原因', field: 'remark', width: '180', align: 'center' },
  { title: '确认备注', field: 'confirmRemark', width: '180', align: 'center' },
]);

const editRules = ref<VxeTablePropTypes.EditRules>({

  returnOfGoodsQuantity: [
    { required: true, validator: 'nullOrPositiveNumberWithTwoDecimals' }
  ],
  price: [
    { required: true, validator: 'nullOrPositiveNumberWithTwoDecimals' }
  ],
})

// 获取 搜索条件
const searchChange = async (params: any) => {
  loading.value = true;
  const res = await listSupplierBackDetail(params);
  dataList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 导出前操作 */
const exportExcel = async (queryParams:any,toolId :any) => {
        proxy?.download('system/materialBackDetail/supExport', {
          ...queryParams, tableName: toolId
        }, `物料退货订单_${new Date().getTime()}.xlsx`);
      }
/**
 * 查询按采购订单列表
 * */
const getSupplierBackDetail = async () => {
   let queryParams= {
    pageNum: 1,
    pageSize: 20,
    confirmStatus: '2',
   }
  searchChange(queryParams);
}

/** 取消单据 */
const cancelBack = async (order: any) => {
  order.status = '5';
  order.confirmStatus = '1';
  await cancelBackOrder(order).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("操作成功");
}
const buttonLoading = ref(false);

const dialogConfirm = reactive<DialogOption>({
  visible: false,
  title: ''
});

/** 确认表单 */
let formConfirm = reactive({
  clientSupplierName: undefined,
  backTime: undefined,
  backUserName: undefined,
});
const waitLoading = ref(false);

//待确认列表
const waitConfirmData = ref<MaterialCheckDetailVO[]>([]);

/** 退货确认操作 */
const handleConfirm = async (row: any) => {
  formConfirm.backUserName = row.backUserName;
  formConfirm.backTime = row.backTime;
  formConfirm.clientSupplierName = row.ownerName;
  waitLoading.value = true;
  // 根据单号查询待确认列表
  const res = await listBackDetail({code: row.code, confirmStatus: row.confirmStatus});
  waitConfirmData.value = res.data;
  dialogConfirm.visible = true;
  waitLoading.value = false;
}

/** 提交按钮 */
const submitConfirmForm = async () => {
  let flag = false;
  waitConfirmData.value.forEach((item) => {
    //判断item.applyNum>0
    if (item.quantity <= 0) {
      proxy?.$modal.msgError("退货数量必须大于0");
      flag = true;
    }
    if(item.quantity > Number(item.rawMaterialInvontoryQuantity)){
      proxy?.$modal.msgError("退货数量不能超过"+item.rawMaterialInvontoryQuantity);
      flag = true;
    }
  });
  if (flag) {
    return;
  }
  const directPurchase: DirectPurchase = {
    purchaseList: [],
  };
  directPurchase.purchaseList = waitConfirmData.value;
  // 校验是否有修改
  const res = await compareList(directPurchase.purchaseList);
  if (res.data) {
    await proxy?.$modal.confirm('您已修改单据信息，需要对方再次确认，是否确认修改？').finally(() => loading.value = false);
    buttonLoading.value = true;
    await confirmMaterialBackApp(directPurchase.purchaseList).finally(() => buttonLoading.value = false);
    proxy?.$modal.msgSuccess("操作成功");
    dialogConfirm.visible = false;
    await getSupplierBackDetail();
  } else {
    await confirmMaterialBackApp(directPurchase.purchaseList).finally(() => buttonLoading.value = false);
    querySignList();
  }

}

const signVisible = ref(false);

const querySignList = async () => {
  signVisible.value = true;
}

const submitSign = async (key : any, signType : any) => {
  proxy?.$modal.loading("加载中...");
  // 获取waitConfirmData.value的id集合
  let confirmIds = ref<number[]>([]);
  waitConfirmData.value.forEach((item) => {
    confirmIds.value.push(item.id);
  });
  // 确认提交
  await confirmMaterialBackFinish({idList: confirmIds.value, imageKey: key, signType: signType}).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("操作成功");
  dialogConfirm.visible = false;
  await getSupplierBackDetail();
}

const cancelSign = async () => {
  signVisible.value = false;
}

/**
 * 计算总金额
 */
const totalPriceCountCheck = async (row:any) => {
  if(row.quantity > Number(row.rawMaterialInvontoryQuantity)) {
    proxy?.$modal.msgError("退货数量不能超过"+row.rawMaterialInvontoryQuantity);
    return;
  }

  row.totalPrice=row.price * row.quantity
  row.totalPrice=row.totalPrice.toFixed(2);
}

let reportUrl = ref("");

const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '对账单'
});

/** 打印报表 */
const uReportHandle = async (row : any) => {
  reportDrawer.title = "采购退货单预览";
  reportDrawer.visible = true;
  if(row.confirmStatus=="3"){
    getSignPdf({bizCode:row.code}).then(res=>{
      let vo = res.data;
      if (vo.url) {
        let url = '/web/viewer.html?file=' + encodeURIComponent(vo.url + '#' + vo.name);
        reportUrl.value = url;
        return;
      }
    });
  }
  reportUrl.value = getReportUrl() + `&_n=采购退货单&_u=file:purchaseOrderBack.ureport.xml&url=system/materialBackDetail/materialBackPreview/${row.code}&listUrl=system/materialBackDetail/materialBackPreview?xyz=y&code=${row.code}&confirmStatus=${row.confirmStatus}`;
  console.log(reportUrl.value)
  reportUrl.value = reportUrl.value.replace("1,4,6","2,4,6");
}
onMounted(() => {
  getSupplierBackDetail();
});
</script>
<style scoped lang="scss">
.expand-wrapper {
  padding-left: 39px;
}
</style>
