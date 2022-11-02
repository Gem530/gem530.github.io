<template>
  <div class="common-style">
    <NavBar fixed left-arrow/>
    <h1>复用样式</h1>

    <div class="grid-layout">
      <div class="grid-layout-item grid-5" :key="i" v-for="i in 10">
        <div class="grid-layout-icon"><img :src="img"/></div>
        <div class="grid-layout-text">Grid-{{i}}</div>
      </div>
    </div>

    <div class="l-one-r-two">
      <div class="l-one">l-one</div>
      <div class="r-two">
        <div class="r-two-top">right-top</div>
        <div class="r-two-bottom">right-bottom</div>
      </div>
    </div>

    <div class="img-columns-tag">
      <div class="i-c-t-img"><img :src="img"/></div>
      <div class="i-c-t-column">
        <p>测试数据</p>
        <p>测试数据测试数据测试数据测试数据测试数据</p>
        <p>测试数据</p>
      </div>
      <div class="i-c-t-column">23424234.123</div>
      <div class="i-c-t-tag">Complete</div>
    </div>

    <p>11</p>
    <p>11</p>
    <p>11</p>
    <p>11</p>
    <p>11</p>
    <p>11</p>
    <p>11</p>
    <p>11</p>
    <p>11</p>
    <p>11</p>
    <p>11</p>
    <p>11</p>
    <p>11</p>
    <p>11</p>
    <p>11</p>
    <p>11</p>
    <p>11</p>
  </div>
</template>

<script lang="ts" setup name="CommonStyle">
import { ref } from 'vue'
const img = 'https://img1.baidu.com/it/u=2644452384,3800439215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
</script>

<style lang="scss" scoped>
.grid-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  &.overflow-x {
    flex-wrap: nowrap;
    overflow-x: auto;
    .grid-layout-item {
      flex: none;
      width: 60px;
    }
  }

  .grid-layout-item {
    height: 65px;
    text-align: center;
    margin-bottom: 5px;

    &.grid-2 { width: 50%; }
    &.grid-3 { width: 33%; }
    &.grid-4 { width: 25%; }
    &.grid-5 { width: 20%; }
    &.grid-6 { width: 16%; }

    .grid-layout-icon {
      width: 35px;
      height: 35px;
      margin: 0 auto 5px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .grid-layout-text {
      font-size: 14px;
    }
  }
}

.l-one-r-two {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 90px;
  padding: 0 10px;

  .l-one {
    width: 50%;
    height: 100%;
    background: greenyellow;
    margin-right: 10px;
    border-radius: 10px;
  }

  .r-two {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    width: 50%;
    height: 100%;

    .r-two-top,
    .r-two-bottom {
      width: 100%;
      height: 50%;
      border-radius: 10px;
    }
    .r-two-top {
      background: plum;
      margin-bottom: 10px;
    }
    .r-two-bottom {
      background: skyblue;
    }
  }
}

.img-columns-tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 90px;
  padding: 0 10px;

  .i-c-t-img {
    flex: none;
    margin-right: 5px;
    img {
      width: 35px;
      height: 35px;
    }
  }

  .i-c-t-column {
    max-width: 110px;
    font-size: 16px;

    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .i-c-t-tag {
    flex: none;
    width: 100px;
    height: 30px;
    background: orange;
    margin-left: 5px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 30px;
    border-radius: 5px;
  }
}
</style>