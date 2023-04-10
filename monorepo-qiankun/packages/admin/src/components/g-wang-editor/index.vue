<template>
  <div style="border: 1px solid #000;">
    <Toolbar
      :mode="mode"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
    />
    <Editor
      :mode="mode"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :style="{ height: props.height + 'px', 'overflow-y': 'hidden' }"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script lang="ts" setup name="wang-editor">
import { uploadAPI } from '@/api/base'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {
  computed,
  shallowRef,
  defineProps,
  defineEmits,
  withDefaults,
  onBeforeUnmount,
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue'

interface ItemMenu {
  [key: string]: any
}

const { proxy } = getCurrentInstance() as ComponentInternalInstance as any
const emits = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<{
  height?: number,
  fileSize?: number,
  fileType?: string[],
  modelValue: string
}>(), {
  height: 300,
  fileSize: 10,
  fileType: () => ['png', 'jpg', 'gif', 'jpeg'],
  modelValue: ''
})

const mode = 'default'
const toolbarConfig = {
  excludeKeys:["uploadVideo"]
}
const editorRef = shallowRef()

const editorConfig: ItemMenu = {
  placeholder: '请输入内容...',
  MENU_CONF: {}
}
const valueHtml = computed({
  get() {
    return props.modelValue
  },
  set(value: string) {
    //子组件传值给父组件
    emits('update:modelValue', value)
  }
})

// // 必填，否则上传图片会报错。 直接上传图片
// editorConfig.MENU_CONF['uploadImage'] = {
//   fieldName: 'file',
//   meta: {
//     fileTo: ''
//   },
//   server: '/api/upload/img',
//   // 自定义增加 http  header
//   headers: {
//     Authorization: getItem('token')
//   },
//   // 自定义插入图片
//   customInsert(res: any, insertFn: any) {
//     console.log('customInsert', res)
//     // const isLt = res.size / 1024 / 1024 < 5;
//     // if (!isLt) {
//     //   proxy.$modal.msgError(`上传图片大小不能超过 5 MB!`);
//     //   return false;
//     // }
//     // res 即服务端的返回结果
//     if (res.code == 200) {
//       // 从 res 中找到 url alt href ，然后插图图片
//       insertFn(
//         res.data,
//         res.name||'图片',
//         res.data
//       )
//     }
//   }
// }

const upload = (file: File) => {
  return new Promise((resolve, reject) => {
    const imgType = file.name.slice(file.name.lastIndexOf(".") + 1)
    const isImg = props.fileType.includes(imgType)
    if (!isImg) {
      proxy.$modal.message({ type: 'error', message: `文件格式不正确, 请上传${props.fileType.join("/")}图片格式文件!` })
      return false;
    }
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      proxy.$modal.message({ type: 'error', message: `上传图片大小不能超过 ${props.fileSize} MB!` })
      return false;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileTo", "");
    proxy.$modal.loading()
    uploadAPI(formData).then((res: any) => {
      proxy.$modal.closeLoading()
      proxy.$modal.message({ type: 'success', message: '上传成功' })
      resolve(res)
    }).catch((err: Error) => {
      proxy.$modal.closeLoading()
      proxy.$modal.message({ type: 'error', message: '上传失败' })
      reject(err)
    })
  })
}

// 必填，否则上传图片会报错。 类似于el-upload的http-request，自定义上传方法
editorConfig.MENU_CONF['uploadImage'] = {
  // 上传图片文件
  customUpload(file: File, insertFn: any) {
    // console.log(file)
    upload(file).then((res: any) => {
      insertFn(res.data, res.name||'图片', res.data)
    })
  }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const { value } = editorRef
  if (value === null) return
  value.destroy()
})

const handleCreated = (editor: any) => {
  // console.log('handleCreated')
  editorRef.value = editor
}
</script>