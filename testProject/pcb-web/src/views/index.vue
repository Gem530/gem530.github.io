<template>
  <div class="p-2 home">
    <el-card class="home-top" shadow="hover">
      <template #header>我的收藏页</template>
      <div class="collect-list" v-if="collectViews?.length">
      <router-link
        v-for="tag in collectViews"
        :key="tag.path"
        :data-path="tag.path"
        :to="{ path: tag.path ? tag.path : '', query: tag.query, fullPath: tag.fullPath ? tag.fullPath : '' }"
        class="collect-item"
        :style="{ '--hover-color': hoverColor }"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)" class="collect-close">
          <close class="el-icon-close" style="width: 1em; height: 1em;vertical-align: middle;" />
        </span>
      </router-link>
    </div>
    <div v-else>暂无收藏页</div>
    </el-card>
    <el-card shadow="hover">
      <template v-if="state.total > 0">
        <div class="home-notice-title max-width-img" v-html="state.noticeInfo?.noticeTitle"></div>
        <div class="home-notice-time max-width-img" v-html="state.noticeInfo?.createTime"></div>
        <div class="home-notice-content max-width-img" v-html="state.noticeInfo?.noticeContent"></div>
        <div class="home-notice-btn">
          <el-button link type="primary" @click="prevOrNext(form.pageNum - 1)" v-if="form.pageNum != 1">上一篇</el-button>
          <div class="home-notice-grow"></div>
          <el-button link type="primary" @click="prevOrNext(form.pageNum + 1)" v-if="form.pageNum < state.total">下一篇</el-button>
        </div>
      </template>
      <template v-else>
        暂无通知~
      </template>
    </el-card>
  </div>
</template>

<script setup name="Index" lang="ts">
import { TagView, RouteOption } from 'vue-router';
import useSettingsStore from "@/store/modules/settings";
import useTagsViewStore from "@/store/modules/tagsView";
import { initWebSocket } from '@/utils/websocket';
import { listNotice, getNotice, delNotice, addNotice, updateNotice } from "@/api/system/notice";
import { NoticeForm, NoticeQuery, NoticeVO } from "@/api/system/notice/types";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

onMounted(() => {
  let protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
  initWebSocket(protocol + window.location.host + import.meta.env.VITE_APP_BASE_API + "/resource/websocket");
});


const route = useRoute();
const settingsStore = useSettingsStore()
const tagsViewStore = useTagsViewStore()
const goTarget = (url:string) => {
  window.open(url, '__blank')
}
const collectViews = ref<TagView[]>([])
const hoverColor = computed(() => settingsStore.theme)
watch(() => tagsViewStore.collectViews, (val) => {
  collectViews.value = val
}, { deep: true, immediate: true })
const isAffix = (tag: TagView) => {
    return tag.meta && tag.meta.affix;
}
const closeSelectedTag = (tag: TagView) => {
  tagsViewStore.delCollectView(tag)
}

const form = ref({
  pageNum: 1,
  pageSize: 1,
})
const state = reactive<Record<string, any>>({
  total: 0,
  noticeInfo: {
    noticeTitle: '',
    noticeContent: '',
    createTime: '',
  }
})
/** 查询公告列表 */
const getList = () => {
  proxy?.$modal.loading()
  listNotice(form.value).then((res: any) => {
    proxy?.$modal.closeLoading()
    if (res.code == 200) {
      state.noticeInfo = res?.rows[0]
      state.total = res.total;
    }
  }).catch((err: Error) => {
    proxy?.$modal.closeLoading()
  })
}
// 上下页
const prevOrNext = (page: number) => {
  form.value.pageNum = page
  getList()
}
getList()
</script>

<style scoped lang="scss">
:deep(.max-width-img) {
  img,video {
    max-width: 100% !important;
  }
}
.home {
  // display: flex;
  // flex-direction: column;
  height: 100%;
  padding: 20px;
  .home-top {
    margin-bottom: 10px;
    // box-shadow: none;
  }
  .collect-title {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: 500;
  }
  .collect-list {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .collect-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 5px 10px;
      margin: 0 6px 8px 0;
      border: 1px solid #e4e7ed;
      font-size: 12px;
      border-radius: 2px;
      transition: box-shadow 0.2s;

      &:hover {
        box-shadow: 1px 1px 5px #e4e7ed;
        // color: #409EFF;
        color: var(--hover-color);
      }

      .collect-close {
        margin-left: 10px;
      }
    }
  }
  .home-notice-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .home-notice-time {
    font-size: 14px;
    color: #999;
    margin-bottom: 20px;
  }
  :deep(.home-notice-content) {
    font-size: 16px;
    margin-bottom: 20px;

    img,video {
      max-width: 100%;
    }
  }
  .home-notice-btn {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .home-notice-grow {
      flex-grow: 1;
    }
  }
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>
