<template>
  <div>
    <h1>表单页面</h1>
    <g-form
      ref="GFormRef"
      label-width="100px"
      :rules="state.rules"
      :formList="state.formList"
      @search="search">
      <template #tips="item">
        <el-input v-model="item.formData['tips']" @keyup.enter="childHandle($event)"></el-input>
      </template>
      <template #test="item">222-{{item.data}}{{item}}</template>
    </g-form>
  </div>
</template>

<script lang="ts" setup name="form-temp">
import { ref, reactive } from 'vue'
const GFormRef = ref()
const state = reactive({
  rules: {},
  formList: [{
    col: 10,
    type: 'input',
    prop: 'name',
    value: '张三',
    label: '姓名',
    isHide: (item: any) => Number(item.age) < 1,
    attrs: { type:'text', clearable: true, placeholder: '请输入姓名',
      'onkeyup': (event: any) => childHandle(event)
    }
  },{
    col: 10,
    type: 'number',
    prop: 'age',
    value: 18,
    label: '年龄',
    attrs: { min: 1, max: 20, size: 'small', placeholder: '请输入年龄' }
  },{
    col: 10,
    type: 'input',
    prop: 'desc',
    label: '描述',
    attrs: { type: 'textarea', placeholder: '请输入描述' }
  },{
    col: 10,
    type: 'radio',
    value: 1,
    prop: 'sex',
    label: '性别',
    data: [
      { label: '男', value: 1 },
      { label: '女', value: 0 }
    ]
  },{
    col: 10,
    type: 'checkbox',
    value: [1],
    prop: 'like',
    label: '爱好',
    data: [
      { label: '跑步', value: 1 },
      { label: '游泳', value: 0 }
    ]
  },{
    col: 10,
    type: 'select',
    value: 1,
    prop: 'school',
    label: '学校',
    attrs: { clearable: true, placeholder: '请选择学校', style: 'width:100%;' },
    data: [
      { label: '祁阳二中', value: 1 },
      { label: '祁阳一中', value: 0 }
    ]
  },{
    col: 10,
    type: 'select',
    value: [1],
    prop: 'grade',
    label: '曾经名次',
    attrs: { multiple: true, clearable: true, placeholder: '请选择曾经名次', style: 'width:100%;' },
    data: [
      { label: '第一', value: 1 },
      { label: '第二', value: 0 }
    ]
  },{
    col: 10,
    type: 'time',
    prop: 'startTime',
    label: '上学时间',
    attrs: { clearable: true, placeholder: '请选择上学时间', style: 'width:100%;',
      'onChange': () => GFormRef.value.searchHandle()
    }
  },{
    col: 10,
    type: 'date',
    prop: 'createTime',
    label: '入学日期',
    attrs: { clearable: true, placeholder: '请选择入学日期', style: 'width:100%;',
      'onChange': () => GFormRef.value.searchHandle()
    }
  },{
    col: 10,
    type: 'date',
    prop: 'createTimeBetween',
    label: '入学日期范围',
    attrs: { clearable: true, type: 'datetimerange', startPlaceholder: "开始时间", endPlaceholder: "结束时间" }
  },{
    col: 10,
    type: 'switch',
    prop: 'state',
    label: '状态',
    attrs: { activeValue: 1, inactiveValue: 0 }
  },{
    col: 10,
    type: 'upload',
    value: ['https://fa-file-test.s3.ap-southeast-1.amazonaws.com/uploadfile/About us备份@2x.png'],
    prop: 'imgList',
    label: '头像',
    attrs: { limit: 1 }
  },{
    col: 10,
    type: 'slot',
    value: '插槽测试11',
    prop: 'tips',
    label: '插槽'
  },{
    col: 10,
    type: 'btn',
    btn: {
      search: true,
      reset: true
    }
  },{
    col: 10,
    type: 'slot',
    value: '插槽6666666',
    prop: 'test'
  }]
})

const search = (item: any) => {
  console.log('表单组件:', item)
}

const childHandle = (event: any) => {
  if (event.keyCode==13) GFormRef.value.searchHandle()
}
</script>