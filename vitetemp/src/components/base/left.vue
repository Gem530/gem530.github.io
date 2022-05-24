<template>
  <div class="contanir theme">
    <img src="https://img1.baidu.com/it/u=2644452384,3800439215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" alt="" class="logo">

    <!-- 通过路由生成菜单栏，缺点：没有中文名称 -->
    <!-- <div class="nav-list">
      <div
        class="nav-item"
        :key="i"
        v-for="(item, i) in list"
        @click="changeRouter(item.name)"
      >{{item.name}}</div>
    </div> -->

    <!-- 通过配置文件生成菜单栏 -->
    <!-- <div class="nav-list">
      <div
        class="nav-item"
        :key="i"
        v-for="(item, i) in list"
        @click="changeRouter(item.key)"
      >{{item.title}}</div>
    </div> -->
    <div class="nav-box">
      <g-menu
        :keys="keys"
        :list="list"
        @changeMenu="changeMenu"
      ></g-menu>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'left' }
</script>
<script setup lang="ts">
  import { useStore } from 'vuex'
  import { menu } from '@/router/config'
  import { useRoute, useRouter } from 'vue-router'
  import { computed, watch, reactive, ref, onMounted, nextTick } from 'vue'
  import gMenu from '@/components/g-menu/index.vue'
  const store = useStore()
  // const route = useRoute()
  const router = useRouter()

  // ---------------- 获取路由列表，通过路由生成菜单  start ---------------
  // const routerList = router.getRoutes().filter(item => { return item.name })
  // // console.log(route, router.getRoutes())
  // console.log(router, routerList)
  /** https://www.cnblogs.com/zigood/p/15955410.html
   * 在设置中搜索vetur，把Vetur › Validation: Script
   * Validate js/ts in <script> 这一项的去掉选中状态
   * 问题：变量或方法，在template中调用，但是script中未调用，会提示list该变量/方法未调用，使用上面的方法可以解决这个提示
   */
  // const list: any[] = reactive(routerList)
  // ---------------- 获取路由列表，通过路由生成菜单  end ---------------
  const list: any[] = reactive(menu)

  const keys = 'key'

  // computed
  const navFlag = computed(() => {
    return store.getters.base.navFlag
  })
  // watch
  watch(() => store.getters.base, (val, old) => {
    console.log(val, old, val.navFlag)
    if (!val.navFlag) {
      changeLeftWidth('50px')
    } else {
      changeLeftWidth('250px')
    }
  }, { deep: true })
  // console.log(list)
  // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
  // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
  onMounted(() => {
    console.log('onMounted')
  })

  // 切换路由
  const changeRouter = (data: string) => {
    router.push(data)
  }
  // 切换侧边栏宽度
  const changeLeftWidth = (width: string) => {
    changeScssData('--leftWidth', width)
  }

  // 改变scss全局变量方法
  const changeScssData = (varName: string, varValue: string) => {
    // 使用这个方法改变scss全局变量时，scss定义需要这样：$white: var(--colorWhite, #ffffff); 要加上var(--xxx, xxx)
    document.getElementsByTagName('body')[0].style.setProperty(varName, varValue)
  }

  // 点击菜单栏
  const changeMenu = (item: Record<string, any>) => {
    console.log(item.title, item)
    changeRouter(item.key)
  }
</script>

<style lang="scss" scoped>
.contanir {
  position: fixed;
  top: 0;
  left: 0;
  @include flex(flex-start, flex-start, column, no-wrap);
  @include wh($leftWidth, 100vh);
  border-right: 1px solid $borderColor;
  z-index: 3;

  .logo {
    width: 100%;
    height: $topHeight;
    object-fit: cover;
  }

  .nav-item {
    @include wh(100%, 50px);
    @include text_overflow(1);
    @include textcenter(50px, center);
    border-bottom: 1px solid $borderColor;
    cursor: pointer;
  }

  .nav-box {
    width: 100%;
    flex: 1;
    overflow-y: auto;
    @include overflowAutoHid();
  }
}
</style>