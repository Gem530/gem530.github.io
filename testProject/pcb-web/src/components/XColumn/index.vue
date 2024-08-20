<template>
    <vxe-column :show-overflow="attrs['field'] && attrs['field'] == 'make' ? false : true" show-header-overflow v-if="props.filterType" :filters="filterOption" :="attrs">
        <template #filter="{ $panel, column }">
            <div class="filter-box-search">
                <template :="{...props.filterParam}" v-if="props.filterType === 'input'">
                    <el-input v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @input="$panel.changeOption($event as any, !!option.data, option)"></el-input>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'number'">
                    <el-input-number v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event as any, !!option.data, option)"/>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'intervalNumber'">
                    <IntervalNumber v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" @change="$panel.changeOption($event, !!option.data, option)" @enter="$panel.confirmFilter()"></IntervalNumber>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'radio'">
                    <el-radio-group v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event as any, !!option.data, option)">
                        <el-radio
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.value]"
                        >{{subitem[props.filterCustom?.label]}}</el-radio>
                    </el-radio-group>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'radioButton'">
                    <el-radio-group v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event as any, !!option.data, option)">
                        <el-radio-button
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.value]"
                        >{{subitem[props.filterCustom?.label]}}</el-radio-button>
                    </el-radio-group>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'checkbox'">
                    <el-checkbox-group v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event as any, !!option.data, option)">
                        <el-checkbox
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.value]"
                        >{{subitem[props.filterCustom?.label]}}</el-checkbox>
                    </el-checkbox-group>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'checkboxButton'">
                    <el-checkbox-group v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event as any, !!option.data, option)">
                        <el-checkbox-button
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.value]"
                        >{{subitem[props.filterCustom?.label]}}</el-checkbox-button>
                    </el-checkbox-group>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'checkboxSearch'">
                    <CheckboxSearch :toolList="props.filterData()" :filterCustom="props.filterCustom" v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event as any, !!option.data, option)"/>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'time'">
                    <el-time-picker v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event, !!option.data, option)"/>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'intervalTime'">
                    <IntervalTime v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event, !!option.data, option)"/>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'date'">
                    <el-date-picker v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event, !!option.data, option)"/>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'intervalDate'">
                    <IntervalDate v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event, !!option.data, option)"/>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'select'">
                    <el-select v-model="option.data" :teleported="false" :="{...props.filterParam}" :multiple="false" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event, !!option.data, option)">
                        <el-option
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.label]"
                            :value="subitem[props.filterCustom?.value]"
                        />
                    </el-select>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'selectMultiple'">
                    <el-select v-model="option.data" :teleported="false" :="{...props.filterParam}" multiple v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event, !!option.data, option)">
                        <el-option
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.label]"
                            :value="subitem[props.filterCustom?.value]"
                        />
                    </el-select>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'switch'">
                    <el-switch v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event as any, !!option.data, option)"/>
                </template>
            </div>
        </template>
        <template
            :key="key"
            v-slot:[key]="item"
            v-for="(item, key) in slots"
        >
            <slot :name="key" v-bind="item"/>
        </template>
    </vxe-column>
    <vxe-column :show-overflow="attrs['field'] && attrs['field'] == 'make' ? false : true" show-header-overflow v-else :filters="undefined" :="attrs">
        <template #filter="{ $panel, column }">
            <div class="filter-box-search">
                <template :="{...props.filterParam}" v-if="props.filterType === 'input'">
                    <el-input v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @input="$panel.changeOption($event as any, !!option.data, option)"></el-input>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'number'">
                    <el-input-number v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event as any, !!option.data, option)"/>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'intervalNumber'">
                    <IntervalNumber v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" @change="$panel.changeOption($event, !!option.data, option)" @enter="$panel.confirmFilter()"></IntervalNumber>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'radio'">
                    <el-radio-group v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event as any, !!option.data, option)">
                        <el-radio
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.value]"
                        >{{subitem[props.filterCustom?.label]}}</el-radio>
                    </el-radio-group>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'radioButton'">
                    <el-radio-group v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event as any, !!option.data, option)">
                        <el-radio-button
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.value]"
                        >{{subitem[props.filterCustom?.label]}}</el-radio-button>
                    </el-radio-group>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'checkbox'">
                    <el-checkbox-group v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event as any, !!option.data, option)">
                        <el-checkbox
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.value]"
                        >{{subitem[props.filterCustom?.label]}}</el-checkbox>
                    </el-checkbox-group>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'checkboxButton'">
                    <el-checkbox-group v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event as any, !!option.data, option)">
                        <el-checkbox-button
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.value]"
                        >{{subitem[props.filterCustom?.label]}}</el-checkbox-button>
                    </el-checkbox-group>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'checkboxSearch'">
                    <CheckboxSearch :toolList="props.filterData()" :filterCustom="props.filterCustom" v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event as any, !!option.data, option)"/>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'time'">
                    <el-time-picker v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event, !!option.data, option)"/>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'intervalTime'">
                    <IntervalTime v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event, !!option.data, option)"/>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'date'">
                    <el-date-picker v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event, !!option.data, option)"/>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'intervalDate'">
                    <IntervalDate v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event, !!option.data, option)"/>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'select'">
                    <el-select v-model="option.data" :teleported="false" :="{...props.filterParam}" :multiple="false" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event, !!option.data, option)">
                        <el-option
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.label]"
                            :value="subitem[props.filterCustom?.value]"
                        />
                    </el-select>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'selectMultiple'">
                    <el-select v-model="option.data" :teleported="false" :="{...props.filterParam}" multiple v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event, !!option.data, option)">
                        <el-option
                            :key="i"
                            v-for="(subitem, i) in props.filterData()"
                            :label="subitem[props.filterCustom?.label]"
                            :value="subitem[props.filterCustom?.value]"
                        />
                    </el-select>
                </template>

                <template :="{...props.filterParam}" v-if="props.filterType === 'switch'">
                    <el-switch v-model="option.data" :="{...props.filterParam}" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event as any, !!option.data, option)"/>
                </template>
            </div>
        </template>
        <template
            :key="key"
            v-slot:[key]="item"
            v-for="(item, key) in slots"
        >
            <slot :name="key" v-bind="item"/>
        </template>
    </vxe-column>
</template>
  
<script setup name="XColumn" lang="ts">
import { ref, useAttrs, useSlots, defineProps, watch } from 'vue'
import IntervalDate from './IntervalDate.vue';
import IntervalTime from './IntervalTime.vue';
import IntervalNumber from './IntervalNumber.vue';
import CheckboxSearch from './checkboxSearch.vue';

interface filterElement {
    filterType?: string, // 类型，element-plus的表单类型，目前有：input/number/radio/radioButton/checkbox/checkboxButton/time/date/select/selectMultiple/switch/intervalNumber/intervalDate/intervalTime
    filterData?: any,
    filterParam?: any,
    filterCustom?: {
        label: string,
        value: string
    }
}

const attrs = useAttrs()
const slots = useSlots()
const props = withDefaults(defineProps<filterElement>(), {
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

const filterOption = ref([{data:undefined}])

defineExpose({  })
</script>
  
<style lang="scss" scoped>
.filter-box-search {
    padding: 2px 5px;
}

.tooltip-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
}
</style>
