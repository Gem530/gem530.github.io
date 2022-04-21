<template>
  <div class="component theme">
    <div
      class="item-menu"
      :class="`item-${props.level}`"
      :key="i"
      v-for="(item, i) in list"
    >
      <div
        class="item-title"
        :style="paddingLeft(item[keys])"
        @click.stop="handleClick(item, i)">
        <span>{{item.title}}</span>
        <span class="right" v-if="item.children">{{item.flag ? '+' : '-'}}</span>
      </div>

      <!-- style里做折叠动画效果 -->
      <!-- 这个效果用于动画效果根据高度来实现动画速度 transition: all ${(0.1 * list.length).toFixed(1)}s linear; -->
      <div
        :style="`
          max-height: ${item.flag ? (list.length * 45).toFixed(0) : 0 }px;
        `"
        :class="{
          'item-content': true,
        }"
        v-if="item.children">
        <!-- 'item-content-hide': !item.flag -->
        <g-menu
          :keys="props.keys"
          :list="item.children"
          :level="props.level + 1"
          :color="props.color"
          :bkColor="props.bkColor"
          :activeColor="props.activeColor"
          :activeBKColor="props.activeBKColor"
          @changeMenu="handleClick"
        ></g-menu>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'g-menu', inheritAttrs: false }
</script>
<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { defineEmits, useAttrs, ref, watch } from 'vue'
  const attrs = useAttrs()
  const router = useRouter()
  const emits = defineEmits(['changeMenu'])
  // withDefaults与defineProps搭配使用，withDefaults第二个参数是给defineProps的值给默认值
  const props = withDefaults(defineProps<{
    keys?: string,
    list?: any[],
    level?: number,
    color?: string,
    bkColor?: string,
    activeColor?: string,
    activeBKColor?: string
  }>(), {
    keys: 'key',
    list: () => [{
      title: '首页',
      icon: ''
    }],
    level: 1,
    color: '#000000',
    bkColor: '#ffffff',
    activeColor: '#ffffff',
    activeBKColor: '#000000'
  })
  const text = ref('')
  props.list.forEach((item: any) => {
    item.flag = true
  })

  console.log('--', attrs)

  // 根据路由来高亮菜单栏
  watch(() => router.currentRoute.value, (val, old) => {
    // console.log(val, old)
    // if (old.fullPath === '/') {
    text.value = val.fullPath
    // }
  }, { deep: true })
  
  // 根据菜单等级来右移，显出层次感
  const paddingLeft = (keys: string) => {
    // console.log(keys, text.value, '-')
    return `
      padding-left: ${ props.level * 15 + 10 }px;
      color: ${ keys === text.value ? props.activeColor : props.color };
      background: ${ keys === text.value ? props.activeBKColor : props.bkColor };
    `
  }
  // // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
  // // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
  // onMounted(() => {
  //   console.log('onMounted-递归', props.list)
  // })

  // 点击菜单
  const handleClick = (item: Record<string, any>, i: number = 0) => {
    if (item.children) {
      console.log('不是路由')
      props.list[i].flag = !item.flag
      console.log(props.list[i].flag)
      console.log('----', item, props.level)
      return
    }
    emits('changeMenu', item)
  }
</script>

<style lang="scss" scoped>
$height: 45px;
@for $i from 1 to 10 {
  .item-#{$i} {
    z-index: 10 - $i;
  }
}
.item-menu {
  position: relative;
  overflow: hidden;

  .item-title {
    position: relative;
    @include wh(100%, $height);
    @include flex(flex-start, center);
    border-bottom: 1px solid $borderColor;
    cursor: pointer;

    .right {
      @include pcenter(50%, 95%);
    }
  }

  .item-content {
    overflow: hidden;
    transition: max-height 0.2s linear;
  }
}
</style>