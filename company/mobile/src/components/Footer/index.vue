<template>
  <footer class="footer">
    <transition name="up-down">

      <van-tabbar
        v-show="tabShow"
        v-model="active"
        @change="changeFooter">
        <van-tabbar-item
          :key="i"
          v-for="(item, i) in list">

          <span>{{item.name}}</span>
          <template #icon="props">
            <van-icon
              size="24"
              class-prefix="iconfont icon"
              :name="props.active ? item.active : item.inactive"
            ></van-icon>
          </template>

        </van-tabbar-item>
      </van-tabbar>

    </transition>
  </footer>
</template>

<script lang="ts" setup name="Footer">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface tabbar {
  name: string
  path: string
  active: string
  inactive: string
}

const route = useRoute()
const router = useRouter()

const active = ref(0)
const tabShow = ref(false)
const list = ref<tabbar[]>([
  {
    name: '首页',
    path: '/',
    active: 'home-filling',
    inactive: 'home'
  },
  {
    name: '我的',
    path: '/me',
    active: 'user-filling',
    inactive: 'user'
  }
])

watch(() => route.path, (path: string) => {
  const num = list.value.findIndex((v: tabbar) => v.path == path)
  if (num !== -1) {
    active.value = num
    tabShow.value = true
  } else {
    tabShow.value = false
  }
}, { deep: true })

const changeFooter = (val: number) => {
  const url = list.value[val].path
  url && router.push(url)
}
</script>

<style lang="scss" scoped>
.footer {
  height: 50px;

  :deep(.van-tabbar) {
    border-radius: 10px 10px 0 0;
    box-shadow: 0 0 5px $bodyColorGray;
    overflow: hidden;
    .van-tabbar-item--active {
      color: $bodyColorGreen;
    }
    .van-tabbar-item__icon {
      img {
        height: 24px;
      }
    }
  }
}
</style>