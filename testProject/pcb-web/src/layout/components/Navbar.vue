<template>
  <div class="navbar">
    <!-- <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!settingsStore.topNav" />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="settingsStore.topNav" />

    <div class="right-menu flex align-center">
      <div v-if="envKey != 'production'" class="env-name-height">{{ envName }}</div>
      <template v-if="appStore.device !== 'mobile'">
        <el-select v-model="companyName" filterable reserve-keyword :placeholder="$t('navbar.selectTenant')" @change="dynamicOwnerEvent">
          <!-- @clear="dynamicClearEvent" -->
          <el-option v-for="item in ownerList" :key="item.ownerId" :label="item.ownerName" :value="item.ownerId"></el-option>
          <template #prefix>
            <svg-icon icon-class="company" class="el-input__icon input-icon" />
          </template>
        </el-select>

        <!-- <header-search id="header-search" class="right-menu-item" /> -->
        <!-- <search-menu ref="searchMenuRef" /> -->
        <!-- <el-tooltip content="搜索" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect" @click="openSearchMenu">
            <svg-icon class-name="search-icon" icon-class="search" />
          </div>
        </el-tooltip> -->
        <!-- 消息 -->
        <!--        <el-tooltip :content="$t('navbar.message')" effect="dark" placement="bottom">-->
        <!--          <div>-->
        <!--            <el-popover placement="bottom" trigger="click" transition="el-zoom-in-top" :width="300" :persistent="false">-->
        <!--              <template #reference>-->
        <!--                <el-badge :value="newNotice > 0 ? newNotice : ''" :max="99">-->
        <!--                  <svg-icon icon-class="message" />-->
        <!--                </el-badge>-->
        <!--              </template>-->
        <!--              <template #default>-->
        <!--                <notice></notice>-->
        <!--              </template>-->
        <!--            </el-popover>-->
        <!--          </div>-->
        <!--        </el-tooltip>-->
        <!-- <el-tooltip content="Github" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <div class="right-menu-item hover-effect"> -->
          <Agency></Agency>
        <!-- </div>
        <div class="right-menu-item hover-effect"> -->
          <NoticeBar></NoticeBar>
        <!-- </div> -->
        <!-- <div class="right-menu-item hover-effect flex flex-center" @click="showPending">
          {{'通知'}}
          <el-icon size="14" style="margin: 0 0 0 4px;"><arrow-down/></el-icon>
        </div> -->
        <!-- <el-tooltip :content="$t('navbar.document')" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->
        <!-- <el-tooltip :content="$t('navbar.tableWeight')" effect="dark" placement="bottom"> -->
          <bold-select id="bold-select"/>
        <!-- </el-tooltip> -->

        <!-- <el-tooltip :content="$t('navbar.language')" effect="dark" placement="bottom">
          <lang-select id="lang-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <el-tooltip :content="$t('navbar.layoutSize')" effect="dark" placement="bottom"> -->
          <size-select id="size-select"/>
        <!-- </el-tooltip> -->

        <el-tooltip :content="$t('navbar.full')" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect screenfull" />
        </el-tooltip>
      </template>
      <div class="avatar-container">
        <el-dropdown @command="handleCommand" trigger="click">
          <div class="avatar-wrapper global-flex flex-end">
            <div class="user-avatar" ></div>
            <span class="avatar-name">{{ userStore.nickname }}</span>
            <el-icon><arrow-down /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile" v-if="!dynamic">
                <el-dropdown-item>{{ $t('navbar.personalCenter') }}</el-dropdown-item>
              </router-link>
              <!-- <el-dropdown-item command="setLayout" v-if="settingsStore.showSettings">
                <span>{{ $t('navbar.layoutSetting') }}</span>
              </el-dropdown-item> -->
              <el-dropdown-item divided command="logout">
                <span>{{ $t('navbar.logout') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Agency from './Agency/index.vue'
import NoticeBar from './NoticeBar/index.vue'
import SearchMenu from './TopBar/search.vue';
import useAppStore from '@/store/modules/app';
import useUserStore from '@/store/modules/user';
import useSettingsStore from '@/store/modules/settings';
import { getTenantList, getOwnerList, switchLogin } from '@/api/login';

import { dynamicClear, dynamicTenant } from '@/api/system/tenant';
import { ComponentInternalInstance } from 'vue';
import { TenantVO } from '@/api/types';
import notice from './notice/index.vue';
import { setToken } from '@/utils/auth';
import useNoticeStore from '@/store/modules/notice';
import { e } from 'unocss';
import {
  SourceFullProcessOrderBackForm,
  SourceFullProcessOrderBackQuery
} from '@/api/outsource/sourceFullProcessOrderBack/types';

const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const noticeStore = storeToRefs(useNoticeStore());
const newNotice = ref(<number>0);
const envKey = ref(import.meta.env.VITE_APP_ENV);
const envName = ref(import.meta.env.VITE_APP_ENV_NAME);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const userId = ref(userStore.userId);
const companyName = ref();
const tenantList = ref<TenantVO[]>([]);
const ownerList = ref<any[]>([]);
// 是否切换了租户
const dynamic = ref(false);
// 租户开关
const tenantEnabled = ref(true);
// 搜索菜单
const searchMenuRef = ref<InstanceType<typeof SearchMenu>>();

const openSearchMenu = () => {
  searchMenuRef.value?.openSearch();
};

// 动态切换
const dynamicTenantEvent = async (tenantId: string) => {
  console.log(tenantId);

  if (companyName.value != null && companyName.value !== '') {
    console.log('切换租户');

    await dynamicTenant(tenantId);
    dynamic.value = true;
    proxy?.$tab.closeAllPage();
    proxy?.$router.push('/');
  }
};
// 动态切换单位
const dynamicOwnerEvent = async (ownerId: any) => {
  console.log(ownerId);
  if (companyName.value != null && companyName.value !== '') {
    dynamic.value = true;
    handleLoginEvent();

  }
};

// 调用action的登录方法
const handleLoginEvent = async () => {
  const res = await switchLogin({ ownerId: companyName.value });
  if (res.code === 200) {
    const data = res.data;
    localStorage.removeItem('tenantId');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('rememberMe');
    setToken(data.access_token);
    userStore.setUserToken(data.access_token);
    proxy?.$tab.closeAllPage();
    location.href = '/';
  }
};

const dynamicClearEvent = async () => {
  await dynamicClear();
  dynamic.value = false;
  proxy?.$tab.closeAllPage();
  proxy?.$router.push('/');
};

/** 租户列表 */
const initTenantList = async () => {
  const { data } = await getTenantList();
  tenantEnabled.value = data.tenantEnabled === undefined ? true : data.tenantEnabled;
  if (tenantEnabled.value) {
    tenantList.value = data.voList;
  }
};
/** 单位列表 */
const initOwnerList = async () => {
  const { data } = await getOwnerList();
  console.log('data', data);
  ownerList.value = data;
  companyName.value = userStore.ownerId
};

defineExpose({
  initTenantList
});

// const toggleSideBar = () => {
//   appStore.toggleSideBar(false);
// }

const logout = async () => {
  await ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  });
  await userStore.logout();
  location.href = import.meta.env.VITE_APP_CONTEXT_PATH + 'index';
};

const emits = defineEmits(['setLayout']);
const setLayout = () => {
  emits('setLayout');
};
// 定义Command方法对象 通过key直接调用方法
const commandMap: { [key: string]: any } = {
  setLayout,
  logout
};
const handleCommand = (command: string) => {
  // 判断是否存在该方法
  if (commandMap[command]) {
    commandMap[command]();
  }
};

//用深度监听 消息
watch(() => noticeStore.state.value.notices, (newVal, oldVal) => {
  newNotice.value = newVal.filter((item: any) => !item.read).length;
}, { deep: true });


onMounted(() => {
  initOwnerList();

  // newNotice.value = noticeStore.state.value.notices.filter((item: any) => !item.read).length;
});

</script>

<style lang="scss" scoped>

:deep(.el-select .el-input__wrapper) {
  height: 30px;
}

:deep(.el-badge__content.is-fixed) {
  top: 12px;
}

.flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.navbar {
  height: 36px;
  overflow: hidden;
  position: relative;
  //background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-sizing: border-box;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 36px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      position: relative;
      margin-left: 8px;
      padding-left: 8px;
      padding-right: 8px;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        height: 16px;
        border-left: 1px solid #E9E9E9;
      }

      .avatar-wrapper {
        position: relative;
        height: 36px;
        font-size: 12px;
        color: #3d3d3d;
        cursor: pointer;

        .avatar-name {
          margin: 0 4px 0 8px;
        }

        .user-avatar {
          cursor: pointer;
          width: 16px;
          height: 16px;
          background: url('@/assets/images/avatar.svg') no-repeat;
          background-size: 100% 100%;
          border-radius: 50%;
        }

        i {
          cursor: pointer;
          font-size: 12px;
        }
      }
    }
  }
}

.env-name-height {
  font-size: 36px;
  background: rgba(255, 146, 51, 1);
}
</style>
