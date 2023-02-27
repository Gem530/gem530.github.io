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
                v-for="(subitem, i) in item.data"
                :label="subitem[item.custom?.value || 'value']"
              >{{subitem[item.custom?.label || 'label']}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item :="{...item}" v-if="item.type === 'checkbox' && hideHandle(item.isHide)">
            <el-checkbox-group v-model="state.data[item.prop]" :="{...item.attrs}">
              <el-checkbox
                :key="i"
                v-for="(subitem, i) in item.data"
                :label="subitem[item.custom?.value || 'value']"
              >{{subitem[item.custom?.label || 'label']}}</el-checkbox>
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
                :key="i"
                v-for="(subitem, i) in item.data"
                :label="subitem[item.custom?.label || 'label']"
                :value="subitem[item.custom?.value || 'value']"
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
            <slot :name="item.prop" :="{data: state.data[item.prop], formData: state.data, item}">
              <Body :="item"/>
            </slot>
          </el-form-item>

          <!-- 使用插槽，value不能为undefind -->
          <slot :name="item.prop" v-if="item.type === 'form-slot' && hideHandle(item.isHide)" :="{data: state.data[item.prop], formData: state.data, item}">
            <Body :="item"/>
          </slot>

          <el-form-item :="{...item}" v-if="item.type === 'btn' && hideHandle(item.isHide)">
            <el-button v-if="item.btn?.search" type="primary" @click="searchHandle">{{item.btn?.searchName || '提交'}}</el-button>
            <el-button v-if="item.btn?.reset" @click="resetHandle">{{item.btn?.resetName || '重置'}}</el-button>
            <!-- 只在开发环境展示 -->
            <el-button @click="autoHandle" v-if="isDev">自动填充表单</el-button>
            <slot name="make-btn"><Body/></slot>
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
import { createNumber, createChinese } from './autoValue'
import {
  h,
  ref,
  nextTick,
  reactive,
  useAttrs,
  useSlots,
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
  custom?: {
    label?: string,
    value?: string
  },
  btn?: {
    reset?: boolean,
    search?: boolean,
    resetName?: string,
    searchName?: string
  }
}

const formRef = ref()
const attrs: any = useAttrs()
const slots: any = useSlots()
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

const isDev = ref(process.env.NODE_ENV === 'development')

// const Body = (item: any) => {
//   console.log('item', item)
//   return h("div");
// };
const Body = (item: any) => {
  if (item.type != 'slot') return
  let slotTemp = slots[item.prop] ?? attrs.slots[item.prop]
  return h('div', {
    customSlot: () => [slotTemp()]
  })
}

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

const autoHandle = () => {
  // console.log('自动填充表单')
  // console.log(state.temp)
  // console.log(state.data)
  state.temp.forEach((item: any, index: number) => {
    const type = item.type
    switch (type) {
      case 'input':
        state.data[item.prop] = createChinese()
        break;
      case 'number':
        state.data[item.prop] = createNumber(item?.attrs?.max || 100)
        break;
      case 'radio':
      case 'select':
      case 'checkbox':
        if (item.data.length) {
          const resultData = item?.data[createNumber(item?.data.length)][item?.custom?.value || 'value']
          if (type === 'select') {
            state.data[item.prop] = item?.attrs?.multiple ? [resultData] : resultData
            return
          }
          state.data[item.prop] = type === 'checkbox' ? [resultData] : resultData
        }
        break;
      case 'date':
        const dateCurFormat = item?.attrs?.format || props.dateFormat
        if (['datetimerange', 'daterange'].includes(item?.attrs?.type)) {
          state.data[item.prop] = [dayjs().subtract(7, 'day').format(dateCurFormat), dayjs().format(dateCurFormat)]
        } else if (['date', 'datetime'].includes(item?.attrs?.type) || !item?.attrs?.type) {
          state.data[item.prop] = dayjs().format(dateCurFormat)
        }
        break;
      case 'time':
        // const timeCurFormat = item?.attrs?.format || props.timeFormat
        if (item?.attrs?.isRange) {
          state.data[item.prop] = [dayjs().subtract(30, 'minute').format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')]
        } else {
          state.data[item.prop] = dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
        break;
      default:
        break
    }
  })
}

const formData = () => {
  // const newData = JSON.parse(JSON.stringify(state.data))
  const newData = cloneDeep(state.data)
  Object.keys(newData).forEach((key: any) => {
    const currentItem = props.formList.find((v: formItem) => v.prop === key)
    if (currentItem) {
      if (newData[key] == undefined || newData[key] == null) return
      switch (currentItem.type) {
        case 'date':
          const dateCurFormat = currentItem?.attrs?.format || props.dateFormat
          if (['datetimerange', 'daterange'].includes(currentItem?.attrs?.type)) {
            if (newData[key].length < 2) return
            newData[key][0] = dayjs(newData[key][0]).format(dateCurFormat)
            newData[key][1] = dayjs(newData[key][1]).format(dateCurFormat)
          } else if (['date', 'datetime'].includes(currentItem?.attrs?.type) || !currentItem?.attrs?.type) {
            newData[key] = dayjs(newData[key]).format(dateCurFormat)
          }
          break;
        case 'time':
          const timeCurFormat = currentItem?.attrs?.format || props.timeFormat
          if (currentItem?.attrs?.isRange) {
            if (newData[key].length < 2) return
            newData[key][0] = dayjs(newData[key][0]).format(timeCurFormat)
            newData[key][1] = dayjs(newData[key][1]).format(timeCurFormat)
          } else {
            newData[key] = dayjs(newData[key]).format(timeCurFormat)
          }
          break;
        case 'upload':
          newData[key] = newData[key].map((v: any) => v.response?.data ? v.response.data : v.url )
          break;
        default:
          break
      }
    }
  })
  return newData
}

const searchHandle = () => {
  formRef.value.validate().then(() => {
    emits('search', formData())
  })
}

const resetHandle = () => {
  clearValidte()
  searchHandle()
}

defineExpose({ initData, clearValidte, resetHandle, searchHandle, hideHandle, autoHandle })
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