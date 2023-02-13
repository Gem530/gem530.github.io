<template>
  <div class="fixed-icon">
    <div
      ref="fixedRef"
      :class="{'fixed-box': true, 'animation-out': !touchFlag}"
      :style="{
        // right: point.x || 0,
        padding: padding + 'px',
        bottom: point.y ? undefined : '12%',
        top: point.y ? point.y + 'px' : undefined,
        left: point.x ? point.x + 'px' : undefined,
      }"
      @touchend="touchend"
      @touchmove="touchmove"
      @touchstart="touchstart">
      <slot><van-icon name="fire" :size="size"/></slot>
    </div>
  </div>
</template>

<script lang="ts" setup name="FixedIcon">
import { ref, defineProps, withDefaults } from 'vue'

const props = withDefaults(defineProps<{
    size?: number
}>(), {
    size: 50
})

const fixedRef = ref()

const size = ref(props.size)
const padding = ref(10)
const touchFlag = ref(false)
const windowW = ref(document.body.clientWidth || 375)
const windowH = ref(document.body.clientHeight || 667)
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
</style>