<template>
  <div class="g-upload">
    <van-uploader
      accept="*"
      :="attrs"
      v-model="imgs"
      :after-read="afterRead"
      :before-read="beforeRead"
      :preview-image="props.model == 'preview'"
      @click-preview="previewHandle"
      :style="`display: ${props.model == 'download' && attrs['max-count'] && Number((attrs as any)['max-count']) <= imgs.length ? 'none' : 'inline-block'};`">
      <template #default v-if="slots['default']"><slot></slot></template>
    </van-uploader>
    <div class="download-list" v-if="props.model == 'download'">
      <div class="download-item flex flex-between" v-for="(item, index) in imgs" :key="item.key">
        <div class="download-item-text unline-blue overflow-omit" @click="downloadFile(item.key)">{{ item.name }}</div>
        <van-icon name="cross" @click="delImg(index)"/>
      </div>
    </div>
    
    <FilePreview ref="filePreviewRef"></FilePreview>
  </div>
</template>

<script lang="ts" setup name="GUpload">
const { t } = useI18n()
// import {
//   ref,
//   watch,
//   useAttrs,
//   defineEmits,
//   defineProps,
//   withDefaults,
// } from 'vue'
// import { Toast, UploaderFileListItem } from 'vant'
// import { uploadImg } from '@/api'

const attrs = useAttrs()
const slots = useSlots()
const filePreviewRef = ref()
const emits = defineEmits(['update:modelValue', 'fileChange', 'delFile'])
const props = withDefaults(defineProps<{
  model?: string
  isWhite?: boolean,
  fileSize?: number,
  fileType?: string[],
  modelValue: any[]
}>(), {
  model: 'preview', // preview:预览  download:下载
  isWhite: false,
  fileSize: 1000,
  modelValue: () => [],
  // fileType: () => ['png', 'jpg', 'gif', 'jpeg']
})

// const imgs = ref<any[]>([])
const imgs = computed({
  get () {
    return props.modelValue || []
  },
  set (val: any) {
    emits('update:modelValue', val)
  }
})

// 上传图片前
const beforeRead: any = (file: File|any) => {
  if (!file.length) {
    file = [file]
  }
  try {
    for (let i = 0; i < file.length; i++) {
      if (props.fileType) {
        const imgType = file[i].name.slice(file[i].name.lastIndexOf(".") + 1)
        const isImg = props.fileType.length ? props.fileType.includes(imgType.toLocaleLowerCase()) : true
        if (!isImg && props.fileType.length) {
          showToast(t('fileFormatIsIncorrect', { type: props.fileType.join("/") }))
          return false;
        }
      }
      if (props.fileSize) {
        const isLt = file[i].size / 1024 / 1024 < props.fileSize;
        if (!isLt) {
          showToast(t('sizeOfTheUploaded', { size: props.fileSize }))
          return false;
        }
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
    // file[i].status = 'uploading'
    // let formData: any = new FormData()
    // formData.append('file', file[i].file)
    // formData.append('fileTo', null)
    // Toast.loading({message: '加载中...'})
    // uploadImg(formData).then((res: any) => {
    //   // console.log(res)
    //   file[i].url = res.data
    //   file[i].status = 'done'
    //   file[i].content = res.data
    //   // Toast.clear()
    // }).catch((err: any) => {
    //   // Toast.clear()
    //   file[i].status = 'failed'
    //   showToast(err.message);
    // })
    
    const fileName = file[i].file.name.replace(/,/g, '')
    // 获取上传地址以及参数
    // getUploadUrl(fileName)
    // `/resource/oss/getSignedUrl`
    $http(`/resource/oss/${props.isWhite ? 'getSignedUrlIgnore' : 'getSignedUrl'}`, {
        method: 'get',
        // loading: true,
        query: { fileName }
    }).then((res: any) => {
        const data = deepClone(res.data)

        // data.urlStr = undefined
        // data.file = file
        // actionData.value = data

        // file.key = data.key

        // resolve(true)
        
        // 参数添加到FormData数据中
        let formData = new FormData();
        const tempData = deepClone(data)
        delete tempData.urlStr
        tempData.file = file[i].file
        for (let key in tempData) {
            if (tempData[key] != undefined) {
                formData.append(key, tempData[key]);
            }
        }
        // uploadPost(actionUrl.value, formData)
        $http(data.urlStr, {
            method: 'post',
            isHttp: true,
            // loading: true,
            body: formData
        }).then(() => {
            // resFileList.value = fileList.value
            // emits('fileChange', dealData())
            // $loadingEnd()
            // showToast(t('fileUploadSuccessful'))
            file[i].url = file[i].objectUrl
            file[i].status = 'done'
            file[i].content = file[i].objectUrl
            file[i].key = data.key
            file[i].name = fileName
            file[i].size = file[i].file.size / 1024
            file[i].type = getExt(fileName).substring(1)
            emits('fileChange', imgs.value)
        }).catch(() => {
            file[i].status = 'failed'
            showToast(t('fileUploadFailed'))
        })
    }).catch((err: any) => {
        // loadingBox.close()
        // $loadingEnd()
        // reject(false)
    })
  }
}

// 预览
const previewHandle = (file: File|any) => {
  let localType = file.type;
  let localFile = file.url;
  let localName = file.name;
  if (isImage(getExt(file.name))) {
      localType = 'image'
      localFile = file.url as string
  } else if (getExt(file.name) == '.pdf') {
      localType = 'pdf'
      localFile = encodeURIComponent(file.url + '#' + file.name)
  } else {
      localType = matchFileType(getExt(file.name))
  }
  filePreviewRef.value.openViewer({
      url: localFile,
      name: localName,
      index: 0,
      type: localType,
      urlList: [localFile]
  })
}

// 删除文件
const delImg = (index: number) => {
  imgs.value.splice(index, 1)
  emits('delFile', imgs.value)
}
</script>

<style lang="scss" scoped>
.download-item-text {
  font-size: 12px;
}
</style>