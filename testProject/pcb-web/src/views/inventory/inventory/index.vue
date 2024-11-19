<template>
  <div class="p-2 xtable-page">
    <!-- <el-card shadow="never" class="xtable-card"> -->
      <el-tabs v-if="checkPermi(['inventory:commodity:list'])" class="xtable-tab" @tab-click="radioTableHandle">
        <el-tab-pane label="实时库存" >
          <TotalTitle :list="[
            {title: `当前锁定库存总数：${totalData.relaTotal}pcs`},
            {title: `当前库存总面积：${totalData.areaTotal}㎡`},
          ]">
          </TotalTitle>
          <div class="head-btn-flex" v-if="checkPermi(['inventory:commodity:list']) || checkPermi(['inventory:commodity:export'])">
            <!-- <div class="totalTitle"> &nbsp;&nbsp;|&nbsp;&nbsp;当前库存总数：{{totalData.inventoryTotal}}㎡ &nbsp;&nbsp;|&nbsp;&nbsp;当前库存总面积：{{totalData.areaTotal}}㎡</div> -->
            <el-button v-if="checkPermi(['inventory:commodity:list'])" style="margin-left: 20px" type="primary" @click="handlePrint">批量打印标签</el-button>
            <el-button v-if="checkPermi(['inventory:commodity:export'])" style="margin-left: 20px" type="primary" @click="handleExport">导出</el-button>
          </div>

          <XTable toolId="inventoryCommodityTable1"
            height="100%"
            class="xtable-content"
            v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum"
            :page-params="{ perfect: true, total: total }"
            :data="inventoryList"
            :columnList="columnList" :loading="loading"
            ref="commodityTableRef"
            border :showRefresh="true"
            @searchChange="searchChange"
            :checkbox-config="{ reserve: true }"
            :intervalCondition="intervalCondition"
            :row-config="{ keyField: 'id' }"
            @checkbox-all="selectionChange"
            @checkbox-change="selectionChange"
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
          <TotalTitle :list="[
            {title: `入库数量：${sumData.inQuantity} pcs`},
            {title: `入库面积：${sumData.inArea} ㎡`},
            {title: `出库数量：${sumData.outQuantity} pcs`},
            {title: `出库面积：${sumData.outArea} ㎡`},
            {title: `出入库数量差：${sumData.diffQuantity} pcs`},
            {title: `出入库面积差：${sumData.diffArea} ㎡`},
          ]">
          </TotalTitle>
          <div class="head-btn-flex" v-if="checkPermi(['inventory:commodity:inout:export'])">
            <!-- <div class="totalTitle">入库数量：{{sumData.inQuantity}}pcs &nbsp;&nbsp;|&nbsp;&nbsp;入库面积：{{sumData.inArea}}㎡ &nbsp;&nbsp;|&nbsp;&nbsp;出库数量：{{sumData.outQuantity}}pcs &nbsp;&nbsp;|&nbsp;&nbsp;出库面积：{{sumData.outArea}}㎡&nbsp;&nbsp;|&nbsp;&nbsp;出入库数量差：{{sumData.diffQuantity}}pcs &nbsp;&nbsp;|&nbsp;&nbsp;出入库面积差：{{sumData.diffArea}}㎡</div> -->
            <el-button v-if="checkPermi(['inventory:commodity:inout:export'])" type="primary" @click="handleExport">导出</el-button>
          </div>
          <XTable toolId="inventoryCommodityToolId"
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
        <el-tab-pane v-if="checkPermi(['inventory:commodity:month'])" label="库存结存" >
          <el-form class="width-100" :model="monthQueryParams" ref="queryFormRef" :inline="true">
            <el-row>
              <el-col :span="8">
                <el-form-item label="结存年月:" prop="yearMonth">
                  <el-date-picker
                    v-model="monthQueryParams.yearMonth" type="month"
                    value-format="YYYY-MM"
                    @change="handleMonthQuery"
                    placeholder="请选择年月"
                    :clearable="false"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="16" class="global-flex flex-end align-start">
                <el-button v-if="checkPermi(['inventory:commodity:month:export'])" style="margin-left: 20px" type="primary" @click="exportMonthExcelBefore">导出</el-button>
              </el-col>
            </el-row>
          </el-form>

          <XTable toolId="inventoryMonthCommodity"
                  height="100%"
                  class="xtable-content"
                  v-model:page-size="monthQueryParams.pageSize"
                  v-model:current-page="monthQueryParams.pageNum"
                  :page-params="{ perfect: true, total: monthTotal }"
                  :data="monthInventoryList"
                  :columnList="monthColumnList" :loading="loading"
                  ref="commodityMonthTableRef"
                  border :showRefresh="true"
                  @searchChange="monthSearchChange"
                  :checkbox-config="{ reserve: true }"
                  :intervalCondition="monthIntervalCondition"
                  :row-config="{ keyField: 'id' }"
          >

            <template #default-relaQuantity="scope">
              <el-button link type="primary" @click="openRelaQuantity(scope.row)">{{ scope.row.relaQuantity }}</el-button>
            </template>
            <template #default-unit="scope">
              <div>PCS</div>
            </template>
          </XTable>
        </el-tab-pane>

      </el-tabs>
    <!-- </el-card> -->

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
      <div>
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

    <CommodityPrint ref="commodityPrintRef"/>

  </div>
</template>

<script setup name="Commodity" lang="ts">
import {
  unLockRelaInventory,
  listRelaInventory,
  listInventoryV2,
  getInventorySum, printList, listCommodityMonth
} from '@/api/inventory/inventory';
import {
  InventoryVO,
  InventoryQuery,
  InventoryTypeEnum,
  inventoryTypeStrings,
  InventoryForm,
  inventoryTypeList
} from '@/api/inventory/inventory/types';
import {getInOutSum, listInOutRecord,} from '@/api/inventory/inOutRecord';

import { InOutRecordVO, InOutRecordQuery, InOutRecordForm } from '@/api/inventory/inOutRecord/types';
import { getBaseStorage } from "@/api/system/config";
import dayjs from "dayjs";
import {ref} from "vue";
import {parseTime} from "@/utils/ruoyi";
import {checkPermi} from "@/utils/permission";
const baseStorage = ref<any[]>([]);
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const tableId = checkPermi(['inventory:commodity:cost']) ? 'inventoryCommodityTable1' : 'inventoryCommodityTable2';

const commodityDialog = reactive<DialogOption>({ visible: false, title: '' });

const inOutRecordList = ref<InOutRecordVO[]>([]);
const inventoryList = ref<InventoryVO[]>([]);
const selectCommodityList = ref<InventoryVO[]>([]);
const monthInventoryList = ref<InventoryVO[]>([]);

const loading = ref(true);
const inOutLoading = ref(true);

const total2 = ref(0);
const loading2 = ref(true);
const inventoryRelaList = ref<InventoryVO[]>([]);
const dialogCommodityId = ref();
const total = ref(0);
const inOutTotal = ref(0);
const monthTotal = ref(0);

const commodityPrintRef = ref();

const sumData =ref({
  inQuantity:0,
  outQuantity:0,
  diffQuantity:0,
  inArea:0,
  outArea:0,
  diffArea:0,
})

const totalData =ref({
  relaTotal: 0,
  inventoryTotal: 0,
  areaTotal: 0,
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
    yearMonth: undefined,
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
const commodityTableRef = ref()

const intervalCondition = ['quantity','monthQuantity','monthPrice','relaQuantity'];

const relaColumnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '产品编码', field: 'commodityCode', align: 'center', },
  { title: '销售单号', field: 'saleCode', align: 'center', },
  { title: '排产单号', field: 'productionNo', align: 'center', },
  { title: '客户PO', field: 'customerPo', align: 'center', },
  { title: '数量', field: 'quantity', align: 'center', },
  { title: '已发数量', field: 'deliverQuantity', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '120', fixed: 'right', },
]);

const columnList = ref([
  {type: 'checkbox', width: '40', align: "center",fixed: 'left',},
  { title: '序号' ,type: 'seq', field:'index', fixed: 'left', align: 'center', width: '60' },
  { title: '客户编码', minWidth:'100', field: 'customerCode', fixed: 'left', align: 'center', filterType: 'input'},
  { title: '产品编码', minWidth:'140', field: 'commodityCode', fixed: 'left', align: 'center', filterType: 'input' },
  { title: '产品名称', minWidth:'180', field: 'commodityName', fixed: 'left', align: 'center', filterType: 'input'},
  { title: '客户物料编码', minWidth:'140', field: 'materialNumber', align: 'center', filterType: 'input'},
  { title: '单位', minWidth:'80', field: 'unit', align: 'center', },
//  { title: '结存数量', minWidth:'90', field: 'monthQuantity', align: 'center', filterType: "intervalNumber"},
//  { title: '结存成本价(元)', minWidth:'130', field: 'monthPrice', align: 'center', filterType: "intervalNumber", isPermi: () => checkPermi(['inventory:commodity:cost'])},
  { title: '所属仓库', field: 'storageName', align: 'center', minWidth: '120', filterType: 'input', filterParam: {placeholder: '请输入仓库名称'}  },
  { title: '锁定库存(PCS)', minWidth:'120', field: 'relaQuantity', align: 'center', filterType: "intervalNumber"},
  { title: '当前库存(PCS)', minWidth:'120', field: 'quantity', align: 'center', filterType: "intervalNumber"},
  { title: '当前库存面积(㎡)', minWidth:'130', field: 'area', align: 'center',  },
  // { title: '当前成本价(元)', minWidth:'120', field: 'costPrice', align: 'center', isPermi: () => checkPermi(['inventory:commodity:cost'])},
]);

const monthColumnList = ref([
  { title: '序号' ,type: 'seq', field:'index', fixed: 'left', align: 'center', width: '60' },
  { title: '客户编码', minWidth:'100', field: 'customerCode', fixed: 'left', align: 'center', filterType: 'input'},
  { title: '产品编码', minWidth:'140', field: 'commodityCode', fixed: 'left', align: 'center', filterType: 'input' },
  { title: '产品名称', minWidth:'180', field: 'commodityName', fixed: 'left', align: 'center', filterType: 'input'},
  { title: '单位', minWidth:'80', field: 'unit', align: 'center', },
  { title: '所属仓库', minWidth:'80', field: 'storageName', align: 'center', filterType: 'input'},
  { title: '出库结存数量', minWidth:'90', field: 'outQuantity', align: 'center', filterType: "intervalNumber"},
  { title: '出库结存金额(元)', minWidth:'120', field: 'outTotalPrice', align: 'center', filterType: "intervalNumber",},
  { title: '入库结存数量', minWidth:'90', field: 'inQuantity', align: 'center', filterType: "intervalNumber"},
  { title: '入库结存金额(元)', minWidth:'120', field: 'inTotalPrice', align: 'center', filterType: "intervalNumber",},
  { title: '结存数量', minWidth:'90', field: 'quantity', align: 'center', filterType: "intervalNumber"},
  { title: '结存平均单价(元)', minWidth:'120', field: 'price', align: 'center', filterType: "intervalNumber"  },
  { title: '结存总金额(元)', minWidth:'120', field: 'totalPrice', align: 'center',},
]);

const monthIntervalCondition = ['outQuantity', 'outTotalPrice', 'inQuantity', 'inTotalPrice', 'quantity', 'price'];

const typeDescInfo = ref([
  { label: '入库', value: "1" },
  { label: '出库', value: "0" },
])

const typeMainInfo = inventoryTypeList;

const inOutColumnList = ref([

        { title:"序号" ,type: 'seq', field:'index',  align: 'center', width: '60' },
        { title: '来源', field: 'type', align: 'center', filterType:'checkboxButton',  filterData:()=>typeMainInfo},
        { title: '客户编码', field: 'customerCode', align: 'center', filterType: 'input'},
        { title: '产品编码', field: 'commodityCode', align: 'center', filterType: 'input' },
        { title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input' },
        { title: '单位', field: 'unit', align: 'center',  },
        { title: '存货仓', field: 'storageName', align: 'center',  },
        { title: '类型', field: 'typeDesc', align: 'center',filterType:'radioButton',  filterData:()=>typeDescInfo.value},
        { title: '出/入库数量', field: 'quantity', align: 'center',  },
        { title: '备注', field: 'remark', align: 'center',  },
        { title: '操作人', field: 'createByName', align: 'center', filterType: 'input'},
        { title: '出入库时间', field: 'intOutTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
]);



const { queryParams } = toRefs(data);

const monthData = reactive<PageData<InventoryForm, InventoryQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    commodityId: undefined,
    storageId: undefined,
    quantity: undefined,
    customerId: undefined,
    ownerId: undefined,
    yearMonth: undefined,
    params: {
    }
  },
  rules: {

  }
});

const { queryParams: monthQueryParams } = toRefs(monthData);


const tableValue = ref("实时库存");

// 切换菜单栏 ***********
const radioTableHandle = async (tab: any, event: any) => {
  const radioTable = tab.props.label;
  tableValue.value = radioTable;
  if (radioTable == "实时库存") {
    queryParams.value.status = undefined;
    await getList();
  } else if (radioTable == "出入库记录") {
    await getInOutList();
  } else {
    await getMonthList();
  }
}

// 获取 搜索条件
const inOutSearchChange = (params: any) => {
  //typeList
    if(params.type&&params.type.length>0){
      let _QtypeList:any=[];
      params.type.forEach((item: any) => {
        _QtypeList.push(item)
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
    // inOutRecordList.value.forEach((item: any) => {
    //   const typeDesc=inventoryTypeStrings[item.type as keyof typeof InventoryTypeEnum];
    //   if(typeDesc && typeDesc.includes('入')){
    //     item.typeDesc="入库";
    //   }else{
    //     item.typeDesc="出库";
    //   }
    // })
    setStorage(inOutRecordList.value);
  }
  inOutTotal.value = res.total;
  inOutLoading.value = false;
  getSum();
}


const getSum = async () =>{
  const resSum:any = await getInOutSum(inOutQueryParams.value);
  sumData.value = resSum.data;
}

const inventorySum = async () =>{
  const resSum:any = await getInventorySum(queryParams.value);
  totalData.value = resSum.data;
}

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params;
    getList()
    setSelect()
}

/** 查询成品库存列表 */
const getList = async () => {
  loading.value = true;
  const res = await listInventoryV2(queryParams.value);
  inventoryList.value = res.rows;
  if(inventoryList.value&&inventoryList.value.length>0){
    setStorage(inventoryList.value)
  }
  total.value = res.total;
  loading.value = false;
  inventorySum();
}

const exportVisible = ref(false);

/** 导出按钮操作 */
const handleExport = () => {
  if(tableValue.value == '实时库存'){
    proxy?.download('/inventory/inventory/exportCommodity', {
      ...queryParams.value, tableName: 'inventoryCommodityTable1'
    }, `实时库存列表_${parseTime(new Date())}.xlsx`);
  } else if(tableValue.value == '出入库记录') {
    if(!inOutQueryParams.value.intOutTimeStart || !inOutQueryParams.value.intOutTimeEnd){
      exportVisible.value = true;
    }else {
      exportExcel();
    }
  } else {
    proxy?.download('inventory/month/export', {
      ...monthQueryParams.value, tableName: 'inventoryMonthCommodity'
    }, `成品结存_${new Date().getTime()}.xlsx`);
  }
}

/** 打印标签按钮操作 */
const handlePrint = async () => {
  // 没有勾选查询所有数据
  if (!selectCommodityList.value || selectCommodityList.value.length == 0) {
    proxy?.$modal.msgError("请选择需要打印标签的的数据项");
    return;
  }
  proxy?.$modal.loading("加载中...");
  commodityPrintRef.value.doPrint(selectCommodityList.value);
  proxy?.$modal.closeLoading()
}

/** 选择产品 */
const selectionChange = () => {
  const $table = commodityTableRef.value.xTableRef
  if ($table) {
    // 获取翻页保留的列表数据和选择的行数据列表
    const selectRecords = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords())
    selectCommodityList.value = selectRecords.map(item => item);
  }
}

/** 设置表格列表选中 */
const setSelect = () => {
  const $table = commodityTableRef.value.xTableRef
  if ($table) {
    //过滤materialList中id在alreadySelectMaterial中的数据，
    let st = inventoryList.value.filter(item => {
      return selectCommodityList.value.some(item2 => item.id == item2.id);
    });

    //先为materialList中所有数据取消选中
    $table.setCheckboxRow(inventoryList, false);
    $table.setCheckboxRow(st, true);
  }
}

const exportExcel = ()=>{
  if(!inOutQueryParams.value.intOutTimeStart && !inOutQueryParams.value.intOutTimeEnd){
    inOutQueryParams.value.intOutTimeStart = dayjs(new Date()).subtract(1, "month").format("YYYY-MM-DD 00:00:00");
    inOutQueryParams.value.intOutTimeEnd = dayjs(new Date()).format("YYYY-MM-DD 23:59:59");
  }
  exportVisible.value = false;
  proxy?.download('/inventory/inOutRecord/exportInOut', {
    ...inOutQueryParams.value, tableName: 'inventoryCommodityToolId'
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

/** 结存查询操作 */
const handleMonthQuery = () => {
  monthQueryParams.value.pageNum = 1;
  getMonthList();
}

/** 查询物料月度结存列表 */
const getMonthList = async () => {
  loading.value = true;
  const res = await listCommodityMonth(monthQueryParams.value);
  monthInventoryList.value = res.rows;
  monthTotal.value = res.total;
  loading.value = false;
}

// 获取 搜索条件
const monthSearchChange = (params: any) => {
  params.yearMonth = monthQueryParams.value.yearMonth;
  monthQueryParams.value = params;
  getMonthList()
}

/** 导出前操作 */
const exportMonthExcelBefore = async () => {
  //先看看有没有给起始时间，没有要给出提示
  if (!monthQueryParams.value.yearMonth) {
    exportVisible.value = true;
  } else {
    proxy?.download('inventory/month/export', {
      ...monthQueryParams.value, tableName: 'inventoryMonthCommodity'
    }, `成品结存_${new Date().getTime()}.xlsx`);
  }
}


onMounted(() => {
  monthQueryParams.value.yearMonth = dayjs(new Date()).subtract(1, 'month').format("YYYY-MM");
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
