<template>
  <span class="admin-name hidden-xs-only">{{userStore.userInfo?.nickName}}</span>
  <el-dropdown trigger="click" class="hidden-xs-only">
    <img class="avatar" src="https://img1.baidu.com/it/u=2644452384,3800439215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" alt=""/>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <g-icon class="nav-icon hidden-xs-only" icon="Rank" :size="18" @click="toggle"></g-icon>
</template>

<script lang="ts" setup name="admin-info">
import { useRouter } from 'vue-router'
import { useFullscreen } from '@vueuse/core'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
const router = useRouter()

const { isFullscreen, enter, exit, toggle } = useFullscreen();

const loginOut = () => {
  userStore.loginOut().then(() => {
    router.push('/login')
    location.reload()
  })
}
</script>

<style lang="scss" scoped>
.admin-name {
  font-size: 20px;
  font-weight: 600;
}

.avatar {
  width: 35px;
  height: 35px;
  margin: 0 10px;
  border-radius: 50%;
  cursor: pointer;
}

.nav-icon {
  cursor: pointer;
}
</style>