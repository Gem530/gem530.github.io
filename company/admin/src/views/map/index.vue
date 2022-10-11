<template>
  <div>
    <h2>地图</h2>
    <g-map @getMapInfo="getMapInfo"></g-map>
  </div>
</template>

<script lang="ts" setup name="map">
import { ref } from 'vue'
interface mapInfo {
  address: string,
  point: {
    lat: number,
    lng: number
  },
  [key: string]: any
}
// 天安门经纬度 lng:116.404 lat:39.915
const getMapInfo = (item: mapInfo) => {
  console.log(item)
}
</script>