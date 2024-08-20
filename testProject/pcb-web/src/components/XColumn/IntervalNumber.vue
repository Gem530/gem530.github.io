<template>
    <div class="interval-number">
        <el-input-number v-model="number1" :="{...props.startParams}" :max="props.linkPanels ? number2 : props.startParams?.max"/>
        <span>{{ props.to }}</span>
        <el-input-number v-model="number2" :="{...props.endParams}" :min="props.linkPanels ? number1 : props.endParams?.min"/>
    </div>
</template>

<script setup name="IntervalNumber" lang="ts">
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
const number1 = ref(props.modelValue[0] || undefined)
const number2 = ref(props.modelValue[1] || undefined)

watch(() => props.modelValue, (val: anu[]) => {
    if (!val || !val?.length) {
        number1.value = undefined
        number2.value = undefined
    }
})

watch(() => [number1.value, number2.value], (newV) => {
    emits('update:modelValue', newV)
})
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