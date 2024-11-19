<template>
    <el-dialog v-model="open" :title="props.title" width="50%" destroy-on-close @close="closeHandle">
      <el-row style="height: 480px;">
        <el-alert title="以下明细正在盘点中，需要等待盘点结束才能进行出入库操作" type="warning" show-icon :closable="false" />
        <el-col :span="24">
          <!-- 产品Table -->
          <XTable v-if="props.inventoryType == 1" toolId="commodityToolId"
                  :pageShow="true" v-model:page-size="queryParamsCommodity.pageSize"
                  v-model:current-page="queryParamsCommodity.pageNum"
                  :page-params="{ perfect: true, total: commodityTotal}"
                  :data="commodityList"
                  height="400"
                  :loading="loading"
                  :columnList="commodityColumnList"
                  ref="xTableRef" border :showRefresh="true"
                  @searchChange="searchChangeCommodity"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField: 'id' }">
            <template #default-units="scope">
              <div>PCS</div>
            </template>
            <template #default-commodityCode="scope">
              <div>{{ scope.row.code }}</div>
            </template>
            <template #default-commodityName="scope">
              <div>{{ scope.row.name }}</div>
            </template>
          </XTable>
        </el-col>

        <el-col :span="24">
          <!-- 物料Table -->
          <XTable v-if="props.inventoryType == 2" toolId="materialToolId"
                  :pageShow="true" v-model:page-size="queryParamsMaterial.pageSize"
                  v-model:current-page="queryParamsMaterial.pageNum"
                  :page-params="{ perfect: true, total: materialsTotal }"
                  :data="materialList"
                  height="400"
                  :loading="loading"
                  :columnList="materialColumnList"
                  ref="xTableRef" border :showRefresh="true"
                  @searchChange="searchChangeMaterial"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField: 'id' }">

            <template #default-materialCode="scope">
              <div>{{ scope.row.code }}</div>
            </template>
            <template #default-materialName="scope">
              <div>{{ scope.row.name }}</div>
            </template>
          </XTable>
        </el-col>

      </el-row>
      <template #footer>
                    <el-button plain type="primary" @click="closeHandle">我知道了</el-button>
      </template>
    </el-dialog>
</template>

<script setup lang="ts" name="SelectMaterial">
import {ref} from "vue";
import {listCommodityInventory} from "@/api/order/commodity";
import {listMaterialInventoryInfo} from "@/api/purchase/materialApply";
import {getBaseStorage} from "@/api/system/config";

const emits = defineEmits(['update:show', 'update:data', 'update:inventoryType', 'close'])
const props = withDefaults(defineProps<{
    data: any[]
    show: boolean
    title?: string
    inventoryType?: string|number
}>(), {
    show: false,
})

const open = computed({
  get() { return props.show },
  set(val: boolean) { emits('update:show', val) }
})

const commodityList = ref<any[]>(props.data);

const materialList = ref<any[]>(props.data);

const queryParamsCommodity = ref({
  pageNum: 1,
  pageSize: 20,
  params: {}
});

const queryParamsMaterial = ref({
  pageNum: 1,
  pageSize: 20,
  params: {}
});

const loading = ref(false);
const commodityTotal = ref(0);
const materialsTotal = ref(0);

const commodityColumnList = ref([
  {minWidth: '40', title: "序号", type: 'seq', field: 'index', align: 'center', },
  {minWidth: '160', title: '产品编码', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入产品编码'}},
  {minWidth: '200',title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入产品名称'}},
  {minWidth: '140', title: '客户编码', field: 'customerCode', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入客户编码'}},
  {minWidth: '100', title: '单位', field: 'units', align: 'center'},
  {minWidth: '100', title: '所属仓库', field: 'storageName', align: 'center'},
]);

const materialColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '40'},
  {minWidth: '100', title: '物料编码', field: 'materialCode', align: 'center'},
  {minWidth: '100', title: '物料名称', field: 'materialName', align: 'center'},
  {minWidth: '80', title: '物料类别', field: 'categoryName', align: 'center'},
  {minWidth: '60', title: '单位', field: 'units', align: 'center'},
  {minWidth: '70', title: '材质牌号', field: 'materialQuality',  align: 'center'},
  {minWidth: '60', title: '铜厚', field: 'copperThickness', align: 'center'},
  {minWidth: '60', title: '颜色', field: 'color', align: 'center'},
  {minWidth: '60', title: '级别', field: 'level', align: 'center'},
  {minWidth: '60', title: '长', field: 'length', align: 'center'},
  {minWidth: '60', title: '宽', field: 'width', align: 'center'},
  {minWidth: '80', title: '品牌', field: 'manufacturer', align: 'center'},
]);

/** 产品搜索条件 */
const searchChangeCommodity = async (params: any) => {
  loading.value = true;
  params.IdList = props.data?.map(item => item.id)
  const res = await listCommodityInventory(params);
  commodityList.value = res.rows;
  if (commodityList.value && commodityList.value.length > 0) {
    setStorage(commodityList.value)
  }
  commodityTotal.value = res.total;
  loading.value = false;
}

/** 查询物料库存列表 */
const searchChangeMaterial = async (params: any) => {
  loading.value = true;
  params.idList = props.data?.map(item => item.id)
  const res = await listMaterialInventoryInfo(params);
  materialList.value = res.rows;
  materialsTotal.value = res.total;
  loading.value = false;
}

// 取消事件
const closeHandle = () => {
  emits('close')
  console.log('取消事件')
}

const baseStorage = ref<any[]>([]);

/** 获取仓库信息 */
const getListBaseStorage = async () => {
  const res = await getBaseStorage();
  baseStorage.value = res.data;
};

/** 设置仓库名称 */
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

watch(() => open.value, async () => {
  console.log('props.inventoryType', props.inventoryType)
  await getListBaseStorage();
  if (props.inventoryType == 1) {
    commodityList.value = props.data;
    setStorage(commodityList.value);
    commodityTotal.value = props.data.length;
  } else if (props.inventoryType == 2) {
    materialList.value = props.data;
    materialsTotal.value = props.data.length;
  }
});
</script>

<style lang="scss" scoped></style>
