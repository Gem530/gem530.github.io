<template>
  <div class="animation-column">
    <div
      :key="i"
      v-for="i in 3"
      :class="{
        'animation-list': true,
        'move-left': i % 2
      }"
      :style="{
        'width': (list.length ? (list.length * 64) / 37.5 : 0) + 'rem',
        'animation-duration': (list.length < 5 ? 5 : list.length) + 's'
      }">
      <div
        :key="i"
        class="animation-item"
        v-for="(item, i) in list"
      ><img :src="item"/></div>
      <div
        :key="i"
        class="animation-item"
        v-for="(item, i) in list"
      ><img :src="item"/></div>
    </div>
  </div>
</template>

<script lang="ts" setup name="AnimationColumn">
import { ref } from 'vue'
const list = ref([
  'https://img1.baidu.com/it/u=2644452384,3800439215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
  'https://img1.baidu.com/it/u=243709734,242917004&fm=253&fmt=auto&app=138&f=JPEG?w=502&h=500',
  'https://img2.baidu.com/it/u=820901756,2424528475&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=501',
  'https://img1.baidu.com/it/u=1509035723,3152201525&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=666',
  'https://img2.baidu.com/it/u=4199347094,2829839768&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
  'https://img1.baidu.com/it/u=4210788551,647669481&fm=253&fmt=auto&app=138&f=JPEG?w=537&h=500',
  'https://img1.baidu.com/it/u=3156196887,333471328&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
])
</script>

<style lang="scss" scoped>
.animation-column {
  position: relative;
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 78px;
    height: 100%;
    z-index: 1;
  }
  &::before {
    left: 0;
    background: linear-gradient(-90deg, rgba(255,255,255,0) 0%, #ffffff 100%);
  }
  &::after {
    right: 0;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, #ffffff 100%);
  }
  .animation-list {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    transform: translateX(-100%);
    animation: moveright 10s linear infinite;
    animation-play-state: running !important;
    &:hover {
      animation-play-state: paused !important;
    }
    &:not(:last-child) {
      margin-bottom: 5px;
    }

    &.move-left {
      justify-content: flex-start;
      animation: moveleft 10s linear infinite;
    }

    .animation-item {
      flex: none;
      width: 59px;
      height: 59px;
      overflow: hidden;
      border-radius: 13px;

      &:not(:last-child ){
        margin-right: 5px;
      }

      img {
        width: 100%;
      }
    }
  }
}

@keyframes moveright {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes moveleft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>