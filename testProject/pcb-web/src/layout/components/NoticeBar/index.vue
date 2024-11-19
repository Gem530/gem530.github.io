<template>
  <div class="size-icon--style global-flex flex-end primary-color" @click="showNotify">
    <el-badge :value="notifyNum">{{'通知'}}</el-badge>
    <!-- <el-icon size="14" style="margin: 0 0 0 4px;"><arrow-down /></el-icon> -->
  </div>

  <el-drawer class="notice-drawer" v-model="notifyDrawer.visible" :title="notifyDrawer.title" size="40%" draggable append-to-body>
    <el-radio-group v-model="notifyActive" @change="changeNotifyActive" class="nav-bar-radio">
      <el-radio-button label="notify">未读({{notifyNum}})</el-radio-button>
      <el-radio-button label="record">已读({{recordNum}})</el-radio-button>
    </el-radio-group>
    <div class="global-flex flex-end mt2 mb2" style="padding-right: 6px;">
      <el-button icon="CircleCheck" type="primary" plain link v-if="notifyActive === 'notify'" @click="setAllNotifyRead">全部已读</el-button>
      <!-- 以下为占位按钮，无需加事件 -->
      <el-button type="primary" plain link v-else></el-button>
    </div>
    <div style="height: calc(100% - 32px - 30px - 18px);overflow-y: auto;">
      <!-- 虚拟表格，防止数据过多，导致页面卡顿 -->
      <el-auto-resizer>
        <template #default="{ width, height }">
          <el-table-v2
            ref="tableRef"
            :width="width"
            :height="height"
            :row-height="90"
            :header-height="0"
            v-loading="loading"
            class="table-v2-nohover"
            :columns="[{title: 'Id', key: 'id', dataKey: 'id', width: width}]"
            :data="(notifyActive === 'notify' ? notifyList : recordList) || []"
          >
            <template #cell="{ rowData: item }">
              <!-- 未读 -->
              <el-card class="notice-card" shadow="never" v-if="notifyActive === 'notify'" :key="item.id">
                <el-button icon="CircleCheck" type="primary" plain link class="read-btn" @click="setNotifyRead(item)">已读</el-button>
                <div class="notice-card-title text item mb2 overflow-omit">{{item.title}}</div>
                <div class="notice-card-time text item mb2 overflow-omit">{{item.createTime}}</div>
                <div class="notice-card-time text item overflow-omit">{{item.content}}</div>
              </el-card>
              <!-- 已读 -->
              <el-card class="notice-card" shadow="never" v-if="notifyActive === 'record'" :key="item.id">
                <div class="notice-card-title text item mb2 no-right-padding overflow-omit">{{item.title}}</div>
                <div class="notice-card-time text item mb2 overflow-omit">{{item.createTime}}</div>
                <div class="notice-card-time text item overflow-omit">{{item.content}}</div>
              </el-card>
            </template>
          </el-table-v2>
        </template>
      </el-auto-resizer>
    </div>
    <template #footer>
      <div class="global-flex flex-center">
        <el-button style="width: 120px;" @click="notifyDrawer.visible = false">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="NoticeBar">
import { getNotifyNum, getNotifyListAndNum } from '@/api/notification/notify';
import { NotifyVO } from '@/api/notification/notify/types';
import { getRecordNum, readNotify, readAllNotify, getNotifyRecordListAndNum } from '@/api/notification/notifyRecord';
import { NotifyRecordVO } from '@/api/notification/notifyRecord/types';
onMounted(() => {
  queryNotifyNum()
  queryRecordNum()
});
// loading
const loading = ref(false)
// 通知相关
const notifyActive = ref('notify')
// 代表标签切换
const changeNotifyActive = (value?: any) => {
  notifyActive.value = value ? value : notifyActive.value
  notifyList.value = []
  recordList.value = []
  if (notifyActive.value === 'notify') {
    getNotifyList()
  } else if (notifyActive.value === 'record') {
    getProcessedList()
  }
}
const notifyDrawer = reactive<DialogOption>({
  visible: false,
  title: ''
});
const showNotify = () => {
  notifyDrawer.visible = true
  notifyDrawer.title = "通知提醒"
  changeNotifyActive()
}
/**
 * 已读/未读查询相关参数
 */
const notifyData = reactive({
  category: null,
  title: null
})
const notifyList = ref<NotifyVO[]>([]);
const recordList = ref<NotifyRecordVO[]>([]);
/**
 * 获取未读通知列表
 */
const getNotifyList = async () => {
  loading.value = true
  const res = await getNotifyListAndNum(notifyData).finally(() => loading.value = false);
  notifyList.value = res.data.notifyList || []
  notifyNum.value = res.data.notifyNum;
  recordNum.value = res.data.recordNum;
}
/**
 * 获取已读列表
 */
const getProcessedList = async () => {
  loading.value = true
  const res = await getNotifyRecordListAndNum(notifyData).finally(() => loading.value = false);
  recordList.value = res.data.recordList || []
  notifyNum.value = res.data.notifyNum;
  recordNum.value = res.data.recordNum;
}
/**
 * 未读数量
 */
const notifyNum = ref(<number>0);
/**
 * 获取未读数量
 */
const queryNotifyNum = async () => {
  const res = await getNotifyNum(notifyData)
  notifyNum.value = res.data;
}
/**
 * 已读数量
 */
const recordNum = ref(<number>0);
/**
 * 获取已读数量
 */
const queryRecordNum = async () => {
  const res = await getRecordNum(notifyData)
  recordNum.value = res.data;
}
/**
 * 设置通知为已读
 */
const setNotifyRead = async (item) => {
  loading.value = true
  console.log('item===>>>', item.id)
  await readNotify({id: item.id}).finally(() => {
    loading.value = false
    queryNotifyNum()
    queryRecordNum()
    getNotifyList()
  });
}
/**
 * 设置所有通知为已读
 */
const setAllNotifyRead = async () => {
  loading.value = true
  await readAllNotify().finally(() => {
    loading.value = false
    queryNotifyNum()
    queryRecordNum()
    getNotifyList()
  });
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
    position: relative;
    padding: 10px;

    .read-btn {
      position: absolute;
      top: 7px;
      right: 12px;
    }

    .notice-card-title {
      padding-right: 75px;
      font-size: 14px;
      color: rgba(16,16,16,1);
      &.no-right-padding {
        padding-right: 0px;
      }
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
