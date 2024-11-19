<template>
    <div class="filter-box">
        <el-popover
            trigger="click"
            :visible="flag"
            @show="showPop"
            @hide="hidePop"
            placement="bottom"
            :width="props.width">
            <template #reference>
                <div @click.stop="openPop">
                    <slot name="reference"></slot>
                </div>
            </template>
            <div class="pop-box" v-click-outside="clickOutside">
                <slot></slot>
                <div class="popver-footer">
                    <div class="global-flex flex-start">
                        <el-button link @click="confirm">确定</el-button>
                        <el-button link @click="reset">重置</el-button>
                    </div>
                    <el-button link @click="cancel">取消</el-button>
                </div>
            </div>
        </el-popover>
    </div>
</template>

<script setup lang="ts" name="EFilter">
import { ClickOutside as vClickOutside } from 'element-plus'

interface filterElement {
    width?: number
    showReset?: boolean
}

const emits = defineEmits(['confirm', 'cancel', 'show', 'hide', 'reset'])
const props = withDefaults(defineProps<filterElement>(), {
    width: 184,
    showReset: false,
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
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
    padding-top: 8px;
    border-top: 1px solid #F0F0F0;
}
</style>