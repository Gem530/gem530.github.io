<template>
  <van-uploader
    :="attrs"
    v-model="imgs"
    :after-read="afterRead"
    :before-read="beforeRead"
  />
</template>

<script lang="ts" setup name="GUpload">
import {
  ref,
  watch,
  useAttrs,
  defineEmits,
  defineProps,
  withDefaults,
} from 'vue'
import { Toast, UploaderFileListItem } from 'vant'
import { uploadImg } from '@/api'

const attrs = useAttrs()
const emits = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<{
  fileSize?: number,
  fileType?: string[],
  modelValue: string[]
}>(), {
  fileSize: 2,
  modelValue: () => [],
  fileType: () => ['png', 'jpg', 'gif', 'jpeg']
})

const imgs = ref<UploaderFileListItem[]>([])
if (props.modelValue && props.modelValue.length) {
  props.modelValue.forEach((url: string) => {
    imgs.value.push({ url, status: 'done' })
  })
}

watch(() => imgs.value, (val: UploaderFileListItem[]) => {
  const list = val.filter((v: any) => v.url && v.status === 'done').map((v: any) => v.url)
  emits('update:modelValue', list)
}, { deep: true, immediate: true })

// 上传图片前
const beforeRead: any = (file: File|any) => {
  if (!file.length) {
    file = [file]
  }
  try {
    for (let i = 0; i < file.length; i++) {
      const imgType = file[i].name.slice(file[i].name.lastIndexOf(".") + 1)
      const isImg = props.fileType.includes(imgType)
      if (!isImg) {
        Toast(`文件格式不正确, 请上传${props.fileType.join("/")}图片格式文件!`)
        return false;
      }
      const isLt = file[i].size / 1024 / 1024 < props.fileSize;
      if (!isLt) {
        Toast(`图片大小不能超过 ${props.fileSize} M`)
        return false;
      }
    }
  } catch (err) {
    return false
  }
  return true;
};

// 上传图片
const afterRead: any = (file: File|any) => {
  if (!file.length) {
    file = [file]
  }
  for (let i = 0; i < file.length; i++) {
    file[i].status = 'uploading'
    let formData: any = new FormData()
    formData.append('file', file[i].file)
    formData.append('fileTo', null)
    // Toast.loading({message: '加载中...'})
    uploadImg(formData).then((res: any) => {
      // console.log(res)
      file[i].url = res.data
      file[i].status = 'done'
      file[i].content = res.data
      // Toast.clear()
    }).catch((err) => {
      // Toast.clear()
      file[i].status = 'failed'
      Toast(err.message);
    })
    // setTimeout(() => {
    //   file[i].content = 'www.baidu.com'
    //   file[i].url = 'www.baidu.com'
    //   file[i].status = 'done'
    //   console.log('after-settimeout', file[i])
    // }, 1000)
  }
}
</script>

<style lang="scss" scoped>

</style>