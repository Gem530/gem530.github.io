<template>
    <div class="interval-number">
        <el-time-picker :="{...props.startParams, ...attrs}" :isRange="false" v-model="time1"
        @focus="timeType = 1"
        :disabled-hours="linkPanels ? disabledHours1 : props.startParams?.disabledHours"
        :disabled-minutes="linkPanels ? disabledMinutes1 : props.startParams?.disabledMinutes"
        :disabled-seconds="linkPanels ? disabledSeconds1 : props.startParams?.disabledSeconds"/>
        <span>{{ props.to }}</span>
        <el-time-picker :="{...props.endParams, ...attrs}" :isRange="false" v-model="time2"
        @focus="timeType = 2"
        :disabled-hours="linkPanels ? disabledHours2 : props.startParams?.disabledHours"
        :disabled-minutes="linkPanels ? disabledMinutes2 : props.startParams?.disabledMinutes"
        :disabled-seconds="linkPanels ? disabledSeconds2 : props.startParams?.disabledSeconds"/>
    </div>
</template>

<script setup name="IntervalTime" lang="ts">
import { ref, watch, computed, useAttrs } from 'vue';

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
const time1 = ref(props.modelValue[0] || undefined)
const time2 = ref(props.modelValue[1] || undefined)
watch(() => props.modelValue, (val: anu[]) => {
    if (!val || !val?.length) {
        time1.value = undefined
        time2.value = undefined
    }
})

watch(() => [time1.value, time2.value], (newV) => {
    emits('update:modelValue', newV)
})
const timeType = ref(1)

const makeRange = (start: number, end: number) => {
    const result: number[] = []
    for (let i = start; i <= end; i++) {
        result.push(i)
    }
    return result
}
const disabledHours1 = () => {
    if (time2.value && timeType.value == 1) {
        const time2Hour: any = new Date('2020-01-01 '+time2.value).getHours()
        console.log(time2Hour)
        if (time2Hour == 'NaN') return []
        return makeRange(time2Hour + 1, 23)
    }
}
const disabledMinutes1 = (hour: number) => {
    if (time2.value && timeType.value == 1) {
        const time2Hour = (new Date('2020-01-01 '+time2.value)).getHours()
        const time2Minutes = (new Date('2020-01-01 '+time2.value)).getMinutes()
        if (hour === time2Hour) {
            return makeRange(time2Minutes + 1, 59)
        }
    }
}
const disabledSeconds1 = (hour: number, minute: number) => {
    if (time2.value && timeType.value == 1) {
        const time2Hour = (new Date('2020-01-01 '+time2.value)).getHours()
        const time2Minutes = (new Date('2020-01-01 '+time2.value)).getMinutes()
        const time2Seconds = (new Date('2020-01-01 '+time2.value)).getSeconds()
        if (hour === time2Hour && minute === time2Minutes) {
            return makeRange(time2Seconds + 1, 59)
        }
    }
}

const disabledHours2 = () => {
    if (time1.value && timeType.value == 2) {
        const temp1Time = JSON.parse(JSON.stringify(time1.value))
        const time1Hour: any = (new Date('2020-01-02 '+time1.value)).getHours()
        console.log(temp1Time, time1Hour)
        if (time1Hour == 'NaN') return []
        return makeRange(0, time1Hour - 1)
    }
}
const disabledMinutes2 = (hour: number) => {
    if (time1.value && timeType.value == 2) {
        const time1Hour = new Date('2020-01-01 '+time1.value).getHours()
        const time1Minutes = new Date('2020-01-01 '+time1.value).getMinutes()
        if (hour === time1Hour) {
            return makeRange(0, time1Minutes - 1)
        }
    }
}
const disabledSeconds2 = (hour: number, minute: number) => {
    if (time1.value && timeType.value == 2) {
        const time1Hour = new Date('2020-01-01 '+time1.value).getHours()
        const time1Minutes = new Date('2020-01-01 '+time1.value).getMinutes()
        const time1Seconds = new Date('2020-01-01 '+time1.value).getSeconds()
        if (hour === time1Hour && minute === time1Minutes) {
            return makeRange(0, time1Seconds - 1)
        }
    }
}
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