<template>
    <!-- 获取元素宽度 -->
    <div class="auto-btn" ref="autoBtnRef" :="attrs" v-resize="onResize">
        <el-button ref="moreBtnRef" class="auto-btn-item" link type="primary">更多</el-button>
        <template v-for="(item, index) in btnList" :key="index">
            <!-- v-if="item?.isShow && item.isShow()" -->
            <el-button class="auto-btn-item" :ref="(el: any) => getRefs(el, index)" link type="primary" :="item?.attrs">{{ item.title }}</el-button>
        </template>
    </div>
    <div class="auto-btn-show global-flex" :="attrs">
        <template v-for="(item, index) in btnList.slice(0, showBtnNum)" :key="index">
            <!--  v-if="item?.isShow && item.isShow()" -->
            <el-button class="auto-btn-item" link type="primary" @click="item?.fun && item.fun()" :="item?.attrs">{{ item.title }}</el-button>
        </template>
        <el-dropdown trigger="click" @command="commandHandle" v-if="btnList.length != showBtnNum">
            <el-button class="auto-btn-item" link type="primary">更多</el-button>
            <template #dropdown>
            <el-dropdown-menu>
            <template v-for="(item, index) in btnList.slice(showBtnNum)" :key="index">
                <!--  v-if="item?.isShow && item.isShow()" -->
                <el-dropdown-item :style="`color: ${item?.color};`" :command="item">{{ item.title }}</el-dropdown-item>
            </template>
            </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup lang="ts" name="AutoBtn">
// import useAppStore from '@/store/modules/app';
// const tableSize = computed(() => useAppStore().size)
interface btnItem {
    attrs?: any
    title?: string
    color?: string
    fun?: Function
    isShow?: Function // 默认为true true展示，false隐藏
}
const attrs = useAttrs()
// const slots = useSlots()
const emits = defineEmits([''])
const props = withDefaults(defineProps<{
    list: btnItem[]
}>(), {
    list: () => [],
})

const autoBtnRef = ref()
const moreBtnRef = ref()
// 动态ref
const btnRef = reactive<Record<string, any>>({})
const getRefs = (e: any, id: number) => {
    btnRef[id] = e
}

const showBtnNum = ref<number>(0)
const btnList = ref<btnItem[]>([])

const initBtnWidth = () => {
    nextTick(() => {
        const parentWidth = autoBtnRef.value.clientWidth
        const templist = [{ id: 'moreBtnRef', width: moreBtnRef.value?.ref?.clientWidth || 0 }]
        for (let key in btnRef) {
            const style = window.getComputedStyle(btnRef[key].ref) // 用于获取元素的样式
            let marginLeftNumber = style.marginLeft?.length ? Number(style.marginLeft.replace('px','')) : 0
            templist.push({
                id: key,
                width: (btnRef[key]?.ref?.clientWidth || 0) + marginLeftNumber
            })
        }
        // console.log('templist', templist)
        let tempWidth = 0
        templist.map((item: any, index: number) => {
            tempWidth = tempWidth + item.width
            if (tempWidth <= parentWidth) {
                showBtnNum.value = index
            }
            // if (item.width) {}
        })
        // console.log('showBtnNum', parentWidth, templist, showBtnNum.value)
    })
}

watch(() => props.list, (newV, oldV) => {
    showBtnNum.value = 0
    let tempBtnList = []
    tempBtnList = newV || []
    tempBtnList?.length && tempBtnList.map((item: btnItem) => {
        const objKeys = Object.keys(item)
        // console.log(objKeys)
        if (!objKeys.includes('isShow')) {
            item.isShow = () => true
        }
    })
    btnList.value = tempBtnList.filter((f: any) => f?.isShow && f.isShow())

    initBtnWidth()
    // console.log(btnList.value)
}, { deep: true, immediate: true })

// 下拉菜单点击
const commandHandle = (val: btnItem) => {
    val?.fun && val?.fun()
}

// 监听元素变化
const onResize = (val: any) => {
    // console.log('---', val)
    initBtnWidth()
}
</script>

<style lang="scss" scoped>
.auto-btn {
    width: 100%;
    height: 0;
    opacity: 0;
    overflow: hidden;
}
.auto-btn-show {
    width: 100%;
}
</style>