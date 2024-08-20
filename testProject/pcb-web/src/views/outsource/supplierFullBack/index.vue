<template>
  <div class="p-2 xtable-page">
    <SupConfirmTab
      :dataList="dataList"
      :columnList="columnList"
      :columnList2="columnList"
      :columnList3="columnList"
      :intervalCondition="['backTime']"
      toolId1="waitFullBackDetails"
      toolId2="confirmFullBackDetails"
      toolId3="waitOtherFullBacks"
      :loading="loading"
      :total="total"
      :moduleCode="moduleCode"
      :bizType="bizType"
      @searchChange="searchChange"
      @exportExcel="exportExcel"
      @cancelAccount="cancelAccount"
    ></SupConfirmTab>
  </div>
</template>

<script setup name="PurchaseOrder" lang="ts">
import {listSupplierBack, sourceFullCancelBackOrder} from "@/api/outsource/sourceFullProcessOrderBack";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dataList = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);

// 文件上传类型
const moduleCode = ref('12');
const bizType = ref('16');

const columnList = ref([
  { title:"序号" ,type: 'seq',field:'index',  align: 'center', width: '50' },
  { title: '单据状态',width:'60', field: 'confirmStatus', align: 'center' },
  { title: '退货单号',width:'120', field: 'code', align: 'center', filterType: 'input', },
  { title: '外协单号',width:'120', field: 'outSourceCode', align: 'center', filterType: 'input', },
  {
    width: '115',
    title: '退货时间',
    field: 'backTime',
    align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  { title: '退货人',width:'70', field: 'createByName', align: 'center',filterType: 'input', },
  { title: '退货客户',width:'135', field: 'ownerName', align: 'center' },
  { title: '退货地址', width:'140',field: 'addressName', align: 'center', },
  { title: '产品编码', width:'120',field: 'commodityCode', align: 'center', filterType: 'input', },
  { title: '产品名称', width:'120',field: 'commodityName', align: 'center', filterType: 'input', },
  { title: '外协数量(PCS)', width:'85',field: 'outSourceQuantity', align: 'center' },
  { title: '退货数量(PCS)', width:'85',field: 'quantity', align: 'center' },
  { title: '退货单价', width:'80',field: 'price', align: 'center' },
  { title: '退货金额', width:'80',field: 'backTotalPrice', align: 'center' },
  { title: '退货原因', width:'100',field: 'reason', align: 'center'  },
  { title: '操作', field: 'make', align: 'center', width: '140', fixed: 'right', },
]);

// 获取 搜索条件
const searchChange = async (params: any) => {
  loading.value = true;
  const res = await listSupplierBack(params);
  dataList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 导出前操作 */
const exportExcel = async (queryParams:any,toolId :any) => {
        proxy?.download('outsource/sourceFullProcessOrderBack/supExport', {
          ...queryParams, tableName: toolId
        }, `外协退货单_${new Date().getTime()}.xlsx`);
      }
/**
 * 查询供应商外协订单退货列表
 * */
const getSupplierList = async () => {
   let queryParams= {
    pageNum: 1,
    pageSize: 20,
    confirmStatus: '2',
   }
  searchChange(queryParams);
}

/** 取消单据 */
const cancelAccount = async (order: any) => {
  order.status = '5';
  order.confirmStatus = '1';
  await sourceFullCancelBackOrder(order).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("修改成功");
}

onMounted(() => {
  getSupplierList();
});
</script>
<style scoped lang="scss">
.expand-wrapper {
  padding-left: 39px;
}
</style>
