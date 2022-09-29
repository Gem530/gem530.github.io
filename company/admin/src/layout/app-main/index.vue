<template>
  <router-view class="router-view" v-slot="{ Component }">
    <transition name="slide-left" mode="out-in">
      <!-- <keep-alive> -->
        <component :is="Component" />
      <!-- </keep-alive> -->
    </transition>
  </router-view>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/transition.scss';
</style>