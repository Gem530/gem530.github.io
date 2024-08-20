<template>
    <div class="filter-box">
        <el-popover
            :width="200"
            placement="bottom"
            trigger="click"
            :visible="flag"
            @show="showPop"
            @hide="hidePop">
            <template #reference>
                <div @click.stop="openPop">
                    <slot name="reference"></slot>
                </div>
            </template>
            <div class="pop-box" v-click-outside="clickOutside">
                <slot></slot>
                <div class="popver-footer">
                    <el-button link type="primary" @click="confirm">确定</el-button>
                    <el-button link type="primary" @click="reset">重置</el-button>
                    <el-button link type="primary" @click="cancel">取消</el-button>
                </div>
            </div>
        </el-popover>
    </div>
</template>

<script setup lang="ts" name="EFilter">
import { ClickOutside as vClickOutside } from 'element-plus'

interface filterElement {
    showReset?: boolean
}

const emits = defineEmits(['confirm', 'cancel', 'show', 'hide', 'reset'])
const props = withDefaults(defineProps<filterElement>(), {
    showReset: false
})

// const data = computed({
//     get () {
//         return props.modelValue
//     },
//     set (val) {
//         emits('update:modelValue', val)
//     }
// })
const flag = ref(false)
const isShowSearch = ref(false)
// const data = ref(props.modelValue)

// watch(() => props.modelValue, (val) => {
//     data.value = val
// })

const openPop = () => {
    if (isShowSearch.value) {
        flag.value = false
    } else {
        flag.value = true
    }
}

const showPop = () => {
    isShowSearch.value = true
    emits('show')
    // function keyUpHandle (val: any) {
    //     if (val.keyCode == '13') {
    //         // search()
    //     }
    // }

    // // 在筛选弹框显示时，进行enter的操作
    // window.onkeyup = (val) => keyUpHandle(val)
}
const hidePop = () => {
    isShowSearch.value = false
    emits('hide')
    // window.onkeyup = () => {}
}

const clickOutside = () => {
    // reset()
    if (isShowSearch.value) {
        flag.value = false
    }
}

const reset = () => {
    emits('reset')
}

const confirm = () => {
    flag.value = false
    // emits('update:modelValue', data.value)
    emits('confirm')
}

const cancel = () => {
    flag.value = false
    // emits('update:modelValue', undefined)
    emits('cancel')
}
</script>

<style lang="scss" scoped>
.filter-box {
    display: inline-block;

    .flex-title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
}
:deep(.pop-max-width) {
    width: 100%;
}
.popver-footer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
}
</style>