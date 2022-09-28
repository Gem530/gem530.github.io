<template>
  <div class="g-upload">
    <el-upload
      :data="data"
      v-bind="attrs"
      :headers="headers"
      :action="props.action"
      list-type="picture-card"
      v-model:file-list="fileList"
      @remove="handleRemove"
      @change="handleChange"
      @preview="handlePictureCardPreview"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
    <el-image-viewer
      v-if="imgView.showView"
      :initial-index="imgView.index"
      :url-list="fileList.map(v => v.url)"
      @close="closeViewer"
      @switch="changeViewer"
    ></el-image-viewer>
  </div>
</template>

<script lang="ts" setup name="g-upload">
import { getItem } from '@/utils/storage'
import { UploadFile, ElMessage } from 'element-plus'
import { ref, useAttrs, reactive, defineProps, withDefaults } from 'vue'
interface data {
  fileTo: string
}

const attrs = useAttrs()
const props = withDefaults(defineProps<{
  data?: data,
  action?: string
}>(), {
  data: () => ({ fileTo: '' }),
  action: "http://54.151.135.104:9001/upload/img"
})

const headers = ref({ Authorization: getItem('token') })
const imgView = reactive({
  index: 5,
  showView: false
})
const fileList = ref<Partial<UploadFile>[]>([])
fileList.value = [{
  uid: 1,
  url: 'https://fa-file-test.s3.ap-southeast-1.amazonaws.com/uploadfile/About us备份@2x.png'
}, {
  uid: 2,
  url: 'https://fa-file-test.s3.ap-southeast-1.amazonaws.com/uploadfile/Analysis备份@2x.png'
}, {
  uid: 3,
  url: 'https://fa-file-test.s3.ap-southeast-1.amazonaws.com/uploadfile/Bill备份@2x.png'
}]

const handlePictureCardPreview = (file: UploadFile) => {
  const i = fileList.value.findIndex((v: Partial<UploadFile>) => { return v.uid === file.uid })
  // console.log('预览', file, i)
  imgView.index = i
  imgView.showView = true
}
const handleChange = (file: any, i: any) => {
  console.log('change', file, i)
  // if (file.file.status === 'done') {
  //   if (file.file.response.success) {
  //     ElMessage.success(`${file.file.name} 上传成功`)
  //   } else {
  //     ElMessage.error(`${file.file.response.message}`)
  //   }
  // } else if (file.file.status === 'error') {
  //   ElMessage.error(`${file.file.name} 上传失败`)
  // }
}
const handleRemove = () => {
  console.log('删除')
}

// 图片预览方法
const closeViewer = () => {
  imgView.showView = false
}
const changeViewer = (i: number) => {
  console.log(i)
}
</script>

<style lang="scss" scoped>
// .g-upload {}
</style>