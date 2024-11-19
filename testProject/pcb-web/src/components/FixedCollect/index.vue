<template>
    <div class="fixed-collect" ref="fixedRef" v-if="isShow"
        :style="`top: ${point.y}px; right: ${point.x}px`"
        @touchend="mouseleave"
        @mousedown="mousedown"
        @mousemove="mousemove"
        @touchstart="mouseenter"
        @mouseenter="mouseenter"
        @mouseleave="mouseleave">
        <div :class="{'float-collect': true, 'all-show': allShow}">
            <el-icon size="35px" :color="isChoose ? settingsStore.theme : '#fff'" @click.stop="collectRoute" style="cursor: pointer;"><StarFilled /></el-icon>
        </div>
    </div>
</template>

<script setup name="FixedCollect" lang="ts">
import { TagView, RouteOption } from 'vue-router';
import useSettingsStore from '@/store/modules/settings';
import useTagsViewStore from "@/store/modules/tagsView";
import usePermissionStore from "@/store/modules/permission";

const route = useRoute()
const settingsStore = useSettingsStore()
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()

const isShow = ref(false)
const allShow = ref(false)
const isChoose = ref(false)
const currentRoute = ref<TagView>()

const size = ref(21)
const fixedRef = ref()
const padding = ref(0)
const touchFlag = ref(false)
const windowW = ref(document.body.clientWidth || 375)
const windowH = ref(document.body.clientHeight || 667)
const showBox = computed({
    get: () => props.show,
    set: (val: boolean) => {
        return emits('update:show', !val)
    }
})
const width = ref(windowW.value - size.value - padding.value)
const point = ref({
    x: 0,
    y: 150
})

// 结束拖动
const mouseup = () => {
    touchFlag.value = false
    point.value.x = 0
    // if (point.value.x > windowW.value / 2 - padding.value) {
    //     point.value.x = windowW.value - size.value - padding.value
    // } else {
    //     point.value.x = 0.1 - padding.value
    // }
    // if (point.value.y > windowH.value) {
    //     point.value.y = windowH.value - size.value - padding.value
    // } else if (point.value.y < 0) {
    //     point.value.y = 0.1 - padding.value
    // }
}
// 开始拖动
const mousedown = () => {
    touchFlag.value = true
}
// 拖动中
const mousemove = (e: Event) => {
    // console.log(e)
    e.stopPropagation()
    e.preventDefault()
    if (!touchFlag.value) return
    let clientX = e?.touches ? e?.touches[0]?.clientX : e.clientX
    let clientY = e?.touches ? e?.touches[0]?.clientY : e.clientY
    point.value = {
        x: width.value - (clientX - size.value/2 - padding.value),
        y: clientY - size.value/2 - padding.value
    }
}

// 鼠标移进，动画存在
const mouseenter = () => {
    allShow.value = true
}
// 鼠标移出，动画删除
const mouseleave = () => {
    allShow.value = false
}
const collectRoute = () => {
    isChoose.value = !isChoose.value
    if (isChoose.value) {
        tagsViewStore.addCollectViews(currentRoute.value)
    } else {
        tagsViewStore.delCollectView(currentRoute.value)
    }
}
const sidebarRouters = ref<RouteOption[]>([])
// 递归 获取一级菜单
function getNoHideRoute (list: RouteOption[]) {
    const tempList = list.filter(v => {
        if (v.children && v.children.length) {
            getNoHideRoute(v.children)
        }
        return !v.hidden && v.path
    })
    return tempList
}
// 递归 判断是否一级菜单
function isOneMenu (item: RouteOption, list: RouteOption[]) {
    let flag = false
    if (!list && !list?.length) return false
    flag = list.some((v: RouteOption) => {
        if (v.name == item.name && v.meta?.title == item.meta?.title) {
            return true
        } else {
            return isOneMenu(item, v.children)
        }
    })
    return flag
}
watch([() => permissionStore.sidebarRouters, () => route], ([val, val1]) => {
    if (val) {
        sidebarRouters.value = getNoHideRoute(permissionStore.sidebarRouters)
    }
    if (val1) {
        const { meta, name, path, query, params, matched, fullPath } = val1
        const tempRoute = { meta, name, path, query, fullPath }
        // 一级菜单
        isShow.value = isOneMenu(tempRoute, sidebarRouters.value)
        currentRoute.value = tempRoute
        isChoose.value = tagsViewStore.collectViews.some(v => v.name == currentRoute.value.name && v.meta?.title == currentRoute.value.meta?.title)
    }
}, { deep: true, immediate: true })

onMounted(() => {
    // fixedRef
    window.addEventListener('mouseup', mouseup)
    // window.addEventListener('mousemove', mousemove)
})
onBeforeUnmount(() => {
    window.removeEventListener('mouseup', mouseup)
})
</script>

<style lang="scss" scoped>
.fixed-collect {
    position: fixed;
    // width: 60px;
    height: 40px;
    background: rgba($color: #000, $alpha: 0.7);
    padding: 2px 0 2px 6px;
    border-radius: 20px 0 0 20px;
    z-index: 999;

    .float-collect {
        width:15px;
        overflow: hidden;
        transition: all 0.3s;
        &.all-show {
            width: 60px;
        }
    }
}
</style>