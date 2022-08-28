<template>
    <el-form v-bind="attrs" :model="state.data" :rules="rules" ref="formRef">
        <el-row>
            <template
                :key="i"
                v-for="(item, i) in props.formList">
                <el-col :span="attrs.col">
                    <el-form-item v-if="item.type === 'input' && hideHandle(item.isHide)" v-bind="{...item.formAttrs}">
                        <el-input v-model="state.data[item.formAttrs.prop]" v-bind="{...item.attrs}" />
                    </el-form-item>
                    <el-form-item v-if="item.type === 'cascader' && hideHandle(item.isHide)" v-bind="{...item.formAttrs}">
                        <el-cascader :options="item.data" v-model="state.data[item.formAttrs.prop]"  v-bind="{...item.attrs}"/>
                    </el-form-item>
                    <el-form-item v-if="item.type === 'checkbox' && hideHandle(item.isHide)" v-bind="{...item.formAttrs}">
                        <el-checkbox-group v-model="state.data[item.formAttrs.prop]" v-bind="{...item.attrs}">
                            <el-checkbox
                                :key="i"
                                :label="subitem.value"
                                v-for="(subitem, i) in item.data"
                            >{{subitem.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item v-if="item.type === 'date' && hideHandle(item.isHide)" v-bind="{...item.formAttrs}">
                        <el-date-picker
                            v-model="state.data[item.formAttrs.prop]"
                            v-bind="{...item.attrs}"
                        />
                    </el-form-item>
                    <el-form-item v-if="item.type === 'number' && hideHandle(item.isHide)" v-bind="{...item.formAttrs}">
                        <el-input-number v-model="state.data[item.formAttrs.prop]" v-bind="{...item.attrs}"/>
                    </el-form-item>
                    <el-form-item v-if="item.type === 'radio' && hideHandle(item.isHide)" v-bind="{...item.formAttrs}">
                        <el-radio-group v-model="state.data[item.formAttrs.prop]" v-bind="{...item.attrs}">
                            <el-radio
                                :key="i"
                                :label="subitem.value"
                                v-for="(subitem, i) in item.data"
                            >{{subitem.label}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="item.type === 'select' && hideHandle(item.isHide)" v-bind="{...item.formAttrs}">
                        <el-select v-model="state.data[item.formAttrs.prop]" v-bind="{...item.attrs}">
                            <el-option
                                v-for="(subitem, i) in item.data"
                                :key="i"
                                :label="subitem.label"
                                :value="subitem.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item  v-if="item.type === 'switch' && hideHandle(item.isHide)" v-bind="{...item.formAttrs}">
                        <el-switch v-model="state.data[item.formAttrs.prop]" v-bind="{...item.attrs}"/>
                    </el-form-item>
                    <el-form-item v-if="item.type === 'btn' && hideHandle(item.isHide)">
                        <el-button type="primary" @click="searchHandle">搜索</el-button>
                        <el-button @click="reset">重置</el-button>
                    </el-form-item>
                    <el-form-item v-if="item.type === 'slot' && hideHandle(item.isHide)" v-bind="{...item.formAttrs}">
                        <slot :name="item.formAttrs.prop"  v-bind="{...item.formAttrs,data: state.data[item.formAttrs.prop], formData: state.data}">{{state.data[item.formAttrs.prop]}}</slot>
                    </el-form-item>
                </el-col>
            </template>
        </el-row>
    </el-form>
</template>

<script lang="ts" setup name="g-form">
import { defineProps, defineEmits, reactive, defineExpose } from 'vue'
import {
    ref,
    useAttrs
} from 'vue'
const props = withDefaults(defineProps<{
    rules: Object,
    formList: Object
}>(), {
    rules: {},
    formList: {}
})

const formRef = ref();
const attrs = useAttrs();
const emits = defineEmits(['search'])

const state = reactive({
    data: {},
    temp: []
})
state.temp = JSON.parse(JSON.stringify(props.formList))
state.temp.forEach((item) => {
    if (item.formAttrs && item.formAttrs.prop) {
        state.data[item.formAttrs.prop] = item.defaultValue || null
    }
})

// 是否隐藏
const hideHandle = (val) => {
    console.log(val, !val)
    if (typeof val === 'function') return val(state.data)
    return !val
}

// 重置
const reset = () => {
    formRef.value.resetFields()
    searchHandle()
}
// 搜索
const searchHandle = () => {
    emits('search', state.data)
}

defineExpose({ searchHandle })
</script>

<style lang="scss" scoped>

</style>
