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

    <div class="flex-between-center-line">
      <div class="f-c-l-left">
        <div class="f-c-l-top">f-c-l-left-top</div>
        <div class="f-c-l-bottom">f-c-l-left-bottom</div>
      </div>
      <div class="f-c-l-right">
        <div class="f-c-l-top">f-c-l-right-top</div>
        <div class="f-c-l-bottom">f-c-l-right-bottom</div>
      </div>
    </div>

    <div class="title-left-border">
      <p>标题一</p>
      <p>内容内容内容内容内容</p>
    </div>

    <div class="flex-betweent-item">
      <div class="f-b-i-left">f-b-i-left</div>
      <div class="f-b-i-right">f-b-i-right</div>
    </div>
    <div class="flex-betweent-item">
      <div class="f-b-i-left">f-b-i-left</div>
      <div class="f-b-i-right">f-b-i-right</div>
    </div>

    <div class="html-value" v-html="htmlValue"></div>

    <div class="box-content-tips">
      <div class="b-c-t-box">b-c-t-box</div>
      <div class="b-c-t-right">
        <div class="b-c-t-item">
          <div class="b-c-t-item-content">b-c-t-item-content</div>
          <div class="b-c-t-item-tips">b-c-t-item-tips</div>
        </div>
        <div class="b-c-t-item">
          <div class="b-c-t-item-content">b-c-t-item-content</div>
          <div class="b-c-t-item-tips">b-c-t-item-tips</div>
        </div>
        <div class="b-c-t-item">
          <div class="b-c-t-item-content">b-c-t-item-content</div>
          <div class="b-c-t-item-tips">b-c-t-item-tips</div>
        </div>
        <div class="b-c-t-item">
          <div class="b-c-t-item-content">b-c-t-item-content</div>
          <div class="b-c-t-item-tips">b-c-t-item-tips</div>
        </div>
      </div>
    </div>

    <div class="grid-border">
      <div
        :key="i"
        v-for="i in 5"
        :class="{
          'grid-3': true,
          'last-border': i == 5,
          'border-right': i % 3,
          'border-bottom': i < 4,
          'grid-border-item': true,
        }">
        <div class="grid-border-item-top">top-content</div>
        <div class="grid-border-item-bottom">bottom-content</div>
      </div>
    </div>

    <AnimationColumn></AnimationColumn>
  </div>
</template>

<script lang="ts" setup name="CommonStyle">
import { ref } from 'vue'
const img = 'https://img1.baidu.com/it/u=2644452384,3800439215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'

const htmlValue = "<p><span style=\"color: rgb(225, 60, 57); font-size: 22px;\"><strong>富文本内容</strong></span></p><h1>限制图片，视频宽度</h1><img src=\"https://img1.baidu.com/it/u=2644452384,3800439215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500\" alt=\"istockphoto-1268194045-612x612.jpeg\" data-href=\"https://img1.baidu.com/it/u=2644452384,3800439215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500\" style=\"\"/>"
</script>

<style lang="scss" scoped>
.common-style {
  font-size: 16px;
}

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

.flex-between-center-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 65px;
  background: skyblue;
  margin: 15px;
  padding: 10px;
  border-radius: 10px;

  .f-c-l-left,
  .f-c-l-right {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .f-c-l-top {
      color: #666;
    }
    .f-c-l-bottom {
      font-weight: 600;
    }
  }

  .f-c-l-left::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(0, -50%);
    width: 0;
    height: 100%;
    border-right: 1px solid #eee;
  }
}

.title-left-border {
  position: relative;
  padding: 0 0 0 15px;
  margin: 15px;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    width: 0;
    height: 100%;
    border-left: 3px solid skyblue;
  }
}

.flex-betweent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px;

  .f-b-i-left {
    font-weight: 600;
  }
  .f-b-i-right {
    color: #999;
  }
}

.html-value {
  width: 100%;
  padding: 15px;
  
  :deep(img),
  :deep(video) {
    width: 100%;
  }
}

.box-content-tips {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
  padding: 10px;
  margin: 15px;
  border-radius: 10px;
  box-shadow: 0 0 5px #ddd;

  .b-c-t-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    background: #00AB6B;
    margin-right: 10px;
    color: #ffffff;
    text-align: center;
    border-radius: 5px;
  }

  .b-c-t-right {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-content: space-between;
    .b-c-t-item {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .b-c-t-item-content {
        font-weight: 600;
      }

      .b-c-t-item-tips {
        color: #999;
      }
    }
  }
}

.grid-border {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  background: linear-gradient(-125deg, #00AB6B, rgba(0, 171, 107, 0.6));
  margin: 15px;
  padding: 10px;
  color: #ffffff;
  border-radius: 10px;

  .grid-border-item {
    position: relative;
    padding: 10px;
    text-align: center;
    &.grid-2 { width: 50%; }
    &.grid-3 { width: 33%; }
    &.grid-4 { width: 25%; }
    &.grid-5 { width: 20%; }
    &.grid-6 { width: 16%; }

    &.border-right::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(0, -50%);
      width: 0;
      height: 70%;
      border-right: 1px solid #ffffff;
    }

    &.last-border::after {
      display: none;
    }

    &.border-bottom::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 0);
      width: 80%;
      height: 0;
      border-bottom: 1px solid #ffffff;
    }

    .grid-border-item-top {
      font-size: 12px;
    }
    .grid-border-item-bottom {
      font-weight: 600;
    }
  }
}
</style>