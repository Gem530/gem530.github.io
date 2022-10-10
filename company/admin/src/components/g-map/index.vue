<template>
  <div ref="GMapRef" :style="{width: '600px',height:'600px'}"></div>
</template>

<script lang="ts" setup name="map">
import {
  ref,
  onMounted
} from 'vue'
const GMapRef = ref()
const BMap = (window as any).BMap

onMounted(() => {
  let map = new BMap.Map(GMapRef.value)
  let point = new BMap.Point(116.404, 39.915)

  map.centerAndZoom(point, 15)
  map.enableScrollWheelZoom(true)
  map.addEventListener('click', (e: any) => {
    console.log(e.point)
  })
})
</script>