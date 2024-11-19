<template>
    <div :class="`interval-number ${props.auto && 'auto-width'}`">
        <el-date-picker :="{...props.startParams, ...attrs}" :disabled-date="props.linkPanels ? dateDisable1 : props.startParams?.disabledDate" v-model="date1"/>
        <span>{{ props.to }}</span>
        <el-date-picker :="{...props.endParams, ...attrs}" :disabled-date="props.linkPanels ? dateDisable2 : props.endParams?.disabledDate" v-model="date2"/>
    </div>
</template>

<script setup name="IntervalDate" lang="ts">
import dayjs from 'dayjs';
import { ref, watch, computed, useAttrs, defineProps } from 'vue';

const attrs = useAttrs()
const emits = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<{
    to?: string
    auto?: boolean
    endParams?: any
    modelValue: any
    disEnd?: string
    disStart?: string
    startParams?: any
    linkPanels?: boolean
    isAcceptValue?: boolean
}>(), {
    to: '-',
    auto: false,
    linkPanels: true,
    isAcceptValue: false,
    endParams: () => {},
    modelValue: () => [],
    startParams: () => {}
})
// const value = computed({
//     get () {
//         return props.modelValue
//     },
//     set (val: any) {
//         emits('update:modelValue', val)
//     }
// })
const date1 = ref(props.modelValue[0] || undefined)
const date2 = ref(props.modelValue[1] || undefined)

watch(() => props.modelValue, (val: any[]) => {
    if (!val || !val?.length) {
        date1.value = undefined
        date2.value = undefined
    }
    if (props.isAcceptValue && val.length) {
        date1.value = val[0];
        (val.length > 1) && (date2.value = val[1])
    }
})

watch(() => [date1.value, date2.value], (newV) => {
    emits('update:modelValue', newV)
})

const dateDisable1 = (date: Date) => {
    let res = false
    let res1 = false
    let res2 = false
    if (!date2.value) {
        res = false
    } else {
        res = new Date(dayjs(date).format('YYYY-MM-DD HH:mm:ss')).getTime() > new Date(dayjs(date2.value).format('YYYY-MM-DD HH:mm:ss')).getTime()
    }
    if (props?.disStart) res1 = date.getTime() < new Date(props?.disStart).getTime()
    if (props?.disEnd) res2 = date.getTime() > new Date(props?.disEnd).getTime()
    return res || res1 || res2
    // if (props?.disStart) return date.getTime() < new Date(props?.disStart).getTime()
    // if (props?.disEnd) return date.getTime() > new Date(props?.disEnd).getTime()
    // if (!date2.value) return false

    // return date.getTime() > new Date(date2.value).getTime()
}

const dateDisable2 = (date: Date) => {
    let res = false
    let res1 = false
    let res2 = false
    if (!date1.value) {
        res = false
    } else {
        res = new Date(dayjs(date).format('YYYY-MM-DD HH:mm:ss')).getTime() < new Date(dayjs(date1.value).format('YYYY-MM-DD HH:mm:ss')).getTime()
    }
    if (props?.disStart) res1 = date.getTime() < new Date(props?.disStart).getTime()
    if (props?.disEnd) res2 = date.getTime() > new Date(props?.disEnd).getTime()
    return res || res1 || res2
    // if (props?.disStart) return date.getTime() < new Date(props?.disStart).getTime()
    // if (props?.disEnd) return date.getTime() > new Date(props?.disEnd).getTime()
    // if (!date1.value) return false

    // return date.getTime() < new Date(date1.value).getTime()
}

const initData = (arr: [any, any]) => {
  date1.value = arr[0]
  date2.value = arr[1]
}

defineExpose({ initData })
</script>

<style lang="scss" scoped>
.interval-number {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    &.auto-width {
        :deep(.el-date-editor) {
            &.el-input {
                flex: 1;
                // --el-date-editor-width: auto;
                .el-input__wrapper {
                    width: 100%;
                }
            }
        }
    }

    span {
        margin: 0 6px;
    }
}
</style>
