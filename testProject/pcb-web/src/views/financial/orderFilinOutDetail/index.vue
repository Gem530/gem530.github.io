<template>
  <div class="p-2 xtable-page">

    <accountTable ref="accountTableRef" :tableColumnList="columnList" :tableColumnList2="columnList2" :type="TypeEnum.OUTSOURCING_FEILIN"
      :writeOffTitleColumnList="writeOffTitleColumnList" exportName="菲林网板对账单"
      toolId1="filinAccountToolId1" toolId2="filinAccountToolId2" toolId3="filinBorrowAccountToolId3"
      :titleLabel="titleLabel"  @handle="handle" :writeOffType="'1'"/>
    <el-drawer v-model="drawerBorrow.visible" :title="drawerBorrow.title" size="90%" draggable destroy-on-close
      modal-class="padding-drawer">
      <el-card class="ptable-card">
        <accountForm ref="accountFormRef" v-if="drawerBorrow.visible" :row="formInfo" @handleSearch="handleInOrOutQuery"
          :type="formType" :isEdit="isEdit" />

        <RawAccountTab tabToolId1="filinToolId1" tabToolId2="filinToolId2"
          ref="rawAccountTabRef" :allData="allData" :tabColumnList="tabColumnList" :footAdd="true"
          :editOtherList="tabOtherList" :tabName1="'外协菲林'" :tabName2="'外协网板'" :tabName3="true" :drawerBorrow="drawerBorrow"
          :tabColumnList2="tabColumnList2" @getCheckFunction="false" @refreshFunction="deliverSearchChange"
          :tabFormRef="accountFormRef" :isEdit="isEdit" @doSaveBack="doSave" />
      </el-card>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="drawerBorrow.visible = false">取消</el-button>
            <el-button :loading="buttonLoading" v-show="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"
              @click="handleSave">
              保存
            </el-button>
            <el-button :loading="buttonLoading" type="primary" v-show="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"
              @click="handleSubmit">
              提交
            </el-button>
            <el-button :loading="buttonLoading" type="danger" v-show="drawerBorrow.title?.includes('审核')" @click="reject"> 驳回
            </el-button>
            <el-button :loading="buttonLoading" type="primary" v-show="drawerBorrow.title?.includes('审核')" @click="examinePass">
              通过 </el-button>
          </span>
        </div>
      </template>
    </el-drawer>

  </div>
</template>

<script setup name="MaterialBorrowAccount" lang="ts">
import accountTable from '../components/accountTable.vue';
import accountForm from '../components/accountForm.vue';
import { listAccountOrderOther } from '@/api/financial/accountOrderOther';
import {
  getAccountOrder,
  addAccountOrder,
  updateAccountOrder,
  updateAccountOrderStatus,
  listAccountFilinOrder
} from '@/api/financial/accountOrder';
import { AccountOrderVO, filmOrderTypeEnum, TypeEnum, StatusEnum, statusStrings, HandleEnum } from '@/api/financial/accountOrder/types';
import { deepClone } from '@/utils';
import { parseTime } from "@/utils/ruoyi";


const titleLabel={
  labelHide2:true,
  label1:"应付金额汇总",
  label3:"折扣金额汇总",
}
const buttonLoading = ref(false);
const accountTableRef = ref();
const accountFormRef = ref();
const isEdit = ref(false);
const formType = ref(HandleEnum.ADD);
const formInfo = ref();
const tabOtherList = ref([]) // 编辑的其他金额列表
const headerForm = ref({}) // 用于保存搜索条件
//初始化编辑金额
const firstInitEditPrice = ref(true);
const rawAccountTabRef = ref();

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
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: '序号',field: "index", width: '50', type: 'seq', visible: true, align: 'center' },
  { title: '单据状态', width: '80', field: 'status', align: 'center', },
  { title: '对账月份', width: '100', field: 'accountMonth', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择对账月份', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  { title: '对账单号', width: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入对账单号' } },
  { title: '供应商编码', width: '140', field: 'supplierCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商编码' } },
  { title: '供应商名称', width: '140', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
  { title: '回款截止日期', sortable: true, width: '140', field: 'endTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账日期', sortable: true, width: '140', field: 'accountTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账金额', sortable: true, width: '140', field: 'accountPrice', align: 'center', },
  { title: '其他金额', sortable: true, width: '140', field: 'otherPrice', align: 'center', },
  { title: '折扣金额', sortable: true, width: '140', field: 'accountDiscountPrice', align: 'center', },
  { title: '应付金额', sortable: true, width: '140', field: 'payPayablePrice', align: 'center', },//receivablePrice
  { title: '回款金额', sortable: true, width: '140', field: 'payWriteOffPrice', align: 'center', },
  { title: '剩余应付金额', sortable: true, width: '140', field: 'payRemainPrice', align: 'center', },
  { title: '对账人', width: '140', field: 'accountUserName', align: 'center', filterType: 'input' },
  { title: '备注', width: '240', field: 'remark', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false },
]);
const columnList2 = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: '序号',field: "index", width: '50', type: 'seq', visible: true, align: 'center' },
  { title: '单据状态', width: '80', field: 'status', align: 'center', },
  { title: '对账月份', width: '100', field: 'accountMonth', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择对账月份', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  { title: '对账单号', width: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入对账单号' } },
  { title: '供应商编码', width: '140', field: 'supplierCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商编码' } },
  { title: '供应商名称', width: '140', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
  { title: '回款截止日期', sortable: true, width: '140', field: 'endTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账日期', sortable: true, width: '140', field: 'accountTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账金额', sortable: true, width: '140', field: 'accountPrice', align: 'center', },
  { title: '其他金额', sortable: true, width: '140', field: 'otherPrice', align: 'center', },
  { title: '折扣金额', sortable: true, width: '140', field: 'accountDiscountPrice', align: 'center', },
  { title: '应付金额', sortable: true, width: '140', field: 'payPayablePrice', align: 'center', },//receivablePrice
  { title: '回款金额', sortable: true, width: '140', field: 'payWriteOffPrice', align: 'center', },
  { title: '剩余应付金额', sortable: true, width: '140', field: 'payRemainPrice', align: 'center', },
  { title: '对账人', width: '140', field: 'accountUserName', align: 'center', filterType: 'input' },
    { title: '是否开票', width: '80', field: 'isInvoice', align: 'center', },
  { title: '开票日期', width: '80', field: 'invoiceTime', align: 'center', },
  { title: '开票金额', width: '80', field: 'invoicePrice', align: 'center', },
  { title: '发票号码', width: '80', field: 'invoiceCode', align: 'center', },
  { title: '备注', width: '240', field: 'remark', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false },
]);
const tabColumnList = ref([
  { width: '40', type: 'checkbox', align: 'center', field: "checkbox" },
  { width: '50', title: '序号', type: 'seq', align: 'center' },
  { width: '120', title: '外协单号', field: 'no', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入借料单号' } },
  { width: '90', title: '供应商编码', field: 'supplierCode', align: 'center' },
  { width: '90', title: '供应商名称', field: 'supplierName', align: 'center' },
  { width: '90', title: '排产单号', field: 'productionNo', align: 'center' },
  { width: '90', title: '产品编码', field: 'commodityNo', align: 'center' },
  { width: '90', title: '是否压膜', field: 'isCompression', align: 'center' },
  { width: '90', title: '菲林原因', field: 'reason', align: 'center' },
  { width: '90', title: '外协备注', field: 'outRemark', align: 'center' },
  { width: '90', title: '外协数量', field: 'oldQuantity', align: 'center' },
  { width: '90', title: '确认数量', field: 'inOutQuantity', align: 'center' },
  { width: '90', title: '确认面积（㎡）', field: 'inOutArea', align: 'center' },
  { width: '90', title: '菲林单价', field: 'feiLinPrice', align: 'center' },
  { width: '80', title: '核对数量', field: 'quantity', align: 'center',  editRender: {} },
  { width: '80', title: '核对面积（㎡）', field: 'area', align: 'center' },
  { width: '80', title: '核对单价', field: 'price', align: 'center', editRender: {} },
  { width: '80', title: '折扣金额', field: 'discountPrice', align: 'center', editRender: {} },
  { width: '90', title: '总金额', field: 'totalPrice', align: 'center', },
  { width: '130',title: '备注', field: 'remark', align: 'center', editRender: {} },
  { width: '130',title: '计价参数', field: 'countParam', align: 'center', editRender: {} },
]);
const tabColumnList2 = ref([
  { width: '40', type: 'checkbox', align: 'center', field: "checkbox"  },
  { width: '50', title: '序号', type: 'seq', align: 'center' },
  { width: '120', title: '外协单号', field: 'no', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入借料单号' } },
  { width: '90', title: '供应商编码', field: 'supplierCode', align: 'center' },
  { width: '90', title: '供应商名称', field: 'supplierName', align: 'center' },
  { width: '90', title: '排产单号', field: 'productionNo', align: 'center' },
  { width: '90', title: '产品编码', field: 'commodityNo', align: 'center' },
  { width: '90', title: '外协备注', field: 'outRemark', align: 'center' },
  { width: '90', title: '外协数量', field: 'oldQuantity', align: 'center' },
  { width: '90', title: '确认数量', field: 'inOutQuantity', align: 'center' },
  { width: '90', title: '网板单价', field: 'feiLinPrice', align: 'center' },
  { width: '80', title: '核对数量', field: 'quantity', align: 'center',  editRender: {} },
  { width: '80', title: '核对单价', field: 'price', align: 'center',  editRender: {} },
  { width: '80', title: '折扣金额', field: 'discountPrice', align: 'center',  editRender: {} },
  { width: '90', title: '总金额', field: 'totalPrice', align: 'center',  },
  { width: '130',title: '备注', field: 'remark', align: 'center', editRender: {} },
  { width: '130',title: '计价参数', field: 'countParam', align: 'center', editRender: {} },
]);

const writeOffTitleColumnList = ref([
  { width: '40', title: '序号', type: 'seq', align: 'center', },
  { width: '100', title: '对账单号', field: 'code', align: 'center', },
  { width: '140', title: '供应商编码', field: 'supplierCode', align: 'center', },
  { width: '140', title: '供应商', field: 'supplierName', align: 'center', },
  { width: '100', title: '对账日期', field: 'accountTime', align: 'center', },
  { width: '100', title: '对账月份', field: 'accountMonth', align: 'center', },
  { width: '100', title: '对账金额', field: 'accountPrice', align: 'center', },
  { width: '100', title: '折扣金额', field: 'accountDiscountPrice', align: 'center', },
  { width: '100', title: '应付金额', field: 'payablePrice', align: 'center', },
  { width: '100', title: '已付款金额', field: 'writeOffPrice', align: 'center', },
  { width: '120', title: '剩余应付金额', field: 'remainPayablePrice', align: 'center', },
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
  await handleInOrOutQuery({accountTime:formInfo.value.accountTime});
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
  //feilin、 wangban
  if(currentAccountOrderId.value){
    let rQueryParams2 = { pageNum: 1, pageSize: 9999,accountOrderId:currentAccountOrderId.value,onlyAccountOrder : "1",hasAccountOrder:"1" };
    rQueryParams2.type=filmOrderTypeEnum.FEI_LIN;
    let backQueryParams2 = { pageNum: 1, pageSize: 9999,accountOrderId:currentAccountOrderId.value,onlyAccountOrder : "1",hasAccountOrder:"1" };
    backQueryParams2.type = filmOrderTypeEnum.WANG_BAN;
    const res22 = await listAccountFilinOrder(rQueryParams2);
    const res33 = await listAccountFilinOrder(backQueryParams2);
    allData.value.checkedTabList1 = res22.rows;
    allData.value.checkedTabList2 = res33.rows;
  }


  rQueryParams.value.type = filmOrderTypeEnum.FEI_LIN;
  backQueryParams.value.type = filmOrderTypeEnum.WANG_BAN;
  console.log("getAddListRecord======", rQueryParams.value)
  const res2 = await listAccountFilinOrder({ ...rQueryParams.value, accountOrderId: currentAccountOrderId.value });
  const res3 = await listAccountFilinOrder({ ...backQueryParams.value, accountOrderId: currentAccountOrderId.value });
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
  addForm.type = TypeEnum.OUTSOURCING_FEILIN;
  addForm.isTax = '1';
  addForm.orderFilinOutDetailList = deepClone(addForm.detailList);
  addForm.orderFilinOutDetailList.forEach((it: any) => {
    it.feilinOrderId = it.id;
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
    addAccountOrder(addForm).then(res => {
      proxy?.$modal.msgSuccess("修改成功");
      drawerBorrow.visible = false;
      currentAccountOrderId.value = undefined;
      //table组件刷新
      getAllList();
    }).catch(err=>{
      addForm.otherOrderBoList = addForm.otherOrderBoList.map(item => {
        if (item.id.indexOf("row") > -1) {
          item.id = item.oldId;
          item.oldId = undefined;
        }
        return item;
      })
    }).finally(() => { buttonLoading.value = false; })
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
    updateAccountOrder(addForm).then(res => {
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
    }).finally(() => { buttonLoading.value = false; })
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


  }).finally(() => { buttonLoading.value = false; })
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
