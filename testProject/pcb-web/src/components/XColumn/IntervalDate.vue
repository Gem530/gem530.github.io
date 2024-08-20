<template>
    <div class="interval-number">
        <el-date-picker :="{...props.startParams, ...attrs}" :disabled-date="props.linkPanels ? dateDisable1 : props.startParams?.disabledDate" v-model="date1"/>
        <span>{{ props.to }}</span>
        <el-date-picker :="{...props.endParams, ...attrs}" :disabled-date="props.linkPanels ? dateDisable2 : props.endParams?.disabledDate" v-model="date2"/>
    </div>
</template>

<script setup name="IntervalDate" lang="ts">
import { ref, watch, computed, useAttrs, defineProps } from 'vue';

const attrs = useAttrs()
const emits = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<{
    to?: string
    endParams?: any
    modelValue: any
    startParams?: any
    linkPanels?: boolean
}>(), {
    to: '-',
    linkPanels: true,
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

watch(() => props.modelValue, (val: anu[]) => {
    if (!val || !val?.length) {
        date1.value = undefined
        date2.value = undefined
    }
})

watch(() => [date1.value, date2.value], (newV) => {
    emits('update:modelValue', newV)
})

const dateDisable1 = (date: Date) => {
    if (!date2.value) return false

    return date.getTime() > new Date(date2.value).getTime()
}

const dateDisable2 = (date: Date) => {
    if (!date1.value) return false

    return date.getTime() < new Date(date1.value).getTime()
}

const initData = (arr: [any, any]) => {
  date1.value = arr[0]
  date2.value = arr[1]
}

defineExpose({ initData })
</script>

<style lang="scss" scoped>
.interval-number {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
        margin: 0 6px;
    }
}
</style>
