<template>
  <div class="side-bar">
    <logo></logo>
    <menu></menu>
  </div>
</template>

<script lang="ts" setup name="SideBar">
import logo from './logo.vue'
import menu from './menu.vue'
import { useStore } from 'vuex'
console.log(useStore().state)
</script>

<style lang="scss" scoped>

</style>