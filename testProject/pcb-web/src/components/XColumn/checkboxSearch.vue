<template>
    <div class="checkbox-tool-box">
        <el-input v-model.trim="filterText" placeholder="请输入" clearable @input="searchHandle" :="{...attrs}"/>

        <div class="checkbox-tool-list margin-top">
            <el-checkbox
                v-model="checkAll"
                @change="handleCheckAllChange"
            >全选</el-checkbox>
        </div>
        <el-checkbox-group v-model="defaultCheck" class="checkbox-tool-list" @change="handleCheckedCitiesChange">
            <template :key="i" v-for="(item, i) in filterList">
                <el-checkbox
                    :label="item[props.filterCustom?.value]"
                >{{ item[props.filterCustom?.label] }}</el-checkbox>
                <!-- v-if="(filterText && item[props.filterCustom?.label].toLocaleUpperCase().includes(filterText.toLocaleUpperCase())) || !filterText" -->
            </template>
        </el-checkbox-group>
    </div>
</template>

<script setup name="CheckboxSearch" lang="ts">
const attrs = useAttrs()
const emits = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<{
    modelValue: any
    toolList: any
    filterCustom?: {
        label: string,
        value: string
    }
}>(), {
    toolList: () => [],
    modelValue: () => [],
    filterCustom: () => {
        return {
            label: 'label',
            value: 'value'
        }
    }
})

const checkAll = ref(false)
// const toolList = ref<any[]>([])
const filterText = ref('')
const filterList = ref([])
const allCheckList = ref<any>([])
const isIndeterminate = ref(false)
const defaultCheck = computed({
    get () {
        return props.modelValue
    },
    set (val: any) {
        emits('update:modelValue', val)
    }
})

watch(() => props.toolList, (val) => {
    allCheckList.value = val || []
    filterList.value = val || []
}, { immediate: true, deep: true })

watch(() => defaultCheck.value, (val) => {
    const checkedCount = val?.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < filterList.value.length
    checkAll.value = checkedCount === filterList.value.length
    if (val?.length == 0) {
        checkAll.value = false
    }
    console.log('val---', val)
}, { immediate: true, deep: true })

// 筛选
const searchHandle = () => {
    filterList.value = props.toolList.filter((item: any) => (item[props.filterCustom?.label].toLocaleUpperCase().includes(filterText.value.toLocaleUpperCase())))
    checkAll.value = defaultCheck.value?.length === filterList.value.length
}

// 全选
const handleCheckAllChange = (val: any): any => {
    // defaultCheck.value = val ? allCheckList.value.map((item: any) => item[props.filterCustom?.value]) : []
    // isIndeterminate.value = false
    // console.log(val, allCheckList.value, defaultCheck.value)
    defaultCheck.value = val ? filterList.value.map((item: any) => item[props.filterCustom?.value]) : []
}
const handleCheckedCitiesChange = (value: any): any => {
    // const checkedCount = value.length
    // checkAll.value = checkedCount === allCheckList.value.length
    // isIndeterminate.value = checkedCount > 0 && checkedCount < allCheckList.value.length
    console.log(value, allCheckList.value, defaultCheck.value)
}
</script>

<style lang="scss" scoped>
:deep(.checkbox-tool-list) {
    display: flex;
    flex-direction: column;
    max-height: 150px;
    overflow-y: auto;

    .el-checkbox {
        flex: none;
    }

    &.margin-top {
        margin-top: 4px;
    }
}
</style>
