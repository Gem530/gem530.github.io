<template>
    <div>
        <!-- <van-popup
            closeable
            @close="closeHandle"
            v-model:show="state.otherShow">
            <div class="max-upload-img-width">
                <template v-if="state.fileInfo.type == 'pdf'">
                    <iframe :src="'/web/viewer.html?file=' + state.fileInfo.url"
                        style="width: 100%; height: 650px"
                    ></iframe>
                </template>
            </div>
        </van-popup> -->
    </div>
</template>

<script setup lang="ts" name="FilePreview">
const { t } = useI18n()
const emits = defineEmits(['close'])

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
        // state.imgShow = true
        // state.imgIndex = state.fileInfo.index || 0
        showImagePreview({
            images: state.fileInfo.urlList,
            startPosition: state.fileInfo.index,
        })
    } 
    // else if (state.fileInfo.type == 'pdf') {
    //     state.otherShow = true
    // } 
    else {
        // state.otherShow = true
        showToast(`${state.fileInfo.type} ${t('notSupportPreview')}`)
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