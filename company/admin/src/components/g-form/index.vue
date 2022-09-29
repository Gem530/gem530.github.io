<template>
  <el-form
    :="attrs"
    ref="formRef"
    :model="state.data"
    :rules="props.rules">
    <el-row>
      <template :key="item.key" v-for="item in props.formList">
        <el-col :span="item.col || 24">

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

          <el-form-item v-if="item.type === 'slot' && hideHandle(item.isHide)" :="{...item}">
            <slot :name="item.prop"  :="{data: state.data[item.prop], formData: state.data}">{{state.data[item.prop]}}</slot>
          </el-form-item>

          <el-form-item :label="item.label" :prop="item.prop" v-if="item.type === 'btn' && hideHandle(item.isHide)">
            <el-button v-if="item.btn.reset" @click="resetHandle">重置</el-button>
            <el-button v-if="item.btn.search" type="primary" @click="searchHandle">提交</el-button>
          </el-form-item>

        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup name="g-form">
import { FormRules } from 'element-plus'
import {
  ref,
  reactive,
  useAttrs,
  defineProps,
  defineEmits,
  defineExpose,
  withDefaults,
} from 'vue'

const formRef = ref()
const attrs = useAttrs()
const emits = defineEmits(['search'])
const props = withDefaults(defineProps<{
  rules?: FormRules,
  formList?: any[]
}>(), {
  rules: undefined,
  formList: () => []
})

const state: any = reactive({
    data: {},
    temp: []
})
state.temp = JSON.parse(JSON.stringify(props.formList))
state.temp.forEach((item: any) => {
    if (item.prop) {
        state.data[item.prop] = item.value || undefined
    }
})

// 是否隐藏
const hideHandle = (val: boolean|object) => {
  if (typeof val === 'function') return !val(state.data)
  return !val
}

const resetHandle = () => {
  formRef.value.resetFields()
  searchHandle()
}

const searchHandle = () => {
  formRef.value.validate().then(() => {
    emits('search', state.data)
  })
}

defineExpose({ searchHandle })
</script>

<style lang="scss" scoped>
.el-form-item {
  :deep(.el-date-editor--time),
  :deep(.el-date-editor--date) {
    .el-input__wrapper {
      width: 100% !important;
    }
  }
}
</style>