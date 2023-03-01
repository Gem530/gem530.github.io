<template>
  <div>
    <h2>远程表单</h2>
    <g-remote-input
      clearable
      :req="req"
      value-key="phoneNum"
      v-model="remoteInput"
      placeholder="请输入手机号"
      @change="remoteInputChange"
    />
    <h2>远程下拉框</h2>
    <g-remote-select
      clearable
      :req="req"
      v-model="remoteSelect"
      placeholder="请输入手机号"
      @change="remoteSelectChange"
    />
    <h2>远程级联</h2>
    <g-remote-cascader/>
  </div>
</template>

<script lang="ts" setup name="remote">
import { ref, watch } from 'vue'
import * as tsType from '@/api/type'
const remoteInput = ref('')
const remoteSelect = ref('')
const req: tsType.baseAPIType<any> = {
  url: '/v1/sms/page',
  method: 'get',
  params: {
    pageIndex: 1,
    pageSize: 10
  }
}

watch(() => [remoteInput.value, remoteSelect.value], (val) => {
  console.log(val)
})

const remoteInputChange = (item: any) => {
  console.log('remoteInputChange', item)
}

const remoteSelectChange = (item: any) => {
  console.log('remoteSelectChange', item)
}
</script>