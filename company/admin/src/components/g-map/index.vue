<template>
  <el-autocomplete
    v-model="value"
    value-key="title"
    placeholder="请输入地址"
    :fetch-suggestions="searchAddress"
    @select="handleSelect"
  />
  <el-button @click="searchCrium">搜索周边</el-button>
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
const value = ref()
const localInfo: any = ref()
const BMap = (window as any).BMap

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
    console.log(lng, lat)
  })

  // 驾车路线 DrivingRoute
  // 步行路线 WalkingRoute
  // 公交路线 TransitRoute https://lbsyun.baidu.com/jsdemo3.0.htm#transitroute
  // 骑行路线 RidingRoute
  // var walking = new BMap.WalkingRoute(map, { 
  //   renderOptions: { 
  //     map: map, 
  //     autoViewport: true 
  //   }
  // })
  // var start = new BMap.Point(116.310791, 40.003419)
  // var end = new BMap.Point(116.326419, 40.003519)
  // walking.search(start, end)
}

// 选择地址
const handleSelect = (item: any) => {
  map.centerAndZoom(item.point, 15)
  addMarker(item.point.lng, item.point.lat)
  emits('getMapInfo', item)
}

// 地址搜索
const searchAddress = (query: string, cb: (arg: any) => void) => {
  map.clearOverlays() // 清除地图上所有覆盖物
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
  const { lng, lat } = localInfo.value.point
  let point = new BMap.Point(lng, lat)
  var circle = new BMap.Circle(point,1000,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3})
  map.addOverlay(circle);
  let local = new BMap.LocalSearch(map, { //智能搜索
    renderOptions: {map: map, autoViewport: false}
  })
  local.searchNearby('餐饮',point,500)
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