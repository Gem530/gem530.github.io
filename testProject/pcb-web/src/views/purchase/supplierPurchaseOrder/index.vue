<template>
  <div class="p-2 xtable-page">
    <SupConfirmTab
      :dataList="dataList"
      :columnList="columnList"
      :columnList2="columnList"
      :columnList3="columnList"
      :intervalCondition="['deliverTime']"
      toolId1="waitConfirmDetails"
      toolId2="confirmDetails"
      toolId3="waitOtherConfirmDetails"
      :loading="loading"
      :total="total"
      :moduleCode="moduleCode"
      :bizType="bizType"
      @searchChange="searchChange"
      @exportExcel="exportExcel"
      @cancelAccount="cancelAccount"
      @handleConfirm="handleConfirm"
      @accountPrint="purchaseReportHandle"
    ></SupConfirmTab>

    <!-- 合同确认对话框 -->
    <el-drawer :title="dialogConfirm.title" v-model="dialogConfirm.visible" size="80%" >
      <el-form :model="form" label-width="90px" ref="materialApplyFormRef" :rules="rules" v-loading="dialogTableLoading">
        <el-row>
          <el-col :span="5">
            <el-form-item label="采购单号" prop="orderCode">
              <el-input v-model="form.orderCode" disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="供应商编码" prop="supplierCode">
              <el-input v-model="form.supplierCode" disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model="form.supplierName" disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="确认备注" prop="confirmRemark">
              <el-input v-model="form.confirmRemark" type="textarea" :rows="2"  maxlength="2000"
                        placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
 <div style="height: calc(100% - 168px);">
      <div style="flex: none;height: 50% !important;" class="ptable-card">
      <XTable :pageShow="false" ref="confirmTable" :data="confirmSelectInventoryList" border :columnList="confirmSelectInventoryColumnList"
              :loading="dialogTableLoading"
               class="ptable-content"
               style="height: 100%;"
               height="100%"
              >
        <template v-if="dialogConfirm.title === '采购合同确认'" #default-monthlyMethod="{ row }">
          <el-select v-model="row.monthlyMethod" filterable placeholder="请选择月结方式" style="width: 100%;">
            <el-option v-for="dict in monthly_method" :key="dict.value" :label="dict.label" :value="dict.label"></el-option>
          </el-select>
        </template>
        <template v-if="dialogConfirm.title === '采购合同确认'" #default-isTax="{ row }">
            <el-select placeholder=" " suffix-icon="" class="height-light font-14" v-model="row.isTax" >
              <el-option label="是" value="1"/>
              <el-option label="否" value="0"/>
            </el-select>
        </template>
        
        <template v-if="dialogConfirm.title === '采购合同确认'" #default-deliverTime="scope">
          <el-date-picker style="width: 100%;" v-model="scope.row.deliverTime" type="date" placeholder="选择日期时间"
            value-format="YYYY-MM-DD 23:59:59" format="YYYY-MM-DD" clearable />
        </template>
        <template v-if="dialogConfirm.title === '采购合同确认'" #default-quantity="scope">
          <el-input-number style="width: 99%;"  :step="0.1" :controls="false" :precision="0" v-model="scope.row.quantity" @change="calculatePrice(scope.row)"/>
        </template>
        <template v-if="dialogConfirm.title === '采购合同确认'" #default-price="scope">
          <el-input-number style="width: 99%;"  :step="0.1" :controls="false" :precision="4" v-model="scope.row.price" @change="calculatePrice(scope.row)"/>
        </template>
        <template v-if="dialogConfirm.title === '采购合同确认'" #default-make="scope">
          <el-button link type="primary" @click="handleSelectDelete(scope.row)">删除</el-button>
        </template>
      </XTable>
        </div>
      <div  style="flex: none;height: 50% !important;" class="ptable-card">
      <!-- 确认记录 -->
      <el-divider content-position="left">确认记录</el-divider>
       <XTable
        :pageShow="false"
        :loading="confirmationRecordLoading"
        height="100%"
        class="ptable-content"
        style="height: 100%;"
        :column-config="{resizable: true}"
        size="mini"
        :data="queryRecordList"
        :border="true"

        :columnList="orderRecordColumnList"
        border
      >
      <template #default-operateContent="scope">
       <div style="text-align: left">{{scope.row.operateContent}}</div>
      </template>
      </XTable>
          </div>
      </div>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="cancelConfirm">取消</el-button>
            <el-button v-if="dialogConfirm.title === '采购合同取消确认'" :loading="buttonLoading" type="danger" @click="submitCancelOrder('6')">驳回</el-button>
            <el-button v-if="dialogConfirm.title === '采购合同取消确认'" :loading="buttonLoading" type="primary" @click="submitCancelOrder('3')">确定取消</el-button>
            <el-button v-if="dialogConfirm.title === '采购合同确认'" :loading="buttonLoading" type="primary" @click="submitConfirmForm">确定</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <!-- 合同打印对话框 -->
    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false"
               draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
      <PrintPurchase />
    </el-drawer>

    <!-- 签名列表 -->
    <signDialog v-if="signVisible" v-model:show="signVisible" @submit="submitSign" @cancel="cancelSign"></signDialog>
  </div>
</template>

<script setup name="PurchaseOrder" lang="ts">
import { listSupplierOrderDetail } from "@/api/purchase/materialOrderDetail";
import {
  cancelOrder,
  compareList,
  confirmOrderApp, confirmOrderFinish, getMaterialOrderDetil,
  getMaterialOrderDetilList,
  operateRecordList
} from "@/api/purchase/materialOrder";
import {MaterialOrderForm, MaterialOrderQuery, MaterialOrderVO} from "@/api/purchase/materialOrder/types";
import {ref} from "vue";
import {MaterialOrderDetailVO} from "@/api/purchase/materialOrderDetail/types";
import {getSignPdf} from "@/api/financial/accountOrder";
import {getReportUrl} from "@/utils/report";
import {RecordVO} from "@/api/purchase/record/types";
import {queryUseModule} from "@/api/basedata/sign";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { monthly_method} = toRefs<any>(proxy?.useDict( 'monthly_method'));
const dataList = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);

// 文件上传类型
const moduleCode = ref('5');
const bizType = ref('16');

const statusList = ref([
  { label: '是', value: "2" },
  { label: '否', value: "1" },
]);

const recordVisible = ref(false);
const columnList = ref([
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '60', },
  { title: '状态', field: 'confirmStatus', width: '90', align: 'center'},
  { title: '是否结单', field: 'status', width: '70', align: 'center',filterType: 'radio', filterParam: { placeholder: '请输入状态' }, filterData: () => statusList.value },
  { title: '采购订单号', field: 'orderCode', width: '110', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '客户名称', field: 'ownerName', width: '140', align: 'center' },
  { title: '要求交期', field: 'deliverTime', width: '80', align: 'center'
    , filterType: 'intervalDate',
    filterParam: {
      startParams: { placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  { width:'80',title:'月结方式',field:'monthlyMethod', align:'center',},
  { width:'100',title:'是否含税',field:'isTax', align:'center', },
  {
    title: '收货地址', field: 'addressName', width: '300', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '物料编码', field: 'rawMaterialCode', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '物料名称', field: 'name', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '材质牌号', field: 'materialQuality', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '规格型号', field: 'specification', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '直径', field: 'diameter', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '厚度', field: 'thickness', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '板厚', field: 'boardThickness', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '铜厚', field: 'copperThickness', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '颜色', field: 'color', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '级别', field: 'level', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '长(mm)', field: 'length', width: '80', align: 'center',
    filterType: 'number', filterParam: { placeholder: '' },
  },
  {
    title: '宽(mm)', field: 'width', width: '80', align: 'center'
    , filterType: 'number', filterParam: { placeholder: '' },
  },
  {
    title: '品牌', field: 'manufacturer', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  { title: '采购数量', field: 'quantity', width: '80', align: 'center' },
  { title: '采购单价', field: 'price', width: '80', align: 'center' },
  { title: '采购金额', field: 'totalPrice', width: '80', align: 'center' },
  { title: '单位', field: 'units', width: '80', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '390', fixed: 'right', }
]);

//确认选中的物料
const confirmSelectInventoryColumnList = ref([
  { title: '序号', align: 'center', width: '50', type: 'seq' },
  { title: '物料编码', field: 'materialCode', width: '80', align: 'center', },
  { title: '物料名称', field: 'materialName',  width: '80', align: 'center', },
  { title: '材质牌号', field: 'materialQuality',  width: '60', align: 'center', },
  { title: '规格型号', field: 'specification', width: '80', align: 'center',  },
  { title: '直径', field: 'diameter', width: '80', align: 'center',  },
  { title: '厚度', field: 'thickness', width: '80', align: 'center',  },
  { title: '板厚', field: 'boardThickness', width: '60', align: 'center', },
  { title: '铜厚', field: 'copperThickness', width: '50', align: 'center', },
  { title: '颜色', field: 'color', width: '60', align: 'center', },
  { title: '级别', field: 'level', width: '60', align: 'center', },
  { title: '长(mm)', field: 'length', width: '70', align: 'center', },
  { title: '宽(mm)', field: 'width', width: '70', align: 'center', },
  { title: '品牌', field: 'manufacturer', width: '60', align: 'center', },

  { title: '月结方式', field: 'monthlyMethod', fixed:'right', width: '120', align: 'center', },
  { title: '含税', field: 'isTax', fixed:'right', width: '40', align: 'center', },
  { title: '要求交期', field: 'deliverTime', fixed:'right', width: '150', align: 'center', },
  { title: '采购数量', field: 'quantity', fixed:'right', width: '80', align: 'center' },
  { title: '单位', field: 'units', width: '80', align: 'center' },
  { title: '采购单价', field: 'price', fixed:'right', width: '80', align: 'center' },
  { title: '采购金额', field: 'totalPrice', fixed:'right', width: '80', align: 'center' },
  { title: '采购备注', field: 'applyRemark', fixed:'right', width: '80', align: 'center' },
  { title: '操作',field:'make', fixed: 'right', width:'60', align: 'center', showOverflow:false},
]);
const orderRecordColumnList = ref([
 { width:'60',title:'序号',align:'center',type:'seq'},
{ title:'所属单位',field:'ownerName',align:'center',  },
{ width:'140',title:'物料名称',field:'materialName',align:'center',  },
{ width:'80',title:'操作人',field:'createByName',align:'center',  },
{ width:'160',title:'操作时间',field:'createTime',align:'center',  },
{ title:'操作内容',field:'operateContent',align:'center',  },
{ width:'160',title:'确认备注',field:'remark',align:'center',  },
]);

// 获取 搜索条件
const searchChange = async (params: any) => {
  loading.value = true;
  const res = await listSupplierOrderDetail(params);
  dataList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
function cancelRecord() {
  recordVisible.value = false;
}

/** 导出前操作 */
const exportExcel = async (queryParams:any,toolId :any) => {
        proxy?.download('purchase/materialHandleDetail/supExport', {
          ...queryParams, tableName: toolId
        }, `采购订单_${new Date().getTime()}.xlsx`);
      }
/**
 * 查询按采购订单列表
 * */
const getSupplierOrderDetailList = async () => {
   let queryParams= {
    pageNum: 1,
    pageSize: 20,
    confirmStatus: '2',
   }
  searchChange(queryParams);
}
/** 取消单据 */
const cancelAccount = async (order: any) => {
  order.status = '8';
  order.confirmStatus = '1';
  await cancelOrder(order).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("操作成功");
}
const materialApplyFormRef = ref<ElFormInstance>();

const dialogConfirm = reactive<DialogOption>({
  visible: false,
  title: ''
});
const dialogTableLoading = ref(false);
const confirmationRecordLoading = ref(true);
const materialOrderUpdate = ref<MaterialOrderVO>();
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
  status: undefined,
  createTime: undefined,
  confirmRemark: undefined
}
const data = reactive<PageData<MaterialOrderForm, MaterialOrderQuery>>({
  form: { ...initFormData },
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
  rules: {}
});

const { form, rules } = toRefs(data);
const buttonLoading = ref(false);
const confirmSelectInventoryList = ref<MaterialOrderDetailVO[]>([]);
// 查询操作记录
const queryRecordList = ref<RecordVO[]>([]);

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
}

/** 取消确认 */
const cancelConfirm = async () => {
  dialogConfirm.visible = false
  getSupplierOrderDetailList();
}

/** 合同确认按钮操作 */
const handleConfirm = async (row?: MaterialOrderVO) => {
  reset();
  dialogTableLoading.value = true;
  dialogConfirm.visible = true;
  confirmationRecordLoading.value = true;
  queryRecordList.value = [];
  form.value.orderCode = row?.orderCode;
  form.value.supplierCode = row?.supplierCode;
  form.value.supplierName = row?.supplierName;
  form.value.id = row?.orderId;
  if (row?.orderStatus == '8') {
    dialogConfirm.title = '采购合同取消确认';
    data.rules = {
      confirmRemark: [
        {required: true, message: "确认备注不能为空", trigger: "change"}
      ],
    }
  } else {
    dialogConfirm.title = '采购合同确认';
    data.rules = {}
  }
  getMaterialOrderDetil({id:row?.orderId, confirmStatus:row?.confirmStatus}).then(res => {
    materialOrderUpdate.value = res.data;
    confirmSelectInventoryList.value = res.data.orderDetailVoList;
    form.value.confirmRemark = res.data.confirmRemark;


  });
  const res = await operateRecordList({id: row?.orderId});
      queryRecordList.value = res.rows;
      confirmationRecordLoading.value = false;

  dialogTableLoading.value = false;
}

/** 提交按钮 */
const submitConfirmForm = async () => {
  if (confirmSelectInventoryList.value.length == 0) {
    proxy?.$modal.msgError("请选择物料");
    return;
  }
  let check = false;
  let msg = "";
  confirmSelectInventoryList.value.forEach((item) => {
    //判断item.applyNum>0
    if (item.quantity <= 0) {
      check = true;
      msg="采购数量必须大于0"
      return;
    }
    if (item.price <= 0) {
      check = true;
      msg="采购单价必须大于0"
      return;
    }
    if (item.deliverTime == undefined) {
      check = true;
      msg="要求交期不能为空"
      return;
    }
  });
  if (check) {
    proxy?.$modal.msgError(msg);
    return;
  }
  materialOrderUpdate.value.confirmRemark = form.value.confirmRemark;
  materialOrderUpdate.value.orderDetailBoList = confirmSelectInventoryList.value;

  // 校验是否有修改
  const res = await compareList(materialOrderUpdate.value);
  if (res.data) {
    await proxy?.$modal.confirm('您已修改单据信息，需要对方再次确认，是否确认修改？').finally(() => loading.value = false);
    buttonLoading.value = true;
    await confirmOrderApp(materialOrderUpdate.value).finally(() => buttonLoading.value = false);
    proxy?.$modal.msgSuccess("操作成功");
    dialogConfirm.visible = false;
    await getSupplierOrderDetailList();
  } else {
    confirmId.value = form.value.id;
    // 查询是否存在默认签章
    const res = await queryUseModule({useModule: '1'});
    // 存在则自动签名
    if(res.data) {
      submitSign(res.data.key, res.data.signType);
    } else {
      querySignList();
    }
  }
}

const confirmId = ref();

const signVisible = ref(false);

const querySignList = async () => {
  signVisible.value = true;
}

const submitSign = async (key : any, signType : any) => {
  //await proxy?.$modal.confirm('是否确认提交数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading("加载中...");


  await confirmOrderFinish({id: confirmId.value, imageKey: key, signType: signType,orderDetailBoList:confirmSelectInventoryList.value}).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("操作成功");
  dialogConfirm.visible = false;
  await getSupplierOrderDetailList();
}

const cancelSign = async () => {
  signVisible.value = false;
}

const calculatePrice = async (row: any) => {
  //获得单价
  const price = row.price;
  //获得数量
  const quantity = row.quantity;
  console.log('price:',price,' ,quantity:', quantity)
  //判断单价和数量是否为空
  if (price == undefined || quantity == undefined) {
    return;
  }
  //计算总价
  row.totalPrice = price * quantity;
  row.totalPrice = row.totalPrice.toFixed(4);
};

/** 确认已选物料删除按钮操作 */
const handleSelectDelete = async (row?: MaterialOrderDetailVO) => {
  const _ids = row?.id || ids.value;
  //删除确认已选物料
  confirmSelectInventoryList.value = confirmSelectInventoryList.value.filter(item => item.id != _ids);
}

let reportUrl = ref("");

const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '对账单'
});

const purchaseReportHandle = async (row: any) => {
  reportDrawer.title = "采购订单报表预览";
  reportDrawer.visible = true;

  getSignPdf({bizCode: row.orderCode}).then(res => {
    let vo = res.data;
    if (vo.url) {
      let url = '/web/viewer.html?file=' + encodeURIComponent(vo.url + '#' + vo.name);
      reportUrl.value = url;
      return;
    }
  });

  reportUrl.value = getReportUrl() + `&_n=采购单&_u=file:procure.ureport.xml&url=purchase/materialHandle/uReportReview/${row.orderId}&listUrl=purchase/materialHandle/uReportReviewList/${row.orderId}`;
  console.log("reportUrl", reportUrl.value);
}

/** 取消确认 */
const submitCancelOrder = async (status: string) => {
  materialApplyFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (status == '6') {
        await proxy?.$modal.confirm('是否确认驳回该数据项的取消申请？');
      } else {
        await proxy?.$modal.confirm('是否确认取消该数据项？');
      }
      proxy?.$modal.loading("加载中...");
      await cancelOrder({id: form.value.id, confirmStatus: status, confirmRemark: form.value.confirmRemark}).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("操作成功");
      dialogConfirm.visible = false;
      await getSupplierOrderDetailList();
    }
  });
}

onMounted(() => {
  getSupplierOrderDetailList();
});
</script>
<style scoped lang="scss">
.expand-wrapper {
  padding-left: 39px;
}
</style>
