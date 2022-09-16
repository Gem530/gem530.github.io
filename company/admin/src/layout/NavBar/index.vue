<template>
  <div class="nav-bar">
    <div class="nav-left">
      <el-button :icon="sideShow ? 'Fold' : 'Expand'" type="primary" size="small" @click="changeSide"></el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          :key="item.path"
          v-for="(item, i) in breadList">
          <span v-if="(i + 1) < breadList.length">{{item.meta?.title}}</span>
          <a v-else :href="item.path" class="color-black">{{item.meta?.title}}</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="nav-right">
      <el-popover placement="bottom" trigger="click">
        <template #reference>
          <img class="avatar" src="https://img1.baidu.com/it/u=2644452384,3800439215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" alt="">
        </template>
        <div><el-button>退出登录</el-button></div>
      </el-popover>
    </div>
  </div>
</template>

<script lang="ts" setup name="NavBar">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const sideShow = ref(true)
const breadList = ref(router.currentRoute.value.matched)

console.log(router)
const changeSide = () => {
  sideShow.value = !sideShow.value
}
</script>

<style lang="scss" scoped>
.nav-bar {
  @include flex(space-between);
  padding: 5px 10px;

  .nav-left {
    @include flex(flex-start);

    .el-breadcrumb {
      margin-left: 10px;

      .el-breadcrumb__inner .color-black,
      .el-breadcrumb__inner .color-black:hover {
        font-weight: 600;
        color: #000;
        cursor: pointer;
      }
    }
  }

  .nav-right {
    @include flex(flex-end);
    
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
}
</style>