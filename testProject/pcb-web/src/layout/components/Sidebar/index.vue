<template>
  <div :class="{ 'has-logo': showLogo }" :style="{ backgroundColor: bgColor }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
      <transition :enter-active-class="proxy?.animate.menuSearchAnimate.enter" mode="out-in">
        <el-menu
          ref="menuRef"
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="bgColor"
          :text-color="textColor"
          :unique-opened="false"
          :active-text-color="theme"
          :collapse-transition="false"
          menu-trigger="click"
          mode="vertical"
        >
          <el-menu-item ref="searchMenuDomRef" index="searchMenuDom" :class="{ 'sub-menu-title-noDropdown': !isNest }">
            <template v-if="isCollapse">
              <div class="menu-svg-icon" style="margin: 0 auto;">
                <svg-icon icon-class="search" />
              </div>
              <div class="menu-collapse-title">{{'搜索'}}</div>
            </template>
            <template #title>
              <search-menu ref="searchMenuRef" :isCollapse="isCollapse" @closeMenuItem="closeMenuItem"/>
            </template>
          </el-menu-item>
          <sidebar-item v-for="(route, index) in sidebarRouters" :key="route.path + index" :item="route" :base-path="route.path" :isCollapse="isCollapse" :showIcon="true" />
        </el-menu>
      </transition>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import SearchMenu from '../TopBar/search.vue'
import variables from '@/assets/styles/variables.module.scss'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import { RouteOption } from "vue-router";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const menuRef = ref()
const route = useRoute();
const appStore = useAppStore()
const searchMenuDomRef = ref()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()

const sidebarRouters =  computed<RouteOption[]>(() => permissionStore.sidebarRouters);
const showLogo = computed(() => settingsStore.sidebarLogo);
// const sideTheme = computed(() => settingsStore.sideTheme);
// const theme = computed(() => settingsStore.theme);
const sideTheme = ref('theme-dark');
const theme = ref('#5D7DB3');
const isCollapse = computed(() => !appStore.sidebar.opened);

const activeMenu = computed(() => {
    const { meta, path } = route;
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
        return meta.activeMenu;
    }
    return path;
})

const bgColor = computed(() => sideTheme.value === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground);
const textColor = computed(() => sideTheme.value === 'theme-dark' ? variables.menuColor : variables.menuLightColor);

// 折叠时，关闭搜索菜单
const closeMenuItem = () => {
  if (isCollapse.value) {
    // console.log('menuRef', menuRef.value)
    // menuRef.value.close('searchMenuDom')
    // document.body.focus()
    searchMenuDomRef.value.blur()
  }
}
</script>
