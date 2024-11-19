<template>
  <div class="p-2 xtable-page">
    <supplierAccountTable
      ref="accountTableRef"
      :writeOffType="writeOffType"
      :tableColumnList="columnList"
      :tableColumnList1="columnList1"
      toolId1="supPurAccountToolId1"
      toolId2="supPurAccountToolId12"
      toolId3="supPurAccountToolId13"
      exportName="采购对账单"
      :type="accountOrderType"
      @handle="handle"
      :writeOffIsSupplier="true"
      :titleLabel="titleLabel"
      @accountUReportHandle="accountUReportHandle"
      :moduleCode="'8'"
      :bizType="'16'"
      :isSupplier="true"
    />

    <el-drawer v-model="drawerBorrow.visible" :title="drawerBorrow.title" size="90%" draggable destroy-on-close modal-class="padding-drawer">
      <!-- <div class="ptable-card"> -->
      <el-card shadow="never" class="ptable-card">
        <accountForm
          ref="accountFormRef"
          v-if="drawerBorrow.visible"
          :row="formInfo"
          :showCategorySelect="showCategorySelect"
          :showCustomerSelect="true"
          :showSupplierSelect="false"
          :show-is-tax-select="true"
          :monthlyMethod="monthly_method"
          :showCurrency="true"
          @handleSearch="handleInOrOutQuery"
          :type="formType"
          :isEdit="isEdit"
        />
        <RawAccountTabSupplier
          tabToolId1="supProcureToolId1"
          tabToolId2="supProcureToolId2"
          ref="rawAccountTabRef"
          :allData="allData"
          :tabColumnList="tabColumnList"
          :editOtherList="tabOtherList"
          :tabQuantity1="2"
          :tabName1="'送货单'"
          :tabName2="'退货单'"
          :tabName3="true"
          :drawerBorrow="drawerBorrow"
          :tabColumnList2="backTabColumnList"
          @getCheckFunction="false"
          @refreshFunction="deliverSearchChange"
          :footLabel="footLabel"
          :tabFormRef="accountFormRef"
          :isEdit="isEdit"
          @doSaveBack="doSave"
        />
      </el-card>
      <!-- </div> -->
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="drawerBorrow.visible = false">取消</el-button>
            <el-button
              :loading="buttonLoading"
              v-show="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"
              @click="handleSave"
            >
              保存
            </el-button>
            <el-button
              :loading="buttonLoading"
              type="primary"
              v-show="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"
              @click="handleSubmit"
            >
              提交
            </el-button>
            <el-button :loading="buttonLoading" type="primary" v-show="drawerBorrow.title?.includes('确认')" @click="handleConfirm"> 确认 </el-button>
            <el-button :loading="buttonLoading" type="danger" v-show="drawerBorrow.title?.includes('审核')" @click="reject"> 驳回 </el-button>
            <el-button :loading="buttonLoading" type="primary" v-show="drawerBorrow.title?.includes('审核')" @click="examinePass"> 通过 </el-button>
          </span>
        </div>
      </template>
    </el-drawer>
    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false" draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>

    <!-- 签名列表 -->
    <signDialog v-if="signVisible" v-model:show="signVisible" @submit="submitSign" @cancel="cancelSign" />
  </div>
</template>

<script setup name="ProcureSupplierAccount" lang="ts">
import supplierAccountTable from '../components/supplierAccountTable.vue';
import accountForm from '../components/supplierAccountForm.vue';
import { listAccountOrderOther } from '@/api/financial/accountOrderOther';
import {
  getAccountOrder,
  addSupplierAccountOrder,
  updateSupplierAccountOrder,
  updateAccountOrderStatus,
  listSupplierDeliveryRecord,
  listSupplierBackRecord,
  getSignPdf,
  verifyStatus,
  cancelAccount
} from '@/api/financial/accountOrder';
import { AccountOrderVO, AccountOrderQuery, AccountOrderForm, TypeEnum, StatusEnum, statusStrings, HandleEnum } from '@/api/financial/accountOrder/types';
import { deepClone } from '@/utils';
import { InOutTypeEnum, typeStrings } from '@/api/basedata/rawMaterial/types';
import { parseTime } from "@/utils/ruoyi";
/**对账预览 */
import { getReportUrl } from '@/utils/report';
import {ref} from "vue";
import {insertDelivery} from "@/api/purchase/purchaseMaterialDelivery";
import {ElMessage} from "element-plus";
import {queryUseModule} from "@/api/basedata/sign";
/** 对账单按钮操作 */
let reportUrl = ref("");
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '对账单'
});

const accountUReportHandle = async (row: any) => {
  reportDrawer.title = "对账单报表预览";
  reportDrawer.visible = true;

  getSignPdf({bizId: row.id, bizCode: row.code}).then(res => {
    let vo = res.data;
    if (vo.url) {
      let url = '/web/viewer.html?file=' + encodeURIComponent(vo.url + '#' + vo.name);
      reportUrl.value = url;
      return;
    }
  });

  reportUrl.value = getReportUrl() + `&_n=采购对账单&_u=file:purchaseAccount.ureport.xml&url=financial/accountOrder/supReview/${row.id}&listUrl=financial/accountOrder/reportDetail/${row.id}&listUrl1=financial/accountOrder/supReviewRecord/${row.id}`;

}

const accountOrderType = TypeEnum.PURCHASE;
const accountTableRef = ref();
const accountFormRef = ref();
const isEdit = ref(false);
const formType = ref(HandleEnum.ADD);
const formInfo = ref();
const tabOtherList = ref([]) // 编辑的其他金额列表
const headerForm = ref({}) // 用于保存搜索条件
//初始化编辑金额
const firstInitEditPrice = ref(true);
const showCategorySelect = ref(true);
const rawAccountTabRef = ref();
const buttonLoading = ref(false);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
//含税
const { monthly_method, currency_type: currencyTypeList} = toRefs<any>(proxy?.useDict( 'monthly_method','currency_type'));
const taxRate = ref(0);
//首次查询，或者重置查询条件
const firstSearch = ref(true);
//已选择记录
const inOrOutLoading = ref(true);
const allData = ref({});
/**
* 冲销类型
* 1:付款
* 2:收款
*/
const writeOffType = ref("1");

const footLabel = {

  label5:"应收总金额",
}
const titleLabel={
  label1:"应收金额汇总",
  label2:"退货金额汇总",
  label6:"收款金额汇总",
  labelHide3:true,
}
//冲销defin start
//编辑和查看详情选择的对账单
const currentAccountOrderId = ref(undefined);

//是否存在签名文件
const existSignHistory = ref(false);
const isTaxOptions = ref([
  {value: "1", label: "是"},
  {value: "0", label: "否"}
])
const columnList = ref([
  { title: '序号',field: "index", width: '50', type: 'seq', visible: true, align: 'center' },
  { title: '单据状态', width: '80', field: 'status', align: 'center', },
  { title: '对账月份', width: '100', field: 'accountMonth', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择对账月份', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  { title: '对账单号', width: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入对账单号' } },
  { title: '客户名称', width: '140', field: 'customerName', align: 'center' },
  { title: '含税', width: '80', field: 'isTax', align: 'center',  filterType:'radioButton',  filterData:()=>isTaxOptions.value  },
  { title: '月结方式', width: '90', field: 'monthlyMethod', align: 'center', filterType: 'input' },
  { title: '币种', width: '90', field: 'currency', align: 'center' },
  { title: '回款截止日期', sortable: true, width: '140', field: 'endTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账日期', sortable: true, width: '140', field: 'accountTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账金额', sortable: true, width: '140', field: 'accountPrice', align: 'center', },
  { title: '其他金额', sortable: true, width: '140', field: 'otherPrice', align: 'center', },
  { title: '退货金额', sortable: true, width: '140', field: 'backPrice', align: 'center', },
  { title: '应收金额', sortable: true, width: '140', field: 'repayPayablePrice', align: 'center', },//receivablePrice
  { title: '收款金额', sortable: true, width: '140', field: 'repayWriteOffPrice', align: 'center', },
  { title: '剩余应收金额', sortable: true, width: '140', field: 'repayRemainPrice', align: 'center', },
  { title: '对账人', width: '140', field: 'accountUserName', align: 'center', filterType: 'input' },
  { title: '备注', width: '240', field: 'remark', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '320', fixed: 'right', showOverflow: false },
]);
const statusList = ref([
  { label: '待提交', value: "1" },
  { label: '待审核', value: "2" },
  { label: '驳回', value: "3" },
  { label: '审核通过', value: "4" },
  { label: '取消', value: "5" }
]);
const confirmStatusList = ref([
  { type:"warning", label: '待确认', value: "2" },
  { type:"primary", label: '待对方确认', value: "1" },
  { type:"success", label: '已确认', value: "3" }
]);
const columnList1 = ref([
  { title: '序号',field: "index", width: '50', type: 'seq', visible: true, align: 'center' },
  { title: '单据状态', width: '80', field: 'status', align: 'center', filterType: 'radio', filterParam: { placeholder: '请输入状态' }, filterData: () => statusList.value },
  { title: '确认状态', width: '100', field: 'confirmStatus', align: 'center', filterType: 'radio', filterParam: { placeholder: '请输入状态' }, filterData: () => confirmStatusList.value },
  { title: '对账月份', width: '100', field: 'accountMonth', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择对账月份', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  { title: '对账单号', width: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入对账单号' } },
  { title: '客户名称', width: '140', field: 'customerName', align: 'center' },
  { title: '含税', width: '80', field: 'isTax', align: 'center',  filterType:'radioButton',  filterData:()=>isTaxOptions.value  },
  { title: '月结方式', width: '90', field: 'monthlyMethod', align: 'center', filterType: 'input' },
  { title: '币种', width: '90', field: 'currency', align: 'center' },
  { title: '回款截止日期', sortable: true, width: '140', field: 'endTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账日期', sortable: true, width: '140', field: 'accountTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账金额', sortable: true, width: '140', field: 'accountPrice', align: 'center', },
  { title: '其他金额', sortable: true, width: '140', field: 'otherPrice', align: 'center', },
  { title: '退货金额', sortable: true, width: '140', field: 'backPrice', align: 'center', },
  { title: '应收金额', sortable: true, width: '140', field: 'repayPayablePrice', align: 'center', },//receivablePrice
  { title: '收款金额', sortable: true, width: '140', field: 'repayWriteOffPrice', align: 'center', },
  { title: '剩余应收金额', sortable: true, width: '140', field: 'repayRemainPrice', align: 'center', },
  { title: '对账人', width: '140', field: 'accountUserName', align: 'center', filterType: 'input' },
  { title: '备注', width: '240', field: 'remark', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '365', fixed: 'right', showOverflow: false },
]);
const tabColumnList = ref([
  { width: '40', type: 'checkbox', align: 'center', field: "checkbox", visible: true, },
  { width: '40', title: '序号', type: 'seq', align: 'center' },

  { width: '120', title: '采购单号', field: 'purchaseCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { width: '120', title: '送货单号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
   { title: '入库日期', sortable: true, width: '140', field: 'createTime', align: 'center' },
  { width: '160', title: '客户名称', field: 'ownerName', align: 'center' },
  { title: '含税', width: '80', field: 'isTax', align: 'center' },
  { title: '月结方式', width: '90', field: 'monthlyMethod', align: 'center' },
  // { width: '80', title: '是否含税', field: 'supplierIsTax', align: 'center' },
  { width: '100', title: '物料编码', field: 'materialCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { width: '120', title: '物料名称', field: 'name', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { width: '160', title: '规格参数', field: 'specificationAll', align: 'center', },
    { width: '80', title: '单位', field: 'units', align: 'center', },
  { width: '80', title: '采购单价', field: 'inOutPrice', align: 'center', },
  { width: '80', title: '采购数', field: 'detailQuantity', align: 'center', },
  { width: '80', title: '送货数', field: 'inOutQuantity', align: 'center', },

  { width: '80', title: '核对数量', field: 'quantity', align: 'center', fixed: 'right', editRender: {} },
  { width: '100', title: '核对单价', field: 'price', align: 'center', fixed: 'right', editRender: {} },
  { width: '100', title: '折扣金额', field: 'discountPrice', align: 'center', fixed: 'right', editRender: {} },
  { width: '120', title: '总金额', field: 'totalPrice', align: 'center', fixed: 'right', },
  { width: '220',title: '备注', field: 'remark', align: 'center', fixed: 'right', editRender: {} },
]);
const backTabColumnList = ref([
  { width: '40', type: 'checkbox', align: 'center', field: "checkbox", visible: true, },
  { width: '40', title: '序号', type: 'seq', align: 'center' },
  { width: '120', title: '退货单号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { width: '120', title: '采购单号', field: 'purchaseCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { title: '退货日期', sortable: true, width: '140', field: 'confirmTime', align: 'center' },
  { width: '160', title: '责任供应商', field: 'supplierName', align: 'center' },
  { width: '160', title: '客户名称', field: 'ownerName', align: 'center' },
  { width: '100', title: '物料编码', field: 'materialCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { width: '120', title: '物料名称', field: 'name', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { width: '160', title: '规格参数', field: 'specificationAll', align: 'center', },
    { width: '80', title: '单位', field: 'units', align: 'center', },
  { width: '80', title: '退货数', field: 'inOutQuantity', align: 'center', },
  { width: '120', title: '供应商退货确认数量', field: 'inOutQuantity', align: 'center', },
  { width: '80', title: '退货单价', field: 'inOutPrice', align: 'center', },
  { width: '100', title: '核对数量', field: 'quantity', align: 'center', fixed: 'right', editRender: {} },
  { width: '100', title: '核对单价', field: 'price', align: 'center', fixed: 'right', editRender: {} },

  { width: '120', title: '总金额', field: 'totalPrice', align: 'center', fixed: 'right', },
  { width: '220', title: '备注', field: 'remark', align: 'center', fixed: 'right', editRender: {} },
]);
const drawerBorrow = reactive<DialogOption>({
  visible: false,
  title: '订单审核'
});
const rQueryParams = ref({
  pageNum: 1,
  pageSize: 20
});
const backQueryParams = ref({
  pageNum: 1,
  pageSize: 20
});
const handle = async (handleType: HandleEnum, row?: AccountOrderVO) => {
  if (handleType == HandleEnum.ADD) {
    showCategorySelect.value=true;
    formType.value = HandleEnum.ADD;
    isEdit.value = false;
    formInfo.value = {};
    rQueryParams.value = { pageNum: 1, pageSize: 20 };
    backQueryParams.value = { pageNum: 1, pageSize: 20 };
    currentAccountOrderId.value = undefined;
    handleAdd()
  } else if (handleType == HandleEnum.EDIT) {

    formType.value = HandleEnum.EDIT;
    rQueryParams.value = { pageNum: 1, pageSize: 20 };
    backQueryParams.value = { pageNum: 1, pageSize: 20 };
    isEdit.value = true;
    const _id = row?.id;
    drawerBorrow.title = "修改对账单";
    const res = await getAccountOrder(_id);
    formInfo.value = res.data;
    currentAccountOrderId.value = _id;
    handleUpdate(row);
  } else if (handleType == HandleEnum.EXAMINE) {
    formType.value = HandleEnum.EXAMINE;
    rQueryParams.value = { pageNum: 1, pageSize: 20 };
    backQueryParams.value = { pageNum: 1, pageSize: 20 };
    isEdit.value = true;
    const _id = row?.id;
    drawerBorrow.title = "审核对账单";
    const res = await getAccountOrder(_id);
    formInfo.value = res.data;
    currentAccountOrderId.value = _id;
    existSignHistory.value = res.data.existSignHistory;
    handleUpdate(row);
  } else if (handleType == HandleEnum.INFO) {
    showCategorySelect.value=false;
    formType.value = HandleEnum.INFO;
    rQueryParams.value = { pageNum: 1, pageSize: 20 };
    backQueryParams.value = { pageNum: 1, pageSize: 20 };
    isEdit.value = true;
    const _id = row?.id;
    drawerBorrow.title = "对账单详情";
    const res = await getAccountOrder(_id);
    formInfo.value = res.data;
    currentAccountOrderId.value = _id;
    handleUpdate(row);
  }else if (handleType == HandleEnum.CONFIRM) {
    //验证订单是否能确认
    let hasUpdate = await verifyStatus({id:row.id,handleType:HandleEnum.CONFIRM});
    if (!hasUpdate.data) {
      ElMessage.error("数据状态已变更，请刷新页面后重试");
      //刷新列表
      getAllList();
      return;
    }
    formType.value = HandleEnum.EDIT;
    rQueryParams.value = { pageNum: 1, pageSize: 20 };
    backQueryParams.value = { pageNum: 1, pageSize: 20 };
    isEdit.value = true;
    const _id = row?.id;
    drawerBorrow.title = "确认对账单";
    const res = await getAccountOrder(_id);
    formInfo.value = res.data;
    currentAccountOrderId.value = _id;
    handleUpdate(row);
  }else if (handleType == HandleEnum.CONFIRM_CANCEL) {
          //定义Order
  let order = {
    id: '',
    status: '',
    confirmStatus: ''
  };
  order.id = row.id;
  order.status = '5';
  order.confirmStatus = '3';

    let hasUpdate = await verifyStatus({id:row.id,handleType:HandleEnum.CONFIRM_CANCEL});
    if (!hasUpdate.data) {
      ElMessage.error("数据状态已变更，请刷新页面后重试");
      //刷新列表
      getAllList();
      return;
    }
     let isClose=false;
    //  await proxy?.$modal.confirm('是否确认取消对账单编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
      await  ElMessageBox.confirm(
      '是否确认取消单号为"' + row.code + '"的数据项？',
      '提示',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: '驳回取消',
        cancelButtonText: '确认取消',
        dangerouslyUseHTMLString: true,
        confirmButtonClass: 'el-button--danger',
        cancelButtonClass: 'el-button--primary',
        type: 'warning',
      }
    ).then( async () => {
        order.status = '4';
        order.confirmStatus = '6';
        console.log('驳回取消');


    }).catch((action: any) => {
      if(action === 'cancel'){
          order.status = '5';
          order.confirmStatus = '3';
        console.log('cancel');

      }else if(action === 'close'){
        console.log('close');
        isClose=true;
      }
    });

    if(isClose){
      return;
    }

  await cancelAccount(order);
  proxy?.$modal.msgSuccess("修改成功");
  //刷新列表
  getAllList();


  }
}


const handleAdd = async () => {
  drawerBorrow.title = "添加对账单";
  drawerBorrow.visible = true;
  allData.value.inOrOutLoading = true;
  await handleInOrOutQuery({accountTime:parseTime(new Date(), '{y}-{m}-{d} 23:59:59')})
  allData.value.inOrOutLoading = false;
}

const handleUpdate = async () => {
  drawerBorrow.visible = true;
  allData.value.inOrOutLoading = true;
  await handleInOrOutQuery({accountTime:formInfo.value.accountTime,monthlyMethod:formInfo.value.monthlyMethod,isTax:formInfo.value.isTax});
  allData.value.inOrOutLoading = false;
}

// tab页签内合并搜索 **************start
const deliverSearchChange = async() => {

  allData.value.inOrOutLoading = true;
  console.log("deliverSearchChange======", rawAccountTabRef.value.tabQueryParams)
  rQueryParams.value = JSON.parse(JSON.stringify(rawAccountTabRef.value.tabQueryParams));
  rQueryParams.value = { ...rQueryParams.value, ...headerForm.value }

  backQueryParams.value = JSON.parse(JSON.stringify(rawAccountTabRef.value.tabQueryParams2));
  backQueryParams.value = { ...backQueryParams.value, ...headerForm.value }
  await getAddListRecord();

  allData.value.inOrOutLoading = false;
}


/** 查询tab记录 */
const getAddListRecord = async () => {
  //查询类型为view
  if (isEdit.value) {
    allData.value.accountOrderId = currentAccountOrderId.value;
    let otherQueryParams = { accountOrderId: currentAccountOrderId.value };
    listAccountOrderOther(otherQueryParams).then(res => {
      tabOtherList.value = res.data;
    });
    backQueryParams.value.supplierId = formInfo.value.supplierId;
    backQueryParams.value.hasAccountOrder = "1";
    rQueryParams.value.hasAccountOrder = "1";
    rQueryParams.value.supplierId = formInfo.value.supplierId;
    //审核不需要未对账数据
    if (drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')) {
      rQueryParams.value.onlyAccountOrder = "1";
      backQueryParams.value.onlyAccountOrder = "1";
    }
  } else {
    backQueryParams.value.hasAccountOrder = "0";
    rQueryParams.value.hasAccountOrder = "0";
  }
  //采购入库、 库存退货
   if(currentAccountOrderId.value){
    let rQueryParams2 = { pageNum: 1, pageSize: 9999,accountTime:rQueryParams.value.accountTime,accountOrderId:currentAccountOrderId.value,onlyAccountOrder : "1",hasAccountOrder:"1" };
    rQueryParams2.type=InOutTypeEnum.PURCHASE_IN;
    rQueryParams2.supplierQuery='1';

    let backQueryParams2 = { pageNum: 1, pageSize: 9999,accountTime:backQueryParams.value.accountTime,accountOrderId:currentAccountOrderId.value,onlyAccountOrder : "1",hasAccountOrder:"1" };
    backQueryParams2.type = InOutTypeEnum.STOCK_RETURN;
     backQueryParams2.supplierQuery='1';
    const res22 = await listSupplierDeliveryRecord(rQueryParams2);
    const res33 = await listSupplierBackRecord(backQueryParams2);
    allData.value.checkedTabList1 = res22.rows;
    allData.value.checkedTabList2 = res33.rows;
  }

  rQueryParams.value.type = InOutTypeEnum.PURCHASE_IN;
  backQueryParams.value.type = InOutTypeEnum.STOCK_RETURN;
  rQueryParams.value.supplierQuery='1';
  backQueryParams.value.supplierQuery='1';
  console.log("getAddListRecord getAddListRecord======", rQueryParams.value)
  const res2 = await listSupplierDeliveryRecord({ ...rQueryParams.value, accountOrderId: currentAccountOrderId.value });
  const res3 = await listSupplierBackRecord({ ...backQueryParams.value, accountOrderId: currentAccountOrderId.value });
  allData.value.tabList1 = res2.rows;
  allData.value.tabTotal1 = res2.total;
  allData.value.tabList2 = res3.rows;
  allData.value.tabTotal2 = res3.total;

  //编辑状态下，判断不是首次初始化金额
  if (isEdit.value) {
    firstInitEditPrice.value = false;
  }
  inOrOutLoading.value = false
}

const handleInOrOutQuery = async (_headerForm: any) => {
  firstSearch.value = false;
  if (rawAccountTabRef.value) {
    rawAccountTabRef.value.resetInfo();
    rQueryParams.value = JSON.parse(JSON.stringify(rawAccountTabRef.value.tabQueryParams));
    backQueryParams.value = JSON.parse(JSON.stringify(rawAccountTabRef.value.tabQueryParams2));
  }

  headerForm.value = _headerForm || {};
  rQueryParams.value = { ...rQueryParams.value, ..._headerForm }
  backQueryParams.value = { ...backQueryParams.value, ..._headerForm }
  console.log("==============rQueryParams.value", rQueryParams.value, backQueryParams.value);
  await getAddListRecord();
}

const handleSubmit = () => {
  let tempForm = accountFormRef.value.form;
  tempForm.status = StatusEnum.BE_AUDITED;
  rawAccountTabRef.value.doSave(tempForm);
}

const handleSave = () => {
  let tempForm = accountFormRef.value.form;
  if (!tempForm.status || tempForm.status != StatusEnum.REJECTED) {
    tempForm.status = StatusEnum.BE_SUBMITTED;
  }
  rawAccountTabRef.value.doSave(tempForm);
}
const handleConfirm = () => {
  let tempForm = accountFormRef.value.form;
  tempForm.isConfirm='1';
  rawAccountTabRef.value.doSave(tempForm);
}

const doSave = async (resForm: any) => {
  // todo 保存前的验证
   const vad = await accountFormRef.value.validateForm();
   if (!vad) {
    console.log("主单校验不通过");
    return;
  }
  //得到供应商id
  let addForm = deepClone(resForm);
  //类型
  addForm.type = accountOrderType;
  //addForm.isTax = '1';
  addForm.purchaseDetailBoList = addForm.detailList;
  addForm.purchaseDetailBoList.forEach((it: any) => {
    it.purchaseMaterialOrderDetailId = it.bizId;
    it.rawMaterialInOutRecordId = it.id;
    it.id = undefined;
  })

  if (addForm.id == undefined) {
    // addForm.status = StatusEnum.BE_SUBMITTED;
    if (addForm.otherOrderBoList && addForm.otherOrderBoList.length > 0) {
      addForm.otherOrderBoList = addForm.otherOrderBoList.map((item: any) => {
        item.oldId = item.id;
        item.id = undefined;
        return item;
      })
    }

    console.log(" doSave inOutForm.add", addForm);
    buttonLoading.value = true;
    addSupplierAccountOrder(addForm).then(res => {
     proxy?.$modal.msgSuccess("操作成功");
      drawerBorrow.visible = false;
      currentAccountOrderId.value = undefined;
      //table组件刷新
      getAllList();
    }).catch(err => {
      addForm.otherOrderBoList = addForm.otherOrderBoList.map(item => {
        if (item.id.indexOf("row") > -1) {
          item.id = item.oldId;
          item.oldId = undefined;
        }
        return item;
      })
    }).finally(() => { buttonLoading.value = false; });
  } else {
    if (addForm.otherOrderBoList && addForm.otherOrderBoList.length > 0) {
      addForm.otherOrderBoList = addForm.otherOrderBoList.map(item => {
        if (item.id.indexOf("row") > -1) {
          item.oldId = item.id;
          item.id = undefined;
        }
        return item;
      })
    }
    console.log(" doSave inOutForm.update", addForm);
    // addForm.status = StatusEnum.BE_AUDITED;
    buttonLoading.value = true;
    updateSupplierAccountOrder(addForm).then(res => {
      proxy?.$modal.msgSuccess("修改成功");
      drawerBorrow.visible = false;
      currentAccountOrderId.value = undefined;
      getAllList();
    }).catch(err => {
      addForm.otherOrderBoList = addForm.otherOrderBoList.map(item => {
        if (item.id.indexOf("row") > -1) {
          item.id = item.oldId;
          item.oldId = undefined;
        }
        return item;
      })
    }).finally(() => { buttonLoading.value = false; });
  }
}

/************aduit 审核操作 start ***********/
/** 审核驳回 */
const reject = async () => {
  updateStatus(currentAccountOrderId.value, StatusEnum.REJECTED);
}
/** 审核通过 */
const examinePass = async () => {
  // 如果没签过名去签名页面
  if(!existSignHistory.value) {
    // 查询是否存在默认签章
    const res = await queryUseModule({useModule: '4'});
    // 存在则自动签名
    if(res.data) {
      submitSign(res.data.key, res.data.signType);
    } else {
      signVisible.value = true;
    }
  } else {
    // 否则走原逻辑
    updateStatus(currentAccountOrderId.value, StatusEnum.AUDITED);
  }

}
const updateStatus = (id: any, status: string) => {
  buttonLoading.value = true;
  updateAccountOrderStatus({ id, status }).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
    getAllList();
    drawerBorrow.visible = false;
    currentAccountOrderId.value = undefined;


  }).finally(() => { buttonLoading.value = false; });
}

const getAllList = () => {
  accountTableRef.value?.radioTableHandle();
}

/************aduit 审核操作 end ***********/
const getTaxRate = async () => {
  const res = await proxy?.getConfigKey("taxRate");
  if (res != undefined) {
    taxRate.value = Number(res.data);
    console.log(taxRate.value)
  }
}

const signVisible = ref(false);

const submitSign = async (key : any, signType : any) => {
  proxy?.$modal.loading("加载中...");
  updateAccountOrderStatus({ id:currentAccountOrderId.value, status:StatusEnum.AUDITED, imageKey: key, signType: signType }).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
    getAllList();
    drawerBorrow.visible = false;
    currentAccountOrderId.value = undefined;
  }).finally(() => {proxy?.$modal.closeLoading()});
}

const cancelSign = async () => {
  signVisible.value = false;
}

onMounted(() => {
  getTaxRate();
});
</script>
<style lang="scss" scoped>
.el-drawer__header {
  margin-bottom: 0px !important;
}

.totalTitle {
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


:deep(.padding-drawer) {
  .el-drawer__header {
    margin-bottom: 5px;
  }

  .el-drawer__body {
    padding-top: 10px;
    padding-bottom: 10px;

    .drawer-order-form {
      .el-form-item {
        margin-bottom: 0;
      }
    }

    .el-card {
      .el-card__body {
        padding: 5px !important;
      }
    }
  }

  .el-drawer__footer {
    padding-bottom: 10px;
  }
}

:deep(.table-height-rows) {
  background: rgb(217, 236, 255);
}
</style>
