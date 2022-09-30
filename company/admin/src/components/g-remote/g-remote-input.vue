<template>
  <el-autocomplete
    v-model="state"
    value-key="phoneNum"
    placeholder="Please input"
    :fetch-suggestions="querySearchAsync"
    @select="handleSelect"
  />
</template>

<script lang="ts" setup name="g-remote-input">
  import { getListAPI } from '@/api/other'
import { ref, getCurrentInstance, ComponentInternalInstance } from 'vue'

const { proxy } = getCurrentInstance() as ComponentInternalInstance as any
const state = ref('')
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  const data = {
    phoneNum: queryString,
    pageIndex: 1,
    pageSize: 10,
  }
  getListAPI(data).then((res: any) => {
    if (res.code === 200) {
      cb(res.data.rows || [])
    } else {
      proxy.$modal.message({ message: res.msg, type: 'error' })
    }
  }).catch((err: Error) => {
    proxy.$modal.message({ message: err.message, type: 'error' })
  })
}

const handleSelect = (item: any) => {
  console.log(item)
}
</script>