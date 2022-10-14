<template>
  <el-form
    :="attrs"
    ref="formRef"
    :model="state.data"
    :rules="props.rules">
    <el-row>
      <template :key="item.key" v-for="item in props.formList">
        <el-col :span="hideHandle(item.isHide) ? (item.col || 24) : 0">

          <el-form-item :="{...item}" v-if="item.type === 'input' && hideHandle(item.isHide)">
            <el-input v-model="state.data[item.prop]" :="{...item.attrs}"></el-input>
          </el-form-item>

          <el-form-item :="{...item}" v-if="item.type === 'number' && hideHandle(item.isHide)">
            <el-input-number v-model="state.data[item.prop]" :="{...item.attrs}"/>
          </el-form-item>

          <el-form-item :="{...item}" v-if="item.type === 'radio' && hideHandle(item.isHide)">
            <el-radio-group v-model="state.data[item.prop]" :="{...item.attrs}">
              <el-radio
                :key="i"
                :label="subitem.value"
                v-for="(subitem, i) in item.data"
              >{{subitem.label}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item :="{...item}" v-if="item.type === 'checkbox' && hideHandle(item.isHide)">
            <el-checkbox-group v-model="state.data[item.prop]" :="{...item.attrs}">
              <el-checkbox
                :key="i"
                :label="subitem.value"
                v-for="(subitem, i) in item.data"
              >{{subitem.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item :="{...item}" v-if="item.type === 'time' && hideHandle(item.isHide)">
            <el-time-picker v-model="state.data[item.prop]" :="{...item.attrs}"/>
          </el-form-item>

          <el-form-item :="{...item}" v-if="item.type === 'date' && hideHandle(item.isHide)">
            <el-date-picker v-model="state.data[item.prop]" :="{...item.attrs}"/>
          </el-form-item>

          <el-form-item :="{...item}" v-if="item.type === 'select' && hideHandle(item.isHide)">
            <el-select v-model="state.data[item.prop]" :="{...item.attrs}">
              <el-option
                v-for="(subitem, i) in item.data"
                :key="i"
                :label="subitem.label"
                :value="subitem.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item :="{...item}" v-if="item.type === 'switch' && hideHandle(item.isHide)">
            <el-switch v-model="state.data[item.prop]" :="{...item.attrs}"/>
          </el-form-item>

          <el-form-item :="{...item}" v-if="item.type === 'upload' && hideHandle(item.isHide)">
            <g-img-upload v-model="state.data[item.prop]" :="{...item.attrs}"/>
          </el-form-item>

          <el-form-item :="{...item}" v-if="item.type === 'wangEditor' && hideHandle(item.isHide)">
            <g-wang-editor v-model="state.data[item.prop]" :="{...item.attrs}"/>
          </el-form-item>

          <el-form-item :="{...item}" v-if="item.type === 'cascader' && hideHandle(item.isHide)">
            <el-cascader v-model="state.data[item.prop]" :options="item.data" :="{...item.attrs}"/>
          </el-form-item>

          <!-- 使用插槽，value不能为undefind -->
          <el-form-item :="{...item}" v-if="item.type === 'slot' && hideHandle(item.isHide)">
            <slot :name="item.prop"  :="{data: state.data[item.prop], formData: state.data, item}">{{state.data[item.prop]}}</slot>
          </el-form-item>

          <!-- 使用插槽，value不能为undefind -->
          <slot :name="item.prop" v-if="item.type === 'form-slot' && hideHandle(item.isHide)" :="{data: state.data[item.prop], formData: state.data, item}">{{state.data[item.prop]}}</slot>

          <el-form-item :="{...item}" v-if="item.type === 'btn' && hideHandle(item.isHide)">
            <el-button v-if="item.btn?.search" type="primary" @click="searchHandle">{{item.btn?.searchName || '提交'}}</el-button>
            <el-button v-if="item.btn?.reset" @click="resetHandle">{{item.btn?.resetName || '重置'}}</el-button>
            <slot name="make-btn"></slot>
          </el-form-item>

        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup name="g-form">
import dayjs from 'dayjs'
import { cloneDeep } from '@/utils'
import { FormRules } from 'element-plus'
import {
  ref,
  nextTick,
  reactive,
  useAttrs,
  defineProps,
  defineEmits,
  defineExpose,
  withDefaults,
} from 'vue'

interface formItem {
  col?: number,
  type: string,
  prop: string,
  data?: any[],
  attrs?: any,
  value?: string,
  label?: string,
  isHide?: boolean|Function,
  btn?: {
    reset?: boolean,
    search?: boolean,
    resetName?: string,
    searchName?: string
  }
}

const formRef = ref()
const attrs = useAttrs()
const emits = defineEmits(['search'])
const props = withDefaults(defineProps<{
  rules?: FormRules,
  formList?: formItem[],
  timeFormat?: string,
  dateFormat?: string
}>(), {
  rules: undefined,
  formList: () => [],
  timeFormat: 'HH:mm:ss',
  dateFormat: 'YYYY-MM-DD HH:mm:ss'
})

const state: {
  data: Record<string, any>,
  temp: formItem[]
} = reactive({
  data: {},
  temp: []
})
state.temp = JSON.parse(JSON.stringify(props.formList))
state.temp.forEach((item: formItem) => {
  if (item.prop) {
    state.data[item.prop] = item.value ?? (item.type === 'slot' ? '' : undefined)
  }
})

// 是否隐藏
const hideHandle = (val: boolean|Function|undefined) => {
  if (typeof val === 'function') return !val(state.data)
  return !val
}

const clearValidte = () => {
  formRef.value.resetFields()
}

const initData = (item: any) => {
  state.data = item
}

const resetHandle = () => {
  clearValidte()
  searchHandle()
}

const searchHandle = () => {
  formRef.value.validate().then(() => {
    emits('search', formData())
  })
}

const formData = () => {
  // const newData = JSON.parse(JSON.stringify(state.data))
  const newData = cloneDeep(state.data)
  Object.keys(newData).forEach((item: any) => {
    const currentItem = props.formList.find((v: formItem) => v.prop === item)
    if (currentItem) {
      if (newData[item] == undefined || newData[item] == null) return
      switch (currentItem.type) {
        case 'date':
          if (['datetimerange', 'daterange'].includes(currentItem.attrs?.type)) {
            if (newData[item].length < 2) return
            newData['startDateRange'] = dayjs(newData[item][0]).format(props.dateFormat)
            newData['endDateRange'] = dayjs(newData[item][1]).format(props.dateFormat)
          } else if (['date', 'datetime'].includes(currentItem.attrs?.type) || !currentItem.attrs?.type) {
            newData[item] = dayjs(newData[item]).format(props.dateFormat)
          }
          break;
        case 'time':
          if (currentItem.attrs?.isRange) {
            if (newData[item].length < 2) return
            newData['startTimeRange'] = dayjs(newData[item][0]).format(props.timeFormat)
            newData['endTimeRange'] = dayjs(newData[item][1]).format(props.timeFormat)
          } else {
            newData[item] = dayjs(newData[item]).format(props.timeFormat)
          }
          break;
        case 'upload':
          newData[item] = newData[item].map((v: any) => v.response?.data ? v.response.data : v.url )
          break;
        default:
          break
      }
    }
  })
  return newData
}

defineExpose({ initData, clearValidte, resetHandle, searchHandle, hideHandle })
</script>

<style lang="scss" scoped>
.el-form-item {
  :deep(.el-date-editor--time),
  :deep(.el-date-editor--date),
  :deep(.el-date-editor--datetime) {
    .el-input__wrapper {
      width: 100% !important;
    }
  }
}
</style>