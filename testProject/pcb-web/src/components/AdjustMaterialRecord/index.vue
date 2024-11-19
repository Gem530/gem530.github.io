<template>
  <!-- 物料调整记录 -->
  <el-dialog v-model="open" :title="props.title" width="50%" draggable destroy-on-close @close="closeHandle">
    <div v-if="props.type == '1'" class="p-2">
      采购单号：<span style="color: rgba(93, 125, 179, 1);">{{ selectMaterial.orderCode }}</span>&nbsp;&nbsp;&nbsp;&nbsp;当前物料：<span style="color: rgba(93, 125, 179, 1);">{{ selectMaterial.baseRawMaterialCode }}</span>
    </div>
    <div v-else class="p-2">
      退货单号：<span style="color: rgba(93, 125, 179, 1);">{{ selectMaterial.code }}</span>&nbsp;&nbsp;&nbsp;&nbsp;当前物料：<span style="color: rgba(93, 125, 179, 1);">{{ selectMaterial.materialCode }}</span>
    </div>
    <XTable v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum"
            :page-params="{ perfect: true, total: total }" :data="recordList" :columnList="columnList"
            height="400" class="xtable-content" :loading="loading"
            :intervalCondition="['beforeQuantity', 'quantity', 'createTime', 'auditTime']"
            border @searchChange="searchChange" :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }">
    </XTable>

    <template #footer>
      <div style="display: flex; justify-content: center;">
        <el-button @click="closeHandle">关闭</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script setup lang="ts" name="SelectMaterial">
import {ref} from "vue";
import useUserStore from "@/store/modules/user";
import {listMaterialStorage} from "@/api/purchase/materialStorage";
import {VxeTablePropTypes} from "vxe-table";
import {BigNumber} from "bignumber.js";
import {MaterialQuantityAdjustVO} from "@/api/purchase/materialQuantityAdjust/types";
import {
  listBackQuantityAdjust,
  listMaterialQuantityAdjust,
  listReceiveQuantityAdjust
} from "@/api/purchase/materialQuantityAdjust";
import {deepClone} from "@/utils";

const attrs = useAttrs()
const emits = defineEmits(['update:show', 'close'])
const props = withDefaults(defineProps<{
  show: boolean
  title?: string
  selectMaterial?: any
  type?: string
}>(), {
  show: false,
})

const open = computed({
    get() { return props.show },
    set(val: boolean) { emits('update:show', val) }
})

const initQueryParams = {
  pageNum: 1,
  pageSize: 20,
  type: props.type,
  rawMaterialId: props.selectMaterial?.rawMaterialId,
  statusList: ['1', '2'],
  params: {}
}

const queryParams = ref(deepClone(initQueryParams));

const total = ref(0);
const loading = ref(false);

const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60', fixed: 'left',  },
  { title: '申请人', field: 'createByName',  minWidth: '80',align: 'center', filterType: 'input', filterParam: { placeholder: '' },  },
  { title: '申请时间', field: 'createTime',  minWidth: '160',align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
  { title: '修改前数量', field: 'beforeQuantity',  minWidth: '100',align: 'center', filterType: 'intervalNumber', },
  { title: '修改后数量', field: 'quantity',  minWidth: '100',align: 'center', filterType: 'intervalNumber', },
  { title: '审核人', field: 'auditUserName',  minWidth: '80',align: 'center', filterType: 'input', filterParam: { placeholder: '' },  },
  { title: '审核时间', field: 'auditTime',  minWidth: '160',align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
]);

const recordList = ref<MaterialQuantityAdjustVO[]>([]);

/** 调整记录搜索条件 */
const searchChange = (params: any) => {
  params.type = props.type;
  queryParams.value = params;
  getAdjustRecordList();
}

/**  查询收货调整记录 */
const getAdjustRecordList = async () => {
  queryParams.value.rawMaterialId = props.selectMaterial.rawMaterialId;
  queryParams.value.statusList = ['1', '2'];
  queryParams.value.bizId = props.selectMaterial.id;
  loading.value = true;
  const res = await listMaterialQuantityAdjust(queryParams.value).finally(() => loading.value = false);
  recordList.value = res.rows;
  total.value = res.total;
}

// 取消事件
const closeHandle = () => {
    emits('close')
    console.log('取消事件')
}

watch(() => [props.show], (val: any, old: any) => {
  queryParams.value = deepClone(initQueryParams);
  if (val == 'true') {
    getAdjustRecordList();
  }
})


</script>

<style lang="scss" scoped>
:deep(.el-collapse-item__content) {
  padding-bottom: 1px !important;
}
</style>
