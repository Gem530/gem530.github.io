<template>
  <div class="p-2 xtable-page">
    <supplierAccountTable
      ref="accountTableRef"
      :tableColumnList="columnList"
      :type="TypeEnum.ALL_PROCESSING_OUTSOURCING"
      :payRecordColumnList="payRecordColumnList"
      :repayRecordColumnList="repayRecordColumnList"
      exportName="外协全制程对账单"
      toolId1="supFullAccountOutToolId1"
      toolId2="supFullAccountOutToolId2"
      toolId3="supFullAccountOutToolId3"
      :titleLabel="titleLabel"
      @handle="handle"
      @accountUReportHandle="accountUReportHandle"
      :writeOffType="'1'"
      :moduleCode="'8'"
      :bizType = "'16'"
    />
    <el-drawer v-model="drawerBorrow.visible" :title="drawerBorrow.title" size="90%" draggable destroy-on-close modal-class="padding-drawer">
      <el-card shadow="never" class="ptable-card">
        <accountForm
          ref="accountFormRef"
          v-if="drawerBorrow.visible"
          :showCurrency="true"
          :row="formInfo"
          @handleSearch="handleInOrOutQuery"
          :type="formType"
          :isEdit="isEdit"
        />

        <RawAccountTabSupplier
          ref="rawAccountTabRef"
          :allData="allData"
          :tabColumnList="tabColumnList"
          tabToolId1="supFullToolId1"
          tabToolId2="supFullToolId2"
          :editOtherList="tabOtherList"
          :tabName1="'外协送货单'"
          :tabName2="'外协退货单'"
          :tabName3="true"
          :drawerBorrow="drawerBorrow"
          :tabColumnList2="tabColumnList2"
          @getCheckFunction="false"
          @refreshFunction="deliverSearchChange"
          :tabFormRef="accountFormRef"
          :isEdit="isEdit"
          @doSaveBack="doSave"
        />
      </el-card>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="drawerBorrow.visible = false">取消</el-button>
            <el-button
              :loading="buttonLoading"
              type="danger"
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
            <el-button :loading="buttonLoading" type="danger" v-show="drawerBorrow.title?.includes('审核')" @click="reject"> 驳回 </el-button>
            <el-button :loading="buttonLoading" type="primary" v-show="drawerBorrow.title?.includes('审核')" @click="examinePass"> 通过 </el-button>
          </span>
        </div>
      </template>
    </el-drawer>
     <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false" draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>
  </div>
</template>

<script setup name="MaterialBorrowAccount" lang="ts">
import supplierAccountTable from '../components/supplierAccountTable.vue';
import accountForm from '../components/supplierAccountForm.vue';
import { listAccountOrderOther } from '@/api/financial/accountOrderOther';
import {
  getAccountOrder,
  addSupplierAccountOrder,
  updateSupplierAccountOrder,
  updateAccountOrderStatus,
  querySupFullOutRecord,
  getSignPdf
} from '@/api/financial/accountOrder';
import { AccountOrderVO, rawInOutTypeEnum, TypeEnum, StatusEnum, statusStrings, HandleEnum } from '@/api/financial/accountOrder/types';
import { deepClone } from '@/utils';
import { parseTime } from "@/utils/ruoyi";
/**对账预览 */
import { getReportUrl } from '@/utils/report';
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
  if(row.confirmStatus=="3"){
    getSignPdf({bizId:row.id,bizCode:row.code}).then(res=>{
      let vo = res.data;
      if (vo.url) {
        let url = '/web/viewer.html?file=' + encodeURIComponent(vo.url + '#' + vo.name);
        reportUrl.value = url;
        return;
      }
    });
  }
  reportUrl.value = getReportUrl() + `&_n=外协对账单&_u=file:outSourceFullAccount.ureport.xml&url=financial/accountOrder/supReview/${row.id}&listUrl=financial/accountOrder/reportDetail/${row.id}&listUrl1=financial/accountOrder/supReviewRecord/${row.id}`;
}
const titleLabel={
  labelHide3:true,
  label1:"应收金额汇总",
}
const footLabel = {
  label5:"应收总金额",
}

const accountTableRef = ref();
const accountFormRef = ref();
const isEdit = ref(false);
const showCategorySelect = ref(true);
const formType = ref(HandleEnum.ADD);
const formInfo = ref();
const tabOtherList = ref([]) // 编辑的其他金额列表
const headerForm = ref({}) // 用于保存搜索条件
//初始化编辑金额
const firstInitEditPrice = ref(true);
const rawAccountTabRef = ref();
const buttonLoading = ref(false);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const taxRate = ref(0);
//首次查询，或者重置查询条件
const firstSearch = ref(true);
//已选择记录
const inOrOutLoading = ref(true);
const allData = ref({});

//冲销defin start
//编辑和查看详情选择的对账单
const currentAccountOrderId = ref(undefined);

const columnList = ref([
  // { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: '序号', field: "index",width: '50', type: 'seq', visible: true, align: 'center' },
  { title: '单据状态', width: '80', field: 'status', align: 'center', },
  { title: '对账月份', width: '100', field: 'accountMonth', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择对账月份', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  { title: '对账单号', width: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入对账单号' } },
  { title: '客户名称', width: '140', field: 'ownerName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户名称' } },
   { title: '是否含税', width: '80', field: 'isTax', align: 'center' },
  { title: '月结方式', width: '90', field: 'monthlyMethod', align: 'center' },
  { title: '币种', width: '90', field: 'currency', align: 'center' },
  { title: '回款截止日期', sortable: true, width: '140', field: 'endTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账日期', sortable: true, width: '140', field: 'accountTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账金额', sortable: true, width: '140', field: 'accountPrice', align: 'center', },
  { title: '其他金额', sortable: true, width: '140', field: 'otherPrice', align: 'center', },
  { title: '退货金额', sortable: true, width: '140', field: 'backPrice', align: 'center', },
  { title: '应收金额', sortable: true, width: '140', field: 'repayPayablePrice', align: 'center', },//receivablePrice
  { title: '回款金额', sortable: true, width: '140', field: 'repayWriteOffPrice', align: 'center', },
  { title: '剩余应收金额', sortable: true, width: '140', field: 'repayRemainPrice', align: 'center', },
  { title: '对账人', width: '140', field: 'accountUserName', align: 'center', filterType: 'input' },
  { title: '备注', width: '240', field: 'remark', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false },
]);
const tabColumnList = ref([
  { type: 'checkbox', align: 'center', fixed: 'left', field: "checkbox", width: '50' },
  { title: "序号", type: 'seq', fixed: 'left', align: 'center', width: '60' },
  { title: '外协单号', width: '120', fixed: 'left', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' } },
  { title: '送货单号', width: '120', fixed: 'left', field: 'deliveryCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入送货单号' } },
  { title: '送货日期', width: '120', field: 'deliveryTime', align: 'center' },
  { title: '客户名称', width: '120', field: 'ownerName', align: 'center' },
  { title: '币种', width: '120', field: 'cusCurrency', align: 'center' },
  { title: '产品编码', width: '120', field: 'commodityCode', align: 'center' },
  { title: '产品名称', width: '120', field: 'commodityName', align: 'center' },

  { title: '模具费用', width: '120', field: 'mouldCost', align: 'center' },
  { title: '测试架费用', width: '120', field: 'testFrameCost', align: 'center' },
  { title: '工程费', width: '120', field: 'engineeringCost', align: 'center' },
  { title: '飞针费', width: '120', field: 'flyProbeCost', align: 'center' },
  { title: '样板费', width: '120', field: 'sampleCost', align: 'center' },
  { title: '加急费', width: '120', field: 'expeditedCost', align: 'center' },
  { title: '其他费用', width: '120', field: 'otherCost', align: 'center' },
  { title: '外协单价', width: '80', fixed: 'right', field: 'outPrice', align: 'center' },
  { title: '送货数(PCS)', width: '70', fixed: 'right', field: 'outQuantity', align: 'center' },
  { title: '核对单价', width: '80', fixed: 'right', field: 'price', align: 'center', editRender: {} },
  { title: '核对数量(PCS)', width: '70', fixed: 'right', field: 'quantity', align: 'center', editRender: {} },
  { title: '折扣金额', width: '80', fixed: 'right', field: 'discountPrice', align: 'center', editRender: {} },
  { title: '总金额', width: '90', fixed: 'right', field: 'totalPrice', align: 'center' },
]);
const tabColumnList2 = ref([
  { type: 'checkbox', align: 'center', field: "checkbox", width: '50' },
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '退货单号', width: '120', field: 'backCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入退货单号' } },
  { title: '外协单号', width: '120', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' } },
  { title: '退货日期', field: 'backTime', align: 'center' },
  { title: '责任供应商', field: 'supplierName', align: 'center' },
  { title: '币种', field: 'cusCurrency', align: 'center' },
  { title: '客户名称', field: 'ownerName', align: 'center' },

  { title: '产品编码', field: 'commodityCode', align: 'center' },
  { title: '产品名称', field: 'commodityName', align: 'center' },
  { title: '退货数量(PCS)', field: 'outQuantity', align: 'center' },
  { title: '供应商确认退货数量(PCS)', field: 'outQuantity', align: 'center' },
   { title: '核对数量(PCS)', field: 'quantity', align: 'center' , editRender: {}},
  { title: '退货单价', field: 'outPrice', align: 'center' },
  { title: '核对单价', field: 'price', align: 'center', editRender: {} },
  { title: '总金额', field: 'totalPrice', align: 'center' },
   { title: '备注', field: 'remark', align: 'center', editRender: {} },
]);

const payRecordColumnList = ref([
  { width: '50', title: '序号', type: 'seq', align: 'center', },
  { width: '120', title: '对账单号', field: 'accountOrderCode', align: 'center', },
  { width: '160', title: '供应商编码', field: 'supplierCode', align: 'center', },
  { width: '160', title: '供应商名称', field: 'supplierName', align: 'center', },
  { width: '120', title: '对账月份', field: 'accountMonth', align: 'center', },
  { width: '120', title: '对账日期', field: 'accountTime', align: 'center', },
  { width: '100', title: '应付金额', field: 'payablePrice', align: 'center', },
  { width: '100', title: '对账金额', field: 'accountPrice', align: 'center', },
  { width: '100', title: '已付金额', field: 'writeOffPrice', align: 'center', },
  { width: '100', title: '付款单号', field: 'code', align: 'center', },
  { width: '100', title: '付款日期', field: 'payDate', align: 'center', },
  { title: '备注', field: 'remark', align: 'center', },
  { width: '100', title: '操作', field: 'make', visible: true, align: 'center', },
  { width: '100', title: '状态', field: 'status', visible: false, align: 'center', },
]);
const repayRecordColumnList = ref([
  { width: '50', title: '序号', type: 'seq', align: 'center', },
  { width: '120', title: '对账单号', field: 'accountOrderCode', align: 'center', },
  { width: '160', title: '供应商编码', field: 'supplierCode', align: 'center', },
  { width: '160', title: '供应商名称', field: 'supplierName', align: 'center', },
  { width: '120', title: '对账月份', field: 'accountMonth', align: 'center', },
  { width: '120', title: '对账日期', field: 'accountTime', align: 'center', },
  { width: '100', title: '应收金额', field: 'payablePrice', align: 'center', },
  { width: '100', title: '对账金额', field: 'accountPrice', align: 'center', },
  { width: '100', title: '已收金额', field: 'writeOffPrice', align: 'center', },
  { width: '100', title: '收款单号', field: 'code', align: 'center', },
  { width: '100', title: '收款日期', field: 'payDate', align: 'center', },
  { title: '备注', field: 'remark', align: 'center', },
  { width: '100', title: '操作', field: 'make', visible: true, align: 'center', },
  { width: '100', title: '状态', field: 'status', visible: false, align: 'center', },
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
    formType.value = HandleEnum.ADD;
    isEdit.value = false;
    formInfo.value = {};
    rQueryParams.value = { pageNum: 1, pageSize: 20,accountTime:parseTime(new Date(), '{y}-{m}-{d} 23:59:59') };
    backQueryParams.value = { pageNum: 1, pageSize: 20,accountTime:parseTime(new Date(), '{y}-{m}-{d} 23:59:59') };
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
    handleUpdate(row);
  } else if (handleType == HandleEnum.INFO) {
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
  await handleInOrOutQuery({ accountTime: formInfo.value.accountTime });
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
  console.log('getAddListRecord-------------------')
  //查询类型为view
  if (isEdit.value) {
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

  if(currentAccountOrderId.value){
    let rQueryParams2 = { pageNum: 1, pageSize: 9999,accountTime:rQueryParams.value.accountTime,accountOrderId:currentAccountOrderId.value,onlyAccountOrder : "1",hasAccountOrder:"1" };
    rQueryParams2.type=rawInOutTypeEnum.MATERIAL_IN;
    rQueryParams2.isReceiveType = 1;
    let backQueryParams2 = { pageNum: 1, pageSize: 9999,accountTime:backQueryParams.value.accountTime,accountOrderId:currentAccountOrderId.value,onlyAccountOrder : "1",hasAccountOrder:"1" };
    backQueryParams2.type = rawInOutTypeEnum.BORROW_IN;
    backQueryParams2.isReceiveType = 0;
    const res22 = await querySupFullOutRecord(rQueryParams2);
    const res33 = await querySupFullOutRecord(backQueryParams2);
    allData.value.checkedTabList1 = res22.rows;
    allData.value.checkedTabList2 = res33.rows;
  }

  //收货1、 退货0
  rQueryParams.value.isReceiveType = 1;
  backQueryParams.value.isReceiveType = 0;
  console.log("getAddListRecord getAddListRecord======", rQueryParams.value)
  const res2 = await querySupFullOutRecord({ ...rQueryParams.value, accountOrderId: currentAccountOrderId.value });
  const res3 = await querySupFullOutRecord({ ...backQueryParams.value, accountOrderId: currentAccountOrderId.value });


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
  addForm.type = TypeEnum.ALL_PROCESSING_OUTSOURCING;
  //addForm.isTax = '1';
  addForm.orderFullProcessOutDetailList = deepClone(addForm.detailList);
  addForm.orderFullProcessOutDetailList.forEach((it: any) => {
    it.isTax = addForm.isTax;
    it.id = undefined;
  })

  if (addForm.id == undefined) {
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
      proxy?.$modal.msgSuccess("修改成功");
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
  updateStatus(currentAccountOrderId.value, StatusEnum.AUDITED);
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
