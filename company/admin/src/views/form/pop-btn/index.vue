<template>
  <div>
    <el-button @click="clickLoading('正在加载中...')" v-hasPermi="['home:rechargechannelamountstatistics']">加载</el-button>
    <el-button @click="clickNotif('通知111111')" v-if="proxy.$auth.hasPermi(['home:rechargechannelamountstatistics'])">通知</el-button>
    <el-button :key="item.type" v-for="item in notList" @click="clickNotif(item)">{{item.message}}</el-button>
    <el-button @click="clickMessage('消息111111')">消息</el-button>
    <el-button :key="item.type" v-for="item in msgList" @click="clickMessage(item)">{{item.message}}</el-button>
    <el-button @click="clickConfirm">确认弹框</el-button>
    <el-button @click="clickPrompt">提交弹框</el-button>
  </div>
</template>

<script lang="ts" setup name="upload">
import { ref, watch, getCurrentInstance, ComponentInternalInstance } from 'vue'

const { proxy } = getCurrentInstance() as ComponentInternalInstance as any

const msgList = ref([{
  message: 'success消息！',
  type: 'success'
},{
  message: 'warning消息！',
  type: 'warning'
},{
  message: 'error消息！',
  type: 'error'
},{
  message: 'info消息！',
  type: 'info'
}])

const notList = ref([{
  message: 'success通知！',
  type: 'success',
  title: 'success'
},{
  message: 'warning通知！',
  type: 'warning',
  title: 'warning'
},{
  message: 'error通知！',
  type: 'error',
  duration: 0,
  title: 'error'
},{
  message: 'info通知！',
  type: 'info',
  title: 'info'
}])

const clickLoading = (item: string) => {
  proxy.$modal.loading(item)
  setTimeout(() => {
    proxy.$modal.closeLoading()
  }, 1000)
}

const clickMessage = (item: any) => {
  proxy.$modal.message(item)
}

const clickNotif = (item: any) => {
  proxy.$modal.notif(item)
}

const clickConfirm = () => {
  proxy.$modal.confirm('你确定删除吗', '提示!!!', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    clickMessage({ message: '删除成功', type: 'success' })
  }).catch(() => {
    clickMessage('取消删除操作')
  })
}

const clickPrompt = () => {
  proxy.$modal.prompt('密码:', '提示!!!', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^(\d{2,5})$/,
    inputErrorMessage: '密码在 2 - 5 位数字',
  }).then(() => {
    clickMessage({ message: '修改成功', type: 'success' })
  }).catch(() => {
    clickMessage('取消修改操作')
  })
}
</script>

<style lang="scss" scoped>
.el-button {
  margin-bottom: 10px;
}
</style>