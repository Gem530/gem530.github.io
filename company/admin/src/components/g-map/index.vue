<template>
  <el-autocomplete
    v-model="adrname"
    value-key="title"
    placeholder="请输入地址"
    :fetch-suggestions="searchAddress"
    @select="handleSelect"
  />
  <el-button @click="searchCrium">搜索周边</el-button>
  <el-button @click="toAddress('WalkingRoute')">到这去-步行</el-button>
  <el-button @click="toAddress('RidingRoute')">到这去-骑行</el-button>
  <el-button @click="toAddress('TransitRoute')">到这去-公交</el-button>
  <el-button @click="toAddress('DrivingRoute')">到这去-驾车</el-button>
  <div ref="GMapRef" :style="{width: props.width,height: props.height}"></div>
</template>

<script lang="ts" setup name="map">
import {
  ref,
  onMounted,
  defineEmits,
  defineProps,
  withDefaults
} from 'vue'
const GMapRef = ref()
const emits = defineEmits(['getMapInfo'])
const props = withDefaults(defineProps<{
  lng?: number, // 经度
  lat?: number, // 纬度
  width?: string,
  height?: string
}>(), {
  width: '650px',
  height: '650px'
})

let map: any
const adrname = ref()
const localInfo: any = ref()
const BMap = (window as any).BMap
const targetPoint = ref({
  lng: 116.404,
  lat: 39.915
})

onMounted(async () => {
  localInfo.value = await getLocation()
  init()
})

// 获取当前位置
const getLocation = () => {
  return new Promise((resolve, reject) => {
    const geolocation = new BMap.Geolocation({
      maximumAge: 10, // 清除缓存
    })
    geolocation.enableSDKLocation() // 开启SDK辅助定位
    geolocation.getCurrentPosition((r: any) => {
      // console.log('经纬度：', r.point)
      // console.log(geolocation.getStatus(), BMAP_STATUS_SUCCESS) // 0 0
      if (geolocation.getStatus() == BMAP_STATUS_SUCCESS) {
        const gc = new BMap.Geocoder()
        gc.getLocation(r.point, (res: any) => {
          // console.log('address：', res.address)
          r.point.lng = props.lng ?? r.point.lng
          r.point.lat = props.lat ?? r.point.lat
          resolve({
            point: r.point,
            address: res.address
          })
        })
      } else {
        // console.log(geolocation.getStatus())
        reject(geolocation.getStatus())
      }
    })
  })
}

const init = () => {
  map = new BMap.Map(GMapRef.value)
  const { lng, lat } = localInfo.value.point
  let point = new BMap.Point(lng, lat)

  map.centerAndZoom(point, 15)
  map.enableScrollWheelZoom(true) // 开启滚轮缩放
  addMarker(lng, lat)
  
  // 声明控件并添加到地图中
  const scaleCtrl = new BMap.ScaleControl() // 添加比例尺控件
  map.addControl(scaleCtrl)
  const cityCtrl = new BMap.CityListControl() // 添加城市列表控件
  map.addControl(cityCtrl)

  map.addEventListener('click', (e: any) => {
    const { lng, lat } = e.point
    // addMarker(lng, lat)
    targetPoint.value = e.point
    console.log(lng, lat)
  })
}

// 选择地址
const handleSelect = (item: any) => {
  map.clearOverlays() // 清除地图上所有覆盖物
  map.centerAndZoom(item.point, 15)
  addMarker(item.point.lng, item.point.lat)
  targetPoint.value = item.point
  emits('getMapInfo', item)
}

// 地址搜索
const searchAddress = (query: string, cb: (arg: any) => void) => {
  let local = new BMap.LocalSearch(map, { // 智能搜索
    onSearchComplete: () => {
      const result = local.getResults()?.Ir || []
      console.log(result)
      cb(result)
    }
  })
  local.search(query)
}

// 搜索周边
const searchCrium = () => {
  map.clearOverlays() // 清除地图上所有覆盖物
  const range = 1000 // 搜索的范围
  const { lng, lat } = localInfo.value.point
  let point = new BMap.Point(lng, lat)
  var circle = new BMap.Circle(point, range, {fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3})
  map.addOverlay(circle);
  let local = new BMap.LocalSearch(map, { //智能搜索
    renderOptions: {map: map, autoViewport: false}
  })
  local.searchNearby(adrname.value, point, range)
}

// 路线规划
const toAddress = (type: string) => {
  map.clearOverlays() // 清除地图上所有覆盖物
  // 驾车路线 DrivingRoute
  // 步行路线 WalkingRoute
  // 公交路线 TransitRoute https://lbsyun.baidu.com/jsdemo3.0.htm#transitroute
  // 骑行路线 RidingRoute
  let walking = new BMap[type](map, {
    onSearchComplete: () => {
      const result = walking.getResults() // 获取路线结果
      console.log(result)
    },
    renderOptions: {
      map: map,
      autoViewport: true
    }
  })
  const { lng, lat } = localInfo.value.point
  const { lng: tlng, lat: tlat } = targetPoint.value
  let start = new BMap.Point(lng, lat)
  let end = new BMap.Point(tlng, tlat)
  walking.search(start, end)
}

// 添加marker
const addMarker = (lng: number, lat: number) => {
  // lng经度 lat纬度
  const point = new BMap.Point(lng, lat)
  const marker = new BMap.Marker(point)
  map.addOverlay(marker)
  marker.setAnimation(BMAP_ANIMATION_BOUNCE) // 跳动的动画
  marker.enableDragging() // marker 可拖拽
  // marker.disableDragging() // marker 不可拖拽
}
</script>