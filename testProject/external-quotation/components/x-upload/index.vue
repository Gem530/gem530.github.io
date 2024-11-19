<template>
    <div class="x-upload">
        <!-- <el-button @click="downLoadHandle">测试下载</el-button> -->
        <el-upload :disabled="props.readOnly" :list-type="props.model == 'preview' ? 'picture-card' : 'text'" :="attrs" action="#"
            v-model:file-list="fileList" :before-upload="beforeUpload" :http-request="httpRequest"
            @preview="handlePictureCardPreview" @remove="handleRemove"
            :class="{
                'readOnly': props.readOnly,
                'hide-delete': props.isHideDelete,
                'hide-preview': props.isHidePreview,
                'hide': attrs?.limit && props.limitHide ? fileList.length >= attrs?.limit : false
            }">
            <template v-if="attrs?.limit && props.limitHide ? (!props.readOnly && (fileList.length < attrs?.limit)) : !props.readOnly">
            <!-- <template v-if="!props.readOnly"> -->
                <el-button v-if="['download'].includes(props.model)" type="primary" size="small">{{$t('uploadFiles')}}</el-button>
                <el-icon v-else><Plus /></el-icon>
            </template>
            <!-- <template #file="{ file }" v-if="!slots.file">
                <img :src="file.url" alt="" v-if="file?.raw?.type.includes('image/')">
                <span v-else>{{ file.name }}</span>
                <div :class="{'preview-mask':true, 'show':previewMask&&file.url}" @mouseenter="previewMask = true" @mouseleave="previewMask = false">
                    <el-icon v-if="previewMask" @click="handlePictureCardPreview(file)"><ZoomIn /></el-icon>
                    <el-icon v-if="previewMask" @click="handleRemove(file)"><Delete /></el-icon>
                </div>
            </template> -->
            <template
                :key="i"
                v-slot:[key]="item"
                v-for="(item, key, i) in slots"
            >
                <slot :name="key" v-bind="item" v-if="key == 'tip' && attrs?.limit ? (!props.readOnly && (fileList.length < attrs?.limit)) : !props.readOnly"/>
            </template>
        </el-upload>

        <!-- element-plus 文件预览组件 -->
        <!-- <el-image-viewer v-if="imgView.showView" :initial-index="imgView.index" :url-list="(fileList.map(v => v.url) as string[])"
            @close="closeViewer"></el-image-viewer> -->

        <!-- 查看文件 -->
        <!-- <Teleport to=".app-main"> -->
        <!-- <el-dialog
            top="40px"
            width="882px"
            :title="localName"
            v-model="diaVisable">
            <div class="max-upload-img-width">
                <img v-if="localType == 'image'" :src="localFile" alt="" class="max-upload-img-width">
                <template v-else-if="localType == 'pdf'">
                    <iframe :src="'/web/viewer.html?file=' + localFile"
                        style="width: 100%; height: 650px"
                    ></iframe>
                </template>
                <div v-else>{{localType}} 文件暂不支持预览</div>
            </div>
            <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="diaVisable = false">确定</el-button>
                <el-button @click="diaVisable = false">取消</el-button>
            </span>
            </template>
        </el-dialog> -->
        <!-- </Teleport> -->
        <FilePreview ref="filePreviewRef"></FilePreview>
    </div>
</template>
  
<script lang="ts" setup name="x-upload">
const { t } = useI18n()
const { $loadingStart, $loadingEnd } = useNuxtApp()

const filePreviewRef = ref()
const slots = useSlots()
const attrs: any = useAttrs()
const emits = defineEmits(['update:modelValue', 'fileChange', 'delFile'])
const props = withDefaults(defineProps<{
    model?: string
    isWhite?: boolean
    fileSize?: number
    needType?: boolean
    readOnly?: boolean
    limitHide?: boolean
    fileType?: string[]
    modelValue?: any[]
    isHideDelete?: boolean
    isHidePreview?: boolean
}>(), {
    model: 'preview', // preview:预览  download:下载
    isWhite: false,
    needType: true,
    readOnly: false, // false:展示上传按钮 true:隐藏上传按钮
    limitHide: true,
    modelValue: () => [],
    isHideDelete: false,
    isHidePreview: false,
})

const actionUrl = ref<string>('')
const actionData = ref<any>()

const fileList = ref<any[]>([])
const resFileList = ref<any[]>([])
// const resultList = ref<valueList[]>([])
// const headers = ref({ Authorization: getLocalItem('token') })
const localType = ref('image') // image:图片 pdf:pdf txt...:其他文件
const localName = ref('')
const localFile = ref('')
const diaVisable = ref(false)
const imgView = reactive({
    index: 0,
    showView: false
})

// const previewMask = ref(false)

watch(() => props.modelValue, (v, oldV) => {
    let temp = v || []
    // if (temp.length && !oldV?.length) {
    //     let tempList = []
    //     temp.forEach((key: string|valueList, uid: number) => {
    //         const val = key as valueList
    //         const item = { id: val?.id, uid, key: val.key, name: val.name, size: val.size, url: val.url }
    //         tempList.push(item)
    //     })
    //     fileList.value = tempList
    // } else if (!temp.length && oldV?.length) {
    //     fileList.value = []
    // } else {
    // }
    fileList.value = temp
    // console.log(props.title, temp, fileList.value)
}, { deep: true, immediate: true })

const dealData = () => {
    const resultList = resFileList.value.map(v => {
        let name = (v.raw ? v.raw.name : v.name).replace(/,/g, '')
        const temp: any = {
            id: v?.id,
            url: v.url || '',
            key: v.raw ? v.raw.key : v.key,
            name,
            size: v.raw ? (Number(v.raw.size) / 1024) * 100 / 100 : v.size,
        }
        if (props.needType) {
            temp.type = getExt(temp.name).substring(1)
        }
        // temp.size = temp?.size ? ((Number(temp.size) / 1024) * 100 / 100) : temp?.size
        return temp
    })
    return resultList
}

watch(() => resFileList.value, (newVal: any) => {
    emits('update:modelValue', dealData())
}, { deep: true })

// 不加这个方法，本地上传文件会报404错误
const httpRequest = (options: any): any => {
    if (!actionUrl.value && !actionData.value) return

    // 修改预览图的名称
    let name = options.file.name.replace(/,/g, '')
    fileList.value.map(v => {
        v.key = v.raw?.key || v.key
        v.status = 'success'
        if (v.key == options.file.key) {
            v.name = name
        }
    })
    
    // 参数添加到FormData数据中
    let formData = new FormData();
    for (let key in actionData.value) {
        if (actionData.value[key] != undefined) {
            formData.append(key, actionData.value[key]);
        }
    }
    // uploadPost(actionUrl.value, formData)
    $http(actionUrl.value, {
        method: 'post',
        isHttp: true,
        // loading: true,
        body: formData
    }).then(() => {
        resFileList.value = fileList.value
        emits('fileChange', dealData())
        $loadingEnd()
        ElMessage.success(t('fileUploadSuccessful'))
    }).catch(() => {
        // 删除 上传失败 的预览图
        fileList.value = fileList.value.filter(v => v.raw?.key != options.file.key)
        resFileList.value = fileList.value
        emits('fileChange', dealData())
        // console.log('文件上传失败--', fileList.value, options.file)
        // loadingBox.close()
        $loadingEnd()
        ElMessage.error(t('fileUploadFailed'))
    })
}

// 上传前
const beforeUpload = (file: any): any => {
    return new Promise((resolve, reject) => {
        try {
            if (props.fileSize) {
                const isLt = file.size / 1024 / 1024 < props.fileSize;
                if (!isLt) {
                    ElMessage.error(t('sizeOfTheUploaded', { size: props.fileSize }))
                    resolve(false)
                    return
                }
            }
            if (props.fileType) {
                const imgType = file.name.slice(file.name.lastIndexOf(".") + 1)
                const isImg = props.fileType.includes(imgType.toLocaleLowerCase())
                if (!isImg) {
                    ElMessage.error(t('fileFormatIsIncorrect', { type: props.fileType.join("/") }))
                    resolve(false)
                    return
                }
            }
            $loadingStart({ text: t('fileUploadInProgress')+'...', background: 'rgba(0, 0, 0, 0.7)' })
            // loadingBox = ElLoading.service({ text: '文件上传中...', background: 'rgba(0, 0, 0, 0.7)' });
            const fileName = file.name.replace(/,/g, '')

            // 获取上传地址以及参数
            // getUploadUrl(fileName)
            $http(`/resource/oss/${props.isWhite ? 'getSignedUrlIgnore' : 'getSignedUrl'}`, {
                method: 'get',
                // loading: true,
                query: { fileName }
            }).then((res: any) => {
                const data = deepClone(res.data)
                actionUrl.value = data.urlStr

                data.urlStr = undefined
                data.file = file
                actionData.value = data

                file.key = data.key

                resolve(true)
            }).catch((err: any) => {
                // loadingBox.close()
                $loadingEnd()
                reject(false)
            })
        } catch(err) {
            reject(false)
        }
    })
}

// 删除文件
const handleRemove = (file: any) => {
    fileList.value = fileList.value.filter(v => v.uid != file.uid)
    resFileList.value = fileList.value
    if (props.needType) {
        file.type = getExt(file.name).substring(1)
    }
    emits('delFile', file, dealData())
}

// 文件下载
const downLoadHandle = (key: string) => {
    // downloadUrl(key)
    downloadFile(key)
    // $http('/resource/oss/getUrlByKeys', {
    //     method: 'get',
    //     loading: true,
    //     query: { keys: key }
    // }).then((res: any) => {
    //     const { data } = res
    //     window.open(data[key])
    // })
}

// 文件预览方法
const handlePictureCardPreview = (file: any) => {
    // 文件模式，下载
    if (props.model == 'download') {
        if (file.url) {
            try {
                window.open(file.url)
            } catch (err) {
                downLoadHandle(file.key)
            }
        } else {
            downLoadHandle(file.key)
        }
        return
    }

    // 图片模式，预览
    localName.value = file.name
    if (isImage(getExt(file.name))) {
        localType.value = 'image'
        localFile.value = file.url as string
    } else if (getExt(file.name) == '.pdf') {
        localType.value = 'pdf'
        localFile.value = encodeURIComponent(file.url + '#' + file.name)
    } else {
        localType.value = matchFileType(getExt(file.name))
    }
    // diaVisable.value = true
    filePreviewRef.value.openViewer({
        url: localFile.value,
        name: localName.value,
        index: 0,
        type: localType.value,
        urlList: [localFile.value]
    })
}
// const closeViewer = () => {
//     imgView.showView = false
// }

// const closeHandle = () => {
//     console.log('关闭预览回调')
// }
</script>
  
<style lang="scss" scoped>
.x-upload {
    // .el-upload--picture-card 控制加号部分
    :deep(.hide .el-upload--picture-card),
    :deep(.hide-preview .el-upload-list__item-preview),
    :deep(.hide-delete .el-upload-list__item-delete) {
        display: none !important;
    }

    :deep(.hide .el-upload-list),
    :deep(.readOnly .el-upload-list) {
        margin-top: 0 !important;
    }
    :deep(.hide .el-upload),
    :deep(.readOnly .el-upload) {
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

    :deep(.el-upload-list--picture-card .el-upload--picture-card),
    :deep(.el-upload-list--picture-card .el-upload-list__item) {
        width: 90px !important;
        height: 90px !important;
    }

    .preview-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: var(--el-overlay-color-lighter);
        transition: opacity var(--el-transition-duration);
        z-index: 1;

        .el-icon {
            margin: 0 2px;
        }

        &.show {
            opacity: 1;
        }
    }
}
.max-upload-img-width {
    width: 100%;
    text-align: center;
}
</style>
<style>
.el-upload-list__item .el-icon--close-tip {
    display: none !important;
}
</style>