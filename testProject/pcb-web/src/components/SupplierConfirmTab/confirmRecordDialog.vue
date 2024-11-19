<template>
  <el-dialog title="操作记录" v-model="showFlag" width="60%" draggable destroy-on-close>
    <div>
      <XTable border show-overflow :row-config="{height: 45}" :columnList="columnList" :column-config="{ resizable: true }" height="500" :pageShow="false"
        :data="recordList" :loading="loading">
        <!-- <vxe-column align="center" width="50" field="index" title="序号" type="seq"></vxe-column>
        <vxe-column align="center" field="ownerName" title="所属单位"></vxe-column>
        <vxe-column align="center" width="80" field="createByName" title="操作人"></vxe-column>
        <vxe-column align="center" width="160" field="createTime" title="操作时间"></vxe-column>
        <vxe-column align="center" field="operateContent" title="操作内容"> -->
            <template #default-operateContent="{row}">
              <!-- 里面内容居左 -->
              <div style="text-align: left">{{row.operateContent}}</div>
            </template>
        <!-- </vxe-column>
        <vxe-column align="center"  width="160" field="remark" title="确认备注"></vxe-column> -->
      </XTable>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelRecord">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup name="ContractFileDialog" lang="ts">

import { ref } from 'vue'
import { queryOperateRecordList } from "@/api/purchase/materialOrderDetail";
import {RecordVO} from "@/api/purchase/record/types";
const loading = ref(false);
const recordList = ref<RecordVO[]>([]);

const columnList = ref([
{ width: '50',type: 'seq',title: '序号',field: 'index',align: 'center',  },
{ title: '所属单位',field: 'ownerName',align: 'center',  },
{ width: '80',title: '操作人',field: 'createByName',align: 'center',  },
{ width: '160',title: '操作时间',field: 'createTime',align: 'center',  },
{ title: '操作内容',field: 'operateContent',align: 'center',  },
{ width: '160',title: '确认备注',field: 'remark',align: 'center',  },
]);
/** 取消按钮 */
function cancelRecord() {
  showFlag.value = false;
}

/** 查询操作记录 */
const handleRecord = async (id: any) => {
  loading.value = true;
  const res = await queryOperateRecordList({id:id, orderId:props.orderId});
  recordList.value = res.data;
  loading.value = false;
}
const emits = defineEmits(['update:show'])

const props = withDefaults(defineProps<{
  show: boolean,
  id:any,
  orderId:any
}>(), {
  show: false,
  id: undefined,
  orderId: undefined
})
const showFlag = computed({
  get () {
    return props.show
  },
  set (val) {
    emits('update:show', val)
  }
})
//监听 formShow
watch(() => props.id, (val) => {
  if (val) {
   handleRecord(val);
  }
}, {immediate: true})
</script>

<style></style>
