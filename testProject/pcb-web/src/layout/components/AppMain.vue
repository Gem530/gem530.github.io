<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition :enter-active-class="animante" mode="out-in">
        <keep-alive :include="tagsViewStore.cachedViews">
          <component v-if="!route.meta.link" :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
    <iframe-toggle />
    <FixedCollect />
  </section>
</template>

<script setup name="AppMain" lang="ts">
import useTagsViewStore from '@/store/modules/tagsView';
import useSettingsStore from '@/store/modules/settings';
import IframeToggle  from './IframeToggle/index.vue'
import { ComponentInternalInstance } from "vue";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const tagsViewStore = useTagsViewStore();

// 随机动画集合
const animante = ref<string>('');
const animationEnable = ref(useSettingsStore().animationEnable);
watch(()=> useSettingsStore().animationEnable, (val) => {
    animationEnable.value = val;
    if (val) {
        animante.value = proxy?.animate.animateList[Math.round(Math.random() * proxy?.animate.animateList.length)] as string;
    } else {
        animante.value = proxy?.animate.defaultAnimate as string;
    }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 8px 8px 0 !important;
  // background: #f2f3f5;
  box-sizing: border-box;

  & > .p-2 {
    height: 100%;
    padding: 0;
    overflow-y: auto;
  }
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 76 = navbar + tags-view = 24 + 40 */
    height: calc(100vh - 64px);
  }

  .fixed-header+.app-main {
    padding-top: 64px;
  }
}
</style>
<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 6px;
  }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background-color: #ffffff;
}

::-webkit-scrollbar-thumb {
  background-color: #E9E9E9;
  border-radius: 3px;
}
</style>
