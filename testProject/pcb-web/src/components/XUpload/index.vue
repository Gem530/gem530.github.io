<template>
    <div class="x-upload">
        <!-- <el-button @click="downLoadHandle">测试下载</el-button> -->
        <el-upload :disabled="props.readOnly" :="attrs" :list-type="props.model == 'preview' ? 'picture-card' : 'text'" action="#"
            v-model:file-list="fileList" :before-upload="beforeUpload" :http-request="httpRequest"
            @preview="handlePictureCardPreview" @remove="handleRemove" @change="changeFile"
            :class="{
                'readOnly': props.readOnly,
                'hide-delete': props.isHideDelete,
                'hide-preview': props.isHidePreview,
                'hide': attrs?.limit ? fileList.length >= attrs?.limit : false
            }">
            <template v-if="!props.readOnly">
                <el-button v-if="['download'].includes(props.model)" type="primary" size="small">上传文件</el-button>
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
                <slot :name="key" v-bind="item" />
            </template>
        </el-upload>

        <!-- element-plus 文件预览组件 -->
        <el-image-viewer v-if="imgView.showView" :initial-index="imgView.index" :url-list="(fileList.map(v => v.url) as string[])"
            @close="closeViewer"></el-image-viewer>

        <!-- 查看文件 -->
        <Teleport to=".app-main">
            <el-dialog
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
                <!-- <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="diaVisable = false">确定</el-button>
                    <el-button @click="diaVisable = false">取消</el-button>
                </span>
                </template> -->
            </el-dialog>
        </Teleport>
    </div>
</template>

<script lang="ts" setup name="x-upload">
import dayjs from 'dayjs'
import fileSaver from "file-saver";
import { getSystemTime, getUploadUrl, uploadPost, downloadUrl } from '@/api/upload/index'
import { type UploadFile, ElMessage, type UploadRawFile, UploadUserFile, UploadRequestOptions, ElLoading } from 'element-plus'
import {
    ref,
    watch,
    useAttrs,
    reactive,
    useSlots,
    defineEmits,
    defineProps,
    withDefaults,
    getCurrentInstance,
    type ComponentInternalInstance,
} from 'vue'
interface response {
    msg: string,
    code: number
}
interface attrsType {
    limit?: number
    [key: string]: any
}
interface valueList {
    key: string
    url: string
    name: string
    size: number
    type?: string
}
interface uploadKey extends UploadFile {
    key: string
    url?: string
}
type UploadFiles = Partial<uploadKey>[]
interface upload extends UploadFile {
    response: response
}

interface beforeUploadRawFile extends UploadRawFile {
    key: string
}

let loadingBox: any = undefined;

const slots = useSlots()
const attrs: attrsType = useAttrs()
const emits = defineEmits(['update:modelValue', 'fileChange', 'delFile'])
const props = withDefaults(defineProps<{
    model?: string
    fileSize?: number
    needType?: boolean
    readOnly?: boolean
    modelValue?: any[]
    fileType?: string[]
    isWaterMark?: boolean
    isHideDelete?: boolean
    isHidePreview?: boolean
}>(), {
    model: 'preview', // preview:预览  download:下载
    needType: true,
    readOnly: false, // false:展示上传按钮 true:隐藏上传按钮
    modelValue: () => [],
    isWaterMark: false,
    isHideDelete: false,
    isHidePreview: false,
})

const geolocat = ref<any>()
const addressTxt = ref<any>('')
const actionUrl = ref<string>('')
const actionData = ref<any>()

const fileList = ref<UploadFiles>([])
const resFileList = ref<UploadFiles>([])
// const resultList = ref<valueList[]>([])
const { proxy } = getCurrentInstance() as ComponentInternalInstance as any
// const headers = ref({ Authorization: getLocalItem('token') })
const localType = ref('image') // image:图片 pdf:pdf txt...:其他文件
const localName = ref('')
const localFile = ref('')
const diaVisable = ref(false)
const imgView = reactive({
    index: 5,
    showView: false
})

// const previewMask = ref(false)

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
        const temp = {
            id: v?.id,
            url: v.url || '',
            key: v.raw ? (v.raw?.key || v.key) : v.key,
            name,
            size: v.raw ? (Number(v.raw.size) / 1024) * 100 / 100 : v.size,
            tempImgUrls: undefined,
        }
        v.tempImgUrls = undefined
        if (props.needType) {
            temp.type = getExt(temp.name).substring(1)
        }
        // temp.size = temp?.size ? ((Number(temp.size) / 1024) * 100 / 100) : temp?.size
        return temp
    })
    return resultList
}

watch(() => resFileList.value, (newVal: UploadFiles) => {
    emits('update:modelValue', dealData())
}, { deep: true })

// 不加这个方法，本地上传文件会报404错误
const httpRequest = (options: UploadRequestOptions) => {
    if (!actionUrl.value && !actionData.value) return

    // 修改预览图的名称
    let name = options.file.name.replace(/,/g, '')
    fileList.value.map(v => {
        v.key = v.raw?.key || v.key || options.file.key
        v.status = 'success'
        if (v.key == options.file.key) {
            v.name = name
            if (props.isWaterMark) {
                v.url = actionData.value.tempImgUrls
            }
        }
    })

    // 参数添加到FormData数据中
    let formData = new FormData();
    for (let key in actionData.value) {
        if (actionData.value[key] != undefined && key != 'tempImgUrls') {
            formData.append(key, actionData.value[key]);
        }
    }
    uploadPost(actionUrl.value, formData).then(() => {
        resFileList.value = fileList.value
        setTimeout(()=>{
          emits('fileChange', dealData())
        },20)
        loadingBox.close()
        ElMessage.success(`文件上传成功`)
    }).catch(() => {
        // 删除 上传失败 的预览图
        fileList.value = fileList.value.filter(v => v.raw?.key != options.file.key)
        resFileList.value = fileList.value
        setTimeout(()=>{
          emits('fileChange', dealData())
        },20)
        // console.log('文件上传失败--', fileList.value, options.file)
        loadingBox.close()
        ElMessage.error(`文件上传失败`)
    })
}

// 文件上传时更新fileList，因为使用v-modal:file-list时更新不及时，导致在使用多选时出现只返回一个文件
const changeFile = (file, fileLists) => {
    fileList.value = fileLists
}

// 加水印
const createWatermark = (value: any, src: any) => {
  return new Promise(async (resolve, reject) => {
    const res = await getSystemTime()
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);

            // ctx?.beginPath()
            ctx.font = '16px Arial';
            ctx.fillStyle = '#fff';
            ctx.globalAlpha = 0.8;
            ctx?.fillText(value, canvas.width - ctx.measureText(value).width - 10, canvas.height - 10);
            // ctx?.closePath()

            // ctx?.beginPath()
            ctx.font = '16px Arial';
            ctx.fillStyle = '#fff';
            ctx.globalAlpha = 0.8;
            let time = (res?.code == 200 ? res?.msg : '') || dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
            ctx?.fillText(time, canvas.width - ctx.measureText(time).width - 10, canvas.height - 10 - 20);
            // ctx?.closePath()

            const watermarkSrc = canvas.toDataURL('image/png');
            resolve(watermarkSrc)
        };

        img.src = src;
    } catch(err) {
        console.log('绘制水印失败:', err)
        // proxy?.$modal.msgError('绘制水印失败')
        reject(err)
    }
  })
}
// base64 转 file 对象
const base64ToFile = (base64, fileName) => {
    try {
        let arr = base64.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, { type: mime });
    } catch(err) {
        console.log('base64转file失败：', err)
    }
}
// 获取地址
const getAddress = () => {
    return new Promise((resolve, reject) => {
        console.log(geolocat.value)
        console.time('test')
        geolocat.value.getCurrentPosition((r) => {
            console.timeEnd('test')
            console.log(r)
            if (r?.address) {
                let str = (r?.address?.country || "") + (r?.address?.province || "") + (r?.address?.city || "") + (r?.address?.district || "") + (r?.address?.street || "")
                resolve(str)
            } else {
                reject(false)
            }
        }, (err) => reject(err))
    })
}

// 上传前
const beforeUpload = (file: beforeUploadRawFile) => {
    console.log(JSON.parse(JSON.stringify(file)))
    return new Promise((resolve, reject) => {
        try {
            if (props.fileSize) {
                const isLt = file.size / 1024 / 1024 < props.fileSize;
                if (!isLt) {
                    ElMessage.error(`上传文件大小不能超过 ${props.fileSize} MB!`)
                    resolve(false)
                    return
                }
            }
            if (props.fileType) {
                const imgType = file.name.slice(file.name.lastIndexOf(".") + 1)
                const isImg = props.fileType.includes(imgType)
                if (!isImg) {
                    ElMessage.error(`文件格式不正确, 请上传${props.fileType.join("/")}文件格式文件!`)
                    resolve(false)
                    return
                }
            }
            loadingBox = ElLoading.service({ text: '文件上传中...', background: 'rgba(0, 0, 0, 0.7)' });
            const fileName = file.name.replace(/,/g, '')

            // 获取上传地址以及参数
            getUploadUrl(fileName).then(async (res) => {
                const data = JSON.parse(JSON.stringify(res.data))
                actionUrl.value = data.urlStr

                data.urlStr = undefined
                if (props?.isWaterMark && file.type.includes('image/')) {
                    if (!addressTxt.value) {
                        addressTxt.value = await getAddress()
                    }
                    const imgUrls = await createWatermark(addressTxt.value, URL.createObjectURL(file))
                    // console.log('----', imgUrls)
                    // file = base64ToFile(imgUrls, fileName)
                    data.tempImgUrls = imgUrls
                    data.file = base64ToFile(imgUrls, fileName)
                } else {
                    data.file = file
                }
                actionData.value = data
                // console.log('123123123', JSON.parse(JSON.stringify(file)), actionData.value)

                file.key = data.key

                resolve(true)
            }).catch((err) => {
                loadingBox.close()
                reject(false)
            })
        } catch(err) {
            loadingBox.close()
            reject(false)
        } finally {

        }
    })
}

// 删除文件
const handleRemove = (file: UploadFile) => {
    fileList.value = fileList.value.filter(v => v.uid != file.uid)
    resFileList.value = fileList.value
    if (props.needType) {
        file.type = getExt(file.name).substring(1)
    }
    emits('delFile', file, dealData())
}

const downloadFile = (url: string, name: string) => {
    const callback = (data) => {
        var a = document.createElement('a');
        const objectUrl = window.URL.createObjectURL(new Blob([data]));
        // 获取文件名fileName
        a.download = name || url;
        a.href = objectUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(objectUrl);
    }
    // 把接口返回的url地址转换为 blob
    const xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
        // 返回文件流，进行下载处理
        callback(xhr.response)
    }
    xhr.send();
}

// 文件下载
const downLoadHandle = (key: string) => {
    loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
    downloadUrl(key).then(res => {
        loadingBox.close()
        if (res.code == 200) {
            const { data } = res
            // window.open(data[key])
            fileSaver.saveAs(data[key])
            // downloadFile(data[key])
        }
    }).catch((err) => {
        loadingBox.close()
    })
}

// 文件预览方法
const handlePictureCardPreview = (file: uploadKey) => {
    // 文件模式，下载
    if (props.model == 'download') {
        if (file.url) {
            try {
                // window.open(file.url)
                fileSaver.saveAs(file.url)
                // downloadFile(file.url, file.name)
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

onMounted(async () => {
    if (props.isWaterMark) {
        geolocat.value = new BMapGL.Geolocation();
        addressTxt.value = await getAddress()
        console.log('add', addressTxt.value)
    }
})
</script>

<style lang="scss" scoped>
.x-upload {
    width: 100%;
    // .el-upload--picture-card 控制加号部分
    :deep(.hide .el-upload--picture-card),
    :deep(.hide-preview .el-upload-list__item-preview),
    :deep(.hide-delete .el-upload-list__item-delete) {
        display: none !important;
    }

    :deep(.readOnly .el-upload-list) {
        margin-top: 0 !important;
    }
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
