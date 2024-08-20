<template>
    <div class="filter-box">
        <el-popover
            :width="350"
            placement="bottom"
            trigger="click"
            :visible="flag"
            @show="showPop"
            @hide="hidePop">
            <template #reference>
                <div class="flex-title" @click.stop="openPop">
                    {{ props.title }}
                    <el-icon><Filter /></el-icon>
                </div>
            </template>
            <div class="pop-box" v-click-outside="clickOutside">
                <template v-if="props.filterType === 'input'">
                    <el-input class="pop-max-width" v-model="data" :="{...props.filterParam}"></el-input>
                </template>

                <template v-if="props.filterType === 'number'">
                    <el-input-number class="pop-max-width" v-model="data" :="{...props.filterParam}"/>
                </template>

                <template v-if="props.filterType === 'intervalNumber'">
                    <IntervalNumber v-model="data" :="{...props.filterParam}" ></IntervalNumber>
                </template>

                <template v-if="props.filterType === 'radio'">
                    <el-radio-group v-model="data" :="{...props.filterParam}">
                        <el-radio
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.value]"
                        >{{subitem[props.filterCustom?.label]}}</el-radio>
                    </el-radio-group>
                </template>

                <template v-if="props.filterType === 'radioButton'">
                    <el-radio-group v-model="data" :="{...props.filterParam}">
                        <el-radio-button
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.value]"
                        >{{subitem[props.filterCustom?.label]}}</el-radio-button>
                    </el-radio-group>
                </template>

                <template v-if="props.filterType === 'checkbox'">
                    <el-checkbox-group v-model="data" :="{...props.filterParam}">
                        <el-checkbox
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.value]"
                        >{{subitem[props.filterCustom?.label]}}</el-checkbox>
                    </el-checkbox-group>
                </template>

                <template v-if="props.filterType === 'checkboxButton'">
                    <el-checkbox-group v-model="data" :="{...props.filterParam}">
                        <el-checkbox-button
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.value]"
                        >{{subitem[props.filterCustom?.label]}}</el-checkbox-button>
                    </el-checkbox-group>
                </template>

                <template v-if="props.filterType === 'checkboxSearch'">
                    <CheckboxSearch v-model="data" :toolList="props.filterData()" :filterCustom="props.filterCustom" :="{...props.filterParam}"></CheckboxSearch>
                </template>

                <template v-if="props.filterType === 'time'">
                    <el-time-picker class="pop-max-width" v-model="data" :="{...props.filterParam}" />
                </template>

                <template v-if="props.filterType === 'intervalTime'">
                    <IntervalTime v-model="data" :="{...props.filterParam}" />
                </template>

                <template v-if="props.filterType === 'date'">
                    <el-date-picker class="pop-max-width" v-model="data" :="{...props.filterParam}" />
                </template>

                <template v-if="props.filterType === 'intervalDate'">
                    <IntervalDate v-model="data" :="{...props.filterParam}" />
                </template>

                <template v-if="props.filterType === 'select'">
                    <el-select class="pop-max-width" v-model="data" :teleported="false" :="{...props.filterParam}" :multiple="false" >
                        <el-option
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.label]"
                            :value="subitem[props.filterCustom?.value]"
                        />
                    </el-select>
                </template>

                <template v-if="props.filterType === 'selectMultiple'">
                    <el-select class="pop-max-width" v-model="data" :teleported="false" :="{...props.filterParam}" multiple >
                        <el-option
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.label]"
                            :value="subitem[props.filterCustom?.value]"
                        />
                    </el-select>
                </template>

                <template v-if="props.filterType === 'switch'">
                    <el-switch v-model="data" :="{...props.filterParam}"/>
                </template>
                <div class="popver-footer">
                    <el-button link type="primary" @click="search" :disabled="data == '' || data == undefined || data == null">筛选</el-button>
                    <el-button link type="primary" @click="reset">重置</el-button>
                </div>
            </div>
        </el-popover>
    </div>
</template>

<script setup lang="ts" name="EFilter">
import { ClickOutside as vClickOutside } from 'element-plus'
import IntervalDate from '@/components/XColumn/IntervalDate.vue';
import IntervalTime from '@/components/XColumn/IntervalTime.vue';
import IntervalNumber from '@/components/XColumn/IntervalNumber.vue';
import CheckboxSearch from '@/components/XColumn/checkboxSearch.vue';

interface filterElement {
    title?: string,
    modelValue: any,
    filterType?: string, // 类型，element-plus的表单类型，目前有：input/number/radio/radioButton/checkbox/checkboxButton/time/date/select/selectMultiple/switch/intervalNumber/intervalDate/intervalTime
    filterData?: any,
    filterParam?: any,
    filterCustom?: {
        label: string,
        value: string
    }|any
}

const emits = defineEmits(['update:modelValue', 'search'])
const props = withDefaults(defineProps<filterElement>(), {
    title: undefined,
    modelValue: undefined,
    filterType: undefined,
    filterData: () => [],
    filterParam: undefined,
    filterCustom: () => {
        return {
            label: 'label',
            value: 'value'
        }
    }
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
const data = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    data.value = val
})

const openPop = () => {
    if (isShowSearch.value) {
        flag.value = false
    } else {
        flag.value = true
    }
}

const showPop = () => {
    isShowSearch.value = true
    function keyUpHandle (val: any) {
        if (val.keyCode == '13') {
            search()
        }
    }

    // 在筛选弹框显示时，进行enter的操作
    window.onkeyup = (val) => keyUpHandle(val)
}
const hidePop = () => {
    isShowSearch.value = false
    window.onkeyup = () => {}
}

const clickOutside = () => {
    // reset()
    if (isShowSearch.value) {
        flag.value = false
    }
}

const search = () => {
    flag.value = false
    emits('update:modelValue', data.value)
    emits('search', data.value)
}

const reset = () => {
    flag.value = false
    emits('update:modelValue', undefined)
    emits('search', data.value)
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