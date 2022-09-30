<template>
  <el-select-v2
    remote
    clearable
    filterable
    value-key="id"
    v-model="state"
    :options="options"
    :loading="loading"
    style="width: 240px;"
    :remote-method="remoteMethod"
    placeholder="Please enter a keyword"
    @change="change"
  />
</template>

<script lang="ts" setup name="g-remote-select">
  import { getListAPI } from '@/api/other'
import { ref, getCurrentInstance, ComponentInternalInstance } from 'vue'

const { proxy } = getCurrentInstance() as ComponentInternalInstance as any

const state = ref()
const options = ref([])
const loading = ref(false)

const remoteMethod = (query: string) => {
  if (!query) options.value = []
  const data = {
    phoneNum: query,
    pageIndex: 1,
    pageSize: 10,
  }
  loading.value = true
  getListAPI(data).then((res: any) => {
    loading.value = false
    if (res.code === 200) {
      // cb(res.data.rows || [])
      options.value = res.data.rows || []
      options.value.forEach((v: any) => {
        v.label = v.phoneNum
        v.value = v.id
      })
    } else {
      proxy.$modal.message({ message: res.msg, type: 'error' })
    }
  }).catch((err: Error) => {
    loading.value = false
    proxy.$modal.message({ message: err.message, type: 'error' })
  })
}

const change = (item: any) => {
  console.log(item)
}
</script>