<template>
  <div>
    <NavBar left-arrow>
      <template #right>121</template>
    </NavBar>
    <GForm :formList="formList" @submit="submit"></GForm>
  </div>
</template>

<script lang="ts" setup name="Detail">
import { ref } from 'vue'

const formList = ref([
  {
    value: '12',
    type: 'input',
    label: '用户名',
    prop: 'username',
    name: 'username',
    placeholder: '请填写用户名',
    rules: [{ required: true, message: '请填写用户名' }]
  },
  {
    value: '',
    type: 'input',
    label: '地址',
    prop: 'address',
    name: 'address',
    placeholder: '请填写地址',
    rules: [{ required: true, message: '请填写地址' }]
  }
])

const submit = (item: any) => {
  console.log('submit', item)
}
</script>

<style lang="scss" scoped>

</style>