<template>
  <div>
    <h1>表单页面</h1>
    <g-form
      ref="GFormRef"
      label-width="100px"
      :rules="state.rules"
      :formList="state.formList"
      @search="search">
      <!-- 整体插槽 -->
      <template #formTest="item">
        <el-form-item :prop="item.item.prop">
          <template #label>
            <div class="flex">
              <g-icon icon="QuestionFilled"></g-icon>
              <span>{{item.item.label}}</span>
            </div>
          </template>
          <el-input v-model="item.formData[item.item.prop]" placeholder="请输入内容"></el-input>
        </el-form-item>
      </template>
      <!-- 内容插槽 不包括el-form-item -->
      <template #tips="item">
        <el-input v-model="item.formData[item.item.prop]" @keyup.enter="childHandle($event)"></el-input>
      </template>
      <template #test="item">222-{{item.data}}{{item}}</template>
      <template #channle="item">
        <g-remote-input
          clearable
          :req="req"
          value-key="phoneNum"
          style="width: 100%;"
          placeholder="请输入手机号"
          v-model="item.formData[item.item.prop]"
          @change="remoteInputChange"
        />
      </template>
      <template #channle2="item">
        <g-remote-select
          clearable
          :req="req"
          style="width: 100%;"
          placeholder="请输入手机号"
          v-model="item.formData[item.item.prop]"
          @change="remoteSelectChange"
        />
      </template>
      <template #make-btn>
        <el-button>测试按钮</el-button>
      </template>
    </g-form>
  </div>
</template>

<script lang="ts" setup name="form-temp">
import { ref, reactive } from 'vue'
import * as tsType from '@/api/type'
import { areaList } from '@/config/addres'
const GFormRef = ref()
const req: tsType.baseAPIType<any> = {
  url: '/v1/sms/page',
  method: 'get',
  params: {
    pageIndex: 1,
    pageSize: 10
  }
}
const state = reactive({
  rules: {},
  formList: [{
    col: 12,
    type: 'input',
    prop: 'name',
    value: '张三',
    label: '姓名',
    isHide: (item: any) => Number(item.age) < 1,
    attrs: { type:'text', clearable: true, placeholder: '请输入姓名',
      'onkeyup': (event: KeyboardEvent) => childHandle(event)
    }
  },{
    col: 12,
    type: 'number',
    prop: 'age',
    value: 18,
    label: '年龄',
    attrs: { min: 1, max: 20, size: 'small', placeholder: '请输入年龄' }
  },{
    col: 12,
    type: 'input',
    prop: 'desc',
    label: '描述',
    attrs: { type: 'textarea', placeholder: '请输入描述' }
  },{
    col: 12,
    type: 'radio',
    value: 1,
    prop: 'sex',
    label: '性别',
    custom: {
      label: 'name',
      value: 'id'
    },
    data: [
      { name: '男', id: 1 },
      { name: '女', id: 0 }
    ]
  },{
    col: 12,
    type: 'checkbox',
    value: [1],
    prop: 'like',
    label: '爱好',
    custom: {
      label: 'link',
      value: 'linkId'
    },
    data: [
      { link: '跑步', linkId: 0 },
      { link: '篮球', linkId: 1 },
      { link: '足球', linkId: 2 },
      { link: '游泳', linkId: 3 }
    ]
  },{
    col: 12,
    type: 'select',
    value: 1,
    prop: 'school',
    label: '学校',
    attrs: { clearable: true, placeholder: '请选择学校', style: 'width:100%;' },
    custom: {
      label: 'link',
      value: 'linkId'
    },
    data: [
      { link: '祁阳二中', linkId: 1 },
      { link: '祁阳一中', linkId: 5 }
    ]
  },{
    col: 12,
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
    col: 12,
    type: 'time',
    prop: 'startTime',
    label: '上学时间',
    attrs: { clearable: true, placeholder: '请选择上学时间', format: 'HH:mm', style: 'width:100%;',
      'onChange': () => GFormRef.value.searchHandle()
    }
  },{
    col: 12,
    type: 'time',
    prop: 'startTimeBetwwen',
    label: '上学时间范围',
    attrs: { isRange: true, clearable: true, startPlaceholder: "开始时间", endPlaceholder: "结束时间", style: 'width:100%;',
      'onChange': () => GFormRef.value.searchHandle()
    }
  },{
    col: 12,
    type: 'date',
    prop: 'createTime',
    label: '入学日期',
    attrs: { clearable: true, placeholder: '请选择入学日期', format: 'YYYY-MM', style: 'width:100%;',
      'onChange': () => GFormRef.value.searchHandle()
    }
  },{
    col: 12,
    type: 'date',
    prop: 'createTimeBetween',
    label: '入学日期范围',
    attrs: { clearable: true, type: 'datetimerange', format: 'YYYY-MM-DD HH:mm', startPlaceholder: "开始时间", endPlaceholder: "结束时间" }
  },{
    col: 12,
    type: 'switch',
    prop: 'state',
    label: '状态',
    attrs: { activeValue: 1, inactiveValue: 0 }
  },{
    col: 12,
    type: 'form-slot',
    value: '1212',
    prop: 'formTest',
    label: '插槽'
  },{
    col: 12,
    type: 'slot',
    value: '插槽测试11',
    prop: 'tips',
    label: '内容插槽1'
  },{
    col: 12,
    type: 'cascader',
    value: [],
    prop: 'addres',
    label: '地址',
    attrs: { props: { value: 'code' }, style: 'width: 100%;' },
    data: areaList
  },{
    col: 12,
    type: 'btn',
    btn: {
      search: true,
      reset: true
    }
  },{
    col: 12,
    type: 'slot',
    value: '插槽6666666',
    prop: 'test'
  },{
    col: 12,
    type: 'upload',
    value: ['https://fa-file-test.s3.ap-southeast-1.amazonaws.com/uploadfile/About us备份@2x.png'],
    prop: 'imgList',
    label: '头像',
    attrs: { limit: 2 }
  },{
    col: 12,
    type: 'wangEditor',
    prop: 'content',
    label: '内容插槽2',
    attrs: { height: 350 }
  },{
    col: 12,
    type: 'slot',
    value: '',
    prop: 'channle',
    label: '手机号1'
  },{
    col: 12,
    type: 'slot',
    value: '',
    prop: 'channle2',
    label: '手机号2'
  }]
})

const search = (item: any) => {
  console.log('表单组件:', item)
}

const childHandle = (event: KeyboardEvent) => {
  if (event.keyCode == 13) GFormRef.value.searchHandle()
}

const remoteInputChange = (item: any) => {
  console.log('remoteInputChange', item)
}

const remoteSelectChange = (item: any) => {
  console.log('remoteSelectChange', item)
}
</script>

<style lang="scss" scoped>
.flex {
  @include flex();
}
</style>