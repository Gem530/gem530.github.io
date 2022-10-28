<template>
  <div>
    <NavBar left-arrow>
      <template #right>121</template>
    </NavBar>
    <GForm
      input-align="right"
      :formList="formList"
      error-message-align="right"
      @submit="submit"
    ></GForm>
  </div>
</template>

<script lang="ts" setup name="Detail">
import { ref } from 'vue'

const formList = ref([
  {
    value: '12',
    type: 'input',
    label: '用户名',
    required: true,
    prop: 'username',
    name: 'username',
    placeholder: '请填写用户名',
    rules: [{ required: true, message: '请填写用户名' }]
  },
  {
    prop: 'age',
    name: 'age',
    label: '年龄',
    required: true,
    type: 'stepper',
    rules: [{ required: true, message: '不能为空' }],
  },
  {
    value: '深圳',
    type: 'input',
    label: '地址',
    required: true,
    prop: 'address',
    name: 'address',
    placeholder: '请填写地址',
    rules: [{ required: true, message: '请填写地址' }]
  },
  {
    type: 'switch',
    required: true,
    prop: 'isAdult',
    name: 'isAdult',
    label: '是否成年',
    rules: [{ required: true, message: '不能为空' }],
    attrs: {
      size: 20,
      activeValue: 1,
      inactiveValue: 0
    }
  },
  {
    prop: 'like',
    name: 'like',
    label: '爱好',
    required: true,
    type: 'checkbox',
    rules: [{ required: true, message: '不能为空' }],
    attrs: {
      direction: 'horizontal'
    },
    data: [
      { lable: '游泳', value: 1 },
      { lable: '跑步', value: 2 },
      { lable: '篮球', value: 3 },
    ]
  },
  {
    prop: 'sex',
    name: 'sex',
    type: 'radio',
    label: '性别',
    required: true,
    rules: [{ required: true, message: '不能为空' }],
    attrs: {
      direction: 'horizontal'
    },
    data: [
      { lable: '男', value: 1 },
      { lable: '女', value: 0 },
    ]
  },
  {
    type: 'rate',
    label: '评分',
    prop: 'rates',
    name: 'rates',
    required: true,
    rules: [{ validator: (val: any) => validatorMessage(val) }], // 不使用函数校验，undefined不会提示
  },
  {
    prop: 'slid',
    name: 'slid',
    label: '滑块',
    type: 'slider',
    required: true,
    rules: [{ validator: (val: any) => validatorMessage(val) }], // 不使用函数校验，undefined不会提示
  },
  {
    label: '头像',
    prop: 'avatar',
    name: 'avatar',
    type: 'upload',
    required: true,
    rules: [{ required: true, message: '不能为空' }],
    value: ['https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg'],
    attrs: {
      maxCount: 1
    }
  },
  {
    label: '选项',
    prop: 'option',
    name: 'option',
    type: 'picker',
    required: true,
    valueKey: 'value',
    placeholder: '请选择',
    columnsFieldNames: { text: 'name' },
    rules: [{ required: true, message: '不能为空' }],
    attrs: {
      title: '选项'
    },
    // data: [ '湖南', '广东', '广西' ]
    data: [
      { name: '湖南', value: 1 },
      { name: '广东', value: 2 },
      { name: '广西', value: 3 },
    ]
  },
])

// 函数校验
const validatorMessage = (val: number) => {
  if (!val) {
    return '不能为空!!'
  }
}

const submit = (item: any) => {
  console.log('submit', item)
}
</script>

<style lang="scss" scoped>

</style>