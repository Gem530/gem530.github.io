<template>
  <div class="p-2 xtable-page">
    <SupConfirmTab
      :dataList="dataList"
      :columnList="columnList"
      :columnList2="columnListConfirm"
      :columnList3="columnList"
      :intervalCondition="['accountMonth', 'endTime', 'accountTime', 'createTime']"
      toolId1="supWaitConfirmAccount"
      toolId2="supConfirmAccount"
      toolId3="supWaitOtherConfirmAccount"
      :loading="loading"
      :total="total"
      :moduleCode="moduleCode"
      :bizType="bizType"
      @searchChange="searchChange"
      @exportExcel="exportExcel"
      @accountPrint="accountPrint"
      @handleConfirm="handleConfirm"
      @accountInfo="accountInfo"
      @cancelAccount="cancelAccountOrder"
      :statusSwitch="true"
      :findType="2"
    ></SupConfirmTab>

    <el-dialog v-model="dialogChangeAddressAll.visible" :title="dialogChangeAddressAll.title" width="60%" destroy-on-close draggable>
      <XTable
        ref="waitHandleTableRef"
        :pageShow="false"
        height="250"
        :column-config="{resizable: true}"
        size="mini"
        :data="accountOrderDeductionList"
        :border="true"
        :columnList="deductionColumnList"
        @checkbox-change="selectAllChangeEvent"
        @checkbox-all="selectAllChangeEvent"
        border
      >
        <template #default-type="scope">
          {{ scope.row.type=='2'?'供应商扣款':'客户扣款'}}
        </template>
      </XTable>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="dialogChangeAddressAll.visible = false">取消</el-button>
            <el-button type="primary" @click="changHandleDeductionConfirm" :disabled="multiple"> 确定 </el-button>
          </span>
        </div>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerBorrow.visible" :title="drawerBorrow.title" size="90%" draggable destroy-on-close modal-class="padding-drawer">
      <!-- <div class="ptable-card"> -->
      <el-card shadow="never" class="ptable-card">
        <accountForm
          ref="accountFormRef"
          v-if="drawerBorrow.visible"
          :row="formInfo"
          :showCategorySelect="showCategorySelect"
          :showCurrency="true"
          @handleSearch="handleInOrOutQuery"
          :type="formType"
          :isEdit="isEdit"
          :showSupplierSelect="false"
          :showSupplierStr="true"
          :show-is-tax-select="true"
          :monthlyMethod="monthly_method"
        />
        <RawAccountTabSupplier
          tabToolId1="supConfirmProcureToolId1"
          tabToolId2="supConfirmProcureToolId2"
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
          :row="formInfo"
          :deduction="deduction"
          @doSaveBack="doSave"
        />
      </el-card>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="drawerBorrow.visible = false">取消</el-button>
            <el-button :loading="buttonLoading" v-if="deduction" type="primary" @click="relatedDeduction"> 确认 </el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <!-- 打印对话框 -->
    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false" draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>
    <!-- 签名列表 -->
    <signDialog v-if="signVisible" v-model:show="signVisible" @submit="submitSign" @cancel="cancelSign"></signDialog>

    <!-- <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <p>是否确认取消单号为"{{ row.code }}"的数据项？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCancel">确认取消</el-button>
        <el-button type="danger" @click="rejectCancel">驳回取消</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script setup name="ProcureAccountConfirm" lang="ts">
import {getSignPdf, listAccountConfirmList,accountRelatedDeduction,cancelAccount,getAccountOrder,listSupplierDeliveryRecord,listSupplierBackRecord,compareList,confirmAccountFinish,verifyStatus} from '@/api/financial/accountOrder';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
import {  TypeEnum,HandleEnum } from '@/api/financial/accountOrder/types';
import {getReportUrl} from "@/utils/report";
import { ElMessage, ElMessageBox } from "element-plus";
import { deepClone } from '@/utils';
import {listAccountOrderSupplierDeduction } from '@/api/financial/AccountOrderDeduction';
import { listAccountOrderOther } from '@/api/financial/accountOrderOther';
import { InOutTypeEnum, typeStrings } from '@/api/basedata/rawMaterial/types';
import { VxeTableEvents } from 'vxe-table'
import accountForm from '../components/supplierAccountForm.vue';
import {queryUseModule} from "@/api/basedata/sign";
//含税
const { monthly_method, currency_type: currencyTypeList} = toRefs<any>(proxy?.useDict( 'monthly_method','currency_type'));
const dataList = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const waitHandleTableRef = ref()
const isTaxOptions = ref([
  {value: "1", label: "是"},
  {value: "0", label: "否"}
])
//扣款金额记录
const accountOrderDeductionList = ref<any[]>([]);


// 文件上传类型
const moduleCode = ref('8');
const bizType = ref('15');

const recordVisible = ref(false);
const columnList = ref([
  //{ type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: '序号',field: "index", width: '50', type: 'seq', visible: true, align: 'center' },
  { title: '单据状态', width: '80', field: 'confirmStatus', align: 'center', },
  { title: '对账月份', width: '100', field: 'accountMonth', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  { title: '对账单号', width: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '供应商编码', width: '140', field: 'supplierCode', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '供应商名称', width: '140', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '含税', width: '80', field: 'isTax', align: 'center',  filterType:'radioButton',  filterData:()=>isTaxOptions.value },
  { title: '月结方式', width: '90', field: 'monthlyMethod', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '币种', width: '90', field: 'currency', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '回款截止日期', sortable: true, width: '140', field: 'endTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账日期', sortable: true, width: '140', field: 'accountTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账金额', sortable: true, width: '140', field: 'accountPrice', align: 'center', },
  { title: '其他金额', sortable: true, width: '140', field: 'otherPrice', align: 'center', },
  { title: '退货金额', sortable: true, width: '140', field: 'backPrice', align: 'center', },
  { title: '应付金额', sortable: true, width: '140', field: 'payPayablePrice', align: 'center', },//receivablePrice
  { title: '付款金额', sortable: true, width: '140', field: 'payWriteOffPrice', align: 'center', },
  { title: '剩余应付金额', sortable: true, width: '140', field: 'payRemainPrice', align: 'center', },
  { title: '对账人', width: '140', field: 'accountUserName', align: 'center', filterType: 'input' },
  { title: '备注', width: '240', field: 'remark', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '390', fixed: 'right', }
]);
const columnListConfirm = ref([
  //{ type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: '序号',field: "index", width: '50', type: 'seq', visible: true, align: 'center' },
  { title: '单据状态', width: '80', field: 'confirmStatus', align: 'center', },
  { title: '对账月份', width: '100', field: 'accountMonth', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  { title: '对账单号', width: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '供应商编码', width: '140', field: 'supplierCode', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '供应商名称', width: '140', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '含税', width: '80', field: 'isTax', align: 'center',  filterType:'radioButton',  filterData:()=>isTaxOptions.value },
  { title: '月结方式', width: '90', field: 'monthlyMethod', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '币种', width: '90', field: 'currency', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '回款截止日期', sortable: true, width: '140', field: 'endTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账日期', sortable: true, width: '140', field: 'accountTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '对账金额', sortable: true, width: '140', field: 'accountPrice', align: 'center', },
  { title: '其他金额', sortable: true, width: '140', field: 'otherPrice', align: 'center', },
  { title: '退货金额', sortable: true, width: '140', field: 'backPrice', align: 'center', },
  { title: '应付金额', sortable: true, width: '140', field: 'payPayablePrice', align: 'center', },//receivablePrice
  { title: '付款金额', sortable: true, width: '140', field: 'payWriteOffPrice', align: 'center', },
  { title: '剩余应付金额', sortable: true, width: '140', field: 'payRemainPrice', align: 'center', },
  { title: '对账人', width: '140', field: 'accountUserName', align: 'center', filterType: 'input' },
  { title: '是否开票', width: '80', field: 'isInvoice', align: 'center', },
  { title: '开票日期', width: '80', field: 'invoiceTime', align: 'center', },
  { title: '开票金额', width: '80', field: 'invoicePrice', align: 'center', },
  { title: '发票号码', width: '80', field: 'invoiceCode', align: 'center', },
  { title: '备注', width: '240', field: 'remark', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '370', fixed: 'right', }
]);
const backTabColumnList = ref([
  { width: '40', type: 'checkbox', align: 'center', field: "checkbox", visible: true, },
  { width: '40', title: '序号', type: 'seq', align: 'center' },
  { width: '120', title: '退货单号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { width: '120', title: '采购单号', field: 'purchaseCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { title: '退货日期', sortable: true, width: '140', field: 'confirmTime', align: 'center' },
  { width: '160', title: '责任供应商', field: 'supplierName', align: 'center' },
  // { width: '160', title: '客户名称', field: 'ownerName', align: 'center' },
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
const tabColumnList = ref([
  { width: '40', type: 'checkbox', align: 'center', field: "checkbox", visible: true, },
  { width: '40', title: '序号', type: 'seq', align: 'center' },

  { width: '120', title: '采购单号', field: 'purchaseCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { width: '120', title: '送货单号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
   { title: '入库日期', sortable: true, width: '140', field: 'createTime', align: 'center' },
  { title: '含税', width: '80', field: 'isTax', align: 'center' },
  { title: '月结方式', width: '90', field: 'monthlyMethod', align: 'center' },
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
const deductionColumnList = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: '序号',field: "index", width: '40', type: 'seq', visible: true, align: 'center' },
  { title: '扣款单号', width: '100', field: 'code', align: 'center', },
  { title: '扣款类型', width: '80', field: 'type', align: 'center', },
  { title: '创建人', width: '60', field: 'createByName', align: 'center', },
  { title: '创建时间', width: '120', field: 'createTime', align: 'center', },
  { title: '扣款日期', width: '120', field: 'deductionTime', align: 'center', },
  { title: '扣款金额', width: '120', field: 'price', align: 'center', },
  { title: '备注',  field: 'remark', align: 'center', },
]);

const dialogChangeAddressAll = reactive<DialogOption>({
  visible: false,
  title: '关联扣款金额'
});
//勾选按钮
const multiple = ref(true);
  //是否有勾选
const selectRecords = ref(false);

//扣款单明细列表
const HandleDetailList = ref<any[]>([]);
const selectAllChangeEvent: VxeTableEvents.CheckboxAll<any> = () => {
  const $table = waitHandleTableRef.value.xTableRef
  if ($table) {
    const selectRecords = $table.getCheckboxRecords();
    HandleDetailList.value = selectRecords.map(item => item);
  }
   multiple.value = !HandleDetailList.value.length && selectRecords.value;
  // disableWaitHandleCheck();
}
/** 批量修改收货地址-确认 */
const changHandleDeductionConfirm = async () => {
  //判断HandleDetailList.value

  let ids = HandleDetailList.value.map(item => item.id);
  console.log(ids);
  await accountRelatedDeduction({id: accountOrderDeductionId.value, deductionIdList: ids}).then(res => {
      ElMessage.success('操作成功');
      dialogChangeAddressAll.visible = false;
  }).catch(() => {
  });
  //刷新
  getSupplierOrderDetailList();
  HandleDetailList.value = [];
  multiple.value = true;
  dialogChangeAddressAll.visible = false
}

// 获取 搜索条件
const searchChange = async (params: any) => {
  loading.value = true;
  params.type = TypeEnum.PURCHASE;
  const res = await listAccountConfirmList(params);
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
        proxy?.download('financial/accountOrder/confirmListExport', {
          ...queryParams, tableName: toolId,type: TypeEnum.PURCHASE
        }, `采购对账确认_${new Date().getTime()}.xlsx`);
      }
/**
 * 查询按采购订单列表
 * */
const getSupplierOrderDetailList = async () => {
   let queryParams= {
    pageNum: 1,
    pageSize: 20,
    confirmStatus: '1',
    type: TypeEnum.PURCHASE,
   }
  searchChange(queryParams);
}

let reportUrl = ref("");
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '对账单'
});

/** 对账单打印 */
const accountPrint = async (row: any) => {
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
const accountOrderDeductionId = ref<any>();





/** 关联扣款确认 */
const relatedDeduction = async () => {
  let tempForm = accountFormRef.value.form;
  rawAccountTabRef.value.doSave(tempForm);
}

const accountOrderType = TypeEnum.PURCHASE;
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
if (addForm.otherOrderBoList && addForm.otherOrderBoList.length > 0) {
      addForm.otherOrderBoList = addForm.otherOrderBoList.map(item => {
        if (item.id.indexOf("row") > -1) {
          item.oldId = item.id;
          item.id = undefined;
        }
        return item;
      })
    }
    buttonLoading.value = true;
    // 先判断是否有修改
    let hasUpdate = await compareList(addForm);
    if (hasUpdate.data) {
       await accountRelatedDeduction(addForm).then(res => {
      ElMessage.success('操作成功');
      drawerBorrow.visible = false;
      currentAccountOrderId.value = undefined;
      getSupplierOrderDetailList();
      }).catch(() => {
        addForm.otherOrderBoList = addForm.otherOrderBoList.map(item => {
            if (item.id.indexOf("row") > -1) {
              item.id = item.oldId;
              item.oldId = undefined;
            }
            return item;
          })
        }).finally(() => { buttonLoading.value = false; });
    } else {
      buttonLoading.value = false;
      // 查询是否存在默认签章
      const res = await queryUseModule({useModule: '4'});
      // 存在则自动签名
      if(res.data) {
        submitSign(res.data.key, res.data.signType);
      } else {
        querySignList();
      }
    }
}

/**===============签名列表========= */
//签名弹窗开关
const signVisible = ref(false);

//打开签名列表
const querySignList = async () => {
    signVisible.value = true;
}
//确认签名
const submitSign = async (key:any, signType:any) => {
  proxy?.$modal.loading("加载中...");
  // 签字提交
  confirmAccountFinish({
      imageKey: key,
      signType: signType,
      id: currentAccountOrderId.value
  }).then(res => {
    //关闭抽屉
    drawerBorrow.visible = false;
    //刷新列表
    getSupplierOrderDetailList();
    //提示签名成功，询问是否需要打印
    ElMessageBox.confirm('签名成功，是否打印对账单？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      formInfo.value.confirmStatus='3';
      accountPrint(formInfo.value);
    }).catch(() => {
    });

  }).finally(() => proxy?.$modal.closeLoading());
}
//取消签名
const cancelSign = async () => {
    buttonLoading.value = false;
}
/**======================================= */

/** 取消单据 */
const cancelAccountOrder = async (order: any) => {
  order.status = '5';
  order.confirmStatus = '2';
  await cancelAccount(order).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("操作成功");
}
const showCategorySelect = ref(true);
const formType = ref(HandleEnum.INFO);
const rQueryParams = ref({
  pageNum: 1,
  pageSize: 20
});
const backQueryParams = ref({
  pageNum: 1,
  pageSize: 20
});
const isEdit = ref(false);
const deduction = ref(false);
const drawerBorrow = reactive<DialogOption>({
  visible: false,
  title: '对账单确认'
});
const formInfo = ref();
//编辑和查看详情选择的对账单
const currentAccountOrderId = ref(undefined);
const allData = ref({});
//首次查询，或者重置查询条件
const firstSearch = ref(true);
const rawAccountTabRef = ref();
const headerForm = ref({}) // 用于保存搜索条件
const tabOtherList = ref([]) // 编辑的其他金额列表
const firstInitEditPrice = ref(true);
//已选择记录
const inOrOutLoading = ref(true);
const accountFormRef = ref();
const footLabel = {

  label5:"应收总金额",
}
const buttonLoading = ref(false);
//取消确认的弹窗
const dialogVisible = ref(false);
/** 对账单确认 */
const handleConfirm = async (row: any) => {
    if (row.status == '5') {
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
      getSupplierOrderDetailList();
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
  proxy?.$modal.msgSuccess("操作成功");
  getSupplierOrderDetailList();


    }else{
    //验证订单是否能确认
    let hasUpdate = await verifyStatus({id:row.id,handleType:HandleEnum.CONFIRM});
    if (!hasUpdate.data) {
      ElMessage.error("数据状态已变更，请刷新页面后重试");
      //刷新列表
      getSupplierOrderDetailList();
      return;
    }

    deduction.value =true;
    drawerBorrow.title = "对账单确认";
    showCategorySelect.value=false;
    formType.value = HandleEnum.INFO;
    rQueryParams.value = { pageNum: 1, pageSize: 20 };
    backQueryParams.value = { pageNum: 1, pageSize: 20 };
    isEdit.value = true;
    const _id = row?.id;
    const res = await getAccountOrder(_id);
    formInfo.value = res.data;
    currentAccountOrderId.value = _id;
    handleUpdate(row);
    }
}
/** 对账单详情 */
const accountInfo = async (row: any) => {
    deduction.value =false;
    drawerBorrow.title = "对账单详情";
    showCategorySelect.value=false;
    formType.value = HandleEnum.INFO;
    rQueryParams.value = { pageNum: 1, pageSize: 20 };
    backQueryParams.value = { pageNum: 1, pageSize: 20 };
    isEdit.value = true;
    const _id = row?.id;
    const res = await getAccountOrder(_id);
    formInfo.value = res.data;
    currentAccountOrderId.value = _id;

    handleUpdate(row);
}
const handleUpdate = async (row?:any) => {
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
    //不需要未对账数据
    rQueryParams.value.onlyAccountOrder = "1";
    backQueryParams.value.onlyAccountOrder = "1";
  } else {
    backQueryParams.value.hasAccountOrder = "0";
    rQueryParams.value.hasAccountOrder = "0";
  }
  //采购入库、 库存退货
   if(currentAccountOrderId.value){
    let rQueryParams2 = { pageNum: 1, pageSize: 9999,accountTime:rQueryParams.value.accountTime,accountOrderId:currentAccountOrderId.value,onlyAccountOrder : "1",hasAccountOrder:"1" };
    rQueryParams2.type=InOutTypeEnum.PURCHASE_IN;
    rQueryParams2.filterCompany = false;

    let backQueryParams2 = { pageNum: 1, pageSize: 9999,accountTime:backQueryParams.value.accountTime,accountOrderId:currentAccountOrderId.value,onlyAccountOrder : "1",hasAccountOrder:"1" };
    backQueryParams2.type = InOutTypeEnum.STOCK_RETURN;
    backQueryParams2.filterCompany = false;
    const res22 = await listSupplierDeliveryRecord(rQueryParams2);
    const res33 = await listSupplierBackRecord(backQueryParams2);
    allData.value.checkedTabList1 = res22.rows;
    allData.value.checkedTabList2 = res33.rows;
  }

  rQueryParams.value.type = InOutTypeEnum.PURCHASE_IN;
  backQueryParams.value.type = InOutTypeEnum.STOCK_RETURN;
    rQueryParams.value.filterCompany = false;
  backQueryParams.value.filterCompany = false;

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
onMounted(() => {
  getSupplierOrderDetailList();
});
</script>
<style scoped lang="scss">
.expand-wrapper {
  padding-left: 39px;
}
</style>
