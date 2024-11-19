<template>
  <div
    class="sidebar-logo-container"
    :class="{ 'collapse': collapse }"
    :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }"
  >
    <transition :enter-active-class="proxy?.animate.logoAnimate.enter" mode="out-in">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 v-else class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }">
          {{ title }}
        </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }">
          <span>{{ title }}</span>
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup lang="ts">
import variables from '@/assets/styles/variables.module.scss'
import logo from '@/assets/logo/logo.png'
import useSettingsStore from '@/store/modules/settings'
import { ComponentInternalInstance } from "vue";
import useUserStore from '@/store/modules/user';
import {getInfo} from "@/api/login";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

defineProps({
    collapse: {
        type: Boolean,
        required: true
    }
})

const title = ref('诺思特ERP系统');
const settingsStore = useSettingsStore();
const sideTheme = computed(() => settingsStore.sideTheme);
const userStore = useUserStore();

//查询当前单位名称
const getCompanyName = async () => {
  const res = await getInfo();
  title.value = res.data.user.ownerName
}

onMounted(() => {
  getCompanyName();
});
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 42px;
  line-height: 42px;
  // padding: 0 8px;
  // background: #2b2f3a;
  text-align: center;
  overflow: hidden;
  &.no-padding {
    padding: 0px;
  }

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 40px;
      height: 40px;
      vertical-align: middle;
      margin-right: 4px;
    }

    & .sidebar-title {
      display: inline-block;
      max-width: calc(100% - 44px);
      margin: 0;
      color: #fff;
      font-size: 12px;
      font-weight: bold;
      // line-height: 22px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        // word-break: break-all;
        word-wrap: break-word;
      }
    }
  }

  &.collapse {
    padding: 0px;
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
