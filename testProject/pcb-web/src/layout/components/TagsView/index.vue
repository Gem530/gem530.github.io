<template>
  <div id="tags-view-container" class="tags-view-container">
    <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :data-path="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path ? tag.path : '', query: tag.query, fullPath: tag.fullPath ? tag.fullPath : '' }"
        class="tags-view-item"
        :style="activeStyle(tag)"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <svg-icon class-name="home-icon" icon-class="home-active" style="width: 14px;height: 14px;" v-if="tag.name == 'Index'"></svg-icon>
        <span :class="`tags-view-item-text ${tag.name == 'Index' && 'no-right-padding'}`">{{tag.title}}</span>
        <span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)">
          <svg-icon icon-class="tag-close" style="width: 16px; height: 14px;vertical-align: middle;margin-top: -1px;"></svg-icon>
        </span>
      </router-link>
    </scroll-pane>
    <el-popover :visible="showSearch" placement="bottom-end" width="200px" popper-class="pop-tags-view"
        @show="isShowSearch = true" @hide="isShowSearch = false">
        <template #reference>
            <div class="check-menu-class global-flex flex-end" @click="openSearch" style="cursor: pointer;">
                查找菜单
                <el-icon style="margin-left: 4px;"><ArrowDown /></el-icon>
            </div>
        </template>
        <div v-click-outside="clickOutside">
            <el-input v-model="searchTag" placeholder="请输入菜单名称" clearable/>
            <div class="pop-tags-box">
                <template
                    v-for="tag in visitedViews"
                    :key="tag.path">
                    <router-link
                        v-if="(searchTag && tag.title.includes(searchTag)) || !searchTag"
                        :data-path="tag.path"
                        :class="isActive(tag) ? 'active' : ''"
                        :to="{ path: tag.path ? tag.path : '', query: tag.query, fullPath: tag.fullPath ? tag.fullPath : '' }"
                        class="pop-tags-item"
                        :style="activeStyle(tag)"
                        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
                        @click="showSearch = false"
                        @contextmenu.prevent="openMenu(tag, $event)"
                    >
                        <div class="pop-tags-title"><span>{{ tag.title }}</span></div>
                        <span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)" class="close-width">
                            <close class="el-icon-close" style="width: 1em; height: 1em;vertical-align: middle;" />
                        </span>
                    </router-link>
                </template>
            </div>
        </div>
    </el-popover>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)"><refresh-right style="width: 1em; height: 1em;" /> 刷新页面</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)"><close style="width: 1em; height: 1em;" /> 关闭当前</li>
      <li @click="closeOthersTags"><circle-close style="width: 1em; height: 1em;" /> 关闭其他</li>
      <li v-if="!isFirstView()" @click="closeLeftTags"><back style="width: 1em; height: 1em;" /> 关闭左侧</li>
      <li v-if="!isLastView()" @click="closeRightTags"><right style="width: 1em; height: 1em;" /> 关闭右侧</li>
      <li @click="closeAllTags(selectedTag)"><circle-close style="width: 1em; height: 1em;" /> 全部关闭</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import ScrollPane from './ScrollPane.vue'
import { getNormalPath } from '@/utils/ruoyi'
import useTagsViewStore from "@/store/modules/tagsView";
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import { ComponentInternalInstance } from "vue";
import { RouteOption, TagView, RouteLocationRaw } from "vue-router";
import { ClickOutside as vClickOutside } from 'element-plus'
import {deepClone} from "@/utils";
import useAppStore from '@/store/modules/app';

const visible = ref(false);
const top = ref(0);
const left = ref(0);
const appStore = useAppStore();
const selectedTag = ref<TagView>({});
const affixTags = ref<TagView[]>([]);
const scrollPaneRef = ref(ScrollPane);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const route = useRoute();
const router = useRouter();

const visitedViews = computed(() => useTagsViewStore().visitedViews);
const routes = computed(() => usePermissionStore().routes);
const theme = computed(() => useSettingsStore().theme);

const searchTag = ref('')
const showSearch = ref(false)
const isShowSearch = ref(false)

watch(route, () => {
    addTags();
    moveToCurrentTag();
})
watch(visible, (value) => {
    if (value) {
        document.body.addEventListener('click', closeMenu);
    } else {
        document.body.removeEventListener('click', closeMenu);
    }
})

const toggleSideBar = () => {
    console.log(123123)
  appStore.toggleSideBar(false);
}

const openSearch = () => {
    if (!isShowSearch.value) {
        showSearch.value = true
    }
}
const clickOutside = () => {
    if (isShowSearch.value) {
        showSearch.value = false
    }
}

const isActive = (r: TagView): boolean => {
    return r.path === route.path;
}
const activeStyle = (tag: TagView) => {
    if (!isActive(tag)) return {};
    return {
        "background-color": theme.value,
        "border-color": theme.value
    };
}
const isAffix = (tag: TagView) => {
    return tag.meta && tag.meta.affix;
}
const isFirstView = () => {
    try {
        return selectedTag.value.fullPath === '/index' || selectedTag.value.fullPath === visitedViews.value[1].fullPath;
    } catch (err) {
        return false;
    }
}
const isLastView = () => {
    try {
        return selectedTag.value.fullPath === visitedViews.value[visitedViews.value.length - 1].fullPath;
    } catch (err) {
        return false;
    }
}
const filterAffixTags = (routes:RouteOption [], basePath = '') => {
    let tags:TagView[] = []
    routes.forEach(route => {
        if (route.meta && route.meta.affix) {
            const tagPath = getNormalPath(basePath + '/' + route.path);
            tags.push({
                fullPath: tagPath,
                path: tagPath,
                name: route.name,
                meta: { ...route.meta }
            })
        }
        if (route.children) {
            const tempTags = filterAffixTags(route.children, route.path);
            if (tempTags.length >= 1) {
                tags = [...tags, ...tempTags];
            }
        }
    })
    return tags
}
const initTags = () => {
    const res = filterAffixTags(routes.value);
    affixTags.value = res;
    for (const tag of res) {
        // Must have tag name
        if (tag.name) {
            useTagsViewStore().addVisitedView(tag);
        }
    }
}
const addTags = () => {
  // ↓佳俊修改---跳转后清除路由后参数
  const { name } = route;
  if(route.query.title) {
    route.meta.title = route.query.title;
  }
  if (name) {
    useTagsViewStore().addView(route);
    if (route.meta.link) {
      useTagsViewStore().addIframeView(route);
    }
  }
  return false
  // ↑佳俊修改---跳转后清除路由后参数
}
const moveToCurrentTag = () => {
    nextTick(() => {
        for (const r of visitedViews.value) {
            if (r.path === route.path) {
                scrollPaneRef.value.moveToTarget(r);
                // when query is different then update
                if (r.fullPath !== route.fullPath) {
                    useTagsViewStore().updateVisitedView(route);
                }
            }
        }
    })
}
const refreshSelectedTag = (view: TagView) => {
    proxy?.$tab.refreshPage(view);
    if (route.meta.link) {
        useTagsViewStore().delIframeView(route);
    }
}
const closeSelectedTag = (view: TagView) => {
    proxy?.$tab.closePage(view).then(({ visitedViews }: any) => {
        if (isActive(view)) {
            toLastView(visitedViews, view);
            if (isShowSearch.value) showSearch.value = false
        }
    })
}
const closeRightTags = () => {
    proxy?.$tab.closeRightPage(selectedTag.value).then(visitedViews => {
        if (!visitedViews.find(i => i.fullPath === route.fullPath)) {
            toLastView(visitedViews);
        }
    })
}
const closeLeftTags = () => {
    proxy?.$tab.closeLeftPage(selectedTag.value).then(visitedViews => {
        if (!visitedViews.find(i => i.fullPath === route.fullPath)) {
            toLastView(visitedViews);
        }
    })
}
const closeOthersTags = () => {
    router.push(selectedTag.value as RouteLocationRaw).catch(() => { });
    proxy?.$tab.closeOtherPage(selectedTag.value).then(() => {
        moveToCurrentTag();
    })
}
const closeAllTags = (view: TagView) => {
    proxy?.$tab.closeAllPage().then(({ visitedViews }) => {
        if (affixTags.value.some(tag => tag.path === route.path)) {
            return;
        }
        toLastView(visitedViews, view);
    })
}
const toLastView = (visitedViews:TagView[], view?: TagView) => {
    const latestView = visitedViews.slice(-1)[0];
    if (latestView) {
        router.push(latestView.fullPath as string);
    } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view?.name === 'Dashboard') {
            // to reload home page
            router.replace({ path: '/redirect' + view?.fullPath });
        } else {
            router.push('/');
        }
    }
}
const openMenu = (tag: TagView, e: MouseEvent) => {
    const menuMinWidth = 105;
    const offsetLeft = proxy?.$el.getBoundingClientRect().left; // container margin left
    const offsetWidth = proxy?.$el.offsetWidth; // container width
    const maxLeft = offsetWidth - menuMinWidth; // left boundary
    const l = e.clientX - offsetLeft + 15; // 15: margin right

    if (l > maxLeft) {
        left.value = maxLeft;
    } else {
        left.value = l;
    }

    top.value = e.clientY
    visible.value = true;
    selectedTag.value = tag;
}
const closeMenu = () => {
    visible.value = false;
}
const handleScroll = () => {
    closeMenu();
}


onMounted(() => {
    initTags();
    addTags();
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  position: relative;
  display:flex;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  width: 100%;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
//   box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
//   padding-right: 10px;
  box-sizing: border-box;
  .tags-view-wrapper {
    width: calc(100% - 30px);
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 24px;
      line-height: 23px;
      background-color: var(--el-bg-color);
      border: 1px solid var(--el-border-color-light);
      border-bottom: none;
      color: #495060;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 4px;
      margin-top: 4px;
      border-radius: 2px;
      .home-icon {
        margin-right: 4px;
      }
      .tags-view-item-text {
        margin-right: 4px;
        &.no-right-padding {
            margin-right: 4px;
        }
      }
      &:hover {
        color: var(--el-color-primary);
      }
      &:first-of-type {
        margin-left: 16px;
        &::before {
            display: none !important;
        }
      }
      &:last-of-type {
        margin-right: 16px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        // &::before {
        //   content: "";
        //   background: #fff;
        //   display: inline-block;
        //   width: 8px;
        //   height: 8px;
        //   border-radius: 50%;
        //   position: relative;
        //   margin-right: 5px;
        // }
      }
    }
  }
  .check-menu-class {
    padding: 0 8px;
    font-size: 12px;
    color: #3D3D3D;
    white-space: nowrap;
  }
  .contextmenu {
    margin: 0;
    background: var(--el-bg-color);
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}

.pop-tags-view {
    box-sizing: border-box;
    overflow: hidden;
    .pop-tags-box {
        padding: 0 0 8px;
        max-height: 500px;
        margin-top: 4px;
        overflow-x: hidden;
        overflow-y: auto;
        box-sizing: border-box;
        &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        .pop-tags-item {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            position: relative;
            cursor: pointer;
            width: 100%;
            height: 26px;
            line-height: 23px;
            background-color: var(--el-bg-color);
            border: 1px solid var(--el-border-color-light);
            color: #495060;
            padding: 0 8px;
            font-size: 12px;
            // margin-left: 5px;
            box-sizing: border-box;
            &:not(:first-child) {
                margin-top: 4px;
            }
            &:hover {
                color: var(--el-color-primary);
            }
            .pop-tags-title {
                flex: 1;
                width: 0;
                height: 100%;
                span {
                    display: inline-block;
                    width: 100%;
                    line-height: 24px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
            .close-width {
                flex: none;
                width: 1em;
            }
            &.active {
                background-color: #42b983;
                color: #fff;
                border-color: #42b983;
                // &::before {
                //     content: "";
                //     background: #fff;
                //     display: inline-block;
                //     width: 8px;
                //     height: 8px;
                //     border-radius: 50%;
                //     position: relative;
                //     margin-right: 5px;
                // }
            }
        }
    }
}
</style>

<style lang="scss">
.pop-tags-view {
    padding-bottom: 0 !important;
}
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
        width: 12px !important;
        height: 12px !important;
      }
    }
  }
}
</style>
