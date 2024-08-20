<template>
    <el-form-item>
        <template #label>
            <div class="flex-between max-width">
                <el-checkbox v-model="crtItem.isChecked" @change="paramChange('choose')" true-label="1" false-label="0"/>

                <span v-if="crtItem.type != 9">{{ crtItem.name }}</span>
            </div>
        </template>
        <el-row class="max-width">
            <el-col :span="17">
                <span v-if="crtItem.type == 9">{{ crtItem.name }}</span>
                <el-select class="max-width" v-if="crtItem.type == 8" v-model="crtItem.defaultValue" clearable
                    placeholder="请选择" @change="paramChange">
                    <el-option
                        v-for="item in crtItem.options"
                        :key="item"
                        :label="item"
                        :value="item"
                    />
                </el-select>
                <el-switch v-if="crtItem.type == 7" v-model="crtItem.defaultValue" @click="paramChange" :active-value="'1'" :inactive-value="'0'"></el-switch>
                <el-checkbox-group class="max-width" v-if="crtItem.type == 6" v-model="crtItem.defaultValue" @change="paramChange">
                    <el-checkbox
                        v-for="item in crtItem.options"
                        :key="item"
                        :label="item"
                    />
                </el-checkbox-group>
                <el-radio-group class="max-width" v-if="crtItem.type == 5" v-model="crtItem.defaultValue" @change="paramChange">
                    <el-radio 
                        v-for="item in crtItem.options"
                        :key="item"
                        :label="item">
                    </el-radio>
                </el-radio-group>
                <el-input v-if="crtItem.type == 4" type="text" v-model="crtItem.defaultValue" @change="paramChange"
                    clearable placeholder="请输入"
                ></el-input>
                <el-date-picker
                    clearable
                    type="date"
                    placeholder="请选择"
                    style="width: 100%;"
                    @change="paramChange"
                    value-format="YYYY-MM-DD"
                    v-model="crtItem.defaultValue"
                    v-if="crtItem.type == 3"
                />
                <el-input v-if="crtItem.type == 2" type="textarea" v-model="crtItem.defaultValue"  @change="paramChange"
                    clearable placeholder="请输入"
                ></el-input>
                <el-input-number class="max-width" @change="paramChange" v-if="crtItem.type == 1" v-model="crtItem.defaultValue"></el-input-number>
            </el-col>
            <el-col :span="3" class="left">{{ crtItem.unit }}</el-col>
            <el-col :span="4" class="center"><el-checkbox v-model="crtItem.isBold" @change="paramChange" label="加粗" true-label="1" false-label="0"/></el-col>
        </el-row>
    </el-form-item>
</template>

<script setup lang="ts" name="ParameterItem">
import { deepClone } from '@/utils'
// type  9:UnDefine 8:Select 7:Switch 6:CheckBox 5:RadioButton 4:TextBox 3:DateTime 2:Textarea 1:Number
const emits = defineEmits(['paramChange'])
const props = withDefaults(defineProps<{
    title?: string
    currentItem: any
}>(), {
    title: undefined,
    currentItem: () => {}
})

const crtItem = ref(props.currentItem)
if (crtItem.value.type == 6) {
    crtItem.value.defaultValue = (crtItem.value.defaultValue.indexOf(',') !== -1) ? crtItem.value.defaultValue.split(',') : crtItem.value.defaultValue ? [crtItem.value.defaultValue] : []
} else if (crtItem.value.type == 7) {
    let res = crtItem.value.defaultValue
    switch (crtItem.value.defaultValue) {
        case '关':
            res = '0';
            break;
        case '开':
            res = '1';
            break;
    }
    crtItem.value.defaultValue = res
}

const paramChange = (type: any) => {
    if (crtItem.value.type != 9) {
        if (type == 'choose') {
            if (crtItem.value.type != 7) {
                crtItem.value.defaultValue = crtItem.value.isChecked == '1' ? crtItem.value.defaultValue : (crtItem.value.type == 6 ? [] : '')
            }
        } else {
            if (crtItem.value.type == 6) {
                crtItem.value.isChecked = crtItem.value.defaultValue && crtItem.value.defaultValue.length ? '1' : '0'
            } else {
                crtItem.value.isChecked = crtItem.value.defaultValue ? '1' : '0'
            }
        }
    }
    const params = deepClone(crtItem.value)
    if (params.type == 6) {
        params.defaultValue = params.defaultValue && params.defaultValue.length ? params.defaultValue.join(',') : ''
    }
    emits('paramChange', params, type)
}
</script>

<style lang="scss" scoped>
.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.max-width {
    width: 100%;
}
.left {
    padding-left: 10px;
    text-align: left;
    // box-sizing: border-box;
}
.center {
    text-align: center;
}
</style>