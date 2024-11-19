<template>
    <el-input-number ref="xInputNumberRef" class="x-input-number" v-model="data" :controls="false" :="attrs" v-inputNumber="(value: any) => data = value">
        <template
            :key="i"
            v-slot:[key]="item"
            v-for="(item, key, i) in slots"
        >
            <slot :name="key" v-bind="item" />
        </template>
    </el-input-number>
</template>

<script setup lang="ts" name="XInputNumber">
const slots = useSlots()
const attrs: any = useAttrs()
console.log('attrs', attrs)
const xInputNumberRef = ref()
const emits = defineEmits(['update:modelValue', 'changeNumber'])
const props = withDefaults(defineProps<{
    modelValue: string|number
}>(), {
    modelValue: '',
})
const data = computed({
    get () {
        return props.modelValue
    },
    set (val: any) {
        emits('update:modelValue', val)
    }
})

// const changeHandle = (value) => {
//     console.log('changeHandle', value)
// }
// const inputHanlde = (value) => {
//     console.log('inputHanlde', value)
// }
// const inputNumberHandle = (value) => {
//     console.log('inputNumber', value)
// }

// function handleChange(value: any) {
//     // 使用正则表达式限制只能输入数字和小数点后两位
//     const regex = /^(\d+)?(\.\d{0,2})?$/;
//     // 如果输入值不符合正则表达式，则将inputValue重置为上一个合法的值
//     console.log(value, !regex.test(value))
//     if (!regex.test(value)) {
//         data.value = value.replace(/^(\d+)?(\.\d{0,2})?.*$/, '$1$2');
//     }
//     emits('changeNumber', data.value)
// }

defineExpose({ xInputNumberRef })
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
// .x-input-number {
//     /* 隐藏number输入框的调节箭头 */
//     input::-webkit-inner-spin-button,
//     input::-webkit-outer-spin-button {
//         -webkit-appearance: none;
//         margin: 0;
//     }
//     input {
//         -moz-appearance: textfield; /* Firefox 支持 */
//     }
// }
</style>