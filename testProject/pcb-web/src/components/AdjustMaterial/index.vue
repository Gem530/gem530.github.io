<template>
  <!-- 收货调整 -->
  <el-drawer size="80%" v-model="open" :title="props.title"  destroy-on-close @close="closeHandle">
    <el-collapse v-model="activeNames" v-loading="props.loading">
       <el-collapse-item title="基本信息" name="1">
         <!-- 主体 -->
         <el-form border label-width="100px">
           <el-row>
             <el-col :span="6">
               <el-form-item label="申请人：">
                 <!--当前登录用户-->
                 <el-input v-model="userName" placeholder="userName" disabled/>
               </el-form-item>
             </el-col>
             <el-col :span="6">
               <el-form-item label="申请时间：">
                 <el-input v-model="currentTime" placeholder="currentTime" disabled/>
               </el-form-item>
             </el-col>
           </el-row>
         </el-form>
       </el-collapse-item>

       <el-collapse-item :title="props.type == '1' ? '收货明细' : '退货明细'" name="2">
         <XTable
           :page-show="false" v-model:page-size="queryParams.pageSize"
           v-model:current-page="queryParams.pageNum"
           :page-params="{ perfect: true, total: props.total }"
           border :toolId="props.tableToolId"
           keep-source
           height="545px"
           show-overflow
           ref="xTable"
           :loading="selectLoading"
           :data="data"
           :columnList="columnList"
           :footer-method="footerMethod"
           :column-config="{ resizable: true }"
           show-footer
           @searchChange="pageChange"
           show-footer-overflow
           :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
         >
           <template v-if="!props.title?.includes('审核') " #edit-quantity="{ row }">
             <el-input-number v-model="row.quantity" :min="0.01" :precision="2" :controls="false" style="width: 100%;"></el-input-number>
           </template>
           <template #default-storageId="{ row }">
             {{ storageList.find(item => item.id == row.storageId)?.name }}
           </template>
           <template #edit-remark="{ row }">
             <el-input v-model="row.remark"></el-input>
           </template>
           <template #default-make="{ row,rowIndex }">
             <el-button link type="primary"  @click="removeHandle(rowIndex)">移除</el-button>
           </template>
         </XTable>
       </el-collapse-item>
    </el-collapse>

    <template #footer>
      <div style="display: flex; justify-content: center;">
         <span class="dialog-footer">
           <el-button v-if="!props.isAudit" :loading="buttonLoading" type="primary" @click="confirmHandle">提交申请</el-button>
           <el-button v-if="props.isAudit" :loading="buttonLoading" type="primary" @click="rejectHandle">审核驳回</el-button>
           <el-button v-if="props.isAudit" :loading="buttonLoading" type="primary" @click="auditHandle">审核通过</el-button>
           <el-button :loading="buttonLoading" @click="closeHandle">取消</el-button>
         </span>
      </div>
    </template>
  </el-drawer>

</template>

<script setup lang="ts" name="SelectMaterial">
import {ref} from "vue";
import useUserStore from "@/store/modules/user";
import {listMaterialStorage} from "@/api/purchase/materialStorage";
import {VxeTablePropTypes} from "vxe-table";
import {BigNumber} from "bignumber.js";

const attrs = useAttrs()
const emits = defineEmits(['update:show', 'update:loading', 'searchChange', 'confirm', 'close', 'remove', 'audit', 'reject'])
const props = withDefaults(defineProps<{
  data: any[]
  total: number
  show: boolean
  title?: string
  loading: boolean
  columnList: any[]
  buttonLoading: boolean
  queryParams: any
  validRules: any
  applyName?: string
  applyTime?: any
  isAudit?: boolean
  tableToolId?: string
  type?: string
}>(), {
  total: 0,
  show: false,
  loading: false,
  buttonLoading: false,
  isAudit: false,
})

const userName = props.isAudit ? props.data[0].createByName : useUserStore().nickname;

// 使用 ref 创建 currentTime 变量
const currentTime = props.isAudit ? props.data[0].createTime : ref(getCurrentTime());
// 获取当前时间的方法
function getCurrentTime() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Intl.DateTimeFormat('zh-CN', options).format(now);
}
// 更新当前时间
function updateCurrentTime() {
  const update = () => {
    currentTime.value = getCurrentTime();
    requestAnimationFrame(update); // 递归调用，实现动画效果
  };
  update(); // 启动更新
}

const storageList =  ref<any[]>([]);
// const dialogLoding = ref(false)
// const buttonLoading = ref(false)
const activeNames = ref(['1','2'])

const open = computed({
    get() { return props.show },
    set(val: boolean) { emits('update:show', val) }
})
const selectLoading = computed({
    get() { return props.loading },
    set(val: boolean) { emits('update:loading', val) }
})

// 搜索条件变化
const pageChange = (params: any) => {
    console.log('params', params)
    emits('searchChange', params)
}

// 确认事件
const confirmHandle = () => {
    emits('confirm')
    console.log('确认事件')
}

// 审核事件
const auditHandle = () => {
  emits('audit')
  console.log('审核事件')
}

// 驳回事件
const rejectHandle = () => {
  emits('reject')
  console.log('驳回事件')
}

// 取消事件
const closeHandle = () => {
    emits('close')
    console.log('取消事件')
}

// 移除事件
const removeHandle = (rowIndex: number) => {
  emits('remove', rowIndex)
  console.log('移除事件')
}

/** 查询仓库信息 */
const getStorageList = async () => {
  const res = await listMaterialStorage();
  storageList.value = res.rows;
}

/** 表格合计 */
const footerMethod: VxeTablePropTypes.FooterMethod<any> = ({columns, data}) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return "合计";
      }
      if(column.field.includes("materialQuantity") || column.field.includes("receiveQuantity")
        || column.field.includes("backQuantity") || column.field.includes("quantity")) {
        return `${sumNum(data, column.field)} `;
      }
      return "";
    })
  ];
};

const sumNum = (list:any, field:any) => {
  let count = 0;
  list.forEach(item => {
    if(item[field]) {
      count = BigNumber(Number(item[field])).plus(BigNumber(Number(count))).toNumber();
    }
  });
  return count;
};

onMounted(() => {
  if(!props.isAudit) {
    updateCurrentTime();
  }
  getStorageList();
});

</script>

<style lang="scss" scoped>
:deep(.el-collapse-item__content) {
  padding-bottom: 1px !important;
}
</style>
