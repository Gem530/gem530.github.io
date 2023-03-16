<template>
  <div class="fixed-icon">
    <div
      ref="fixedRef"
      :class="{'fixed-box': true, 'animation-out': !touchFlag}"
      :style="{
        // right: point.x || 0,
        padding: padding + 'px',
        top: point.y ? point.y + 'px' : '450px',
        left: point.x ? point.x + 'px' : undefined,
      }"
      @touchend="touchend"
      @touchmove="touchmove"
      @touchstart="touchstart">
      <slot v-if="!showBox"><van-icon name="fire" :size="size" style="z-index: 1000;"/></slot>
      <div
        ref="FixedAllRef"
        class="fixed-all-box"
        :style="{
          'width': showBox ? '100vw' : size+'px',
          'height': showBox ? '100vh' : size+'px',
          'background': showBox ? '' : 'transparent',
          'transform': `translate(${showBox ? `-${point.x + padding}px,-${(point.y || 450) + padding}px` : '0,0'})`,
        }"
        @touchend.stop="undefined"
        @touchmove.stop="undefined"
        @touchstart.stop="undefined">
        <slot name="pop-box" v-if="showBox"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="FixedIcon">
import { ref, computed, defineProps, defineEmits, withDefaults } from 'vue'

const props = withDefaults(defineProps<{
    size?: number,
    show?: boolean
}>(), {
    size: 50,
    show: false
})

const emits = defineEmits(['update:show'])
const fixedRef = ref()
const FixedAllRef = ref()

const size = ref(props.size)
const padding = ref(10)
const touchFlag = ref(false)
const windowW = ref(document.body.clientWidth || 375)
const windowH = ref(document.body.clientHeight || 667)
const showBox = computed({
  get: () => props.show,
  set: (val: boolean) => {
    return emits('update:show', !val)
  }
})
const point = ref({
  x: windowW.value - size.value - padding.value,
  y: 0
})

const touchstart = (e: Event) => {
  touchFlag.value = true
}

const touchmove = (e: TouchEvent) => {
  e.stopPropagation()
  e.preventDefault()
  if (!touchFlag.value) return
  point.value = {
    x: e.touches[0].clientX - size.value/2 - padding.value,
    y: e.touches[0].clientY - size.value/2 - padding.value
  }
}

const touchend = (e: TouchEvent) => {
  touchFlag.value = false
  if (point.value.x > windowW.value / 2 - padding.value) {
    point.value.x = windowW.value - size.value - padding.value
  } else {
    point.value.x = 0.1 - padding.value
  }
  if (point.value.y > windowH.value) {
    point.value.y = windowH.value - size.value - padding.value
  } else if (point.value.y < 0) {
    point.value.y = 0.1 - padding.value
  }
}
</script>

<style lang="scss" scoped>
.fixed-box {
  position: fixed;
  color: var(--body-color-text);
  z-index: 999;
  // padding: 20px;
}

.animation-out {
  transition: all 0.2s;
}

.fixed-all-box {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba($color: #000000, $alpha: 0.6);
  transition: all 0.2s linear;
  overflow: hidden;
  z-index: 999;
}
</style>