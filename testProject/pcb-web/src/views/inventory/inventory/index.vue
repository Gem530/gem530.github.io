<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <div style="float:right;">
          <el-button plain @click="handleExport">导出 </el-button>
        </div>
      </template>
      <el-tabs type="border-card" class="xtable-tab" @tab-click="radioTableHandle">
        <el-tab-pane label="实时库存" >
          <XTable toolId="inventoryCommodity1"
            height="100%"
            class="xtable-content"
            v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum"
            :page-params="{ perfect: true, total: total }"
            :data="inventoryList"
            :columnList="columnList" :loading="loading"
            ref="XTableRef"
            border :showRefresh="true"
            @searchChange="searchChange"
            :intervalCondition="intervalCondition"
          >
            <template #default-relaQuantity="scope">
              <el-button link type="primary" @click="openRelaQuantity(scope.row)">{{ scope.row.relaQuantity }}</el-button>
            </template>
            <template #default-unit="scope">
              <div>PCS</div>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="出入库记录">
          <div class="global-flex flex-end" style="width: 100%;margin-bottom: 10px;">
            <div class="totalTitle">入库数量：{{sumData.inQuantity}}pcs &nbsp;&nbsp;|&nbsp;&nbsp;入库面积：{{sumData.inArea}}㎡ &nbsp;&nbsp;|&nbsp;&nbsp;出库数量：{{sumData.outQuantity}}pcs &nbsp;&nbsp;|&nbsp;&nbsp;出库面积：{{sumData.outArea}}㎡&nbsp;&nbsp;|&nbsp;&nbsp;出入库数量差：{{sumData.diffQuantity}}pcs &nbsp;&nbsp;|&nbsp;&nbsp;出入库面积差：{{sumData.diffArea}}㎡</div>
          </div>
          <XTable toolId="inventoryCommodity2"
            height="100%"
            class="xtable-content"
            v-model:page-size="inOutQueryParams.pageSize"
            v-model:current-page="inOutQueryParams.pageNum"
            :page-params="{ perfect: true, total: inOutTotal }"
            :data="inOutRecordList" :intervalCondition="['intOutTime']"
            :columnList="inOutColumnList" :loading="inOutLoading"
            ref="XTableRef"
            border :showRefresh="true"
            @searchChange="inOutSearchChange"
          >
            <template #default-type="scope">
              <div>{{ inventoryTypeStrings[scope.row.type as keyof typeof InventoryTypeEnum] }}</div>
            </template>
            <template #default-unit="scope">
              <div>PCS</div>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      v-model="exportVisible"
      title="导出提示"
      width="20%"
      align-center
      destroy-on-close
    >
      <span>
        没有设置起始时间，将默认导出30天内的数据
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportVisible = false">取消</el-button>
          <el-button type="primary" @click="exportExcel">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>


    <el-dialog :title="commodityDialog.title" v-model="commodityDialog.visible" width="60%">
      <div class="expand-wrapper">
        <XTable toolId="inventoryRelaCommodity" height="500px" class="xtable-content"
          v-model:page-size="dialogQueryParams.pageSize" v-model:current-page="dialogQueryParams.pageNum"
          :page-params="{ perfect: true, total: total2 }" :data="inventoryRelaList" :columnList="relaColumnList"
          ref="relaCommodityXTableRef" border :showRefresh="true" @searchChange="searchInventoryRelaChange" :loading="loading2">

          <template #default-make="{ row }">
            <el-button size="small" link type="primary" @click.stop="unLock(row)">解除锁定</el-button>
          </template>

        </XTable>
      </div>
    </el-dialog>

  </div>
</template>

<script setup name="Commodity" lang="ts">
import { listInventory,unLockRelaInventory,listRelaInventory  } from '@/api/inventory/inventory';
import { InventoryVO, InventoryQuery,InventoryTypeEnum,inventoryTypeStrings, InventoryForm } from '@/api/inventory/inventory/types';
import {getInOutSum, listInOutRecord,} from '@/api/inventory/inOutRecord';

import { InOutRecordVO, InOutRecordQuery, InOutRecordForm } from '@/api/inventory/inOutRecord/types';
import { getBaseStorage } from "@/api/system/config";
import dayjs from "dayjs";
import {ref} from "vue";
import {parseTime} from "@/utils/ruoyi";
const baseStorage = ref<any[]>([]);
const { proxy } = getCurrentInstance() as ComponentInternalInstance;


const commodityDialog = reactive<DialogOption>({ visible: false, title: '' });

const inOutRecordList = ref<InOutRecordVO[]>([]);
const inventoryList = ref<InventoryVO[]>([]);

const loading = ref(true);
const inOutLoading = ref(true);

const total2 = ref(0);
const loading2 = ref(true);
const inventoryRelaList = ref<InventoryVO[]>([]);
const dialogCommodityId = ref();
const total = ref(0);
const inOutTotal = ref(0);

const sumData =ref({
  inQuantity:0,
  outQuantity:0,
  diffQuantity:0,
  inArea:0,
  outArea:0,
  diffArea:0,
})

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});


const initInOutFormData: InOutRecordForm = {
  id: undefined,
  rawMaterialId: undefined,
  storageId: undefined,
  quantity: undefined,
  intOutTime: undefined,
  type: undefined,
  bizId: undefined,
  no: undefined,
  ownerId: undefined
}
const inOutData = reactive<PageData<InOutRecordForm, InOutRecordQuery>>({
  form: {...initInOutFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    rawMaterialId: undefined,
    storageId: undefined,
    quantity: undefined,
    intOutTime: undefined,
    type: undefined,
    bizId: undefined,
    no: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {

  }
});


const { queryParams:inOutQueryParams} = toRefs(inOutData);
const initFormData: InventoryForm = {
  id: undefined,
  commodityId: undefined,
  storageId: undefined,
  quantity: undefined,
  customerId: undefined,
  ownerId: undefined
}
const data = reactive<PageData<InventoryForm, InventoryQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    commodityId: undefined,
    storageId: undefined,
    quantity: undefined,
    customerId: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {

  }
});
const dialogData = reactive<PageData<InventoryForm, InventoryQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    commodityId: undefined,
    storageId: undefined,
    quantity: undefined,
    customerId: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {
  }
});
const { queryParams:dialogQueryParams} = toRefs(dialogData);
const XTableRef = ref()

const intervalCondition = ['quantity'];

const relaColumnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '产品编码', field: 'commodityCode', align: 'center', },
  { title: '销售单号', field: 'saleCode', align: 'center', },
  { title: '排产单号', field: 'productionNo', align: 'center', },
  { title: '数量', field: 'quantity', align: 'center', },
  { title: '已发数量', field: 'deliverQuantity', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '120', },
]);

const columnList = ref([

    { title:"序号" ,type: 'seq', field:'index',  align: 'center', width: '60' },
        { title: '客户编码', field: 'customerCode', align: 'center', filterType: 'input'},
        { title: '产品编码', field: 'commodityCode', align: 'center', filterType: 'input' },
        { title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input'},
        { title: '单位', field: 'unit', align: 'center',  },
        { title: '库存数', field: 'quantity', align: 'center', filterType: "intervalNumber"},
        { title: '已锁库存', field: 'relaQuantity', align: 'center', },
        { title: '库存面积', field: 'area', align: 'center',  },
    { title: '入库仓', field: 'storageName', align: 'center', width: '120',  },
]);

const typeDescInfo = ref([
  { label: '入库', value: "1" },
  { label: '出库', value: "0" },
])

const getTypeMainInfo =(_obj: any) => {
  let newArr=[];
    for (const [key, value] of Object.entries(_obj)) {
      newArr.push({ label: `${value}`, value: `${value}` })
    }
    return newArr;
}

const typeMainInfo = getTypeMainInfo(inventoryTypeStrings);

const inOutColumnList = ref([

        { title:"序号" ,type: 'seq', field:'index',  align: 'center', width: '60' },
        { title: '来源', field: 'type', align: 'center', filterType:'checkboxButton',  filterData:()=>typeMainInfo},
        { title: '客户编码', field: 'customerCode', align: 'center', filterType: 'input'},
        { title: '产品编码', field: 'commodityCode', align: 'center', filterType: 'input' },
        { title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input' },
        { title: '单位', field: 'unit', align: 'center',  },
        { title: '存货仓', field: 'storageName', align: 'center',  },
        { title: '类型', field: 'typeDesc', align: 'center',filterType:'radioButton',  filterData:()=>typeDescInfo.value},
        { title: '操作数量', field: 'quantity', align: 'center',  },
        { title: '备注', field: 'remark', align: 'center',  },
        { title: '操作人', field: 'createByName', align: 'center', filterType: 'input'},
        { title: '出入库时间', field: 'intOutTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
]);



const { queryParams } = toRefs(data);

const tableValue = ref("实时库存");

// 切换菜单栏 ***********
const radioTableHandle = async (tab: any, event: any) => {
  const radioTable = tab.props.label;
  tableValue.value = radioTable;
  if (radioTable == "实时库存") {
    queryParams.value.status = undefined;
    await getList();
  } else  {
    await getInOutList();
  }
}
const getKeyByValue = (value: string) =>{
  for (const key in inventoryTypeStrings) {
    if (inventoryTypeStrings[key] === value) {
      return key;
    }
  }
  return null;
}

// 获取 搜索条件
const inOutSearchChange = (params: any) => {
  console.log("inOutSearchChange",params.type);
  //typeList
    if(params.type&&params.type.length>0){
      let _QtypeList:any=[];
      params.type.forEach((item: any) => {
        let _key=getKeyByValue(item);
        _QtypeList.push(_key)
      })
      params.typeList=_QtypeList;
      //多选之置空
      params.type=undefined;
    }
    inOutQueryParams.value = params
    getInOutList()
}

/** 查询成品出入库记录列表 */
const getInOutList = async () => {
  inOutLoading.value = true;
  const res = await listInOutRecord(inOutQueryParams.value);
  inOutRecordList.value = res.rows;
  if(inOutRecordList.value){
    inOutRecordList.value.forEach((item: any) => {
      const typeDesc=inventoryTypeStrings[item.type as keyof typeof InventoryTypeEnum];
      if(typeDesc && typeDesc.includes('入')){
        item.typeDesc="入库";
      }else{
        item.typeDesc="出库";
      }
    })
    setStorage(inOutRecordList.value);
  }
  console.log(inOutRecordList.value)
  inOutTotal.value = res.total;
  inOutLoading.value = false;
  getSum();
}


const getSum = async () =>{
  const resSum:any = await getInOutSum(inOutQueryParams.value);
  sumData.value = resSum.data;
}

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}

/** 查询成品库存列表 */
const getList = async () => {
  loading.value = true;
  const res = await listInventory(queryParams.value);
  inventoryList.value = res.rows;
  if(inventoryList.value&&inventoryList.value.length>0){
    setStorage(inventoryList.value)
  }
  total.value = res.total;
  loading.value = false;
}

const exportVisible = ref(false);

/** 导出按钮操作 */
const handleExport = () => {
  if(tableValue.value == '实时库存'){
    proxy?.download('/inventory/inventory/exportCommodity', {
      ...queryParams.value, tableName: 'inventoryCommodity1'
    }, `实时库存列表_${parseTime(new Date())}.xlsx`);
  } else {
    if(!inOutQueryParams.value.intOutTimeStart || !inOutQueryParams.value.intOutTimeEnd){
      exportVisible.value = true;
    }else {
      exportExcel();
    }
  }
}

const exportExcel = ()=>{
  if(!inOutQueryParams.value.intOutTimeStart && !inOutQueryParams.value.intOutTimeEnd){
    inOutQueryParams.value.intOutTimeStart = dayjs(new Date()).subtract(1, "month").format("YYYY-MM-DD 00:00:00");
    inOutQueryParams.value.intOutTimeEnd = dayjs(new Date()).format("YYYY-MM-DD 23:59:59");
  }
  exportVisible.value = false;
  proxy?.download('/inventory/inOutRecord/exportInOut', {
    ...inOutQueryParams.value, tableName: 'inventoryCommodity2'
  }, `出入库记录列表_${parseTime(new Date())}.xlsx`);
}

// /** 导出按钮操作 */
// const handleExport = () => {
//   proxy?.download('inventory/inventory/export', {
//     ...queryParams.value
//   }, `inventory_${new Date().getTime()}.xlsx`)
// }
const getListBaseStorage = async () => {
  const res = await getBaseStorage();
  baseStorage.value = res.data;
};
const setStorage = (_list:any[]) => {
  if(_list&&_list.length>0){
    _list.filter((item:any) => {
      baseStorage.value.forEach((item2) => {
        if (item.storageId == item2.id) {
          item.storageName = item2.name;
        }
      });
    });
  }
}
const openRelaQuantity = async (row: any) => {
  commodityDialog.visible = true;
  commodityDialog.title = "锁定记录（未出货）";
  dialogCommodityId.value = undefined;
  dialogCommodityId.value = row.commodityId;
  getRelaList();

}

const searchInventoryRelaChange = async(params: any) => {
  dialogQueryParams.value = params;
  getRelaList();
}

const getRelaList = async () => {
  loading2.value = true;

  dialogQueryParams.value.commodityId = dialogCommodityId.value;
  dialogQueryParams.value.onlyRemain = '1';
  const res = await listRelaInventory(dialogQueryParams.value);
  inventoryRelaList.value = res.rows;
  total2.value = res.total;
  loading2.value = false;
}

const unLock =async (row:any) => {

  const tipsContent = '解除锁定后将无法恢复，请谨慎操作 </br> ';

  const res = await listRelaInventory({id:row.id});
  let qty=row.quantity;
  let deqty=row.deliverQuantity;
  if(res.rows[0]){
    qty = res.rows[0].quantity;
    deqty = res.rows[0].deliverQuantity;
  }

  const  backQty=Number(qty) - Number(deqty);
  const tipsContent2 = '产品编码”'+row.commodityCode+'“,将增加库存数量：'+backQty+'';

  await ElMessageBox.confirm(tipsContent+tipsContent2, '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
      type: 'warning'
    });
  await unLockRelaInventory(row.id);
  await getRelaList();
  await getList();
  commodityDialog.visible = false;
}


onMounted(() => {
  getList();
  getInOutList();
  getListBaseStorage();
});
</script>

<style>
  .totalTitle{
    padding: 0px !important;
    margin: 0px;
    line-height: 24px !important;
    display: flex !important;
    justify-content: end !important;
    font-size: 14px !important;
    color: #0892c7 !important;
    font-weight: bold;
    margin-right: 10px;
  }
</style>
