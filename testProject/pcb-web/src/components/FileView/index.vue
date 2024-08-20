<template>
  <!-- element-plus 文件预览组件 -->
  <el-image-viewer
    v-if="imgView.showView"
    :initial-index="imgView.index"
    :url-list="(fileList.map(v => v.url) as string[])"
    @close="closeViewer"
  ></el-image-viewer>

  <!-- 查看文件 -->
  <!-- <Teleport to=".app-main"> -->
  <el-dialog top="40px" width="882px" :title="localName" v-model="diaVisable" append-to-body>
    <div class="max-upload-img-width">
      <img v-if="localType == 'image'" :src="localFile" alt="" class="max-upload-img-width" />
      <template v-else-if="localType == 'pdf'">
        <iframe :src="'/web/viewer.html?file=' + localFile" style="width: 100%; height: 650px"></iframe>
      </template>
      <div v-else>{{localType}} 文件暂不支持预览</div>
    </div>
    <!-- <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="diaVisable = false">确定</el-button>
                <el-button @click="diaVisable = false">取消</el-button>
            </span>
            </template> -->
  </el-dialog>
  <!-- </Teleport> -->
</template>

<script setup name="FileView" lang="ts">
import {downloadUrl} from '@/api/upload/index'
const props = withDefaults(defineProps<{
  data: any[],
  makeWidth?: string,
}>(), {
  data: () => [],
  makeWidth: '120',
})
const localName = ref('')
const localType = ref('')
const localFile = ref('')
const diaVisable = ref(false)
const imgView = reactive({
    index: 5,
    showView: false
})

// 判断是否为图片
const isImage = (ext: string) => {
 return ['.png', '.jpg', '.jpeg', '.bmp', '.gif', '.webp', '.psd', '.svg', '.tiff'].indexOf(ext.toLowerCase()) !== -1;
}

// 获取后缀名
const getExt = (url: string, str: string = '.') => {
    //获取最后一个.的位置
    const index= url.lastIndexOf(str);
    //获取后缀
    const ext = url.substring(index);
    return ext
}

// 返回文件格式或后缀名
const matchFileType = (ext: string) => {
    let result = ext.substring(1)
    if (['doc','docx'].includes(ext)) {
        result = 'Word'
    }
    if (['xls','xlsx'].includes(ext)) {
        result = 'Excel'
    }
    if (['ppt','pptx'].includes(ext)) {
        result = 'PPT'
    }
    return result
}

// 文件预览方法
const preview = (file: uploadKey) => {
    // 图片模式，预览
    localName.value = file.name
    if (isImage(getExt(file.name).toLocaleLowerCase())) {
        localType.value = 'image'
        localFile.value = file.url as string
    } else if (getExt(file.name).toLocaleLowerCase() == '.pdf') {
        localType.value = 'pdf'
        let url = file.url
        if (url?.indexOf('https') == -1) {
            url = url.replace('http:', 'https:')
        }
        // let url = file.url?.replace(//g,'')
        localFile.value = encodeURIComponent(url + '#' + file.name)
    } else {
        if (file.name.includes('.')) {
            localType.value = matchFileType(getExt(file.name).toLocaleLowerCase())
        } else {
            localType.value = 'image'
            localFile.value = file.url as string
        }
    }
    diaVisable.value = true
}
const closeViewer = () => {
    imgView.showView = false
}
defineExpose({ preview })
</script>

<style lang="scss" scoped>
.max-upload-img-width {
    width: 100%;
    text-align: center;
}
</style>
