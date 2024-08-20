<template>
  <div class="p-2 xtable-page">
    <SupConfirmTab
      :dataList="dataList"
      :columnList="columnList"
      :columnList2="columnList"
      :columnList3="columnList"
      :intervalCondition="['accountMonth', 'endTime', 'accountTime', 'createTime']"
      toolId1="supHalfWaitConfirmAccount"
      toolId2="supHalfConfirmAccount"
      toolId3="supHalfWaitOtherConfirmAccount"
      :loading="loading"
      :total="total"
      :moduleCode="moduleCode"
      :bizType="bizType"
      @searchChange="searchChange"
      @exportExcel="exportExcel"
      :statusSwitch="true"
    ></SupConfirmTab>
  </div>
</template>

<script setup name="PurchaseOrder" lang="ts">
import { listAccountConfirmList } from '@/api/financial/accountOrder';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
import {  TypeEnum } from '@/api/financial/accountOrder/types';
const dataList = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const isTaxOptions = ref([
  {value: "1", label: "是"},
  {value: "0", label: "否"}
])

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
  { title: '报废金额', sortable: true, width: '140', field: 'backPrice', align: 'center', },
  { title: '应付金额', sortable: true, width: '140', field: 'payPayablePrice', align: 'center', },//receivablePrice
  { title: '付款金额', sortable: true, width: '140', field: 'payWriteOffPrice', align: 'center', },
  { title: '剩余应付金额', sortable: true, width: '140', field: 'payRemainPrice', align: 'center', },
  { title: '对账人', width: '140', field: 'accountUserName', align: 'center', filterType: 'input' },
  { title: '备注', width: '240', field: 'remark', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', }
]);

// 获取 搜索条件
const searchChange = async (params: any) => {
  loading.value = true;
  params.type = TypeEnum.SEMI_PROCESSING_OUTSOURCING;
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
          ...queryParams, tableName: toolId,type: TypeEnum.SEMI_PROCESSING_OUTSOURCING
        }, `外协加工对账确认_${new Date().getTime()}.xlsx`);
      }
/**
 * 查询按采购订单列表
 * */
const getSupplierOrderDetailList = async () => {
   let queryParams= {
    pageNum: 1,
    pageSize: 20,
    confirmStatus: '1',
    type: TypeEnum.SEMI_PROCESSING_OUTSOURCING,
   }
  searchChange(queryParams);
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
