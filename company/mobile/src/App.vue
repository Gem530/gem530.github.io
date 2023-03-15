<template>
  <!-- 加上key，是防止页面切换后，再返回时，页面不加载 -->
  <router-view v-slot="{ Component, route }" :key="key">
    <transition name="slide-fade" appear>
      <!-- appear 首次渲染应用过渡效果，可以添加appear。 在router-view加上key时，不加appear也会没有过渡效果 -->
      <component :is="Component" :key="route.path"></component>
    </transition>
  </router-view>

  <FixedIcon :size="30" v-model:show="show">
    <van-icon name="gift-card" size="30" color="orange" @click.stop="handle" style="z-index: 1000;"/>
    <template #all-box>
      <div class="gift-card-box" @click.stop="handle">666</div>
    </template>
  </FixedIcon>

  <Footer></Footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const key = computed(() => route.path + '/' + (new Date()).getTime() + Math.random())

const show = ref(false)
const handle = () => {
  show.value = !show.value
  console.log('1212', show.value)
}
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  outline: none;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html,body {
  overflow-x: hidden;
}

h1 {
  color: aqua;
}
</style>

<style lang="scss" scoped>
.gift-card-box {
  width: 300px;
  height: 500px;
  background: #fff;
}
</style>
