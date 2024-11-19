<template>
    <div class="size-icon--style global-flex flex-end primary-color" @click="showPending">
        <el-badge :value="pendingNum">{{'待办'}}</el-badge>
        <!-- <el-icon size="14" style="margin: 0 0 0 4px;"><arrow-down/></el-icon> -->
    </div>

    <el-drawer class="notice-drawer" v-model="pendingDrawer.visible" :title="pendingDrawer.title" size="40%" draggable append-to-body>
    <el-radio-group v-model="pendingActive" @change="changePendingActive" class="nav-bar-radio">
        <el-radio-button label="pending">待办({{pendingNum}})</el-radio-button>
        <el-radio-button label="processed">已办({{recordNum}})</el-radio-button>
    </el-radio-group>
    <div class="global-flex flex-end mt2 mb2" style="padding-right: 6px;">
        <el-select
        v-model="pendingData.category"
        placeholder="全部"
        style="width: 140px"
        clearable
        @change="changePendingCategory"
        >
        <el-option
            v-for="item in PendingCategory"
            :key="item.code"
            :label="item.name"
            :value="item.code"
        />
        </el-select>
    </div>
    <div style="height: calc(100% - 32px - 30px - 18px);overflow-y: auto;">
        <!-- 虚拟表格，防止数据过多，导致页面卡顿 -->
        <el-auto-resizer>
          <template #default="{ width, height }">
            <el-table-v2
              ref="tableRef"
              :width="width"
              :height="height"
              :row-height="68"
              :header-height="0"
              v-loading="loading"
              class="table-v2-nohover"
              :columns="[{title: 'Id', key: 'id', dataKey: 'id', width: width}]"
              :data="(pendingActive === 'pending' ? pendingList : processedList) || []">
              <template #cell="{ rowData: item }">
                <!-- 待办 -->
                <el-card class="notice-card" shadow='never' v-if="pendingActive === 'pending'" :key="item.id" @click="pendingRoute(item)">
                  <div class="notice-card-title text item mb2 overflow-omit" >{{item.title}}</div>
                  <div class="notice-card-time text item overflow-omit" >{{item.createTime}}</div>
                </el-card>
                <!-- 已办 -->
                <el-card class="notice-card" shadow='never' v-if="pendingActive === 'processed'" :key="item.id">
                  <div class="notice-card-title text item mb2 overflow-omit" >{{item.title}}</div>
                  <div class="notice-card-time text item overflow-omit" >{{item.createTime}}</div>
                </el-card>
              </template>
            </el-table-v2>
          </template>
        </el-auto-resizer>
    </div>
    <template #footer>
        <div class="global-flex flex-center">
        <el-button style="width: 120px;" @click="pendingDrawer.visible = false">关闭</el-button>
        </div>
    </template>
    </el-drawer>
</template>

<script setup lang="ts" name="Agency">
import { getPendingNum, getPendingListAndNum } from '@/api/notification/pending';
import { PendingVO, PendingCategory } from '@/api/notification/pending/types';
import { getRecordNum, getPendingRecordListAndNum } from '@/api/notification/pendingRecord';
import { PendingRecordVO } from '@/api/notification/pendingRecord/types';
import { verifyJumpCondition } from '@/api/notification/pendingConfig'
import { encryptBase64ByStr } from '@/utils/crypto'

onMounted(() => {
  queryPendingNum()
  queryRecordNum()
});
const router = useRouter();
// loading
const loading = ref(false)
// 待办相关
const pendingActive = ref('pending')
// 代表标签切换
const changePendingActive = (value?: any) => {
  pendingList.value = []
  processedList.value = []
  pendingActive.value = value ? value : pendingActive.value
  if (pendingActive.value === 'pending') {
    getPendingList()
  } else if (pendingActive.value === 'processed') {
    getProcessedList()
  }
}
const pendingDrawer = reactive<DialogOption>({
  visible: false,
  title: ''
});
const showPending = () => {
  pendingDrawer.visible = true
  pendingDrawer.title = "待办事项"
  changePendingActive()
}
/**
 * 待办/已办查询相关参数
 */
const pendingData = reactive({
  category: null,
  title: null
})
const pendingList = ref<PendingVO[]>([]);
const processedList = ref<PendingRecordVO[]>([]);
/**
 * 获取待办列表
 */
const getPendingList = async () => {
  loading.value = true
  const res = await getPendingListAndNum(pendingData).finally(() => loading.value = false);
  pendingList.value = res.data.pendingList || []
  pendingNum.value = res.data.pendingNum;
  recordNum.value = res.data.recordNum;
}
/**
 * 获取已办列表
 */
const getProcessedList = async () => {
  loading.value = true
  const res = await getPendingRecordListAndNum(pendingData).finally(() => loading.value = false);
  processedList.value = res.data.recordList || []
  pendingNum.value = res.data.pendingNum;
  recordNum.value = res.data.recordNum;
}
/**
 * 待办数量
 */
const pendingNum = ref(<number>0);
/**
 * 获取待办数量
 */
const queryPendingNum = async () => {
  const res = await getPendingNum(pendingData)
  pendingNum.value = res.data;
}
/**
 * 已办数量
 */
const recordNum = ref(<number>0);
/**
 * 获取已办数量
 */
const queryRecordNum = async () => {
  const res = await getRecordNum(pendingData)
  recordNum.value = res.data;
}
/**
 * 待办分类选择
 */
const changePendingCategory = () => {
  changePendingActive()
}
/**
 * 待办跳转
 */
const pendingRoute = async (item) => {
  let paramsObject = {};
  if (item.param && item.param.length > 0) {
    paramsObject = item.param.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});
  }
  await verifyJumpCondition({menuId : item.menuId})
  if (item.menuPath) {
    let encryptStr = encryptBase64ByStr(JSON.stringify({
      bizNo: item.bizNo,
      ...paramsObject
    }))
    router.push({
      path: item.menuPath,
      query: {
        pendingParams: encryptStr
      }
    }).then(() => {
      pendingDrawer.visible = false
    });
  } else {
    // 提示菜单不存在
    ElMessage.error('未设置跳转页面，请联系管理员！');
  }


}
</script>

<style lang="scss" scoped>
.size-icon--style {
  height: 100%;
  font-size: 12px;
  // color: #3d3d3d;
  // line-height: 14px;
  padding: 0 8px;
  cursor: pointer;
}
.nav-bar-radio {
  width: 100%;
  padding-right: 6px;
  .el-radio-button {
    flex: 1;
    :deep(.el-radio-button__inner) {
      width: 100%;
    }
  }
}
.notice-card {
  width: 100%;
  :deep(.el-card__body) {
    padding: 10px;

    .notice-card-title {
      font-size: 14px;
      color: rgba(16,16,16,1);
    }
    .notice-card-time {
      font-size: 12px;
      color: rgba(145,145,145,1);
    }
  }
}

:deep(.table-v2-nohover) {
  --el-table-border: none;
  --el-table-row-hover-bg-color: transparent;

  .el-table-v2__row {
    .el-table-v2__row-cell {
      padding: 0px;
    }
  }
}
</style>
<style lang="scss">
.notice-drawer {
  .el-drawer__header {
    font-size: 20px;
    color: rgb(23,43,77);
    font-weight: 600;
  }
}
</style>
