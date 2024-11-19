<template>
    <!-- element-plus 文件预览组件 -->
    <el-image-viewer v-if="state.imgShow" :initial-index="state.imgIndex" :url-list="state.fileInfo.urlList"
        @close="closeViewer"></el-image-viewer>

    <!-- 查看文件 -->
    <!-- <Teleport to=".app-main"> -->
    <el-dialog
        top="40px"
        width="882px"
        @close="closeHandle"
        :title="state.fileInfo.name"
        v-model="state.otherShow">
        <div class="max-upload-img-width">
            <img v-if="state.fileInfo.type == 'image'" :src="state.fileInfo.url" alt="" class="max-upload-img-width">
            <template v-else-if="state.fileInfo.type == 'pdf'">
                <iframe :src="'/web/viewer.html?file=' + state.fileInfo.url"
                    style="width: 100%; height: 650px"
                ></iframe>
            </template>
            <div v-else>{{state.fileInfo.type}} {{$t('notSupportPreview')}}</div>
        </div>
        <!-- <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="state.otherShow = false">确定</el-button>
            <el-button @click="state.otherShow = false">取消</el-button>
        </span>
        </template> -->
    </el-dialog>
</template>

<script setup lang="ts" name="FilePreview">
const emits = defineEmits(['close'])
// const props = withDefaults(defineProps<{
//     type: string, // image/pdf/... 目前只支持图片和pdf预览
//     url: string,
//     name: string,
//     urlList?: string[],
// }>(), {
//     url: '',
//     name: '',
//     type: 'image',
//     urlList: () => []
// })

const state = reactive<Record<string, any>>({
    imgIndex: 0,
    imgShow: false,
    otherShow: false,
    fileInfo: {
        url: '',
        name: '',
        index: 0,
        type: 'image',
        urlList: []
    }
})

const openViewer = (item: filePreviewType) => {
    state.fileInfo = item
    if (state.fileInfo.type == 'image') {
        state.imgShow = true
        state.imgIndex = state.fileInfo.index || 0
    } else {
        state.otherShow = true
    }
}

const closeViewer = () => {
    state.imgShow = false
    // console.log('close--img')
    emits('close')
}

const closeHandle = () => {
    // console.log('close--other')
    emits('close')
}

defineExpose({ openViewer })
</script>

<style lang="scss" scoped>
</style>