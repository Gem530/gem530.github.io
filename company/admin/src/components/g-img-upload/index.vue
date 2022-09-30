<template>
  <div class="g-upload">
    <el-upload
      :="attrs"
      :data="props.data"
      :headers="headers"
      :action="props.action"
      list-type="picture-card"
      v-model:file-list="fileList"
      :before-upload="beforeUpload"
      :class="{
        'hide-delete': props.isHideDelete,
        'hide-preview': props.isHidePreview,
        'hide': fileList.length >= attrs?.limit
      }"
      @error="handleError"
      @success="handleSuccess"
      @preview="handlePictureCardPreview"
    >
      <el-icon><Plus /></el-icon>
      <template #tip v-if="!props.isHideTip && fileList.length < attrs?.limit">
        <slot name="tip">
          <div class="el-upload__tip">图片不能超过 {{props.fileSize}}MB</div>
        </slot>
      </template>
    </el-upload>
    <!-- element-plus 图片预览组件 -->
    <el-image-viewer
      v-if="imgView.showView"
      :initial-index="imgView.index"
      :url-list="fileList.map(v => v.url)"
      @close="closeViewer"
    ></el-image-viewer>
  </div>
</template>

<script lang="ts" setup name="g-upload">
import { getItem } from '@/utils/storage'
import { UploadFile, ElMessage, UploadRawFile } from 'element-plus'
import {
  ref,
  watch,
  useAttrs,
  reactive,
  defineEmits,
  defineProps,
  withDefaults,
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue'
interface data {
  fileTo: string
}
interface response {
  msg: string,
  code: number
}
interface attrsType {
  limit: number
}
type UploadFiles = Partial<UploadFile>[]
interface upload extends UploadFile {
  response: response
}

const emits = defineEmits(['update:modelValue'])
const attrs = useAttrs() as unknown as attrsType
const props = withDefaults(defineProps<{
  data?: data,
  action?: string,
  fileSize?: number,
  fileType?: string[],
  isHideTip?: boolean,
  modelValue?: string[],
  isHideDelete?: boolean,
  isHidePreview?: boolean,
}>(), {
  data: () => ({ fileTo: '' }),
  action: import.meta.env.VITE_APP_BASE_URL + "/upload/img",
  fileSize: 5,
  fileType: () => ['png', 'jpg', 'gif', 'jpeg'],
  isHideTip: false,
  modelValue: () => [],
  isHideDelete: false,
  isHidePreview: false,
})

const fileList = ref<UploadFiles>([])
const { proxy } = getCurrentInstance() as ComponentInternalInstance as any
const headers = ref({ Authorization: getItem('token') })
const imgView = reactive({
  index: 5,
  showView: false
})

if (props.modelValue && props.modelValue.length > 0) {
  props.modelValue.forEach((url: string, uid: number) => {
    const item = { uid, url }
    fileList.value.push(item)
  })
}

watch(() => fileList.value, (newVal: UploadFiles) => {
  emits('update:modelValue', newVal)
}, { deep: true, immediate: true })

// 上传前
const beforeUpload = (file: UploadRawFile) => {
  const imgType = file.name.slice(file.name.lastIndexOf(".") + 1)
  const isImg = props.fileType.includes(imgType)
  if (!isImg) {
    ElMessage.error(`文件格式不正确, 请上传${props.fileType.join("/")}图片格式文件!`)
    return false;
  }
  const isLt = file.size / 1024 / 1024 < props.fileSize;
  if (!isLt) {
    ElMessage.error(`上传图片大小不能超过 ${props.fileSize} MB!`)
    return false;
  }
  proxy.$modal.loading('图片上传中...')
}

// 上传失败
const handleError = () => {
  proxy.$modal.closeLoading()
  ElMessage.error(`图片上传失败`)
}
// 上传成功
const handleSuccess = () => {
  proxy.$modal.closeLoading()
  ElMessage.success(`图片上传成功`)
}

// 图片预览方法
const handlePictureCardPreview = (file: UploadFile) => {
  const i = fileList.value.findIndex((v: Partial<UploadFile>) => { return v.uid === file.uid })
  imgView.index = i <= 0 ? 0 : i
  imgView.showView = true
}
const closeViewer = () => {
  imgView.showView = false
}
</script>

<style lang="scss" scoped>
// .el-upload--picture-card 控制加号部分
:deep(.hide .el-upload--picture-card),
:deep(.hide-preview .el-upload-list__item-preview),
:deep(.hide-delete .el-upload-list__item-delete) {
  display: none !important;
}
:deep(.hide-preview .el-upload-list__item-delete) {
  margin-left: 0 !important;
}
:deep(.hide-delete.hide-preview) {
  .el-upload-list__item-status-label {
    display: inline-flex !important;
    opacity: 1 !important;
  }
  .el-upload-list__item-actions,
  .el-icon--close-tip {
    display: none !important;
  }
}
</style>