<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs type="border-card" class="xtable-tab" @tab-click="radioTableHandle">
        <el-tab-pane label="成品库存盘点">
          <el-row style="display: flex;padding: 5px 0;justify-content: end;width:100%">
            <el-button size="small" type="primary" @click.stop="doAdd()">盘入</el-button>
          </el-row>
          <XTable toolId="inventoryCommodity1" height="100%" class="xtable-content"
            v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum"
            :page-params="{ perfect: true, total: total }" :data="inventoryList" :columnList="columnList" ref="XTableRef"
            border :showRefresh="true" @searchChange="searchChange" :loading="loading">

            <template #default-relaQuantity="scope">
              <el-button link type="primary" @click="openRelaQuantity(scope.row)">{{ scope.row.relaQuantity }}</el-button>
            </template>
            <template #default-unit="scope">
              <div>PCS</div>
            </template>
            <template #default-make="{ row }">
              <el-button size="small" link type="primary" @click.stop="handleAdd('in', row)">盘入</el-button>
              <el-button size="small" link type="primary" @click.stop="handleAdd('out', row)">盘出</el-button>
            </template>

          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>


    <el-dialog :title="dialog.title" v-model="dialog.visible" width="40%">
      <el-form ref="tabFormRef" :model="form" :rules="listRules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品编码" prop="commodityCode">
              <el-input maxLength="1000" v-model="form.commodityCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称" prop="commodityName">
              <el-input maxLength="1000" v-model="form.commodityName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库 " prop="storageId">
              <el-select style="width: 100%;" v-model="form.storageId" filterable placeholder="请选择"
                :default-first-option="true">
                <el-option :key="1070" :label="'成品仓'" :value="1070" selected />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量" prop="shipQuantity">
              <el-input-number maxLength="11" :precision="0" :controls="false" style="width: 100%;"
                :disabled="drawer.title?.includes('详情') || drawer.title?.includes('审核')" v-model="form.shipQuantity" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input maxLength="1000" v-model="form.remark" :rows="2" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cacelAdd">取 消</el-button>
        </div>
      </template>
    </el-dialog>



    <!-- 添加或修改物料盘点明细对话框 -->
    <el-drawer :title="addDialog.title" v-model="addDialog.visible" size="50%" append-to-body
      modal-class="material-check-drawer" destroy-on-close>
      <el-main style="padding:0px;height: 100%;overflow-x:hidden;">
        <div style="flex: none;height: 40% !important;" class="ptable-card">
          <el-divider content-position="left" style="padding:0">已选产品</el-divider>
          <XTable :page-show="false" height="100%" class="ptable-content checkTabCls" :data="checkCommodityList"
            :columnList="commodityColumnList2" ref="tabXTableRef2" border :edit-rules="validRules"
            :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }">
            <template #edit-quantity="{ row }">
              <el-input-number maxLength="11" :precision="0" :controls="false" style="width: 100%;"
                v-model="row.quantity" />
            </template>
            <template #edit-remark="{ row }">
              <el-input maxLength="1000" v-model="row.remark" />
            </template>
            <template #edit-storageId="{ row }">
              <el-select style="width: 100%;" v-model="row.storageId" filterable placeholder="请选择"
                :default-first-option="true">
                <el-option :key="1070" :label="'成品仓'" :value="1070" selected />
              </el-select>
            </template>
            <template #default-storageId="{ row }">
              <el-select style="width: 100%;" v-model="row.storageId" filterable placeholder="请选择"
                :default-first-option="true">
                <el-option :key="1070" :label="'成品仓'" :value="1070" selected />
              </el-select>
            </template>
            <template #default-make="{ row }">
              <el-button size="small" link type="primary" @click.stop="deleteTab(row)">删除</el-button>
            </template>
          </XTable>
        </div>
        <div style="flex: none;height: 60% !important;" class="ptable-card">
          <el-divider content-position="left">待选产品</el-divider>
<!--          <div style="text-align: right">-->
<!--            <el-button :loading="buttonLoading" type="primary" @click="submitPurchase">确定</el-button>-->
<!--          </div>-->
          <XTable height="100%" class="ptable-content" v-model:page-size="tabQueryParams.pageSize"
            v-model:current-page="tabQueryParams.pageNum" :page-params="{ perfect: true, total: tabTotal }"
            :data="commodityList" :checkbox-config="{ reserve: true }" :row-config="{ keyField: 'id',trigger: 'row' }"
            :columnList="commodityColumnList" ref="tabXTableRef" border :showRefresh="true"
            @checkbox-change="selectChangeEvent"
            @checkbox-all="selectAllChangeEvent"
            @searchChange="tabSearchChange">
          </XTable>
        </div>
      </el-main>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="addDialog.visible = false">取消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="savaCommodityDetail">确定</el-button>
          </span>
        </div>
      </template>
    </el-drawer>


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

<script setup name="CommodityInventoryCheck" lang="ts">
import { listCommodity } from '@/api/order/commodity';
import { addInventoryCheck, listInventory, addCommodityCheck, listRelaInventory, unLockRelaInventory } from '@/api/inventory/inventory';
import { InventoryVO, InventoryQuery, InventoryTypeEnum, inventoryTypeStrings, InventoryForm } from '@/api/inventory/inventory/types';
import { getBaseStorage } from "@/api/system/config";
import { VXETable, VxeTableInstance, VxeTableEvents, VxeTablePropTypes } from 'vxe-table';
import { CommodityVO } from '@/api/order/commodity/types';
import tab from '@/plugins/tab';
import { fa } from 'element-plus/es/locale';
import {MaterialApplyVO, RawMaterialVO} from "@/api/purchase/materialApply/types";
const baseStorage = ref<any[]>([]);
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const buttonLoading = ref(false);

const inventoryRelaList = ref<InventoryVO[]>([]);
const inventoryList = ref<InventoryVO[]>([]);
const commodityList = ref<CommodityVO[]>([]);
const checkCommodityList = ref<CommodityVO[]>([]);

const loading = ref(true);

const total = ref(0);
const total2 = ref(0);
const loading2 = ref(true);
const dialogCommodityId = ref();
const tabFormRef = ref();


const commodityDialog = reactive<DialogOption>({ visible: false, title: '' });
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const addDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const initFormData: InventoryForm = {
  id: undefined,
  commodityId: undefined,
  storageId: undefined,
  quantity: undefined,
  customerId: undefined,
  ownerId: undefined
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (!/^[1-9]\d*$/.test(value)) {
    return new Error('请输入正整数')
  } else {
    callback()
  }
}
//Tab正整数校验
const positiveIntValid = (cellValue: any) => {
  if (!/^[1-9]\d*$/.test(cellValue)) {
    return new Error('请输入正整数')
  }
}
VXETable.validators.add('positiveIntValid', {
  cellValidatorMethod({ cellValue }) {
    return positiveIntValid(cellValue)
  }
})

const validRules = ref<VxeTablePropTypes.EditRules>({
  quantity: [
    { required: true, validator: 'positiveIntValid', message: "请输入正整数" }
  ],
})

const listRules = reactive<ElFormRules>({
  shipQuantity: [{ required: true, validator: validatePass2, trigger: 'blur' }],
})

const data = reactive<PageData<InventoryForm, InventoryQuery>>({
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
    shipQuantity: [
      { required: true, message: '请输入出/入库数量', trigger: 'blur' },
    ],
  }
});
const tabData = reactive<PageData<InventoryForm, InventoryQuery>>({
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
    quantity: [
      { required: true, message: '请输入出库数量', trigger: 'blur' },
    ],
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

const XTableRef = ref()
const relaCommodityXTableRef = ref();

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
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '客户编码', field: 'customerCode', align: 'center', filterType: 'input' },
  { title: '产品编码', field: 'commodityCode', align: 'center', filterType: 'input' },
  { title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input' },
  { title: '单位', field: 'unit', align: 'center', },
  { title: '库存数', field: 'quantity', align: 'center', },
  { title: '已锁库存', field: 'relaQuantity', align: 'center', },
  { title: '库存面积', field: 'area', align: 'center', },
  { title: '入库仓', field: 'storageName', align: 'center', width: '120', },
  { title: '操作', field: 'make', align: 'center', width: '120', },
]);
const commodityColumnList = ref([
  { type: 'checkbox', align: 'center', width: '60' },
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '产品编码', field: 'code', align: 'center', filterType: 'input' },
  { title: '产品名称', field: 'name', align: 'center', filterType: 'input' },
  { title: '客户编码', field: 'customerCode', align: 'center', },

]);
const commodityColumnList2 = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '产品编码', field: 'code', },
  { title: '产品名称', field: 'name', },
  { title: '客户编码', field: 'customerCode', align: 'center', },
  { title: '盘入数', field: 'quantity', align: 'center', editRender: {} },
  { title: '入库仓', field: 'storageId', align: 'center', width: '120', editRender: {} },
  { title: '备注', field: 'remark', align: 'center', width: '120', editRender: {} },
  { title: '操作', field: 'make', align: 'center', width: '60', },
]);
const { queryParams, form, rules } = toRefs(data);
const { queryParams: tabQueryParams, form: tabForm, rules: editRules } = toRefs(tabData);

const { queryParams:dialogQueryParams} = toRefs(dialogData);
const drawer = reactive<DialogOption>({ visible: false, title: '' });

// 切换菜单栏 ***********
const radioTableHandle = async (tab: any, event: any) => {
  const radioTable = tab.props.label;
  if (radioTable == "实时库存") {
    await getList();
  }
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
  if (inventoryList.value && inventoryList.value.length > 0) {
    setStorage(inventoryList.value)
  }
  total.value = res.total;
  loading.value = false;
}

const handleAdd = async (type: any, row: any) => {
  form.value = { ...initFormData };
  form.value = JSON.parse(JSON.stringify(row));
  if (type == 'in') {
    dialog.title = "库存盘入";
    form.value.type = "1";
  } else {
    dialog.title = "库存盘出";
    form.value.type = "2";
  }
  form.value.quantity = undefined;
  form.value.remark = undefined;
  dialog.visible = true;
}

const doAdd = async () => {
  form.value = { ...initFormData };
  checkCommodityList.value = [];
  tabQueryParams.value.code = undefined;
  tabQueryParams.value.name = undefined;
  await getCommodityList();
  addDialog.visible = true;
}

const cacelAdd = async () => {
  form.value = { ...initFormData };
  dialog.visible = false;
}

const submitForm = () => {
  tabFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      //新增列表取通用字段
      //form.value.addList = addList.value;
      form.value.backQuantity = form.value.quantity;
      form.value.quantity = form.value.shipQuantity;
      await addInventoryCheck(form.value).then((res) => {
        proxy?.$modal.msgSuccess("修改成功");
        getList();
        dialog.visible = false;
      }).catch((e) => {
        form.value.quantity = form.value.backQuantity;
      }).finally(() => buttonLoading.value = false);

    }
  });

}


/** 导出按钮操作 */
const getListBaseStorage = async () => {
  const res = await getBaseStorage();
  baseStorage.value = res.data;
};
const setStorage = (_list: any[]) => {
  if (_list && _list.length > 0) {
    _list.filter((item: any) => {
      baseStorage.value.forEach((item2) => {
        if (item.storageId == item2.id) {
          item.storageName = item2.name;
        }
      });
    });
  }
}
/** 查询产品列表 */
const tabTotal = ref(0);
const tabTotal2 = ref(0);
const tabXTableRef = ref();
const tabXTableRef2 = ref();

//selectTabChangeEvent
const getCommodityList = async () => {
  const res = await listCommodity(tabQueryParams.value);
  commodityList.value = res.rows;
  tabTotal.value = res.total;
}
// 获取 搜索条件
const tabSearchChange = (params: any) => {
  tabQueryParams.value = params
  getCommodityList()
}

//选择物料 单选
const selectChangeEvent: VxeTableEvents.CheckboxChange<MaterialApplyVO> = ({ checked, row }) => {
  submitPurchase(row);
}

//选择物料全选
const selectAllChangeEvent: VxeTableEvents.CheckboxAll<RawMaterialVO> = () => {
  submitPurchase([]);
}

const submitPurchase = (params: any) => {
  const tabTable = tabXTableRef.value.xTableRef;
  let checkList = tabTable.getCheckboxRecords().concat(tabTable.getCheckboxReserveRecords());
  checkList.forEach((item: any) => {
    item.storageId = 1070;
    item.remark = null;
    item.quantity = null;
  });
  checkCommodityList.value = checkList;
  console.log("checkCommodityList.value", checkCommodityList.value);
}

const deleteTab = (params: any) => {
  checkCommodityList.value = checkCommodityList.value.filter(_check => _check.id != params.id);
}


const savaCommodityDetail = async () => {
  if (!checkCommodityList.value || checkCommodityList.value.length == 0) {
    proxy?.$modal.msgWarning("请选择产品");
    return;
  }
  const $table = tabXTableRef2.value.xTableRef;
  console.log($table)
  if ($table) {
    let errMap = await $table.validate(true);
    console.log(errMap)
    if (errMap) {
      return;
    }
  }

  let allow = true;
  checkCommodityList.value.forEach((item: any) => {
    if (item.quantity == undefined || item.quantity == null || item.quantity == "" || item.quantity == 0) {
      proxy?.$modal.msgWarning("请填写盘入数量");
      allow = false;
      return;
    }
  });
  if (!allow) {
    return;
  }
  checkCommodityList.value.forEach((item: any) => {
    item.storageId = 1070;
    item.type = '1';//盘入
    item.commodityId = item.id;
    item.customerId = item.cusId;
    item.customerName = item.cusName;
  });
  tabForm.value.commodityInventoryBoList = checkCommodityList.value;
  buttonLoading.value = true;
  await addCommodityCheck(tabForm.value).then((res: any) => {
    proxy?.$modal.msgSuccess("修改成功");
    getList();
    addDialog.visible = false;
  }).finally(() => { buttonLoading.value = false; });

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
  getListBaseStorage();
  //getCommodityList();
});
</script>

<style scoped>
:deep(.el-input__inner) {
  text-align: left;
}
</style>
