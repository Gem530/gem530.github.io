<template>
  <div>
    <NavBar left-arrow>
      <template #right>121</template>
    </NavBar>
    <GForm
      ref="GFormRef"
      input-align="right"
      :formList="formList"
      error-message-align="right"
      @submit="submit"
    ></GForm>
    <button @click="onSubmit">提交</button>
  </div>
</template>

<script lang="ts" setup name="Detail">
import { ref } from 'vue'

const GFormRef= ref()
const formList = ref([
  {
    values: '12',
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
    values: '深圳',
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
    values: ['https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg'],
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
    rules: [{ required: true, message: '不能为空' }],
    attrs: {
      title: '选项',
      columnsFieldNames: { text: 'name' },
    },
    // data: [ '湖南', '广东', '广西' ]
    data: [
      { name: '湖南', value: 1 },
      { name: '广东', value: 2 },
      { name: '广西', value: 3 },
    ]
  },
  {
    label: '时间',
    required: true,
    prop: 'createTime',
    name: 'createTime',
    type: 'timePicker',
    placeholder: '请选择时间',
    rules: [{ required: true, message: '不能为空' }],
    attrs: {
      type: 'date',
      title: '开始时间'
    },
  },
  {
    label: '日历',
    required: true,
    // values: new Date(),
    type: 'datePicker',
    prop: 'dateCalendar',
    name: 'dateCalendar',
    placeholder: '请选择日期',
    rules: [{ required: true, message: '不能为空' }],
    attrs: {
      title: '日期',
      // type: 'range'
      // type: 'multiple'
      showConfirm: false
    },
  },
  {
    required: true,
    prop: 'areaPicker',
    name: 'areaPicker',
    type: 'areaPicker',
    label: '地址picker',
    placeholder: '请选择地址', // 地址列表使用vant提供的地址
    rules: [{ required: true, message: '不能为空' }],
    attrs: {
      title: '地址picker',
      columnsPlaceholder: ['请选择', '请选择', '请选择']
    },
  },
  {
    label: '级联',
    required: true,
    type: 'cascader',
    prop: 'cascaders',
    name: 'cascaders',
    placeholder: '请选择',
    rules: [{ required: true, message: '不能为空' }],
    attrs: {
      title: '级联',
      fieldNames: {
        text: 'name',
        value: 'code',
        children: 'items'
      }
    },
    data: [
      {
        name: '浙江省',
        code: '330000',
        items: [{ name: '杭州市', code: '330100' }],
      },
      {
        name: '江苏省',
        code: '320000',
        items: [{ name: '南京市', code: '320100' }],
      },
    ]
  },
  {
    prop: 'target',
    name: 'target',
    type: 'select',
    required: true,
    label: '目的地',
    placeholder: '请选择',
    rules: [{ required: true, message: '不能为空' }],
    attrs: {
      title: '选项',
    },
    data: [
      { name: '湖南', value: 1 },
      { name: '广东', value: 2 },
      { name: '广西', value: 3 },
    ]
  },
  {
    type: 'submit',
    attrs: {
      text: 'submit'
    }
  },
  {
    type: 'reset'
  }
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

const onSubmit = () => {
  GFormRef.value.Submithandle()
}
</script>

<style lang="scss" scoped>

</style>