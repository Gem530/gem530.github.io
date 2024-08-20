<template>
    <XTable ref="popFileRef" :data="props.data"  border :columnList="quotionFileList" :pageShow="false">
      <template #default-make="{row}">
        <el-button link type="primary" @click="preview(row)">预览</el-button>
        <el-button link type="primary" @click="downLoadHandle(row.key)">下载</el-button>
        <slot name="makeBtn" :row="row"></slot>
      </template>
    </XTable>
    <FileView ref="fileViewRef"></FileView>
</template>

<script setup name="FileTable" lang="ts">
import fileSaver from "file-saver";
import {downloadUrl} from '@/api/upload/index'
const props = withDefaults(defineProps<{
  data: any[],
  makeWidth?: string,
}>(), {
  data: () => [],
  makeWidth: '120',
})
const fileViewRef = ref()
const quotionFileList = ref([
  {title: "序号", type: 'seq', align: 'center', width: '60'},
  {title: '文件名', field: 'name', align: 'center',minWidth: '200'},
  {title: '文件大小(kb)', field: 'size', align: 'center',width: '80'},
  {title: '上传人', field: 'createByName', align: 'center',width: '70'},
  {title: '上传时间', field: 'createTime', align: 'center',width: '120'},
  {title: '操作', field: 'make', align: 'center',width: props.makeWidth},
])
// 文件下载
const downLoadHandle = (key: string) => {
    let loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
    downloadUrl(key).then(res => {
        loadingBox.close()
        if (res.code == 200) {
        const { data } = res
        // window.open(data[key])
        fileSaver.saveAs(data[key])
        }
    }).catch((err) => {
        loadingBox.close()
    })
}

const preview = (row) => {
    fileViewRef.value.preview(row)
}
</script>

<style lang="scss" scoped>
</style>
