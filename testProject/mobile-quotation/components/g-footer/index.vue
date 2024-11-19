<template>
  <div :class="{'footer': true, 'height': tabShow}">
    <!-- <transition name="up-down"> -->

      <van-tabbar
        v-show="tabShow"
        v-model="active"
        @change="changeFooter">
        <van-tabbar-item
          :key="i"
          v-for="(item, i) in list">

          <div class="overflow-2-omit text-center">{{item.name && item.name()}}</div>
          <template #icon="props">
            <van-icon
              size="24"
              :name="props.active ? item.active : item.inactive"
            ></van-icon>
          </template>

        </van-tabbar-item>
      </van-tabbar>

    <!-- </transition> -->
  </div>
</template>

<script lang="ts" setup name="g-footer">
const { t } = useI18n()
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface tabbar {
  name: Function
  path: string[]
  active: string
  inactive: string
}

const route = useRoute()
const router = useRouter()

const active = ref(0)
const tabShow = ref(false)
const list = ref<tabbar[]>([
  {
    name: () => t('homes'),
    path: ['/'],
    active: 'wap-home',
    inactive: 'wap-home-o'
  },
  {
    name: () => t('valuation'),
    path: ['/online-count'],
    active: 'records',
    inactive: 'records-o'
  },
  {
    name: () => t('order'),
    path: ['/order/0','/order/1','/order/2','/order/3','/order/4','/order/5','/order/9'],
    active: 'cart',
    inactive: 'cart-o'
  },
  {
    name: () => t('directPage.title'),
    path: ['/direct-ceo'],
    active: 'comment',
    inactive: 'comment-o'
  },
  {
    name: () => t('my'),
    path: ['/user'],
    active: 'contact',
    inactive: 'contact-o'
  }
])

watch(() => route.path, (path: string) => {
  const num = list.value.findIndex((v: tabbar) => v.path.includes(path))
  if (num !== -1) {
    active.value = num
    tabShow.value = true
  } else {
    tabShow.value = false
  }
}, { deep: true, immediate: true })

const changeFooter = (val: number) => {
  const url = list.value[val].path
  url && router.push(url[0])
}
</script>

<style lang="scss" scoped>
.footer {
  &.height {
    height: 50px;
  }

  :deep(.van-tabbar) {
    // border-radius: 10px 10px 0 0;
    // box-shadow: 0 0 5px #AAAAAA;
    overflow: hidden;
    .van-tabbar-item--active {
      color: var(--el-color-primary);
    }
    .van-tabbar-item__icon {
      img {
        height: 24px;
      }
    }
  }
}
</style>