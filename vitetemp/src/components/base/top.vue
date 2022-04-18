<template>
  <div class="contanir theme">
    头部菜单{{navFlag}}
    <button @click="changeTheme">切换主题色</button>
    <button @click="changeLeftWidth">切换侧边栏宽度</button>
  </div>
</template>

<script lang="ts">
export default { name: 'template' }
</script>
<script setup lang="ts">
  // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
  // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
  // onMounted(() => {
  //   console.log('onMounted')
  // })

  const store = useStore()
  // computed
  const navFlag = computed({
    get: () => store.getters.base.navFlag
  })

  // 切换主题色
  const changeTheme = () => {
    changeScssData('--colorWhite', returnColor())
    changeScssData('--colorBlack', returnColor())
  }

  // 切换侧边栏宽度
  const changeLeftWidth = () => {
    console.log(!navFlag.value)
    store.dispatch('setCarAction', { navFlag: !navFlag.value })
    // changeScssData('--leftWidth', twoNumberBetween(50, 200) + 'px')
  }

  // 改变scss全局变量方法
  const changeScssData = (varName: string, varValue: string) => {
    // 使用这个方法改变scss全局变量时，scss定义需要这样：$white: var(--colorWhite, #ffffff); 要加上var(--xxx, xxx)
    document.getElementsByTagName('body')[0].style.setProperty(varName, varValue)
  }

  // 返回随机颜色
  const returnColor = () => {
    const r = twoNumberBetween(0, 255)
    const g = twoNumberBetween(0, 255)
    const b = twoNumberBetween(0, 255)
    return `rgb(${r},${g},${b})`
  }

  // 取两数之间的随机整数
  const twoNumberBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min)
  }
</script>

<style lang="scss" scoped>
// body{
//   background: $white;
// }
.contanir {
  position: fixed;
  top: 0;
  left: $leftWidth;
  @include wh(calcF(100vw, $leftWidth), $topHeight);
  border-bottom: 1px solid $borderColor;
  z-index: 2;
}
</style>